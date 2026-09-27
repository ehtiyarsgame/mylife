// Ticaret yolu ekonomik modeli (Tasarım Dokümanı §9).
export const BIZ_STEPS = [
  { name: 'Okulda satış',       icon: '🍪', age: 12, capital: 0,          monthly: 250,     rep: 0,  prevYears: 0, risk: 0.05, mgs: ['paraustu', 'pazarlik'] },
  { name: 'Pazar tezgâhı',      icon: '🧺', age: 15, capital: 15000,      monthly: 22000,   rep: 0,  prevYears: 2, risk: 0.10, mgs: ['pazarlik', 'fiyat', 'paraustu'] },
  { name: 'Dükkân',             icon: '🏪', age: 20, capital: 250000,     monthly: 55000,   rep: 30, prevYears: 3, risk: 0.12, mgs: ['fiyat', 'stok', 'pazarlik'] },
  { name: 'E-ticaret mağazası', icon: '📦', age: 23, capital: 400000,     monthly: 120000,  rep: 40, prevYears: 2, risk: 0.15, mgs: ['urunsayfa', 'stok', 'fiyat'] },
  { name: 'Toptancılık',        icon: '🚛', age: 27, capital: 2500000,    monthly: 200000,  rep: 60, prevYears: 3, risk: 0.15, mgs: ['pazarlik', 'stok', 'rota'] },
  { name: 'Kendi markası',      icon: '🏷️', age: 31, capital: 12000000,   monthly: 450000,  rep: 75, prevYears: 4, risk: 0.18, mgs: ['urunsayfa', 'fiyat', 'konusma'] },
  { name: 'İhracat',            icon: '🌍', age: 36, capital: 60000000,   monthly: 1500000, rep: 90, prevYears: 5, risk: 0.20, mgs: ['pazarlik', 'stok', 'konusma'] },
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

// Yıl sonu ticaret hesabı. skill = o yılki ticaret mini oyunlarının ortalaması.
export function bizYear(state, rng) {
  const b = state.career.biz;
  if (!b) return null;
  const s = BIZ_STEPS[b.step];
  const skill = b.skillN ? b.skillSum / b.skillN : 35; // yönetilmeyen işletme zayıf performans gösterir
  const yearly = s.monthly * 12 * state.priceIndex;
  const risk = s.risk * (1.3 - skill / 100) * (state.flags.sigorta ? 0.7 : 1);
  let net, bad = false;
  if (rng.chance(risk)) {
    bad = true;
    net = -0.8 * yearly * rng.float(0.4, 1); // kötü yıl
  } else {
    net = yearly * (0.2 + 1.2 * skill / 100) * rng.float(0.85, 1.15);
    net *= 1 + Math.min(0.15, state.stats.itibar / 600); // sadık müşteri
  }
  b.years++;
  state.stats.itibar = Math.min(100, state.stats.itibar + 1); // sıradan dürüst ticaret yılı
  b.skillSum = 0; b.skillN = 0;
  b.lastNet = net; b.lastSkill = skill; b.lastBad = bad;
  return { net, bad, skill, step: s };
}

// İflas: iki basamak aşağı, itibar −5. Oyun bitmez.
export function bankrupt(state) {
  const b = state.career.biz;
  const newStep = Math.max(0, b.step - 2);
  state.career.biz = { step: newStep, years: 0, skillSum: 0, skillN: 0, bankrupt: (b.bankrupt || 0) + 1 };
  state.stats.itibar = Math.max(0, state.stats.itibar - 5);
  state.money = Math.max(state.money, 0);
  return newStep;
}
