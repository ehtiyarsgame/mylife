// Yeni oyun motorları (2/2): pompala, fırlat, bul, sayı avı, sudoku, bardak, renk tuzağı, desen hafızası,
// kelime, çanta hazırla, tam tutar, kurala göre patlat, sil-temizle, kes, çiz.
import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';
import { B, T, EN, lang, locale } from '../core/i18n.js';

const pct = v => Math.round(clamp(v, 0, 100));
const base = t => ({ spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages });
const emo = (ctx, e, x, y, size) => { ctx.fillStyle = '#fff'; ctx.font = `${size}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(e, x, y); };
const num = v => v.toLocaleString(locale());

// 1) POMPALA — hızlı dokun ama göstergeyi yeşil bölgede tut (taşırma!).
export function mashGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Dokundukça gösterge yükselir, bırakınca düşer.', 'Tapping raises the gauge; it drops when you stop.'), B('Göstergeyi hareket eden yeşil bölgede tut.', 'Keep the gauge inside the moving green zone.'), B('Yeşilde kaldığın süre puanındır. 20 saniye.', 'Your score is the time spent in the green. 20 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        let v = 0.1, inZone = 0, total = 0, over = false, c = 0.5, cv = 0;
        const zw = clamp(0.26 - api.diff * 0.1 + api.ease * 0.06, 0.14, 0.3);
        const fill = h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, background: t.color || '#ff8a3d', borderRadius: '12px', transition: 'height .05s' } });
        const zone = h('div', { style: { position: 'absolute', left: '-6px', right: '-6px', border: '3px solid #3ddc97', borderRadius: '10px', background: 'rgba(61,220,151,.18)' } });
        const tube = h('div', { style: { position: 'relative', width: '90px', height: '300px', margin: '0 auto', background: '#0a0d1c', borderRadius: '14px', border: '1px solid var(--line)' } }, fill, zone);
        const hero = h('div', { style: { fontSize: '64px', textAlign: 'center', transition: 'transform .08s' } }, t.icon);
        stage.replaceChildren(h('div.col', { style: { gap: '10px', margin: 'auto 0', userSelect: 'none' } }, hero, tube, h('div.center.small.muted', {}, t.tapText || B('Ekrana hızlı hızlı dokun!', 'Tap fast!'))));
        const tap = e => { e.preventDefault(); if (over) return; v = Math.min(1.05, v + (0.055 + api.ease * 0.01)); hero.style.transform = 'scale(1.08)'; setTimeout(() => (hero.style.transform = ''), 70); };
        stage.addEventListener('pointerdown', tap);
        api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
        const end = () => { if (over) return; over = true; resolve(pct(inZone / Math.max(0.1, total) * 112)); };
        api.timerLoop(20, end);
        api.loop((dt, now) => {
          if (over) return;
          v = Math.max(0, v - (0.2 + api.diff * 0.16) * dt);
          cv += api.rng.float(-1, 1) * dt * (0.6 + api.diff); cv = clamp(cv * 0.98, -0.25, 0.25);
          c = clamp(c + cv * dt + Math.sin(now / 1300) * dt * 0.08, 0.2 + zw / 2, 0.92 - zw / 2);
          total += dt;
          const ok = Math.abs(v - c) < zw / 2;
          if (ok) inZone += dt;
          fill.style.height = clamp(v, 0, 1) * 100 + '%';
          fill.style.background = v > c + zw / 2 ? '#ff5b7a' : ok ? '#3ddc97' : (t.color || '#ff8a3d');
          zone.style.bottom = (c - zw / 2) * 100 + '%'; zone.style.height = zw * 100 + '%';
          api.setScore(`${Math.round(inZone / Math.max(0.1, total) * 100)}%`);
        });
      });
    },
  });
}

// 2) FIRLAT — önce açıyı, sonra gücü durdur; hedefe düşür.
export function throwGame(t) {
  register({
    ...base(t),
    how: t.how || [B('1. dokunuş: dönen oku istediğin açıda durdur.', '1st tap: stop the swinging arrow at the angle you want.'), B('2. dokunuş: güç çubuğunu durdur.', '2nd tap: stop the power bar.'), B(`${t.target} hedefine en yakın düşür. 5 atış.`, `Land it as close to ${t.target} as you can. 5 throws.`)],
    play(stage, api) {
      return new Promise(async resolve => {
        const { ctx } = api.canvas();
        api.hideTimer();
        let pts = 0;
        for (let s = 0; s < 5; s++) {
          const tx = api.rng.float(0.55, 0.9);
          const wind = t.wind ? api.rng.float(-1, 1) * (0.05 + api.diff * 0.08) : 0;
          let phase = 0, ang = 0.2, angDir = 1, pow = 0, powDir = 1, ball = null, done = false, lastTap = 0;
          const tap = () => { const n = performance.now(); if (n - lastTap < 120) return; lastTap = n; if (phase < 2) { phase++; api.sfx.tap(); } };
          stage.addEventListener('pointerdown', tap);
          const got = await new Promise(res => {
            const stop = api.loop(dt => {
              const W = stage.clientWidth, H = stage.clientHeight, gy = H * 0.84, ox = W * 0.12;
              const aSpeed = (1.1 + api.diff * 0.9) * (1 - api.ease * 0.3), pSpeed = (0.9 + api.diff * 0.8) * (1 - api.ease * 0.3);
              if (phase === 0) { ang += angDir * aSpeed * dt; if (ang > 1.35) angDir = -1; if (ang < 0.15) angDir = 1; }
              else if (phase === 1) { pow += powDir * pSpeed * dt; if (pow > 1) { pow = 1; powDir = -1; } if (pow < 0) { pow = 0; powDir = 1; } }
              else if (!ball) {
                const v = 0.55 + pow * 0.95;
                ball = { x: 0.12, y: 0, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v };
              } else if (!done) {
                ball.vy -= 1.25 * dt; ball.vx += wind * dt; ball.x += ball.vx * dt * 0.62; ball.y += ball.vy * dt * 0.62;
                if (ball.y <= 0 || ball.x > 1.2) {
                  done = true; ball.y = 0;
                  const d = Math.abs(ball.x - tx);
                  const q = d < 0.03 ? 1 : d < 0.08 ? 0.75 : d < 0.15 ? 0.45 : d < 0.25 ? 0.2 : 0;
                  q >= 1 ? api.good(t.perfect || B('Tam isabet!', 'Bullseye!')) : q > 0.4 ? api.good(B('Yakın!', 'Close!')) : q ? api.feedback(B('Biraz uzak', 'A bit off'), '#ffb547') : api.bad(t.missText || B('Iskaladın', 'Missed'));
                  setTimeout(() => { stop(); res(q); }, 700);
                }
              }
              ctx.fillStyle = t.bg || '#1c2c4a'; ctx.fillRect(0, 0, W, H);
              ctx.fillStyle = t.ground || '#2f5a35'; ctx.fillRect(0, gy + 16, W, H - gy);
              emo(ctx, t.target, tx * W, gy, 38);
              emo(ctx, t.thrower || '🧍', ox, gy, 38);
              if (wind) emo(ctx, wind > 0 ? `💨→ ${Math.round(Math.abs(wind) * 400)}` : `← ${Math.round(Math.abs(wind) * 400)}💨`, W * 0.5, H * 0.08, 18);
              if (!ball) {
                ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox, gy - 20); ctx.lineTo(ox + Math.cos(ang) * 90, gy - 20 - Math.sin(ang) * 90); ctx.stroke();
                ctx.fillStyle = '#0a0d1c'; ctx.fillRect(W * 0.3, H * 0.14, W * 0.4, 16);
                ctx.fillStyle = phase >= 1 ? '#ff8a3d' : '#555'; ctx.fillRect(W * 0.3, H * 0.14, W * 0.4 * pow, 16);
                emo(ctx, phase === 0 ? B('Açı', 'Angle') : B('Güç', 'Power'), W * 0.5, H * 0.14 + 34, 15);
              } else emo(ctx, t.ball, ox + (ball.x - 0.12) * W, gy - 20 - ball.y * H, 28);
              emo(ctx, `${s + 1}/5`, W - 30, 20, 14);
            });
          });
          stage.removeEventListener('pointerdown', tap);
          pts += got * 20; api.setScore(Math.round(pts));
        }
        resolve(pct(pts));
      });
    },
  });
}

// 3) BUL BAKALIM — kalabalıkta aranan şeyi bul.
export function spotGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Üstte aranan şey yazıyor.', 'The thing to find is shown at the top.'), B('Kalabalığın içinde onu bul ve dokun.', 'Find it in the crowd and tap it.'), B('6 tur, hızlı ol.', '6 rounds, be quick.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        for (let r = 0; r < 6; r++) {
          const target = api.rng.pick(t.targets);
          const noise = t.noise.filter(e => e !== target);
          const n = clamp(18 + r * 5 + Math.round(api.diff * 16), 18, 60);
          const got = await new Promise(res => {
            let fin = false;
            const field = h('div', { style: { position: 'relative', height: '380px', background: t.bg || '#1a2242', borderRadius: '16px', overflow: 'hidden' } });
            const put = (e, good) => field.append(h('span', { style: { position: 'absolute', left: api.rng.float(1, 89) + '%', top: api.rng.float(1, 90) + '%', fontSize: api.rng.int(24, 32) + 'px', transform: `rotate(${api.rng.int(-25, 25)}deg)`, cursor: 'pointer', zIndex: good ? api.rng.int(1, 3) : api.rng.int(1, 4) }, onpointerdown: ev => { ev.stopPropagation(); if (fin) return; if (good) { fin = true; tl.stop(); ev.currentTarget.style.transform = 'scale(1.8)'; api.good(t.okText || B('Buldun!', 'Found it!')); setTimeout(() => res(0.55 + 0.45 * tl.left()), 400); } else { api.bad(B('O değil', 'Not that')); tl.penalty?.(); } } }, e));
            for (let i = 0; i < n; i++) put(api.rng.pick(noise), false);
            put(target, true);
            stage.replaceChildren(h('div.col', { style: { gap: '8px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/6`), h('span.grow'), h('b', {}, t.ask || B('Bul:', 'Find:')), h('span', { style: { fontSize: '34px' } }, target)), field));
            const tl = api.timerLoop(clamp(9 - api.diff * 3 + api.ease * 3, 5, 12), () => { if (!fin) { fin = true; api.bad(B('Bulamadın', 'Not found')); res(0); } });
          });
          pts += got * 16.7; api.setScore(Math.round(pts));
          await sleep(400);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 4) SIRAYLA DOKUN (Schulte) — karışık dizilmiş öğelere sırayla dokun.
