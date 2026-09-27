// Yaşam dengesi: her alan için alışkanlık serisi ve ihmal süresi.
// Emek verilen alan ödüllendirilir; ihmal edilen alanın bedeli kademe kademe ödenir.
import { clamp } from '../core/util.js';
import { addStat } from './stats.js';
import { actionById } from './actions.js';
import { livingHome } from './household.js';
import { growCharisma } from './traits.js';

const inSchool = s => ['ilkokul', 'orta', 'lise', 'uni'].includes(s.edu.stage) || (s.flags.okulBirakti && !s.flags.liseDiploma && s.age < 30 && s.counters.acikLise);

export const DOMAINS = {
  ders:     { name: 'Ders',        icon: '📚', match: a => !!a.study,
              on: s => inSchool(s), warn: 1,
              tip: 'Okuldayken her yıl en az bir kez ders çalışmalısın.' },
  spor:     { name: 'Spor',        icon: '⚽', match: a => a.cat === 'spor',
              on: s => s.age >= 8, warn: 2,
              tip: 'Hareketsiz geçen yıllar fiziğini ve sağlığını eritir.' },
  sosyal:   { name: 'Sosyal hayat', icon: '🧑‍🤝‍🧑', match: a => !!(a.friend || a.date || a.love) || ['kulup', 'gonullu', 'tanis'].includes(a.id),
              on: s => s.age >= 8, warn: 2,
              tip: 'Arkadaşlarını ihmal edersen yalnızlaşırsın.' },
  aile:     { name: 'Aile',        icon: '🏡', match: a => !!(a.family || a.kids || a.love),
              on: s => s.age >= 6 && (livingHome(s) || s.rel.children.length > 0 || s.rel.married || s.family.parents.some(p => p.alive)), warn: 3,
              tip: 'Aileye vakit ayırmazsan bağlar kopar.' },
  dinlenme: { name: 'Dinlenme',    icon: '😴', match: a => !!a.rest || ['tatil', 'bahce', 'kontrol'].includes(a.id),
              on: s => s.age >= 16, warn: 3,
              tip: 'Hiç dinlenmeden çalışmak tükenmişliğe götürür.' },
  hobi:     { name: 'Hobi',        icon: '🎨', match: a => a.cat === 'sanat' || ['kitap', 'bahce'].includes(a.id),
              on: s => s.age >= 8, warn: 4,
              tip: 'Hobisiz bir hayat renksizleşir.' },
};

export function initBalance() {
  return Object.fromEntries(Object.keys(DOMAINS).map(k => [k, { streak: 0, neglect: 0 }]));
}

export function domainsDone(s) {
  const done = new Set();
  for (const id of s.year.done) {
    const a = actionById[id];
    if (!a) continue;
    for (const [k, D] of Object.entries(DOMAINS)) if (D.match(a)) done.add(k);
  }
  return done;
}

// Bu yıl henüz yapılmamış ve ihmali uyarı eşiğine gelmiş alanlar (UI uyarısı için)
export function atRisk(s) {
  if (!s.bal) return [];
  const done = domainsDone(s);
  return Object.entries(DOMAINS).filter(([k, D]) => D.on(s) && !done.has(k) && s.bal[k].neglect + 1 >= D.warn).map(([k, D]) => ({ k, ...D, neglect: s.bal[k].neglect + 1 }));
}

const RELS = ['zor', 'normal', 'sicak'];
const relShift = (s, d) => { const i = clamp(RELS.indexOf(s.family.relation) + d, 0, 2); const ch = RELS[i] !== s.family.relation; s.family.relation = RELS[i]; return ch; };

