// Futbol mini oyunları (görsel ve fizik ağırlıklı): Kafa Vuruşu, Frikik.
// Sonuç her zaman ekranda görünür: kaleci gerçekten uzanır, top gerçekten ağlara/direğe/auta gider.
import { register } from './engine.js';
import { clamp, lerp } from '../core/util.js';

// ——— Ortak çizim yardımcıları ———
function pitch(ctx, W, H) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2c7a45'); g.addColorStop(1, '#3a9a58');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 8; i++) if (i % 2) { ctx.fillStyle = 'rgba(255,255,255,.035)'; ctx.fillRect(0, i * H / 8, W, H / 8); }
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.12, H * 0.25, W * 0.76, H * 0.3);          // ceza sahası
  ctx.strokeRect(W * 0.3, H * 0.25, W * 0.4, H * 0.1);             // kale alanı
  ctx.beginPath(); ctx.arc(W / 2, H * 0.55, W * 0.14, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(W / 2, H * 0.45, 2.5, 0, 7); ctx.fill();
}
function goalBox(W, H) { return { x0: W * 0.22, x1: W * 0.78, top: H * 0.07, bot: H * 0.25 }; }
function drawGoal(ctx, g, ripple = 0, rx = 0, rh = 0.5) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(g.x0, g.top, g.x1 - g.x0, g.bot - g.top);
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1;
  const cols = 14, rows = 6;
  for (let i = 1; i < cols; i++) {
    const x = lerp(g.x0, g.x1, i / cols);
    const bulge = ripple * 10 * Math.exp(-Math.abs(x - rx) / 30);
    ctx.beginPath(); ctx.moveTo(x, g.top); ctx.quadraticCurveTo(x, lerp(g.top, g.bot, rh) - bulge, x, g.bot); ctx.stroke();
  }
  for (let j = 1; j < rows; j++) { const y = lerp(g.top, g.bot, j / rows); ctx.beginPath(); ctx.moveTo(g.x0, y); ctx.lineTo(g.x1, y); ctx.stroke(); }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(g.x0, g.bot); ctx.lineTo(g.x0, g.top); ctx.lineTo(g.x1, g.top); ctx.lineTo(g.x1, g.bot); ctx.stroke();
  ctx.restore();
}
// Kaleci: dive -1..1 (sol/sağ uzanma), reach yüksekliği
function drawKeeper(ctx, x, y, dive = 0, lift = 0) {
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(dive * 1.2);
  ctx.fillStyle = '#ffcf4d'; ctx.fillRect(-9, -26, 18, 26);                 // forma
  ctx.fillStyle = '#1b1b1b'; ctx.fillRect(-9, 0, 7, 12); ctx.fillRect(2, 0, 7, 12);
  ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(0, -33, 7, 0, 7); ctx.fill();
  ctx.strokeStyle = '#ffcf4d'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const arm = 16 + Math.abs(dive) * 8;
  ctx.beginPath(); ctx.moveTo(-8, -22); ctx.lineTo(-arm, -30 - Math.abs(dive) * 10); ctx.moveTo(8, -22); ctx.lineTo(arm, -30 - Math.abs(dive) * 10); ctx.stroke();
  ctx.fillStyle = '#4ea1ff'; ctx.beginPath(); ctx.arc(-arm, -30 - Math.abs(dive) * 10, 4.5, 0, 7); ctx.arc(arm, -30 - Math.abs(dive) * 10, 4.5, 0, 7); ctx.fill();
  ctx.restore();
}
function drawPlayer(ctx, x, y, jump = 0, color = '#4ea1ff', num = '9') {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, y + 16, 14, 5, 0, 0, 7); ctx.fill();
  const yy = y - jump;
  ctx.fillStyle = color; ctx.fillRect(x - 11, yy - 30, 22, 30);
  ctx.fillStyle = '#fff'; ctx.font = '800 12px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; if (num) ctx.fillText(num, x, yy - 11);
  ctx.fillStyle = '#1b1b1b'; ctx.fillRect(x - 10, yy, 8, 14); ctx.fillRect(x + 2, yy, 8, 14);
  ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(x, yy - 40, 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#3b2a1c'; ctx.beginPath(); ctx.arc(x, yy - 44, 9, Math.PI, 0); ctx.fill();
}
function drawBall(ctx, x, y, r = 8, spin = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, 7); ctx.fill();
  for (let k = 0; k < 5; k++) { const a = k * 1.2566; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78, r * 0.18, 0, 7); ctx.fill(); }
  ctx.restore();
}
function shadow(ctx, x, y, s = 1) { ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x, y, 8 * s, 3 * s, 0, 0, 7); ctx.fill(); }
function banner(ctx, W, H, text, color, t) {
  const s = 1 + Math.max(0, 0.35 - t) * 1.6;
  ctx.save(); ctx.translate(W / 2, H * 0.43); ctx.scale(s, s);
  ctx.font = '900 44px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,.45)';
  ctx.strokeText(text, 0, 0); ctx.fillStyle = color; ctx.fillText(text, 0, 0); ctx.restore();
}
const RES = { GOL: ['GOL!', '#3ddc97'], KURTARDI: ['KURTARDI', '#ffcf4d'], DIREK: ['DİREK!', '#ffb547'], AUT: ['AUT', '#ff8a5b'], UST: ['ÜSTTEN', '#ff8a5b'], ISKA: ['ISKA', '#ff5b7a'] };

