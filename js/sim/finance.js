// Kişisel finans: gelir vergisi, yaşam standardı, borsa ve banka.
import { CONFIG } from '../config.js';

// Yıllık brüt gelirden kademeli gelir vergisi (dilimler 2026 TL, fiyat endeksiyle büyür)
export function incomeTax(annual, pi) {
  const m = annual / 12 / pi;
  let tax = 0, prev = 0;
  for (const [cap, rate] of CONFIG.incomeTax) {
    if (m > prev) tax += (Math.min(m, cap) - prev) * rate;
    prev = cap;
  }
  return tax * 12 * pi;
}

// Yüksek gelirde harcamalar da büyür: temel yaşam giderinin 3 katını aşan gelirin bir kısmı
export const lifestyleOf = s => CONFIG.lifestyle[s.lifestyle] || CONFIG.lifestyle.normal;
export function lifestyleCost(s, netIncome, baseCost) {
  const extra = Math.max(0, netIncome - baseCost * 3);
  return extra * lifestyleOf(s).rate;
}

// ——————————————————— BORSA ———————————————————
// Hayali şirketler. vol: yıllık oynaklık, drift: enflasyon üstü ortalama getiri, beta: piyasaya duyarlılık, div: temettü verimi
export const SECTORS = {
  tek:    { name: 'Teknoloji', icon: '💻' },
  finans: { name: 'Banka & finans', icon: '🏦' },
  enerji: { name: 'Enerji', icon: '⚡' },
  gida:   { name: 'Gıda & perakende', icon: '🛒' },
  sanayi: { name: 'Sanayi & otomotiv', icon: '🏭' },
  saglik: { name: 'Sağlık', icon: '💊' },
  ulasim: { name: 'Havacılık & turizm', icon: '✈️' },
  emtia:  { name: 'Emtia & madencilik', icon: '⛏️' },
  fon:    { name: 'Fonlar', icon: '📦' },
};
export const STOCKS = [
  { id: 'NOVA', name: 'Novatek', sector: 'tek', base: 120, vol: 0.32, drift: 0.055, beta: 1.3, div: 0 },
  { id: 'PXL',  name: 'Pixelsoft', sector: 'tek', base: 85, vol: 0.4, drift: 0.065, beta: 1.4, div: 0 },
  { id: 'SLC',  name: 'Silicor Çip', sector: 'tek', base: 210, vol: 0.42, drift: 0.057, beta: 1.5, div: 0.01 },
  { id: 'GAME', name: 'Gamezone', sector: 'tek', base: 45, vol: 0.5, drift: 0.055, beta: 1.4, div: 0 },
  { id: 'ATB',  name: 'Atlas Bank', sector: 'finans', base: 38, vol: 0.25, drift: -0.01, beta: 1.2, div: 0.05 },
  { id: 'KRD',  name: 'Kredo Finans', sector: 'finans', base: 22, vol: 0.3, drift: -0.002, beta: 1.3, div: 0.04 },
  { id: 'ENRX', name: 'Enerjix', sector: 'enerji', base: 64, vol: 0.28, drift: -0.028, beta: 0.8, div: 0.06 },
  { id: 'SOLR', name: 'Solaris Yeşil Enerji', sector: 'enerji', base: 48, vol: 0.4, drift: 0.045, beta: 1.1, div: 0 },
  { id: 'FOOD', name: 'Foodies', sector: 'gida', base: 55, vol: 0.15, drift: -0.002, beta: 0.5, div: 0.04 },
  { id: 'MRKT', name: 'Marketim', sector: 'gida', base: 72, vol: 0.2, drift: 0.006, beta: 0.7, div: 0.03 },
  { id: 'OTO',  name: 'Otomax', sector: 'sanayi', base: 95, vol: 0.3, drift: 0.006, beta: 1.2, div: 0.03 },
  { id: 'BLD',  name: 'Constructa İnşaat', sector: 'sanayi', base: 30, vol: 0.36, drift: 0.014, beta: 1.3, div: 0.02 },
  { id: 'MEDI', name: 'Medicor İlaç', sector: 'saglik', base: 140, vol: 0.25, drift: 0.034, beta: 0.6, div: 0.02 },
  { id: 'CARE', name: 'Carelife Hastaneleri', sector: 'saglik', base: 60, vol: 0.22, drift: 0.016, beta: 0.7, div: 0.03 },
  { id: 'SKY',  name: 'Skyline Havayolları', sector: 'ulasim', base: 40, vol: 0.42, drift: 0.007, beta: 1.5, div: 0.01 },
  { id: 'TOUR', name: 'Sunway Turizm', sector: 'ulasim', base: 26, vol: 0.35, drift: 0.014, beta: 1.2, div: 0.02 },
  { id: 'MINE', name: 'Minera Madencilik', sector: 'emtia', base: 33, vol: 0.35, drift: -0.02, beta: 0.9, div: 0.05 },
  { id: 'TEL',  name: 'Telnet İletişim', sector: 'finans', base: 50, vol: 0.16, drift: -0.028, beta: 0.6, div: 0.06 },
  // Fonlar ve diğer varlıklar
  { id: 'ENDX', name: 'Endeks fonu (tüm piyasa)', sector: 'fon', base: 100, vol: 0.05, drift: 0.02, beta: 1, div: 0.02, fund: true },
  { id: 'GOLD', name: 'Altın fonu', sector: 'emtia', base: 100, vol: 0.14, drift: 0.02, beta: -0.35, div: 0, fund: true, haven: true },
  { id: 'BOND', name: 'Devlet tahvili fonu', sector: 'fon', base: 100, vol: 0.02, drift: 0.02, beta: 0, div: 0, fund: true, bond: true },
  { id: 'CRPT', name: 'Kripto para', sector: 'fon', base: 100, vol: 0.7, drift: 0.08, beta: 1.6, div: 0, crypto: true },
];
export const stockById = Object.fromEntries(STOCKS.map(x => [x.id, x]));
export const CYCLES = {
  boga: { name: 'Boğa piyasası', icon: '🐂', mean: 0.14, sd: 0.08 },
  yatay: { name: 'Yatay piyasa', icon: '➖', mean: 0.03, sd: 0.07 },
  ayi: { name: 'Ayı piyasası', icon: '🐻', mean: -0.14, sd: 0.1 },
};
const NEXT_CYCLE = {
  boga: [['boga', 55], ['yatay', 30], ['ayi', 15]],
  yatay: [['yatay', 45], ['boga', 35], ['ayi', 20]],
  ayi: [['yatay', 40], ['ayi', 35], ['boga', 25]],
};
const SECTOR_NEWS = {
  tek: [['Yapay zekâ çılgınlığı: teknoloji hisseleri uçtu.', 'Teknoloji devlerine ağır vergi ve regülasyon geldi.']],
  finans: [['Faiz indirimi bankaları sevindirdi.', 'Batık krediler bankaları sarstı.']],
  enerji: [['Enerji fiyatları tavan yaptı.', 'Petrol fiyatları çöktü, enerji şirketleri geriledi.']],
  gida: [['Yeni zincir mağazalar rekor satış yaptı.', 'Tarımda kuraklık gıda şirketlerinin maliyetini patlattı.']],
  sanayi: [['İhracatta rekor: fabrikalar tam kapasite çalışıyor.', 'Çip krizi otomotiv üretimini durdurdu.']],
  saglik: [['Yeni bir ilaç onay aldı, sağlık hisseleri yükseldi.', 'Sağlıkta fiyat tavanı sektörü vurdu.']],
  ulasim: [['Turizmde rekor sezon: uçaklar dolu.', 'Salgın uçuşları durdurdu, turizm çöktü.']],
  emtia: [['Maden fiyatları rekor kırdı.', 'Emtia fiyatları sert düştü.']],
};
const COMPANY_NEWS = [
  ['{0} yeni ürünüyle satış rekoru kırdı.', '{0} büyük bir ihale kazandı.', '{0} yabancı bir dev tarafından satın alınıyor.', '{0} beklentilerin çok üstünde kâr açıkladı.'],
  ['{0} yönetiminde yolsuzluk skandalı!', '{0} büyük bir davayı kaybetti.', '{0} ürünlerini geri çağırdı.', '{0} zarar açıkladı, CEO istifa etti.'],
];

