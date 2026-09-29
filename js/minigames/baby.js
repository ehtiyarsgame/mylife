// Bebeklik ve okul öncesi oyunları (1–5 yaş): büyük, renkli düğmeler, cömert süre, bol alkış.
// Gerçek bebek oyuncaklarından esinlenildi: şekil kutusu, hayvan sesleri, renk eşleme, sayma, gölge eşleme…
import { register } from './engine.js';
import { h } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';
import { lang } from '../core/i18n.js';
import { whackGame, stackGame, catchGame } from './engines.js';

const TR = () => lang === 'tr';
const pct = v => Math.round(clamp(v, 0, 100));

// Seçmeli bebek oyunu motoru. t.round(rng, i) → { prompt: Node|string, opts: [{ label, style? }], correct }
export function babyPick(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: ['bebek', ...(t.tags || [])], at: t.at,
    how: t.how,
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const rounds = t.rounds || 7;
        let score = 0;
        const cheers = ['Aferin! 👏', 'Süpersin! ⭐', 'Bravo! 🎉', 'Harika! 🌈', 'Yaşasın! 🥳'];
        for (let i = 0; i < rounds; i++) {
          const R = t.round(api.rng, i);
          let tries = 0;
          const ok = await new Promise(res => {
            const buttons = R.opts.map((o, k) => h('button', {
              style: { flex: '1 1 40%', minHeight: '96px', borderRadius: '24px', fontSize: '46px', background: 'linear-gradient(160deg,#2c3470,#1d2350)', border: '3px solid rgba(255,255,255,.15)', transition: 'transform .15s', ...(o.style || {}) },
              onclick: () => {
                if (k === R.correct) { api.sfx.good(); api.vibrate(15); buttons[k].style.transform = 'scale(1.12)'; buttons[k].style.borderColor = '#3ddc97'; setTimeout(() => res(tries === 0 ? 1 : 0.5), 450); }
                else { tries++; api.sfx.bad(); buttons[k].style.transform = 'rotate(-6deg)'; buttons[k].style.opacity = '.35'; setTimeout(() => { buttons[k].style.transform = ''; }, 250); if (tries >= 2) setTimeout(() => res(0), 600); }
              },
            }, o.label));
            stage.replaceChildren(h('div.col', { style: { gap: '18px', margin: 'auto 0' } },
              h('div.center.tiny.muted', {}, `${i + 1} / ${rounds}`),
              h('div.qcard', { style: { minHeight: '130px', flexDirection: 'column', gap: '6px', fontSize: '24px' } }, R.prompt),
              h('div.row', { style: { flexWrap: 'wrap', gap: '12px' } }, buttons)));
          });
          score += ok;
          if (ok) api.good(api.rng.pick(cheers)); else api.feedback('🙂', '#ffd23f');
          api.setScore(`⭐ ${Math.round(score)}`);
          await sleep(450);
        }
        resolve(pct(score / rounds * 105));
      });
    },
  });
}
export const bigE = (e, size = 64, extra = {}) => h('div', { style: { fontSize: size + 'px', lineHeight: 1, ...extra } }, e);
export const opts = (rng, correct, pool, n = 3) => {
  const wrong = rng.shuffle(pool.filter(x => x !== correct)).slice(0, n - 1);
  const list = rng.shuffle([correct, ...wrong]);
  return { opts: list.map(e => ({ label: e })), correct: list.indexOf(correct) };
};

// 1) Hayvan sesleri
// i18n-skip-start
const SOUNDS = [['🐄', 'Mööö!', 'Moo!'], ['🐶', 'Hav hav!', 'Woof woof!'], ['🐱', 'Miyav!', 'Meow!'], ['🐑', 'Meee!', 'Baa!'], ['🐔', 'Gıt gıdak!', 'Cluck cluck!'],
  ['🦆', 'Vak vak!', 'Quack quack!'], ['🦁', 'Kükreee!', 'Roar!'], ['🐝', 'Vızzz!', 'Buzz!'], ['🐸', 'Vrak vrak!', 'Ribbit!'], ['🐴', 'İhaha!', 'Neigh!'], ['🐍', 'Tısss!', 'Hiss!'], ['🦉', 'Hu huu!', 'Hoo hoo!']];
