import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, lerp, sleep } from '../core/util.js';

// ————————————————— PENALTI —————————————————
// 5 atış. 1) Nişan: göstergenin hareketini oku, dokun. 2) Güç: tatlı bölgede durdur.
// Kaleci bazen bir tarafa "eğilir" — ters köşeye vur. Zor maçlarda kaleci blöf yapar.
register({
  id: 'penalti', name: 'Penaltı', icon: '🥅',
  how: ['Nişangâh kalede dolaşır: istediğin noktadayken dokun.', 'Sonra güç çubuğunu yeşil bölgede durdur. Fazlası auta gider!', 'Kalecinin eğildiği tarafı izle, ters köşeye vur. Köşeler daha değerli.', '5 atış.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W = stage.clientWidth, H = stage.clientHeight;
      const shots = 5; let shot = 0, goals = 0, bonus = 0;
      let phase = 'aim', t = 0, aim = { x: 0, y: 0 }, power = 0, pDir = 1;
      let lean = 0, fake = false, ball = null, keeper = { x: 0, y: 0, tx: 0, ty: 0 }, msg = null, shake = 0;
      const slow = 1 - 0.45 * api.ease;
      const speed = (1.3 + api.diff * 2.3) * slow;
      const zoneW = clamp(0.3 - api.diff * 0.16 + api.ease * 0.08, 0.08, 0.34);
      const zone = [0.58, 0.58 + zoneW];
      const rain = api.mods.has('yagmur'), night = api.mods.has('gece'), crowd = api.mods.has('kalabalik') || api.mods.has('kritik');
      const G = () => ({ x0: W * 0.1, x1: W * 0.9, y0: H * 0.14, y1: H * 0.44 });
      const newShot = () => {
        phase = 'aim'; t = api.rng.float(0, 6); power = 0; ball = null; msg = null;
        lean = api.rng.chance(0.75) ? (api.rng.chance(0.5) ? -1 : 1) : 0;
        fake = api.rng.chance(api.diff * 0.45);
        const g = G(); keeper = { x: (g.x0 + g.x1) / 2, y: g.y1 - 30, tx: 0, ty: 0 };
        api.setScore(`${goals}/${shot}`);
        api.setTimer(1 - shot / shots);
      };
      newShot();
      const tap = () => {
        if (phase === 'aim') { phase = 'power'; api.sfx.tick(); return; }
        if (phase === 'power') {
          phase = 'fly'; api.sfx.kick(); api.vibrate(20);
          const g = G();
          let tx = aim.x, ty = aim.y;
          if (power > zone[1]) ty -= (power - zone[1]) * H * 0.9; // fazla güç → yukarı
          if (power < zone[0]) ty += (zone[0] - power) * H * 0.2;
          if (rain) { tx += api.rng.float(-14, 14); ty += api.rng.float(-10, 10); }
          ball = { x: W / 2, y: H * 0.82, sx: W / 2, sy: H * 0.82, tx, ty, p: 0, weak: power < zone[0] };
          // Kaleci kararı
          let side = lean || (api.rng.chance(0.5) ? -1 : 1);
          if (fake) side = -side;
          const readShot = api.rng.chance(0.12 + api.diff * 0.3);
          if (readShot) side = tx < (g.x0 + g.x1) / 2 ? -1 : 1;
          const cx = (g.x0 + g.x1) / 2;
          keeper.tx = cx + side * (g.x1 - g.x0) * 0.3;
          keeper.ty = lerp(g.y0, g.y1, api.rng.float(0.35, 0.8));
        }
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));

      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight;
        const g = G();
        t += dt;
        if (phase === 'aim') {
          const cx = (g.x0 + g.x1) / 2, cy = (g.y0 + g.y1) / 2;
          aim.x = cx + (g.x1 - g.x0) * 0.58 * Math.sin(t * speed * 1.1);
          aim.y = cy + (g.y1 - g.y0) * 0.62 * Math.sin(t * speed * 1.7 + 1.3);
          if (rain) { aim.x += Math.sin(t * 13) * 4; aim.y += Math.cos(t * 11) * 3; }
          keeper.x = (g.x0 + g.x1) / 2 + lean * (8 + Math.sin(t * 5) * 3);
        } else if (phase === 'power') {
          power += pDir * dt * (0.9 + api.diff * 1.1) * slow * 1.4;
          if (power >= 1) { power = 1; pDir = -1; } if (power <= 0) { power = 0; pDir = 1; }
        } else if (phase === 'fly' && ball) {
          ball.p = Math.min(1, ball.p + dt / 0.42);
          const e = 1 - (1 - ball.p) ** 2;
          ball.x = lerp(ball.sx, ball.tx, e); ball.y = lerp(ball.sy, ball.ty, e) - Math.sin(e * Math.PI) * 30;
          keeper.x = lerp(keeper.x, keeper.tx, dt * (6 + api.diff * 4));
          keeper.y = lerp(keeper.y, keeper.ty, dt * 6);
          if (ball.p >= 1) {
            phase = 'result'; shot++;
            const inGoal = ball.tx > g.x0 + 6 && ball.tx < g.x1 - 6 && ball.ty > g.y0 + 6 && ball.ty < g.y1;
            const reach = (g.x1 - g.x0) * (ball.weak ? 0.26 : 0.17);
            const saved = Math.hypot(ball.tx - keeper.tx, ball.ty - keeper.ty) < reach;
            if (!inGoal) { msg = { t: 'AUT!', c: '#ffb547' }; api.bad('Aut!'); }
            else if (saved) { msg = { t: 'KURTARDI!', c: '#ff5b7a' }; api.bad('Kurtardı!'); }
            else {
              goals++; msg = { t: 'GOL!', c: '#3ddc97' }; api.good('GOL!'); shake = crowd ? 12 : 6;
              const cornerX = Math.abs(ball.tx - (g.x0 + g.x1) / 2) / ((g.x1 - g.x0) / 2);
              const cornerY = 1 - (ball.ty - g.y0) / (g.y1 - g.y0);
              bonus += clamp((cornerX * 0.6 + cornerY * 0.4) * 4, 0, 4);
            }
            api.setScore(`${goals}/${shot}`);
            setTimeout(() => {
              if (shot >= shots) resolve(clamp(goals * 16 + bonus, 0, 100));
              else newShot();
            }, 1000);
          }
        }
        // ——— Çizim ———
        ctx.save();
        if (shake > 0) { ctx.translate(api.rng.float(-shake, shake), api.rng.float(-shake, shake)); shake *= 0.9; if (shake < 0.5) shake = 0; }
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#1b3b2a'); grd.addColorStop(1, '#2f8a4f');
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 8; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'transparent'; ctx.fillRect(0, H * 0.46 + i * H * 0.07, W, H * 0.07); }
        // tribün
        ctx.fillStyle = '#141a33'; ctx.fillRect(0, 0, W, g.y0 - 6);
        for (let i = 0; i < 60; i++) { ctx.fillStyle = `hsl(${(i * 47) % 360},60%,${crowd ? 60 : 40}%)`; ctx.fillRect((i * 37) % W, ((i * 13) % Math.max(1, g.y0 - 16)) + (crowd ? Math.sin(t * 8 + i) * 2 : 0), 4, 4); }
        // kale
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0);
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1;
        for (let x = g.x0; x < g.x1; x += 14) { ctx.beginPath(); ctx.moveTo(x, g.y0); ctx.lineTo(x, g.y1); ctx.stroke(); }
        for (let y = g.y0; y < g.y1; y += 14) { ctx.beginPath(); ctx.moveTo(g.x0, y); ctx.lineTo(g.x1, y); ctx.stroke(); }
        // ceza sahası
        ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2;
        ctx.strokeRect(W * 0.02, g.y1, W * 0.96, H * 0.26);
        ctx.beginPath(); ctx.arc(W / 2, H * 0.82, 3, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
        // kaleci
        ctx.save(); ctx.translate(keeper.x, keeper.y);
        const tilt = phase === 'fly' || phase === 'result' ? clamp((keeper.tx - (g.x0 + g.x1) / 2) / 80, -1.2, 1.2) : lean * 0.12;
        ctx.rotate(tilt);
        ctx.fillStyle = '#ffcf4d'; ctx.fillRect(-14, -30, 28, 34);
        ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(0, -40, 10, 0, 7); ctx.fill();
        ctx.fillStyle = '#ffcf4d'; ctx.fillRect(-34, -30, 20, 8); ctx.fillRect(14, -30, 20, 8);
        ctx.fillStyle = '#222'; ctx.fillRect(-12, 4, 9, 18); ctx.fillRect(3, 4, 9, 18);
        ctx.restore();
        // top
        const b = ball || { x: W / 2, y: H * 0.82, p: 0 };
        const r = lerp(13, 7, ball ? ball.p : 0);
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(b.x, (ball ? lerp(ball.sy, ball.ty, ball.p) : b.y) + r, r, r * 0.4, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 7); ctx.fill();
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(b.x, b.y, r * 0.35, 0, 7); ctx.fill();
        // nişangâh
        if (phase === 'aim' || phase === 'power') {
          ctx.strokeStyle = phase === 'aim' ? '#ff5b7a' : '#ffcf4d'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(aim.x, aim.y, 14, 0, 7); ctx.moveTo(aim.x - 22, aim.y); ctx.lineTo(aim.x + 22, aim.y); ctx.moveTo(aim.x, aim.y - 22); ctx.lineTo(aim.x, aim.y + 22); ctx.stroke();
        }
        // güç çubuğu
        if (phase === 'power') {
          const bx = W - 34, by = H * 0.5, bh = H * 0.36;
          ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(bx, by, 20, bh);
          ctx.fillStyle = 'rgba(61,220,151,.7)'; ctx.fillRect(bx, by + bh * (1 - zone[1]), 20, bh * (zone[1] - zone[0]));
          ctx.fillStyle = '#fff'; ctx.fillRect(bx - 4, by + bh * (1 - power) - 2, 28, 5);
          ctx.fillStyle = '#fff'; ctx.font = '800 12px Nunito, sans-serif'; ctx.fillText('GÜÇ', bx - 2, by - 8);
        }
        if (night) {
          const v = ctx.createRadialGradient(W / 2, H * 0.45, 40, W / 2, H * 0.45, W * 0.75);
          v.addColorStop(0, 'rgba(0,0,20,0)'); v.addColorStop(1, 'rgba(0,0,20,.72)');
          ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
        }
        if (rain) { ctx.strokeStyle = 'rgba(180,200,255,.35)'; ctx.lineWidth = 1; for (let i = 0; i < 50; i++) { const x = (i * 71 + t * 300) % W, y = (i * 53 + t * 900) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 12); ctx.stroke(); } }
        if (msg) { ctx.fillStyle = msg.c; ctx.font = '900 42px Nunito, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(msg.t, W / 2, H * 0.62); ctx.textAlign = 'left'; }
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '800 13px Nunito, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(phase === 'aim' ? 'Nişan al — dokun' : phase === 'power' ? 'Gücü ayarla — dokun' : '', W / 2, H * 0.96); ctx.textAlign = 'left';
        ctx.restore();
      });
    });
  },
});

