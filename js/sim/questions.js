// Soru bankası + yaşa göre üretilen matematik soruları. Son 200 soru tekrar gelmez.
import { fx } from '../core/rng.js';

let BANK = [];
export function setBank(qs) { BANK = qs.map((q, i) => ({ ...q, id: q.id ?? `q${i}` })); }
export const bankSize = () => BANK.length;

export function levelFor(age) {
  if (age <= 9) return 'ilkokul';
  if (age <= 13) return 'ortaokul';
  return 'lise';
}

const LEVEL_MIX = {
  ilkokul: ['ilkokul'],
  ortaokul: ['ortaokul', 'ilkokul'],
  lise: ['lise', 'ortaokul'],
  genel: ['genel', 'lise'],
  tip: ['tip'],
  ehliyet: ['ehliyet'],
  usta: ['usta'],
};

function genMath(level) {
  const r = fx;
  let q, ans;
  if (level === 'ilkokul') {
    const a = r.int(4, 30), b = r.int(2, 20);
    if (r.chance(0.5)) { q = `${a} + ${b} = ?`; ans = a + b; } else { const x = Math.max(a, b), y = Math.min(a, b); q = `${x} − ${y} = ?`; ans = x - y; }
  } else if (level === 'ortaokul') {
    const t = r.int(0, 2);
    if (t === 0) { const a = r.int(6, 15), b = r.int(3, 12); q = `${a} × ${b} = ?`; ans = a * b; }
    else if (t === 1) { const b = r.int(3, 12), ansv = r.int(3, 15); q = `${b * ansv} ÷ ${b} = ?`; ans = ansv; }
    else { const p = r.pick([10, 20, 25, 50]), n = r.pick([40, 80, 120, 200, 240]); q = `${n} sayısının %${p}'i kaçtır?`; ans = n * p / 100; }
  } else {
    const t = r.int(0, 2);
    if (t === 0) { const x = r.int(2, 12), a = r.int(2, 7), b = r.int(1, 20); q = `${a}x + ${b} = ${a * x + b} ise x = ?`; ans = x; }
    else if (t === 1) { const n = r.int(11, 25); q = `${n}² = ?`; ans = n * n; }
    else { const a = r.int(2, 9), b = r.int(2, 4); q = `${a}^${b} = ?`; ans = a ** b; }
  }
  const wrong = new Set();
  while (wrong.size < 3) {
    const d = r.pick([-10, -2, -1, 1, 2, 10, 5, -5]);
    const w = ans + d * (Math.abs(ans) > 50 ? r.int(1, 3) : 1);
    if (w !== ans && w >= 0) wrong.add(w);
  }
  return { id: 'gen', s: 'Matematik', q, a: [String(ans), ...[...wrong].map(String)], c: 0, h: 'Adım adım işlem yap.' };
}

// Sınav soruları: şıklar karıştırılmış olarak döner ({q, opts, correct, s, h})
export function pickQuestions(levelKey, n, recent = []) {
  const levels = LEVEL_MIX[levelKey] || [levelKey];
  const recentSet = new Set(recent);
  let pool = BANK.filter(q => levels.includes(q.l) && !recentSet.has(q.id));
  if (pool.length < n) pool = BANK.filter(q => levels.includes(q.l));
  pool = fx.shuffle(pool);
  const genShare = ['ilkokul', 'ortaokul', 'lise', 'genel'].includes(levelKey) ? 0.3 : 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    const useGen = (fx.chance(genShare) || !pool.length) && genShare > 0;
    const raw = useGen ? genMath(levelKey === 'genel' ? 'lise' : levelKey) : pool.pop() || genMath('ortaokul');
    const order = fx.shuffle([0, 1, 2, 3]);
    out.push({ id: raw.id, s: raw.s, q: raw.q, h: raw.h, opts: order.map(i => raw.a[i]), correct: order.indexOf(raw.c) });
  }
  return out;
}