export function schulteGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Izgaradaki öğelere sırayla dokun: ${t.hint || '1, 2, 3…'}`, `Tap the items in order: ${t.hint || '1, 2, 3…'}`), B('Yanlış dokunuş süre kaybettirir.', 'Wrong taps cost time.'), B('2 tur.', '2 rounds.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        for (let r = 0; r < 2; r++) {
          const N = api.diff > 0.55 || r === 1 ? 5 : 4;
          const seq = t.labels(api.rng, N * N);
          const got = await new Promise(res => {
            let k = 0, fin = false, wrong = 0;
            const order = api.rng.shuffle(seq.map((_, i) => i));
            const nextLbl = h('b', {}, seq[0]);
            const cells = order.map(i => h('button.cell', { style: { fontSize: N > 4 ? '17px' : '21px', fontWeight: 900, padding: 0 }, onclick: e => {
              if (fin) return;
              if (i === k) { e.currentTarget.style.background = '#23604a'; e.currentTarget.style.opacity = '.55'; k++; api.sfx.tap(); if (k === seq.length) { fin = true; tl.stop(); res(clamp(0.6 + 0.4 * tl.left() - wrong * 0.03, 0.3, 1)); } else nextLbl.textContent = seq[k]; }
              else { wrong++; api.bad(B('Sıradaki değil', 'Not the next one')); }
            } }, seq[i]));
            stage.replaceChildren(h('div.col', { style: { gap: '8px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/2`), h('span.grow'), h('span.small', {}, B('Sıradaki:', 'Next:'), ' '), nextLbl),
              h('div.grid-board', { style: { gridTemplateColumns: `repeat(${N},1fr)`, maxWidth: '370px', margin: 'auto', gap: '4px' } }, cells)));
            const tl = api.timerLoop(clamp(N * N * (1.9 - api.diff * 0.5 + api.ease * 0.4), 18, 55), () => { fin = true; res(k / seq.length * 0.55); });
          });
          pts += got * 50; api.setScore(Math.round(pts));
          await sleep(400);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 5) MİNİ SUDOKU — 4×4: her satır, sütun ve kutuda her simge bir kez.