// ————————————————— KAFA VURUŞU —————————————————
register({
  id: 'kafa', name: 'Kafa Vuruşu', icon: '🤾',
  how: ['Kanattan orta geliyor. Topun gölgesi, topun nereye düşeceğini gösterir.', 'Top başının hizasına geldiği an dokun: erken dokunursan top üstten, geç dokunursan zayıf gider.',
    'Ekranın neresine dokunursan topu kalenin o tarafına vurursun (sol / orta / sağ).', 'Kaleci seni okumaya çalışır: köşeler ve sert kafalar gol olur. 6 orta.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      api.hideTimer();
      const N = 6;
      let W = stage.clientWidth, H = stage.clientHeight;
      let round = 0, pts = 0, goals = 0, st = null, done = false;
      const win = clamp(0.075 + api.ease * 0.06 - api.diff * 0.03, 0.04, 0.14), good = win * 2.4;
      const start = () => {
        if (round >= N) { done = true; setTimeout(() => resolve(clamp(pts + (goals === N ? 4 : 0), 0, 100)), 300); return; }
        round++;
        const side = api.rng.chance(0.5) ? -1 : 1;
        st = { phase: 'cross', p: 0, side, off: api.rng.float(-0.12, 0.12), sp: (0.62 + api.diff * 0.38) * api.rng.float(0.9, 1.12) * (api.mods.has('yagmur') ? 1.1 : 1),
          arc: api.rng.float(0.16, 0.26), jump: 0, kx: 0.5, kdive: 0, klift: 0, res: null, t: 0, spin: 0 };
      };
      const tap = e => {
        if (!st || st.phase !== 'cross') return;
        const r = stage.getBoundingClientRect();
        const fx = clamp((e.clientX - r.left) / r.width, 0, 1);
        const d = st.p - 1, ad = Math.abs(d);
        st.phase = 'shot'; st.jumpT = 0; st.t = 0;
        api.sfx.whoosh();
        const g = goalBox(W, H), gw = g.x1 - g.x0;
        if (ad > good) { st.res = 'ISKA'; st.miss = true; return; }
        const q = 1 - ad / good;                            // 0..1 zamanlama kalitesi
        const power = 0.35 + 0.65 * q;
        const aimX = g.x0 + gw * (0.06 + fx * 0.88);
        const tx = aimX + api.rng.normal(0, 1) * (1 - q) * gw * 0.22;
        const th = clamp(0.45 + (d < 0 ? ad / good * 0.95 : -ad / good * 0.3) + api.rng.float(-0.12, 0.12) * (1 - q), 0.02, 1.4); // 0 zemin, 1 üst direk
        st.shot = { tx, th, power, dur: 0.62 - power * 0.28 };
        // Kalecinin kararı: oyuncuyu okur ya da tahmin eder
        const read = api.rng.chance(0.3 + api.diff * 0.35);
        const guess = read ? tx : g.x0 + gw * api.rng.pick([0.2, 0.5, 0.8]);
        const maxMove = gw * (0.2 + api.diff * 0.14) * (1.25 - power * 0.5);
        const kx0 = g.x0 + gw * st.kx;
        st.kTo = clamp(guess, kx0 - maxMove, kx0 + maxMove);
        st.kHand = 18 + api.diff * 10;
        if (th > 1.02) st.res = 'UST';
        else if (tx < g.x0 - 4 || tx > g.x1 + 4) st.res = 'AUT';
        else if (Math.min(Math.abs(tx - g.x0), Math.abs(tx - g.x1)) < 7 || th > 0.95) st.res = 'DIREK';
        else st.res = Math.abs(st.kTo - tx) < st.kHand + (th < 0.35 ? 6 : 0) ? 'KURTARDI' : 'GOL';
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      start();
      api.setScore(`⚽ 0/${N}`);
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight;
        const g = goalBox(W, H), gw = g.x1 - g.x0;
        pitch(ctx, W, H);
        if (!st) return;
        const hx = W * (0.5 + st.off), hy = H * 0.7, headZ = 50;
        const sx = st.side < 0 ? W * 0.03 : W * 0.97, sy = H * 0.5;
        // Top konumu (orta)
        let bx, by, bz;
        const crossPos = p => {
          const gx = lerp(sx, hx, p), gy = lerp(sy, hy, p);
          const z = p <= 1 ? headZ + H * st.arc * Math.sin(Math.PI * p) * (1 - p * 0.25) : Math.max(0, headZ - (p - 1) * 180);
          return [gx, gy, z];
        };
        if (st.phase === 'cross') {
          st.p += dt * st.sp;
          if (st.p > 1.35) { st.phase = 'shot'; st.res = 'ISKA'; st.miss = true; st.t = 0; }
        }
        // Kaleci topu izler
        const kBase = g.x0 + gw * st.kx;
        let kx = kBase, kdive = 0, klift = 0;
        if (st.phase === 'cross') { const [gx] = crossPos(Math.min(1, st.p)); st.kx = lerp(st.kx, clamp((gx - g.x0) / gw * 0.3 + 0.35, 0.3, 0.7), dt * 2); kx = g.x0 + gw * st.kx; }
        if (st.phase === 'shot' || st.phase === 'result') st.t += dt;
        let ripple = 0;
        if (st.phase === 'shot' && !st.miss) {
          const s = st.shot, f = clamp(st.t / s.dur, 0, 1);
          const startX = hx, startY = hy - headZ - 12;
          let endX = s.tx, endY = lerp(g.bot, g.top, clamp(s.th, 0, 1.3));
          if (st.res === 'KURTARDI') { endX = st.kTo; }
          bx = lerp(startX, endX, f); by = lerp(startY, endY, f) - Math.sin(f * Math.PI) * 18; bz = 0;
          const kf = clamp((st.t - 0.06) / (s.dur * 0.9), 0, 1);
          kx = lerp(kBase, st.kTo, kf); kdive = clamp((st.kTo - kBase) / (gw * 0.3), -1, 1) * kf; klift = kf * (1 - clamp(s.th, 0, 1)) < 0.5 ? kf * 14 * clamp(s.th, 0, 1) : 10;
          st.spin += dt * 20;
          if (f >= 1) {
            st.phase = 'result'; st.t = 0; st.end = [bx, by]; st.kEnd = [kx, kdive, klift];
            const r = st.res;
            if (r === 'GOL') { goals++; pts += 16; api.sfx.good(); api.vibrate(40); }
            else if (r === 'DIREK') { pts += 5; api.sfx.tick(); api.sfx.kick(); }
            else if (r === 'KURTARDI') { pts += 6; api.sfx.tick(); }
            else api.sfx.bad();
            api.setScore(`⚽ ${goals}/${round}`);
          }
        }
        if (st.phase === 'shot' && st.miss) {
          [bx, by, bz] = crossPos(Math.max(st.p, 1) + st.t * st.sp); by -= bz;
          if (st.t > 0.7) { st.phase = 'result'; st.t = 0; api.sfx.bad(); api.setScore(`⚽ ${goals}/${round}`); st.end = [bx, by]; st.kEnd = [kx, 0, 0]; }
        }
        if (st.phase === 'result') {
          [bx, by] = st.end; [kx, kdive, klift] = st.kEnd;
          if (st.res === 'GOL') ripple = Math.max(0, 1 - st.t * 1.6);
          if (st.res === 'DIREK') { bx += st.t * 60 * (bx < W / 2 ? 1 : -1); by += st.t * 140; }
          if (st.res === 'UST') by -= st.t * 60;
          if (st.t > 1.25) { st = null; start(); return; }
        }
        // Çizim
        drawGoal(ctx, g, ripple, st?.shot?.tx ?? W / 2, 0.5);
        drawKeeper(ctx, kx, g.bot - 2, kdive, klift);
        // Hedef ipucu: dokunma bölgesi rehberi
        if (st.phase === 'cross') {
          ctx.fillStyle = 'rgba(255,255,255,.08)';
          for (let i = 0; i < 3; i++) if (i !== 1) ctx.fillRect(g.x0 + gw * i / 3, g.top, gw / 3, g.bot - g.top);
          ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '700 11px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('◀ sola', W * 0.18, H * 0.96); ctx.fillText('ortaya', W / 2, H * 0.96); ctx.fillText('sağa ▶', W * 0.82, H * 0.96);
        }
        // Oyuncu ve zıplama
        const jumping = st.phase !== 'cross' ? clamp(1 - Math.abs((st.t || 0) - 0.18) / 0.3, 0, 1) : 0;
        if (st.phase === 'cross') {
          const [gx, gy, z] = crossPos(st.p);
          shadow(ctx, gx, gy + 16, 0.6 + z / 200);
          // Zamanlama halkası: top başa yaklaştıkça daralır
          const k = clamp(1 - st.p, 0, 1);
          ctx.strokeStyle = Math.abs(st.p - 1) < win ? 'rgba(61,220,151,.95)' : 'rgba(255,255,255,.45)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(hx, hy - headZ, 14 + k * 60, 0, 7); ctx.stroke();
          drawPlayer(ctx, hx, hy, 0);
          drawBall(ctx, gx, gy - z, 8, st.p * 12);
        } else {
          drawPlayer(ctx, hx, hy, jumping * 20);
          if (bx !== undefined) drawBall(ctx, bx, by, 7 + (st.miss ? 1 : 0), st.spin);
        }
        // Savunmacı (baskı)
        ctx.globalAlpha = 0.9; drawPlayer(ctx, hx + (st.side < 0 ? 26 : -26), hy + 8, st.phase !== 'cross' ? jumping * 12 : 0, '#e84a5f', '4'); ctx.globalAlpha = 1;
        if (st.phase === 'result') banner(ctx, W, H, RES[st.res][0], RES[st.res][1], st.t);
        ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 12px Nunito, system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`Orta ${round}/${N}`, 10, H - 10);
      });
    });
  },
});

