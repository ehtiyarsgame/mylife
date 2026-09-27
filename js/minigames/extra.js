import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, lerp, sleep } from '../core/util.js';

// ————————————————— PAS —————————————————
// Rakip oyuncular pas yollarını kesiyor. Yolu açık olan takım arkadaşına zamanında pas ver.
register({
  id: 'pas', name: 'Pas Oyunu', icon: '🎯',
  how: ['Topla sen alttasın; takım arkadaşların yukarıda.', 'Rakipler pas yollarını kesmek için sağa sola kayıyor.', 'Yolu AÇIK olan arkadaşına dokun (yeşil çizgi).', '8 pas; kesilen pas can götürür.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W = stage.clientWidth, H = stage.clientHeight;
      const mates = [0.18, 0.5, 0.82].map(x => ({ x, y: 0.2 }));
      const defs = Array.from({ length: 2 + Math.round(api.diff * 2) }, (_, i) => ({ x: api.rng.next(), y: 0.38 + i * 0.12, v: (0.25 + api.diff * 0.55) * (api.rng.chance(0.5) ? 1 : -1) }));
      let ok = 0, lost = 0, passes = 0, flash = null, over = false;
      const laneOpen = m => {
        const bx = 0.5, by = 0.85;
        return defs.every(d => { const t = (d.y - by) / (m.y - by); const lx = bx + (m.x - bx) * t; return Math.abs(lx - d.x) * W > 26 + api.diff * 14 - api.ease * 10; });
      };
      const tap = e => {
        if (over) return;
        const r = stage.getBoundingClientRect(); const x = (e.clientX - r.left) / W, y = (e.clientY - r.top) / H;
        const m = mates.find(m => Math.hypot((m.x - x) * W, (m.y - y) * H) < 40);
        if (!m) return;
        passes++;
        if (laneOpen(m)) { ok++; api.good('Pas!'); flash = { m, c: '#3ddc97', t: 0.4 }; }
        else { lost++; api.bad('Kesildi!'); flash = { m, c: '#ff5b7a', t: 0.4 }; }
        api.setScore(`${ok}/${passes}`);
        if (passes >= 8 || lost >= 3) finish();
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      const finish = () => { if (over) return; over = true; tm.stop(); resolve(clamp(ok / 8 * 100 - lost * 4, 0, 100)); };
      const tm = api.timerLoop(28, finish);
      api.setScore('0/0');
      api.loop((dt, now) => {
        W = stage.clientWidth; H = stage.clientHeight;
        for (const d of defs) { d.x += d.v * dt * (api.mods.has('yagmur') ? 0.8 : 1); if (d.x < 0.05 || d.x > 0.95) d.v *= -1; }
        for (const m of mates) m.x += Math.sin(now / 700 + m.y * 9 + mates.indexOf(m)) * dt * 0.05;
        ctx.fillStyle = '#2d8a4c'; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.04)' : 'transparent'; ctx.fillRect(0, i * H / 6, W, H / 6); }
        for (const m of mates) {
          const open = laneOpen(m);
          ctx.strokeStyle = open ? 'rgba(61,220,151,.8)' : 'rgba(255,91,122,.35)'; ctx.lineWidth = open ? 3 : 2; ctx.setLineDash(open ? [] : [6, 6]);
          ctx.beginPath(); ctx.moveTo(W / 2, H * 0.85); ctx.lineTo(m.x * W, m.y * H); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = flash?.m === m ? flash.c : '#4ea1ff'; ctx.beginPath(); ctx.arc(m.x * W, m.y * H, 18, 0, 7); ctx.fill();
        }
        for (const d of defs) { ctx.fillStyle = '#e84a5f'; ctx.beginPath(); ctx.arc(d.x * W, d.y * H, 16, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#4ea1ff'; ctx.beginPath(); ctx.arc(W / 2, H * 0.85, 18, 0, 7); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(W / 2, H * 0.85 - 26, 8, 0, 7); ctx.fill();
        if (flash) { flash.t -= dt; if (flash.t <= 0) flash = null; }
      });
    });
  },
});