export function sudokuGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Her satırda, sütunda ve 2×2 kutuda her simge yalnızca bir kez olmalı.', 'Each row, column and 2×2 box must contain each symbol exactly once.'), B('Boş kareye dokundukça simge değişir.', 'Tap an empty square to cycle its symbol.'), B('2 bulmaca.', '2 puzzles.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        const S = t.symbols;
        for (let r = 0; r < 2; r++) {
          // Geçerli bir çözüm: temel kalıp + satır/sütun/simge karıştırma
          const baseG = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
          const rows = [...api.rng.shuffle([0, 1]), ...api.rng.shuffle([2, 3])];
          const bandSwap = api.rng.chance(0.5);
          const cols = [...api.rng.shuffle([0, 1]), ...api.rng.shuffle([2, 3])];
          const perm = api.rng.shuffle([0, 1, 2, 3]);
          const sol = [0, 1, 2, 3].map(i => { const rr = bandSwap ? (rows[i] + 2) % 4 : rows[i]; return cols.map(c => perm[baseG[rr][c]]); });
          const blanks = clamp(6 + r * 2 + Math.round(api.diff * 3), 6, 11);
          const hole = new Set(api.rng.shuffle([...Array(16).keys()]).slice(0, blanks));
          const cur = sol.flat().map((v, i) => hole.has(i) ? -1 : v);
          const got = await new Promise(res => {
            let fin = false;
            const cells = cur.map((v, i) => h('button.cell', { style: { fontSize: '30px', background: hole.has(i) ? '#243060' : '#161c38', borderRight: i % 4 === 1 ? '3px solid #8f7bff' : '', borderBottom: Math.floor(i / 4) === 1 ? '3px solid #8f7bff' : '' }, onclick: () => {
              if (fin || !hole.has(i)) return;
              cur[i] = cur[i] >= 3 ? -1 : cur[i] + 1; cells[i].textContent = cur[i] < 0 ? '' : S[cur[i]]; api.sfx.tap();
              if (cur.every((v, k) => v === sol.flat()[k])) { fin = true; tl.stop(); api.good(t.okText || B('Çözdün!', 'Solved!')); setTimeout(() => res(0.7 + 0.3 * tl.left()), 500); }
            } }, v < 0 ? '' : S[v]));
            stage.replaceChildren(h('div.col', { style: { gap: '10px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/2`), h('span.grow'), h('span.small.muted', {}, S.join(' '))),
              h('div.grid-board', { style: { gridTemplateColumns: 'repeat(4,1fr)', maxWidth: '320px', margin: 'auto', gap: '3px' } }, cells)));
            const tl = api.timerLoop(clamp(50 + api.ease * 20 - api.diff * 10, 35, 75), () => { fin = true; const right = [...hole].filter(i => cur[i] === sol.flat()[i]).length; res(right / hole.size * 0.5); });
          });
          pts += got * 50; api.setScore(Math.round(pts));
          await sleep(400);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 6) BARDAK OYUNU — saklanan şeyin hangi kabın altında olduğunu takip et.
export function shellGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`${t.item} bir ${t.cup} altına saklanır, sonra kaplar karışır.`, `${t.item} hides under a ${t.cup}, then they are shuffled.`), B('Gözünü ayırma; bittiğinde doğru kaba dokun.', 'Keep your eyes on it and tap the right one when it stops.'), B('5 tur, gittikçe hızlanır.', '5 rounds, getting faster.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const n = api.diff > 0.5 ? 4 : 3;
        const field = h('div', { style: { position: 'relative', height: '220px', margin: '40px 0' } });
        const lbl = h('div.center.small.muted');
        stage.replaceChildren(h('div.col', {}, lbl, field));
        for (let r = 0; r < 5; r++) {
          const slotX = i => `calc(${(i + 0.5) / n * 100}% - 36px)`;
          let at = [...Array(n).keys()]; // at[kap] = yuva
          const prize = api.rng.int(0, n - 1);
          const cups = at.map((_, i) => h('div', { style: { position: 'absolute', top: '60px', left: slotX(i), width: '72px', textAlign: 'center', fontSize: '60px', transition: 'left .3s ease-in-out, top .25s', cursor: 'pointer' } }, t.cup));
          const item = h('div', { style: { position: 'absolute', top: '130px', left: `calc(${(prize + 0.5) / n * 100}% - 18px)`, fontSize: '36px', transition: 'opacity .2s' } }, t.item);
          field.replaceChildren(item, ...cups);
          lbl.textContent = `${r + 1}/5 · ${T(B('İyi bak…', 'Watch closely…'))}`;
          cups[prize].style.top = '0px'; await sleep(900); cups[prize].style.top = '60px'; await sleep(350); item.style.opacity = '0';
          const swaps = 4 + r * 2 + Math.round(api.diff * 4);
          const dur = clamp(360 - r * 30 - api.diff * 120 + api.ease * 80, 170, 420);
          cups.forEach(c => (c.style.transition = `left ${dur}ms ease-in-out, top .25s`));
          for (let k = 0; k < swaps; k++) {
            const a = api.rng.int(0, n - 1); let b = api.rng.int(0, n - 2); if (b >= a) b++;
            const ca = at.indexOf(a), cb = at.indexOf(b);
            at[ca] = b; at[cb] = a;
            cups[ca].style.left = slotX(b); cups[cb].style.left = slotX(a);
            await sleep(dur + 40);
          }
          lbl.textContent = T(B('Hangisinde?', 'Which one?'));
          const ok = await new Promise(res => cups.forEach((c, i) => (c.onclick = () => { cups.forEach(x => (x.onclick = null)); res(i === prize); })));
          item.style.transition = 'none'; item.style.left = `calc(${(at[prize] + 0.5) / n * 100}% - 18px)`; item.style.opacity = '1';
          cups[prize].style.top = '0px';
          ok ? api.good(t.okText || B('Buldun!', 'Found it!')) : api.bad(B('Burada!', 'It was here!'));
          pts += ok ? 20 : 0; api.setScore(Math.round(pts));
          await sleep(900);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 7) RENK TUZAĞI (Stroop) — yazıya değil, rengine bak.
// i18n-skip-start
const COLORS = [['KIRMIZI', 'RED', '#ff4d5e'], ['MAVİ', 'BLUE', '#4d8dff'], ['YEŞİL', 'GREEN', '#3ddc97'], ['SARI', 'YELLOW', '#ffd23f'], ['MOR', 'PURPLE', '#b36bff']];
// i18n-skip-end
export function stroopGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Ekranda bir renk adı yazar ama başka renkte boyanmıştır.', 'A colour name appears, painted in a different colour.'), B('Yazının ne dediğine değil, BOYASININ rengine dokun.', 'Tap the colour of the INK, not what the word says.'), B('30 saniye; yanlış 2 saniye götürür.', '30 seconds; a wrong answer costs 2 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        let ok = 0, bad = 0, pen = 0, over = false, ink;
        const word = h('div', { style: { fontSize: '46px', fontWeight: 900, textAlign: 'center', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '2px' } });
        const cols = COLORS.slice(0, api.diff > 0.5 ? 5 : 4);
        const buttons = cols.map((c, i) => h('button.btn', { style: { flex: '1 1 40%', minHeight: '58px', background: c[2], color: '#111', fontWeight: 900 }, onclick: () => pick(i) }, lang === 'tr' ? c[0] : c[1]));
        stage.replaceChildren(h('div.col', { style: { gap: '14px', margin: 'auto 0' } }, t.tip ? h('div.center.small.muted', {}, t.tip) : null, word, h('div.row', { style: { flexWrap: 'wrap', gap: '8px' } }, buttons)));
        const next = () => { const w = api.rng.int(0, cols.length - 1); do ink = api.rng.int(0, cols.length - 1); while (ink === w && api.rng.chance(0.85)); word.textContent = lang === 'tr' ? cols[w][0] : cols[w][1]; word.style.color = cols[ink][2]; };
        const pick = i => { if (over) return; if (i === ink) { ok++; api.sfx.good(); } else { bad++; pen += 2; api.bad(B('Boyaya bak!', 'Look at the ink!')); } api.setScore(ok); next(); };
        next();
        const total = 30 * api.timeMul, t0 = performance.now();
        api.loop(() => { const f = 1 - ((performance.now() - t0) / 1000 + pen) / total; api.setTimer(f); if (f <= 0 && !over) { over = true; resolve(pct(ok / (16 - api.ease * 3) * 100 - bad * 3)); } });
      });
    },
  });
}

