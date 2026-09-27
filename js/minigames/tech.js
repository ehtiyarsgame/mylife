import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';

// ————————————————— DEVRE —————————————————
// Karolar: N=1 E=2 S=4 W=8. Karoya dokununca saat yönünde döner. Pilden ampule akım götür.
const rot = m => ((m << 1) | (m >> 3)) & 15;
const DIRS = [[1, -1, 0, 4], [2, 0, 1, 8], [4, 1, 0, 1], [8, 0, -1, 2]]; // bit, dr, dc, karşı bit

function makeCircuit(rng, n) {
  const r0 = rng.int(0, n - 1), r1 = rng.int(0, n - 1);
  // Rastgele, kendini kesmeyen yol (geri izlemeli DFS)
  const seen = new Set();
  const path = [];
  const dfs = (r, c) => {
    path.push([r, c]); seen.add(r * n + c);
    if (c === n - 1 && r === r1) return true;
    for (const [bit, dr, dc] of rng.shuffle(DIRS)) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n || seen.has(nr * n + nc)) continue;
      if (dfs(nr, nc)) return true;
    }
    path.pop(); return false;
  };
  dfs(r0, 0);
  const cells = new Array(n * n).fill(0);
  path.forEach(([r, c], i) => {
    const idx = r * n + c;
    if (i === 0) cells[idx] |= 8;
    if (i === path.length - 1) cells[idx] |= 2;
    for (const [pr, pc] of [path[i - 1], path[i + 1]].filter(Boolean)) {
      const d = DIRS.find(([, dr, dc]) => pr === r + dr && pc === c + dc);
      cells[idx] |= d[0];
    }
  });
  const onPath = new Set(path.map(([r, c]) => r * n + c));
  const shapes = [5, 3, 7, 1];
  for (let i = 0; i < n * n; i++) if (!onPath.has(i)) { let m = rng.pick(shapes); for (let k = rng.int(0, 3); k > 0; k--) m = rot(m); cells[i] = m; }
  const solved = cells.slice();
  for (let i = 0; i < n * n; i++) for (let k = rng.int(1, 3); k > 0; k--) cells[i] = rot(cells[i]);
  return { n, r0, r1, cells, solved };
}
function powered(P) {
  const { n, r0, r1, cells } = P;
  const on = new Set();
  const start = r0 * n;
  if (!(cells[start] & 8)) return { on, done: false };
  const q = [start]; on.add(start);
  while (q.length) {
    const i = q.shift(), r = Math.floor(i / n), c = i % n;
    for (const [bit, dr, dc, opp] of DIRS) {
      if (!(cells[i] & bit)) continue;
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
      const j = nr * n + nc;
      if (!on.has(j) && (cells[j] & opp)) { on.add(j); q.push(j); }
    }
  }
  const end = r1 * n + n - 1;
  return { on, done: on.has(end) && !!(cells[end] & 2) };
}
function tileSVG(m, lit) {
  const col = lit ? '#ffd84d' : '#6b76b0';
  const seg = (x, y) => `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="${col}" stroke-width="16" stroke-linecap="round"/>`;
  let s = '';
  if (m & 1) s += seg(50, 0); if (m & 2) s += seg(100, 50); if (m & 4) s += seg(50, 100); if (m & 8) s += seg(0, 50);
  s += `<circle cx="50" cy="50" r="11" fill="${col}"/>`;
  if (lit) s = `<g style="filter:drop-shadow(0 0 6px #ffd84d)">${s}</g>`;
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">${s}</svg>`;
}
register({
  id: 'devre', name: 'Devre Kur', icon: '💡',
  how: ['Karolara dokunarak döndür.', 'Soldaki pilden sağdaki ampule kesintisiz bir hat kur.', 'Akım geçen kablolar sarı yanar.', '60 saniyede 3 devre.'],
  play(stage, api) {
    return new Promise(resolve => {
      let solvedN = 0, taps = 0, over = false, lock = false;
      const sizes = [4, 5, 5].map((s, i) => clamp(s + Math.round(api.diff * 1.5) + (i === 2 ? 1 : 0) - (api.ease > 0.7 ? 1 : 0), 4, 7));
      const tm = api.timerLoop(60, () => finish());
      const finish = () => { if (over) return; over = true; tm.stop(); resolve(clamp(solvedN / 3 * 82 + (solvedN === 3 ? tm.left() * 40 : 0) - Math.max(0, taps - 60) * 0.2, 0, 100)); };
      const round = i => {
        const P = makeCircuit(api.rng, sizes[i]);
        const n = P.n;
        const els = P.cells.map((_, k) => h('button.cell', { style: { padding: '0', background: '#101533' }, onclick: () => { if (over || lock) return; P.cells[k] = rot(P.cells[k]); taps++; api.sfx.tick(); draw(); } }));
        const bat = h('div', { style: { position: 'absolute', left: '-26px', fontSize: '22px' } }, '🔋');
        const bulb = h('div', { style: { position: 'absolute', right: '-28px', fontSize: '24px', transition: 'filter .3s' } }, '💡');
        const board = h('div.grid-board', { style: { gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '3px', maxWidth: '380px', position: 'relative' } }, els);
        const wrap = h('div', { style: { position: 'relative', margin: '10px 30px' } }, board, bat, bulb);
        stage.replaceChildren(h('div.center.small.muted', {}, `Devre ${i + 1}/3`), wrap);
        const place = () => {
          const cs = board.getBoundingClientRect().width / n;
          bat.style.top = (P.r0 * cs + cs / 2 - 14) + 'px';
          bulb.style.top = (P.r1 * cs + cs / 2 - 16) + 'px';
        };
        const draw = () => {
          const { on, done } = powered(P);
          els.forEach((e, k) => e.innerHTML = tileSVG(P.cells[k], on.has(k)));
          bulb.style.filter = done ? 'drop-shadow(0 0 14px #ffd84d) brightness(1.4)' : 'grayscale(1) brightness(.6)';
          if (done && !over && !lock) {
            solvedN++; api.good('Işık yandı!'); api.setScore(`${solvedN}/3`);
            lock = true;
            if (solvedN >= 3) { finish(); return; }
            setTimeout(() => { lock = false; if (!over) round(solvedN); }, 700);
          }
        };
        draw(); requestAnimationFrame(place);
      };
      api.setScore('0/3');
      round(0);
    });
  },
});

