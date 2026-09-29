// Yeni oyun motorları (1/2): hafıza, uçuş, zıplama, yılan, tuğla kırma, refleks, sıralama, kıyas, labirent,
// şifre kırma, kaydırmalı bulmaca, ışık söndür, ritim, kaçış, sayı tahmini.
// Metinler iki dilli: B('Türkçe', 'English'). Her motor farklı temalarla çok sayıda oyun üretir.
import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, lerp, sleep } from '../core/util.js';
import { B, T, EN, locale } from '../core/i18n.js';
const num = v => v.toLocaleString(locale());

const pct = v => Math.round(clamp(v, 0, 100));
const base = t => ({ id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages });
const hearts = n => '❤️'.repeat(Math.max(0, n)) + '🖤'.repeat(Math.max(0, 3 - n));
const emo = (ctx, e, x, y, size) => { ctx.fillStyle = '#fff'; ctx.font = `${size}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y); };

// i18n-skip-start
const TX = {
  timeUp: B('Süre bitti', 'Time is up'),
  crash: B('Çarptın!', 'Crash!'),
  tap: B('Ekrana dokun', 'Tap the screen'),
};
// i18n-skip-end

// 1) HAFIZA KARTLARI — ikişer çevir, eşleri bul.
export function memoryGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Kartlar ters duruyor, ikişer ikişer çevir.', 'Cards are face down. Flip two at a time.'), B('Aynı iki resmi bulursan açık kalırlar.', 'Matching pairs stay face up.'), B('Tüm çiftleri süre bitmeden bul; az hamle daha çok puan.', 'Find every pair before time runs out; fewer moves score more.')],
    play(stage, api) {
      return new Promise(resolve => {
        const pairs = api.diff > 0.55 ? 8 : 6;
        const pick = api.rng.shuffle(t.items.slice()).slice(0, pairs);
        const deck = api.rng.shuffle([...pick, ...pick]);
        const state = deck.map(() => 0);
        const back = t.back || '❔';
        let open = [], found = 0, moves = 0, lock = false, over = false;
        const cells = deck.map((_, i) => h('button.cell', { style: { fontSize: '30px', background: t.bg || '#2c3470', transition: 'transform .2s, background .2s' }, onclick: () => flip(i) }, back));
        const flip = i => {
          if (over || lock || state[i]) return;
          state[i] = 1; cells[i].textContent = deck[i]; cells[i].style.transform = 'scale(1.06)'; api.sfx.tap();
          open.push(i);
          if (open.length < 2) return;
          moves++;
          const [a, b] = open; open = [];
          if (deck[a] === deck[b]) {
            state[a] = state[b] = 2; cells[a].style.background = cells[b].style.background = '#1f6b4f';
            found++; api.good(t.okText || B('Eşleşti!', 'Match!')); api.setScore(`${found}/${pairs}`);
            if (found === pairs) end();
          } else {
            lock = true;
            setTimeout(() => { state[a] = state[b] = 0; cells[a].textContent = cells[b].textContent = back; cells[a].style.transform = cells[b].style.transform = ''; lock = false; }, 700);
          }
        };
        stage.replaceChildren(h('div.grid-board', { style: { gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '360px', margin: 'auto', gap: '6px' } }, cells));
        api.setScore(`0/${pairs}`);
        const tl = api.timerLoop(clamp(38 + pairs * 3 + api.ease * 12 - api.diff * 8, 30, 70), () => end());
        function end() {
          if (over) return; over = true; tl.stop();
          const waste = Math.max(0, moves - pairs * 1.7);
          resolve(pct(found / pairs * 76 + (found === pairs ? 16 + 12 * tl.left() : 0) - waste * 1.6));
        }
      });
    },
  });
}

// 2) UÇUŞ — dokununca yüksel, boşluklardan geç.
export function flappyGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Ekrana her dokunuşta yükselirsin, dokunmazsan alçalırsın.', 'Each tap lifts you up; stop tapping and you sink.'), B('Engellerin arasındaki boşluktan geç, ödülleri topla.', 'Fly through the gaps and grab the bonuses.'), B('3 can, 30 saniye.', '3 lives, 30 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let W = stage.clientWidth, H = stage.clientHeight, y = 0.45, vy = 0, lives = 3, inv = 0, gates = [], sp = 0.4, passed = 0, bonus = 0, over = false;
        const g = 1.45, jump = -0.6, px = 0.26;
        const gap = clamp(0.37 - api.diff * 0.12 + api.ease * 0.06, 0.24, 0.42);
        const speed = 0.3 + api.diff * 0.2;
        const tap = () => { if (!over) { vy = jump; api.sfx.whoosh(); } };
        stage.addEventListener('pointerdown', tap);
        api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
        const show = () => api.setScore(`${hearts(lives)} ${passed}`);
        const hit = () => { if (inv > 0) return; lives--; inv = 1.3; api.bad(t.hitText || TX.crash); show(); if (lives <= 0) end(); };
        const end = () => { if (over) return; over = true; tm.stop(); resolve(pct(passed * 6.5 + bonus * 4 + lives * 6)); };
        const tm = api.timerLoop(30, end);
        show();
        api.loop(dt => {
          if (over) return;
          W = stage.clientWidth; H = stage.clientHeight;
          vy = Math.min(vy + g * dt, 1.1); y += vy * dt;
          if (y < 0.04) { y = 0.04; vy = 0; }
          if (y > 0.96) { y = 0.96; vy = jump * 0.7; hit(); }
          inv = Math.max(0, inv - dt);
          sp -= dt;
          if (sp <= 0) { sp = clamp(1.75 - api.diff * 0.45, 1.15, 1.9); gates.push({ x: 1.12, c: api.rng.float(0.16 + gap / 2, 0.84 - gap / 2), b: api.rng.chance(0.45) }); }
          for (const q of gates) {
            q.x -= speed * dt;
            if (Math.abs(q.x - px) < 0.075 && (y < q.c - gap / 2 + 0.02 || y > q.c + gap / 2 - 0.02)) hit();
            if (q.b && !q.got && Math.abs(q.x - px) < 0.05 && Math.abs(y - q.c) < 0.07) { q.got = true; bonus++; api.sfx.coin(); }
            if (!q.done && q.x < px - 0.08) { q.done = true; passed++; show(); }
          }
          gates = gates.filter(q => q.x > -0.2);
          ctx.fillStyle = t.bg || '#1b3350'; ctx.fillRect(0, 0, W, H);
          for (const q of gates) {
            ctx.fillStyle = t.wall || '#3c8d5a';
            const x0 = (q.x - 0.07) * W, w = 0.14 * W;
            ctx.fillRect(x0, 0, w, (q.c - gap / 2) * H); ctx.fillRect(x0, (q.c + gap / 2) * H, w, H);
            if (t.cap) { emo(ctx, t.cap, q.x * W, (q.c - gap / 2) * H - 14, 24); emo(ctx, t.cap, q.x * W, (q.c + gap / 2) * H + 14, 24); }
            if (q.b && !q.got) emo(ctx, t.bonus || '⭐', q.x * W, q.c * H, 24);
          }
          if (!(inv > 0 && Math.floor(inv * 10) % 2)) emo(ctx, t.player, px * W, y * H, 36);
        });
      });
    },
  });
}

// 3) ZIPLA — koşarken engellerin üstünden atla.
export function jumpGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Karakter kendi koşar. Dokununca zıplar.', 'You run automatically. Tap to jump.'), B(`Engellerin üstünden atla, havadaki ödülleri kap.`, 'Jump over obstacles and grab the bonuses in the air.'), B('3 can, 30 saniye. Gittikçe hızlanır!', '3 lives, 30 seconds. It keeps getting faster!')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let W, H, y = 0, vy = 0, lives = 3, inv = 0, obs = [], sp = 1, jumped = 0, bonus = 0, over = false;
        const px = 0.2, G = 3.4, JV = 1.3;
        const tap = () => { if (!over && y <= 0.001) { vy = JV; api.sfx.whoosh(); } };
        stage.addEventListener('pointerdown', tap);
        api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
        const show = () => api.setScore(`${hearts(lives)} ${jumped}`);
        const end = () => { if (over) return; over = true; tm.stop(); resolve(pct(jumped * 5.2 + bonus * 4 + lives * 6)); };
        const tm = api.timerLoop(30, end);
        show();
        api.loop(dt => {
          if (over) return;
          W = stage.clientWidth; H = stage.clientHeight;
          const v = (0.42 + api.diff * 0.22) * (1 + tm.elapsed() / 50);
          if (y > 0 || vy > 0) { vy -= G * dt; y = Math.max(0, y + vy * dt); if (y === 0) vy = 0; }
          inv = Math.max(0, inv - dt);
          sp -= dt;
          if (sp <= 0) {
            sp = api.rng.float(0.85, 1.7) * clamp(1.1 - api.diff * 0.3 + api.ease * 0.15, 0.7, 1.2);
            obs.push(api.rng.chance(0.3) ? { x: 1.1, air: true, e: t.bonus || '⭐' } : { x: 1.1, e: api.rng.pick(t.obstacles) });
          }
          for (const o of obs) {
            o.x -= v * dt;
            if (o.done) continue;
            if (o.air) { if (Math.abs(o.x - px) < 0.05 && y > 0.12) { o.done = true; bonus++; api.sfx.coin(); } }
            else if (Math.abs(o.x - px) < 0.045 && y < 0.07) { o.done = true; if (inv <= 0) { lives--; inv = 1; api.bad(t.hitText || TX.crash); show(); if (lives <= 0) end(); } }
            else if (o.x < px - 0.05) { o.done = true; jumped++; show(); }
          }
          obs = obs.filter(o => o.x > -0.1);
          const ground = H * 0.78;
          ctx.fillStyle = t.bg || '#243b5a'; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = t.ground || '#6b4f2a'; ctx.fillRect(0, ground + 18, W, H - ground);
          for (const o of obs) if (!(o.air && o.done)) emo(ctx, o.e, o.x * W, o.air ? ground - H * 0.3 : ground, o.air ? 26 : 34);
          if (!(inv > 0 && Math.floor(inv * 10) % 2)) emo(ctx, t.player, px * W, ground - y * H, 40);
        });
      });
    },
  });
}

// 4) YILAN — yönünü seç, topla, kendine ve duvara çarpma.
export function snakeGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Gitmek istediğin yöne dokun ya da kaydır.', 'Tap or swipe the way you want to go.'), B('Topladıkça uzarsın. Duvara ve kendine çarpma!', 'You grow as you collect. Don\'t hit the walls or yourself!'), B('3 can, 40 saniye.', '3 lives, 40 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        const C = 11, R = 14;
        let snake, dir, next, food, bad = [], got = 0, lives = 3, over = false, acc = 0;
        const reset = () => { snake = [{ x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 }]; dir = { x: 0, y: -1 }; next = dir; };
        const free = () => { let p; do p = { x: api.rng.int(0, C - 1), y: api.rng.int(0, R - 1) }; while (snake.some(s => s.x === p.x && s.y === p.y) || bad.some(b => b.x === p.x && b.y === p.y)); return p; };
        reset();
        food = { ...free(), e: api.rng.pick(t.food) };
        if (t.bad) for (let i = 0; i < 1 + Math.round(api.diff * 2); i++) bad.push({ ...free(), e: api.rng.pick(t.bad) });
        const turn = (dx, dy) => { if (dx === -dir.x && dy === -dir.y) return; next = { x: dx, y: dy }; };
        let sx = 0, sy = 0;
        const down = e => {
          sx = e.clientX; sy = e.clientY;
          // Dokunulan noktaya göre (başa göre baskın eksen)
          const r = stage.getBoundingClientRect(), cw = r.width / C, ch = r.height / R;
          const hx = (snake[0].x + 0.5) * cw + r.left, hy = (snake[0].y + 0.5) * ch + r.top;
          const dx = e.clientX - hx, dy = e.clientY - hy;
          if (dir.x === 0) turn(Math.sign(dx) || 1, 0); else turn(0, Math.sign(dy) || 1);
          if (Math.abs(dx) < cw && Math.abs(dy) < ch) return;
        };
        const up = e => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.hypot(dx, dy) > 30) Math.abs(dx) > Math.abs(dy) ? turn(Math.sign(dx), 0) : turn(0, Math.sign(dy)); };
        stage.addEventListener('pointerdown', down); stage.addEventListener('pointerup', up);
        api.onCleanup(() => { stage.removeEventListener('pointerdown', down); stage.removeEventListener('pointerup', up); });
        const show = () => api.setScore(`${hearts(lives)} ${got}`);
        const end = () => { if (over) return; over = true; tm.stop(); resolve(pct(got * 7.5 + lives * 4)); };
        const tm = api.timerLoop(40, end);
        show();
        const step = clamp(0.3 - api.diff * 0.12 + api.ease * 0.05, 0.15, 0.34);
        api.loop(dt => {
          if (over) return;
          acc += dt;
          if (acc >= step) {
            acc = 0; dir = next;
            const hd = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            const crash = hd.x < 0 || hd.y < 0 || hd.x >= C || hd.y >= R || snake.some(s => s.x === hd.x && s.y === hd.y);
            const bh = bad.find(b => b.x === hd.x && b.y === hd.y);
            if (crash || bh) { lives--; api.bad(t.hitText || TX.crash); show(); if (lives <= 0) return end(); reset(); if (bh) Object.assign(bh, free()); }
            else {
              snake.unshift(hd);
              if (hd.x === food.x && hd.y === food.y) { got++; api.sfx.coin(); show(); food = { ...free(), e: api.rng.pick(t.food) }; }
              else snake.pop();
            }
          }
          const W = stage.clientWidth, H = stage.clientHeight, cw = W / C, ch = H / R;
          ctx.fillStyle = t.bg || '#1d3b2a'; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = 'rgba(255,255,255,.04)';
          for (let x = 0; x < C; x++) for (let y = 0; y < R; y++) if ((x + y) % 2) ctx.fillRect(x * cw, y * ch, cw, ch);
          emo(ctx, food.e, (food.x + 0.5) * cw, (food.y + 0.5) * ch, Math.min(cw, ch) * 0.8);
          for (const b of bad) emo(ctx, b.e, (b.x + 0.5) * cw, (b.y + 0.5) * ch, Math.min(cw, ch) * 0.8);
          snake.forEach((s, i) => {
            if (i === 0) emo(ctx, t.head, (s.x + 0.5) * cw, (s.y + 0.5) * ch, Math.min(cw, ch) * 0.95);
            else { ctx.fillStyle = t.body || '#7ee081'; ctx.beginPath(); ctx.arc((s.x + 0.5) * cw, (s.y + 0.5) * ch, Math.min(cw, ch) * 0.36, 0, 7); ctx.fill(); }
          });
        });
      });
    },
  });
}

// 5) TUĞLA KIR — raketi kaydır, topu sektir.
export function breakoutGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Parmağınla alttaki raketi sağa sola kaydır.', 'Drag the paddle left and right.'), B('Topu sektirip üstteki her şeyi temizle.', 'Bounce the ball to clear everything at the top.'), B('Top düşerse can gider. 3 can, 45 saniye.', 'Drop the ball and you lose a life. 3 lives, 45 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        const cols = 6, rows = 3 + Math.round(api.diff * 2);
        const bricks = [];
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) bricks.push({ c, r, e: api.rng.pick(t.bricks), alive: true });
        const total = bricks.length;
        let px = 0.5, lives = 3, over = false, broke = 0;
        const pw = clamp(0.26 - api.diff * 0.08 + api.ease * 0.06, 0.16, 0.3);
        const sp0 = 0.55 + api.diff * 0.25;
        let ball = { x: 0.5, y: 0.75, vx: 0.3, vy: -sp0, stuck: 0.8 };
        const move = e => { const r = stage.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width, pw / 2, 1 - pw / 2); };
        stage.addEventListener('pointermove', move); stage.addEventListener('pointerdown', move);
        api.onCleanup(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', move); });
        const show = () => api.setScore(`${hearts(lives)} ${broke}/${total}`);
        const end = () => { if (over) return; over = true; tm.stop(); resolve(pct(broke / total * 88 + (broke === total ? 12 : 0) + lives * 2)); };
        const tm = api.timerLoop(45, end);
        show();
        api.loop(dt => {
          if (over) return;
          const W = stage.clientWidth, H = stage.clientHeight, ar = H / W;
          if (ball.stuck > 0) { ball.stuck -= dt; ball.x = px; ball.y = 0.86; }
          else {
            ball.x += ball.vx * dt; ball.y += ball.vy * dt / ar;
            if (ball.x < 0.02) { ball.x = 0.02; ball.vx = Math.abs(ball.vx); }
            if (ball.x > 0.98) { ball.x = 0.98; ball.vx = -Math.abs(ball.vx); }
            if (ball.y < 0.02) { ball.y = 0.02; ball.vy = Math.abs(ball.vy); }
            if (ball.vy > 0 && ball.y > 0.88 && ball.y < 0.92 && Math.abs(ball.x - px) < pw / 2 + 0.02) {
              const off = (ball.x - px) / (pw / 2);
              const s = Math.hypot(ball.vx, ball.vy) * 1.015;
              ball.vx = s * off * 0.75; ball.vy = -Math.sqrt(Math.max(0.05, s * s - ball.vx * ball.vx)); api.sfx.tap();
            }
            if (ball.y > 1.02) { lives--; api.bad(t.missText || B('Top kaçtı!', 'Missed the ball!')); show(); if (lives <= 0) return end(); ball = { x: px, y: 0.86, vx: api.rng.float(-0.3, 0.3), vy: -sp0, stuck: 0.8 }; }
            const bw = 1 / cols, bh = 0.055;
            for (const b of bricks) {
              if (!b.alive) continue;
              const x0 = b.c * bw, y0 = 0.08 + b.r * bh;
              if (ball.x > x0 && ball.x < x0 + bw && ball.y > y0 && ball.y < y0 + bh) {
                b.alive = false; broke++; api.sfx.coin(); show(); ball.vy = -ball.vy;
                if (broke === total) return end();
                break;
              }
            }
          }
          ctx.fillStyle = t.bg || '#1e2448'; ctx.fillRect(0, 0, W, H);
          const bw = W / cols, bh = H * 0.055;
          for (const b of bricks) if (b.alive) { ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(b.c * bw + 2, H * 0.08 + b.r * bh + 2, bw - 4, bh - 4); emo(ctx, b.e, (b.c + 0.5) * bw, H * 0.08 + (b.r + 0.5) * bh, Math.min(bw, bh) * 0.8); }
          ctx.fillStyle = t.paddle || '#8f7bff'; ctx.fillRect((px - pw / 2) * W, H * 0.9, pw * W, 10);
          emo(ctx, t.ball || '⚪', ball.x * W, ball.y * H, 20);
        });
      });
    },
  });
}

// 6) REFLEKS — işaret gelince dokun, erken dokunma.
export function reactGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Bekle… ${t.go} görünce hemen dokun!`, `Wait… tap the moment you see ${t.go}!`), B('Erken dokunursan o tur yanar.', 'Tap too early and the round is lost.'), t.fake ? B(`${t.fake} tuzaktır, ona dokunma.`, `${t.fake} is a trap — don't tap it.`) : B('6 tur; ne kadar hızlı, o kadar puan.', '6 rounds; the faster, the better.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const box = h('div', { style: { flex: 1, minHeight: '320px', borderRadius: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: t.bg || '#2a2f55', transition: 'background .1s', userSelect: 'none' } });
        stage.replaceChildren(h('div.col', { style: { flex: 1, display: 'flex' } }, box));
        for (let r = 0; r < 6; r++) {
          const emoji = h('div', { style: { fontSize: '90px', lineHeight: 1 } }, t.wait);
          const lbl = h('div', { style: { fontWeight: 900, fontSize: '20px' } }, t.waitText || B('Bekle…', 'Wait…'));
          box.replaceChildren(emoji, lbl, h('div.tiny.muted', {}, `${r + 1}/6`));
          box.style.background = t.bg || '#2a2f55';
          const fakeRound = t.fake && api.rng.chance(0.25 + api.diff * 0.15);
          const delay = api.rng.float(1.1, 3.2) * 1000;
          const got = await new Promise(res => {
            let state = 'wait', t0 = 0, fin = false;
            const done = v => { if (fin) return; fin = true; box.onpointerdown = null; clearTimeout(a); clearTimeout(b); res(v); };
            box.onpointerdown = () => {
              if (state === 'wait') { api.bad(B('Erken!', 'Too early!')); done(0); }
              else if (state === 'fake') { api.bad(B('Tuzak!', 'Trap!')); done(0); }
              else { const rt = performance.now() - t0; const q = clamp(1 - (rt - 260) / (650 * api.timeMul + api.ease * 250), 0.2, 1); api.good(`${Math.round(rt)} ms`); done(q); }
            };
            const a = setTimeout(() => {
              if (fakeRound) { state = 'fake'; emoji.textContent = t.fake; lbl.textContent = B('Dokunma!', "Don't tap!"); box.style.background = '#5a3a1a'; b2(); return; }
              state = 'go'; t0 = performance.now(); emoji.textContent = t.go; lbl.textContent = t.goText || B('ŞİMDİ!', 'NOW!'); box.style.background = t.goBg || '#1f7a52';
              b = setTimeout(() => { api.bad(B('Geç kaldın', 'Too slow')); done(0); }, 1400 * api.timeMul);
            }, delay);
            let b;
            const b2 = () => { b = setTimeout(() => { api.good(B('Sabrettin!', 'Well held!')); done(1); }, 1100); };
          });
          pts += got * 16.7; api.setScore(Math.round(pts));
          await sleep(550);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 7) DOĞRU SIRA — adımları doğru sırayla dokun.
export function orderGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Karışık verilen adımları doğru sırayla dokun.', 'Tap the shuffled steps in the right order.'), B('Yanlış dokunuş puan götürür.', 'Wrong taps cost points.'), B('4 tur.', '4 rounds.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        const sets = api.rng.shuffle(t.sets.slice());
        for (let r = 0; r < 4; r++) {
          const [title, steps] = sets[r % sets.length];
          const got = await new Promise(res => {
            let k = 0, wrong = 0, fin = false;
            const order = api.rng.shuffle(steps.map((_, i) => i));
            const bs = order.map(i => h('button.qopt', { style: { textAlign: 'left' }, onclick: e => {
              if (fin || e.currentTarget.disabled) return;
              if (i === k) { e.currentTarget.disabled = true; e.currentTarget.classList.add('ok'); e.currentTarget.prepend(h('b', { style: { marginRight: '6px' } }, `${k + 1}.`)); k++; api.sfx.good(); if (k === steps.length) { fin = true; tl.stop(); res(clamp(1 - wrong * 0.2, 0, 1) * (0.75 + 0.25 * tl.left())); } }
              else { wrong++; api.bad(B('Sırası değil', 'Not yet')); }
            } }, steps[i]));
            stage.replaceChildren(h('div.col', {}, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/4`), h('span.grow')), h('div.qcard', { style: { fontSize: '17px' } }, title), h('div.col', { style: { gap: '6px' } }, bs)));
            const tl = api.timerLoop(clamp(10 + steps.length * 3.5 + api.ease * 5 - api.diff * 4, 12, 32), () => { fin = true; res(k / steps.length * 0.5); });
          });
          pts += got * 25; api.setScore(Math.round(pts));
          await sleep(500);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 8) HANGİSİ DAHA … — iki seçenekten ölçütü büyük olanı seç.
export function compareGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Soru: ${t.ask}`, `Question: ${EN(t.ask)}`), B('İki seçenekten doğru olana dokun; cevaptan sonra gerçek değerleri görürsün.', 'Tap the right one of the two; you will see the real values after.'), B('10 soru, hız da önemli.', '10 questions; speed counts too.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let ok = 0;
        const fmt = v => (t.fmt ? t.fmt(v) : num(v)) + (t.unit ? ' ' + T(t.unit) : '');
        const tm = api.timerLoop(clamp(55 + api.ease * 10 - api.diff * 12, 38, 70), () => {});
        let timeUp = false;
        for (let r = 0; r < 10 && !timeUp; r++) {
          let a, b;
          do { [a, b] = api.rng.shuffle(t.items.slice()).slice(0, 2); } while (a[1] === b[1]);
          const want = t.less ? Math.min(a[1], b[1]) : Math.max(a[1], b[1]);
          const good = await new Promise(res => {
            const make = x => h('button.qopt', { style: { minHeight: '84px', fontSize: '18px' }, onclick: () => res(x[1] === want) }, x[0]);
            stage.replaceChildren(h('div.col', {}, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/10`), h('span.grow'), h('span', { style: { fontSize: '26px' } }, t.icon)), h('div.qcard', {}, t.ask), make(a), h('div.center.muted', {}, B('ya da', 'or')), make(b)));
            const iv = setInterval(() => { if (tm.left() <= 0) { clearInterval(iv); timeUp = true; res(false); } }, 200);
          });
          const info = `${T(a[0])}: ${fmt(a[1])} · ${T(b[0])}: ${fmt(b[1])}`;
          if (good) { ok++; api.good(info); } else api.bad(info);
          api.setScore(`${ok}/10`);
          await sleep(900);
        }
        tm.stop();
        resolve(pct(ok * 10 + (ok >= 9 ? 5 : 0)));
      });
    },
  });
}

// 9) LABİRENT — çıkışa ulaş, yol üstündekileri topla.
function makeMaze(rng, C, R) {
  const walls = Array.from({ length: R }, () => Array.from({ length: C }, () => ({ n: 1, s: 1, e: 1, w: 1 })));
  const seen = Array.from({ length: R }, () => Array(C).fill(false));
  const st = [[0, 0]]; seen[0][0] = true;
  const D = [[0, -1, 'n', 's'], [0, 1, 's', 'n'], [1, 0, 'e', 'w'], [-1, 0, 'w', 'e']];
  while (st.length) {
    const [x, y] = st[st.length - 1];
    const nb = D.filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < C && ny < R && !seen[ny][nx]; });
    if (!nb.length) { st.pop(); continue; }
    const [dx, dy, a, b] = rng.pick(nb);
    walls[y][x][a] = 0; walls[y + dy][x + dx][b] = 0; seen[y + dy][x + dx] = true; st.push([x + dx, y + dy]);
  }
  // Birkaç ek geçit: tek yol yerine seçenekler
  for (let i = 0; i < Math.round(C * R * 0.06); i++) {
    const x = rng.int(0, C - 2), y = rng.int(0, R - 1);
    walls[y][x].e = 0; walls[y][x + 1].w = 0;
  }
  return walls;
}
export function mazeGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Ok tuşlarıyla ya da kaydırarak ilerle.', 'Move with the arrows or by swiping.'), B(`${t.items ? t.items[0] + ' topla, sonra ' : ''}${t.goal} noktasına ulaş.`, t.items ? `Collect ${t.items[0]}, then reach ${t.goal}.` : `Reach ${t.goal}.`), B('3 labirent, süre sınırlı.', '3 mazes, limited time.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        for (let m = 0; m < 3; m++) {
          const C = clamp(5 + m + Math.round(api.diff * 2), 5, 8), R = C + 2;
          const walls = makeMaze(api.rng, C, R);
          const pos = { x: 0, y: 0 };
          const goal = { x: C - 1, y: R - 1 };
          const pick = [];
          if (t.items) for (let i = 0; i < 3; i++) { let p; do p = { x: api.rng.int(0, C - 1), y: api.rng.int(1, R - 1) }; while ((p.x === goal.x && p.y === goal.y) || pick.some(q => q.x === p.x && q.y === p.y)); pick.push({ ...p, e: api.rng.pick(t.items) }); }
          const cv = h('canvas', { style: { width: '100%', maxWidth: '340px', aspectRatio: `${C}/${R}`, display: 'block', margin: '0 auto', borderRadius: '12px', touchAction: 'none' } });
          const pad = (e, dx, dy) => h('button.btn', { style: { width: '64px', height: '52px', fontSize: '22px' }, onpointerdown: ev => { ev.preventDefault(); mv(dx, dy); } }, e);
          stage.replaceChildren(h('div.col', { style: { gap: '8px', alignItems: 'center' } }, h('div.tiny.muted', {}, `${m + 1}/3`), cv,
            h('div.row', { style: { justifyContent: 'center', gap: '6px' } }, pad('⬅️', -1, 0), h('div.col', { style: { gap: '6px' } }, pad('⬆️', 0, -1), pad('⬇️', 0, 1)), pad('➡️', 1, 0))));
          const ctx = cv.getContext('2d');
          const draw = () => {
            const W = cv.clientWidth || 300, H = W * R / C, dpr = Math.min(2, devicePixelRatio || 1);
            cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const cw = W / C, ch = H / R;
            ctx.fillStyle = t.bg || '#1b2446'; ctx.fillRect(0, 0, W, H);
            ctx.strokeStyle = t.wall || '#9aa7ff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
            for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
              const w = walls[y][x], X = x * cw, Y = y * ch;
              ctx.beginPath();
              if (w.n) { ctx.moveTo(X, Y); ctx.lineTo(X + cw, Y); }
              if (w.w) { ctx.moveTo(X, Y); ctx.lineTo(X, Y + ch); }
              if (y === R - 1 && w.s) { ctx.moveTo(X, Y + ch); ctx.lineTo(X + cw, Y + ch); }
              if (x === C - 1 && w.e) { ctx.moveTo(X + cw, Y); ctx.lineTo(X + cw, Y + ch); }
              ctx.stroke();
            }
            const s = Math.min(cw, ch) * 0.72;
            for (const p of pick) if (!p.got) emo(ctx, p.e, (p.x + 0.5) * cw, (p.y + 0.5) * ch, s);
            emo(ctx, t.goal, (goal.x + 0.5) * cw, (goal.y + 0.5) * ch, s);
            emo(ctx, t.player, (pos.x + 0.5) * cw, (pos.y + 0.5) * ch, s);
          };
          let res0, fin = false;
          const mv = (dx, dy) => {
            if (fin) return;
            const w = walls[pos.y][pos.x];
            if ((dx === 1 && w.e) || (dx === -1 && w.w) || (dy === 1 && w.s) || (dy === -1 && w.n)) { api.vibrate(10); return; }
            pos.x += dx; pos.y += dy; api.sfx.tap();
            const p = pick.find(q => !q.got && q.x === pos.x && q.y === pos.y);
            if (p) { p.got = true; api.sfx.coin(); }
            if (pos.x === goal.x && pos.y === goal.y) {
              const miss = pick.filter(q => !q.got).length;
              if (miss) api.feedback(B(`Önce hepsini topla (${miss} kaldı)`, `Collect them all first (${miss} left)`), '#ffb547');
              else { fin = true; tl.stop(); api.good(t.okText || B('Çıkış!', 'Made it!')); res0(0.7 + 0.3 * tl.left()); }
            }
            draw();
          };
          let sx, sy;
          cv.onpointerdown = e => { sx = e.clientX; sy = e.clientY; };
          cv.onpointerup = e => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.hypot(dx, dy) > 22) Math.abs(dx) > Math.abs(dy) ? mv(Math.sign(dx), 0) : mv(0, Math.sign(dy)); };
          requestAnimationFrame(draw);
          const tl = api.timerLoop(clamp(20 + C * 2.5 + api.ease * 8 - api.diff * 5, 18, 45), () => { if (!fin) { fin = true; api.bad(TX.timeUp); res0(pick.filter(q => q.got).length * 0.08); } });
          const got = await new Promise(r => { res0 = r; });
          pts += got * 33.4; api.setScore(Math.round(pts));
          await sleep(500);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 10) ŞİFRE KIR — renk/simge kodunu ipuçlarıyla bul.
export function codeGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Gizli bir kod var. Simgeleri seçip "Dene"ye bas.', 'There is a secret code. Pick symbols and press "Try".'), B('🟢 = doğru simge doğru yerde, 🟡 = doğru simge yanlış yerde.', '🟢 = right symbol, right spot; 🟡 = right symbol, wrong spot.'), B('Ne kadar az denemede bulursan o kadar iyi. 2 kod.', 'The fewer tries, the better. 2 codes.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const L = api.diff > 0.6 ? 4 : 3, maxTry = 8;
        const syms = t.symbols.slice(0, api.diff > 0.4 ? 6 : 5);
        for (let r = 0; r < 2; r++) {
          const code = Array.from({ length: L }, () => api.rng.pick(syms));
          const got = await new Promise(res => {
            let cur = [], hist = [];
            const slots = h('div.row', { style: { justifyContent: 'center', gap: '8px' } });
            const log = h('div.col', { style: { gap: '4px', minHeight: '150px' } });
            const redraw = () => {
              slots.replaceChildren(...Array.from({ length: L }, (_, i) => h('div.cell', { style: { width: '52px', height: '52px', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, cur[i] || '·')));
              log.replaceChildren(...hist.map(([g, a, b]) => h('div.row', { style: { justifyContent: 'center', gap: '10px', fontSize: '20px' } }, h('span', {}, g.join(' ')), h('span.small', {}, '🟢'.repeat(a) + '🟡'.repeat(b) || '✖️'))));
            };
            const tryIt = () => {
              if (cur.length < L) return;
              let a = 0, b = 0; const cc = [], gg = [];
              cur.forEach((s, i) => { if (s === code[i]) a++; else { cc.push(code[i]); gg.push(s); } });
              for (const s of gg) { const k = cc.indexOf(s); if (k >= 0) { b++; cc.splice(k, 1); } }
              hist.push([cur, a, b]); cur = [];
              if (a === L) { api.good(t.okText || B('Kod çözüldü!', 'Cracked!')); redraw(); return setTimeout(() => res(clamp(1.1 - (hist.length - 1) * 0.12, 0.25, 1)), 700); }
              if (hist.length >= maxTry) { api.bad(`${code.join(' ')}`); redraw(); return setTimeout(() => res(0.1), 900); }
              api.sfx.tap(); redraw();
            };
            stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
              h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/2`), h('span.grow'), h('span.small.muted', {}, B(`Deneme hakkı: ${maxTry}`, `Tries: ${maxTry}`))),
              slots, log,
              h('div.row', { style: { flexWrap: 'wrap', gap: '6px', justifyContent: 'center' } }, syms.map(s => h('button.btn', { style: { fontSize: '24px', width: '54px' }, onclick: () => { if (cur.length < L) { cur.push(s); redraw(); } } }, s))),
              h('div.row', { style: { gap: '8px' } }, btn('⌫', () => { cur.pop(); redraw(); }, 'ghost'), btn(B('Dene ✔', 'Try ✔'), tryIt, 'primary grow'))));
            redraw();
          });
          pts += got * 50; api.setScore(Math.round(pts));
          await sleep(400);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 11) KAYDIRMALI BULMACA — parçaları boşluğa kaydırıp sıraya diz.
export function slideGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Boşluğun yanındaki parçaya dokun, kayar.', 'Tap a tile next to the gap to slide it.'), B('Parçaları 1\'den 8\'e sıraya diz.', 'Put the tiles in order from 1 to 8.'), B('60 saniye.', '60 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        let b = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const nbr = i => [i - 3, i + 3, i % 3 ? i - 1 : -1, i % 3 < 2 ? i + 1 : -1].filter(j => j >= 0 && j < 9);
        let last = -1;
        for (let k = 0; k < 14 + Math.round(api.diff * 22); k++) { const z = b.indexOf(0); const opts = nbr(z).filter(j => j !== last); const j = api.rng.pick(opts); last = z; [b[z], b[j]] = [b[j], b[z]]; }
        if (b.every((v, i) => v === (i + 1) % 9)) { const z = b.indexOf(0), j = nbr(z)[0]; [b[z], b[j]] = [b[j], b[z]]; }
        let over = false, moves = 0;
        const grid = h('div.grid-board', { style: { gridTemplateColumns: 'repeat(3,1fr)', maxWidth: '330px', margin: 'auto', gap: '6px' } });
        const inPlace = () => b.filter((v, i) => v && v === i + 1).length;
        const draw = () => grid.replaceChildren(...b.map((v, i) => v ? h('button.cell', { style: { fontSize: '34px', flexDirection: 'column', background: v === i + 1 ? '#23604a' : (t.bg || '#2c3470') }, onclick: () => tap(i) }, t.tiles ? t.tiles[v - 1] : '', h('span.tiny', { style: { fontWeight: 900, opacity: .8 } }, v)) : h('div.cell', { style: { background: 'transparent', border: '2px dashed var(--line)' } })));
        const tap = i => {
          if (over) return;
          const z = b.indexOf(0);
          if (!nbr(z).includes(i)) { api.vibrate(10); return; }
          [b[z], b[i]] = [b[i], b[z]]; moves++; api.sfx.tap(); draw(); api.setScore(`${inPlace()}/8`);
          if (b.every((v, k) => v === (k + 1) % 9)) { over = true; tl.stop(); api.good(t.okText || B('Tamamlandı!', 'Solved!')); setTimeout(() => resolve(pct(75 + 25 * tl.left())), 500); }
        };
        stage.replaceChildren(h('div.col', { style: { gap: '10px' } }, t.goalText ? h('div.center.small.muted', {}, t.goalText) : null, grid));
        draw(); api.setScore(`${inPlace()}/8`);
        const tl = api.timerLoop(clamp(55 + api.ease * 20 - api.diff * 5, 45, 80), () => { over = true; resolve(pct(inPlace() * 7)); });
      });
    },
  });
}

