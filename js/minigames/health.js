import { register } from './engine.js';
import { h } from '../ui/dom.js';
import { clamp, lerp, sleep } from '../core/util.js';

// ————————————————— TEŞHİS —————————————————
// Her grup benzer şikâyetli hastalıklardan oluşur; testler ayırıcı bulguları açar.
const DX = [
  { c: 'Karın ağrısı', d: [
    { n: 'Apandisit', o: 'Göbek çevresinde başlayıp sağ alta kayan ağrı', m: 'Sağ alt karında hassasiyet, ateş 38 °C', k: 'Lökosit yüksek', g: 'USG: apendiks kalınlaşmış' },
    { n: 'Gastrit', o: 'Mide yanması, bulantı; aç kalınca artıyor', m: 'Mide üstünde hafif hassasiyet', k: 'Normal', g: 'Endoskopi: mide mukozası kızarık' },
    { n: 'Böbrek taşı', o: 'Böğürden kasığa vuran, kıvrandıran ağrı', m: 'Böğüre vurmakla şiddetli ağrı', k: 'İdrarda kan', g: 'BT: üreterde 6 mm taş' },
    { n: 'Safra kesesi iltihabı', o: 'Yağlı yemekten sonra sağ üst karın ağrısı', m: 'Murphy bulgusu pozitif', k: 'Karaciğer enzimleri hafif yüksek', g: 'USG: safra kesesinde taş, duvar kalın' },
  ] },
  { c: 'Ateş ve öksürük', d: [
    { n: 'Zatürre', o: 'Üç gündür yüksek ateş ve balgamlı öksürük', m: 'Sağ akciğer tabanında raller', k: 'CRP ve lökosit yüksek', g: 'Grafi: sağ alt lobda konsolidasyon' },
    { n: 'Grip', o: 'Ani başlayan ateş, kas ağrısı, halsizlik', m: 'Boğaz kızarık, akciğer temiz', k: 'Lökosit normal', g: 'Akciğer grafisi normal' },
    { n: 'Astım krizi', o: 'Nefes darlığı ve hışıltı, geceleri artıyor', m: 'Yaygın hışıltı, nefes verme uzamış', k: 'Eozinofil hafif yüksek', g: 'Grafi normal, havalanma artmış' },
    { n: 'Bronşit', o: 'Üç haftadır geçmeyen öksürük, ateş yok', m: 'Kaba ronküsler', k: 'Hafif CRP artışı', g: 'Akciğer grafisi normal' },
  ] },
  { c: 'Halsizlik ve baş ağrısı', d: [
    { n: 'Migren', o: 'Tek taraflı zonklayan ağrı, ışıktan rahatsızlık', m: 'Nörolojik muayene normal', k: 'Normal', g: 'MR normal' },
    { n: 'Menenjit', o: 'Yüksek ateş, şiddetli baş ağrısı, kusma', m: 'Ense sertliği pozitif', k: 'Lökosit çok yüksek', g: 'BT normal; beyin omurilik sıvısı bulanık' },
    { n: 'Demir eksikliği anemisi', o: 'Çabuk yorulma, baş dönmesi, çarpıntı', m: 'Soluk cilt, kırılgan tırnaklar', k: 'Hemoglobin ve ferritin düşük', g: 'Görüntüleme normal' },
    { n: 'Diyabet', o: 'Çok su içme, sık idrara çıkma, kilo kaybı', m: 'Ağız kuruluğu', k: 'Açlık kan şekeri 240 mg/dL', g: 'Görüntüleme normal' },
    { n: 'Hipertansiyon', o: 'Ense ağrısı, sabahları baş dönmesi', m: 'Tansiyon 170/105', k: 'Normal', g: 'EKG: kalp duvarı kalınlaşmış' },
  ] },
  { c: 'Göğüs ağrısı', d: [
    { n: 'Kalp krizi', o: 'Göğüste baskı, sol kola yayılıyor, soğuk ter', m: 'Soğuk terleme, nabız hızlı', k: 'Troponin yüksek', g: 'EKG: ST yükselmesi' },
    { n: 'Panik atak', o: 'Çarpıntı, ölüm korkusu, nefes nefese kalma', m: 'Nabız hızlı, diğer bulgular normal', k: 'Normal', g: 'EKG: yalnızca hızlı nabız' },
    { n: 'Reflü', o: 'Yemekten sonra göğüste yanma, yatınca artıyor', m: 'Muayene normal', k: 'Normal', g: 'EKG normal; endoskopide yemek borusu iltihabı' },
    { n: 'Kas zorlanması', o: 'Spor sonrası, hareketle artan ağrı', m: 'Göğüs duvarına bastırınca ağrı', k: 'Normal', g: 'EKG normal' },
  ] },
];
const TESTS = [['o', '🗣️ Öykü', 2], ['m', '🩺 Muayene', 3], ['k', '🧪 Kan', 4], ['g', '🩻 Görüntü', 5]];
register({
  id: 'teshis', name: 'Teşhis', icon: '🩺',
  how: ['Hastanın şikâyeti benzer hastalıklara uyar.', 'Öykü, muayene, kan ve görüntüleme ile ipucu topla — her test süre harcar.', 'Doğru teşhisi seç. Az testle doğru teşhis daha çok puan getirir.', '3 hasta.'],
  play(stage, api) {
    return new Promise(async resolve => {
      let pts = 0;
      const groups = api.rng.shuffle(DX);
      for (let i = 0; i < 3; i++) {
        const G = groups[i % groups.length];
        const opts = api.rng.shuffle(G.d).slice(0, 4);
        const D = api.rng.pick(opts);
        const age = api.rng.int(18, 75);
        const r = await new Promise(res => {
          let done = false, used = 0, penalty = 0;
          const limit = (28 - api.diff * 9 + api.ease * 6) * api.timeMul;
          const t0 = performance.now();
          const found = h('div.col', { style: { gap: '4px' } });
          const reveal = (k, label) => { found.append(h('div.small', {}, h('b', {}, label + ': '), D[k])); };
          const testBtns = TESTS.map(([k, label, cost]) => {
            const b = h('button.btn.sm', { onclick: () => { if (done || b.disabled) return; b.disabled = true; b.classList.add('disabled'); used++; penalty += cost; api.sfx.tick(); reveal(k, label); } }, `${label} (−${cost}sn)`);
            return b;
          });
          if (api.diff < 0.3) { testBtns[0].click(); used--; penalty -= 2; }
          stage.replaceChildren(h('div.col', {},
            h('div.row', {}, h('span', { style: { fontSize: '34px' } }, age > 60 ? '🧓' : '🧑'), h('div.grow', {}, h('b', {}, `${age} yaşında hasta`), h('div.small.muted', {}, `Şikâyet: ${G.c}`)), h('span.chip', {}, `${i + 1}/3`)),
            h('div.tile', {}, found.childNodes.length ? found : found),
            h('div.row', { style: { flexWrap: 'wrap', gap: '6px' } }, testBtns),
            h('div.small.muted', { style: { marginTop: '6px' } }, 'Teşhisin:'),
            h('div.qopts', {}, opts.map(o => h('button.qopt', { onclick: e => choose(o, e.currentTarget) }, o.n)))));
          const choose = (o, el) => {
            if (done) return; done = true;
            if (o === D) { el.classList.add('ok'); api.good('Doğru teşhis!'); res(20 + 13 * (1 - Math.max(0, used - 1) / 3)); }
            else { el.classList.add('no'); api.bad(`Doğrusu: ${D.n}`); res(0); }
          };
          const loop = () => {
            if (done) return;
            const f = 1 - ((performance.now() - t0) / 1000 + penalty) / limit;
            api.setTimer(f);
            if (f <= 0) { done = true; api.bad('Süre doldu'); res(0); return; }
            requestAnimationFrame(loop);
          };
          loop();
          api.onCleanup(() => { done = true; });
        });
        pts += r; api.setScore(Math.round(pts));
        await sleep(1100);
      }
      resolve(clamp(pts, 0, 100));
    });
  },
});