// ————————————————— ÇALIM —————————————————
register({
  id: 'calim', name: 'Çalım', icon: '⚽',
  how: ['Topla ileri koşuyorsun; rakipler üstüne geliyor.', 'Sola/sağa kaydır ya da ekranın sol/sağ yarısına dokun.', '"!" işaretli rakipler son anda şerit değiştirir.', 'Rakip yakınken çalım atarsan KUSURSUZ bonus.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W = stage.clientWidth, H = stage.clientHeight;
      const lanes = 3; let lane = 1, px = 0.5, lives = 3;
      const defs = []; let spawnT = 0.6, passed = 0, spawned = 0, perfect = 0, scroll = 0, hitFlash = 0;
      const rain = api.mods.has('yagmur'), night = api.mods.has('gece');
      const baseV = 260 + api.diff * 260;
      const interval = clamp(1.05 - api.diff * 0.45 + api.ease * 0.15, 0.45, 1.2);
      const laneX = l => W * (0.2 + l * 0.3);
      const move = d => { lane = clamp(lane + d, 0, lanes - 1); api.sfx.whoosh(); const near = defs.find(o => !o.done && o.y > H * 0.58 && o.y < H * 0.8); if (near) { perfect++; api.feedback('KUSURSUZ!', '#ffc53d'); } };
      let sx = null;
      const down = e => { sx = e.clientX; };
      const up = e => {
        if (sx === null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 25) move(dx > 0 ? 1 : -1);
        else { const r = stage.getBoundingClientRect(); move(e.clientX - r.left < r.width / 2 ? -1 : 1); }
      };
      stage.addEventListener('pointerdown', down); stage.addEventListener('pointerup', up);
      api.onCleanup(() => { stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up); });
      const tm = api.timerLoop(30, () => finish());
      let over = false;
      const finish = () => {
        if (over) return; over = true; tm.stop();
        const ratio = spawned ? passed / spawned : 0;
        resolve(clamp(ratio * 80 + Math.min(20, perfect * 2.5) - (3 - lives) * 6, 0, 100));
      };
      api.setScore('❤️❤️❤️');
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight;
        const v = baseV * (1 + tm.elapsed() / 40);
        scroll = (scroll + v * dt) % 80;
        spawnT -= dt;
        if (spawnT <= 0) {
          spawnT = interval * api.rng.float(0.75, 1.25);
          const l = api.rng.int(0, lanes - 1);
          defs.push({ lane: l, x: laneX(l), y: -30, sw: api.rng.chance(0.1 + api.diff * 0.35), switched: false, done: false });
          spawned++;
          if (api.rng.chance(api.diff * 0.35)) { const l2 = (l + api.rng.int(1, 2)) % lanes; defs.push({ lane: l2, x: laneX(l2), y: -30 - api.rng.int(0, 40), sw: false, done: false }); spawned++; }
        }
        px = lerp(px, laneX(lane), dt * (rain ? 9 : 16));
        const py = H * 0.8;
        for (const o of defs) {
          o.y += v * dt;
          if (o.sw && !o.switched && o.y > H * 0.42) { o.switched = true; o.lane = clamp(o.lane + (o.lane === 0 ? 1 : o.lane === 2 ? -1 : (api.rng.chance(0.5) ? 1 : -1)), 0, 2); }
          o.x = lerp(o.x, laneX(o.lane), dt * 7);
          if (!o.done && Math.abs(o.y - py) < 26 && Math.abs(o.x - px) < W * 0.12) {
            o.done = true; lives--; hitFlash = 0.4; api.bad('Top kaptırdın!');
            api.setScore('❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(3 - Math.max(0, lives)));
            if (lives <= 0) finish();
          }
          if (!o.done && o.y > py + 30) { o.done = true; passed++; }
        }
        while (defs.length && defs[0].y > H + 40) defs.shift();
        // çizim
        ctx.fillStyle = '#2d8a4c'; ctx.fillRect(0, 0, W, H);
        for (let y = -80 + scroll; y < H; y += 80) { ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(0, y, W, 40); }
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.setLineDash([12, 12]); ctx.lineWidth = 2;
        for (let i = 1; i < lanes; i++) { const x = W * (0.05 + i * 0.3); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        ctx.setLineDash([]);
        for (const o of defs) {
          ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(o.x, o.y + 18, 16, 6, 0, 0, 7); ctx.fill();
          ctx.fillStyle = o.done && o.y < py ? '#888' : '#e84a5f'; ctx.beginPath(); ctx.arc(o.x, o.y, 17, 0, 7); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '900 13px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(o.sw && !o.switched ? '!' : '', o.x, o.y + 5);
        }
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(px, py + 20, 18, 6, 0, 0, 7); ctx.fill();
        ctx.fillStyle = hitFlash > 0 ? '#ff5b7a' : '#4ea1ff'; ctx.beginPath(); ctx.arc(px, py, 18, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py - 26, 8, 0, 7); ctx.fill();
        ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(px, py - 26, 3, 0, 7); ctx.fill();
        hitFlash = Math.max(0, hitFlash - dt);
        if (night) { const g = ctx.createRadialGradient(px, py, 30, px, py, H * 0.7); g.addColorStop(0, 'rgba(0,0,20,0)'); g.addColorStop(1, 'rgba(0,0,20,.8)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
        if (rain) { ctx.strokeStyle = 'rgba(180,200,255,.3)'; for (let i = 0; i < 40; i++) { const x = (i * 71) % W, y = (i * 53 + scroll * 12) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 10); ctx.stroke(); } }
        ctx.textAlign = 'left';
      });
    });
  },
});

