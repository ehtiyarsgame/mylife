// Fizik ve beceri ağırlıklı kaliteli mini oyunlar: Basket Atışı, Masa Tenisi, Paralel Park, Boru Tesisatı, Kamyon Yükleme.
import { register } from './engine.js';
import { h } from '../ui/dom.js';
import { clamp, lerp } from '../core/util.js';

const banner = (ctx, W, H, text, color, t, y = 0.4) => {
  const s = 1 + Math.max(0, 0.3 - t) * 1.8;
  ctx.save(); ctx.translate(W / 2, H * y); ctx.scale(s, s);
  ctx.font = '900 40px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(0,0,0,.45)';
  ctx.strokeText(text, 0, 0); ctx.fillStyle = color; ctx.fillText(text, 0, 0); ctx.restore();
};

// ————————————————— BASKET ATIŞI —————————————————
register({
  id: 'basket', name: 'Basket Atışı', icon: '🏀',
  how: ['Parmağını ekrana koy ve geriye doğru çek: sapan gibi.', 'Çekiş yönü açıyı, uzunluğu gücü belirler; bırakınca top fırlar.', 'Çember ve panya gerçek fizikle sektirir. Çembere değmeden girerse "SWISH!"', 'Her atışta mesafe değişir. 6 atış.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      api.hideTimer();
      const N = 6;
      let W = stage.clientWidth, H = stage.clientHeight, shot = 0, made = 0, pts = 0, ball = null, drag = null, res = null, rt = 0, sx = 0, done = false;
      const sc = () => H / 800;
      const hoop = () => ({ x: W * 0.74, y: H * 0.34, r: 24 * sc() });
      const newShot = () => { shot++; sx = W * api.rng.float(0.1, 0.34 + api.diff * 0.08); ball = null; res = null; drag = null; };
      newShot();
      const pos = e => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      const down = e => { if (ball || res) return; drag = { a: pos(e), b: pos(e) }; };
      const move = e => { if (drag) drag.b = pos(e); };
      const up = () => {
        if (!drag) return;
        const dx = drag.a[0] - drag.b[0], dy = drag.a[1] - drag.b[1];
        const len = Math.hypot(dx, dy);
        if (len < 12) { drag = null; return; }
        const k = 5.2 * clamp(len, 0, 260) / len;
        ball = { x: sx, y: H * 0.8, vx: dx * k, vy: dy * k, touched: false, scored: false, t: 0, spin: 0 };
        drag = null; api.sfx.whoosh();
      };
      stage.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      api.onCleanup(() => { stage.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
      const G = () => 1500 * sc(), BR = () => 12 * sc();
      const collideCircle = (cx, cy, cr) => {
        const dx = ball.x - cx, dy = ball.y - cy, d = Math.hypot(dx, dy), m = BR() + cr;
        if (d < m && d > 0) {
          const nx = dx / d, ny = dy / d, vn = ball.vx * nx + ball.vy * ny;
          if (vn < 0) { ball.vx -= 1.6 * vn * nx; ball.vy -= 1.6 * vn * ny; ball.vx *= 0.85; ball.vy *= 0.85; }
          ball.x = cx + nx * m; ball.y = cy + ny * m; ball.touched = true; api.sfx.tap();
        }
      };
      api.setScore(`🏀 0/${N}`);
      api.loop(dt => {
        if (done) return;
        W = stage.clientWidth; H = stage.clientHeight;
        const hp = hoop(), board = { x: hp.x + hp.r + 10 * sc(), y0: hp.y - 80 * sc(), y1: hp.y + 14 * sc() };
        // Fizik (alt adımlı)
        if (ball && !res) {
          const steps = 4;
          for (let i = 0; i < steps; i++) {
            const d = dt / steps;
            ball.vy += G() * d; ball.x += ball.vx * d; ball.y += ball.vy * d; ball.t += d; ball.spin += ball.vx * d * 0.05;
            collideCircle(hp.x - hp.r, hp.y, 3 * sc()); collideCircle(hp.x + hp.r, hp.y, 3 * sc());
            if (ball.x + BR() > board.x && ball.x < board.x + 8 && ball.y > board.y0 && ball.y < board.y1 && ball.vx > 0) { ball.vx *= -0.6; ball.x = board.x - BR(); ball.touched = true; api.sfx.tap(); }
            if (!ball.scored && ball.vy > 0 && Math.abs(ball.y - hp.y) < 6 && Math.abs(ball.x - hp.x) < hp.r - BR() * 0.6) {
              ball.scored = true; made++; const sw = !ball.touched; pts += sw ? 17 : 14;
              res = sw ? ['SWISH!', '#3ddc97'] : ['BASKET!', '#3ddc97']; rt = 0; api.sfx.good(); api.vibrate(30);
            }
          }
          if (!res && (ball.y > H + 40 || ball.x > W + 40 || ball.x < -40 || ball.t > 4)) { res = [ball.touched ? 'ÇEMBERDEN DÖNDÜ' : 'ISKA', '#ff5b7a']; rt = 0; api.sfx.bad(); }
          if (res) api.setScore(`🏀 ${made}/${shot}`);
        } else if (ball && res) { ball.vy += G() * dt; ball.y += ball.vy * dt * 0.6; ball.x += ball.vx * dt * 0.3; }
        if (res) { rt += dt; if (rt > 1.1) { if (shot >= N) { done = true; resolve(clamp(pts + (made === N ? 4 : 0), 0, 100)); return; } newShot(); } }
        // Çizim: salon
        const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1d2447'); bg.addColorStop(0.72, '#2a3160'); bg.addColorStop(0.72, '#b77a45'); bg.addColorStop(1, '#9a6334');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, H * 0.72); ctx.lineTo(W, H * 0.72); ctx.stroke();
        // Direk + panya + çember + file
        ctx.fillStyle = '#6b7390'; ctx.fillRect(board.x + 8, board.y0, 6 * sc(), H * 0.72 - board.y0);
        ctx.fillStyle = '#f4f6ff'; ctx.fillRect(board.x, board.y0, 8, board.y1 - board.y0);
        ctx.strokeStyle = '#ff5b3a'; ctx.lineWidth = 2; ctx.strokeRect(board.x - 2, hp.y - 34 * sc(), 4, 26 * sc());
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5;
        for (let i = 0; i <= 6; i++) { const x0 = hp.x - hp.r + i * hp.r / 3; ctx.beginPath(); ctx.moveTo(x0, hp.y); ctx.lineTo(lerp(hp.x - hp.r * 0.6, hp.x + hp.r * 0.6, i / 6), hp.y + 36 * sc()); ctx.stroke(); }
        ctx.strokeStyle = '#ff6a2b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hp.x - hp.r, hp.y); ctx.lineTo(hp.x + hp.r, hp.y); ctx.stroke();
        // Oyuncu
        ctx.fillStyle = '#4ea1ff'; ctx.fillRect(sx - 12, H * 0.8, 24, 36); ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(sx, H * 0.8 - 8, 10, 0, 7); ctx.fill();
        // Nişan önizlemesi (beceri yükseldikçe uzar)
        if (drag) {
          const dx = drag.a[0] - drag.b[0], dy = drag.a[1] - drag.b[1], len = Math.hypot(dx, dy) || 1, k = 5.2 * clamp(len, 0, 260) / len;
          let px = sx, py = H * 0.8, vx = dx * k, vy = dy * k;
          const dots = Math.round(6 + api.ease * 16 - api.diff * 4);
          for (let i = 0; i < dots; i++) { for (let j = 0; j < 3; j++) { vy += G() * 0.012; px += vx * 0.012; py += vy * 0.012; } ctx.fillStyle = `rgba(255,255,255,${0.8 - i / dots * 0.7})`; ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill(); }
          ctx.strokeStyle = 'rgba(255,207,77,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, H * 0.8); ctx.lineTo(sx - dx * 0.35, H * 0.8 - dy * 0.35); ctx.stroke();
        }
        // Top
        const bx = ball ? ball.x : sx + 14, by = ball ? ball.y : H * 0.8 - 22;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(ball?.spin ?? 0);
        ctx.fillStyle = '#f08a24'; ctx.beginPath(); ctx.arc(0, 0, BR(), 0, 7); ctx.fill();
        ctx.strokeStyle = '#6b3510'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-BR(), 0); ctx.lineTo(BR(), 0); ctx.moveTo(0, -BR()); ctx.lineTo(0, BR()); ctx.stroke(); ctx.restore();
        if (!ball && !drag && !res) { ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '700 13px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Dokun ve geriye çek ↙', W / 2, H * 0.93); }
        if (res) banner(ctx, W, H, res[0], res[1], rt, 0.55);
        ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '800 12px Nunito, system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`Atış ${shot}/${N}`, 10, H - 10);
      });
    });
  },
});

