// Gerçek zamanlı dolan enerji. Oyun kapalıyken de dolar (zaman damgasıyla hesaplanır).
import { CONFIG } from '../config.js';

export function regenSeconds(meta) {
  return meta?.settings?.testEnergy ? CONFIG.energy.testRegenSeconds : CONFIG.energy.regenSeconds;
}

export function initEnergy(now = Date.now()) {
  return { value: CONFIG.energy.max, max: CONFIG.energy.max, ts: now };
}

// Geçen süreye göre enerjiyi günceller. Değişti mi döner.
export function tickEnergy(energy, meta, now = Date.now()) {
  const per = regenSeconds(meta) * 1000;
  if (energy.value >= energy.max) { energy.ts = now; return false; }
  const gained = Math.floor((now - energy.ts) / per);
  if (gained <= 0) return false;
  energy.value = Math.min(energy.max, energy.value + gained);
  energy.ts = energy.value >= energy.max ? now : energy.ts + gained * per;
  return true;
}

export function secondsToNext(energy, meta, now = Date.now()) {
  if (energy.value >= energy.max) return 0;
  const per = regenSeconds(meta) * 1000;
  return (per - (now - energy.ts)) / 1000;
}

export function secondsToFull(energy, meta, now = Date.now()) {
  if (energy.value >= energy.max) return 0;
  return secondsToNext(energy, meta, now) + (energy.max - energy.value - 1) * regenSeconds(meta);
}

export function spendEnergy(energy, amount, now = Date.now()) {
  if (energy.value < amount) return false;
  if (energy.value >= energy.max) energy.ts = now; // dolu bardan harcayınca sayaç şimdi başlar
  energy.value -= amount;
  return true;
}

export function addEnergy(energy, amount, allowOver = true) {
  const cap = allowOver ? energy.max * 1.5 : energy.max;
  energy.value = Math.min(cap, energy.value + amount);
}
