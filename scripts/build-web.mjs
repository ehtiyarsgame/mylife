// Mobil paket için web dosyalarını www/ klasörüne kopyalar (Capacitor webDir).
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const out = new URL('../www/', import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'manifest.webmanifest', 'css', 'js', 'data', 'icons', 'fonts']) {
  cpSync(new URL('../' + f, import.meta.url), new URL(f, out), { recursive: true });
}
console.log('www/ hazır');