const fmtNews = (t, n) => t.replace('{0}', n);
// Gelecek yılın (gizli) görünümünü önceden çek: piyasa analizi bunu tahmin etmeye çalışır
function rollOutlook(M, r) {
  const cycle = r.weighted(NEXT_CYCLE[M.cycle || 'yatay']);
  const C = CYCLES[cycle];
  let m = r.normal(C.mean, C.sd);
  let crisis = false;
  if (r.chance(0.035)) { m -= 0.25; crisis = true; }
  const sectors = {};
  const news = [];
  for (const k in SECTORS) {
    if (k === 'fon') continue;
    let sh = r.normal(0, 0.05);
    if (r.chance(0.2)) {
      const up = r.chance(0.5);
      sh += (up ? 1 : -1) * r.float(0.1, 0.22);
      news.push({ t: SECTOR_NEWS[k][0][up ? 0 : 1], up, sector: k });
    }
    sectors[k] = sh;
  }
  const firms = {};
  for (const st of STOCKS) {
    if (st.fund) continue;
    let sh = 0;
    if (r.chance(0.08)) {
      const up = r.chance(0.5);
      sh = (up ? 1 : -1) * r.float(0.12, 0.3);
      news.push({ t: fmtNews(r.pick(COMPANY_NEWS[up ? 0 : 1]), st.name), up, stock: st.id });
    }
    firms[st.id] = sh;
  }
  M.next = { cycle, m, crisis, sectors, firms, news };
}

