// Tema ile çoğaltılan mini oyun motorları. Her motor, farklı temalarla ayrı mini oyunlar üretir.
import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, lerp, sleep } from '../core/util.js';
import { T } from '../core/i18n.js';

const pct = v => Math.round(clamp(v, 0, 100));

// 1) ZAMANLAMA ÇUBUĞU — ibre gidip gelir, hedef bölgede durdur.
export function timingGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || [`İbre çubukta gidip gelir. Yeşil bölgeye gelince dokun.`, `Tam ortası MÜKEMMEL sayılır.`, t.wind ? 'Rüzgâr bölgeyi kaydırır — dikkat!' : 'Her denemede bölge daralır.', `${t.tries || 6} deneme.`],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const tries = t.tries || 6;
        let total = 0;
        const hero = h('div', { style: { fontSize: '64px', textAlign: 'center', transition: 'transform .35s' } }, t.icon);
        const label = h('div.center.small.muted', {}, '');
        const zone = h('div', { style: { position: 'absolute', top: 0, bottom: 0, background: 'rgba(61,220,151,.45)', borderRadius: '8px' } });
        const core = h('div', { style: { position: 'absolute', top: 0, bottom: 0, background: 'rgba(61,220,151,.9)', borderRadius: '6px' } });
        const mark = h('div', { style: { position: 'absolute', top: '-6px', bottom: '-6px', width: '6px', background: '#fff', borderRadius: '3px', boxShadow: '0 0 10px #fff' } });
        const bar = h('div', { style: { position: 'relative', height: '34px', background: '#0a0d1c', borderRadius: '10px', border: '1px solid var(--line)', margin: '18px 0', overflow: 'visible' } }, zone, core, mark);
        const target = h('div', { style: { fontSize: '44px', textAlign: 'center', minHeight: '54px' } }, t.target || '🎯');
        stage.replaceChildren(h('div.col', { style: { gap: '6px', margin: 'auto 0' } }, target, hero, bar, label, h('div.center.small.muted', {}, 'Ekrana dokun')));
        for (let i = 0; i < tries; i++) {
          const w = clamp(0.3 - api.diff * 0.16 + api.ease * 0.1 - i * 0.012, 0.07, 0.36);
          let c = api.rng.float(w / 2 + 0.05, 1 - w / 2 - 0.05);
          const wind = t.wind ? api.rng.float(-1, 1) * (0.1 + api.diff * 0.25) : 0;
          label.textContent = `${t.verb || 'Deneme'} ${i + 1}/${tries}` + (wind ? ` · Rüzgâr ${wind > 0 ? '→' : '←'} ${Math.abs(Math.round(wind * 40))} km/s` : '');
          const speed = (0.7 + api.diff * 1.3 + i * 0.05) * (1 - api.ease * 0.35);
          let x = 0, dir = 1, stop = false;
          const tap = () => { stop = true; };
          stage.addEventListener('pointerdown', tap);
          await new Promise(res => {
            let last = performance.now();
            const f = now => {
              const dt = Math.min(0.05, (now - last) / 1000); last = now;
              x += dir * speed * dt * (t.accel ? 1 + x : 1); if (x > 1) { x = 1; dir = -1; } if (x < 0) { x = 0; dir = 1; }
              const cz = clamp(c + wind * Math.sin(now / 400) * 0.3, w / 2, 1 - w / 2);
              zone.style.left = (cz - w / 2) * 100 + '%'; zone.style.width = w * 100 + '%';
              core.style.left = (cz - w / 6) * 100 + '%'; core.style.width = w / 3 * 100 + '%';
              mark.style.left = `calc(${x * 100}% - 3px)`;
              if (stop) { c = cz; res(); } else requestAnimationFrame(f);
            };
            requestAnimationFrame(f);
          });
          stage.removeEventListener('pointerdown', tap);
          const d = Math.abs(x - c);
          const sc = d < w / 6 ? 1 : d < w / 2 ? 0.7 - (d - w / 6) / w : 0;
          total += sc;
          hero.style.transform = sc > 0 ? 'translateY(-40px) scale(1.1)' : 'translateX(20px) rotate(20deg)';
          sc >= 1 ? api.good(t.perfect || 'MÜKEMMEL!') : sc > 0 ? api.good(t.okText || 'İyi!') : api.bad(t.missText || 'Kaçtı!');
          api.setScore(`${Math.round(total / (i + 1) * 100)}%`);
          await sleep(650); hero.style.transform = '';
        }
        resolve(pct(total / tries * 105));
      });
    },
  });
}

