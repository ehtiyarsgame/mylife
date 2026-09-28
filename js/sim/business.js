// Ticaret yolu ekonomik modeli (Tasarım Dokümanı §9).
export const BIZ_STEPS = [
  { name: 'Okulda satış',       icon: '🍪', age: 12, capital: 0,          monthly: 250,     rep: 0,  prevYears: 0, risk: 0.05, mgs: ['paraustu', 'pazarlik', 'para_say'] },
  { name: 'Pazar tezgâhı',      icon: '🧺', age: 15, capital: 15000,      monthly: 22000,   rep: 0,  prevYears: 2, risk: 0.10, mgs: ['pazarlik', 'fiyat', 'paraustu', 'terazi', 'musteri_sikayeti'] },
  { name: 'Dükkân',             icon: '🏪', age: 20, capital: 250000,     monthly: 55000,   rep: 30, prevYears: 3, risk: 0.12, mgs: ['fiyat', 'stok', 'pazarlik', 'stok_sayimi', 'sahte_para'] },
  { name: 'E-ticaret mağazası', icon: '📦', age: 23, capital: 400000,     monthly: 120000,  rep: 40, prevYears: 2, risk: 0.15, mgs: ['urunsayfa', 'stok', 'fiyat', 'kargo_istif', 'musteri_sikayeti'] },
  { name: 'Toptancılık',        icon: '🚛', age: 27, capital: 2500000,    monthly: 200000,  rep: 60, prevYears: 3, risk: 0.15, mgs: ['pazarlik', 'stok', 'rota', 'kargo_istif', 'yuzde_hesap'] },
  { name: 'Kendi markası',      icon: '🏷️', age: 31, capital: 12000000,   monthly: 450000,  rep: 75, prevYears: 4, risk: 0.18, mgs: ['urunsayfa', 'fiyat', 'konusma', 'basin_toplantisi', 'kriz_yonetimi'] },
  { name: 'İhracat',            icon: '🌍', age: 36, capital: 60000000,   monthly: 1500000, rep: 90, prevYears: 5, risk: 0.20, mgs: ['pazarlik', 'stok', 'konusma', 'yuzde_hesap', 'kriz_yonetimi'] },
];

// Bir sonraki basamağa geçiş koşulları; eksikleri liste olarak döner.
export function nextStepReqs(state) {
  const b = state.career.biz;
  const cur = b ? b.step : -1;
  const next = BIZ_STEPS[cur + 1];
  if (!next) return null;
  const pi = state.priceIndex;
  const need = next.capital * 1.2 * pi;
  const miss = [];
  if (state.age < next.age) miss.push(`En erken ${next.age} yaş`);
  if (state.money + (state.age >= 18 ? state.savings : 0) < need) miss.push(`Nakit: ${Math.round(need).toLocaleString('tr-TR')} TL (sermaye ×1,2)`);
  if (state.stats.itibar < next.rep) miss.push(`İtibar ${next.rep}+`);
  if (b && b.years < next.prevYears) miss.push(`Önceki basamakta ${next.prevYears} yıl (şu an ${b.years})`);
  return { step: cur + 1, info: next, need, miss };
}

export function advanceBiz(state) {
  const r = nextStepReqs(state);
  if (!r || r.miss.length) return false;
  state.money -= r.info.capital * state.priceIndex;
  if (state.money < 0) { state.savings += state.money; state.money = 0; } // eksik kısım birikimden
  // Dükkândan itibaren işletme tam zamanlı iştir
  if (r.step >= 2 && state.career.job) {
    state.career.jobsHad.push(state.career.job.id);
    state.career.job = null;
  }
  state.career.biz = { step: r.step, years: 0, skillSum: 0, skillN: 0, bankrupt: state.career.biz?.bankrupt || 0 };
  return true;
}

// Ticarette gerçek hayat: piyasa dalgalanır, bazı yıllar ürün "tutar" ve para yağar,
// bazı yıllar bir anda her şey çöker. Beceri, itibar ve sigorta bu olasılıkları değiştirir.
export const BOOMS = [
  { t: 'Ürünün sosyal medyada patladı; siparişe yetişemedin!', min: 2.2, max: 5 },
  { t: 'Büyük bir zincir market/mağaza seninle yıllık anlaşma imzaladı.', min: 2, max: 3.5 },
  { t: 'En büyük rakibin kapandı; müşterileri sana geldi.', min: 1.8, max: 3 },
  { t: 'Mevsim tuttu: stokladığın ürün tam zamanında kapış kapış satıldı.', min: 1.8, max: 3.2, maxStep: 3 },
  { t: 'Yurt dışından beklenmedik bir toplu sipariş geldi.', min: 2.5, max: 5, minStep: 3 },
  { t: 'Ünlü biri ürününü kullanırken paylaştı; markan bir gecede tanındı.', min: 2.5, max: 6, minStep: 3 },
];
export const CRASHES = [
  { t: 'Ortağın kasayı boşaltıp ortadan kayboldu.', loss: [1.2, 2.2], minStep: 1 },
  { t: 'Depoda yangın çıktı; stokların kül oldu.', loss: [1, 2.4], insured: true, minStep: 1 },
  { t: 'Kur bir gecede fırladı; ithal ettiğin mallar zarar ettirdi.', loss: [0.9, 1.8], minStep: 2 },
  { t: 'En büyük müşterin battı; alacaklarını tahsil edemedin.', loss: [1, 2], minStep: 2 },
  { t: 'Vergi incelemesinde eksik evrak çıktı; ağır ceza kesildi.', loss: [0.7, 1.4], minStep: 2 },
  { t: 'Salgın/kapanma dönemi: aylarca kepenk kapalı kaldı.', loss: [0.8, 1.6] },
  { t: 'Rakip fiyat savaşı başlattı; zararına satmak zorunda kaldın.', loss: [0.6, 1.2] },
  { t: 'Hırsızlar dükkânı soydu.', loss: [0.5, 1.1], insured: true, minStep: 1, maxStep: 2 },
];
export const BAD_YEARS = [
  'İade dalgası geldi, maliyetler arttı.', 'Kira ve hammadde fiyatları zamlandı.', 'Talep düştü; raflarda mal kaldı.',
  'Tedarikçi geç teslim etti, siparişler iptal oldu.', 'Kötü bir yorum dalgası satışları vurdu.',
];

