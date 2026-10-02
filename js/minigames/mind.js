import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';
import { pickQuestions, levelFor } from '../sim/questions.js';
import { lang } from '../core/i18n.js';

// ————————————————— SINAV —————————————————
// extra: { questions, perQ, prep, jokers: {ogretmen, ezber, grup, sure}, adJoker: async () => bool, examName }
const JOKERS = {
  ogretmen: { n: 'Öğretmene sor', e: '🧑‍🏫', d: 'İki yanlış şıkkı eler' },
  ezber:    { n: 'Ezber aklına geldi', e: '💡', d: 'Konuyla ilgili ipucu' },
  grup:     { n: 'Çalışma grubu', e: '👥', d: 'Doğru şıkkı %70 olasılıkla gösterir' },
  sure:     { n: 'Ekstra süre', e: '⏱️', d: '+30 saniye' },
};
register({
  id: 'sinav', name: 'Sınav', icon: '📝',
  how: ['Her soru için süren var; süre biterse soru boş sayılır.', 'Hazırlığın 70+ ise bir yanlış şık soluk görünür; 40 altındaysa süre kısalır.', 'Jokerlerini akıllıca kullan (sınav başına en fazla 2).'],
  play(stage, api) {
    return new Promise(async resolve => {
      const x = api.extra;
      const qs = x.questions || pickQuestions(levelFor(x.age ?? 12), 5);
      const prep = x.prep ?? 50;
      let perQ = (x.perQ ?? 30) * (prep < 40 && !x.easy ? 0.75 : 1);
      let correct = 0, used = 0;
      const usedSet = new Set();
      let adUsed = false;
      for (let i = 0; i < qs.length; i++) {
        const Q = qs[i];
        const ok = await new Promise(res => {
          let done = false;
          const faded = new Set();
          let limit = perQ * api.timeMul;
          const t0 = performance.now();
          let extraT = 0;
          const optEls = Q.opts.map((o, k) => h('button.qopt', { onclick: () => answer(k) }, `${'ABCD'[k]})  ${o}`));
          const hintBox = h('div.small', { style: { color: '#ffe08a', minHeight: '18px', marginTop: '8px' } });
          const fade = n => {
            const wrong = [0, 1, 2, 3].filter(k => k !== Q.correct && !faded.has(k));
            for (const k of api.rng.shuffle(wrong).slice(0, n)) { faded.add(k); optEls[k].classList.add('fade'); }
          };
          if (prep >= 70 || x.easy) fade(1); // ilk sınıflarda bir yanlış şık baştan elenir
          const answer = k => {
            if (done) return; done = true; tm.stop();
            optEls.forEach(e => e.onclick = null);
            if (k === Q.correct) { optEls[k].classList.add('ok'); api.sfx.good(); }
            else { if (k >= 0) optEls[k].classList.add('no'); optEls[Q.correct].classList.add('ok'); api.sfx.bad(); }
            setTimeout(() => res(k === Q.correct), 750);
          };
          const useJoker = id => {
            if (used >= 2 || usedSet.has(id) || done) return;
            used++; usedSet.add(id); api.sfx.coin();
            if (id === 'ogretmen') fade(2);
            if (id === 'ezber') hintBox.textContent = '💡 ' + (Q.h || 'Soruyu dikkatle oku; şıkları ele.');
            if (id === 'grup') { const k = api.rng.chance(0.7) ? Q.correct : api.rng.pick([0, 1, 2, 3].filter(k => k !== Q.correct)); optEls[k].classList.add('glow'); }
            if (id === 'sure') extraT += 30;
            renderJokers();
          };
          const jokerBox = h('div.jokers');
          const renderJokers = () => {
            const list = Object.keys(JOKERS).filter(k => x.jokers?.[k]);
            jokerBox.replaceChildren(...[
              ...list.map(k => h('button.joker' + (usedSet.has(k) || used >= 2 ? '.used' : ''), { onclick: () => useJoker(k) }, JOKERS[k].e, ' ', JOKERS[k].n)),
              x.adJoker && !adUsed && used < 2 ? h('button.joker', { style: { borderColor: '#ffc53d' }, onclick: async () => {
                const avail = Object.keys(JOKERS).filter(k => !usedSet.has(k));
                const pick = await new Promise(r2 => {
                  const box = h('div.col', { style: { position: 'absolute', inset: '0', background: 'rgba(10,13,28,.96)', zIndex: 9, padding: '14px', borderRadius: '16px', justifyContent: 'center' } },
                    h('h3.center', {}, '📺 Reklam jokeri: birini seç'),
                    ...avail.map(k => btn(`${JOKERS[k].e} ${JOKERS[k].n} — ${JOKERS[k].d}`, () => { box.remove(); r2(k); }, 'block')),
                    btn('Vazgeç', () => { box.remove(); r2(null); }, 'ghost'));
                  stage.append(box);
                });
                if (!pick) return;
                tm.pause = true;
                const okAd = await x.adJoker();
                tm.pause = false;
                if (okAd) { adUsed = true; used--; usedSet.delete(pick); useJoker(pick); }
              } }, '📺 Reklam jokeri') : null,
            ].filter(Boolean));
          };
          renderJokers();
          stage.replaceChildren(h('div.col', { style: { gap: '0' } },
            h('div.row', {}, h('span.chip.accent', {}, `${x.examName || 'Soru'} ${i + 1}/${qs.length}`), h('span.chip', {}, Q.s || ''), h('span.grow'), h('span.small.muted', {}, `Hazırlık ${prep}`)),
            h('div.sp'),
            h('div.qcard', {}, Q.q),
            hintBox,
            h('div.qopts', {}, optEls),
            jokerBox,
          ));
          let paused = 0, pStart = 0;
          const tm = { stop() { this.s = true; }, s: false, pause: false };
          const tick = () => {
            if (tm.s) return;
            if (tm.pause) { if (!pStart) pStart = performance.now(); requestAnimationFrame(tick); return; }
            if (pStart) { paused += performance.now() - pStart; pStart = 0; }
            const el = (performance.now() - t0 - paused) / 1000;
            const f = 1 - el / (limit + extraT);
            api.setTimer(f);
            if (f <= 0) { answer(-1); return; }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          api.onCleanup(() => tm.stop());
        });
        if (ok) correct++;
        api.setScore(`${correct}/${i + 1}`);
      }
      resolve(correct / qs.length * 100);
    });
  },
});

// ————————————————— ZİHİNDEN MATEMATİK —————————————————
function mathQ(rng, lvl) {
  const t = rng.int(0, lvl < 0.3 ? 1 : lvl < 0.6 ? 3 : 5);
  let q, a;
  const R = (x, y) => rng.int(x, y);
  switch (t) {
    case 0: { const x = R(5, 20 + lvl * 60), y = R(3, 15 + lvl * 50); q = `${x} + ${y}`; a = x + y; break; }
    case 1: { const x = R(20, 40 + lvl * 80), y = R(3, x - 1); q = `${x} − ${y}`; a = x - y; break; }
    case 2: { const x = R(3, 9 + lvl * 6), y = R(3, 9 + lvl * 4); q = `${x} × ${y}`; a = x * y; break; }
    case 3: { const y = R(2, 9 + lvl * 4), a0 = R(2, 12); q = `${a0 * y} ÷ ${y}`; a = a0; break; }
    case 4: { const x = R(2, 12), y = R(5, 30); q = `? × ${x} = ${x * y}`; a = y; break; }
    default: { const x = R(2, 9), y = R(2, 9), z = R(2, 20); q = `${x} × ${y} + ${z}`; a = x * y + z; }
  }
  const opts = new Set([a]);
  while (opts.size < 4) { const d = rng.pick([-10, -2, -1, 1, 2, 10, 3]); if (a + d >= 0) opts.add(a + d); }
  return { q, a, opts: rng.shuffle([...opts]) };
}
register({
  id: 'hizlimat', name: 'Zihinden İşlem', icon: '🔢',
  how: ['40 saniyede olabildiğince çok işlem çöz.', 'Art arda doğrular kombo yapar (+1 sn).', 'Yanlış cevap 3 saniye götürür.', 'İlerledikçe sorular zorlaşır.'],
  play(stage, api) {
    return new Promise(resolve => {
      let correct = 0, wrong = 0, combo = 0, bonusT = 0;
      const total = 40 * api.timeMul;
      const t0 = performance.now();
      const qEl = h('div.qcard', { style: { fontSize: '34px' } });
      const comboEl = h('div.center.small', { style: { minHeight: '20px', color: '#ffc53d', fontWeight: 800 } });
      const optsEl = h('div.grid-board', { style: { gridTemplateColumns: '1fr 1fr', marginTop: '14px' } });
      stage.replaceChildren(h('div.col', {}, qEl, comboEl, optsEl));
      let cur, over = false;
      const next = () => {
        const prog = Math.min(1, correct / 18);
        cur = mathQ(api.rng, clamp(api.diff * 0.7 + prog * 0.5, 0, 1));
        qEl.textContent = cur.q + ' = ?';
        optsEl.replaceChildren(...cur.opts.map(o => h('button.cell', { style: { aspectRatio: 'auto', padding: '18px 0', fontSize: '24px' }, onclick: e => pick(o, e.currentTarget) }, o)));
      };
      const pick = (o, el) => {
        if (over) return;
        if (o === cur.a) { correct++; combo++; api.sfx.good(); if (combo >= 3) { bonusT += 1; comboEl.textContent = `🔥 Kombo ×${combo}  (+1 sn)`; } }
        else { wrong++; combo = 0; bonusT -= 3; api.bad('−3 sn'); comboEl.textContent = ''; el.style.background = 'rgba(255,91,122,.3)'; }
        api.setScore(correct);
        next();
      };
      next();
      api.loop(() => {
        const f = 1 - ((performance.now() - t0) / 1000 - bonusT) / total;
        api.setTimer(f);
        if (f <= 0 && !over) { over = true; resolve(clamp(correct / 17 * 100 - wrong * 2, 0, 100)); }
      });
    });
  },
});

// ————————————————— KELİME —————————————————
// i18n-skip-start (yalnızca Türkçe oyunda kullanılır)
const TR_WORDS = [
  ['KALEM', 'Yazı yazmaya yarar'], ['DEFTER', 'Notlarını içine yazarsın'], ['OKUL', 'Her sabah gittiğin yer'], ['KİTAP', 'Sayfalardan oluşur, okunur'],
  ['BULUT', 'Gökyüzünde süzülür, yağmur getirir'], ['DENİZ', 'Tuzlu, büyük su'], ['ORMAN', 'Ağaçlarla dolu geniş alan'], ['GÜNEŞ', 'Dünyayı ısıtan yıldız'],
  ['ELMA', 'Kırmızı ya da yeşil bir meyve'], ['ARKADAŞ', 'Dostun, can yoldaşın'], ['SABIR', 'Beklemeyi bilmek'], ['EMEK', 'Bir iş için harcanan çaba'],
  ['DÜRÜST', 'Yalan söylemeyen'], ['HAYAL', 'Gerçekleşmesini istediğin düşünce'], ['BAŞARI', 'Hedefe ulaşmak'], ['CESUR', 'Korkusuz, yürekli'],
  ['ÖĞRETMEN', 'Sınıfta ders anlatan kişi'], ['DOKTOR', 'Hastaları tedavi eder'], ['MÜHENDİS', 'Köprü, makine tasarlar'], ['ÇİFTÇİ', 'Toprağı eker, biçer'],
  ['TÜCCAR', 'Alım satım yapan kişi'], ['PAZAR', 'Tezgâhların kurulduğu alışveriş yeri'], ['HASAT', 'Ürünün toplanma zamanı'], ['TOHUM', 'Toprağa ekilir, filizlenir'],
  ['GEZEGEN', 'Yıldızın etrafında dönen gök cismi'], ['ENERJİ', 'İş yapabilme gücü'], ['MIKNATIS', 'Demiri kendine çeker'], ['ATOM', 'Maddenin yapı taşı'],
  ['SÖZLÜK', 'Kelimelerin anlamlarını verir'], ['ŞİİR', 'Dizelerden oluşan edebi eser'], ['ROMAN', 'Uzun anlatı türü'], ['HARİTA', 'Dünyanın çizimi'],
  ['PUSULA', 'Kuzeyi gösterir'], ['KÖPRÜ', 'İki yakayı birleştirir'], ['SAĞLIK', 'En büyük zenginlik'], ['BİLGİSAYAR', 'Kodla çalışan makine'],
  ['FUTBOL', 'On bir kişiyle oynanır'], ['KALECİ', 'Kaleyi korur'], ['ZEYTİN', 'Ağacından yağ çıkar'], ['FINDIK', 'Karadeniz\'in ünlü ürünü'],
  ['ÇALIŞKAN', 'Emek vermekten kaçmayan'], ['MERAK', 'Öğrenme isteği'], ['DOSTLUK', 'Arkadaşlar arasındaki bağ'], ['TASARRUF', 'Parayı idareli kullanmak'],
  ['YARDIM', 'Birine destek olmak'], ['AİLE', 'Anne, baba ve kardeşler'], ['İTİBAR', 'Saygınlık, güvenilirlik'], ['KARNE', 'Dönem sonunda notlarını gösterir'],
  ['DEPREM', 'Yer kabuğunun sarsılması'], ['TİYATRO', 'Sahnede oynanan eser'], ['RESSAM', 'Tuval üzerine resim yapar'], ['MELODİ', 'Notaların ahenkli dizisi'],
];
// i18n-skip-end
// i18n-skip-start
const EN_WORDS = [
  ['PENCIL', 'You write with it'], ['SCHOOL', 'Where you go every morning'], ['BOOK', 'Made of pages, you read it'], ['CLOUD', 'Floats in the sky, brings rain'],
  ['OCEAN', 'Huge body of salt water'], ['FOREST', 'A wide area full of trees'], ['SUN', 'The star that warms the Earth'], ['APPLE', 'A red or green fruit'],
  ['FRIEND', 'Someone you like and trust'], ['PATIENCE', 'Knowing how to wait'], ['EFFORT', 'Energy you put into a task'], ['HONEST', 'Someone who does not lie'],
  ['DREAM', 'A wish you hope comes true'], ['SUCCESS', 'Reaching your goal'], ['BRAVE', 'Fearless, courageous'], ['TEACHER', 'Gives lessons in class'],
  ['DOCTOR', 'Treats patients'], ['ENGINEER', 'Designs bridges and machines'], ['FARMER', 'Plants and harvests the land'], ['MERCHANT', 'Buys and sells goods'],
  ['MARKET', 'Place with stalls for shopping'], ['HARVEST', 'Time to gather crops'], ['SEED', 'Planted in soil, it sprouts'], ['PLANET', 'Orbits a star'],
  ['ENERGY', 'The ability to do work'], ['MAGNET', 'Pulls iron toward it'], ['ATOM', 'Building block of matter'], ['DICTIONARY', 'Gives the meanings of words'],
  ['POEM', 'Written in verses'], ['NOVEL', 'A long story in book form'], ['MAP', 'A drawing of the world'], ['COMPASS', 'Points north'],
  ['BRIDGE', 'Connects two shores'], ['HEALTH', 'The greatest wealth'], ['COMPUTER', 'A machine that runs code'], ['FOOTBALL', 'Eleven players a side'],
  ['KEEPER', 'Guards the goal'], ['OLIVE', 'Its tree gives oil'], ['CURIOUS', 'Eager to learn'], ['FRIENDSHIP', 'The bond between friends'],
  ['SAVINGS', 'Money put aside'], ['HELPER', 'Someone who supports others'], ['FAMILY', 'Parents, brothers and sisters'], ['RESPECT', 'Esteem and trust'],
  ['EARTHQUAKE', 'Shaking of the ground'], ['THEATER', 'Plays are staged here'], ['PAINTER', 'Paints on canvas'], ['MELODY', 'A tuneful series of notes'],
  ['GARDEN', 'Where flowers and vegetables grow'], ['RIVER', 'Fresh water flowing to the sea'], ['WINTER', 'The coldest season'], ['LIBRARY', 'A building full of books'],
];
// i18n-skip-end
export const WORDS = lang === 'tr' ? TR_WORDS : EN_WORDS; // içerik paketleri genişletir
register({
  id: 'kelime', name: 'Kelime Avı', icon: '🔤',
  how: ['İpucunu oku, karışık harflerden kelimeyi kur.', 'Harflere sırayla dokun; yanlış harfi geri almak için kelimeye dokun.', '50 saniyede olabildiğince çok kelime bul.', '"Pas" hakkın var ama puan kaybettirir.'],
  play(stage, api) {
    return new Promise(resolve => {
      const minL = api.diff < 0.35 ? 4 : api.diff < 0.7 ? 5 : 6;
      const maxL = api.diff < 0.35 ? 6 : api.diff < 0.7 ? 7 : 10;
      // Görülmeyen kelimeler önce gelir (pop sondan alır)
      let pool = api.fresh(WORDS.filter(([w]) => [...w].length >= minL && [...w].length <= maxL)).reverse();
      let solved = 0, passes = 0, over = false;
      const tm = api.timerLoop(50, () => { over = true; resolve(clamp(solved / 6 * 100 - passes * 4, 0, 100)); });
      const next = () => {
        if (!pool.length) pool = api.rng.shuffle(WORDS);
        const item = pool.pop(); api.mark(item);
        const [word, clue] = item;
        const letters = [...word];
        let tiles = api.rng.shuffle(letters.map((l, i) => ({ l, i })));
        if (tiles.map(t => t.l).join('') === word) tiles = tiles.reverse();
        let built = [];
        const ans = h('div.row', { style: { justifyContent: 'center', gap: '6px', minHeight: '54px', flexWrap: 'wrap' } });
        const pad = h('div.row', { style: { justifyContent: 'center', gap: '8px', flexWrap: 'wrap' } });
        const render = () => {
          ans.replaceChildren(...letters.map((_, k) => h('div.cell', { style: { width: '40px', fontSize: '20px', background: built[k] ? '#2d3670' : 'var(--bg2)' }, onclick: () => { if (built[k]) { built = built.slice(0, k); render(); } } }, built[k]?.l || '')));
          pad.replaceChildren(...tiles.map(t => h('button.cell', { style: { width: '46px', fontSize: '22px', opacity: built.includes(t) ? .2 : 1 }, onclick: () => { if (over || built.includes(t)) return; built.push(t); api.sfx.tap(); render(); check(); } }, t.l)));
        };
        const check = () => {
          if (built.length < letters.length) return;
          if (built.map(t => t.l).join('') === word) { solved++; api.good('✔ ' + word); api.setScore(solved); setTimeout(next, 350); }
          else { api.bad('Tekrar dene'); built = []; setTimeout(render, 250); }
        };
        stage.replaceChildren(h('div.col', { style: { gap: '14px' } },
          h('div.qcard', { style: { fontSize: '16px', minHeight: '80px' } }, '🔎 ', clue, h('span.muted', { style: { marginLeft: '6px' } }, `(${letters.length} harf)`)),
          ans, pad,
          btn('Pas geç', () => { passes++; next(); }, 'ghost sm'),
        ));
        render();
      };
      api.setScore(0);
      next();
    });
  },
});

// ————————————————— HAFIZA KARTLARI —————————————————
const EMO = ['⚽', '🎨', '🎹', '📚', '🔬', '🌻', '🚲', '🍎', '🐶', '🐱', '🚀', '🏆', '🎈', '🧩'];
register({
  id: 'hafiza', name: 'Hafıza Kartları', icon: '🃏',
  how: ['Kartları ikişer ikişer aç, eşleri bul.', 'Başta kısa bir süre tüm kartları görürsün (becerin arttıkça daha uzun).', 'Az hamlede bitirmek daha çok puan getirir.'],
  play(stage, api) {
    return new Promise(async resolve => {
      const pairs = api.diff < 0.35 ? 6 : api.diff < 0.7 ? 8 : 10;
      const cols = pairs <= 6 ? 4 : pairs <= 8 ? 4 : 5;
      const deck = api.rng.shuffle([...api.rng.shuffle(EMO).slice(0, pairs)].flatMap(e => [e, e]));
      const state = deck.map(e => ({ e, open: true, done: false }));
      let first = null, lock = true, found = 0, tries = 0, over = false;
      let flip = () => {};
      const cells = state.map((c, i) => h('button.cell', { onclick: () => flip(i) }));
      const render = () => cells.forEach((el, i) => {
        const c = state[i];
        el.textContent = c.open || c.done ? c.e : '';
        el.style.background = c.done ? 'rgba(61,220,151,.18)' : c.open ? 'var(--card2)' : 'linear-gradient(135deg,#3a2f8f,#1f5f73)';
      });
      stage.replaceChildren(h('div.grid-board', { style: { gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: '420px' } }, cells));
      render();
      await sleep(600 + api.ease * 1600);
      state.forEach(c => c.open = false); render(); lock = false;
      const tm = api.timerLoop(45, () => end());
      const end = () => { if (over) return; over = true; tm.stop(); const eff = found ? pairs / Math.max(pairs, tries) : 0; resolve(found / pairs * 70 + eff * 30); };
      flip = i => {
        const c = state[i];
        if (lock || c.open || c.done || over) return;
        c.open = true; api.sfx.tap(); render();
        if (first === null) { first = i; return; }
        tries++;
        const a = state[first];
        if (a.e === c.e) { a.done = c.done = true; found++; api.sfx.good(); first = null; render(); api.setScore(`${found}/${pairs}`); if (found === pairs) end(); }
        else { lock = true; setTimeout(() => { a.open = c.open = false; first = null; lock = false; render(); }, 650); }
      };
      api.setScore(`0/${pairs}`);
    });
  },
});

// ————————————————— DESEN —————————————————
register({
  id: 'desen', name: 'Desen Hafızası', icon: '🎨',
  how: ['Desen kısa bir süre görünür, sonra kaybolur.', 'Aynı deseni hücrelere dokunarak yeniden çiz.', 'İleri turlarda iki renk olur: dokundukça renk değişir.', '4 tur.'],
  play(stage, api) {
    return new Promise(async resolve => {
      const COLORS = ['#7c6cff', '#ffb547'];
      let total = 0;
      api.hideTimer();
      for (let round = 0; round < 4; round++) {
        const n = clamp(4 + Math.floor(api.diff * 1.5 + round / 2), 4, 6);
        const k = clamp(Math.round(n * n * (0.25 + api.diff * 0.12 + round * 0.03)), 4, n * n - 2);
        const twoColor = round >= 2 && api.diff > 0.35;
        const target = new Array(n * n).fill(0);
        api.rng.shuffle([...Array(n * n).keys()]).slice(0, k).forEach(i => target[i] = twoColor && api.rng.chance(0.5) ? 2 : 1);
        const mine = new Array(n * n).fill(0);
        const cells = target.map((_, i) => h('button.cell', { onclick: () => { if (!input) return; mine[i] = (mine[i] + 1) % (twoColor ? 3 : 2); api.sfx.tap(); paint(mine); } }));
        const paint = arr => cells.forEach((c, i) => c.style.background = arr[i] ? COLORS[arr[i] - 1] : 'var(--card)');
        let input = false;
        const info = h('div.center', { style: { fontWeight: 800, margin: '8px 0' } }, `Tur ${round + 1}/4 — ezberle!`);
        const done = btn('Tamam ✔', () => submit(), 'primary block');
        done.style.visibility = 'hidden';
        stage.replaceChildren(h('div.col', {}, info, h('div.grid-board', { style: { gridTemplateColumns: `repeat(${n}, 1fr)`, maxWidth: '380px', gap: '5px' } }, cells), h('div.sp'), done));
        paint(target);
        const show = (1.4 + api.ease * 1.4 - api.diff * 0.5 + k * 0.05) * api.timeMul * 1000;
        const t0 = performance.now();
        await new Promise(r => { const f = () => { const p = 1 - (performance.now() - t0) / show; api.setTimer(p); if (p <= 0) r(); else requestAnimationFrame(f); }; f(); });
        paint(mine); input = true; info.textContent = 'Şimdi çiz'; done.style.visibility = 'visible';
        let submit;
        await new Promise(r => { submit = r; });
        input = false;
        let right = 0, wrong = 0;
        target.forEach((t, i) => { if (t && mine[i] === t) right++; else if (mine[i] && mine[i] !== t) wrong++; });
        const sc = clamp((right - wrong * 0.7) / k, 0, 1);
        total += sc;
        paint(target);
        cells.forEach((c, i) => { if (target[i] && mine[i] !== target[i]) c.style.outline = '3px solid #ff5b7a'; });
        sc >= 0.9 ? api.good('Kusursuz!') : sc >= 0.6 ? api.good('İyi') : api.bad('Hatalar var');
        api.setScore(Math.round(total / (round + 1) * 100) + '%');
        await sleep(900);
      }
      resolve(total / 4 * 100);
    });
  },
});
