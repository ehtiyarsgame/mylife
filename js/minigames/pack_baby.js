// Bebeklik ve okul öncesi (1–5 yaş) ek oyunları: eşleştir, say, duyguları tanı, sırayı bul, yıka, çiz…
// Metinler iki dilli (B). Oyunlar "at" ile bebek eylemlerinin havuzuna girer; aynı oyun üst üste gelmez.
import { h } from '../ui/dom.js';
import { B, lang } from '../core/i18n.js';
import { babyPick, bigE, opts } from './baby.js';
import { catchGame, whackGame, stackGame, pairGame } from './engines.js';
import { memoryGame, dodgeGame, mazeGame, rhythmGame } from './engines3.js';
import { popGame, spotGame, shellGame, cleanGame, traceGame } from './engines4.js';

const TR = () => lang === 'tr';
const big = (t, s = 30) => h('div', { style: { fontSize: s + 'px', fontWeight: 900, textAlign: 'center' } }, t);
const OY = ['oyuncak'], AI = ['ce_ee_oyun'], ZK = ['zeka_oyun'], MZ = ['muzik_bebek'], TP = ['top_bebek'], MS = ['masal'];

// i18n-skip-start
// 1) Kim ne verir?
const GIVES = [['🐄', '🥛'], ['🐔', '🥚'], ['🐝', '🍯'], ['🐑', '🧶'], ['🌳', '🍎'], ['🌻', '🌰'], ['🐟', '🫧']];
babyPick({ id: 'kim_ne_verir', name: B('Kim Ne Verir?', 'Who Gives What?'), icon: '🐄', at: [...ZK, ...AI],
  how: [B('Hayvana ya da bitkiye bak.', 'Look at the animal or plant.'), B('Bize ne verdiğini bul!', 'Find what it gives us!')],
  round: rng => { const [a, b] = rng.pick(GIVES.slice(0, 6)); return { prompt: [bigE(a, 70), big('➡️ ❓', 26)], ...opts(rng, b, GIVES.slice(0, 6).map(x => x[1])) }; } });

// 2) Nerede yaşar?
const HOMES = [['🐟', '🌊'], ['🐫', '🏜️'], ['🐧', '🧊'], ['🐒', '🌴'], ['🐄', '🌾'], ['🐦', '🪺'], ['🐝', '🌸'], ['🐻', '🌲']];
babyPick({ id: 'nerede_yasar', name: B('Nerede Yaşar?', 'Where Does It Live?'), icon: '🏠', at: [...ZK, ...MS],
  how: [B('Hayvanın evini bul.', 'Find the animal\'s home.'), B('Doğru yere dokun!', 'Tap the right place!')],
  round: rng => { const [a, b] = rng.pick(HOMES); return { prompt: [bigE(a, 70), big('🏠 ❓', 26)], ...opts(rng, b, HOMES.map(x => x[1])) }; } });