// 2) YAKALAMA — sepeti kaydır, iyileri topla, kötülerden kaç.
export function catchGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || [`Parmağını sağa sola kaydırarak ${t.basket} yakala.`, `Topla: ${t.good.join(' ')}`, `Kaçın: ${t.bad.join(' ')}`, '25 saniye; düşürdüklerin puan kaybettirir.'],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let W = stage.clientWidth, H = stage.clientHeight, px = 0.5, got = 0, missed = 0, badHit = 0, spawn = 0;
        const items = [];
        const move = e => { const r = stage.getBoundingClientRect(); px = clamp((e.clientX - r.left) / r.width, 0.05, 0.95); };
        stage.addEventListener('pointermove', move); stage.addEventListener('pointerdown', move);
        api.onCleanup(() => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerdown', move); });
        let over = false;
        api.timerLoop(25, () => { over = true; resolve(pct(got / Math.max(1, got + missed) * 100 - badHit * 6)); });
        api.loop(dt => {
          if (over) return;
          W = stage.clientWidth; H = stage.clientHeight;
          spawn -= dt;
          if (spawn <= 0) {
            spawn = clamp(0.8 - api.diff * 0.35, 0.35, 0.9) * api.rng.float(0.7, 1.3);
            const bad = api.rng.chance(0.22 + api.diff * 0.15);
            items.push({ x: api.rng.float(0.06, 0.94), y: -0.05, e: api.rng.pick(bad ? t.bad : t.good), bad, v: (0.28 + api.diff * 0.3) * api.rng.float(0.8, 1.3), sway: t.sway ? api.rng.float(-0.15, 0.15) : 0 });
          }
          const bw = clamp(0.2 - api.diff * 0.07 + api.ease * 0.06, 0.1, 0.26);
          for (const it of items) {
            it.y += it.v * dt; it.x = clamp(it.x + it.sway * dt, 0.03, 0.97);
            if (!it.done && it.y > 0.86 && it.y < 0.93 && Math.abs(it.x - px) < bw / 2) {
              it.done = true;
              if (it.bad) { badHit++; api.bad('Ahh!'); } else { got++; api.sfx.coin(); }
              api.setScore(got);
            }
            if (!it.done && it.y > 1) { it.done = true; if (!it.bad) missed++; }
          }
          while (items.length && items[0].done && items[0].y > 0.9) items.shift();
          ctx.fillStyle = t.bg || '#16304a'; ctx.fillRect(0, 0, W, H);
          ctx.font = '30px sans-serif'; ctx.textAlign = 'center';
          for (const it of items) if (!it.done) ctx.fillText(it.e, it.x * W, it.y * H);
          ctx.font = '44px sans-serif'; ctx.fillText(t.basket, px * W, H * 0.93);
          ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect((px - bw / 2) * W, H * 0.95, bw * W, 4);
          ctx.textAlign = 'left';
        });
      });
    },
  });
}

// 3) AYIKLAMA — gelen öğeyi doğru kutuya gönder.
export function sortGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Ekrana gelen öğeyi doğru gruba gönder.', 'Hızlı ve doğru ol: yanlış 2 saniye götürür.', '30 saniye.'],
    play(stage, api) {
      return new Promise(resolve => {
        let ok = 0, bad = 0, cur, over = false, penalty = 0;
        const card = h('div.qcard', { style: { fontSize: '22px', minHeight: '110px', flexDirection: 'column' } });
        const bins = t.bins.map((b, i) => h('button.btn', { style: { flex: '1 1 40%', minHeight: '64px', fontSize: '14px' }, onclick: () => pick(i) }, b));
        stage.replaceChildren(h('div.col', { style: { gap: '14px' } }, card, h('div.row', { style: { flexWrap: 'wrap', gap: '8px' } }, bins)));
        const pool = api.fresh(t.items);
        let k = 0;
        const next = () => { if (k >= pool.length) k = 0; cur = pool[k++]; api.mark(cur); card.textContent = cur[0]; };
        const pick = i => {
          if (over) return;
          if (i === cur[1]) { ok++; api.sfx.good(); } else { bad++; penalty += 2; api.bad(`→ ${t.bins[cur[1]]}`); }
          api.setScore(ok); next();
        };
        next();
        const total = (30 + api.ease * 5 - api.diff * 5) * api.timeMul;
        const t0 = performance.now();
        api.loop(() => {
          const f = 1 - ((performance.now() - t0) / 1000 + penalty) / total;
          api.setTimer(f);
          if (f <= 0 && !over) { over = true; resolve(pct(ok / (t.target || 14) * 100 - bad * 3)); }
        });
      });
    },
  });
}