// 8) DESEN HAFIZASI — yanan kareleri ezberle, aynısını işaretle.
export function patternGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Bazı karelerde ${t.mark} belirir, ezberle.`, `${t.mark} appears on some squares — memorise them.`), B('Kaybolunca aynı kareleri işaretle.', 'When they vanish, tap the same squares.'), B('6 tur, her turda bir fazlası.', '6 rounds, one more each time.')],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const N = api.diff > 0.55 ? 5 : 4;
        for (let r = 0; r < 6; r++) {
          const k = 3 + r + Math.round(api.diff);
          const set = new Set(api.rng.shuffle([...Array(N * N).keys()]).slice(0, k));
          const cells = [...Array(N * N)].map(() => h('button.cell', { style: { fontSize: '26px', background: t.bg || '#1d2447' } }, ''));
          stage.replaceChildren(h('div.col', { style: { gap: '8px' } }, h('div.center.small.muted', {}, `${r + 1}/6 · ${k}`), h('div.grid-board', { style: { gridTemplateColumns: `repeat(${N},1fr)`, maxWidth: '340px', margin: 'auto', gap: '5px' } }, cells)));
          set.forEach(i => { cells[i].textContent = t.mark; cells[i].style.background = t.markBg || '#5a4a9a'; });
          await sleep(clamp(900 + k * 260 + api.ease * 600 - api.diff * 300, 900, 3200) * api.timeMul);
          set.forEach(i => { cells[i].textContent = ''; cells[i].style.background = t.bg || '#1d2447'; });
          const got = await new Promise(res => {
            let right = 0, wrong = 0;
            cells.forEach((c, i) => (c.onclick = () => {
              if (c.dataset.x) return; c.dataset.x = 1;
              if (set.has(i)) { right++; c.textContent = t.mark; c.style.background = '#23604a'; api.sfx.tap(); }
              else { wrong++; c.textContent = '✖️'; c.style.background = '#6a2233'; api.vibrate(20); }
              if (right === k || wrong >= 2) { cells.forEach(x => (x.onclick = null)); set.forEach(j => { if (!cells[j].dataset.x) { cells[j].textContent = t.mark; cells[j].style.opacity = '.45'; } }); res(clamp(right / k - wrong * 0.15, 0, 1)); }
            }));
          });
          got >= 1 ? api.good(B('Kusursuz!', 'Perfect!')) : got > 0.5 ? api.feedback(B('Az kaldı', 'Almost'), '#ffb547') : api.bad(B('Karıştı', 'Mixed up'));
          pts += got * 16.7; api.setScore(Math.round(pts));
          await sleep(700);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 9) KELİME KUR — karışık harflerden kelimeyi kur (dil seçimine göre).
export function wordGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Resme bak, karışık harflerden kelimeyi kur.', 'Look at the picture and build the word from the jumbled letters.'), B('Harflere sırayla dokun; yanlışsa ⌫ ile sil.', 'Tap the letters in order; use ⌫ to undo.'), B('45 saniyede olabildiğince çok kelime.', 'As many words as you can in 45 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const list = api.fresh(t.words, w => w[0] + w[1]);
        let k = 0, ok = 0, over = false, cur, typed, used;
        const pic = h('div', { style: { fontSize: '64px', textAlign: 'center' } });
        const out = h('div.row', { style: { justifyContent: 'center', gap: '4px', minHeight: '52px', flexWrap: 'wrap' } });
        const pad = h('div.row', { style: { justifyContent: 'center', gap: '6px', flexWrap: 'wrap' } });
        const next = () => {
          const w = list[k++ % list.length]; api.mark(w, x => x[0] + x[1]);
          const useTr = t.flip ? lang !== 'tr' : t.forceLang ? t.forceLang === 'tr' : lang === 'tr';
          cur = { e: w[0], word: useTr ? w[1] : w[2] };
          typed = []; used = new Set();
          let letters = [...cur.word];
          do letters = api.rng.shuffle(letters); while (letters.join('') === cur.word && cur.word.length > 1);
          pic.textContent = cur.e;
          pad.replaceChildren(...letters.map((ch, i) => h('button.btn', { style: { width: '46px', height: '50px', fontSize: '22px', fontWeight: 900 }, onclick: e => {
            if (over || used.has(i)) return; used.add(i); e.currentTarget.style.opacity = '.3'; typed.push([ch, e.currentTarget, i]); api.sfx.tap(); draw();
            if (typed.length === cur.word.length) {
              if (typed.map(x => x[0]).join('') === cur.word) { ok++; api.good(`${cur.word} ✔`); api.setScore(ok); setTimeout(next, 350); }
              else { api.bad(B('Olmadı, tekrar', 'Nope, again')); setTimeout(() => { typed.forEach(x => (x[1].style.opacity = '1')); typed = []; used.clear(); draw(); }, 350); }
            }
          } }, ch)));
          draw();
        };
        const draw = () => out.replaceChildren(...[...cur.word].map((_, i) => h('div', { style: { width: '36px', height: '46px', borderBottom: '3px solid #8f7bff', fontSize: '26px', fontWeight: 900, textAlign: 'center' } }, typed[i]?.[0] || '')));
        const undo = () => { const x = typed.pop(); if (x) { x[1].style.opacity = '1'; used.delete(x[2]); draw(); } };
        stage.replaceChildren(h('div.col', { style: { gap: '12px', margin: 'auto 0' } }, pic, out, pad, h('div.row', { style: { justifyContent: 'center', gap: '8px' } }, btn('⌫', undo, 'ghost'), btn(B('Pas ⏭', 'Skip ⏭'), () => { if (!over) next(); }, 'ghost'))));
        next();
        api.timerLoop(45 + api.ease * 8, () => { over = true; resolve(pct(ok / (t.target || 6) * 100)); });
      });
    },
  });
}

// 10) HAZIRLA — göreve uygun olanları seç (çanta, reçete, alet çantası…).
export function packGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Görevi oku, gerekenleri seç.', 'Read the task and pick what you need.'), B('Gereksiz olanları seçme! Seçtiğine tekrar dokunursan geri alırsın.', "Don't pick the unnecessary ones! Tap again to deselect."), B('"Hazır"a bas. 4 tur.', 'Press "Ready". 4 rounds.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        const sets = api.fresh(t.sets, s => s[0], 4);
        for (let r = 0; r < 4; r++) {
          const [task, need, extra] = sets[r % sets.length];
          const wrongN = clamp(3 + Math.round(api.diff * 3), 3, extra.length);
          const opts = api.rng.shuffle([...need.map(x => [x, 1]), ...api.rng.shuffle(extra.slice()).slice(0, wrongN).map(x => [x, 0])]);
          const got = await new Promise(res => {
            const sel = new Set(); let fin = false;
            const bs = opts.map(([x], i) => h('button.qopt', { style: { padding: '10px 6px', fontSize: '14px' }, onclick: e => { if (fin) return; sel.has(i) ? sel.delete(i) : sel.add(i); e.currentTarget.classList.toggle('glow', sel.has(i)); api.sfx.tap(); } }, x));
            const done = () => {
              if (fin) return; fin = true; tl.stop();
              let right = 0, wrong = 0;
              opts.forEach(([, g], i) => { if (sel.has(i) && g) right++; if (sel.has(i) && !g) wrong++; bs[i].classList.remove('glow'); bs[i].classList.add(g ? 'ok' : sel.has(i) ? 'no' : 'fade'); });
              const q = clamp(right / need.length - wrong * 0.25, 0, 1);
              q >= 1 ? api.good(t.okText || B('Eksiksiz!', 'Perfect!')) : q > 0.5 ? api.feedback(B('Eksik var', 'Something is missing'), '#ffb547') : api.bad(B('Olmadı', 'Not quite'));
              setTimeout(() => res(q * (0.85 + 0.15 * tl.left())), 1100);
            };
            stage.replaceChildren(h('div.col', { style: { gap: '8px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/4`), h('span.grow'), h('span.small.muted', {}, B(`${need.length} doğru var`, `${need.length} are right`))),
              h('div.qcard', { style: { fontSize: '17px' } }, task), h('div.grid-board', { style: { gridTemplateColumns: '1fr 1fr', gap: '6px' } }, bs), btn(B('Hazır ✔', 'Ready ✔'), done, 'primary block')));
            const tl = api.timerLoop(clamp(22 + api.ease * 6 - api.diff * 5, 14, 30), done);
          });
          pts += got * 25; api.setScore(Math.round(pts));
          await sleep(300);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 11) TAM TUTAR — seçtiklerinin toplamı hedefe tam eşit olsun (para üstü, tartı, tarif…).