// 3) Hava nasıl, ne giyelim?
const WEAR = [['☀️', ['🕶️', '🩳', '👒']], ['🌧️', ['☂️', '🥾']], ['❄️', ['🧤', '🧣', '🥾']], ['🏖️', ['🩱', '🕶️']]];
babyPick({ id: 'ne_giyelim', name: B('Ne Giyelim?', 'What Shall We Wear?'), icon: '🧥', at: [...AI, ...ZK],
  how: [B('Havaya bak.', 'Look at the weather.'), B('Bu havada ne giyilir? Dokun!', 'What do we wear today? Tap it!')],
  round: rng => {
    const [w, good] = rng.pick(WEAR); const right = rng.pick(good);
    const wrong = rng.shuffle(WEAR.filter(x => x[0] !== w).flatMap(x => x[1]).filter(x => !good.includes(x))).slice(0, 2);
    const list = rng.shuffle([right, ...wrong]);
    return { prompt: bigE(w, 80), opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
  } });

// 4) Kim ne sever?
const LOVES = [['🐶', '🦴'], ['🐰', '🥕'], ['🐭', '🧀'], ['🐵', '🍌'], ['🐱', '🐟'], ['🐼', '🎋'], ['🐿️', '🌰'], ['🐦', '🪱']];
babyPick({ id: 'kim_ne_sever', name: B('Kim Ne Sever?', 'Who Loves What?'), icon: '🐰', at: [...AI, ...OY],
  how: [B('Hayvan acıkmış!', 'The animal is hungry!'), B('En sevdiği yemeği bul.', 'Find its favourite food.')],
  round: rng => { const [a, b] = rng.pick(LOVES); return { prompt: [bigE(a, 70), big('😋 ❓', 26)], ...opts(rng, b, LOVES.map(x => x[1])) }; } });

// 5) Nokta say
babyPick({ id: 'nokta_say', name: B('Kaç Nokta?', 'How Many Dots?'), icon: '🎲', at: ZK,
  how: [B('Sayıya bak.', 'Look at the number.'), B('O kadar nokta olan kartı bul!', 'Find the card with that many dots!')],
  round: (rng, i) => {
    const n = rng.int(1, i < 3 ? 3 : 5);
    const nums = rng.shuffle([n, ...rng.shuffle([1, 2, 3, 4, 5].filter(x => x !== n)).slice(0, 2)]);
    return { prompt: big(String(n), 72), opts: nums.map(x => ({ label: '●'.repeat(x), style: { fontSize: '26px', color: '#ffd166' } })), correct: nums.indexOf(n) };
  } });

// 6) Hangisi çok?
const MANY = ['🍎', '🐥', '⭐', '🎈', '🐟', '🌸'];
babyPick({ id: 'hangisi_cok', name: B('Hangisi Çok?', 'Which Has More?'), icon: '⚖️', at: ZK,
  how: [B('İki grup var.', 'There are two groups.'), B('Daha ÇOK olan gruba dokun!', 'Tap the group with MORE!')],
  round: rng => {
    const e = rng.pick(MANY); const a = rng.int(1, 5); let b; do b = rng.int(1, 6); while (b === a);
    return { prompt: big(TR() ? 'Hangisi ÇOK?' : 'Which has MORE?', 24), opts: [a, b].map(x => ({ label: e.repeat(x), style: { fontSize: '24px', letterSpacing: '2px' } })), correct: a > b ? 0 : 1 };
  } });

// 7) Şekli bul
const SHP = [['DAİRE', 'CIRCLE', '🔵'], ['KARE', 'SQUARE', '🟦'], ['ÜÇGEN', 'TRIANGLE', '🔺'], ['YILDIZ', 'STAR', '⭐'], ['KALP', 'HEART', '❤️'], ['BAKLAVA', 'DIAMOND', '🔶']];
babyPick({ id: 'sekli_bul', name: B('Şekli Bul', 'Find the Shape'), icon: '🔺', at: [...ZK, ...OY],
  how: [B('Şeklin adını oku (ya da dinle).', 'Read (or hear) the shape\'s name.'), B('Doğru şekle dokun!', 'Tap the right shape!')],
  round: rng => { const [tr, en, e] = rng.pick(SHP); return { prompt: big(TR() ? tr : en, 30), ...opts(rng, e, SHP.map(x => x[2])) }; } });

// 8) Duygular
const FEEL = [['MUTLU', 'HAPPY', '😄'], ['ÜZGÜN', 'SAD', '😢'], ['KIZGIN', 'ANGRY', '😠'], ['ŞAŞKIN', 'SURPRISED', '😲'], ['UYKULU', 'SLEEPY', '😴'], ['KORKMUŞ', 'SCARED', '😨']];
babyPick({ id: 'duygular', name: B('Nasıl Hissediyor?', 'How Do They Feel?'), icon: '😊', at: [...AI, ...MS],
  how: [B('Duyguyu oku.', 'Read the feeling.'), B('O yüzü bul!', 'Find that face!')],
  round: rng => { const [tr, en, e] = rng.pick(FEEL); return { prompt: big(TR() ? tr : en, 30), ...opts(rng, e, FEEL.map(x => x[2]), 4) }; } });

// 9) Taşıt sesleri
const VEH = [['🚂', 'Çuf çuf!', 'Choo choo!'], ['🚑', 'Dan dun dan dun!', 'Nee-naw!'], ['🚲', 'Zırr zırr!', 'Ring ring!'], ['🚢', 'Düüüt!', 'Toooot!'], ['✈️', 'Vıııın!', 'Whoosh!'], ['🚗', 'Bip bip!', 'Beep beep!']];
babyPick({ id: 'tasit_sesi', name: B('Taşıt Sesleri', 'Vehicle Sounds'), icon: '🚂', at: [...AI, ...MZ],
  how: [B('Bu ses hangi taşıtın?', 'Which vehicle makes this sound?'), B('Doğru taşıta dokun!', 'Tap the right vehicle!')],
  round: rng => { const [e, tr, en] = rng.pick(VEH); return { prompt: [bigE('🔊', 34), big(TR() ? tr : en, 28)], ...opts(rng, e, VEH.map(x => x[0])) }; } });

// 10) Sonra ne olur?
const NEXT = [['🥚', '🐣'], ['🐛', '🦋'], ['🌱', '🌻'], ['🧊', '💧'], ['🌰', '🌳'], ['🌧️', '🌈'], ['🍞', '🥪'], ['🎂', '🎉']];
babyPick({ id: 'sonra_ne', name: B('Sonra Ne Olur?', 'What Happens Next?'), icon: '🐣', at: [...ZK, ...MS],
  how: [B('Resme bak.', 'Look at the picture.'), B('Bundan sonra ne olur? Bul!', 'What comes next? Find it!')],
  round: rng => { const [a, b] = rng.pick(NEXT); return { prompt: [bigE(a, 70), big('➡️ ❓', 26)], ...opts(rng, b, NEXT.map(x => x[1])) }; } });

// 11) Renkleri öğren
const RNK = [['KIRMIZI', 'RED', '🔴'], ['TURUNCU', 'ORANGE', '🟠'], ['SARI', 'YELLOW', '🟡'], ['YEŞİL', 'GREEN', '🟢'], ['MAVİ', 'BLUE', '🔵'], ['MOR', 'PURPLE', '🟣'], ['KAHVE', 'BROWN', '🟤'], ['SİYAH', 'BLACK', '⚫']];
babyPick({ id: 'renk_ogren', name: B('Renkleri Öğren', 'Learn the Colours'), icon: '🌈', at: [...OY, ...ZK],
  how: [B('Rengin adını oku.', 'Read the colour name.'), B('O renge dokun!', 'Tap that colour!')],
  round: (rng, i) => { const [tr, en, e] = rng.pick(RNK); return { prompt: big(TR() ? tr : en, 30), ...opts(rng, e, RNK.map(x => x[2]), i < 3 ? 3 : 4) }; } });

// 12) İlk harf (4–5 yaş)
const FIRST = [['🍎', 'ELMA', 'APPLE'], ['🐝', 'ARI', 'BEE'], ['🐱', 'KEDİ', 'CAT'], ['🐶', 'KÖPEK', 'DOG'], ['🥚', 'YUMURTA', 'EGG'], ['🐟', 'BALIK', 'FISH'], ['🎁', 'HEDİYE', 'GIFT'], ['🏠', 'EV', 'HOUSE'], ['🐸', 'KURBAĞA', 'FROG'], ['🌙', 'AY', 'MOON'], ['☀️', 'GÜNEŞ', 'SUN'], ['🦁', 'ASLAN', 'LION']];
babyPick({ id: 'ilk_harf', name: B('İlk Harf', 'First Letter'), icon: '🔤', at: MS,
  how: [B('Resmin adı hangi harfle başlar?', 'Which letter does the picture\'s name start with?'), B('Harfe dokun!', 'Tap the letter!')],
  round: rng => {
    const w = rng.pick(FIRST); const word = TR() ? w[1] : w[2]; const L = word[0];
    const pool = [...new Set(FIRST.map(x => (TR() ? x[1] : x[2])[0]))];
    const r = opts(rng, L, pool);
    return { prompt: bigE(w[0], 80), opts: r.opts.map(o => ({ ...o, style: { fontWeight: 900 } })), correct: r.correct };
  } });

// 13) Örüntü: sıradaki ne?
const PAT = ['🔴', '🔵', '🟡', '🟢', '⭐', '🌙', '🍎', '🍌'];
babyPick({ id: 'oruntu_bebek', name: B('Sıradaki Ne?', 'What Comes Next?'), icon: '🔁', at: ZK,
  how: [B('Dizideki düzene bak: kırmızı, mavi, kırmızı…', 'Look at the pattern: red, blue, red…'), B('Boşluğa ne gelir? Bul!', 'What goes in the gap? Find it!')],
  round: (rng, i) => {
    const [a, b, c] = rng.shuffle(PAT.slice()).slice(0, 3);
    const unit = i < 3 ? [a, b] : [a, b, c];
    const seq = Array.from({ length: unit.length * 2 + 1 }, (_, k) => unit[k % unit.length]);
    const ans = seq.pop();
    return { prompt: big(seq.join(' ') + ' ❓', 30), ...opts(rng, ans, [a, b, c, rng.pick(PAT)]) };
  } });

// 14) Vücudumuz
const BODY = [['GÖZ', 'EYE', '👁️'], ['KULAK', 'EAR', '👂'], ['BURUN', 'NOSE', '👃'], ['EL', 'HAND', '✋'], ['AYAK', 'FOOT', '🦶'], ['DİŞ', 'TOOTH', '🦷'], ['DİL', 'TONGUE', '👅']];
babyPick({ id: 'vucudumuz', name: B('Vücudumuz', 'Our Body'), icon: '👃', at: [...AI, ...MS],
  how: [B('Uzvun adını oku.', 'Read the body part.'), B('Doğru resme dokun!', 'Tap the right picture!')],
  round: rng => { const [tr, en, e] = rng.pick(BODY); return { prompt: big(TR() ? tr : en, 30), ...opts(rng, e, BODY.map(x => x[2])) }; } });

// 15) Kim kullanır?
const USES = [['🧑‍🚒', '🚒'], ['🧑‍🍳', '🍳'], ['🧑‍⚕️', '🩺'], ['👮', '🚓'], ['🧑‍🌾', '🚜'], ['🧑‍🏫', '📚'], ['🧑‍🚀', '🚀'], ['🧑‍🎨', '🎨']];
babyPick({ id: 'kim_kullanir', name: B('Kim Kullanır?', 'Who Uses It?'), icon: '🧑‍🚒', at: [...ZK, ...MS],
  how: [B('Bu kişi hangi eşyayı kullanır?', 'Which thing does this person use?'), B('Doğru eşyaya dokun!', 'Tap the right thing!')],
  round: rng => { const [a, b] = rng.pick(USES); return { prompt: bigE(a, 76), ...opts(rng, b, USES.map(x => x[1])) }; } });

// 16) Sıcak mı soğuk mu?
const HOT = ['🔥', '☕', '🌞', '🍲', '🌋'], COLD = ['🧊', '🍦', '⛄', '❄️', '🐧'];
babyPick({ id: 'sicak_soguk', name: B('Sıcak mı, Soğuk mu?', 'Hot or Cold?'), icon: '🌡️', at: [...ZK, ...AI],
  how: [B('Soruyu oku: SICAK mı soruyor, SOĞUK mu?', 'Read the question: is it asking for HOT or COLD?'), B('Doğru olana dokun.', 'Tap the right one.')],
  round: rng => {
    const hot = rng.chance(0.5); const [g, bd] = hot ? [HOT, COLD] : [COLD, HOT];
    const right = rng.pick(g); const list = rng.shuffle([right, ...rng.shuffle(bd.slice()).slice(0, 2)]);
    return { prompt: [bigE(hot ? '🥵' : '🥶', 50), big(hot ? (TR() ? 'Hangisi SICAK?' : 'Which is HOT?') : (TR() ? 'Hangisi SOĞUK?' : 'Which is COLD?'), 24)], opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
  } });

// 17) Gece mi gündüz mü?
const NIGHT = ['🦉', '🌙', '⭐', '🛌', '🦇'], DAY = ['🌞', '🐓', '🏖️', '🌻', '🦋'];
babyPick({ id: 'gece_gunduz', name: B('Gece mi, Gündüz mü?', 'Night or Day?'), icon: '🌗', at: [...MS, ...ZK],
  how: [B('Gökyüzüne bak: gece mi, gündüz mü?', 'Look at the sky: is it night or day?'), B('O zamana uyanı bul!', 'Find what fits that time!')],
  round: rng => {
    const night = rng.chance(0.5); const [g, bd] = night ? [NIGHT, DAY] : [DAY, NIGHT];
    const right = rng.pick(g.slice(1)); const list = rng.shuffle([right, ...rng.shuffle(bd.slice(1)).slice(0, 2)]);
    return { prompt: bigE(night ? '🌃' : '🏞️', 80), opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
  } });

// 18) Meyveyi bul (adıyla)
const FRUIT = [['ELMA', 'APPLE', '🍎'], ['MUZ', 'BANANA', '🍌'], ['ÜZÜM', 'GRAPES', '🍇'], ['ÇİLEK', 'STRAWBERRY', '🍓'], ['KARPUZ', 'WATERMELON', '🍉'], ['PORTAKAL', 'ORANGE', '🍊'], ['ARMUT', 'PEAR', '🍐'], ['KİRAZ', 'CHERRIES', '🍒']];
babyPick({ id: 'meyve_bul', name: B('Meyveyi Bul', 'Find the Fruit'), icon: '🍇', at: [...MS, ...OY],
  how: [B('Meyvenin adını oku.', 'Read the fruit\'s name.'), B('O meyveye dokun!', 'Tap that fruit!')],
  round: rng => { const [tr, en, e] = rng.pick(FRUIT); return { prompt: big(TR() ? tr : en, 28), ...opts(rng, e, FRUIT.map(x => x[2])) }; } });
// i18n-skip-end

// ——— Diğer motorlarla bebek oyunları ———
memoryGame({ id: 'hayvan_kartlari', name: B('Hayvan Kartları', 'Animal Cards'), icon: '🐼', at: [...ZK, ...OY], tags: ['bebek'], back: '🎁', bg: '#3a2f6a', items: ['🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🐸', '🐵', '🐧'] });
memoryGame({ id: 'oyuncak_kartlari', name: B('Oyuncak Kartları', 'Toy Cards'), icon: '🧸', at: OY, tags: ['bebek'], back: '📦', bg: '#2d4a6a', items: ['🧸', '🪀', '🎈', '🚂', '🪁', '🎲', '🧩', '🪆', '🚗'] });
popGame({ id: 'balon_patlat', name: B('Balon Şenliği', 'Balloon Party'), icon: '🎈', at: [...OY, ...AI], tags: ['bebek'],
  rules: [[B('🐾 HAYVANLARI patlat!', '🐾 Pop the ANIMALS!'), ['🐶', '🐱', '🐰', '🐻', '🐸'], ['🍎', '🚗', '⚽', '🌸', '⭐']],
    [B('🍎 MEYVELERİ patlat!', '🍎 Pop the FRUIT!'), ['🍎', '🍌', '🍇', '🍓', '🍊'], ['🐶', '🚗', '⚽', '🧸', '🌙']],
    [B('🚗 TAŞITLARI patlat!', '🚗 Pop the VEHICLES!'), ['🚗', '🚌', '🚂', '✈️', '🚲'], ['🍎', '🐶', '⭐', '🌸', '🧸']],
    [B('⭐ YILDIZLARI patlat!', '⭐ Pop the STARS!'), ['⭐', '🌟'], ['🌙', '☀️', '☁️', '🍎', '🐱']]] });
spotGame({ id: 'ayicik_nerede', name: B('Ayıcık Nerede?', 'Where Is Teddy?'), icon: '🧸', at: [...OY, ...AI], tags: ['bebek'], bg: '#3a2a50',
  targets: ['🧸', '🦆', '🚂', '🪀'], noise: ['🎈', '🧩', '🎲', '⚽', '🪁', '🧃', '🍪', '🧦', '👟', '📚', '🖍️', '🪆'] });
shellGame({ id: 'top_nerede', name: B('Top Nerede?', 'Where Is the Ball?'), icon: '⚽', at: [...AI, ...ZK, ...TP], tags: ['bebek'], cup: '🧺', item: '⚽' });
cleanGame({ id: 'oyuncak_yika', name: B('Oyuncakları Yıka', 'Wash the Toys'), icon: '🛁', at: [...OY, ...AI], tags: ['bebek'], dirt: '#8a6a45', dirtName: 'çamuru', dirtNameEn: 'mud', spots: ['🫧'], under: '#dff3ff', reveal: ['🧸', '🦆', '🐶', '🚗', '🐰', '🪀'] });
traceGame({ id: 'cizgi_ciz', name: B('Çizgi Çiz', 'Draw the Line'), icon: '🖍️', at: [...OY, ...MS], tags: ['bebek'], shapes: ['daire', 'kare', 'ucgen', 'kalp', 'dalga'], ink: '#ff6b8b' });
rhythmGame({ id: 'minik_davulcu', name: B('Minik Davulcu', 'Little Drummer'), icon: '🥁', at: MZ, tags: ['bebek', 'muzik'], notes: ['🥁', '🎵', '⭐'], keys: ['🥁', '🔔', '🎹'] });
rhythmGame({ id: 'hayvan_korosu', name: B('Hayvan Korosu', 'Animal Choir'), icon: '🐸', at: MZ, tags: ['bebek', 'muzik'], notes: ['🐸', '🐤', '🐱'], keys: ['🐸', '🐤', '🐱'], bg: '#163a2a' });
catchGame({ id: 'elma_topla', name: B('Elma Topla', 'Apple Picking'), icon: '🍎', at: [...TP, ...OY], tags: ['bebek'], basket: '🧺', good: ['🍎', '🍏', '🍐'], bad: ['🐛'], bg: '#2a4a2a' });
catchGame({ id: 'kar_tanesi', name: B('Kar Tanesi Yakala', 'Catch Snowflakes'), icon: '❄️', at: [...TP, ...AI], tags: ['bebek'], basket: '🧤', good: ['❄️', '⛄'], bad: ['🪨'], bg: '#1d3050', sway: true });
whackGame({ id: 'kostebek_bebek', name: B('Köstebek Ce-ee', 'Peekaboo Mole'), icon: '🐹', at: [...AI, ...OY], tags: ['bebek'], good: '🐹', bad: '🦔', hole: '🕳️', holeBg: '#3b2a1c' });
whackGame({ id: 'kelebek_yakala', name: B('Kelebek Yakala', 'Catch the Butterfly'), icon: '🦋', at: TP, tags: ['bebek'], good: '🦋', bad: '🐝', hole: '🌼', holeBg: '#24502c' });
dodgeGame({ id: 'yagmur_kac', name: B('Yağmurdan Kaç', 'Dodge the Rain'), icon: '🐥', at: TP, tags: ['bebek'], player: '🐥', bad: ['💧'], good: ['🌞', '🌈'], bg: '#27405e' });
stackGame({ id: 'lego_kule', name: B('Lego Kule', 'Block Tower'), icon: '🧱', at: OY, tags: ['bebek'], colors: ['#ff5b5b', '#ffd23f', '#3ddc97', '#4d8dff', '#b36bff'], bg: '#231d3a' });
pairGame({ id: 'yavru_esle', name: B('Anne ve Yavru', 'Mum and Baby'), icon: '🐣', at: [...ZK, ...AI], tags: ['bebek'], hint: B('Kim kimin yavrusu?', 'Whose baby is it?'),
  pairs: [['🐔', '🐣'], ['🦋', '🐛'], ['🐕', '🐶'], ['🐈', '🐱'], ['🦆', '🐥'], ['🌳', '🌱'], ['🐸', '🥚']] });
mazeGame({ id: 'fare_peynir', name: B('Fare ve Peynir', 'Mouse and Cheese'), icon: '🐭', at: ZK, tags: ['bebek'], player: '🐭', goal: '🧀', wall: '#ffd166', bg: '#2a2340' });
