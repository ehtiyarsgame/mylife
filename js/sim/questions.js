// Soru bankası + veri tablolarından üretilen sorular. Son sorulanlar tekrar gelmez.
import { fx } from '../core/rng.js';
import { genQuestion, genLevels } from './qgen.js';

// Oturum boyunca son sorulan soruları hatırla (mini oyun + sınav)
const SEEN = [];
const remember = ids => { SEEN.push(...ids); if (SEEN.length > 400) SEEN.splice(0, SEEN.length - 400); };

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

// Sınav soruları: şıklar karıştırılmış olarak döner ({q, opts, correct, s, h})
// Hazırlık düşükse sorular bir üst seviyeden ve daha zor gelir; yüksekse bildik konulardan.
const HARDER = { ilkokul: ['ilkokul', 'ortaokul'], ortaokul: ['ortaokul', 'lise'], lise: ['lise'], genel: ['genel', 'lise'] };
const EASIER = { ilkokul: ['ilkokul'], ortaokul: ['ortaokul', 'ilkokul'], lise: ['lise', 'ortaokul'], genel: ['genel', 'ortaokul'] };
export function pickQuestions(levelKey, n, recent = [], prep = 50) {
  const levels = (prep < 40 ? HARDER[levelKey] : prep >= 70 ? EASIER[levelKey] : null) || LEVEL_MIX[levelKey] || [levelKey];
  const genLevel = prep < 40 ? ({ ilkokul: 'ortaokul', ortaokul: 'lise', lise: 'lise', genel: 'lise' }[levelKey]) : null;
  const recentSet = new Set([...recent, ...SEEN]);
  let pool = BANK.filter(q => levels.includes(q.l) && !recentSet.has(q.id));
  if (pool.length < n) pool = BANK.filter(q => levels.includes(q.l) && !SEEN.slice(-40).includes(q.id));
  pool = fx.shuffle(pool);
  // Soruların çoğu veri tablolarından üretilir (binlerce farklı soru); kalanı elle yazılmış bankadan gelir.
  const genShare = ['ilkokul', 'ortaokul', 'lise', 'genel'].includes(levelKey) ? 0.65 : genLevels.includes(levelKey) ? 0.6 : 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    const useGen = genShare > 0 && (fx.chance(genShare) || !pool.length);
    const gl = genLevel || fx.pick(levels.filter(l => genLevels.includes(l))) || 'ortaokul';
    let raw = useGen ? genQuestion(fx, gl, recentSet) : pool.pop();
    if (!raw) raw = genQuestion(fx, genLevels.includes(levelKey) ? levelKey : 'ortaokul', recentSet);
    recentSet.add(raw.id);
    const order = fx.shuffle([0, 1, 2, 3]);
    out.push({ id: raw.id, s: raw.s, q: raw.q, h: raw.h, opts: order.map(i => raw.a[i]), correct: order.indexOf(raw.c) });
  }
  remember(out.map(q => q.id));
  return out;
}