// ————————————————— KALECİ —————————————————
const ZONES = [['↖', 0, 0], ['⬆', 1, 0], ['↗', 2, 0], ['↙', 0, 1], ['⬇', 1, 1], ['↘', 2, 1]];
register({
  id: 'kaleci', name: 'Kaleci', icon: '🧤',
  how: ['Rakip oyuncu şut için koşuyor.', 'Koşu açısını ve vücut yönünü izle: ipucu kısa süre görünür.', '"ŞUT!" anında topun gideceği bölgeye dokun.', 'Tecrüben arttıkça ipuçları daha güvenilir, tepki süren daha uzun.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      let saves = 0;
      const N = 6;
      for (let i = 0; i < N; i++) {
        const target = api.rng.int(0, 5);
        const reliable = api.rng.chance(0.55 + api.ease * 0.35 - api.diff * 0.1);
        const cueZone = reliable ? target : api.rng.int(0, 5);
        const cueCol = ['sola', 'ortaya', 'sağa'][ZONES[cueZone][1]];
        const cueRow = ZONES[cueZone][2] ? 'alçak' : 'yüksek';
        const info = h('div.qcard', { style: { fontSize: '17px', minHeight: '70px' } }, '🏃 Rakip koşuyor…');
        const cells = ZONES.map((z, k) => h('button.cell', { style: { fontSize: '26px', aspectRatio: '1.6', background: '#1d2a55' }, onclick: () => pick(k) }, z[0]));
        const goal = h('div.grid-board', { style: { gridTemplateColumns: 'repeat(3,1fr)', border: '4px solid #fff', borderRadius: '8px', padding: '6px', background: 'repeating-linear-gradient(90deg,#1a2350,#1a2350 10px,#1f2a5c 10px,#1f2a5c 20px)' } }, cells);
        stage.replaceChildren(h('div.col', { style: { gap: '14px' } }, h('div.row', {}, h('span.chip.accent', {}, `Şut ${i + 1}/${N}`), h('span.grow'), h('b', {}, `🧤 ${saves}`)), info, goal));
        let picked = null, open = false;
        const pick = k => { if (!open || picked !== null) return; picked = k; };
        await sleep(600 + api.rng.int(0, 500));
        info.textContent = `👀 Vücudu ${cueCol}, ${cueRow} bir vuruşa dönük…`;
        await sleep(clamp(900 - api.diff * 500 + api.ease * 400, 350, 1300) * api.timeMul);
        info.textContent = '⚡ ŞUT!';
        open = true;
        const t0 = performance.now();
        const window = clamp(900 - api.diff * 450 + api.ease * 350, 380, 1200) * api.timeMul;
        await new Promise(r => { const f = () => { if (picked !== null || performance.now() - t0 > window) r(); else requestAnimationFrame(f); }; f(); });
        open = false;
        const [_, tx, ty] = ZONES[target];
        cells[target].style.background = '#ffb547';
        if (picked === target) { saves++; api.good('KURTARDIN!'); }
        else if (picked !== null && ZONES[picked][1] === tx && Math.random() < 0.35 + api.ease * 0.3) { saves += 0.5; api.good('Parmak ucuyla!'); }
        else { api.bad(picked === null ? 'Geç kaldın' : 'GOL'); if (picked !== null) cells[picked].style.background = '#ff5b7a55'; }
        api.setScore(`${saves}/${i + 1}`);
        await sleep(900);
      }
      resolve(clamp(saves / N * 100 * 1.15, 0, 100));
    });
  },
});