// ————————————————— BUG AVI —————————————————
const SNIPPETS = [
  { goal: '1\'den 10\'a kadar sayıların toplamını bul.', code: ['let toplam = 0;', 'for (let i = 1; i <= 10; i++) {', '  toplam = i;', '}', 'yazdir(toplam);'], bug: 2, why: 'toplam = i yerine toplam += i olmalı.' },
  { goal: 'Notların ortalamasını hesapla.', code: ['function ortalama(notlar) {', '  let t = 0;', '  for (const n of notlar) t += n;', '  return t / 2;', '}'], bug: 3, why: 'Not sayısına bölünmeli: t / notlar.length' },
  { goal: '18 yaş ve üstü ehliyet alabilir.', code: ['function ehliyetUygun(yas) {', '  if (yas > 18) {', '    return true;', '  }', '  return false;', '}'], bug: 1, why: '18 yaşındakiler de dahil: yas >= 18' },
  { goal: 'Listenin son elemanını döndür.', code: ['function sonEleman(liste) {', '  if (liste.length === 0) return null;', '  return liste[liste.length];', '}'], bug: 2, why: 'Dizi 0\'dan başlar: liste[liste.length - 1]' },
  { goal: 'Fiyata %20 indirim uygula.', code: ['function indirimli(fiyat) {', '  const oran = 20;', '  return fiyat * oran / 100;', '}'], bug: 2, why: 'Bu indirim miktarını verir; doğrusu fiyat * (100 - oran) / 100' },
  { goal: '0\'dan 9\'a kadar sayıları yazdır.', code: ['let i = 0;', 'while (i < 10) {', '  yazdir(i);', '}'], bug: 2, why: 'i hiç artmıyor: sonsuz döngü. i++ eklenmeli.' },
  { goal: 'Listedeki en büyük sayıyı bul (sayılar negatif olabilir).', code: ['function enBuyuk(s) {', '  let m = 0;', '  for (const x of s) if (x > m) m = x;', '  return m;', '}'], bug: 1, why: 'Hepsi negatifse 0 döner. m = s[0] ile başlamalı.' },
  { goal: 'Sayı çiftse "çift" yaz.', code: ['function kontrol(sayi) {', '  if (sayi % 2 === 1) {', '    yazdir("çift");', '  }', '}'], bug: 1, why: 'Çift sayılarda kalan 0\'dır: sayi % 2 === 0' },
  { goal: 'Satıştan sonra stoğu güncelle.', code: ['function sat(urun, adet) {', '  if (urun.stok < adet) return false;', '  urun.stok = urun.stok + adet;', '  return true;', '}'], bug: 2, why: 'Satışta stok azalır: urun.stok - adet' },
  { goal: 'KDV dahil fiyatı hesapla (oran 0.20).', code: ['function kdvli(fiyat) {', '  const kdv = 0.20;', '  return fiyat + kdv;', '}'], bug: 2, why: 'Oran fiyatla çarpılmalı: fiyat * (1 + kdv)' },
  { goal: 'n faktöriyeli hesapla.', code: ['function faktoriyel(n) {', '  let sonuc = 0;', '  for (let i = 2; i <= n; i++) sonuc *= i;', '  return sonuc;', '}'], bug: 1, why: 'Çarpım 0\'dan başlarsa hep 0 olur: sonuc = 1' },
  { goal: 'Şifre doğruysa girişe izin ver.', code: ['function giris(sifre, girilen) {', '  if (sifre = girilen) {', '    return "Hoş geldin";', '  }', '  return "Hatalı şifre";', '}'], bug: 1, why: '= atamadır; karşılaştırma için === kullanılmalı.' },
  { goal: 'Metni ters çevir ("abc" → "cba").', code: ['function ters(s) {', '  let t = "";', '  for (let i = 0; i < s.length; i++) t = t + s[i];', '  return t;', '}'], bug: 2, why: 'Harf başa eklenmeli: t = s[i] + t' },
  { goal: 'Her gün kaç kişinin geldiğini say.', code: ['for (const gun of gunler) {', '  let sayac = 0;', '  sayac += gun.ziyaretci;', '}', 'yazdir(sayac);'], bug: 1, why: 'sayac döngü içinde sıfırlanıyor ve dışarıda görünmüyor; döngüden önce tanımlanmalı.' },
  { goal: 'Sepetteki ürünlerin toplam fiyatını bul.', code: ['let toplam = 0;', 'for (const u of sepet) {', '  toplam += u.fiyat;', '}', 'return toplam * sepet.length;'], bug: 4, why: 'Toplam zaten hesaplandı; tekrar adetle çarpılmamalı.' },
  { goal: 'Geçme notu 50 ve üstüdür.', code: ['function durum(not) {', '  if (not >= 50) return "Geçti";', '  else if (not > 100) return "Hatalı not";', '  return "Kaldı";', '}'], bug: 2, why: '100\'ün üstü de önce "Geçti" olur; hatalı not kontrolü başta yapılmalı.' },
];
register({
  id: 'bugavi', name: 'Bug Avı', icon: '🐞',
  how: ['Kodun amacını oku.', 'Amaca uymayan (hatalı) satıra dokun.', 'Her kod için süre kısıtlı; hızlı olmak bonus.', '5 kod parçası.'],
  play(stage, api) {
    return new Promise(async resolve => {
      const list = api.rng.shuffle(SNIPPETS).slice(0, 5);
      let pts = 0;
      for (let i = 0; i < list.length; i++) {
        const S = list[i];
        const limit = (24 - api.diff * 10 + api.ease * 6) * api.timeMul;
        const r = await new Promise(res => {
          let done = false;
          const lines = S.code.map((c, k) => h('div.ln', { onclick: () => pick(k) }, h('span.n', {}, k + 1), h('span', {}, c)));
          const why = h('div.small', { style: { minHeight: '38px', marginTop: '10px', color: '#ffe08a' } });
          stage.replaceChildren(h('div.col', {},
            h('div.row', {}, h('span.chip.accent', {}, `Kod ${i + 1}/5`)),
            h('div.qcard', { style: { fontSize: '15px', minHeight: '60px' } }, '🎯 ', S.goal),
            h('div.code', {}, lines), why));
          const t0 = performance.now();
          const pick = k => {
            if (done) return; done = true; tl.stop();
            const f = 1 - (performance.now() - t0) / 1000 / limit;
            if (k === S.bug) { lines[k].classList.add('ok'); api.sfx.good(); }
            else { if (k >= 0) lines[k].classList.add('no'); lines[S.bug].classList.add('ok'); api.sfx.bad(); }
            why.textContent = '💡 ' + S.why;
            setTimeout(() => res(k === S.bug ? 16 + Math.max(0, f) * 4 : 0), 1500);
          };
          const tl = api.timerLoop(limit / api.timeMul, () => pick(-1));
        });
        pts += r;
        api.setScore(Math.round(pts));
      }
      resolve(pts);
    });
  },
});