// ————————————————— FRİKİK —————————————————
register({
  id: 'frikik', name: 'Frikik', icon: '🌀',
  how: ['1) Yön çubuğu kayar: nişan almak için dokun.', '2) Falso çubuğu kayar: topun ne kadar döneceğini dokunarak seç.',
    'Top barajı aşmalı; kaleci topun gittiği tarafa uzanır. Falso ne kadar iyiyse kaleci o kadar geç okur.', 'Köşeler gol, ortalar kaleciye gider. 4 atış.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      api.hideTimer();
      let W, H, phase = 'aim', t = api.rng.float(0, 5), aim = 0, curve = 0, shots = 0, goals = 0, pts = 0, fly = null, res = null, rt = 0;
      let wallSide = api.rng.pick([-1, 1]);
      const spd = (1.1 + api.diff * 1.7) * (1 - api.ease * 0.4);
      const tap = () => {
        if (phase === 'aim') { phase = 'curve'; api.sfx.tick(); }
        else if (phase === 'curve') { phase = 'fly'; api.sfx.kick(); fly = { p: 0 }; decide(); }
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      const geo = () => {
        const g = goalBox(W, H), gw = g.x1 - g.x0;
        const wallY = H * 0.47, wc = W / 2 + wallSide * gw * 0.12, ww = gw * (0.32 + api.diff * 0.08);
        return { g, gw, wallY, wx0: wc - ww / 2, wx1: wc + ww / 2, bx0: W / 2, by0: H * 0.84 };
      };
      const path = (p, G) => {
        const tx = W / 2 + aim * G.gw * 0.62;
        const x = lerp(G.bx0, tx, p) + curve * Math.sin(p * Math.PI) * G.gw * 0.45;
        const y = lerp(G.by0, G.g.bot - (G.g.bot - G.g.top) * 0.45, p);
        const z = Math.sin(p * Math.PI) * 60 * (0.6 + Math.abs(curve) * 0.4);
        return [x, y, z];
      };
      const decide = () => {
        const G = geo();
        const pw = (G.by0 - G.wallY) / (G.by0 - (G.g.bot - (G.g.bot - G.g.top) * 0.45));
        const [wx, , wz] = path(pw, G);
        const [ex] = path(1, G);
        const kStart = W / 2 - wallSide * G.gw * 0.14;               // kaleci barajın boş tarafını tutar
        const lateRead = Math.abs(curve) * 0.5;                      // falso okumayı geciktirir
        const reach = G.gw * (0.24 + api.diff * 0.16) * (1 - lateRead);
        const kTo = clamp(ex, kStart - reach, kStart + reach);
        let r;
        if (wx > G.wx0 && wx < G.wx1 && wz < 44) r = 'BARAJ';
        else if (ex < G.g.x0 - 3 || ex > G.g.x1 + 3) r = 'AUT';
        else if (Math.min(Math.abs(ex - G.g.x0), Math.abs(ex - G.g.x1)) < 6) r = 'DIREK';
        else r = Math.abs(kTo - ex) < 20 + api.diff * 8 ? 'KURTARDI' : 'GOL';
        fly = { p: 0, r, kStart, kTo, ex };
      };
      api.setScore('0/4');
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight; t += dt;
        const G = geo();
        if (phase === 'aim') aim = Math.sin(t * spd * 1.5);
        if (phase === 'curve') curve = Math.sin(t * spd * 2.1) * 0.9;
        pitch(ctx, W, H);
        let bx = G.bx0, by = G.by0, bz = 0, kx = W / 2 - wallSide * G.gw * 0.14, kd = 0, ripple = 0;
        if (phase === 'fly') {
          fly.p = Math.min(1, fly.p + dt * 1.25);
          [bx, by, bz] = path(fly.p, G);
          const kf = clamp((fly.p - 0.35 - Math.abs(curve) * 0.2) / 0.5, 0, 1);
          kx = lerp(fly.kStart, fly.kTo, kf); kd = clamp((fly.kTo - fly.kStart) / (G.gw * 0.3), -1, 1) * kf;
          if (fly.r === 'BARAJ' && fly.p > (G.by0 - G.wallY) / (G.by0 - G.g.bot) * 0.95) { phase = 'res'; rt = 0; }
          if (fly.p >= 1) { phase = 'res'; rt = 0; }
          if (phase === 'res') {
            shots++; res = fly.r; fly.end = [bx, by - bz]; fly.kEnd = [kx, kd];
            if (res === 'GOL') { goals++; pts += 25; api.sfx.good(); }
            else if (res === 'DIREK') { pts += 6; api.sfx.tick(); }
            else if (res === 'KURTARDI') { pts += 5; api.sfx.tick(); }
            else api.sfx.bad();
            api.setScore(`${goals}/${shots}`);
          }
        }
        if (phase === 'res') {
          rt += dt; [bx, by] = fly.end; bz = 0; [kx, kd] = fly.kEnd;
          if (res === 'GOL') ripple = Math.max(0, 1 - rt * 1.5);
          if (res === 'BARAJ') by += rt * 120;
          if (rt > 1.3) {
            if (shots >= 4) { phase = 'done'; resolve(clamp(pts, 0, 100)); return; }
            phase = 'aim'; fly = null; res = null; wallSide = api.rng.pick([-1, 1]); t = api.rng.float(0, 5);
          }
        }
        drawGoal(ctx, G.g, ripple, fly?.ex ?? W / 2, 0.5);
        drawKeeper(ctx, kx, G.g.bot - 2, kd, Math.abs(kd) * 10);
        for (let x = G.wx0; x < G.wx1 - 4; x += 20) drawPlayer(ctx, x + 10, G.wallY, phase === 'fly' && fly.p > 0.25 && fly.p < 0.5 ? 10 : 0, '#e84a5f', '');
        drawPlayer(ctx, G.bx0 - 18, G.by0 + 4, 0);
        if (phase === 'aim' || phase === 'curve') {
          ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.setLineDash([5, 7]); ctx.lineWidth = 2; ctx.beginPath();
          for (let p = 0; p <= 1.001; p += 0.05) { const [x, y, z] = path(p, G); p ? ctx.lineTo(x, y - z) : ctx.moveTo(x, y - z); }
          ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(20, H - 34, W - 40, 12);
          ctx.fillStyle = phase === 'aim' ? '#ffcf4d' : '#b36bff';
          const v = phase === 'aim' ? aim : curve / 0.9; ctx.fillRect(W / 2 + v * (W / 2 - 30) - 5, H - 38, 10, 20);
          ctx.fillStyle = '#fff'; ctx.font = '800 13px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(phase === 'aim' ? 'YÖN — dokun' : 'FALSO — dokun', W / 2, H - 44);
        }
        shadow(ctx, bx, by + 6, 1);
        drawBall(ctx, bx, by - bz, 8, (fly?.p ?? 0) * 18);
        if (phase === 'res') banner(ctx, W, H, res === 'BARAJ' ? 'BARAJ' : RES[res][0], res === 'BARAJ' ? '#ffb547' : RES[res][1], rt);
      });
    });
  },
});