// ————————————————— FRİKİK —————————————————
register({
  id: 'frikik', name: 'Frikik', icon: '🌀',
  how: ['1) Yön çubuğu kayar: kaleye göre açını dokunarak kilitle.', '2) Falso çubuğu kayar: topun ne kadar döneceğini kilitle.', 'Top barajın üstünden/yanından dönüp köşeye inmeli.', '4 atış.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W, H, phase = 'aim', t = 0, aim = 0, curve = 0, shots = 0, goals = 0, ball = null, msg = null;
      const spd = (1.2 + api.diff * 1.8) * (1 - api.ease * 0.4);
      const tap = () => {
        if (phase === 'aim') { phase = 'curve'; api.sfx.tick(); }
        else if (phase === 'curve') { phase = 'fly'; api.sfx.kick(); ball = { p: 0 }; }
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      api.hideTimer();
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight; t += dt;
        const gx0 = W * 0.2, gx1 = W * 0.8, gy = H * 0.14, wallY = H * 0.46, wallX0 = W * (0.4 - api.diff * 0.06), wallX1 = W * (0.6 + api.diff * 0.06);
        if (phase === 'aim') aim = Math.sin(t * spd * 1.6);
        if (phase === 'curve') curve = Math.sin(t * spd * 2.1);
        let bx = W / 2, by = H * 0.85, tx = W / 2 + aim * W * 0.42;
        const path = p => { const x0 = W / 2, y0 = H * 0.85; const x = lerp(x0, tx, p) + curve * Math.sin(p * Math.PI) * W * 0.28 * -Math.sign(aim || 1); const y = lerp(y0, gy + 10, p); return [x, y]; };
        if (phase === 'fly' && ball) {
          ball.p = Math.min(1, ball.p + dt * 1.4);
          [bx, by] = path(ball.p);
          if (ball.p >= 1) {
            shots++;
            const [wx] = path((H * 0.85 - wallY) / (H * 0.85 - gy - 10));
            const hitWall = wx > wallX0 && wx < wallX1 && Math.abs(curve) < 0.35;
            const inGoal = bx > gx0 && bx < gx1;
            const corner = Math.abs(bx - W / 2) > (gx1 - gx0) * (0.28 + api.diff * 0.08);
            if (hitWall) { msg = ['BARAJ!', '#ffb547']; api.bad('Baraja çarptı'); }
            else if (!inGoal) { msg = ['AUT', '#ffb547']; api.bad('Aut'); }
            else if (!corner && api.rng.chance(0.75)) { msg = ['KALECİ!', '#ff5b7a']; api.bad('Kaleci aldı'); }
            else { goals++; msg = ['GOL!', '#3ddc97']; api.good('GOL!'); }
            api.setScore(`${goals}/${shots}`);
            phase = 'wait';
            setTimeout(() => { if (shots >= 4) resolve(clamp(goals * 25 + (goals ? 5 : 0), 0, 100)); else { phase = 'aim'; ball = null; msg = null; t = api.rng.float(0, 5); } }, 1000);
          }
        }
        ctx.fillStyle = '#2f8a4f'; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(gx0, gy - 40, gx1 - gx0, 40);
        ctx.fillStyle = '#ffcf4d'; ctx.fillRect(W / 2 - 12, gy - 34, 24, 34);
        for (let x = wallX0; x < wallX1; x += 22) { ctx.fillStyle = '#e84a5f'; ctx.fillRect(x, wallY - 26, 18, 30); ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(x + 9, wallY - 32, 8, 0, 7); ctx.fill(); }
        if (phase === 'aim' || phase === 'curve') {
          ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath();
          for (let p = 0; p <= 1; p += 0.05) { const [x, y] = path(p); p ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(20, H - 40, W - 40, 14);
          ctx.fillStyle = phase === 'aim' ? '#ffcf4d' : '#b36bff';
          const v = phase === 'aim' ? aim : curve; ctx.fillRect(W / 2 + v * (W / 2 - 30) - 5, H - 44, 10, 22);
          ctx.fillStyle = '#fff'; ctx.font = '800 13px Nunito'; ctx.textAlign = 'center'; ctx.fillText(phase === 'aim' ? 'YÖN — dokun' : 'FALSO — dokun', W / 2, H - 50); ctx.textAlign = 'left';
        }
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.fill();
        if (msg) { ctx.fillStyle = msg[1]; ctx.font = '900 38px Nunito'; ctx.textAlign = 'center'; ctx.fillText(msg[0], W / 2, H * 0.62); ctx.textAlign = 'left'; }
      });
    });
  },
});