// ————————————————— PARÇA TAKMA —————————————————
const PARTS = ['🔩', '⚙️', '🔧', '🪛', '🔌', '🧲', '🛞', '🔋', '🪝'];
register({
  id: 'parca', name: 'Sök & Tak', icon: '🔧',
  how: ['Parçaların sökülme sırasını izle.', 'Makineyi toplamak için parçaları TERS sırayla tak.', 'Her turda sıra uzar. İki hata oyunu bitirir.', 'Zor modda parçalar masada yer değiştirir!'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      const nParts = api.diff < 0.4 ? 6 : 8;
      const icons = api.rng.shuffle(PARTS).slice(0, nParts);
      let len = 3 + Math.round(api.diff * 1.2), mistakes = 0, earned = 0, maxEarn = 0;
      const rounds = 5;
      for (let r = 0; r < rounds && mistakes < 2; r++) {
        const seq = Array.from({ length: len }, () => api.rng.int(0, nParts - 1));
        maxEarn += len;
        let order = [...Array(nParts).keys()];
        const cells = [];
        const grid = h('div.grid-board', { style: { gridTemplateColumns: `repeat(${nParts <= 6 ? 3 : 4}, 1fr)`, maxWidth: '360px' } });
        const info = h('div.center', { style: { fontWeight: 800, margin: '6px 0 12px' } });
        stage.replaceChildren(h('div.col', {}, h('div.center.small.muted', {}, `Tur ${r + 1}/${rounds} · ${len} adım · Hata: ${mistakes}/2`), info, grid));
        const build = clickable => {
          grid.replaceChildren(...order.map(pi => {
            const el = h('button.cell', { onclick: () => clickable && tap(pi, el) }, icons[pi]);
            cells[pi] = el; return el;
          }));
        };
        let tap = () => {};
        build(false);
        info.textContent = '👀 Sökme sırasını izle';
        await sleep(500);
        const showMs = clamp(700 - api.diff * 280 + api.ease * 200, 320, 900);
        for (const pi of seq) {
          cells[pi].style.background = '#ffb547'; cells[pi].style.transform = 'scale(1.08)'; api.sfx.note(pi);
          await sleep(showMs);
          cells[pi].style.background = ''; cells[pi].style.transform = '';
          await sleep(140);
        }
        if (api.diff > 0.5) { order = api.rng.shuffle(order); }
        build(true);
        info.textContent = '🔁 Şimdi ters sırayla tak';
        const target = seq.slice().reverse();
        let k = 0;
        const ok = await new Promise(res => {
          tap = (pi, el) => {
            if (pi === target[k]) { k++; api.sfx.note(pi); el.style.background = 'rgba(61,220,151,.35)'; setTimeout(() => el.style.background = '', 200); if (k === target.length) res(true); }
            else { el.style.background = 'rgba(255,91,122,.4)'; res(false); }
          };
        });
        if (ok) { earned += len; api.good('Tamamlandı!'); len++; }
        else { mistakes++; earned += k * 0.5; api.bad('Yanlış parça!'); }
        api.setScore(Math.round(earned / Math.max(1, maxEarn) * 100) + '%');
        await sleep(700);
      }
      resolve(clamp(earned / Math.max(1, maxEarn) * 100 * (mistakes >= 2 ? 0.85 : 1), 0, 100));
    });
  },
});

