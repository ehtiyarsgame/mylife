// Kısa biçimli çeviri dosyalarını (id: {t, x, l, o:[[metin, sonuç, "S:başarı", "F:başarısızlık"]]}) data/events.<dil>.json'a dönüştürür.
// Kullanım: node scripts/i18n-events.mjs en parça1.json parça2.json …
import { readFileSync, writeFileSync } from 'node:fs';
const [lang, ...files] = process.argv.slice(2);
const E = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url)));
const byId = Object.fromEntries(E.map(c => [c.id, c]));
const out = {};
let miss = 0;
for (const f of files) {
  const part = JSON.parse(readFileSync(f, 'utf8'));
  for (const [id, x] of Object.entries(part)) {
    const c = byId[id];
    if (!c) { console.error('bilinmeyen kart', id); continue; }
    if ((x.o || []).length !== (c.options || []).length) console.error('seçenek sayısı farklı', id);
    out[id] = { title: x.t, text: x.x, ...(x.l ? { log: x.l } : {}), options: (x.o || []).map(o => {
      const r = { text: o[0] };
      if (o[1]) r.result = o[1];
      for (const s of o.slice(2)) { if (s.startsWith('S:')) r.success = s.slice(2); else if (s.startsWith('F:')) r.fail = s.slice(2); }
      return r;
    }) };
  }
}
for (const c of E) if (!out[c.id]) { miss++; console.error('çevrilmemiş kart', c.id); }
writeFileSync(new URL(`../data/events.${lang}.json`, import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log(`${Object.keys(out).length} kart yazıldı, ${miss} eksik`);
