// icons/icon.svg ve icons/studio.svg'den Android ikon ve açılış görsellerini üretir (Playwright ile).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const res = path.join(root, 'android/app/src/main/res');
const icon = fs.readFileSync(path.join(root, 'icons/icon.svg'), 'utf8');
const studio = fs.readFileSync(path.join(root, 'icons/studio.svg'), 'utf8');
const square = icon.replace(/rx="112"/g, 'rx="0"');
const b64 = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const shot = async (html, w, h, file) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
    await p.waitForTimeout(50);
    await p.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  };
  const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  for (const [d, s] of Object.entries(sizes)) {
    const dir = path.join(res, 'mipmap-' + d);
    await shot(`<img src="${b64(icon)}" width="${s}" height="${s}">`, s, s, path.join(dir, 'ic_launcher.png'));
    await shot(`<img src="${b64(square)}" width="${s}" height="${s}" style="border-radius:50%">`, s, s, path.join(dir, 'ic_launcher_round.png'));
    const f = Math.round(s * 108 / 48);
    await shot(`<img src="${b64(square)}" width="${f}" height="${f}">`, f, f, path.join(dir, 'ic_launcher_foreground.png'));
  }
  // Açılış görselleri
  const splash = (w, h) => {
    const m = Math.min(w, h);
    return `<div style="width:${w}px;height:${h}px;background:radial-gradient(circle at 50% 42%,#2a2470,#0d1020 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif">
      <img src="${b64(icon)}" style="width:${m * 0.34}px;height:${m * 0.34}px">
      <div style="margin-top:${m * 0.04}px;font-weight:900;font-size:${m * 0.09}px;color:#e6e2ff">Hayat Yolu</div>
      <div style="margin-top:${m * 0.03}px;display:flex;align-items:center;gap:${m * 0.015}px;color:#98a1c8;font-weight:800;letter-spacing:${m * 0.006}px;font-size:${m * 0.032}px"><img src="${b64(studio)}" style="width:${m * 0.06}px">EHTIYARS GAME</div></div>`;
  };
  for (const dir of fs.readdirSync(res).filter(x => x.startsWith('drawable'))) {
    const f = path.join(res, dir, 'splash.png');
    if (!fs.existsSync(f)) continue;
    const buf = fs.readFileSync(f);
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    await shot(splash(w, h), w, h, f);
  }
  // Mağaza / paylaşım için büyük ikon
  fs.mkdirSync(path.join(root, 'store'), { recursive: true });
  await shot(`<img src="${b64(square)}" width="512" height="512">`, 512, 512, path.join(root, 'store/icon-512.png'));
  await shot(splash(1024, 500), 1024, 500, path.join(root, 'store/feature-1024x500.png'));
  await b.close();
  console.log('Android görselleri üretildi');
})();