// ————————————————— ARIZA BULMA —————————————————
const MACHINES = [
  { n: 'Otomobil', e: '🚗', parts: [
    ['Akü', ['Marş basmıyor', 'Farlar sönük']], ['Buji', ['Motor tekliyor', 'Yakıt tüketimi arttı']], ['Radyatör', ['Motor hararet yapıyor', 'Altında su izi var']],
    ['Fren balatası', ['Frende gıcırtı', 'Fren mesafesi uzadı']], ['Triger kayışı', ['Motordan tıkırtı', 'Marş basıyor ama çalışmıyor']], ['Alternatör', ['Akü ışığı yanıyor', 'Farlar sönük']]] },
  { n: 'Çamaşır makinesi', e: '🧺', parts: [
    ['Pompa', ['Su boşaltmıyor', 'Uğultu sesi']], ['Rulman', ['Sıkmada şiddetli ses', 'Kazan sallanıyor']], ['Rezistans', ['Su ısınmıyor', 'Sigorta atıyor']],
    ['Kapı kilidi', ['Program başlamıyor', 'Kapı ışığı yanıp sönüyor']], ['Kayış', ['Kazan dönmüyor', 'Yanık kokusu']]] },
  { n: 'Kombi', e: '🔥', parts: [
    ['Sirkülasyon pompası', ['Petekler ısınmıyor', 'Uğultu sesi']], ['Genleşme tankı', ['Basınç sürekli düşüyor', 'Emniyet ventilinden su damlıyor']],
    ['Sıcaklık sensörü', ['Su bir sıcak bir soğuk', 'Hata kodu veriyor']], ['Ateşleme elektrodu', ['Tık tık ses var ama yanmıyor', 'Hata kodu veriyor']], ['Fan', ['Baca gazı hatası', 'Uğultu sesi']]] },
  { n: 'Buzdolabı', e: '🧊', parts: [
    ['Kompresör', ['Hiç soğutmuyor', 'Sürekli tık sesi']], ['Termostat', ['Aşırı donduruyor', 'Motor hiç durmuyor']], ['Fan motoru', ['Dondurucu soğuk, alt bölüm ılık', 'Vızıltı']],
    ['Kapı contası', ['Kapı kenarı terliyor', 'Motor hiç durmuyor']], ['Defrost rezistansı', ['Arka duvar buz tuttu', 'Dondurucu soğuk, alt bölüm ılık']]] },
];
register({
  id: 'ariza', name: 'Arıza Tespiti', icon: '🛠️',
  how: ['Belirtileri oku; hangi parçanın arızalı olduğunu bul.', '🔍 ile parçayı test edebilirsin ama her test 4 saniye yer.', 'Emin olunca ✔ ile arızalı parçayı seç.', 'Aynı belirti birden fazla parçada görülebilir — dikkat!'],
  play(stage, api) {
    return new Promise(async resolve => {
      const ms = api.rng.shuffle(MACHINES).slice(0, 3);
      let pts = 0;
      for (let i = 0; i < ms.length; i++) {
        const M = ms[i];
        const faultIdx = api.rng.int(0, M.parts.length - 1);
        const fault = M.parts[faultIdx];
        let sym = fault[1].slice();
        if (api.diff > 0.45) sym = [api.rng.pick(sym)];
        if (api.diff > 0.7) { const other = api.rng.pick(M.parts.filter((_, k) => k !== faultIdx)); sym.push(api.rng.pick(other[1]) + ' (belki)'); }
        const r = await new Promise(res => {
          let tests = 0, done = false, penalty = 0;
          const limit = (26 - api.diff * 8 + api.ease * 6);
          const t0 = performance.now();
          const rows = M.parts.map(([name], k) => {
            const st = h('span.small', { style: { width: '72px', textAlign: 'center' } }, '');
            return h('div.row.tile', { style: { padding: '8px 10px' } },
              h('b.grow', {}, name), st,
              h('button.btn.sm', { onclick: () => { if (done || st.textContent) return; tests++; penalty += 4; api.sfx.tick(); st.textContent = k === faultIdx ? '✖ ARIZALI' : '✔ normal'; st.style.color = k === faultIdx ? '#ff5b7a' : '#3ddc97'; } }, '🔍'),
              h('button.btn.sm.green', { onclick: () => choose(k) }, '✔'));
          });
          stage.replaceChildren(h('div.col', {},
            h('div.row', {}, h('span', { style: { fontSize: '30px' } }, M.e), h('b', {}, M.n), h('span.grow'), h('span.chip', {}, `${i + 1}/3`)),
            h('div.tile', {}, h('div.small.muted', {}, 'Müşteri şikâyeti:'), ...sym.map(s => h('div', { style: { fontWeight: 800 } }, '• ' + s))),
            ...rows));
          const choose = k => {
            if (done) return; done = true;
            if (k === faultIdx) { api.good('Doğru teşhis!'); res(clamp(26 + 8 * (1 - tests / 3) - 0, 0, 34)); }
            else { api.bad(`Arıza: ${fault[0]}`); res(0); }
          };
          const loop = () => {
            if (done) return;
            const f = 1 - ((performance.now() - t0) / 1000 + penalty) / (limit * api.timeMul);
            api.setTimer(f);
            if (f <= 0) { done = true; api.bad('Süre doldu'); res(0); return; }
            requestAnimationFrame(loop);
          };
          loop();
          api.onCleanup(() => { done = true; });
        });
        pts += r;
        api.setScore(Math.round(pts));
        await sleep(800);
      }
      resolve(clamp(pts, 0, 100));
    });
  },
});