// ————————————————— KAFA VURUŞU —————————————————
register({
  id: 'kafa', name: 'Kafa Vuruşu', icon: '🤾',
  how: ['Kanattan ortalar geliyor; top havada süzülüyor.', 'Top başının üstündeki yeşil halkaya girdiği an dokun.', 'Tam zamanlama GOL, yakın zamanlama direk ya da kaleci.', '6 orta.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      let W, H, n = 0, goals = 0, pts = 0, ball = null, msg = null, wait = 0.6;
      const win = clamp(0.1 + api.ease * 0.08 - api.diff * 0.04, 0.05, 0.2);
      const next = () => { ball = { p: 0, side: api.rng.chance(0.5) ? -1 : 1, sp: 0.55 + api.diff * 0.5 + api.rng.float(-0.1, 0.1), hit: false }; };
      const tap = () => {
        if (!ball || ball.hit) return;
        ball.hit = true;
        const d = Math.abs(ball.p - 0.62);
        n++;
        if (d < win) { goals++; pts += 17; msg = ['GOL!', '#3ddc97']; api.good('Kafayla gol!'); }
        else if (d < win * 2.2) { pts += 7; msg = ['DİREK', '#ffb547']; api.feedback('Direkten döndü', '#ffb547'); }
        else { msg = ['ISKA', '#ff5b7a']; api.bad('Iska'); }
        api.setScore(`${goals}/${n}`);
        wait = 1.1;
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      api.hideTimer();
      api.loop(dt => {
        W = stage.clientWidth; H = stage.clientHeight;
        if (!ball || ball.hit || ball.p > 1) {
          if (ball && !ball.hit && ball.p > 1) { ball.hit = true; n++; msg = ['KAÇTI', '#ff5b7a']; api.bad('Kaçırdın'); api.setScore(`${goals}/${n}`); wait = 1; }
          wait -= dt;
          if (wait <= 0) { if (n >= 6) { resolve(clamp(pts, 0, 100)); ball = null; wait = 99; return; } msg = null; next(); }
        } else ball.p += dt * ball.sp;
        ctx.fillStyle = '#2f8a4f'; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(W * 0.25, H * 0.08, W * 0.5, H * 0.14);
        const hx = W / 2, hy = H * 0.62;
        ctx.strokeStyle = 'rgba(61,220,151,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(hx, hy - 40, 22 + api.ease * 10, 0, 7); ctx.stroke();
        ctx.fillStyle = '#4ea1ff'; ctx.fillRect(hx - 15, hy - 10, 30, 50); ctx.fillStyle = '#ffe2b8'; ctx.beginPath(); ctx.arc(hx, hy - 22, 12, 0, 7); ctx.fill();
        if (ball && !ball.hit) {
          const sx = ball.side < 0 ? 0 : W, x = lerp(sx, hx, ball.p / 0.62), y = hy - 40 - Math.sin(Math.min(1, ball.p / 0.62) * Math.PI) * H * 0.3 + (ball.p > 0.62 ? (ball.p - 0.62) * H : 0);
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.p > 0.62 ? hx + (ball.p - 0.62) * W * ball.side * -1 : x, y, 9, 0, 7); ctx.fill();
        }
        if (msg) { ctx.fillStyle = msg[1]; ctx.font = '900 36px Nunito'; ctx.textAlign = 'center'; ctx.fillText(msg[0], W / 2, H * 0.4); ctx.textAlign = 'left'; }
      });
    });
  },
});

// ————————————————— DOĞRU MU YANLIŞ MI —————————————————
const FACTS = [
  ['Türkiye\'nin başkenti Ankara\'dır.', true], ['Su 50 °C\'de kaynar.', false], ['Bir yılda 12 ay vardır.', true], ['Güneş bir gezegendir.', false],
  ['Ay, Dünya\'nın uydusudur.', true], ['Balinalar balık türüdür.', false], ['Üçgenin iç açıları toplamı 180°\'dir.', true], ['Işık sesten yavaş yayılır.', false],
  ['İstanbul 1453\'te fethedildi.', true], ['Bitkiler karbondioksit alıp oksijen verir.', true], ['Mars\'a \"Kızıl Gezegen\" denir.', true], ['Bir haftada 8 gün vardır.', false],
  ['Kalp, kanı vücuda pompalar.', true], ['Buz, sudan ağırdır.', false], ['Everest dünyanın en yüksek dağıdır.', true], ['Penguenler uçabilir.', false],
  ['Karadeniz tuzlu değildir.', false], ['İnsanın 206 kemiği vardır.', true], ['Mıknatıs tahtayı çeker.', false], ['Atatürk 1881\'de doğdu.', true],
];
register({
  id: 'dogruyanlis', name: 'Doğru mu, Yanlış mı?', icon: '✅',
  how: ['Ekrana gelen ifade doğru mu yanlış mı? Hızla karar ver.', 'Art arda doğrular seri yapar.', 'Yanlış cevap 2 saniye götürür.', '35 saniye.'],
  play(stage, api) {
    return new Promise(resolve => {
      let ok = 0, bad = 0, streak = 0, bonus = 0, cur, over = false;
      const total = 35 * api.timeMul;
      const t0 = performance.now();
      const q = h('div.qcard', { style: { fontSize: '19px', minHeight: '120px' } });
      const st = h('div.center.small', { style: { minHeight: '20px', color: '#ffc53d', fontWeight: 800 } });
      const next = () => {
        if (api.rng.chance(0.45)) {
          const a = api.rng.int(3, 9 + Math.round(api.diff * 6)), b = api.rng.int(3, 12);
          const right = api.rng.chance(0.5); const v = a * b + (right ? 0 : api.rng.pick([-2, -1, 1, 2, 10]));
          cur = [`${a} × ${b} = ${v}`, right];
        } else cur = api.rng.pick(FACTS);
        q.textContent = cur[0];
      };
      const ans = v => {
        if (over) return;
        if (v === cur[1]) { ok++; streak++; api.sfx.good(); if (streak >= 4) { bonus += 1; st.textContent = `🔥 Seri ×${streak}`; } }
        else { bad++; streak = 0; bonus -= 2; st.textContent = ''; api.bad('−2 sn'); }
        api.setScore(ok);
        next();
      };
      stage.replaceChildren(h('div.col', { style: { gap: '14px' } }, q, st, h('div.row', { style: { gap: '10px' } },
        h('button.btn.grow', { style: { background: '#2fa36b', fontSize: '20px', minHeight: '70px' }, onclick: () => ans(true) }, '✔ Doğru'),
        h('button.btn.grow', { style: { background: '#d63a55', fontSize: '20px', minHeight: '70px' }, onclick: () => ans(false) }, '✖ Yanlış'))));
      next();
      api.loop(() => {
        const f = 1 - ((performance.now() - t0) / 1000 - bonus) / total;
        api.setTimer(f);
        if (f <= 0 && !over) { over = true; resolve(clamp(ok / 16 * 100 - bad * 4, 0, 100)); }
      });
    });
  },
});