export function sumGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Hedef: ${t.ask}`, `Target: ${EN(t.ask)}`), B('Seçtiklerinin toplamı hedefe TAM eşit olmalı.', 'The total of what you pick must match the target EXACTLY.'), B('Ne kadar az parça, o kadar iyi. 5 tur.', 'Fewer pieces is better. 5 rounds.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        const vals = t.values;
        for (let r = 0; r < 5; r++) {
          const target = t.gen ? t.gen(api.rng, r) : (() => { let s = 0; const k = api.rng.int(2, 4 + Math.round(api.diff * 2)); for (let i = 0; i < k; i++) s += api.rng.pick(vals.slice(0, -1)); return s; })();
          const got = await new Promise(res => {
            let sum = 0, parts = [], fin = false;
            const tot = h('div.center', { style: { fontSize: '28px', fontWeight: 900 } });
            const tray = h('div.row', { style: { flexWrap: 'wrap', gap: '4px', minHeight: '40px', justifyContent: 'center' } });
            const draw = () => { tot.textContent = `${num(sum)} / ${num(target)} ${T(t.unit || '')}`; tot.style.color = sum === target ? '#3ddc97' : sum > target ? '#ff5b7a' : ''; tray.replaceChildren(...parts.map(v => h('span.chip', {}, `${t.label ? t.label(v) : num(v)}`))); };
            const check = () => {
              if (sum !== target) return;
              fin = true; tl.stop();
              // En az parça ile ödeme (açgözlü yaklaşım bu değerlerde en iyisini verir)
              let rest = target, best = 0; for (const v of vals.slice().sort((a, b) => b - a)) { while (rest >= v) { rest -= v; best++; } }
              api.good(t.okText || B('Tam!', 'Exact!'));
              setTimeout(() => res(clamp(1 - Math.max(0, parts.length - best) * 0.12, 0.5, 1) * (0.8 + 0.2 * tl.left())), 500);
            };
            const bs = vals.map(v => h('button.btn', { style: { flex: '1 1 28%', minHeight: '54px', fontSize: '16px', fontWeight: 900 }, onclick: () => { if (fin) return; sum += v; parts.push(v); api.sfx.coin(); draw(); if (sum > target) api.bad(B('Fazla oldu', 'Too much')); check(); } }, t.label ? t.label(v) : num(v)));
            stage.replaceChildren(h('div.col', { style: { gap: '10px' } }, h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/5`), h('span.grow'), h('span', { style: { fontSize: '26px' } }, t.icon)),
              h('div.qcard', {}, t.ask), tot, tray, h('div.row', { style: { flexWrap: 'wrap', gap: '6px' } }, bs),
              btn(B('⌫ Son parçayı geri al', '⌫ Undo last'), () => { if (fin || !parts.length) return; sum -= parts.pop(); draw(); }, 'ghost block')));
            draw();
            const tl = api.timerLoop(clamp(20 + api.ease * 6 - api.diff * 5, 13, 28), () => { fin = true; api.bad(TT.timeUp); res(0); });
          });
          pts += got * 20; api.setScore(Math.round(pts));
          await sleep(350);
        }
        resolve(pct(pts));
      });
    },
  });
}
// i18n-skip-start
const TT = { timeUp: B('Süre bitti', 'Time is up') };
// i18n-skip-end

