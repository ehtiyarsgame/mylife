// Mobil paket için web dosyalarını www/ klasörüne kopyalar (Capacitor webDir).
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const out = new URL('../www/', import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'manifest.webmanifest', 'css', 'js', 'data', 'icons', 'fonts']) {
  cpSync(new URL('../' + f, import.meta.url), new URL(f, out), { recursive: true });
}
// brand/ marka kitinin tamamıdır (PNG'ler, Nunito, basın görselleri): pakete yalnızca
// oyunun açılışta gerçekten istediği dosyalar girer, 2,5 MB'si değil.
for (const f of [
  'brand/ehtiyars-brand.css',
  'brand/ehtiyars-intro.js',
  'brand/ehtiyars-cross-promo.js',
  'brand/ehtiyars-mark.svg',
  'brand/ehtiyars-wordmark.svg',
  'brand/games',
]) {
  cpSync(new URL('../' + f, import.meta.url), new URL(f, out), { recursive: true });
}
console.log('www/ hazır');