// ————————————————— TAKTİK KARTI —————————————————
const TACTICS = {
  kontra: { n: 'Kontra atak', e: '⚡' }, kanat: { n: 'Kanat oyunu', e: '↔️' }, pres: { n: 'Önde pres', e: '🔥' },
  uzun: { n: 'Uzun top', e: '🎯' }, pas: { n: 'Kısa pas & sabır', e: '🔁' }, savunma: { n: 'Kapan', e: '🧱' }, duran: { n: 'Duran top', e: '📐' },
};
const SITUATIONS = [
  { t: 'Rakip çok önde oynuyor; savunmasının arkası bomboş.', good: ['kontra', 'uzun'], bad: ['pas'] },
  { t: 'Rakip ceza sahasına kapanmış, merkezi kilitlemiş.', good: ['kanat', 'duran'], bad: ['uzun', 'kontra'] },
  { t: 'Rakip stoperler baskı altında top çevirmekte zorlanıyor.', good: ['pres'], bad: ['savunma'] },
  { t: '1-0 öndesin, son dakikalar; rakip bütün oyuncularıyla yüklendi.', good: ['savunma', 'kontra'], bad: ['pres'] },
  { t: 'Rakip bekler sürekli hücuma çıkıyor, kanatlar boş kalıyor.', good: ['kanat', 'kontra'], bad: ['savunma'] },
  { t: 'Rakip oyuncular yoruldu, tempo düştü.', good: ['pres', 'pas'], bad: ['savunma'] },
  { t: 'Rakip kalecisi kısa boylu; hava toplarında zorlanıyor.', good: ['duran', 'kanat'], bad: ['pas'] },
  { t: 'Zemin çok ağır, kısa paslar yerde duruyor.', good: ['uzun', 'kanat'], bad: ['pas'] },
  { t: 'Rakip ortada sayıca üstün; topu kaptırıyoruz.', good: ['kanat', 'uzun'], bad: ['pres'] },
  { t: 'Rakip sert oynuyor; ceza sahası çevresinde çok faul yapıyor.', good: ['duran'], bad: ['uzun'] },
  { t: 'Skor 0-1 geride, rakip topu ayağında tutup zaman geçiriyor.', good: ['pres', 'kanat'], bad: ['savunma'] },
  { t: 'Rakibin forveti çok hızlı; arkaya kaçıyor.', good: ['savunma', 'pas'], bad: ['pres'] },
];
register({
  id: 'taktik', name: 'Taktik Kartı', icon: '📋',
  how: ['Maçın 6 kritik anında sahadaki durumu oku.', 'Elindeki 3 taktik kartından en uygununu seç.', 'Doğru taktik gol getirir; yanlışı gol yedirebilir.', 'Süre dolarsa kart rastgele oynanır!'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      let gf = 0, ga = 0, good = 0;
      const sits = api.rng.shuffle(SITUATIONS).slice(0, 6);
      const keys = Object.keys(TACTICS);
      for (let i = 0; i < 6; i++) {
        const S = sits[i];
        let hand = api.rng.shuffle(keys).slice(0, 3);
        if (!hand.some(k => S.good.includes(k)) && api.rng.chance(1 - api.diff * 0.45)) hand[api.rng.int(0, 2)] = api.rng.pick(S.good);
        const minute = (i + 1) * 15;
        const picked = await new Promise(res => {
          const tBar = h('i', { style: { width: '100%' } });
          const limit = (9 - api.diff * 4) * api.timeMul;
          const t0 = performance.now();
          let done = false;
          const iv = setInterval(() => {
            const f = 1 - (performance.now() - t0) / 1000 / limit;
            tBar.style.width = Math.max(0, f * 100) + '%';
            if (f <= 0 && !done) { done = true; clearInterval(iv); res(api.rng.pick(hand)); }
          }, 50);
          api.onCleanup(() => clearInterval(iv));
          stage.replaceChildren(h('div.col', { style: { gap: '12px' } },
            h('div.row', {}, h('span.chip.accent', {}, `⏱ ${minute}'`), h('span.grow'), h('b', { style: { fontSize: '22px' } }, `${gf} – ${ga}`)),
            h('div.bar', {}, tBar),
            h('div.qcard', { style: { fontSize: '16px' } }, '🗒️ ', S.t),
            h('div.qopts', {}, hand.map(k => h('button.qopt', { onclick: () => { if (done) return; done = true; clearInterval(iv); res(k); } }, TACTICS[k].e, '  ', TACTICS[k].n))),
          ));
        });
        const q = S.good.includes(picked) ? 'good' : S.bad.includes(picked) ? 'bad' : 'mid';
        if (q === 'good') good++;
        const pGoal = q === 'good' ? 0.5 + api.ease * 0.25 : q === 'mid' ? 0.18 + api.ease * 0.1 : 0.06;
        const pConcede = q === 'bad' ? 0.45 + api.diff * 0.2 : q === 'mid' ? 0.15 + api.diff * 0.15 : 0.05 + api.diff * 0.08;
        let text;
        if (api.rng.chance(pGoal)) { gf++; api.good('GOL!'); text = `⚽ ${TACTICS[picked].n} işe yaradı, GOL!`; }
        else if (api.rng.chance(pConcede)) { ga++; api.bad('Gol yedik'); text = `😣 ${TACTICS[picked].n} ters tepti, rakip gol buldu.`; }
        else text = q === 'good' ? `👍 Doğru hamle, rakibi sıkıştırdık.` : q === 'bad' ? '⚠️ Riskli bir karardı, şanslıydık.' : '… Oyun dengede.';
        api.setScore(`${gf}-${ga}`);
        stage.replaceChildren(h('div.qcard', { style: { fontSize: '16px' } }, text));
        await sleep(1100);
      }
      resolve(clamp(40 + (gf - ga) * 14 + good * 6, 0, 100));
    });
  },
});