// 12) KURALA GÖRE PATLAT — yükselen balonlardan yalnızca kurala uyanları patlat.
export function popGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Aşağıdan balonlar yükselir.', 'Balloons float up from the bottom.'), B('Üstte yazan KURALA uyanları patlat, diğerlerine dokunma.', 'Pop only the ones that match the RULE at the top.'), B('Kural her 10 saniyede değişir. 30 saniye.', 'The rule changes every 10 seconds. 30 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const top = h('div.qcard', { style: { fontSize: '17px', minHeight: '54px', padding: '10px' } });
        const wrap = h('div', { style: { position: 'relative', flex: 1, minHeight: '360px', borderRadius: '16px', overflow: 'hidden', background: t.bg || '#16284a' } });
        stage.replaceChildren(h('div.col', { style: { flex: 1, display: 'flex', gap: '8px' } }, top, wrap));
        const rules = api.rng.shuffle(t.rules.slice());
        let ri = -1, rule, items = [], sp = 0, ok = 0, bad = 0, miss = 0, over = false, since = 99;
        const setRule = () => { ri++; rule = rules[ri % rules.length]; top.textContent = rule[0]; since = 0; api.feedback(B('Yeni kural!', 'New rule!'), '#ffd27a'); };
        const spawn = () => {
          const good = api.rng.chance(0.45);
          const e = api.rng.pick(good ? rule[1] : rule[2]);
          const el = h('div', { style: { position: 'absolute', left: api.rng.float(4, 80) + '%', bottom: '-60px', minWidth: '54px', height: '54px', padding: '0 6px', borderRadius: '27px', background: api.rng.pick(['#ff6b8b', '#6bb8ff', '#7ee081', '#ffd166', '#c38bff']), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#111', boxShadow: '0 4px 12px rgba(0,0,0,.3)', userSelect: 'none' } }, e);
          const it = { el, y: -0.1, v: (0.16 + api.diff * 0.12) * api.rng.float(0.8, 1.25), good, done: false };
          el.onpointerdown = ev => { ev.preventDefault(); if (it.done || over) return; it.done = true; el.style.transform = 'scale(1.4)'; el.style.opacity = '0'; el.style.transition = 'all .2s';
            if (it.good) { ok++; api.sfx.coin(); } else { bad++; api.bad(B('Kurala uymuyor!', "Doesn't match!")); } api.setScore(ok); setTimeout(() => el.remove(), 200); };
          wrap.append(el); items.push(it);
        };
        setRule();
        const end = () => { if (over) return; over = true; resolve(pct(ok / Math.max(1, ok + miss) * 100 - bad * 6)); };
        api.timerLoop(30, end);
        api.loop(dt => {
          if (over) return;
          since += dt; if (since >= 10) setRule();
          sp -= dt; if (sp <= 0) { sp = clamp(0.8 - api.diff * 0.3, 0.45, 0.9); spawn(); }
          for (const it of items) {
            if (it.done) continue;
            it.y += it.v * dt; it.el.style.bottom = `calc(${it.y * 100}% - 54px)`;
            if (it.y > 1.08) { it.done = true; if (it.good) miss++; it.el.remove(); }
          }
          items = items.filter(i => !i.done);
        });
      });
    },
  });
}