// 4) EŞLEŞTİRME — sol ile sağı eşle.
export function pairGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Soldan bir öğe, sağdan eşini seç.', 'Yanlış eşleştirme süre kaybettirir.', '3 tur.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const queue = api.fresh(t.pairs, undefined, 18);
        // Bir turda aynı sol ya da sağ metin iki kez çıkmasın (çeviride aynı görünenler dahil)
        const take = (src, n, out = [], used = new Set(out.flatMap(p => [T(p[0]), T(p[1])]))) => {
          for (let k = 0; k < src.length && out.length < n; k++) { const p = src[k], a = T(p[0]), b = T(p[1]); if (used.has(a) || used.has(b)) continue; used.add(a); used.add(b); out.push(p); src.splice(k--, 1); }
          return out;
        };
        for (let r = 0; r < 3; r++) {
          let n = clamp(4 + Math.round(api.diff * 2), 4, 6);
          const set = take(queue, n);
          if (set.length < n) take(api.rng.shuffle(t.pairs.slice()), n, set);
          n = set.length;
          const got = await new Promise(res => {
            let sel = null, done = 0, wrong = 0, fin = false;
            const L = set.map((p, i) => h('button.qopt', { style: { padding: '10px', fontSize: '13.5px' }, onclick: () => { if (fin || L[i].disabled) return; sel = i; L.forEach((e, j) => e.classList.toggle('glow', j === i)); } }, p[0]));
            const order = api.rng.shuffle(set.map((_, i) => i));
            const R = order.map(i => h('button.qopt', { style: { padding: '10px', fontSize: '13.5px' }, onclick: e => {
              if (fin || sel === null || e.currentTarget.disabled) return;
              if (i === sel) { L[i].classList.add('ok'); e.currentTarget.classList.add('ok'); L[i].disabled = e.currentTarget.disabled = true; done++; api.sfx.good(); sel = null; L.forEach(x => x.classList.remove('glow')); if (done === n) { fin = true; tl.stop(); res(n - wrong * 0.5); } }
              else { wrong++; api.bad('Eşleşmedi'); }
            } }, set[i][1]));
            // Sütun başlıkları: neyin neyle eşleştiği bir bakışta anlaşılsın (t.cols ya da "X → Y" ipucundan)
            const hd = String(T(t.hint || '')).split('→');
            const cols = t.cols ? t.cols.map(c => T(c)) : hd.length === 2 ? hd.map(x => x.trim()) : null;
            const colHead = c => h('div', { style: { textAlign: 'center', fontSize: '12px', fontWeight: 900, letterSpacing: '.5px', textTransform: 'uppercase', color: '#ffd27a', padding: '4px 0', borderBottom: '2px solid rgba(255,210,122,.35)', marginBottom: '2px' } }, c);
            stage.replaceChildren(h('div.col', {}, h('div.row', {}, h('span.chip.accent', {}, `Tur ${r + 1}/3`), h('span.grow'), cols ? null : h('span.small.muted', {}, t.hint || '')),
              h('div.row', { style: { alignItems: 'flex-start', gap: '8px' } },
                h('div.col.grow', { style: { gap: '6px', flex: '1 1 0' } }, cols ? colHead(cols[0]) : null, L),
                cols ? h('div', { style: { alignSelf: 'center', fontSize: '20px', opacity: .5 } }, '↔') : null,
                h('div.col.grow', { style: { gap: '6px', flex: '1 1 0' } }, cols ? colHead(cols[1]) : null, R))));
            const tl = api.timerLoop(18 + n * 3 + api.ease * 6 - api.diff * 5, () => { fin = true; res(done - wrong * 0.5); });
          });
          pts += clamp(got / n, 0, 1) * 33.4; api.setScore(Math.round(pts));
          await sleep(500);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 5) FARKLIYI BUL — benzerlerin arasındaki tek farklıya dokun.