// ————————————————— SIRALAMA —————————————————
const HISTORY = [['Malazgirt Savaşı', 1071], ['İstanbul\'un Fethi', 1453], ['TBMM\'nin açılışı', 1920], ['Cumhuriyet\'in ilanı', 1923], ['Kurtuluş Savaşı\'nın başlangıcı', 1919], ['Harf Devrimi', 1928], ['Kadınlara seçme hakkı', 1934], ['İlk Türk uydusu (Türksat 1B)', 1994]];
const SIZES = [['🐜 Karınca', 1], ['🐭 Fare', 2], ['🐈 Kedi', 3], ['🐕 Köpek', 4], ['🐎 At', 5], ['🐘 Fil', 6], ['🐋 Balina', 7]];
register({
  id: 'siralama', name: 'Sıralama', icon: '🔢',
  how: ['Öğeleri doğru sırayla dokunarak diz (küçükten büyüğe / eskiden yeniye).', 'Yanlış dokunuş turu bozar.', '5 tur, her tur daha uzun.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      let pts = 0;
      for (let r = 0; r < 5; r++) {
        const n = clamp(3 + Math.round(api.diff * 2) + Math.floor(r / 2), 3, 7);
        const kind = api.rng.pick(['sayi', 'tarih', 'boy']);
        let items;
        if (kind === 'sayi') { const set = new Set(); while (set.size < n) set.add(api.rng.int(-20, 120) + (api.diff > 0.5 ? api.rng.pick([0, 0.5]) : 0)); items = [...set].map(v => [String(v).replace('.', ','), v]); }
        else if (kind === 'tarih') items = api.rng.shuffle(HISTORY).slice(0, n);
        else items = api.rng.shuffle(SIZES).slice(0, n);
        const order = items.slice().sort((a, b) => a[1] - b[1]);
        const r2 = await new Promise(res => {
          let k = 0, done = false;
          const tl = api.timerLoop(8 + n * 2.2 + api.ease * 4 - api.diff * 3, () => { done = true; res(k / n * 0.5); });
          const els = api.rng.shuffle(items).map(it => h('button.qopt', { style: { textAlign: 'center' }, onclick: e => {
            if (done) return;
            if (it === order[k]) { k++; e.currentTarget.classList.add('ok'); e.currentTarget.onclick = null; api.sfx.tap(); if (k === n) { done = true; tl.stop(); res(1 * (0.7 + 0.3 * tl.left())); } }
            else { done = true; tl.stop(); e.currentTarget.classList.add('no'); api.bad('Sıra bozuldu'); res(k / n * 0.6); }
          } }, it[0]));
          stage.replaceChildren(h('div.col', {}, h('div.row', {}, h('span.chip.accent', {}, `Tur ${r + 1}/5`), h('span.grow'), h('span.small.muted', {}, kind === 'tarih' ? 'Eskiden → yeniye' : 'Küçükten → büyüğe')), h('div.qopts', {}, els)));
        });
        pts += r2 * 20; api.setScore(Math.round(pts));
        await sleep(500);
      }
      resolve(clamp(pts, 0, 100));
    });
  },
});