// ————————————————— AMELİYAT —————————————————
register({
  id: 'ameliyat', name: 'Hassas Ameliyat', icon: '🔪',
  how: ['Parmağını yeşil noktaya koy ve çizgiyi izleyerek sona götür.', 'Bant dışına çıkma: her an puan kaybettirir.', 'Elinin titremesini dengele. Stres ve zorluk titremeyi artırır.', '2 kesi.'],
  play(stage, api) {
    return new Promise(async resolve => {
      const { ctx } = api.canvas();
      let total = 0;
      for (let round = 0; round < 2; round++) {
        const W = stage.clientWidth, H = stage.clientHeight;
        const pts = [];
        const n = 5 + Math.round(api.diff * 2);
        for (let i = 0; i < n; i++) pts.push({ x: W * (0.12 + 0.76 * i / (n - 1)), y: H * (0.2 + 0.6 * api.rng.next()) });
        // Catmull-Rom örnekleme
        const path = [];
        for (let i = 0; i < n - 1; i++) {
          const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
          for (let t = 0; t < 1; t += 0.05) {
            const t2 = t * t, t3 = t2 * t;
            path.push({
              x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
              y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
            });
          }
        }
        path.push(pts[n - 1]);
        const band = clamp(24 - api.diff * 11 + api.ease * 8, 10, 30);
        const trem = (1.5 + api.diff * 6 + (api.mods.has('stresli') ? 3 : 0)) * (1 - api.ease * 0.55);
        let prog = 0, inside = 0, outside = 0, touching = false, fx = 0, fy = 0, tt = 0, started = false;
        const score = await new Promise(res => {
          const down = e => { const r = stage.getBoundingClientRect(); fx = e.clientX - r.left; fy = e.clientY - r.top; if (!started && Math.hypot(fx - path[0].x, fy - path[0].y) < 30) started = true; touching = started; };
          const move = e => { if (!touching) return; const r = stage.getBoundingClientRect(); fx = e.clientX - r.left; fy = e.clientY - r.top; };
          const up = () => { touching = false; };
          stage.addEventListener('pointerdown', down); stage.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
          const off = () => { stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
          api.onCleanup(off);
          let fin = false;
          const end = () => { if (fin) return; fin = true; off(); stopL(); tl.stop(); const acc = inside / Math.max(0.01, inside + outside); res(prog / (path.length - 1) * 55 + acc * 45 * (prog / (path.length - 1))); };
          const tl = api.timerLoop(13 - api.diff * 3 + api.ease * 3, end);
          const stopL = api.loop(dt => {
            tt += dt;
            const tx = fx + Math.sin(tt * 9.3) * trem + Math.sin(tt * 23) * trem * 0.4;
            const ty = fy + Math.cos(tt * 7.1) * trem + Math.cos(tt * 19) * trem * 0.4;
            if (touching) {
              let best = prog, bd = 1e9;
              for (let k = prog; k < Math.min(path.length, prog + 8); k++) { const d = Math.hypot(path[k].x - tx, path[k].y - ty); if (d < bd) { bd = d; best = k; } }
              if (bd < band) { inside += dt; prog = Math.max(prog, best); } else { outside += dt; if (api.rng.chance(dt * 4)) api.vibrate(10); }
              if (prog >= path.length - 1) end();
            }
            ctx.fillStyle = '#f6d9d0'; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(200,120,110,.25)'; for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc((i * 97) % W, (i * 61) % H, 20 + (i % 5) * 6, 0, 7); ctx.fill(); }
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(61,180,120,.35)'; ctx.lineWidth = band * 2; ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
            ctx.strokeStyle = '#2d6cdf'; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); path.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);
            ctx.strokeStyle = '#b3261e'; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= prog; i++) i ? ctx.lineTo(path[i].x, path[i].y) : ctx.moveTo(path[0].x, path[0].y); ctx.stroke();
            ctx.fillStyle = '#3ddc97'; ctx.beginPath(); ctx.arc(path[0].x, path[0].y, 12, 0, 7); ctx.fill();
            ctx.fillStyle = '#ff5b7a'; ctx.beginPath(); ctx.arc(path[path.length - 1].x, path[path.length - 1].y, 10, 0, 7); ctx.fill();
            if (touching) { ctx.font = '28px sans-serif'; ctx.fillText('🔪', tx - 4, ty - 4); }
            else { ctx.fillStyle = '#333'; ctx.font = '800 14px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(started ? 'Parmağını kaldırma!' : 'Yeşil noktadan başla', W / 2, H - 16); ctx.textAlign = 'left'; }
            api.setScore(Math.round(prog / (path.length - 1) * 100) + '%');
          });
        });
        total += score;
        score > 70 ? api.good('Temiz kesi') : api.bad('Dikkat!');
        await sleep(700);
      }
      resolve(total / 2);
    });
  },
});