// i18n-skip-end
babyPick({ id: 'hayvan_sesi', name: 'Hayvan Sesleri', icon: '🐮', how: ['Hangi hayvan böyle ses çıkarır?', 'Doğru hayvana dokun!', 'Yanlışsa bir hakkın daha var.'],
  round: (rng) => { const [e, tr, en] = rng.pick(SOUNDS); return { prompt: [bigE('🔊', 36), h('div', { style: { fontSize: '30px', fontWeight: 900 } }, TR() ? tr : en)], ...opts(rng, e, SOUNDS.map(x => x[0])) }; } });

// 2) Gölge eşle — siyah gölgesi hangi nesnenin?
const SHAPES = ['🐘', '🐢', '🦒', '🐇', '🚗', '✈️', '🍎', '🍌', '🏠', '🌳', '⭐', '🎈', '🦋', '🐟', '⚽', '🚲'];
babyPick({ id: 'golge_esle', name: 'Gölge Eşle', icon: '🌑', how: ['Gölgeye iyi bak.', 'Bu gölge kimin? Doğru resme dokun!'],
  round: (rng) => { const e = rng.pick(SHAPES); return { prompt: bigE(e, 86, { filter: 'brightness(0)', opacity: .85 }), ...opts(rng, e, SHAPES) }; } });