// 13) SİL, TEMİZLE — parmağınla sürterek kirli yüzeyi temizle.
export function cleanGame(t) {
  register({
    ...base(t),
    how: t.how || [B(`Parmağını sürterek ${t.dirtName || 'kiri'} temizle.`, `Rub with your finger to clean off the ${t.dirtNameEn || 'dirt'}.`), B('Altından ne çıkacak? Her yeri temizlemeye çalış.', 'What is underneath? Try to clean every spot.'), B('3 tur, her tur 8 saniye.', '3 rounds, 8 seconds each.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        for (let r = 0; r < 3; r++) {
          const under = api.rng.pick(t.reveal);
          const wrap = h('div', { style: { position: 'relative', height: '380px', borderRadius: '18px', overflow: 'hidden', background: t.under || '#e9f3ff', touchAction: 'none' } },
            h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '130px' } }, under));
          const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } });
          wrap.append(cv);
          stage.replaceChildren(h('div.col', { style: { gap: '6px' } }, h('div.center.small.muted', {}, `${r + 1}/3`), wrap));
          await sleep(30);
          const W = wrap.clientWidth, H = wrap.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
          cv.width = W * dpr; cv.height = H * dpr;
          const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = t.dirt || '#7a5a3a'; ctx.fillRect(0, 0, W, H);
          for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(0,0,0,${api.rng.float(0.05, 0.25)})`; ctx.beginPath(); ctx.arc(api.rng.float(0, W), api.rng.float(0, H), api.rng.float(8, 40), 0, 7); ctx.fill(); }
          if (t.spots) for (let i = 0; i < 14; i++) emo(ctx, api.rng.pick(t.spots), api.rng.float(20, W - 20), api.rng.float(20, H - 20), api.rng.int(22, 36));
          const G = 12, clean = new Set();
          const rad = clamp(26 + api.ease * 10 - api.diff * 8, 18, 36);
          let last = null, down = false;
          const rub = e => {
            if (!down) return;
            const rc = cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
            ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = rad * 2; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(last ? last.x : x, last ? last.y : y); ctx.lineTo(x, y); ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            const steps = last ? Math.ceil(Math.hypot(x - last.x, y - last.y) / 8) + 1 : 1;
            for (let s = 0; s < steps; s++) {
              const px = last ? last.x + (x - last.x) * s / steps : x, py = last ? last.y + (y - last.y) * s / steps : y;
              for (let gx = 0; gx < G; gx++) for (let gy = 0; gy < G; gy++) { const cx = (gx + 0.5) * W / G, cy = (gy + 0.5) * H / G; if (Math.hypot(cx - px, cy - py) < rad) clean.add(gx * G + gy); }
            }
            last = { x, y };
            api.setScore(`${Math.round(clean.size / (G * G) * 100)}%`);
          };
          cv.onpointerdown = e => { down = true; last = null; rub(e); };
          cv.onpointermove = rub;
          cv.onpointerup = cv.onpointerleave = () => { down = false; last = null; };
          const got = await new Promise(res => api.timerLoop(8, () => res(clean.size / (G * G))));
          cv.onpointerdown = cv.onpointermove = null;
          got > 0.9 ? api.good(t.okText || B('Pırıl pırıl!', 'Sparkling!')) : got > 0.6 ? api.feedback(B('İdare eder', 'Not bad'), '#ffb547') : api.bad(B('Hâlâ kirli', 'Still dirty'));
          pts += clamp((got - 0.2) / 0.75, 0, 1) * 33.4; api.setScore(Math.round(pts));
          await sleep(700);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 14) KES — havaya fırlayanları parmağınla kes, kötülere dokunma.
export function sliceGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Parmağını hızla kaydırarak havaya fırlayanları kes.', 'Swipe fast to slice what flies up.'), B(`Kesme: ${t.bad.join(' ')}`, `Don't slice: ${t.bad.join(' ')}`), B('Düşürdüklerin sayılmaz. 25 saniye.', 'The ones you let fall don\'t count. 25 seconds.')],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let items = [], sp = 0.3, cut = 0, bad = 0, drop = 0, over = false, trail = [];
        const move = e => {
          if (!(e.buttons || e.pointerType === 'touch')) return;
          const r = stage.getBoundingClientRect(); const p = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, t: performance.now() };
          const prev = trail[trail.length - 1]; trail.push(p);
          if (!prev) return;
          for (const it of items) {
            if (it.done) continue;
            // parça ile nokta arası uzaklık
            const dx = p.x - prev.x, dy = p.y - prev.y, L2 = dx * dx + dy * dy || 1e-6;
            const k = clamp(((it.x - prev.x) * dx + (it.y - prev.y) * dy) / L2, 0, 1);
            const d = Math.hypot((prev.x + k * dx - it.x) * r.width, (prev.y + k * dy - it.y) * r.height);
            if (d < 30) { it.done = true; it.cutAt = performance.now(); if (it.bad) { bad++; api.bad(t.hitText || B('Olmaz!', 'Oops!')); } else { cut++; api.sfx.tap(); } api.setScore(cut); }
          }
        };
        stage.addEventListener('pointermove', move); stage.addEventListener('pointerdown', move);
        const clr = () => (trail = []);
        stage.addEventListener('pointerup', clr);
        api.onCleanup(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', move); stage.removeEventListener('pointerup', clr); });
        const end = () => { if (over) return; over = true; resolve(pct(cut / Math.max(1, cut + drop) * 100 - bad * 8)); };
        api.timerLoop(25, end);
        api.loop(dt => {
          if (over) return;
          const W = stage.clientWidth, H = stage.clientHeight;
          sp -= dt;
          if (sp <= 0) {
            sp = clamp(0.9 - api.diff * 0.35, 0.45, 1) * api.rng.float(0.7, 1.3);
            const n = api.rng.chance(0.3) ? 2 : 1;
            for (let i = 0; i < n; i++) { const isBad = api.rng.chance(0.18 + api.diff * 0.1); const x = api.rng.float(0.15, 0.85); items.push({ x, y: 1.05, vx: (0.5 - x) * api.rng.float(0.2, 0.5), vy: -api.rng.float(1.05, 1.3), e: api.rng.pick(isBad ? t.bad : t.good), bad: isBad, rot: 0 }); }
          }
          for (const it of items) { it.vy += 1.2 * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.rot += dt * 3; if (!it.done && it.y > 1.08 && it.vy > 0) { it.done = true; it.fell = true; if (!it.bad) drop++; } }
          items = items.filter(it => !(it.done && (it.fell || performance.now() - it.cutAt > 350)));
          const now = performance.now(); trail = trail.filter(p => now - p.t < 120);
          ctx.fillStyle = t.bg || '#2a1d3a'; ctx.fillRect(0, 0, W, H);
          for (const it of items) {
            ctx.save(); ctx.translate(it.x * W, it.y * H); ctx.rotate(it.rot);
            if (it.done) { ctx.globalAlpha = 0.6; emo(ctx, it.bad ? '💥' : (t.cutE || '✨'), 0, 0, 36); }
            else emo(ctx, it.e, 0, 0, 40);
            ctx.restore();
          }
          if (trail.length > 1) { ctx.strokeStyle = t.blade || 'rgba(255,255,255,.85)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); trail.forEach((p, i) => (i ? ctx.lineTo(p.x * W, p.y * H) : ctx.moveTo(p.x * W, p.y * H))); ctx.stroke(); }
        });
      });
    },
  });
}

