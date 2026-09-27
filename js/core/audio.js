// Ses dosyası olmadan, WebAudio ile üretilen kısa efektler ve titreşim.
let ctx = null;
let enabled = true;
let haptics = true;

export function setAudio(opts) {
  if ('sound' in opts) enabled = opts.sound;
  if ('haptics' in opts) haptics = opts.haptics;
}

function ac() {
  if (!ctx) {
    const C = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur = 0.1, type = 'sine', vol = 0.12, when = 0, slide = 0) {
  if (!enabled) return;
  const a = ac(); if (!a) return;
  const t = a.currentTime + when;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  tap:    () => tone(660, 0.05, 'triangle', 0.06),
  good:   () => { tone(660, 0.08, 'triangle'); tone(990, 0.12, 'triangle', 0.1, 0.07); },
  bad:    () => tone(220, 0.22, 'sawtooth', 0.07, 0, -80),
  coin:   () => { tone(1320, 0.06, 'square', 0.05); tone(1760, 0.1, 'square', 0.05, 0.05); },
  tick:   () => tone(1200, 0.03, 'square', 0.03),
  whoosh: () => tone(300, 0.18, 'sine', 0.08, 0, 500),
  kick:   () => tone(120, 0.12, 'sine', 0.2, 0, -60),
  level:  () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, 'triangle', 0.09, i * 0.09)),
  rare:   () => [659, 880].forEach((f, i) => tone(f, 0.2, 'sine', 0.08, i * 0.1)),
  epic:   () => [523, 784, 1046].forEach((f, i) => tone(f, 0.25, 'triangle', 0.09, i * 0.11)),
  legend: () => [392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.35, 'triangle', 0.1, i * 0.1)),
  note:   (i) => tone([262, 330, 392, 523][i % 4], 0.15, 'triangle', 0.1),
};

export function vibrate(pattern) {
  if (!haptics) return;
  try { navigator.vibrate?.(pattern); } catch {}
}
