// icons/icon.svg ve icons/studio.svg'den Android ikon ve açılış görsellerini üretir (Playwright ile).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const res = path.join(root, 'android/app/src/main/res');
const icon = fs.readFileSync(path.join(root, 'icons/icon.svg'), 'utf8');
const studio = fs.readFileSync(path.join(root, 'brand/ehtiyars-logo-horizontal-dark.svg'), 'utf8');
const square = icon.replace(/rx="112"/g, 'rx="0"');
const b64 = s => 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64');
const fontCss = `<style>@font-face{font-family:Nunito;font-weight:900;src:url(data:font/ttf;base64,${fs.readFileSync(path.join(root, 'brand/fonts/Nunito-Black.ttf')).toString('base64')})}@font-face{font-family:Nunito;font-weight:800;src:url(data:font/ttf;base64,${fs.readFileSync(path.join(root, 'brand/fonts/Nunito-ExtraBold.ttf')).toString('base64')})}</style>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const shot = async (html, w, h, file) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><head>${fontCss}</head><body style="margin:0;background:transparent">${html}</body></html>`);
    await p.evaluate(() => document.fonts.ready);
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
  // Açılış görselleri: varsayılan İngilizce (Life Path), values-tr için Türkçe (Hayat Yolu)
  const splash = (w, h, name) => {
    const m = Math.min(w, h);
    return `<div style="width:${w}px;height:${h}px;background:radial-gradient(circle at 50% 42%,#2a2470,#0d1020 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Nunito,sans-serif;position:relative">
      <img src="${b64(icon)}" style="width:${m * 0.34}px;height:${m * 0.34}px">
      <div style="margin-top:${m * 0.04}px;font-weight:900;font-size:${m * 0.09}px;color:#e6e2ff">${name}</div>
      <img src="${b64(studio)}" style="position:absolute;bottom:${h * 0.07}px;height:${m * 0.075}px"></div>`;
  };
  for (const dir of fs.readdirSync(res).filter(x => x.startsWith('drawable') && !x.includes('-tr'))) {
    const f = path.join(res, dir, 'splash.png');
    if (!fs.existsSync(f)) continue;
    const buf = fs.readFileSync(f);
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    await shot(splash(w, h, 'Life Path'), w, h, f);
    const trDir = path.join(res, dir.replace(/^drawable/, 'drawable-tr'));
    fs.mkdirSync(trDir, { recursive: true });
    await shot(splash(w, h, 'Hayat Yolu'), w, h, path.join(trDir, 'splash.png'));
  }
  // Mağaza görselleri
  fs.mkdirSync(path.join(root, 'store'), { recursive: true });
  await shot(`<img src="${b64(square)}" width="512" height="512">`, 512, 512, path.join(root, 'store/icon-512.png'));
  const feature = name => `<div style="width:1024px;height:500px;background:radial-gradient(circle at 30% 45%,#3a2f8f,#0d1020 72%);display:flex;align-items:center;gap:48px;padding-left:90px;box-sizing:border-box;font-family:Nunito,sans-serif">
      <img src="${b64(icon)}" style="width:260px;height:260px;filter:drop-shadow(0 16px 40px rgba(0,0,0,.5))">
      <div><div style="font-weight:900;font-size:84px;color:#fff;line-height:1">${name}</div>
      <div style="margin-top:14px;font-weight:800;font-size:30px;color:#c9c2ff">${name === 'Hayat Yolu' ? 'Bir ömür, binlerce karar' : 'One life, a thousand choices'}</div>
      <img src="${b64(studio)}" style="height:44px;margin-top:34px"></div></div>`;
  await shot(feature('Life Path'), 1024, 500, path.join(root, 'store/feature-1024x500-en.png'));
  await shot(feature('Hayat Yolu'), 1024, 500, path.join(root, 'store/feature-1024x500-tr.png'));
  await b.close();
  console.log('Android görselleri üretildi');
})();
