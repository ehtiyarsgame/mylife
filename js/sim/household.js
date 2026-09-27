// Hane ekonomisi: ailenin kasası, geliri, gideri ve stresi.
// Aile zor durumdaysa çocuk da çalışıp destek olmalı; olmazsa sorunlar kademe kademe açılır.
import { clamp } from '../core/util.js';

// Aylık, 2026 TL
export const HOME = {
  fakir:    { inc: 26000,  exp: 21000,  perKid: 3000,  cash: 6000,     name: 'Fakir' },
  orta:     { inc: 64000,  exp: 48000,  perKid: 6500,  cash: 70000,    name: 'Orta' },
  varlikli: { inc: 170000, exp: 118000, perKid: 13000, cash: 700000,   name: 'Varlıklı' },
  zengin:   { inc: 700000, exp: 390000, perKid: 32000, cash: 9000000,  name: 'Zengin' },
};
const ORDER = ['fakir', 'orta', 'varlikli', 'zengin'];

// Stres eşikleri ve açılan sonuç kartları (data/events.json içinde chainOnly)
export const STRESS_STEPS = [
  { at: 30, card: 'aile_fatura',  label: 'Faturalar gecikiyor' },
  { at: 50, card: 'aile_kira',    label: 'Kira ödenemiyor, ev elden gidebilir' },
  { at: 70, card: 'aile_icra',    label: 'İcra kapıda, kardeşin okulu bırakabilir' },
  { at: 88, card: 'aile_dagilma', label: 'Aile dağılma noktasında' },
];

export function initHome(wealth, siblings, rng) {
  return {
    cash: HOME[wealth].cash * rng.float(0.6, 1.4),
    incPct: 1, expPct: 1,
    crises: [],            // {name, years, inc, cost}
    stress: wealth === 'fakir' ? 20 : 5,
    steps: [],             // bu kriz döneminde açılan eşikler
    helpYear: 0, helpTotal: 0,
    lastNet: 0, need: 0,
    retired: false,
  };
}

// Karakter hâlâ ailesiyle mi yaşıyor?
export const livingHome = s => s.age < 18 || (s.age < 26 && !s.rel.married && !s.career.job && !s.career.biz);

function parentsRetired(s) {
  const ages = s.family.parents.filter(p => p.alive).map(p => p.age);
  return ages.length === 0 || Math.min(...ages) >= 62;
}

// Yıllık hane bütçesi tahmini (fiyat endeksiyle)
export function homeBudget(s) {
  const H = HOME[s.family.wealth];
  const h = s.home;
  const pi = s.priceIndex;
  const alive = s.family.parents.filter(p => p.alive).length;
  let inc = H.inc * h.incPct * (alive === 2 ? 1 : alive === 1 ? 0.62 : 0);
  if (alive === 1 && s.age < 18) inc += H.inc * 0.22;              // yetim aylığı
  const relatives = alive === 0 && s.age < 18;                      // akrabaların yanında
  if (relatives) inc = H.inc * 0.6;
  if (parentsRetired(s)) inc *= 0.55;               // emekli aylığı
  const kids = s.family.siblings + (livingHome(s) ? 1 : 0);
  let exp = (H.exp * (alive || relatives ? 1 : 0) + H.perKid * kids) * h.expPct;
  if (!alive && !relatives) exp = 0;
  // Sosyal yardım / çocuk parası: fakir ve kalabalık ailelere
  if (s.family.wealth === 'fakir' && alive) inc += Math.max(0, kids - 1) * 2500;
  const crisisInc = h.crises.reduce((m, c) => m * (c.inc ?? 1), 1);
  const crisisCost = h.crises.reduce((a, c) => a + (c.cost || 0), 0);
  inc *= crisisInc;
  exp += crisisCost;
  return { inc: inc * 12 * pi, exp: exp * 12 * pi, net: (inc - exp) * 12 * pi, crisisInc, crisisCost: crisisCost * 12 * pi };
}

// Ailenin önümüzdeki yıl için senden beklediği destek
export function homeNeed(s) {
  const b = homeBudget(s);
  return Math.max(0, -(s.home.cash + b.net));
}

export function giveToFamily(s, amount) {
  amount = Math.max(0, Math.min(amount, s.money));
  s.money -= amount;
  s.home.cash += amount;
  s.home.helpYear += amount;
  s.home.helpTotal += amount;
  return amount;
}