// 15) ÇİZ — kesikli yolu parmağınla izle.
const SHAPES = {
  daire: n => Array.from({ length: n }, (_, i) => { const a = i / (n - 1) * Math.PI * 2; return [0.5 + Math.cos(a) * 0.32, 0.5 + Math.sin(a) * 0.32]; }),
  kalp: n => Array.from({ length: n }, (_, i) => { const a = i / (n - 1) * Math.PI * 2; return [0.5 + 0.022 * 16 * Math.sin(a) ** 3, 0.47 - 0.022 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]; }),
  yildiz: () => { const p = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.14 : 0.36; p.push([0.5 + Math.cos(a) * r, 0.52 + Math.sin(a) * r]); } return p; },
  dalga: n => Array.from({ length: n }, (_, i) => [0.1 + i / (n - 1) * 0.8, 0.5 + Math.sin(i / (n - 1) * Math.PI * 3) * 0.18]),
  zikzak: () => [[0.1, 0.35], [0.26, 0.65], [0.42, 0.35], [0.58, 0.65], [0.74, 0.35], [0.9, 0.65]],
  sarmal: n => Array.from({ length: n }, (_, i) => { const a = i / (n - 1) * Math.PI * 4; const r = 0.04 + i / (n - 1) * 0.3; return [0.5 + Math.cos(a) * r, 0.5 + Math.sin(a) * r]; }),
  ev: () => [[0.2, 0.8], [0.2, 0.45], [0.5, 0.2], [0.8, 0.45], [0.8, 0.8], [0.2, 0.8]],
  kare: () => [[0.2, 0.25], [0.8, 0.25], [0.8, 0.75], [0.2, 0.75], [0.2, 0.25]],
  ucgen: () => [[0.5, 0.2], [0.85, 0.78], [0.15, 0.78], [0.5, 0.2]],
};
export function traceGame(t) {
  register({
    ...base(t),
    how: t.how || [B('Kesikli çizgiyi baştan (🟢) sona parmağınla izle.', 'Trace the dashed line from start (🟢) to end with your finger.'), B('Çizgiden sapma, ama yavaş da kalma.', "Stay on the line, but don't be too slow."), B('3 şekil.', '3 shapes.')],
    play(stage, api) {
      return new Promise(async resolve => {
        let pts = 0;
        const shapes = api.rng.shuffle((t.shapes || Object.keys(SHAPES)).slice());
        for (let r = 0; r < 3; r++) {
          const raw = SHAPES[shapes[r % shapes.length]](60);
          // yolu eşit aralıklı noktalara böl
          const path = [];
          for (let i = 0; i < raw.length - 1; i++) { const [a, b] = [raw[i], raw[i + 1]]; const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.01)); for (let k = 0; k < n; k++) path.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
          path.push(raw[raw.length - 1]);
          const wrap = h('div', { style: { position: 'relative', height: '360px', borderRadius: '18px', overflow: 'hidden', background: t.bg || '#fdf6e3', touchAction: 'none' } });
          const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } });
          wrap.append(cv);
          stage.replaceChildren(h('div.col', { style: { gap: '6px' } }, h('div.center.small.muted', {}, `${r + 1}/3`), wrap));
          await sleep(30);
          const W = wrap.clientWidth, H = wrap.clientHeight, S = Math.min(W, H), ox = (W - S) / 2, oy = (H - S) / 2, dpr = Math.min(2, devicePixelRatio || 1);
          cv.width = W * dpr; cv.height = H * dpr;
          const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const P = ([x, y]) => [ox + x * S, oy + y * S];
          const tol = clamp(22 + api.ease * 10 - api.diff * 8, 14, 32);
          const covered = new Set(); let off = 0, on = 0, down = false, prev = null;
          const drawBase = () => {
            ctx.fillStyle = t.bg || '#fdf6e3'; ctx.fillRect(0, 0, W, H);
            ctx.setLineDash([8, 10]); ctx.strokeStyle = t.guide || 'rgba(60,60,90,.45)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath(); path.forEach((p, i) => { const [x, y] = P(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
            emo(ctx, '🟢', ...P(path[0]), 18); emo(ctx, t.end || '🏁', ...P(path[path.length - 1]), 20);
          };
          drawBase();
          const pen = e => {
            if (!down) return;
            const rc = cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
            let best = 1e9;
            path.forEach((p, i) => { const [px, py] = P(p); const d = Math.hypot(px - x, py - y); if (d < best) best = d; if (d < tol) covered.add(i); });
            best < tol ? on++ : off++;
            ctx.strokeStyle = best < tol ? (t.ink || '#8f7bff') : '#ff5b7a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
            if (prev) { ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(x, y); ctx.stroke(); }
            prev = { x, y };
            api.setScore(`${Math.round(covered.size / path.length * 100)}%`);
          };
          cv.onpointerdown = e => { down = true; prev = null; pen(e); };
          cv.onpointermove = pen;
          const got = await new Promise(res => {
            const tl = api.timerLoop(clamp(9 + api.ease * 4 - api.diff * 2, 6, 13), () => fin());
            const fin = () => { cv.onpointerdown = cv.onpointermove = cv.onpointerup = null; tl.stop(); const cov = covered.size / path.length, acc = on / Math.max(1, on + off); res(clamp(cov * 0.7 + acc * 0.3, 0, 1)); };
            cv.onpointerup = () => { down = false; prev = null; if (covered.size / path.length > 0.93) fin(); };
          });
          got > 0.88 ? api.good(t.okText || B('Kusursuz çizgi!', 'Flawless line!')) : got > 0.6 ? api.feedback(B('Fena değil', 'Not bad'), '#ffb547') : api.bad(B('Çizgi kaydı', 'The line wobbled'));
          pts += got * 33.4; api.setScore(Math.round(pts));
          await sleep(600);
        }
        resolve(pct(pts));
      });
    },
  });
}