export function initMarket(s, r) {
  if (s.market) return s.market;
  const M = s.market = { prices: {}, hist: {}, cycle: 'yatay', news: [], hints: null, lastYear: null };
  for (const st of STOCKS) { M.prices[st.id] = st.base * s.priceIndex; M.hist[st.id] = [M.prices[st.id]]; }
  rollOutlook(M, r);
  s.portfolio ||= {};
  return M;
}

// Yıl sonu: fiyatları güncelle, temettü öde. infl: bu yılın enflasyonu
export function marketYear(s, r, infl) {
  const M = initMarket(s, r);
  const N = M.next;
  const before = portfolioValue(s);
  M.cycle = N.cycle;
  const ret = {};
  for (const st of STOCKS) {
    let x;
    if (st.bond) x = infl + 0.02 + r.normal(0, st.vol);
    else if (st.crypto) {
      x = infl + st.drift + st.beta * N.m + r.normal(0, st.vol * 0.6);
      if (r.chance(0.08)) x = r.float(-0.7, -0.45); else if (r.chance(0.1)) x = r.float(0.8, 2);
    } else {
      x = infl + st.drift + st.beta * N.m + (N.sectors[st.sector] ?? 0) * (st.fund ? 0.3 : 1) + (N.firms[st.id] ?? 0) + r.normal(0, st.fund ? st.vol : st.vol * 0.45);
      if (st.haven && N.crisis) x += 0.25;
    }
    x = Math.max(st.crypto ? -0.85 : N.crisis ? -0.7 : -0.6, x);
    ret[st.id] = x;
    M.prices[st.id] = Math.max(0.5, M.prices[st.id] * (1 + x));
    M.hist[st.id] = [...M.hist[st.id], M.prices[st.id]].slice(-12);
  }
  // Temettü
  let div = 0;
  for (const id in s.portfolio || {}) {
    const p = s.portfolio[id];
    if (p.qty > 0) div += p.qty * M.prices[id] * stockById[id].div;
  }
  const news = [...(N.crisis ? [{ t: 'Küresel finans krizi! Piyasalar çöktü.', up: false }] : []), ...N.news];
  M.news = news;
  M.lastYear = { cycle: N.cycle, m: N.m, ret };
  M.hints = null;
  rollOutlook(M, r);
  return { news, div, change: portfolioValue(s) - before, cycle: N.cycle };
}

