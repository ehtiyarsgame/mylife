// Çok dil desteği. Kaynak dil Türkçe; çeviri sözlüğü Türkçe metni anahtar olarak kullanır.
// - T("Devam") → "Continue"
// - Kalıplar: "Birikim: {0}" anahtarı, "Birikim: 1.250 🪙" metnini "Savings: 1,250 🪙" yapar ({0} içeriği de çevrilir).
// - " · " ile ayrılmış parçalar tek tek çevrilir.
// Arayüz (h(), textContent, canvas fillText) otomatik çevrilir; bu yüzden kodda T() çağrısı çoğu yerde gerekmez.

export const LANGS = [
  { id: 'tr', name: 'Türkçe', flag: '🇹🇷', locale: 'tr-TR' },
  { id: 'en', name: 'English', flag: '🇬🇧', locale: 'en-US' },
];
const KEY = 'hayatyolu.lang';
function detect() {
  try { const s = localStorage.getItem(KEY); if (s && LANGS.some(l => l.id === s)) return s; } catch {}
  const nav = (globalThis.navigator?.languages?.[0] || globalThis.navigator?.language || 'en').toLowerCase();
  return nav.startsWith('tr') ? 'tr' : 'en';
}
export let lang = detect();
export const locale = () => LANGS.find(l => l.id === lang)?.locale || 'en-US';
export function setLang(id) {
  try { localStorage.setItem(KEY, id); } catch {}
  lang = id;
}

let DICT = {};
let EXACT = new Map();
let PATTERNS = [];            // { re, out, keys }
const cache = new Map();

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Modüllerin kendi içinde taşıdığı iki dilli metinler (ör. mini oyun paketleri): B('Türkçe', 'English')
const EXTRA = {};
let BASE = null, dirty = false;
export function addDict(obj) { Object.assign(EXTRA, obj); if (BASE) dirty = true; }
export const EN = tr => EXTRA[tr] ?? tr; // B ile kaydedilmiş bir metnin İngilizcesi
export const B = (tr, en) => { if (en !== undefined && tr !== en) EXTRA[tr] = en; if (BASE) dirty = true; return tr; };
export function loadDict(dict) {
  BASE = dict || {};
  dirty = false;
  DICT = { ...EXTRA, ...BASE };
  EXACT = new Map();
  PATTERNS = [];
  cache.clear();
  for (const [k, v] of Object.entries(DICT)) {
    if (/\{\d+\}/.test(k)) {
      const parts = k.split(/(\{\d+\})/);
      let src = '^';
      const order = [];
      for (const p of parts) {
        const m = p.match(/^\{(\d+)\}$/);
        if (m) { src += '([\\s\\S]*?)'; order.push(+m[1]); } else src += esc(p);
      }
      const lit = k.replace(/\{\d+\}/g, '').replace(/\s+/g, '').length;
      if (lit < 2) continue;                       // "{0} {1}" gibi her şeye uyan kalıplar alınmaz
      PATTERNS.push({ re: new RegExp(src + '$'), out: v, order, lit, key: k });
    } else EXACT.set(k, v);
  }
  // Daha çok sabit metin içeren kalıp önce denenir (daha özgül)
  PATTERNS.sort((a, b) => b.lit - a.lit);
}

const HAS_LETTER = /\p{L}/u;
export function T(s, vars) {
  if (lang === 'tr' || s === null || s === undefined) return vars ? fill(String(s), vars) : s;
  const str = String(s);
  if (!HAS_LETTER.test(str)) return str;
  if (dirty) loadDict(BASE);
  let out = translate(str);
  return vars ? fill(out, vars) : out;
}
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);

function translate(str) {
  const hit = cache.get(str);
  if (hit !== undefined) return hit;
  let out = tr1(str);
  if (cache.size > 5000) cache.clear();
  cache.set(str, out);
  return out;
}
function tr1(str) {
  const e = EXACT.get(str);
  if (e !== undefined) return e;
  // Sayısal değerler (tahlil aralıkları vb.): Türkçe ondalık/binlik biçimini çevir
  // ("Orta 1/6", "Soru 1/5" gibi büyük harfle başlayan sözcük içerenler sayı sayılmaz)
  if (/^[%\d.,–\-\s/µ²₂a-zA-Z]+$/.test(str) && /\d/.test(str) && !/[a-z]{4,}/.test(str) && !/[A-Z][a-z]{2,}/.test(str)) return numFmt(str);
  const t = str.trim();
  if (t !== str) { const lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0]; return lead + translate(t) + trail; }
  // Baştaki emoji/simgeyi ayırıp dene
  const m = str.match(/^([^\p{L}\d"“'(]+)(.+)$/u);
  if (m) { const r = EXACT.get(m[2]); if (r !== undefined) return m[1] + r; }
  // Ayraç içeren metinde önce ayracı da içeren kalıplar denenir, olmazsa parçalara bölünür
  const sep = [' · ', '\n', ' — ', ' | '].find(x => str.includes(x));
  const r0 = tr1Pattern(str, sep);
  if (r0 !== null) return r0;
  if (m) { const r = tr1Pattern(m[2], sep); if (r !== null) return m[1] + r; }
  if (sep) {
    const parts = str.split(sep);
    // Sondaki ek (ör. ". Yıl sonunda bedeli var!") son parçaya yapışık olabilir
    return parts.map(x => translate(x)).join(sep);
  }
  return str;
}
function numFmt(s) {
  return s.replace(/(\d)\.(\d{3})/g, '$1\u0000$2').replace(/(\d),(\d)/g, '$1.$2').replace(/\u0000/g, ',')
    .replace(/\/dk\b/g, '/min').replace(/^%(\d[\d.–-]*)$/, '$1%');
}
function tr1Pattern(str, sep) {
  for (const p of PATTERNS) {
    if (sep && !p.key.includes(sep)) continue;
    const mm = str.match(p.re);
    if (!mm) continue;
    let o = p.out;
    p.order.forEach((idx, gi) => { o = o.split(`{${idx}}`).join(translate(mm[gi + 1])); });
    return o;
  }
  return null;
}

// Arayüzü otomatik çevir: textContent ataması ve canvas yazısı
let hooked = false;
export function installHooks() {
  if (hooked || lang === 'tr' || typeof window === 'undefined') return;
  hooked = true;
  const d = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  Object.defineProperty(Node.prototype, 'textContent', {
    configurable: true, enumerable: d.enumerable, get: d.get,
    set(v) { d.set.call(this, typeof v === 'string' ? T(v) : v); },
  });
  const C = globalThis.CanvasRenderingContext2D?.prototype;
  if (C) {
    const f = C.fillText, s = C.strokeText;
    C.fillText = function (t, ...a) { return f.call(this, typeof t === 'string' ? T(t) : t, ...a); };
    C.strokeText = function (t, ...a) { return s.call(this, typeof t === 'string' ? T(t) : t, ...a); };
  }
}
