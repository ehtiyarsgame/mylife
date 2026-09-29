// Kaynak koddaki ekranda görünen Türkçe metinleri çıkarır → çeviri anahtarları.
// Kullanım: node scripts/i18n-extract.mjs [--missing en]   (eksik çevirileri listeler)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIRS = ['js/ui', 'js/sim', 'js/minigames', 'js/core', 'js'];
const SKIP = new Set(['js/minigames/engines3.js', 'js/minigames/engines4.js', 'js/minigames/pack_baby.js', 'js/minigames/pack_kid.js', 'js/minigames/pack_teen.js', 'js/minigames/pack_jobs.js', 'js/minigames/pack_adult.js', 'js/sim/qdata.js', 'js/sim/qgen.js', 'js/i18n', 'js/sim/names.js', 'js/core/i18n.js']);

// Basit JS tarayıcı: '...', "...", `...${}...` (iç içe) ve yorumları ayırt eder.
export function scan(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  const readQuoted = q => {
    let s = '';
    i++;
    while (i < n && src[i] !== q) {
      if (src[i] === '\\') { const c = src[i + 1]; s += c === 'n' ? '\n' : c; i += 2; continue; }
      if (src[i] === '\n') break;
      s += src[i++];
    }
    i++;
    return s;
  };
  const readTemplate = () => {
    // `...` → "metin {0} metin"; ${...} içindeki ifadeler özyinelemeli taranır
    let s = '', k = 0;
    i++;
    while (i < n && src[i] !== '`') {
      if (src[i] === '\\') { s += src[i + 1]; i += 2; continue; }
      if (src[i] === '$' && src[i + 1] === '{') {
        i += 2; let depth = 1; const start = i;
        while (i < n && depth) {
          const c = src[i];
          if (c === '{') depth++;
          else if (c === '}') { depth--; if (!depth) break; }
          else if (c === "'" || c === '"') { const t = readQuoted(c); out.push(t); continue; }
          else if (c === '`') { const t = readTemplate(); out.push(t); continue; }
          i++;
        }
        i++;
        s += `{${k++}}`;
        continue;
      }
      s += src[i++];
    }
    i++;
    return s;
  };
  let prevSig = '';
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 2; if (i < 2) break; continue; }
    if (c === '/' && /[(,=:[!&|?{};]|^$/.test(prevSig)) {
      // düzenli ifade değişmezi
      i++; let cls = false;
      while (i < n && (src[i] !== '/' || cls)) { if (src[i] === '\\') i++; else if (src[i] === '[') cls = true; else if (src[i] === ']') cls = false; i++; }
      i++; while (/[a-z]/.test(src[i])) i++;
      prevSig = 'r'; continue;
    }
    if (c === "'" || c === '"') { out.push(readQuoted(c)); prevSig = 's'; continue; }
    if (c === '`') { out.push(readTemplate()); prevSig = 's'; continue; }
    if (!/\s/.test(c)) prevSig = c;
    i++;
  }
  return out;
}

export function displayable(s) {
  if (!s || !/\p{L}/u.test(s)) return false;
  if (/^[a-z0-9_.\-#:%()/ ,]+$/.test(s) && !/\s[a-zçğıöşü]{3,}/.test(s) && !/[çğıöşü]/.test(s)) return false; // kimlik, css, seçici
  if (/^(div|span|button|input|h\d|p|b|i|canvas|svg|path)[.#]/.test(s)) return false;
  if (/^(primary|gold|ghost|sm|block|danger|green|accent|warn|tag|glow|ok|red|pos|neg|muted|small|tiny|center|row|col|grow|chip|card|tile|btn|lg|xs|wide|full|dim|hot|sel|on|off|active|done|locked|new|pulse|shake)( (primary|gold|ghost|sm|block|danger|green|accent|warn|tag|glow|ok|red|pos|neg|muted|small|tiny|center|row|col|grow|chip|card|tile|btn|lg|xs|wide|full|dim|hot|sel|on|off|active|done|locked|new|pulse|shake))*$/.test(s)) return false;
  if (/^(Nunito|system-ui|sans-serif|monospace|serif)/.test(s) || /\d+px (Nunito|sans)/.test(s)) return false;
  if (/^(pointer|touch|mouse|key)(down|up|move|leave|cancel|enter)$/.test(s)) return false;
  if (/^\.\.?\//.test(s) || /\.(js|json|svg|png|css)$/.test(s)) return false;
  if (/^(rgba?|hsla?|linear-gradient|repeat|calc|translate|scale|rotate|drop-shadow)\(/.test(s)) return false;
  if (/^\d+(px|%|ms|s|deg|em|rem|vh|vw)?( \d+(px|%)?)*$/.test(s)) return false;
  if (/^[A-Z_]+$/.test(s)) return false;
  if (/[<>]/.test(s) && /[<][a-z/]/.test(s)) return false;                         // HTML/SVG
  if (/(;|=>|===|\+\+|\) \{|^return |^let |^const |^for \(|^while \(|^function )/.test(s) && !/[çğıöşüÇĞİÖŞÜ]/.test(s)) return false; // kod satırı
  if (/^(translate|scale|rotate|grayscale|brightness|blur)/.test(s) || /^\d+ \d+ \d+px/.test(s)) return false;
  if (/^[a-z]+[A-Z][A-Za-z]*$/.test(s)) return false;                               // camelCase kimlik
  if (/^(mailto:|https?:)/.test(s) || /^[\w.]+@[\w.]+$/.test(s)) return false;
  if (/px (Nunito|sans-serif)/.test(s) || /^\{0\}px /.test(s)) return false;
  if (/^(\d+(px|%)? ?)+(solid|dashed)/.test(s) || /^\d+px /.test(s)) return false;
  return true;
}

function files() {
  const list = [];
  for (const d of DIRS) {
    let names = [];
    try { names = readdirSync(join(ROOT, d)); } catch { continue; }
    for (const f of names) if (f.endsWith('.js')) { const p = `${d}/${f}`; if (![...SKIP].some(x => p.startsWith(x))) list.push(p); }
  }
  return [...new Set(list)];
}

export function extract() {
  const keys = new Map();
  for (const f of files()) {
    const src = readFileSync(join(ROOT, f), 'utf8').replace(/\/\/ i18n-skip-start[\s\S]*?\/\/ i18n-skip-end/g, '');
    for (const s of scan(src)) {
      const t = s.trim();
      if (displayable(t) && !keys.has(t)) keys.set(t, f);
    }
  }
  return keys;
}

if (process.argv[1] && process.argv[1].endsWith('i18n-extract.mjs')) {
  const keys = extract();
  const lang = process.argv.includes('--missing') ? process.argv[process.argv.indexOf('--missing') + 1] : null;
  if (lang) {
    const { DICT } = await import(join(ROOT, `js/i18n/${lang}.js`));
    const miss = [...keys].filter(([k]) => !(k in DICT));
    const byFile = {};
    for (const [k, f] of miss) (byFile[f] ||= []).push(k);
    for (const f in byFile) { console.log(`// —— ${f} (${byFile[f].length})`); for (const k of byFile[f]) console.log(JSON.stringify(k)); }
    console.error(`eksik: ${miss.length} / ${keys.size}`);
  } else {
    const byFile = {};
    for (const [k, f] of keys) (byFile[f] ||= []).push(k);
    for (const f in byFile) console.log(f, byFile[f].length);
    console.log('toplam', keys.size);
  }
}