export function oddGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Izgarada biri diğerlerinden farklı.', 'Farklı olana hızlıca dokun.', 'Her turda ızgara büyür. 8 tur.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        const oddOrder = api.fresh(t.pairs, p => p.join('|'), 8);
        for (let r = 0; r < 8; r++) {
          const [a, b] = oddOrder[r % oddOrder.length];
          const n = clamp(3 + Math.floor(r / 2) + Math.round(api.diff), 3, 7);
          const odd = api.rng.int(0, n * n - 1);
          const r2 = await new Promise(res => {
            let fin = false;
            const cells = Array.from({ length: n * n }, (_, i) => h('button.cell', { style: { fontSize: Math.max(16, 34 - n * 3) + 'px', padding: 0 }, onclick: () => { if (fin) return; fin = true; tl.stop(); if (i === odd) { api.sfx.good(); res(0.5 + 0.5 * tl.left()); } else { cells[odd].style.background = '#3ddc9755'; api.bad('Burada!'); res(0); } } }, i === odd ? b : a));
            stage.replaceChildren(h('div.col', {}, h('div.center.small.muted', {}, `${t.ask || 'Farklı olanı bul'} · ${r + 1}/8`), h('div.grid-board', { style: { gridTemplateColumns: `repeat(${n},1fr)`, gap: '4px', maxWidth: '380px' } }, cells)));
            const tl = api.timerLoop(clamp(7 - api.diff * 2.5 + api.ease * 2 + n * 0.3, 2.5, 10), () => { if (!fin) { fin = true; cells[odd].style.background = '#ffb54755'; res(0); } });
          });
          pts += r2 * 12.5; api.setScore(Math.round(pts));
          await sleep(450);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 6) SAYMA — kısa süre görünen öğeleri say.
export function countGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || [`Ekranda kısa süre ${t.target} ve başka şeyler belirir.`, `Kaç tane ${t.target} vardı? Doğru sayıyı seç.`, '6 tur.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        for (let r = 0; r < 6; r++) {
          const n = api.rng.int(3 + r, 7 + r * 2 + Math.round(api.diff * 4));
          const noise = api.rng.int(2, 5 + Math.round(api.diff * 6));
          const field = h('div', { style: { position: 'relative', height: '300px', background: t.bg || '#132045', borderRadius: '16px', overflow: 'hidden' } });
          const put = e => { field.append(h('span', { style: { position: 'absolute', left: api.rng.float(2, 88) + '%', top: api.rng.float(2, 86) + '%', fontSize: '26px' } }, e)); };
          for (let i = 0; i < n; i++) put(t.target);
          for (let i = 0; i < noise; i++) put(api.rng.pick(t.noise));
          stage.replaceChildren(h('div.col', {}, h('div.center.small.muted', {}, `Tur ${r + 1}/6 — ${t.target} say!`), field));
          await sleep(clamp(1500 + api.ease * 1200 - api.diff * 600 + n * 60, 900, 3200) * api.timeMul);
          const opts = new Set([n]); while (opts.size < 4) opts.add(clamp(n + api.rng.pick([-3, -2, -1, 1, 2, 3]), 1, 60));
          const ok = await new Promise(res => stage.replaceChildren(h('div.col', {}, h('div.qcard', {}, `Kaç tane ${t.target} vardı?`),
            h('div.grid-board', { style: { gridTemplateColumns: '1fr 1fr', marginTop: '10px' } }, api.rng.shuffle([...opts]).map(v => h('button.cell', { style: { aspectRatio: 'auto', padding: '16px 0' }, onclick: () => res(v === n) }, v))))));
          ok ? (pts += 16.7, api.good('Doğru!')) : api.bad(`${n} taneydi`);
          api.setScore(Math.round(pts)); await sleep(500);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 7) İSTİFLEME — kayan bloğu tam üstüne bırak.