// ————————————————— TRİYAJ —————————————————
function patient(rng, diff) {
  const cat = rng.weighted([['k', 3], ['s', 4], ['y', 4]]);
  const p = { cat };
  const bord = rng.chance(diff * 0.6);
  if (cat === 'k') {
    const type = rng.int(0, 3);
    p.bilinc = type === 0 ? 'Bilinçsiz' : rng.pick(['Açık', 'Konfüze']);
    p.solunum = type === 1 ? `Zor (${rng.int(32, 40)}/dk)` : `${rng.int(16, 26)}/dk`;
    p.nabiz = type === 2 ? rng.pick([rng.int(135, 160), rng.int(35, 44)]) : rng.int(90, 125);
    p.kanama = type === 3 ? 'Şiddetli' : rng.pick(['Yok', 'Az']);
    p.yurur = false; p.agri = rng.int(4, 10);
  } else if (cat === 's') {
    p.bilinc = 'Açık'; p.solunum = `${rng.int(16, 26)}/dk`; p.nabiz = rng.int(80, bord ? 128 : 115);
    p.kanama = rng.pick(['Yok', 'Orta']); p.yurur = false; p.agri = rng.int(bord ? 5 : 6, 9);
  } else {
    p.bilinc = 'Açık'; p.solunum = `${rng.int(14, 22)}/dk`; p.nabiz = rng.int(65, bord ? 112 : 100);
    p.kanama = rng.pick(['Yok', 'Az']); p.yurur = true; p.agri = rng.int(1, bord ? 7 : 5);
  }
  p.e = rng.pick(['🧑', '👩', '👨', '🧓', '👵', '👦']);
  return p;
}
register({
  id: 'triyaj', name: 'Acil Triyaj', icon: '🚑',
  how: ['KIRMIZI: bilinçsiz, solunum 30+ ve zor, şiddetli kanama ya da nabız 130+ / 45−.', 'SARI: yürüyemiyor ama stabil; orta kanama ya da ağrı 6+.', 'YEŞİL: yürüyebiliyor, stabil.', 'Hastalar hızla gelir — doğru renge ata!'],
  play(stage, api) {
    return new Promise(async resolve => {
      const N = 10;
      let ok = 0, danger = 0;
      for (let i = 0; i < N; i++) {
        const P = patient(api.rng, api.diff);
        const limit = (6.5 - api.diff * 2.5 + api.ease * 1.5) * api.timeMul;
        const ans = await new Promise(res => {
          let done = false;
          const pick = c => { if (done) return; done = true; tl.stop(); res(c); };
          const vit = (k, v, warn) => h('div.row.small', { style: { justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed var(--line)' } }, h('span.muted', {}, k), h('b', { style: { color: warn ? '#ff9db0' : '' } }, v));
          stage.replaceChildren(h('div.col', {},
            h('div.row', {}, h('span', { style: { fontSize: '40px' } }, P.e), h('div.grow', {}, h('b', {}, `Hasta ${i + 1}/${N}`), h('div.small.muted', {}, P.yurur ? 'Kendi yürüyerek geldi' : 'Sedyeyle getirildi'))),
            h('div.tile', {},
              vit('Bilinç', P.bilinc, P.bilinc !== 'Açık'),
              vit('Solunum', P.solunum, P.solunum.startsWith('Zor')),
              vit('Nabız', P.nabiz + '/dk', P.nabiz >= 130 || P.nabiz < 45),
              vit('Kanama', P.kanama, P.kanama === 'Şiddetli'),
              vit('Ağrı', P.agri + '/10', false)),
            h('div.row', { style: { gap: '8px', marginTop: '6px' } },
              h('button.btn.grow', { style: { background: '#d63a55' }, onclick: () => pick('k') }, 'KIRMIZI'),
              h('button.btn.grow', { style: { background: '#e0a526', color: '#2b1c00' }, onclick: () => pick('s') }, 'SARI'),
              h('button.btn.grow', { style: { background: '#2fa36b' }, onclick: () => pick('y') }, 'YEŞİL'))));
          const tl = api.timerLoop(limit / api.timeMul, () => pick(null));
        });
        if (ans === P.cat) { ok++; api.sfx.good(); }
        else { if (P.cat === 'k') danger++; api.bad(P.cat === 'k' ? 'Kritik hasta bekledi!' : 'Yanlış öncelik'); }
        api.setScore(`${ok}/${i + 1}`);
        await sleep(350);
      }
      resolve(clamp(ok / N * 100 - danger * 6, 0, 100));
    });
  },
});