// Yıl sonu: seriler, ihmaller ve sonuçları. Notlar ve açılacak kart id'leri döner.
export function balanceYear(s) {
  if (!s.bal) s.bal = initBalance();
  const out = { notes: [], cards: [], good: [] };
  if (s.age < 6) return out;
  const done = domainsDone(s);
  for (const [k, D] of Object.entries(DOMAINS)) {
    const b = s.bal[k];
    if (!D.on(s)) { b.neglect = 0; continue; }
    if (done.has(k)) { b.streak++; b.neglect = 0; }
    else { b.neglect++; b.streak = 0; }
  }
  const B = s.bal;
  // ——— İhmaller ———
  if (DOMAINS.ders.on(s) && B.ders.neglect >= 1) {
    const loss = Math.min(3, 0.9 * B.ders.neglect);
    for (const k of ['matematik', 'fen', 'dil']) s.skills[k] = Math.max(0, s.skills[k] - loss);
    out.notes.push(`📚 ${B.ders.neglect} yıldır ders çalışmıyorsun: öğrendiklerini unutuyorsun (matematik, fen, dil −${loss.toFixed(1)}).`);
    if (B.ders.neglect === 2) out.cards.push('veli_cagri');
  }
  if (DOMAINS.spor.on(s) && B.spor.neglect >= 2) {
    const n = B.spor.neglect - 1;
    if (s.stats.fizik > 20) addStat(s, 'fizik', -Math.min(2, n * 0.8));
    if (s.stats.saglik > 50) addStat(s, 'saglik', -Math.min(1.2, n * 0.5)); // hareketsizlik sağlığı ~50'ye doğru çeker
    out.notes.push(`🛋️ ${B.spor.neglect} yıldır hiç spor yapmadın: fiziğin ve sağlığın düşüyor.`);
    if (B.spor.neglect === 3) out.cards.push('hareketsiz_yasam');
  }
  if (DOMAINS.sosyal.on(s) && B.sosyal.neglect >= 2) {
    addStat(s, 'sosyal', -1.5); addStat(s, 'mutluluk', -2);
    if (B.sosyal.neglect >= 3 && s.rel.friends > 0) { s.rel.friends--; out.notes.push('👋 Bir arkadaşınla aranız açıldı; artık görüşmüyorsunuz.'); }
    if (B.sosyal.neglect >= 4 && s.rel.bestFriend) { out.notes.push(`💔 ${s.rel.bestFriend} ile yollarınız ayrıldı.`); s.rel.bestFriend = null; }
    out.notes.push(`😶 ${B.sosyal.neglect} yıldır sosyal hayatın yok: yalnızlaşıyorsun.`);
    if (B.sosyal.neglect === 3) out.cards.push('yalnizlik');
  }
  if (DOMAINS.aile.on(s) && B.aile.neglect >= 3) {
    if (relShift(s, -1)) out.notes.push('🏚️ Ailene uzun süredir vakit ayırmadın; aranız soğudu.');
    if (s.rel.children.length) s.flags.cocukBag = Math.max(0, (s.flags.cocukBag || 0) - 1);
    if (s.rel.partner) s.rel.partner.love = clamp(s.rel.partner.love - 5, 0, 100);
    if (B.aile.neglect === 3) out.cards.push('aile_kopukluk');
  }
  if (DOMAINS.dinlenme.on(s) && B.dinlenme.neglect >= 3) {
    addStat(s, 'mutluluk', -3); if (s.stats.saglik > 45) addStat(s, 'saglik', -1);
    out.notes.push(`🔥 ${B.dinlenme.neglect} yıldır hiç dinlenmedin: tükenmişlik kapıda.`);
    if (B.dinlenme.neglect === 3) out.cards.push('tukenmislik');
  }
  if (DOMAINS.hobi.on(s) && B.hobi.neglect >= 4) addStat(s, 'mutluluk', -1);
  // Kullanılmayan beceri körelir
  s.lastTrain = s.lastTrain || {};
  for (const k of Object.keys(s.skills)) {
    if (s.lastTrain[k] !== undefined && s.age - s.lastTrain[k] >= 3 && s.skills[k] > 25 && !['matematik', 'fen', 'dil'].includes(k)) {
      s.skills[k] -= 0.7;
    }
  }
  // ——— Alışkanlık ödülleri (3+ yıl üst üste) ———
  if (B.spor.streak >= 3) { addStat(s, 'saglik', 1); addStat(s, 'fizik', 0.5); out.good.push('⚽ Spor alışkanlığı: sağlık +1'); }
  if (B.sosyal.streak >= 3) { addStat(s, 'mutluluk', 1); growCharisma(s, 0.3); out.good.push('🧑‍🤝‍🧑 Güçlü sosyal çevre: mutluluk +1'); }
  if (B.aile.streak === 3 && relShift(s, 1)) out.good.push('🏡 Ailene düzenli vakit ayırdın; bağlarınız güçlendi.');
  if (B.dinlenme.streak >= 3) { addStat(s, 'mutluluk', 1); out.good.push('😴 Dengeli yaşam: mutluluk +1'); }
  if (B.hobi.streak >= 3) { addStat(s, 'mutluluk', 1); out.good.push('🎨 Hobi alışkanlığı: mutluluk +1'); }
  if (B.ders.streak >= 3) out.good.push('📚 Düzenli çalışma alışkanlığı: sınav hazırlığı +4');
  return out;
}

export const studyHabitBonus = s => (s.bal?.ders?.streak >= 3 ? 4 : 0);
export const sedentaryRisk = s => (s.bal?.spor?.neglect >= 5 ? 1.12 : 1);