export function stackGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Blok sağa sola kayar; alttakinin üstüne gelince dokun.', 'Taşan kısım kesilir, blok küçülür.', '10 kat çık.'],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        api.hideTimer();
        let W, H, stack = [{ x: 0.3, w: 0.4 }], cur = { x: 0, w: 0.4, dir: 1 }, done = false, perfect = 0;
        const speed = (0.45 + api.diff * 0.6) * (1 - api.ease * 0.3);
        const tap = () => {
          if (done) return;
          const top = stack[stack.length - 1];
          const l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w);
          if (r - l <= 0.01) { done = true; api.bad('Devrildi!'); return fin(); }
          if (Math.abs(cur.x - top.x) < 0.012) { perfect++; api.good('Tam oturdu!'); stack.push({ x: top.x, w: top.w }); }
          else { stack.push({ x: l, w: r - l }); api.sfx.tap(); }
          api.setScore(`${stack.length - 1}/10`);
          if (stack.length > 10) { done = true; return fin(); }
          cur = { x: api.rng.chance(0.5) ? 0 : 1 - stack[stack.length - 1].w, w: stack[stack.length - 1].w, dir: api.rng.chance(0.5) ? 1 : -1 };
        };
        const fin = () => setTimeout(() => resolve(pct((stack.length - 1) * 7 + stack[stack.length - 1].w / 0.4 * 20 + perfect * 2)), 600);
        stage.addEventListener('pointerdown', tap);
        api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
        api.loop(dt => {
          W = stage.clientWidth; H = stage.clientHeight;
          if (!done) { cur.x += cur.dir * speed * dt; if (cur.x + cur.w > 1) { cur.x = 1 - cur.w; cur.dir = -1; } if (cur.x < 0) { cur.x = 0; cur.dir = 1; } }
          ctx.fillStyle = t.bg || '#1a2140'; ctx.fillRect(0, 0, W, H);
          const bh = Math.min(34, H / 14), base = H - 20, off = Math.max(0, stack.length - 9) * bh;
          stack.forEach((b, i) => { ctx.fillStyle = i ? t.colors[i % t.colors.length] : '#555'; ctx.fillRect(b.x * W, base - (i + 1) * bh + off, b.w * W, bh - 2); if (i && t.label) { ctx.font = `${bh * 0.6}px sans-serif`; ctx.fillText(t.label, b.x * W + 4, base - i * bh + off - bh * 0.25); } });
          if (!done) { ctx.fillStyle = t.colors[stack.length % t.colors.length]; ctx.fillRect(cur.x * W, base - (stack.length + 1) * bh + off, cur.w * W, bh - 2); }
          ctx.font = '26px sans-serif'; ctx.fillText(t.icon, 8, 34);
        });
      });
    },
  });
}

