// Ödüllü reklam noktaları ve sınırları (Tasarım Dokümanı §10).
// Prototipte gerçek reklam yerine kısa bir sayaç gösterilir; AdMob bağlanınca yalnızca
// `setAdProvider` ile gerçek gösterim fonksiyonu verilir.
import { todayKey } from './util.js';
import { CONFIG } from '../config.js';

export const AD_LIMITS = {
  energy:   { perDay: CONFIG.energy.adPerDay, label: `+${CONFIG.energy.adAmount} enerji` },
  retry:    { perDay: 5,  label: 'Bir kez daha dene' },
  ep:       { perDay: 99, label: '+1 eylem puanı' },    // yılda 1 (yılda kontrol edilir)
  joker:    { perDay: 99, label: 'Reklam jokeri' },   // sınav başına 1 (sınavda kontrol edilir)
  hint:     { perDay: 99, label: 'Yetenek ipucu' },    // hayat başına 3 (hayatta kontrol edilir)
  double:   { perDay: 3,  label: 'Geliri 2 kat al' },
  heal:     { perDay: 99, label: 'İyileşme yarıya' },
  door:     { perDay: 99, label: 'Kapı puanına +10' },
  reroll:   { perDay: 30, label: 'Başlangıç zarını yeniden at (3 reklam)' },
  abandon:  { perDay: 30, label: 'Hayatı silip yeniden başla (3 reklam)' },
  revive:   { perDay: 30, label: 'İkinci şans (3 reklam)' },
};

let provider = null; // async (kind) => boolean
export function setAdProvider(fn) { provider = fn; }

function counts(meta) {
  const t = todayKey();
  if (meta.ads.date !== t) meta.ads = { date: t, counts: {} };
  return meta.ads.counts;
}

export function adsLeft(meta, kind) {
  if (meta.settings.noAds) return Infinity;
  return Math.max(0, AD_LIMITS[kind].perDay - (counts(meta)[kind] || 0));
}

export async function showRewarded(meta, kind) {
  if (adsLeft(meta, kind) <= 0) return false;
  const ok = provider ? await provider(kind) : true;
  if (ok) { const c = counts(meta); c[kind] = (c[kind] || 0) + 1; }
  return ok;
}