// ————————————————— MASA TENİSİ —————————————————
register({
  id: 'masa_tenisi', name: 'Masa Tenisi', icon: '🏓',
  how: ['Raketini parmağınla sağa sola kaydır.', 'Topu raketin kenarıyla karşılarsan açılı gider, rakibi zorlar.', 'Her vuruşta top hızlanır. 5 sayıya ilk ulaşan kazanır.', 'Rakibin gücü seviyene göre ayarlanır.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      api.hideTimer();
      let W = stage.clientWidth, H = stage.clientHeight, px = 0.5, ax = 0.5, me = 0, ai = 0, rally = 0, best = 0, b = null, pause = 0.8, over = false, msg = null, mt = 0;
      const PW = () => clamp(0.2 + api.ease * 0.06 - api.diff * 0.04, 0.13, 0.26);
      const serve = dir => { b = { x: 0.5, y: 0.5, vx: api.rng.float(-0.3, 0.3), vy: 0.55 * dir }; rally = 0; };
      const move = e => { const r = stage.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width, 0.08, 0.92); };
      stage.addEventListener('pointermove', move); stage.addEventListener('pointerdown', move);
      api.onCleanup(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', move); });
      api.setScore('0 - 0');
      const point = who => {
        who ? me++ : ai++; best = Math.max(best, rally); api.setScore(`${me} - ${ai}`);
        who ? api.sfx.good() : api.sfx.bad(); msg = who ? ['SAYI!', '#3ddc97'] : ['KAÇTI', '#ff5b7a']; mt = 0;
        b = null; pause = 0.9;
        if (me >= 5 || ai >= 5) { over = true; setTimeout(() => resolve(clamp(me / (me + ai) * 90 + Math.min(10, best), 0, 100)), 700); }
      };
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight;
        if (!over) {
          if (!b) { pause -= dt; if (pause <= 0) serve((me + ai) % 2 ? -1 : 1); }
          else {
            const sp = 1 + rally * 0.06;
            b.x += b.vx * dt * sp; b.y += b.vy * dt * sp;
            if (b.x < 0.03 || b.x > 0.97) { b.vx *= -1; b.x = clamp(b.x, 0.03, 0.97); }
            // Rakip: topu izler, hızı sınırlı, hata yapar
            const aiSpeed = 0.45 + api.diff * 0.5;
            const target = b.vy < 0 ? b.x + (api.rng.float(-0.08, 0.08)) * (1 - api.diff) : 0.5;
            ax += clamp(target - ax, -aiSpeed * dt, aiSpeed * dt);
            const pw = PW(), aw = 0.2;
            if (b.vy > 0 && b.y > 0.88 && b.y < 0.93) {
              if (Math.abs(b.x - px) < pw / 2 + 0.02) { const off = (b.x - px) / (pw / 2); b.vy = -Math.abs(b.vy); b.vx = off * 0.7; rally++; api.sfx.tap(); }
            }
            if (b.vy < 0 && b.y < 0.12 && b.y > 0.07) {
              if (Math.abs(b.x - ax) < aw / 2 + 0.02) { const off = (b.x - ax) / (aw / 2); b.vy = Math.abs(b.vy); b.vx = off * 0.6 + api.rng.float(-0.1, 0.1); rally++; api.sfx.tap(); }
            }
            if (b.y > 1.02) point(false);
            else if (b.y < -0.02) point(true);
          }
        }
        // Çizim: masa
        ctx.fillStyle = '#0f1530'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1f5fa8'; ctx.fillRect(W * 0.04, H * 0.04, W * 0.92, H * 0.92);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.strokeRect(W * 0.04, H * 0.04, W * 0.92, H * 0.92);
        ctx.beginPath(); ctx.moveTo(W / 2, H * 0.04); ctx.lineTo(W / 2, H * 0.96); ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(W * 0.02, H / 2 - 3, W * 0.96, 6);
        const pw = PW();
        ctx.fillStyle = '#e84a5f'; ctx.beginPath(); ctx.roundRect((ax - 0.1) * W, H * 0.07, 0.2 * W, 12, 6); ctx.fill();
        ctx.fillStyle = '#ffcf4d'; ctx.beginPath(); ctx.roundRect((px - pw / 2) * W, H * 0.9, pw * W, 14, 7); ctx.fill();
        if (b) {
          ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(b.x * W + 4, b.y * H + 6, 7, 4, 0, 0, 7); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x * W, b.y * H, 7, 0, 7); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '900 30px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(ai, W / 2, H * 0.3); ctx.fillText(me, W / 2, H * 0.74);
        if (rally > 2 && b) { ctx.font = '800 13px Nunito, system-ui, sans-serif'; ctx.fillText(`Ralli ${rally}`, W / 2, H * 0.54 + 18); }
        if (msg) { mt += dt; banner(ctx, W, H, msg[0], msg[1], mt, 0.45); if (mt > 0.8) msg = null; }
      });
    });
  },
});