// 8) PARKUR — şerit değiştir, engelden kaç, ödülleri topla.
export function runGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Ekranın sol/sağ yarısına dokunarak şerit değiştir.', `Engellerden kaç: ${t.obstacles.join(' ')}`, `Topla: ${t.bonus}`, '3 can, 30 saniye.'],
    play(stage, api) {
      return new Promise(resolve => {
        const { ctx } = api.canvas();
        let W, H, lane = 1, px = 0.5, lives = 3, obs = [], sp = 0.6, dist = 0, bonus = 0, over = false;
        const laneX = l => 0.2 + l * 0.3;
        const tap = e => { const r = stage.getBoundingClientRect(); lane = clamp(lane + ((e.clientX - r.left) < r.width / 2 ? -1 : 1), 0, 2); api.sfx.whoosh(); };
        stage.addEventListener('pointerdown', tap);
        api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
        const end = () => { if (over) return; over = true; tm.stop(); resolve(pct(dist * 2.2 + bonus * 3 - (3 - lives) * 10)); };
        const tm = api.timerLoop(30, end);
        api.setScore('❤️❤️❤️');
        api.loop(dt => {
          if (over) return;
          W = stage.clientWidth; H = stage.clientHeight;
          const v = (0.45 + api.diff * 0.45) * (1 + tm.elapsed() / 45);
          dist += dt * v * 3; sp -= dt;
          if (sp <= 0) { sp = clamp(0.95 - api.diff * 0.4 + api.ease * 0.15, 0.4, 1.1) * api.rng.float(0.7, 1.2); const isB = api.rng.chance(0.3); obs.push({ l: api.rng.int(0, 2), y: -0.05, b: isB, e: isB ? t.bonus : api.rng.pick(t.obstacles) }); }
          px = lerp(px, laneX(lane), dt * 14);
          for (const o of obs) {
            o.y += v * dt;
            if (!o.done && Math.abs(o.y - 0.82) < 0.04 && Math.abs(laneX(o.l) - px) < 0.12) {
              o.done = true;
              if (o.b) { bonus++; api.sfx.coin(); } else { lives--; api.bad('Çarptın!'); api.setScore('❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(3 - Math.max(0, lives))); if (lives <= 0) end(); }
            }
          }
          obs = obs.filter(o => o.y < 1.1);
          ctx.fillStyle = t.bg || '#3c4a5c'; ctx.fillRect(0, 0, W, H);
          ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([16, 18]); ctx.lineWidth = 3;
          for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(W * (0.05 + i * 0.3), -(dist * 40 % 34)); ctx.lineTo(W * (0.05 + i * 0.3), H); ctx.stroke(); }
          ctx.setLineDash([]); ctx.font = '32px sans-serif'; ctx.textAlign = 'center';
          for (const o of obs) if (!o.done) ctx.fillText(o.e, laneX(o.l) * W, o.y * H);
          ctx.font = '40px sans-serif'; ctx.fillText(t.player, px * W, H * 0.86); ctx.textAlign = 'left';
        });
      });
    },
  });
}

// 9) HEDEF VURMA — deliklerden çıkanlara dokun.
export function whackGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || [`${t.good} çıkınca hemen dokun.`, `${t.bad} çıkarsa dokunma!`, '25 saniye.'],
    play(stage, api) {
      return new Promise(resolve => {
        let hit = 0, miss = 0, wrong = 0, over = false;
        const holes = Array.from({ length: 9 }, () => ({ el: h('button.cell', { style: { fontSize: '34px', background: t.holeBg || '#3b2a1c' } }, t.hole || ''), on: null }));
        stage.replaceChildren(h('div.grid-board', { style: { gridTemplateColumns: 'repeat(3,1fr)', maxWidth: '360px', margin: 'auto' } }, holes.map(x => x.el)));
        holes.forEach(hl => hl.el.onpointerdown = () => {
          if (!hl.on || over) return;
          if (hl.on === 'bad') { wrong++; api.bad('Olmaz!'); } else { hit++; api.sfx.tap(); }
          hl.on = null; hl.el.textContent = t.hole || ''; api.setScore(hit);
        });
        const pop = () => {
          if (over) return;
          const free = holes.filter(x => !x.on); if (free.length) {
            const hl = api.rng.pick(free); const bad = api.rng.chance(0.22 + api.diff * 0.12);
            hl.on = bad ? 'bad' : 'good'; hl.el.textContent = bad ? t.bad : t.good;
            setTimeout(() => { if (hl.on) { if (hl.on === 'good') miss++; hl.on = null; hl.el.textContent = t.hole || ''; } }, clamp(1100 - api.diff * 450 + api.ease * 300, 420, 1400) * api.timeMul);
          }
          setTimeout(pop, clamp(700 - hit * 6 - api.diff * 150, 300, 800));
        };
        api.timerLoop(25, () => { over = true; resolve(pct(hit / Math.max(1, hit + miss) * 92 + Math.min(8, hit / 4) - wrong * 6)); });
        setTimeout(pop, 200);
      });
    },
  });
}