export function portfolioValue(s) {
  if (!s.market || !s.portfolio) return 0;
  let v = 0;
  for (const id in s.portfolio) v += (s.portfolio[id].qty || 0) * (s.market.prices[id] || 0);
  return v;
}
export const COMMISSION = 0.002;
export function buyStock(s, id, qty) {
  const price = s.market.prices[id];
  qty = Math.floor(qty);
  const cost = qty * price * (1 + COMMISSION);
  if (qty <= 0 || cost > s.money) return false;
  s.money -= cost;
  const p = (s.portfolio[id] ||= { qty: 0, cost: 0 });
  p.qty += qty; p.cost += cost;
  return cost;
}
export function sellStock(s, id, qty) {
  const p = s.portfolio[id];
  qty = Math.min(Math.floor(qty), p?.qty || 0);
  if (qty <= 0) return false;
  const price = s.market.prices[id];
  const got = qty * price * (1 - COMMISSION);
  p.cost *= (p.qty - qty) / p.qty;
  p.qty -= qty;
  if (!p.qty) delete s.portfolio[id];
  s.money += got;
  return got;
}

// Piyasa analizi: gelecek yılın görünümünü performansa göre doğrulukla tahmin et
export function makeHints(s, perf, r) {
  const M = s.market; const N = M.next;
  const acc = 0.55 + perf / 250;
  const guess = trueUp => (r.chance(acc) ? trueUp : !trueUp);
  const hints = [];
  const cyc = r.chance(acc) ? N.cycle : r.pick(Object.keys(CYCLES).filter(k => k !== N.cycle));
  hints.push({ kind: 'cycle', up: cyc === 'boga' ? true : cyc === 'ayi' ? false : null, text: `Genel piyasa: ${CYCLES[cyc].icon} ${CYCLES[cyc].name} bekleniyor` });
  const secs = Object.entries(N.sectors).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
  for (const [k, v] of secs) { const up = guess(v > 0); hints.push({ kind: 'sector', sector: k, up, text: `${SECTORS[k].icon} ${SECTORS[k].name} için görünüm ${up ? 'iyimser' : 'kötümser'}` }); }
  const firm = Object.entries(N.firms).filter(([, v]) => v).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (firm && r.chance(0.4 + perf / 200)) { const up = guess(firm[1] > 0); hints.push({ kind: 'stock', stock: firm[0], up, text: `🔎 ${stockById[firm[0]].name}: kulağa ${up ? 'iyi' : 'kötü'} haberler geliyor` }); }
  if (N.crisis && r.chance(acc - 0.2)) hints.push({ kind: 'crisis', up: false, text: '⚠️ Bazı analistler büyük bir kriz uyarısı yapıyor' });
  M.hints = { perf, list: hints };
  return M.hints;
}