// 12) HEPSİNİ SÖNDÜR — dokunduğun kare ve komşuları değişir.
export function lightsGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Bir kareye dokununca o ve komşuları değişir (${t.on} ↔ ${t.off}).`, `Tapping a square flips it and its neighbours (${t.on} ↔ ${t.off}).`), B(`Hepsini ${t.off} yap.`, `Make them all ${t.off}.`), B('3 bulmaca.', '3 puzzles.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        for (let r = 0; r < 3; r++) {
          const N = 3;
          const g = Array(N * N).fill(0);
          const flip = i => { const x = i % N, y = Math.floor(i / N); for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N) g[ny * N + nx] ^= 1; } };
          const k = 2 + r + Math.round(api.diff * 1.5);
          const presses = api.rng.shuffle([...Array(N * N).keys()]).slice(0, k);
          presses.forEach(flip);
          if (g.every(v => !v)) flip(4);
          const got = await new Promise(res => {
            let fin = false, taps = 0;
            const cells = g.map((_, i) => h('button.cell', { style: { fontSize: '40px' }, onclick: () => { if (fin) return; flip(i); taps++; api.sfx.tap(); draw(); if (g.every(v => !v)) { fin = true; tl.stop(); api.good(t.okText || B('Hepsi tamam!', 'All done!')); res(clamp(1 - Math.max(0, taps - k) * 0.08, 0.4, 1) * (0.8 + 0.2 * tl.left())); } } }));
            const draw = () => cells.forEach((c, i) => { c.textContent = g[i] ? t.on : t.off; c.style.background = g[i] ? (t.onBg || '#6b5a1a') : (t.offBg || '#1d2447'); });
            stage.replaceChildren(h('div.col', { style: { gap: '10px' } }, h('div.center.small.muted', {}, `${r + 1}/3`), h('div.grid-board', { style: { gridTemplateColumns: `repeat(${N},1fr)`, maxWidth: '300px', margin: 'auto' } }, cells)));
            draw();
            const tl = api.timerLoop(clamp(22 + api.ease * 8 - api.diff * 4, 16, 32), () => { fin = true; res(g.filter(v => !v).length / (N * N) * 0.4); });
          });
          pts += got * 33.4; api.setScore(Math.round(pts));
          await sleep(450);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 13) RİTİM — şeritlerden düşen notalar çizgiye gelince şeridine dokun.
export function rhythmGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Notalar üç şeritte aşağı iner.', 'Notes fall down three lanes.'), B('Çizgiye geldiğinde o şeridin tuşuna dokun.', 'Tap that lane\'s button when a note reaches the line.'), B('Boşa basmak ve kaçırmak puan götürür. 30 saniye.', 'Missed notes and wild taps cost points. 30 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const cvWrap = h('div', { style: { position: 'relative', flex: 1, minHeight: '330px' } });
        const keys = [0, 1, 2].map(l => h('button.btn', { style: { flex: 1, height: '64px', fontSize: '26px' }, onpointerdown: e => { e.preventDefault(); hit(l); } }, (t.keys || ['🔴', '🟢', '🔵'])[l]));
        stage.replaceChildren(h('div.col', { style: { flex: 1, display: 'flex', gap: '8px' } }, cvWrap, h('div.row', { style: { gap: '6px' } }, keys)));
        const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } });
        cvWrap.append(cv);
        const ctx = cv.getContext('2d');
        let notes = [], sp = 0.5, hits = 0, miss = 0, wild = 0, over = false, streak = 0;
        const spd = 0.34 + api.diff * 0.24;
        const zone = 0.86, tol = clamp(0.075 + api.ease * 0.03 - api.diff * 0.02, 0.05, 0.1);
        const hit = l => {
          if (over) return;
          const n = notes.filter(q => !q.done && q.l === l).sort((a, b) => Math.abs(a.y - zone) - Math.abs(b.y - zone))[0];
          if (n && Math.abs(n.y - zone) < tol) { n.done = true; hits++; streak++; api.sfx.tap(); if (streak % 5 === 0) api.good(B(`Seri ×${streak}`, `Streak ×${streak}`)); }
          else { wild++; streak = 0; api.vibrate(15); }
          api.setScore(hits);
        };
        const end = () => { if (over) return; over = true; resolve(pct(hits / Math.max(1, hits + miss) * 100 - wild * 2)); };
        api.timerLoop(30, end);
        api.loop(dt => {
          if (over) return;
          const r = cvWrap.getBoundingClientRect(), W = r.width, H = r.height, dpr = Math.min(2, devicePixelRatio || 1);
          if (cv.width !== Math.round(W * dpr)) { cv.width = W * dpr; cv.height = H * dpr; }
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          sp -= dt;
          if (sp <= 0) { sp = clamp(0.62 - api.diff * 0.24, 0.3, 0.7) * api.rng.pick([1, 1, 0.5, 1.5]); notes.push({ l: api.rng.int(0, 2), y: -0.05, e: api.rng.pick(t.notes) }); }
          for (const n of notes) { n.y += spd * dt; if (!n.done && n.y > zone + tol) { n.done = true; miss++; streak = 0; } }
          notes = notes.filter(n => n.y < 1.1 && !(n.done && n.y < zone + tol));
          ctx.fillStyle = t.bg || '#1a1636'; ctx.fillRect(0, 0, W, H);
          for (let l = 1; l < 3; l++) { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(W * l / 3 - 1, 0, 2, H); }
          ctx.fillStyle = 'rgba(61,220,151,.25)'; ctx.fillRect(0, (zone - tol) * H, W, tol * 2 * H);
          ctx.fillStyle = '#3ddc97'; ctx.fillRect(0, zone * H - 1, W, 2);
          for (const n of notes) if (!n.done) emo(ctx, n.e, W * (n.l + 0.5) / 3, n.y * H, 30);
        });
      });
    },
  });
}

// 14) KAÇ — parmağınla sürükle, düşenlerden kaç, iyileri topla.
export function dodgeGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Parmağını sürükleyerek ${t.player} karakterini gezdir.`, `Drag your finger to move ${t.player}.`), B(`Kaç: ${t.bad.join(' ')}`, `Dodge: ${t.bad.join(' ')}`), t.good ? B(`Topla: ${t.good.join(' ')} · 3 can, 25 saniye.`, `Collect: ${t.good.join(' ')} · 3 lives, 25 seconds.`) : B('3 can, 25 saniye dayan.', '3 lives; survive 25 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let p = { x: 0.5, y: 0.8 }, tgt = { x: 0.5, y: 0.8 }, items = [], sp = 0, lives = 3, inv = 0, got = 0, over = false;
        const move = e => { const r = stage.getBoundingClientRect(); tgt = { x: clamp((e.clientX - r.left) / r.width, 0.05, 0.95), y: clamp((e.clientY - r.top) / r.height - 0.08, 0.3, 0.94) }; };
        stage.addEventListener('pointermove', move); stage.addEventListener('pointerdown', move);
        api.onCleanup(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', move); });
        const show = () => api.setScore(`${hearts(lives)}${t.good ? ' ' + got : ''}`);
        const end = () => { if (over) return; over = true; tm.stop(); const alive = tm.elapsed() / (25 * api.timeMul); resolve(pct(alive * 55 + lives * 12 + (t.good ? Math.min(12, got * 1.5) : 9))); };
        const tm = api.timerLoop(25, end);
        show();
        api.loop(dt => {
          if (over) return;
          const W = stage.clientWidth, H = stage.clientHeight;
          p.x = lerp(p.x, tgt.x, dt * 12); p.y = lerp(p.y, tgt.y, dt * 12);
          inv = Math.max(0, inv - dt);
          sp -= dt;
          const tt = tm.elapsed();
          if (sp <= 0) {
            sp = clamp(0.55 - api.diff * 0.2 - tt / 120, 0.18, 0.6);
            const good = t.good && api.rng.chance(0.28);
            items.push({ x: api.rng.float(0.05, 0.95), y: -0.05, vx: t.angle ? api.rng.float(-0.15, 0.15) : 0, v: (0.3 + api.diff * 0.25 + tt / 90) * api.rng.float(0.8, 1.3), e: api.rng.pick(good ? t.good : t.bad), good });
          }
          const ar = W / H;
          for (const it of items) {
            it.y += it.v * dt; it.x += it.vx * dt;
            if (!it.done && Math.hypot((it.x - p.x) * ar, it.y - p.y) < 0.055) {
              it.done = true;
              if (it.good) { got++; api.sfx.coin(); show(); }
              else if (inv <= 0) { lives--; inv = 1; api.bad(t.hitText || B('Ah!', 'Ouch!')); show(); if (lives <= 0) end(); }
            }
          }
          items = items.filter(it => it.y < 1.1 && !it.done);
          ctx.fillStyle = t.bg || '#1b2446'; ctx.fillRect(0, 0, W, H);
          for (const it of items) emo(ctx, it.e, it.x * W, it.y * H, 28);
          if (!(inv > 0 && Math.floor(inv * 10) % 2)) emo(ctx, t.player, p.x * W, p.y * H, 38);
        });
      });
    },
  });
}