// 10) HASSAS AYAR — göstergeyi hedef değere getir.
export function dialGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || [`Hedef ${t.unit} değerini kaydırıcıyla tam olarak ayarla.`, 'Zor seviyede ölçek çizgileri azalır, ibre titrer.', '"Onayla"ya bas. 6 tur, hız ve doğruluk.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        let pts = 0;
        for (let r = 0; r < 6; r++) {
          const target = +(t.gen ? t.gen(api.rng) : api.rng.float(t.min + (t.max - t.min) * 0.1, t.max - (t.max - t.min) * 0.1)).toFixed(t.dec ?? 0);
          const tol = (t.max - t.min) * clamp(0.04 - api.diff * 0.02 + api.ease * 0.02, 0.012, 0.06);
          const val = h('div.center', { style: { fontSize: '30px', fontWeight: 900 } });
          const slider = h('input.slider', { type: 'range', min: t.min, max: t.max, step: (t.max - t.min) / 1000, value: t.min });
          const ticks = Math.round(10 - api.diff * 6);
          const scale = h('div.row', { style: { justifyContent: 'space-between' } }, Array.from({ length: ticks + 1 }, (_, i) => h('span.tiny.muted', {}, (t.min + (t.max - t.min) * i / ticks).toFixed(t.dec ?? 0))));
          const showVal = api.diff < 0.55;
          const upd = () => { val.textContent = showVal ? `${(+slider.value).toFixed(t.dec ?? 0)} ${t.unit}` : '🔒 ölçeğe bak'; };
          slider.addEventListener('input', upd); upd();
          const t0 = performance.now();
          const v = await new Promise(res => stage.replaceChildren(h('div.col', { style: { gap: '12px' } },
            h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/6`), h('span.grow'), h('span', { style: { fontSize: '28px' } }, t.icon)),
            h('div.qcard', { style: { fontSize: '17px' } }, `${t.ask}: ${target} ${t.unit}`), val, slider, scale,
            btn('Onayla ✔', () => res(+slider.value), 'primary block'))));
          const err = Math.abs(v - target);
          const sp = clamp(1 - (performance.now() - t0) / 1000 / (12 * api.timeMul), 0, 1);
          const sc = err <= tol ? 0.75 + 0.25 * sp : err <= tol * 3 ? 0.4 : 0;
          sc >= 0.75 ? api.good('Tam isabet') : sc ? api.feedback('Yakın', '#ffb547') : api.bad(`${v.toFixed(t.dec ?? 0)} ${t.unit}`);
          pts += sc * 16.7; api.setScore(Math.round(pts)); await sleep(500);
        }
        resolve(pct(pts));
      });
    },
  });
}

// 11) HIZLI SORU MOTORU — üretilen sorulara hızla cevap ver.
export function quickGame(t) {
  register({
    spec: t, id: t.id, name: t.name, icon: t.icon, tags: t.tags, at: t.at, ages: t.ages,
    how: t.how || ['Soruları olabildiğince hızlı ve doğru çöz.', 'Yanlış cevap 3 saniye götürür.', '40 saniye.'],
    play(stage, api) {
      return new Promise(resolve => {
        let ok = 0, bad = 0, pen = 0, cur, over = false;
        const q = h('div.qcard', { style: { fontSize: '19px', minHeight: '110px' } });
        const opts = h('div.qopts');
        stage.replaceChildren(h('div.col', {}, q, opts));
        const next = () => {
          // Aynı soru tekrar gelmesin: görülmüşse yeniden üret
          let tries = 0;
          do cur = t.gen(api.rng, api.diff + Math.min(0.4, ok * 0.03)); while (api.isSeen(cur.q + '|' + cur.a) && ++tries < 15);
          api.mark(cur.q + '|' + cur.a);
          q.textContent = cur.q;
          const all = api.rng.shuffle([cur.a, ...cur.w.slice(0, 3)]);
          opts.replaceChildren(...all.map(o => h('button.qopt', { onclick: () => { if (over) return; if (o === cur.a) { ok++; api.sfx.good(); } else { bad++; pen += 3; api.bad('−3 sn'); } api.setScore(ok); next(); } }, String(o))));
        };
        next();
        const total = 40 * api.timeMul, t0 = performance.now();
        api.loop(() => { const f = 1 - ((performance.now() - t0) / 1000 + pen) / total; api.setTimer(f); if (f <= 0 && !over) { over = true; resolve(pct(ok / (t.target || 10) * 100 - bad * 3)); } });
      });
    },
  });
}
