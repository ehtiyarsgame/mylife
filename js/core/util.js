export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const round = (v, d = 0) => { const m = 10 ** d; return Math.round(v * m) / m; };
export const sleep = ms => new Promise(r => setTimeout(r, ms));

const tl = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
export function fmtTL(v) {
  const n = Math.round(v);
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' milyar TL';
  if (a >= 1e6) return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' milyon TL';
  return tl.format(n) + ' TL';
}
export const fmtNum = v => tl.format(Math.round(v));
export const signed = v => (v > 0 ? '+' : '') + fmtNum(v);

export function fmtTime(sec) {
  sec = Math.max(0, Math.ceil(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h) return `${h}sa ${String(m).padStart(2, '0')}dk`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Metin şablonu: "{ad} {yas} yaşında" gibi
export function tpl(str, vars) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

export function grade(score) {
  if (score >= 92) return { g: 'S', c: '#ffc53d' };
  if (score >= 80) return { g: 'A', c: '#5bd6a0' };
  if (score >= 65) return { g: 'B', c: '#4ea1ff' };
  if (score >= 45) return { g: 'C', c: '#c08cff' };
  return { g: 'D', c: '#ff5b7a' };
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Standart normal dağılımın kümülatif fonksiyonu (sınav sıralaması için)
export function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