// ————————————————— KONDİSYON —————————————————
register({
  id: 'kondisyon', name: 'Kondisyon', icon: '🏃',
  how: ['Basılı tut: tempo yükselir. Bırak: tempo düşer.', 'İbreyi hareket eden yeşil bölgenin içinde tut.', 'Bölgede kaldıkça puan dolar.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W, H, hold = false;
      let m = 0.3, mv = 0, z = 0.5, zt = 0.5, zTimer = 0, inside = 0, total = 0;
      const zh = clamp(0.26 - api.diff * 0.13 + api.ease * 0.07, 0.09, 0.3);
      const zSpeed = 0.6 + api.diff * 1.2;
      const d = () => { hold = true; }, u = () => { hold = false; };
      stage.addEventListener('pointerdown', d); window.addEventListener('pointerup', u);
      api.onCleanup(() => { stage.removeEventListener('pointerdown', d); window.removeEventListener('pointerup', u); });
      const tm = api.timerLoop(22, () => resolve(clamp(inside / Math.max(0.01, total) * 112, 0, 100)));
      api.loop((dt, now) => {
        W = stage.clientWidth; H = stage.clientHeight;
        zTimer -= dt;
        if (zTimer <= 0) { zTimer = api.rng.float(0.5, 1.6) / zSpeed; zt = api.rng.float(zh / 2, 1 - zh / 2); }
        z = lerp(z, zt, dt * zSpeed * 1.2);
        mv += (hold ? 2.4 : -2.0) * dt;
        mv *= 0.96;
        if (api.mods.has('yorgun')) mv *= 0.985;
        m = clamp(m + mv * dt, 0, 1);
        if (m === 0 || m === 1) mv = 0;
        total += dt;
        const inZ = Math.abs(m - z) < zh / 2;
        if (inZ) inside += dt;
        api.setScore(Math.round(inside / Math.max(0.01, total) * 100) + '%');
        // çizim
        ctx.fillStyle = '#131a36'; ctx.fillRect(0, 0, W, H);
        const bx = W / 2 - 40, by = 20, bh = H - 60;
        ctx.fillStyle = '#0a0d1c'; ctx.fillRect(bx, by, 80, bh);
        ctx.fillStyle = inZ ? 'rgba(61,220,151,.55)' : 'rgba(61,220,151,.3)';
        ctx.fillRect(bx, by + bh * (1 - z - zh / 2), 80, bh * zh);
        ctx.fillStyle = inZ ? '#fff' : '#ffb547';
        ctx.fillRect(bx - 12, by + bh * (1 - m) - 4, 104, 8);
        ctx.font = '40px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🏃', bx + 40 + Math.sin(now / 90) * 3, by + bh * (1 - m) - 12);
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '800 13px Nunito, system-ui, sans-serif';
        ctx.fillText(hold ? 'Tempo ↑' : 'Basılı tut', W / 2, H - 14);
        ctx.textAlign = 'left';
      });
    });
  },
});