// ————————————————— PARALEL PARK —————————————————
register({
  id: 'park', name: 'Paralel Park', icon: '🅿️',
  how: ['Aracı sağdaki boş park yerine yerleştir.', '◀ ▶ direksiyonu çevirir, ⬆ ileri, ⬇ geri gider (basılı tut).', 'Diğer araçlara ve kaldırıma çarpmak puan götürür.', 'Araç çizgilerin içinde ve düz durunca park tamam. 45 saniye.'],
  play(stage, api) {
    return new Promise(resolve => {
      const cv = api.canvas(); const { ctx } = cv;
      const keys = { l: 0, r: 0, f: 0, b: 0 };
      const mk = (lbl, k) => h('button.btn', { style: { flex: 1, minHeight: '54px', fontSize: '22px', touchAction: 'none' },
        onpointerdown: e => { e.preventDefault(); keys[k] = 1; }, onpointerup: () => { keys[k] = 0; }, onpointerleave: () => { keys[k] = 0; }, onpointercancel: () => { keys[k] = 0; } }, lbl);
      const pad = h('div.row', { style: { position: 'absolute', left: '8px', right: '8px', bottom: '8px', gap: '6px' } }, mk('◀', 'l'), mk('▶', 'r'), mk('⬆', 'f'), mk('⬇', 'b'));
      stage.append(pad);
      let W = stage.clientWidth, H = stage.clientHeight, over = false, hits = 0, hitCd = 0, parkedT = 0, msg = null, mt = 0;
      const S = () => Math.min(W / 390, H / 700);
      const carL = () => 70 * S(), carW = () => 34 * S();
      const spotLen = () => carL() * (1.75 - api.diff * 0.35 + api.ease * 0.1);
      const lay = () => {
        const curb = W * 0.86, laneX = curb - carW() / 2 - 8 * S();
        const spotY = H * 0.36, sl = spotLen();
        const parked = [{ x: laneX, y: spotY - sl / 2 - carL() / 2 - 6 }, { x: laneX, y: spotY + sl / 2 + carL() / 2 + 6 }, { x: laneX, y: spotY - sl / 2 - carL() * 1.5 - 16 }];
        return { curb, laneX, spotY, sl, parked };
      };
      let L = lay();
      const car = { x: W * 0.52, y: H * 0.62, a: -Math.PI / 2, v: 0, steer: 0 };
      const corners = c => { const ca = Math.cos(c.a), sa = Math.sin(c.a), l = carL() / 2, w = carW() / 2; return [[l, w], [l, -w], [-l, -w], [-l, w]].map(([dx, dy]) => [c.x + dx * ca - dy * sa, c.y + dx * sa + dy * ca]); };
      const inRect = (p, r) => p[0] > r.x0 && p[0] < r.x1 && p[1] > r.y0 && p[1] < r.y1;
      const rectOf = p => ({ x0: p.x - carW() / 2, x1: p.x + carW() / 2, y0: p.y - carL() / 2, y1: p.y + carL() / 2 });
      const end = ok => {
        if (over) return; over = true; tm.stop();
        const c = corners(car), sp = { x0: L.laneX - carW() / 2 - 8, x1: L.curb, y0: L.spotY - L.sl / 2, y1: L.spotY + L.sl / 2 };
        const inside = c.filter(p => inRect(p, sp)).length;
        const straight = 1 - Math.min(1, Math.abs(Math.sin(car.a + Math.PI / 2)) * 3);
        const score = ok ? 62 + straight * 20 + tm.left() * 30 - hits * 12 : inside * 9 + straight * 6 - hits * 8;
        setTimeout(() => resolve(clamp(score, 0, 100)), 900);
      };
      const tm = api.timerLoop(45, () => end(false));
      api.setScore('💥 0');
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight; L = lay();
        if (!over) {
          car.steer = lerp(car.steer, (keys.r - keys.l) * 0.6, dt * 6);
          const acc = (keys.f - keys.b) * 160 * S();
          car.v += acc * dt; car.v *= Math.pow(0.35, dt); car.v = clamp(car.v, -90 * S(), 120 * S());
          if (!keys.f && !keys.b) car.v *= Math.pow(0.05, dt);
          const nx = car.x + Math.cos(car.a) * car.v * dt, ny = car.y + Math.sin(car.a) * car.v * dt, na = car.a + car.v / carL() * Math.tan(car.steer) * dt;
          const test = { x: nx, y: ny, a: na };
          const cs = corners(test);
          const hit = cs.some(p => p[0] > L.curb || p[0] < W * 0.06 || p[1] < 8 || p[1] > H - 70) || L.parked.some(pk => cs.some(p => inRect(p, rectOf(pk))));
          if (hit) { car.v = -car.v * 0.3; if (hitCd <= 0) { hits++; hitCd = 0.6; api.sfx.bad(); api.vibrate(40); api.setScore(`💥 ${hits}`); } }
          else { car.x = nx; car.y = ny; car.a = na; }
          hitCd -= dt;
          const sp = { x0: L.laneX - carW() / 2 - 10, x1: L.curb + 2, y0: L.spotY - L.sl / 2 - 2, y1: L.spotY + L.sl / 2 + 2 };
          const ok = corners(car).every(p => inRect(p, sp)) && Math.abs(Math.sin(car.a + Math.PI / 2)) < 0.2 && Math.abs(car.v) < 12 * S();
          parkedT = ok ? parkedT + dt : 0;
          if (parkedT > 0.5) { msg = ['PARK TAMAM!', '#3ddc97']; mt = 0; api.sfx.level?.(); end(true); }
        }
        // Çizim: yol
        ctx.fillStyle = '#3b3f47'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#9aa0a8'; ctx.fillRect(L.curb, 0, W - L.curb, H);
        ctx.fillStyle = '#2f7a3e'; ctx.fillRect(L.curb + 10, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.setLineDash([18, 16]); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W * 0.36, 0); ctx.lineTo(W * 0.36, H); ctx.stroke(); ctx.setLineDash([]);
        // Park yeri
        const sx0 = L.laneX - carW() / 2 - 8, sy0 = L.spotY - L.sl / 2;
        ctx.fillStyle = parkedT > 0 ? 'rgba(61,220,151,.35)' : 'rgba(255,207,77,.18)'; ctx.fillRect(sx0, sy0, L.curb - sx0, L.sl);
        ctx.strokeStyle = '#ffcf4d'; ctx.lineWidth = 2; ctx.strokeRect(sx0, sy0, L.curb - sx0, L.sl);
        ctx.fillStyle = '#ffcf4d'; ctx.font = `900 ${20 * S()}px Nunito, system-ui, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('P', (sx0 + L.curb) / 2, L.spotY + 7);
        const drawCar = (x, y, a, col) => {
          ctx.save(); ctx.translate(x, y); ctx.rotate(a);
          ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-carL() / 2 + 3, -carW() / 2 + 3, carL(), carW());
          ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-carL() / 2, -carW() / 2, carL(), carW(), 7); ctx.fill();
          ctx.fillStyle = 'rgba(180,220,255,.85)'; ctx.fillRect(carL() * 0.12, -carW() / 2 + 4, carL() * 0.18, carW() - 8); ctx.fillRect(-carL() * 0.34, -carW() / 2 + 4, carL() * 0.13, carW() - 8);
          ctx.fillStyle = '#fff6b0'; ctx.fillRect(carL() / 2 - 4, -carW() / 2 + 3, 4, 6); ctx.fillRect(carL() / 2 - 4, carW() / 2 - 9, 4, 6);
          ctx.fillStyle = '#ff5b5b'; ctx.fillRect(-carL() / 2, -carW() / 2 + 3, 3, 6); ctx.fillRect(-carL() / 2, carW() / 2 - 9, 3, 6);
          ctx.restore();
        };
        for (const [i, pk] of L.parked.entries()) drawCar(pk.x, pk.y, i === 1 ? Math.PI / 2 : -Math.PI / 2, ['#8e9aaf', '#c75b39', '#5a7d9a'][i]);
        drawCar(car.x, car.y, car.a, '#4ea1ff');
        if (msg) { mt += dt; banner(ctx, W, H, msg[0], msg[1], mt, 0.6); }
      });
    });
  },
});

// ————————————————— BORU TESİSATI —————————————————
// Bit maskesi: K=1 D=2 G=4 B=8 (kuzey, doğu, güney, batı)
const rot = m => ((m << 1) | (m >> 3)) & 15;
register({
  id: 'boru', name: 'Boru Tesisatı', icon: '🚰',
  how: ['Soldaki vanadan sağdaki musluğa su gitmeli.', 'Bir boruya dokununca 90° döner.', 'Su bağlı borulardan akar ve maviye boyar.', 'Musluğa ulaştığın an bitiyor; ne kadar hızlıysan o kadar puan.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx, c } = api.canvas();
      const n = clamp(4 + Math.round(api.diff * 2 + api.rng.float(0, 0.6)), 4, 6);
      const grid = Array.from({ length: n }, () => Array(n).fill(0));
      // Çözülebilir yol üret: her sütunda dikey kay, sonra sağa geç
      let r = api.rng.int(0, n - 1); const r0 = r; let prev = 8; // ilk hücre batıdan girer
      for (let col = 0; col < n; col++) {
        const t = api.rng.int(0, n - 1);
        const dir = t > r ? 1 : -1;
        let from = prev;
        while (r !== t) { grid[r][col] |= from | (dir > 0 ? 4 : 1); from = dir > 0 ? 1 : 4; r += dir; }
        grid[r][col] |= from | 2; prev = 8;
      }
      const rEnd = r;
      // Boş hücrelere rastgele boru, sonra karıştır
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if (!grid[i][j]) grid[i][j] = api.rng.pick([5, 10, 3, 6, 12, 9, 7, 11, 13, 14]);
        const k = api.rng.int(0, 3); for (let q = 0; q < k; q++) grid[i][j] = rot(grid[i][j]);
      }
      let over = false, filled = new Set(), flash = 0;
      const flow = () => {
        const seen = new Set(), st = [];
        if (grid[r0][0] & 8) { st.push([r0, 0]); seen.add(r0 * n); }
        const D = [[1, -1, 0, 4], [2, 0, 1, 8], [4, 1, 0, 1], [8, 0, -1, 2]];
        while (st.length) {
          const [i, j] = st.pop();
          for (const [bit, di, dj, back] of D) {
            if (!(grid[i][j] & bit)) continue;
            const a = i + di, b = j + dj;
            if (a < 0 || b < 0 || a >= n || b >= n || !(grid[a][b] & back) || seen.has(a * n + b)) continue;
            seen.add(a * n + b); st.push([a, b]);
          }
        }
        return seen;
      };
      filled = flow();
      const tm = api.timerLoop(40 + n * 6 + api.ease * 10 - api.diff * 6, () => finish(false));
      const finish = ok => { if (over) return; over = true; tm.stop(); setTimeout(() => resolve(ok ? 55 + tm.left() * 45 : filled.size / (n * 1.6) * 40), 900); };
      const geo = () => { const W = stage.clientWidth, H = stage.clientHeight, cs = Math.min((W - 60) / n, (H - 40) / n); return { W, H, cs, ox: (W - cs * n) / 2, oy: (H - cs * n) / 2 }; };
      c.addEventListener('pointerdown', e => {
        if (over) return;
        const g = geo(), rc = stage.getBoundingClientRect();
        const j = Math.floor((e.clientX - rc.left - g.ox) / g.cs), i = Math.floor((e.clientY - rc.top - g.oy) / g.cs);
        if (i < 0 || j < 0 || i >= n || j >= n) return;
        grid[i][j] = rot(grid[i][j]); api.sfx.tick();
        filled = flow();
        api.setScore(`💧 ${filled.size}`);
        if (filled.has(rEnd * n + n - 1) && (grid[rEnd][n - 1] & 2)) { api.sfx.good(); flash = 1; finish(true); }
      });
      api.loop(dt => {
        const g = geo();
        ctx.fillStyle = '#1b2233'; ctx.fillRect(0, 0, g.W, g.H);
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
          const x = g.ox + j * g.cs, y = g.oy + i * g.cs, m = grid[i][j], wet = filled.has(i * n + j);
          ctx.fillStyle = '#26304a'; ctx.fillRect(x + 1, y + 1, g.cs - 2, g.cs - 2);
          const cx = x + g.cs / 2, cy = y + g.cs / 2, t = g.cs * 0.26;
          ctx.lineCap = 'round';
          for (const [lw, col] of [[t + 6, '#5b6478'], [t, wet ? '#3fa9ff' : '#9aa3b5']]) {
            ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
            if (m & 1) { ctx.moveTo(cx, cy); ctx.lineTo(cx, y); }
            if (m & 2) { ctx.moveTo(cx, cy); ctx.lineTo(x + g.cs, cy); }
            if (m & 4) { ctx.moveTo(cx, cy); ctx.lineTo(cx, y + g.cs); }
            if (m & 8) { ctx.moveTo(cx, cy); ctx.lineTo(x, cy); }
            ctx.stroke();
          }
        }
        // Vana ve musluk
        ctx.font = `${g.cs * 0.55}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🔵', g.ox - g.cs * 0.35, g.oy + (r0 + 0.5) * g.cs);
        ctx.fillText(flash ? '💦' : '🚰', g.ox + n * g.cs + g.cs * 0.38, g.oy + (rEnd + 0.5) * g.cs);
        ctx.textBaseline = 'alphabetic';
        if (flash) { flash = Math.max(0.001, flash - dt * 0.5); banner(ctx, g.W, g.H, 'SU GELDİ!', '#3fa9ff', 1 - flash, 0.5); }
      });
    });
  },
});