// Yıl sonu hane hesabı. Olay zincirleri için açılan kartları döndürür.
export function homeYear(s, rng, familyPaid = 0) {
  const h = s.home;
  const out = { notes: [], cards: [], net: 0 };
  if (!s.family.parents.some(p => p.alive) && s.age >= 18) { h.stress = 0; return out; }
  const b = homeBudget(s);
  const noise = rng.float(0.92, 1.08);
  const net = b.inc * noise - b.exp - familyPaid;
  h.cash += net;
  h.lastNet = net;
  out.net = net;
  const monthly = Math.max(1, b.exp / 12);
  const help = h.helpYear;
  // Kemer sıkma: açık veren aile giderini kısar, rahatlayınca yavaşça eski düzene döner
  if (net < 0) h.expPct = Math.max(0.78, h.expPct * 0.95);
  else if (h.cash > monthly * 3) h.expPct = Math.min(1.1, h.expPct * 1.02);
  // Borç faizi; bankalar en fazla ~12 aylık gider kadar borç verir
  if (h.cash < 0) h.cash = Math.max(h.cash * 1.12, -monthly * 12);
  // Stres, ailenin durumunun belirlediği hedefe doğru ilerler
  const before = h.stress;
  const debtMonths = Math.max(0, -h.cash / monthly);
  let target = h.cash >= 0 ? (net >= 0 ? 4 : 14) : 18 + debtMonths * 7;
  target += h.crises.length * 8;
  if (s.age < 8) target *= 0.7; // küçük çocuk varken akrabalar el uzatır
  target -= Math.min(25, help / monthly * 4);
  target = clamp(target, 0, 100);
  h.stress = clamp(h.stress + (target - h.stress) * 0.55, 0, 100);
  out.stressDelta = h.stress - before;
  // Krizlerin süresi
  for (const c of h.crises) c.years--;
  const ended = h.crises.filter(c => c.years <= 0);
  for (const c of ended) out.notes.push(`🌤️ Ailende "${c.name}" dönemi geride kaldı.`);
  h.crises = h.crises.filter(c => c.years > 0);
  // Stres eşikleri → kademeli sonuçlar
  if (h.stress < 15) h.steps = [];
  for (const st of STRESS_STEPS) {
    if (h.stress >= st.at && !h.steps.includes(st.at)) {
      h.steps.push(st.at);
      out.cards.push(st.card);
      break; // her yıl en fazla bir kademe açılır
    }
  }
  // Sınıf değişimi (nadir)
  const idx = ORDER.indexOf(s.family.wealth);
  const H = HOME[s.family.wealth];
  if (idx < 3 && h.cash > H.inc * 12 * s.priceIndex * 4 && h.stress < 20) {
    s.family.wealth = ORDER[idx + 1];
    out.notes.push(`📈 Ailenin durumu iyileşti: artık ${HOME[s.family.wealth].name.toLowerCase()} bir ailesiniz.`);
    out.classUp = true;
  } else if (idx > 0 && h.cash < -H.exp * 12 * s.priceIndex * 1.5 && h.stress >= 70) {
    s.family.wealth = ORDER[idx - 1];
    h.cash = -HOME[s.family.wealth].exp * 12 * s.priceIndex * 0.5;
    out.notes.push(`📉 Ailen zor günlerden geçiyor: artık ${HOME[s.family.wealth].name.toLowerCase()} bir ailesiniz.`);
    out.classDown = true;
  }
  h.helpYear = 0;
  h.need = homeNeed(s);
  return out;
}

export function stressLabel(v) {
  if (v >= 88) return { t: 'Dağılma noktası', c: '#ff3b5c', e: '🆘' };
  if (v >= 70) return { t: 'Kriz', c: '#ff5b7a', e: '🔥' };
  if (v >= 50) return { t: 'Çok sıkışık', c: '#ff8a5b', e: '😰' };
  if (v >= 30) return { t: 'Sıkışık', c: '#ffb547', e: '😟' };
  if (v >= 12) return { t: 'İdare ediyor', c: '#7c9cff', e: '🙂' };
  return { t: 'Rahat', c: '#3ddc97', e: '😌' };
}

export function nextStep(s) {
  return STRESS_STEPS.find(st => !s.home.steps.includes(st.at));
}