// Yıl sonu ticaret hesabı. skill = o yılki ticaret mini oyunlarının ortalaması.
export function bizYear(state, rng) {
  const b = state.career.biz;
  if (!b) return null;
  const s = BIZ_STEPS[b.step];
  const skill = b.skillN ? b.skillSum / b.skillN : 35; // yönetilmeyen işletme zayıf performans gösterir
  const yearly = s.monthly * 12 * state.priceIndex;
  // Piyasa havası: iyi ve kötü yıllar seri hâlinde gelir
  b.trend = Math.max(-1, Math.min(1, (b.trend ?? 0) * 0.55 + rng.float(-0.55, 0.55)));
  const ins = state.flags.sigorta;
  const fits = x => b.step >= (x.minStep ?? 0) && b.step <= (x.maxStep ?? 9);
  const pCrash = s.risk * 0.3 * (1.45 - skill / 100) * (ins ? 0.8 : 1) * (b.trend < -0.4 ? 1.6 : 1) * (b.step === 0 ? 0 : 1);
  const pBoom = (0.025 + b.step * 0.007) * (0.35 + skill / 100) * (b.trend > 0.3 ? 1.6 : 1) * (1 + state.stats.itibar / 200);
  const pBad = s.risk * (1.3 - skill / 100) * (ins ? 0.7 : 1) * (1 - b.trend * 0.35);
  let net, kind, reason = null;
  const roll = rng.next();
  if (roll < pCrash) {
    const c = rng.pick(CRASHES.filter(fits));
    kind = 'crash'; reason = c.t;
    net = -yearly * rng.float(c.loss[0], c.loss[1]);
    if (c.insured && ins) { net *= 0.3; reason += ' Sigorta zararın çoğunu karşıladı.'; }
  } else if (roll < pCrash + pBoom) {
    const c = rng.pick(BOOMS.filter(fits));
    kind = 'boom'; reason = c.t;
    net = yearly * rng.float(c.min, c.max) * (0.5 + skill / 100);
  } else if (roll < pCrash + pBoom + pBad) {
    kind = 'bad'; reason = rng.pick(BAD_YEARS);
    net = -0.8 * yearly * rng.float(0.4, 1);
  } else {
    kind = 'good';
    net = yearly * (0.2 + 1.2 * skill / 100) * rng.float(0.85, 1.15) * (1 + b.trend * 0.25);
    net *= 1 + Math.min(0.15, state.stats.itibar / 600); // sadık müşteri
  }
  // Kart kararlarından gelen büyüme/küçülme etkisi (ör. viral ürün için kapasite artırdın)
  if (b.boost && b.boost.years > 0) {
    if (net > 0) net *= b.boost.mul; else if (b.boost.mul > 1) net *= Math.min(2, b.boost.mul); // büyüdüysen kötü yılın da büyük
    if (--b.boost.years <= 0) b.boost = null;
  }
  b.years++;
  if (kind !== 'crash') state.stats.itibar = Math.min(100, state.stats.itibar + 1); // sıradan dürüst ticaret yılı
  b.skillSum = 0; b.skillN = 0;
  b.lastNet = net; b.lastSkill = skill; b.lastBad = net < 0; b.lastKind = kind; b.lastReason = reason;
  if (kind === 'boom') b.booms = (b.booms || 0) + 1;
  return { net, bad: net < 0, kind, reason, skill, step: s, trend: b.trend };
}
// Piyasa havası metni
export const trendText = t => t > 0.45 ? '📈 Piyasa çok canlı' : t > 0.1 ? '↗️ Piyasa iyi' : t > -0.1 ? '➡️ Piyasa durgun' : t > -0.45 ? '↘️ Piyasa zayıf' : '📉 Piyasa krizde';

// İflas: iki basamak aşağı, itibar −5. Oyun bitmez.
export function bankrupt(state) {
  const b = state.career.biz;
  const newStep = Math.max(0, b.step - 2);
  state.career.biz = { step: newStep, years: 0, skillSum: 0, skillN: 0, bankrupt: (b.bankrupt || 0) + 1 };
  state.stats.itibar = Math.max(0, state.stats.itibar - 5);
  state.money = Math.max(state.money, 0);
  return newStep;
}