// 15) TAHMİN ET — sayıyı "daha çok / daha az" ipuçlarıyla bul.
export function guessGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`${t.ask} (${t.min}–${t.max})`, `${EN(t.ask)} (${t.min}–${t.max})`), B('Kaydırıcıyla tahmin et; "daha çok" ya da "daha az" ipucu alırsın.', 'Guess with the slider; you will be told "higher" or "lower".'), B('3 tur, 6 deneme hakkı.', '3 rounds, 6 tries each.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        for (let r = 0; r < 3; r++) {
          const st = t.step || 1, dec = (String(st).split('.')[1] || '').length, R = v => +(Math.round(v / st) * st).toFixed(dec);
          const secret = R(t.min + api.rng.int(0, Math.round((t.max - t.min) / st)) * st);
          let lo = t.min, hi = t.max;
          const got = await new Promise(res => {
            let tries = 0;
            const val = h('div.center', { style: { fontSize: '34px', fontWeight: 900 } });
            const hint = h('div.center', { style: { minHeight: '28px', fontWeight: 800 } });
            const range = h('div.center.small.muted');
            const sl = h('input.slider', { type: 'range', min: t.min, max: t.max, step: t.step || 1, value: Math.round((t.min + t.max) / 2 / (t.step || 1)) * (t.step || 1) });
            const upd = () => { val.textContent = `${num(R(+sl.value))}${t.unit ? ' ' + T(t.unit) : ''}`; range.textContent = `${num(lo)} – ${num(hi)}`; };
            sl.oninput = upd;
            const go = () => {
              const g = R(+sl.value); tries++;
              const close = Math.abs(g - secret) <= st * (t.tolerance || 0) + 1e-9;
              if (g === secret || close) { api.good(t.okText || B('Bildin!', 'Got it!')); return res(clamp(1.12 - tries * 0.12, 0.3, 1)); }
              if (g < secret) { lo = R(Math.max(lo, g + st)); hint.textContent = t.up || B('⬆️ Daha çok', '⬆️ Higher'); } else { hi = R(Math.min(hi, g - st)); hint.textContent = t.down || B('⬇️ Daha az', '⬇️ Lower'); }
              hint.style.color = '#ffd27a'; api.sfx.tap(); upd();
              if (tries >= 6) { api.bad(`${num(secret)}${t.unit ? ' ' + T(t.unit) : ''}`); res(0.1); }
            };
            stage.replaceChildren(h('div.col', { style: { gap: '12px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/3`), h('span.grow'), h('span', { style: { fontSize: '28px' } }, t.icon)),
              h('div.qcard', {}, t.ask), val, sl, range, hint, btn(B('Tahmin et', 'Guess'), go, 'primary block')));
            upd();
          });
          pts += got * 33.4; api.setScore(Math.round(pts));
          await sleep(600);
        }
        resolve(pct(pts));
      });
    },
  });
}