// ——————————————————— BANKA ———————————————————
export function bankOf(s) { return (s.bank ||= { score: 50, loans: [] }); }
export const scoreLabel = sc => sc >= 80 ? 'Çok iyi' : sc >= 60 ? 'İyi' : sc >= 40 ? 'Orta' : sc >= 20 ? 'Zayıf' : 'Çok zayıf';
// Kredi faizi: kredi notu düştükçe yükselir
export const loanRate = s => 0.1 + (100 - bankOf(s).score) / 100 * 0.14;
export function yearlyIncome(s, jobs, levelMult) {
  const j = s.career.job;
  let inc = j ? jobs[j.id].salary * levelMult(j) * 12 * s.priceIndex : 0;
  if (s.career.biz) inc += Math.max(0, s.career.biz.lastNet || 0);
  if (s.career.retired && s.career.pension) inc += s.career.pension * 12 * s.priceIndex;
  return inc;
}
export const loanDebt = s => bankOf(s).loans.reduce((a, l) => a + l.left, 0);
export function loanLimit(s, income) {
  const B = bankOf(s);
  if (s.age < 18 || B.score < 15) return 0;
  return Math.max(0, income * (1 + B.score / 40) - loanDebt(s));
}
export const annuity = (amt, rate, years) => amt * rate / (1 - Math.pow(1 + rate, -years));
export function takeLoan(s, amt, years, kind = 'ihtiyac') {
  const rate = loanRate(s) - (kind === 'konut' ? 0.03 : 0);
  const pay = annuity(amt, rate, years);
  bankOf(s).loans.push({ kind, amt, rate, years, left: amt, pay });
  s.money += amt;
  return pay;
}
export function payOffLoan(s, i) {
  const L = bankOf(s).loans[i];
  if (!L || s.money < L.left) return false;
  s.money -= L.left;
  bankOf(s).loans.splice(i, 1);
  bankOf(s).score = Math.min(100, bankOf(s).score + 3);
  return true;
}
// Yıl sonu taksitleri. Taksit ödenemezse not düşer, borç büyür
export function loanYear(s) {
  const B = bankOf(s);
  let paid = 0, interest = 0;
  const notes = [];
  for (const L of B.loans) {
    const i = L.left * L.rate;
    const pay = Math.min(L.pay, L.left + i);
    interest += i;
    L.left = Math.max(0, L.left + i - pay);
    paid += pay;
  }
  s.money -= paid;
  if (paid > 0) {
    if (s.money < 0) { B.score = Math.max(0, B.score - 12); notes.push('🏦 Kredi taksidini ödeyecek nakdin yoktu: kredi notun düştü.'); }
    else B.score = Math.min(100, B.score + 2);
  }
  B.loans = B.loans.filter(L => L.left > 1);
  return { paid, interest, notes };
}

// ——————————————————— GAYRİMENKUL ———————————————————
export const HOUSE_BASE = { ev: 2800000, kira: 2200000 }; // 2026 TL
export const housePrice = (s, kind) => HOUSE_BASE[kind] * s.priceIndex * (s.market?.house ?? 1);
export function buyHouse(s, kind, loanShare = 0, years = 10) {
  const price = housePrice(s, kind);
  const loan = price * loanShare;
  if (s.money + loan < price) return false;
  if (loan > 0) takeLoan(s, loan, years, 'konut');
  s.money -= price;
  (s.houses ||= []).push({ kind, value: price, bought: price });
  if (kind === 'ev') s.flags.evSahibi = true;
  return true;
}
export function sellHouse(s, i) {
  const H = s.houses?.[i];
  if (!H) return false;
  s.money += H.value * 0.97;
  s.houses.splice(i, 1);
  if (H.kind === 'ev' && !s.houses.some(x => x.kind === 'ev')) delete s.flags.evSahibi;
  return H.value * 0.97;
}
export function houseYear(s, r, infl) {
  let rent = 0;
  const g = infl + r.normal(0.02, 0.06);
  if (s.market) s.market.house = (s.market.house ?? 1) * (1 + g - infl);
  for (const H of s.houses || []) {
    H.value *= 1 + g;
    if (H.kind === 'kira') rent += H.value * 0.045;
  }
  return { rent, growth: g };
}
export const housesValue = s => (s.houses || []).reduce((a, H) => a + H.value, 0);
export const netWorth = s => s.money + (s.savings || 0) + portfolioValue(s) + housesValue(s) - (s.bank ? loanDebt(s) : 0);