// ————————————————— REFLEKS —————————————————
register({
  id: 'tepki', name: 'Refleks', icon: '⚡',
  how: ['Yeşil hedefler belirir: hemen dokun.', 'Kırmızılara dokunma!', 'Hedefler giderek hızlanır.', '25 saniye.'],
  play(stage, api) {
    return new Promise(resolve => {
      let hit = 0, miss = 0, wrong = 0, over = false;
      const box = h('div', { style: { position: 'relative', flex: 1, background: '#101533', borderRadius: '18px', border: '1px solid var(--line)', minHeight: '360px' } });
      stage.replaceChildren(box);
      const spawn = () => {
        if (over) return;
        const red = api.rng.chance(0.2 + api.diff * 0.15);
        const r = box.getBoundingClientRect();
        const size = clamp(64 - api.diff * 22 + api.ease * 12, 36, 76);
        const el = h('button', { style: { position: 'absolute', left: api.rng.float(0, r.width - size) + 'px', top: api.rng.float(0, r.height - size) + 'px', width: size + 'px', height: size + 'px', borderRadius: '50%', background: red ? '#ff5b7a' : '#3ddc97', boxShadow: `0 0 20px ${red ? '#ff5b7a' : '#3ddc97'}` } });
        let gone = false;
        el.onpointerdown = () => { if (gone) return; gone = true; el.remove(); if (red) { wrong++; api.bad('Kırmızı!'); } else { hit++; api.sfx.tap(); } api.setScore(hit); };
        box.append(el);
        const life = clamp(1300 - api.diff * 500 + api.ease * 300 - hit * 12, 450, 1600) * api.timeMul;
        setTimeout(() => { if (!gone) { gone = true; el.remove(); if (!red) miss++; } }, life);
        setTimeout(spawn, clamp(750 - hit * 8, 380, 800));
      };
      api.timerLoop(25, () => { over = true; resolve(clamp(hit / Math.max(1, hit + miss) * 90 + Math.min(10, hit / 3) - wrong * 6, 0, 100)); });
      api.setScore(0);
      setTimeout(spawn, 200);
    });
  },
});

// ————————————————— MELODİ —————————————————
const PADS = [['Do', '#ff5b7a'], ['Mi', '#ffb547'], ['Sol', '#3ddc97'], ['Do²', '#7c6cff']];
register({
  id: 'melodi', name: 'Melodi', icon: '🎼',
  how: ['Çalınan melodiyi dinle ve izle.', 'Aynı sırayla tuşlara bas.', 'Her turda melodi uzar; iki hata oyunu bitirir.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      const seq = [];
      let len = 3 + Math.round(api.diff), mistakes = 0, best = 0;
      const pads = PADS.map(([n, c], i) => h('button.cell', { style: { aspectRatio: '1.3', background: c + '55', border: `2px solid ${c}`, fontSize: '20px' } }, n));
      const info = h('div.center', { style: { fontWeight: 800, margin: '8px 0' } });
      stage.replaceChildren(h('div.col', {}, info, h('div.grid-board', { style: { gridTemplateColumns: '1fr 1fr', maxWidth: '340px' } }, pads)));
      const light = async (i, ms) => { pads[i].style.background = PADS[i][1]; api.sfx.note(i); await sleep(ms); pads[i].style.background = PADS[i][1] + '55'; };
      for (let round = 0; round < 7 && mistakes < 2; round++) {
        while (seq.length < len) seq.push(api.rng.int(0, 3));
        info.textContent = `🎧 Dinle (${len} nota)`;
        await sleep(500);
        const ms = clamp(520 - api.diff * 200 + api.ease * 150, 260, 700);
        for (const i of seq.slice(0, len)) { await light(i, ms); await sleep(120); }
        info.textContent = '🎹 Şimdi sen çal';
        const ok = await new Promise(res => {
          let k = 0;
          pads.forEach((p, i) => p.onclick = () => { light(i, 180); if (i === seq[k]) { k++; if (k === len) res(true); } else res(false); });
        });
        pads.forEach(p => p.onclick = null);
        if (ok) { best = len; api.good('Kusursuz!'); len++; } else { mistakes++; api.bad('Yanlış nota'); }
        api.setScore(best);
        await sleep(600);
      }
      resolve(clamp((best - 2) / 6 * 100, 0, 100));
    });
  },
});
