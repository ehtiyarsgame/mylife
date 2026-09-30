// Zorunlu askerlik: erkekler 18 yaşında yükümlü olur. Lise ya da üniversitede okuyan, öğrenimi bitene kadar
// tecil edilir (en geç 29 yaşına kadar). Seçenekler: askerliğini yap (acemi birliği parkurları), bedelli askerlik
// (yüklü bir ücret + kısa temel eğitim) ya da sağlığı çok kötüyse çürük raporu (muafiyet).
import { clamp } from '../core/util.js';
import { addStat } from './stats.js';

export const TECIL_MAX = 29;

// null: yükümlü değil · 'tecil': okuduğu için ertelendi · 'due': bu yıl gitmeli · 'done': yaptı/muaf
export function askerlikStatus(s) {
  if (s.gender !== 'e' || s.age < 18) return null;
  if (s.flags.askerlik) return 'done';
  if (s.age > 40) return null; // bu yaştan sonra oyunda artık çağrılmaz
  const studying = (s.edu.stage === 'lise' && !s.flags.okulBirakti) || s.edu.stage === 'uni';
  if (studying && s.age <= TECIL_MAX) return 'tecil';
  return 'due';
}

export const bedelliCost = s => Math.round(12 * 22000 * s.priceIndex / 1000) * 1000;
export const canMuaf = s => s.stats.saglik < 30;
export const serviceEP = (s, kind) => Math.min(kind === 'normal' ? 2 : 1, Math.max(0, s.year.ep - s.year.used));

// Askerlik tamamlanır. kind: 'normal' | 'bedelli' | 'muaf'; score: parkur ortalaması (0–100)
export function finishService(s, kind, score = 60) {
  const out = { lines: [], rank: null };
  s.flags.askerlik = s.age;
  s.flags.askerlikTur = kind;
  s.year.asker = kind;
  s.year.used += serviceEP(s, kind);
  const task = s.year.tasks.find(t => t.choice === 'asker'); if (task) task.done = true;
  if (kind === 'muaf') {
    out.lines.push('Sağlık kurulu raporuyla askerlikten muaf tutuldun.');
    return out;
  }
  if (kind === 'bedelli') {
    s.money -= bedelliCost(s);
    addStat(s, 'disiplin', 3); addStat(s, 'fizik', 2);
    out.lines.push('Bedelli askerlik ücretini yatırdın ve kısa temel eğitimi tamamladın.');
    return out;
  }
  const q = clamp(score, 0, 100) / 100;
  addStat(s, 'disiplin', 4 + q * 6);
  addStat(s, 'fizik', 3 + q * 5);
  addStat(s, 'saglik', 1 + q * 2);
  addStat(s, 'mutluluk', score >= 60 ? 2 : -3);
  addStat(s, 'sosyal', 2);
  if (score >= 85) { out.rank = 'Onbaşı'; addStat(s, 'itibar', 4); s.flags.askerRutbe = 'onbasi'; out.lines.push('Takdirname aldın ve onbaşı rütbesiyle terhis oldun!'); }
  else if (score >= 60) out.lines.push('Askerliğini sorunsuz tamamlayıp terhis oldun.');
  else out.lines.push('Zorlandın ama askerliğini tamamladın. Terhis!');
  if (s.rel.friends < 8) { s.rel.friends++; out.lines.push('Tezkere arkadaşların hayat boyu dostun oldu.'); }
  return out;
}
