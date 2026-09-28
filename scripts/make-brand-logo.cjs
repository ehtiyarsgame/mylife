// Ehtiyars Game logo varyantlarını üretir: brand/ehtiyars-mark.svg + Nunito → yola çevrilmiş yazılı logolar.
// Kullanım: npm i --no-save opentype.js@1.3.4 && node scripts/make-brand-logo.cjs && node scripts/export-brand-png.cjs
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const B = path.join(__dirname, '../brand/');
const f900 = opentype.parse(fs.readFileSync(B + 'fonts/Nunito-Black.ttf').buffer);
const f800 = opentype.parse(fs.readFileSync(B + 'fonts/Nunito-ExtraBold.ttf').buffer);
const mark = fs.readFileSync(B + 'ehtiyars-mark.svg', 'utf8');
const markInner = mark.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
// Harf aralıklı metni yola çevir; genişliği döndür
function text(font, str, x, y, size, spacing) {
  const opt = { letterSpacing: spacing / size, kerning: true };
  const path = font.getPath(str, x, y, size, opt);
  const d = path.toPathData(2);
  if (d.includes('NaN')) console.log('NaN in', str, x, size);
  return { d, w: font.getAdvanceWidth(str, size, opt) - spacing };
}
// Glifler tembel yüklenir: ilk ölçüm NaN verir, önce ısıt
for (const f of [f900, f800]) for (const ch of 'EHTIYARS GAME') { const g = f.charToGlyph(ch); g.getPath(0, 0, 10); }
const grad = `<linearGradient id="eg-txt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb23e"/><stop offset="1" stop-color="#ff6f7d"/></linearGradient>`;
function horizontal(dark) {
  const main = dark ? '#ffffff' : '#1a1440';
  const t1 = text(f900, 'EHTIYARS', 0, 0, 150, 6);
  const t2 = text(f800, 'GAME', 0, 0, 74, 22);
  const H = 240, markS = 240, gap = 44, x0 = markS + gap;
  const t1p = text(f900, 'EHTIYARS', x0, 142, 150, 6);
  const t2p = text(f800, 'GAME', x0 + 4, 222, 74, 22);
  const W = Math.ceil(x0 + Math.max(t1.w, t2.w) + 10);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${grad}</defs>
  <g transform="scale(${markS / 512})">${markInner}</g>
  <path d="${t1p.d}" fill="${main}"/>
  <path d="${t2p.d}" fill="url(#eg-txt)"/>
</svg>`;
}
function stacked(dark) {
  const main = dark ? '#ffffff' : '#1a1440';
  const W = 720;
  const a = text(f900, 'EHTIYARS', 0, 0, 120, 5), b = text(f800, 'GAME', 0, 0, 60, 20);
  const t1 = text(f900, 'EHTIYARS', (W - a.w) / 2, 560, 120, 5);
  const t2 = text(f800, 'GAME', (W - b.w) / 2, 640, 60, 20);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 670" width="${W}" height="670">
  <defs>${grad}</defs>
  <g transform="translate(${(W - 420) / 2} 0) scale(${420 / 512})">${markInner}</g>
  <path d="${t1.d}" fill="${main}"/>
  <path d="${t2.d}" fill="url(#eg-txt)"/>
</svg>`;
}
// Uygulama içi küçük kullanım için yalnızca yazı (tek satır)
function wordmark(dark) {
  const main = dark ? '#ffffff' : '#1a1440';
  const a = text(f900, 'EHTIYARS ', 0, 90, 100, 4);
  const b = text(f800, 'GAME', a.w + 24, 90, 100, 10);
  const W = Math.ceil(a.w + 24 + b.w + 6);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 110" width="${W}" height="110">
  <defs>${grad}</defs>
  <path d="${a.d}" fill="${main}"/>
  <path d="${b.d}" fill="url(#eg-txt)"/>
</svg>`;
}
fs.writeFileSync(B + 'ehtiyars-logo-horizontal-dark.svg', horizontal(true));
fs.writeFileSync(B + 'ehtiyars-logo-horizontal-light.svg', horizontal(false));
fs.writeFileSync(B + 'ehtiyars-logo-stacked-dark.svg', stacked(true));
fs.writeFileSync(B + 'ehtiyars-logo-stacked-light.svg', stacked(false));
fs.writeFileSync(B + 'ehtiyars-wordmark-dark.svg', wordmark(true));
fs.writeFileSync(B + 'ehtiyars-wordmark-light.svg', wordmark(false));
console.log('ok');