// ————————————————— KAMYON YÜKLEME —————————————————
const PIECES = [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]]];
const PCOL = ['#c9965a', '#b5824a', '#d8a86a', '#a8743f', '#e0b77e', '#bf8c52', '#9c6a38'];
register({
  id: 'yukleme', name: 'Kamyon Yükleme', icon: '🚚',
  how: ['Koliler yukarıdan düşer; kamyon kasasına boşluksuz yerleştir.', '◀ ▶ kaydırır, ⟳ döndürür, ⬇ hızlı indirir.', 'Dolan her sıra "sevkiyata hazır" olur ve puan getirir.', 'Kasa tepeye kadar dolarsa iş biter. 60 saniye.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      const C = 8, R = 13;
      const board = Array.from({ length: R }, () => Array(C).fill(null));
      let cur = null, fallT = 0, lines = 0, placed = 0, over = false, flash = [];
      const speed = () => clamp(0.75 - api.diff * 0.35 + api.ease * 0.15 - lines * 0.02, 0.18, 0.9);
      const spawn = () => {
        const k = api.rng.int(0, PIECES.length - 1);
        cur = { m: PIECES[k].map(r => r.slice()), x: Math.floor(C / 2) - 1, y: 0, c: PCOL[k] };
        if (collide(cur.m, cur.x, cur.y)) finish();
      };
      const collide = (m, x, y) => m.some((row, i) => row.some((v, j) => v && (y + i >= R || x + j < 0 || x + j >= C || (y + i >= 0 && board[y + i][x + j]))));
      const lock = () => {
        cur.m.forEach((row, i) => row.forEach((v, j) => { if (v && cur.y + i >= 0) board[cur.y + i][cur.x + j] = cur.c; }));
        placed++; api.sfx.tap();
        for (let i = R - 1; i >= 0; i--) if (board[i].every(Boolean)) { board.splice(i, 1); board.unshift(Array(C).fill(null)); lines++; flash.push(1); i++; api.sfx.good(); }
        api.setScore(`📦 ${lines}`);
        spawn();
      };
      const mv = dx => { if (cur && !over && !collide(cur.m, cur.x + dx, cur.y)) cur.x += dx; };
      const rotate = () => {
        if (!cur || over) return;
        const m = cur.m[0].map((_, j) => cur.m.map(r => r[j]).reverse());
        for (const k of [0, -1, 1, -2, 2]) if (!collide(m, cur.x + k, cur.y)) { cur.m = m; cur.x += k; return; }
      };
      const drop = () => { if (!cur || over) return; while (!collide(cur.m, cur.x, cur.y + 1)) cur.y++; lock(); };
      const b = (l, f) => h('button.btn', { style: { flex: 1, minHeight: '50px', fontSize: '20px' }, onpointerdown: e => { e.preventDefault(); f(); } }, l);
      stage.append(h('div.row', { style: { position: 'absolute', left: '8px', right: '8px', bottom: '8px', gap: '6px' } }, b('◀', () => mv(-1)), b('⟳', rotate), b('▶', () => mv(1)), b('⬇', drop)));
      const finish = () => { if (over) return; over = true; tm.stop(); setTimeout(() => resolve(clamp(lines * 15 + placed * 1.6, 0, 100)), 700); };
      const tm = api.timerLoop(60, finish);
      spawn();
      api.loop(dt => {
        const W = stage.clientWidth, H = stage.clientHeight - 64;
        if (!over) { fallT += dt; if (fallT > speed()) { fallT = 0; if (!collide(cur.m, cur.x, cur.y + 1)) cur.y++; else lock(); } }
        const cs = Math.min((W - 40) / C, (H - 20) / R), ox = (W - cs * C) / 2, oy = 10;
        ctx.fillStyle = '#20263a'; ctx.fillRect(0, 0, W, H + 64);
        // Kamyon kasası
        ctx.fillStyle = '#39415c'; ctx.fillRect(ox - 6, oy, cs * C + 12, cs * R + 6);
        ctx.fillStyle = '#151a2a'; ctx.fillRect(ox, oy, cs * C, cs * R);
        const cell = (i, j, col, a = 1) => {
          ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(ox + j * cs + 1, oy + i * cs + 1, cs - 2, cs - 2);
          ctx.strokeStyle = 'rgba(80,45,15,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ox + j * cs + 3, oy + i * cs + cs / 2); ctx.lineTo(ox + j * cs + cs - 3, oy + i * cs + cs / 2); ctx.stroke();
          ctx.globalAlpha = 1;
        };
        board.forEach((row, i) => row.forEach((v, j) => v && cell(i, j, v)));
        if (cur) {
          let gy = cur.y; while (!collide(cur.m, cur.x, gy + 1)) gy++;
          cur.m.forEach((row, i) => row.forEach((v, j) => v && cell(gy + i, cur.x + j, cur.c, 0.22)));
          cur.m.forEach((row, i) => row.forEach((v, j) => v && cur.y + i >= 0 && cell(cur.y + i, cur.x + j, cur.c)));
        }
        flash = flash.map(f => f - dt * 2).filter(f => f > 0);
        if (flash.length) banner(ctx, W, H, 'SEVKİYAT!', '#3ddc97', 1 - flash[0], 0.4);
      });
    });
  },
});