// 3) Renk eşle
const COLORS = [['#e53935', ['🍎', '🍓', '🍒', '🚒']], ['#fdd835', ['🍌', '🌻', '🐤', '🧀']], ['#43a047', ['🥦', '🐸', '🥒', '🍀']], ['#1e88e5', ['🫐', '🐳', '💙', '🧢']], ['#fb8c00', ['🍊', '🥕', '🦊', '🎃']]];
babyPick({ id: 'renk_esle', name: 'Renk Eşle', icon: '🎨', how: ['Bu renkte olan hangisi?', 'Doğru renkteki resme dokun!'],
  round: (rng) => {
    const [c, items] = rng.pick(COLORS);
    const right = rng.pick(items);
    const others = rng.shuffle(COLORS.filter(x => x[0] !== c)).slice(0, 2).map(x => rng.pick(x[1]));
    const list = rng.shuffle([right, ...others]);
    return { prompt: h('div', { style: { width: '90px', height: '90px', borderRadius: '50%', background: c, boxShadow: `0 0 30px ${c}` } }), opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
  } });

// 4) Say bakalım
const COUNT_E = ['🍎', '🐥', '⭐', '🎈', '🍪', '🐞', '🌸', '🚗'];
babyPick({ id: 'say_bakalim', name: 'Say Bakalım', icon: '🔢', how: ['Kaç tane var? Say bakalım!', 'Doğru sayıya dokun.'],
  round: (rng, i) => {
    const n = rng.int(1, i < 3 ? 4 : 6), e = rng.pick(COUNT_E);
    const nums = rng.shuffle([...new Set([n, ...rng.shuffle([1, 2, 3, 4, 5, 6].filter(x => x !== n)).slice(0, 2)])]);
    return { prompt: h('div', { style: { fontSize: '40px', letterSpacing: '4px', maxWidth: '260px', textAlign: 'center' } }, e.repeat(n)), opts: nums.map(x => ({ label: String(x), style: { fontWeight: 900 } })), correct: nums.indexOf(n) };
  } });

// 5) Hangisi büyük?
const SIZE_E = ['🐘', '🐭', '🐶', '🐻', '🍉', '🏀', '🐳', '🦕', '🚚', '🌳'];
babyPick({ id: 'buyuk_kucuk', name: 'Büyük mü, Küçük mü?', icon: '🐘', how: ['Hangisi daha BÜYÜK ya da daha KÜÇÜK?', 'Soruyu dinle, doğru olana dokun!'],
  round: (rng) => {
    const e = rng.pick(SIZE_E), bigger = rng.chance(0.5);
    const sizes = rng.shuffle([34, 70]);
    const correct = bigger ? sizes.indexOf(70) : sizes.indexOf(34);
    return { prompt: [bigE(bigger ? '⬆️' : '⬇️', 34), h('div', { style: { fontWeight: 900, fontSize: '24px' } }, bigger ? (TR() ? 'Hangisi BÜYÜK?' : 'Which is BIG?') : (TR() ? 'Hangisi KÜÇÜK?' : 'Which is SMALL?'))], opts: sizes.map(sz => ({ label: e, style: { fontSize: sz + 'px' } })), correct };
  } });

// 6) Şekil kutusu
const SHAPE_HOLES = ['🔺', '🟦', '⭐', '🔵', '❤️', '🔶'];
babyPick({ id: 'sekil_kutusu', name: 'Şekil Kutusu', icon: '🔷', how: ['Elindeki şekil hangi deliğe girer?', 'Aynı şekle dokun!'],
  round: (rng, i) => { const e = rng.pick(SHAPE_HOLES); return { prompt: [bigE('🤲', 30), bigE(e, 70)], ...opts(rng, e, SHAPE_HOLES, i < 3 ? 3 : 4) }; } });

// 7) Resimli kelime (4–5 yaş)
// i18n-skip-start
const WORDS = [['🍎', 'ELMA', 'APPLE'], ['🐱', 'KEDİ', 'CAT'], ['🚗', 'ARABA', 'CAR'], ['🏠', 'EV', 'HOUSE'], ['☀️', 'GÜNEŞ', 'SUN'], ['⚽', 'TOP', 'BALL'],
  ['🐟', 'BALIK', 'FISH'], ['🌳', 'AĞAÇ', 'TREE'], ['🍌', 'MUZ', 'BANANA'], ['🐶', 'KÖPEK', 'DOG'], ['🌙', 'AY', 'MOON'], ['📚', 'KİTAP', 'BOOK']];
// i18n-skip-end
babyPick({ id: 'kelime_resim', name: 'Resimli Kelime', icon: '🔤', how: ['Kelimeyi oku (ya da harflerine bak).', 'Doğru resme dokun!'],
  round: (rng) => { const [e, tr, en] = rng.pick(WORDS); return { prompt: h('div', { style: { fontSize: '36px', fontWeight: 900, letterSpacing: '6px' } }, TR() ? tr : en), ...opts(rng, e, WORDS.map(x => x[0])) }; } });

// 8) Ce-ee! — saklanan bebek yüzü açılınca dokun, uyuyan bebeği uyandırma
whackGame({ id: 'ce_ee', name: 'Ce-ee!', icon: '🙈', good: '😄', bad: '😴', hole: '🙈', holeBg: '#3a2a50',
  how: ['Eller açılıp gülen yüz 😄 görününce dokun: Ce-ee!', 'Uyuyan bebeğe 😴 dokunma, uyanmasın!', '25 saniye.'], tags: ['bebek', 'sosyal'] });
// 9) Baloncuk patlat
whackGame({ id: 'baloncuk', name: 'Baloncuk Patlat', icon: '🫧', good: '🫧', bad: '🐝', hole: '', holeBg: '#20355a',
  how: ['Baloncuklar 🫧 çıktıkça patlat!', 'Arıya 🐝 dokunma, vızzz!', '25 saniye.'], tags: ['bebek'] });
// 10) Küp kule
stackGame({ id: 'kup_kule', name: 'Küp Kule', icon: '🧸', colors: ['#ff8a80', '#ffd180', '#b9f6ca', '#80d8ff', '#ea80fc'], bg: '#231d3a', tags: ['bebek'] });
// 11) Top yakala
catchGame({ id: 'top_yakala', name: 'Top Yakala', icon: '⚽', basket: '🧺', good: ['⚽', '🏀', '🎾', '🎈'], bad: ['💧'], bg: '#2a4a2a', tags: ['bebek', 'spor'] });
