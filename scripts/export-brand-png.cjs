// brand/*.svg → brand/png/*.png (şeffaf ve zeminli). Playwright gerekir.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs'); const path = require('path');
const B = path.join(__dirname, '../brand/');
const OUT = B + 'png/';
const jobs = [
  // [kaynak, çıktı, genişlik, yükseklik, zemin]
  ['ehtiyars-mark.svg', 'ehtiyars-mark-1024.png', 1024, 1024],
  ['ehtiyars-mark.svg', 'ehtiyars-mark-512.png', 512, 512],
  ['ehtiyars-mark.svg', 'ehtiyars-mark-192.png', 192, 192],
  ['ehtiyars-mark.svg', 'ehtiyars-mark-96.png', 96, 96],
  ['ehtiyars-logo-horizontal-dark.svg', 'ehtiyars-logo-horizontal-dark.png', 2000],
  ['ehtiyars-logo-horizontal-light.svg', 'ehtiyars-logo-horizontal-light.png', 2000],
  ['ehtiyars-logo-stacked-dark.svg', 'ehtiyars-logo-stacked-dark.png', 1440],
  ['ehtiyars-logo-stacked-light.svg', 'ehtiyars-logo-stacked-light.png', 1440],
  ['ehtiyars-wordmark-dark.svg', 'ehtiyars-wordmark-dark.png', 1600],
  ['ehtiyars-wordmark-light.svg', 'ehtiyars-wordmark-light.png', 1600],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  for (const [src, out, w, hh, bg] of jobs) {
    const svg = fs.readFileSync(B + src, 'utf8');
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const h = hh || Math.round(w * vb[2] / vb[1]);
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;background:${bg || 'transparent'}"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" style="width:${w}px;height:${h}px;display:block"></body></html>`);
    await p.waitForTimeout(80);
    await p.screenshot({ path: OUT + out, omitBackground: !bg });
  }
  // Sosyal medya profil görseli (kare, koyu zemin) ve kapak (1500×500)
  const mark = 'data:image/svg+xml;base64,' + fs.readFileSync(B + 'ehtiyars-mark.svg').toString('base64');
  const hor = 'data:image/svg+xml;base64,' + fs.readFileSync(B + 'ehtiyars-logo-horizontal-dark.svg').toString('base64');
  await p.setViewportSize({ width: 1024, height: 1024 });
  await p.setContent(`<body style="margin:0;width:1024px;height:1024px;background:radial-gradient(circle at 50% 40%,#2a2470,#0d1020 72%);display:grid;place-items:center"><img src="${mark}" style="width:800px"></body>`);
  await p.waitForTimeout(80); await p.screenshot({ path: OUT + 'ehtiyars-avatar-1024.png' });
  await p.setViewportSize({ width: 1500, height: 500 });
  await p.setContent(`<body style="margin:0;width:1500px;height:500px;background:radial-gradient(circle at 30% 50%,#2a2470,#0d1020 70%);display:grid;place-items:center"><img src="${hor}" style="height:230px"></body>`);
  await p.waitForTimeout(80); await p.screenshot({ path: OUT + 'ehtiyars-banner-1500x500.png' });
  await b.close();
  console.log('brand/png hazır');
})();
