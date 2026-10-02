// İçerik genişletme 2: anne–yavru oyunu baştan, bebek seçme oyunlarının küçük listeleri büyütüldü,
// eşleştirme oyunlarına sütun başlıkları ve çok sayıda yeni çift, sıralama/kıyas oyunlarına yeni setler.
import { h } from '../ui/dom.js';
import { B, lang } from '../core/i18n.js';
import { extend, getGame } from './engine.js';
import { babyPick } from './baby.js';

const TR = lang === 'tr';
const L = (tr, en) => (TR ? tr : en);
const big = (t, s = 26) => h('div', { style: { fontSize: s + 'px', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 } }, t);
const emo = (e, s = 70, extra = {}) => h('div', { style: { fontSize: s + 'px', lineHeight: 1, ...extra } }, e);
const cap = (w) => w.toLocaleUpperCase(TR ? 'tr-TR' : 'en-US');
function choice(rng, right, wrongPool, n = 3, key = x => x) {
  const seen = new Set([key(right)]);
  const wr = [];
  for (const w of rng.shuffle(wrongPool.slice())) { if (wr.length >= n - 1) break; if (!seen.has(key(w))) { seen.add(key(w)); wr.push(w); } }
  const list = rng.shuffle([right, ...wr]);
  return { list, correct: list.indexOf(right) };
}
const has = (id) => !!getGame(id);
const k0 = x => (typeof x === 'string' ? x : Array.isArray(x) ? (typeof x[0] === 'string' ? x[0] : JSON.stringify(x[0])) : JSON.stringify(x));
const ext = (id, add) => {
  if (!has(id)) return;
  const sp = getGame(id).spec, out = {};
  for (const k in add) {
    if (Array.isArray(add[k]) && Array.isArray(sp[k])) { const seen = new Set(sp[k].map(k0)); out[k] = add[k].filter(x => { const kk = k0(x); if (seen.has(kk)) return false; seen.add(kk); return true; }); }
    else out[k] = add[k];
  }
  extend(id, out);
};
// İki dilli çift / öğe yardımcıları
const P2 = list => list.map(([a, b, c, d]) => [B(a, b), B(c, d)]);
const I2 = list => list.map(([a, b, k]) => [B(a, b), k]);
const S2 = (title, steps) => [B(title[0], title[1]), steps.map(([a, b]) => B(a, b))];
const V2 = list => list.map(([a, b, v]) => [B(a, b), v]);

// i18n-skip-start
// ———————————————————— 1) KİMİN YAVRUSU? ————————————————————
// [anne emojisi, anne TR, anne EN, yavru TR, yavru EN, yavru emojisi (yoksa anne emojisi küçük çizilir), TR'de özel adı var mı]
const YOUNG = [
  ['🐄', 'İnek', 'Cow', 'Buzağı', 'Calf', null, 1], ['🐎', 'At', 'Horse', 'Tay', 'Foal', null, 1], ['🐑', 'Koyun', 'Sheep', 'Kuzu', 'Lamb', null, 1],
  ['🐐', 'Keçi', 'Goat', 'Oğlak', 'Kid', null, 1], ['🐕', 'Köpek', 'Dog', 'Enik', 'Puppy', '🐶', 1], ['🐈', 'Kedi', 'Cat', 'Yavru kedi', 'Kitten', '🐱', 0],
  ['🐔', 'Tavuk', 'Hen', 'Civciv', 'Chick', '🐣', 1], ['🦆', 'Ördek', 'Duck', 'Palaz', 'Duckling', '🐥', 1], ['🐫', 'Deve', 'Camel', 'Köşek', 'Camel calf', null, 1],
  ['🫏', 'Eşek', 'Donkey', 'Sıpa', 'Donkey foal', null, 1], ['🐃', 'Manda', 'Water buffalo', 'Malak', 'Buffalo calf', null, 1], ['🐸', 'Kurbağa', 'Frog', 'İribaş', 'Tadpole', null, 1],
  ['🦋', 'Kelebek', 'Butterfly', 'Tırtıl', 'Caterpillar', '🐛', 1], ['🐻', 'Ayı', 'Bear', 'Ayı yavrusu', 'Bear cub', null, 0], ['🦁', 'Aslan', 'Lion', 'Aslan yavrusu', 'Lion cub', null, 0],
  ['🐅', 'Kaplan', 'Tiger', 'Kaplan yavrusu', 'Tiger cub', null, 0], ['🐖', 'Domuz', 'Pig', 'Domuz yavrusu', 'Piglet', '🐷', 0], ['🦢', 'Kuğu', 'Swan', 'Kuğu yavrusu', 'Cygnet', null, 0],
  ['🪿', 'Kaz', 'Goose', 'Kaz yavrusu', 'Gosling', null, 0], ['🦘', 'Kanguru', 'Kangaroo', 'Kanguru yavrusu', 'Joey', null, 0], ['🦌', 'Geyik', 'Deer', 'Geyik yavrusu', 'Fawn', null, 0],
  ['🦉', 'Baykuş', 'Owl', 'Baykuş yavrusu', 'Owlet', null, 0], ['🦅', 'Kartal', 'Eagle', 'Kartal yavrusu', 'Eaglet', null, 0], ['🦭', 'Fok', 'Seal', 'Fok yavrusu', 'Seal pup', null, 0],
  ['🐇', 'Tavşan', 'Rabbit', 'Tavşan yavrusu', 'Bunny', '🐰', 0], ['🐺', 'Kurt', 'Wolf', 'Kurt yavrusu', 'Wolf pup', null, 0], ['🐘', 'Fil', 'Elephant', 'Fil yavrusu', 'Elephant calf', null, 0],
  ['🦒', 'Zürafa', 'Giraffe', 'Zürafa yavrusu', 'Giraffe calf', null, 0], ['🐋', 'Balina', 'Whale', 'Balina yavrusu', 'Whale calf', null, 0], ['🦊', 'Tilki', 'Fox', 'Tilki yavrusu', 'Fox kit', null, 0],
  ['🐧', 'Penguen', 'Penguin', 'Penguen yavrusu', 'Penguin chick', null, 0], ['🐨', 'Koala', 'Koala', 'Koala yavrusu', 'Koala joey', null, 0], ['🦓', 'Zebra', 'Zebra', 'Zebra yavrusu', 'Zebra foal', null, 0],
  ['🐒', 'Maymun', 'Monkey', 'Maymun yavrusu', 'Baby monkey', null, 0], ['🦔', 'Kirpi', 'Hedgehog', 'Kirpi yavrusu', 'Hoglet', null, 0], ['🐿️', 'Sincap', 'Squirrel', 'Sincap yavrusu', 'Squirrel kit', null, 0],
  ['🦃', 'Hindi', 'Turkey', 'Hindi palazı', 'Poult', null, 1], ['🐟', 'Balık', 'Fish', 'Yavru balık', 'Fry', null, 0], ['🐝', 'Arı', 'Bee', 'Arı larvası', 'Bee larva', null, 0],
  ['🐼', 'Panda', 'Panda', 'Panda yavrusu', 'Panda cub', null, 0], ['🦛', 'Su aygırı', 'Hippo', 'Su aygırı yavrusu', 'Hippo calf', null, 0], ['🐬', 'Yunus', 'Dolphin', 'Yunus yavrusu', 'Dolphin calf', null, 0],
];
const yName = y => L(y[3], y[4]);
const mName = y => L(y[1], y[2]);
// Yavru: küçük çizilir + biberon rozeti; anne: büyük
const babyCard = (y, size = 40) => h('div', { style: { position: 'relative', display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center', width: (size + 26) + 'px', height: (size + 16) + 'px' } },
  emo(y[5] || y[0], size), h('div', { style: { position: 'absolute', right: 0, top: 0, fontSize: '18px' } }, '🍼'));
const tag = (t, c = '#ffd27a') => h('div', { style: { fontSize: '13px', fontWeight: 900, color: c, letterSpacing: '.5px' } }, t);
const optLbl = (e, name, sz = 40) => ({ label: h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' } }, typeof e === 'string' ? emo(e, sz) : e, h('div', { style: { fontSize: '14px', fontWeight: 800 } }, name)), style: { fontSize: '16px', minHeight: '104px' } });

// Küçükler için: yavru (küçük resim + adı) → annesini bul; ya da anne → yavrusunu bul. Her zaman resim + isim birlikte.
babyPick({ id: 'kimin_yavrusu', name: B('Kimin Yavrusu?', 'Whose Baby?'), icon: '🍼', at: ['zeka_oyun', 'ce_ee_oyun', 'masal', 'kitap'], ages: [1, 9], rounds: 8,
  how: [B('🍼 Biberonlu küçük resim YAVRUDUR, büyük resim ANNEDİR.', '🍼 The small picture with a bottle is the BABY, the big one is the MUM.'),
    B('Yavrunun annesini ya da annenin yavrusunu bul.', 'Find the baby\'s mum, or the mum\'s baby.'), B('Her yavrunun bir adı var: kuzu, buzağı, tay…', 'Every baby has a name: lamb, calf, foal…')],
  round: (rng, i) => {
    const pool = i < 3 ? YOUNG.slice(0, 13) : YOUNG;
    const y = rng.pick(pool);
    const c = choice(rng, y, pool, i < 3 ? 3 : 4, x => x[0]);
    if (i % 2 === 0) {
      return { prompt: [tag(L('YAVRU', 'BABY')), babyCard(y, 46), big(yName(y), 22), tag(L('Annesi hangisi?', 'Who is its mum?'), '#9ad0ff')],
        opts: c.list.map(x => optLbl(x[0], mName(x), 44)), correct: c.correct };
    }
    return { prompt: [tag(L('ANNE', 'MUM')), emo(y[0], 72), big(mName(y), 22), tag(L('Yavrusu hangisi?', 'Which one is its baby?'), '#9ad0ff')],
      opts: c.list.map(x => optLbl(babyCard(x, 30), yName(x))), correct: c.correct };
  } });

// Büyükler için: yavru adları (iki yönlü, isimle)
babyPick({ id: 'yavru_adi', name: B('Yavrusunun Adı Ne?', 'What\'s the Baby Called?'), icon: '🐣', at: ['fen', 'kitap', 'tarla', 'job:ciftci', 'job:veteriner'], ages: [7, 99], rounds: 10,
  how: [B('Bazı hayvanların yavrusunun özel bir adı vardır: inek → buzağı, at → tay.', 'Many animals have a special name for their young: cow → calf, horse → foal.'),
    B('Soruya göre yavrunun adını ya da annesini bul.', 'Find the baby\'s name or its mother.')],
  round: (rng, i) => {
    const pool = TR ? YOUNG.filter(y => y[6]) : YOUNG.filter(y => !['Bunny', 'Fry'].includes(y[4]));
    const y = rng.pick(pool);
    const others = pool.filter(x => yName(x) !== yName(y));
    const c = choice(rng, y, others, 4, x => x[0]);
    const txt = x => ({ label: x, style: { fontSize: '17px', fontWeight: 800, minHeight: '64px' } });
    if (i % 2 === 0) return { prompt: [emo(y[0], 64), big(mName(y), 24), tag(L('Yavrusunun adı ne?', 'What is its baby called?'), '#9ad0ff')], opts: c.list.map(x => txt(yName(x))), correct: c.correct };
    return { prompt: [emo('🍼', 40), big(yName(y), 26), tag(L('Kimin yavrusu?', 'Whose baby is it?'), '#9ad0ff')], opts: c.list.map(x => optLbl(x[0], mName(x), 34)), correct: c.correct };
  } });

// Hayvan Yavruları (eşleştirme): resimli ve çok daha geniş liste
if (has('hayvan_yavru')) {
  const sp = getGame('hayvan_yavru').spec;
  sp.cols = [B('Anne', 'Mother'), B('Yavrusu', 'Its baby')];
  sp.pairs.splice(0, sp.pairs.length, ...YOUNG.filter(y => (TR ? y[6] : true)).map(y => [B(`${y[0]} ${y[1]}`, `${y[0]} ${y[2]}`), B(y[3], y[4])]));
}

// ———————————————————— 2) BEBEK SEÇME OYUNLARINI BÜYÜT ————————————————————
// Kim ne verir?
const GIVES = [['🐄', '🥛', 'İnek', 'Cow', 'Süt', 'Milk'], ['🐔', '🥚', 'Tavuk', 'Hen', 'Yumurta', 'Eggs'], ['🐝', '🍯', 'Arı', 'Bee', 'Bal', 'Honey'], ['🐑', '🧶', 'Koyun', 'Sheep', 'Yün', 'Wool'],
  ['🍎', '🧃', 'Elma', 'Apple', 'Meyve suyu', 'Juice'], ['🌾', '🍞', 'Buğday', 'Wheat', 'Ekmek', 'Bread'], ['🫒', '🫙', 'Zeytin', 'Olive', 'Zeytinyağı', 'Olive oil'], ['🐛', '🧣', 'İpek böceği', 'Silkworm', 'İpek', 'Silk'],
  ['🌳', '🪵', 'Ağaç', 'Tree', 'Odun', 'Wood'], ['☁️', '🌧️', 'Bulut', 'Cloud', 'Yağmur', 'Rain'], ['🍇', '🧃', 'Üzüm', 'Grapes', 'Üzüm suyu', 'Grape juice'], ['🌽', '🍿', 'Mısır', 'Corn', 'Patlamış mısır', 'Popcorn'],
  ['🫘', '☕', 'Kahve çekirdeği', 'Coffee beans', 'Kahve', 'Coffee'], ['🍅', '🥫', 'Domates', 'Tomato', 'Salça', 'Tomato paste'], ['🥛', '🧀', 'Süt', 'Milk', 'Peynir', 'Cheese'], ['🌻', '🌰', 'Ayçiçeği', 'Sunflower', 'Çekirdek', 'Seeds'],
  ['🐐', '🥛', 'Keçi', 'Goat', 'Süt', 'Milk'], ['☀️', '💡', 'Güneş', 'Sun', 'Işık', 'Light'], ['🐟', '🍣', 'Balık', 'Fish', 'Yemek', 'Food'], ['🥔', '🍟', 'Patates', 'Potato', 'Kızartma', 'Chips'], ['🍋', '🍋', 'Limon ağacı', 'Lemon tree', 'Limon', 'Lemon']];
ext('kim_ne_verir', { round: (rng, i) => {
  const g = rng.pick(GIVES); const c = choice(rng, g, GIVES, i < 3 ? 3 : 4, x => x[1]);
  return { prompt: [emo(g[0], 66), big(L(g[2], g[3]), 20), big(L('Bize ne verir?', 'What does it give us?'), 18)], opts: c.list.map(x => optLbl(x[1], L(x[4], x[5]), 40)), correct: c.correct };
} });
// Ne giyelim?
const WEAR2 = [['☀️', 'Güneşli', 'Sunny', [['🕶️', 'Gözlük', 'Sunglasses'], ['🩳', 'Şort', 'Shorts'], ['👒', 'Şapka', 'Sun hat'], ['👕', 'Tişört', 'T-shirt'], ['🩴', 'Terlik', 'Flip-flops']]],
  ['🌧️', 'Yağmurlu', 'Rainy', [['☂️', 'Şemsiye', 'Umbrella'], ['🥾', 'Bot', 'Boots'], ['🧥', 'Yağmurluk', 'Raincoat']]],
  ['❄️', 'Karlı', 'Snowy', [['🧤', 'Eldiven', 'Gloves'], ['🧣', 'Atkı', 'Scarf'], ['🧥', 'Mont', 'Coat'], ['🥾', 'Kar botu', 'Snow boots']]],
  ['🏖️', 'Deniz', 'Beach', [['🩱', 'Mayo', 'Swimsuit'], ['🕶️', 'Gözlük', 'Sunglasses'], ['🩴', 'Terlik', 'Flip-flops'], ['👙', 'Bikini', 'Bikini']]],
  ['🌙', 'Uyku vakti', 'Bedtime', [['🩲', 'Pijama', 'Pyjamas'], ['🧦', 'Çorap', 'Socks']]],
  ['⚽', 'Spor', 'Sports', [['👟', 'Spor ayakkabı', 'Trainers'], ['🎽', 'Forma', 'Jersey'], ['🩳', 'Şort', 'Shorts']]],
  ['🎉', 'Düğün', 'Party', [['👗', 'Elbise', 'Dress'], ['👔', 'Gömlek', 'Shirt'], ['👠', 'Topuklu', 'Heels'], ['🎀', 'Kurdele', 'Ribbon']]]];
ext('ne_giyelim', { round: rng => {
  const [w, tr, en, good] = rng.pick(WEAR2); const right = rng.pick(good);
  const goodE = good.map(x => x[0]);
  const wrongPool = WEAR2.filter(x => x[0] !== w).flatMap(x => x[3]).filter(x => !goodE.includes(x[0]));
  const c = choice(rng, right, wrongPool, 3, x => x[0]);
  return { prompt: [emo(w, 70), big(L(tr, en), 20)], opts: c.list.map(x => optLbl(x[0], L(x[1], x[2]), 40)), correct: c.correct };
} });
// Kim ne sever?
const LOVES2 = [['🐶', '🦴', 'Köpek', 'Dog', 'Kemik', 'Bone'], ['🐰', '🥕', 'Tavşan', 'Rabbit', 'Havuç', 'Carrot'], ['🐭', '🧀', 'Fare', 'Mouse', 'Peynir', 'Cheese'], ['🐵', '🍌', 'Maymun', 'Monkey', 'Muz', 'Banana'],
  ['🐱', '🐟', 'Kedi', 'Cat', 'Balık', 'Fish'], ['🐼', '🎋', 'Panda', 'Panda', 'Bambu', 'Bamboo'], ['🐿️', '🌰', 'Sincap', 'Squirrel', 'Fındık', 'Nuts'], ['🐦', '🪱', 'Kuş', 'Bird', 'Solucan', 'Worm'],
  ['🐻', '🍯', 'Ayı', 'Bear', 'Bal', 'Honey'], ['🐄', '🌾', 'İnek', 'Cow', 'Ot', 'Grass'], ['🐔', '🌽', 'Tavuk', 'Hen', 'Mısır', 'Corn'], ['🐸', '🪰', 'Kurbağa', 'Frog', 'Sinek', 'Fly'],
  ['🐨', '🌿', 'Koala', 'Koala', 'Okaliptüs', 'Eucalyptus'], ['🐝', '🌸', 'Arı', 'Bee', 'Çiçek', 'Flowers'], ['🐧', '🦐', 'Penguen', 'Penguin', 'Karides', 'Shrimp'], ['🐴', '🍎', 'At', 'Horse', 'Elma', 'Apple'],
  ['🦒', '🍃', 'Zürafa', 'Giraffe', 'Yaprak', 'Leaves'], ['🐢', '🥬', 'Kaplumbağa', 'Tortoise', 'Marul', 'Lettuce'], ['🦔', '🐞', 'Kirpi', 'Hedgehog', 'Böcek', 'Bugs'], ['🐹', '🌻', 'Hamster', 'Hamster', 'Ayçekirdeği', 'Seeds'], ['🐛', '🥬', 'Tırtıl', 'Caterpillar', 'Yaprak', 'Leaves']];
ext('kim_ne_sever', { round: (rng, i) => {
  const g = rng.pick(LOVES2); const c = choice(rng, g, LOVES2, i < 3 ? 3 : 4, x => x[1]);
  return { prompt: [emo(g[0], 68), big(L(g[2], g[3]), 20), big('😋 ❓', 22)], opts: c.list.map(x => optLbl(x[1], L(x[4], x[5]), 40)), correct: c.correct };
} });
// Duygular
const FEEL2 = [['MUTLU', 'HAPPY', '😄'], ['ÜZGÜN', 'SAD', '😢'], ['KIZGIN', 'ANGRY', '😠'], ['ŞAŞKIN', 'SURPRISED', '😲'], ['UYKULU', 'SLEEPY', '😴'], ['KORKMUŞ', 'SCARED', '😨'],
  ['HASTA', 'POORLY', '🤒'], ['UTANGAÇ', 'SHY', '😊'], ['GÜLÜYOR', 'LAUGHING', '😂'], ['AĞLIYOR', 'CRYING', '😭'], ['ÖPÜCÜK', 'KISS', '😘'], ['AŞIK', 'IN LOVE', '😍'], ['SIKILMIŞ', 'BORED', '😐'],
  ['DÜŞÜNCELİ', 'THINKING', '🤔'], ['ÜŞÜMÜŞ', 'COLD', '🥶'], ['TERLEMİŞ', 'HOT', '🥵'], ['ŞAPŞAL', 'SILLY', '🤪'], ['HAVALI', 'COOL', '😎'], ['SESSİZ', 'QUIET', '🤫'], ['ESNİYOR', 'YAWNING', '🥱'], ['GURURLU', 'PROUD', '🥹']];
ext('duygular', { round: (rng, i) => { const f = rng.pick(FEEL2); const c = choice(rng, f, FEEL2, i < 3 ? 3 : 4, x => x[2]); return { prompt: big(L(f[0], f[1]), 30), opts: c.list.map(x => ({ label: x[2] })), correct: c.correct }; } });
// Taşıt sesleri
const VEH2 = [['🚂', 'Çuf çuf!', 'Choo choo!'], ['🚑', 'Dan dun dan dun!', 'Nee-naw!'], ['🚲', 'Zırr zırr!', 'Ring ring!'], ['🚢', 'Düüüt!', 'Toooot!'], ['✈️', 'Vıııın!', 'Whoosh!'], ['🚗', 'Bip bip!', 'Beep beep!'],
  ['🚒', 'Viyu viyu!', 'Wee-woo!'], ['🚓', 'Uuu-ii uuu-ii!', 'Woo-woo!'], ['🚁', 'Pat pat pat!', 'Chop chop chop!'], ['🏍️', 'Vınnn vınnn!', 'Vroom vroom!'], ['🚜', 'Tak tak tak!', 'Put-put-put!'], ['🚀', 'Fışşş, gümm!', 'Whoosh, BOOM!'],
  ['🛵', 'Dıt dıt!', 'Toot toot!'], ['🚌', 'Pışşş, kapı açıldı!', 'Hiss, doors open!'], ['🛶', 'Şıp şıp kürek!', 'Splash, splash!'], ['🚚', 'Bip bip, geri geri!', 'Beep beep, reversing!']];
ext('tasit_sesi', { round: (rng, i) => { const v = rng.pick(VEH2); const c = choice(rng, v, VEH2, i < 3 ? 3 : 4, x => x[0]); return { prompt: [emo('🔊', 34), big(L(v[1], v[2]), 26)], opts: c.list.map(x => ({ label: x[0] })), correct: c.correct }; } });
// Hayvan sesleri
const SOUNDS2 = [['🐄', 'Mööö!', 'Moo!'], ['🐶', 'Hav hav!', 'Woof woof!'], ['🐱', 'Miyav!', 'Meow!'], ['🐑', 'Meee!', 'Baa!'], ['🐔', 'Gıt gıdak!', 'Cluck cluck!'], ['🦆', 'Vak vak!', 'Quack quack!'],
  ['🦁', 'Kükreee!', 'Roar!'], ['🐝', 'Vızzz!', 'Buzz!'], ['🐸', 'Vrak vrak!', 'Ribbit!'], ['🐴', 'İhaha!', 'Neigh!'], ['🐍', 'Tısss!', 'Hiss!'], ['🦉', 'Hu huu!', 'Hoo hoo!'],
  ['🐓', 'Ü-ürü-üüü!', 'Cock-a-doodle-doo!'], ['🐷', 'Ok ok!', 'Oink oink!'], ['🐐', 'Mee-ee!', 'Maa!'], ['🐺', 'Auuuu!', 'Awoooo!'], ['🐭', 'Cik cik!', 'Squeak!'], ['🐘', 'Pıırrr!', 'Trumpet!'],
  ['🐦', 'Cik cik cik!', 'Tweet tweet!'], ['🫏', 'Aaa-iii!', 'Hee-haw!'], ['🦃', 'Glu glu glu!', 'Gobble gobble!'], ['🐒', 'Uu uu aa aa!', 'Ooh ooh aah aah!'], ['🐻', 'Hırrr!', 'Grrr!'], ['🕊️', 'Gurr gurr!', 'Coo coo!'], ['🦗', 'Cır cır!', 'Chirp chirp!']];
ext('hayvan_sesi', { round: (rng, i) => { const v = rng.pick(SOUNDS2); const c = choice(rng, v, SOUNDS2, i < 3 ? 3 : 4, x => x[0]); return { prompt: [emo('🔊', 36), h('div', { style: { fontSize: '30px', fontWeight: 900 } }, L(v[1], v[2]))], opts: c.list.map(x => ({ label: x[0] })), correct: c.correct }; } });
// Sonra ne olur?
const NEXT2 = [['🥚', '🐣'], ['🐛', '🦋'], ['🌱', '🌻'], ['🧊', '💧'], ['🌰', '🌳'], ['🌧️', '🌈'], ['🍞', '🥪'], ['🎂', '🎉'], ['🌑', '🌕'], ['🌅', '🌃'], ['🥛', '🧀'], ['🌽', '🍿'], ['🍋', '🍋‍🟩'],
  ['💤', '⏰'], ['🎈', '💥'], ['⛄', '💦'], ['🌸', '🍒'], ['🐸', '🦟'], ['🍳', '🍽️'], ['🛁', '🧼'], ['✂️', '💇'], ['📦', '🎁'], ['🪥', '😁'], ['🧵', '🧶'], ['🌋', '🔥'], ['🕯️', '🌬️']].filter(x => x[0] !== '🍋' && x[0] !== '🐸');
ext('sonra_ne', { round: (rng, i) => { const n = rng.pick(NEXT2); const c = choice(rng, n, NEXT2, i < 3 ? 3 : 4, x => x[1]); return { prompt: [emo(n[0], 70), big('➡️ ❓', 26)], opts: c.list.map(x => ({ label: x[1] })), correct: c.correct }; } });
// Vücudumuz
const BODY2 = [['GÖZ', 'EYE', '👁️'], ['KULAK', 'EAR', '👂'], ['BURUN', 'NOSE', '👃'], ['EL', 'HAND', '✋'], ['AYAK', 'FOOT', '🦶'], ['DİŞ', 'TOOTH', '🦷'], ['DİL', 'TONGUE', '👅'],
  ['DUDAK', 'LIPS', '👄'], ['BACAK', 'LEG', '🦵'], ['KOL / KAS', 'ARM / MUSCLE', '💪'], ['BEYİN', 'BRAIN', '🧠'], ['KALP', 'HEART', '🫀'], ['AKCİĞER', 'LUNGS', '🫁'], ['KEMİK', 'BONE', '🦴'], ['SAÇ', 'HAIR', '💇'], ['PARMAK', 'FINGER', '☝️'], ['TIRNAK', 'NAILS', '💅']];
ext('vucudumuz', { round: (rng, i) => { const b = rng.pick(BODY2); const c = choice(rng, b, BODY2, i < 3 ? 3 : 4, x => x[2]); return { prompt: big(L(b[0], b[1]), 30), opts: c.list.map(x => ({ label: x[2] })), correct: c.correct }; } });
// Kim kullanır?
const USES2 = [['🧑‍🚒', '🚒', 'İtfaiyeci', 'Firefighter'], ['🧑‍🍳', '🍳', 'Aşçı', 'Cook'], ['🧑‍⚕️', '🩺', 'Doktor', 'Doctor'], ['👮', '🚓', 'Polis', 'Police officer'], ['🧑‍🌾', '🚜', 'Çiftçi', 'Farmer'],
  ['🧑‍🏫', '📚', 'Öğretmen', 'Teacher'], ['🧑‍🚀', '🚀', 'Astronot', 'Astronaut'], ['🧑‍🎨', '🎨', 'Ressam', 'Painter'], ['🧑‍✈️', '✈️', 'Pilot', 'Pilot'], ['🧑‍🔧', '🔧', 'Tamirci', 'Mechanic'],
  ['💇', '✂️', 'Berber', 'Hairdresser'], ['🧑‍🎤', '🎤', 'Şarkıcı', 'Singer'], ['🧑‍🔬', '🔬', 'Bilim insanı', 'Scientist'], ['🧑‍💻', '💻', 'Yazılımcı', 'Programmer'], ['🧑‍🏭', '⚙️', 'İşçi', 'Factory worker'],
  ['👷', '🦺', 'İnşaatçı', 'Builder'], ['🤿', '🤿', 'Dalgıç', 'Diver'], ['🧙', '🪄', 'Sihirbaz', 'Magician'], ['⚽', '🥅', 'Kaleci', 'Goalkeeper'], ['🧑‍⚖️', '⚖️', 'Hâkim', 'Judge'], ['📮', '✉️', 'Postacı', 'Postman'], ['🎣', '🐟', 'Balıkçı', 'Fisher']];
ext('kim_kullanir', { round: (rng, i) => { const u = rng.pick(USES2); const c = choice(rng, u, USES2, i < 3 ? 3 : 4, x => x[1]); return { prompt: [emo(u[0], 70), big(L(u[2], u[3]), 20)], opts: c.list.map(x => ({ label: x[1] })), correct: c.correct }; } });
// Sıcak mı soğuk mu? / gece mi gündüz mü?
const HOT2 = ['🔥', '☕', '🌞', '🍲', '🌋', '🏜️', '🍵', '🫕', '♨️', '🥵', '🌶️', '🧯'].filter(x => x !== '🧯'), COLD2 = ['🧊', '🍦', '⛄', '❄️', '🐧', '🥶', '🏔️', '🍧', '🐻‍❄️', '🧤', '🌨️', '🍨'];
ext('sicak_soguk', { round: rng => {
  const hot = rng.chance(0.5); const [g, bd] = hot ? [HOT2, COLD2] : [COLD2, HOT2];
  const right = rng.pick(g.filter(x => x !== '🥵' && x !== '🥶')); const list = rng.shuffle([right, ...rng.shuffle(bd.slice()).slice(0, 2)]);
  return { prompt: [emo(hot ? '🥵' : '🥶', 50), big(hot ? L('Hangisi SICAK?', 'Which is HOT?') : L('Hangisi SOĞUK?', 'Which is COLD?'), 24)], opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
} });
const NIGHT2 = ['🦉', '🌙', '⭐', '🛌', '🦇', '🌌', '🕯️', '😴', '🌠', '🔦', '🦔'], DAY2 = ['🌞', '🐓', '🏖️', '🌻', '🦋', '🕶️', '🌈', '🏫', '🧺', '🪁', '🐝'];
ext('gece_gunduz', { round: rng => {
  const night = rng.chance(0.5); const [g, bd] = night ? [NIGHT2, DAY2] : [DAY2, NIGHT2];
  const right = rng.pick(g); const list = rng.shuffle([right, ...rng.shuffle(bd.slice()).slice(0, 2)]);
  return { prompt: [emo(night ? '🌃' : '🏞️', 70), big(night ? L('GECE', 'NIGHT') : L('GÜNDÜZ', 'DAY'), 22)], opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
} });
// Şekli bul
const SHP2 = [['DAİRE', 'CIRCLE', '🔵'], ['KARE', 'SQUARE', '🟦'], ['ÜÇGEN', 'TRIANGLE', '🔺'], ['YILDIZ', 'STAR', '⭐'], ['KALP', 'HEART', '❤️'], ['BAKLAVA', 'DIAMOND', '🔶'],
  ['AY', 'CRESCENT', '🌙'], ['ARTI', 'PLUS', '➕'], ['OK', 'ARROW', '➡️'], ['BULUT', 'CLOUD', '☁️'], ['DAMLA', 'DROP', '💧'], ['ALTIGEN', 'HEXAGON', '⬢'], ['YUMURTA (OVAL)', 'OVAL', '🥚']];
ext('sekli_bul', { round: (rng, i) => { const s = rng.pick(SHP2); const c = choice(rng, s, SHP2, i < 3 ? 3 : 4, x => x[2]); return { prompt: big(L(s[0], s[1]), 28), opts: c.list.map(x => ({ label: x[2] })), correct: c.correct }; } });
// Nokta say → karışık sayma (nokta, parmak, zar)
ext('nokta_say', { round: (rng, i) => {
  const n = rng.int(1, i < 3 ? 4 : 6);
  const kind = rng.int(0, 2);
  const show = x => kind === 0 ? '●'.repeat(x) : kind === 1 ? ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][x] : ['', '☝️', '✌️', '🤟', '🖖', '🖐️', '🖐️☝️'][x];
  const nums = rng.shuffle([n, ...rng.shuffle([1, 2, 3, 4, 5, 6].filter(x => x !== n)).slice(0, 2)]);
  return { prompt: big(String(n), 72), opts: nums.map(x => ({ label: show(x), style: { fontSize: kind === 1 ? '54px' : '26px', color: kind === 0 ? '#ffd166' : undefined } })), correct: nums.indexOf(n) };
} });
// Örüntü: daha çok simge
ext('oruntu_bebek', { round: (rng, i) => {
  const PAT = ['🔴', '🔵', '🟡', '🟢', '⭐', '🌙', '🍎', '🍌', '🐶', '🐱', '🚗', '🎈', '🌸', '⚽', '🟣', '🟠', '🍓', '🐟'];
  const [a, b, c] = rng.shuffle(PAT.slice()).slice(0, 3);
  const unit = i < 3 ? [a, b] : rng.pick([[a, b, c], [a, a, b], [a, b, b]]);
  const seq = Array.from({ length: unit.length * 2 + 1 }, (_, k) => unit[k % unit.length]);
  const ans = seq.pop();
  const ch = choice(rng, ans, [a, b, c, rng.pick(PAT)], 3);
  return { prompt: big(seq.join(' ') + ' ❓', 28), opts: ch.list.map(e => ({ label: e })), correct: ch.correct };
} });
// Renk eşle: renkler ve nesneler büyüdü
const COLORS2 = [['#e53935', 'KIRMIZI', 'RED', ['🍎', '🍓', '🍒', '🚒', '🌹', '🍅', '🎈', '🦀', '🌶️', '🧣']], ['#fdd835', 'SARI', 'YELLOW', ['🍌', '🌻', '🐤', '🧀', '🌽', '🍋', '⭐', '🚕']],
  ['#43a047', 'YEŞİL', 'GREEN', ['🥦', '🐸', '🥒', '🍀', '🌲', '🥝', '🦎', '🍏', '🐢']], ['#1e88e5', 'MAVİ', 'BLUE', ['🫐', '🐳', '💙', '🧢', '🦋', '💧', '👖', '🧊']],
  ['#fb8c00', 'TURUNCU', 'ORANGE', ['🍊', '🥕', '🦊', '🎃', '🏀', '🦁', '🍑']], ['#8e24aa', 'MOR', 'PURPLE', ['🍇', '🍆', '☂️', '💜', '🔮', '🟣']], ['#6d4c41', 'KAHVERENGİ', 'BROWN', ['🐻', '🌰', '🍫', '🪵', '🥔', '🐴', '🥥']]];
ext('renk_esle', { round: (rng, i) => {
  const [c, tr, en, items] = rng.pick(COLORS2);
  const right = rng.pick(items);
  const others = rng.shuffle(COLORS2.filter(x => x[0] !== c)).slice(0, i < 3 ? 2 : 3).map(x => rng.pick(x[3]));
  const list = rng.shuffle([right, ...others]);
  return { prompt: [h('div', { style: { width: '84px', height: '84px', borderRadius: '50%', background: c, border: '4px solid #fff3', margin: '0 auto' } }), big(L(tr, en), 20)], opts: list.map(e => ({ label: e })), correct: list.indexOf(right) };
} });
// Şekil kutusu ve büyük/küçük zaten bankaya bağlı; sayılar için de daha çok nesne
// i18n-skip-end

// ———————————————————— 3) EŞLEŞTİRME: SÜTUN BAŞLIKLARI + YENİ ÇİFTLER ————————————————————
const cols = (id, a, b) => { if (has(id)) getGame(id).spec.cols = [a, b]; };
cols('mucit_icat', B('Buluş', 'Invention'), B('Mucit', 'Inventor'));
cols('roman_yazar', B('Roman', 'Novel'), B('Yazar', 'Author'));
cols('element_eslestir', B('Element', 'Element'), B('Sembol', 'Symbol'));
cols('deyim_anlam', B('Deyim', 'Idiom'), B('Anlamı', 'Meaning'));
cols('baskent', B('Ülke', 'Country'), B('Başkent', 'Capital'));

// i18n-skip-start
ext('recete_eslestir', { pairs: P2([
  ['Baş ağrısı', 'Headache', 'Ağrı kesici', 'Painkiller'], ['Burun tıkanıklığı', 'Blocked nose', 'Burun spreyi', 'Nasal spray'], ['İshal', 'Diarrhoea', 'Probiyotik + sıvı', 'Probiotic + fluids'],
  ['Bulantı', 'Nausea', 'Bulantı önleyici', 'Anti-nausea tablet'], ['Boğaz ağrısı', 'Sore throat', 'Boğaz pastili', 'Throat lozenge'], ['Kaşıntılı sivrisinek ısırığı', 'Itchy mosquito bite', 'Kaşıntı kremi', 'Anti-itch cream'],
  ['Güneş yanığı', 'Sunburn', 'Aloe vera jeli', 'Aloe vera gel'], ['Demir eksikliği', 'Iron deficiency', 'Demir takviyesi', 'Iron supplement'], ['Kuru öksürük', 'Dry cough', 'Öksürük kesici', 'Cough suppressant'],
  ['Balgamlı öksürük', 'Chesty cough', 'Balgam söktürücü', 'Expectorant'], ['Konjonktivit', 'Conjunctivitis', 'Antibiyotikli göz damlası', 'Antibiotic eye drops'], ['Uçuk', 'Cold sore', 'Uçuk kremi', 'Cold-sore cream'],
  ['Kepek', 'Dandruff', 'Kepek şampuanı', 'Anti-dandruff shampoo'], ['Diş eti kanaması', 'Bleeding gums', 'Ağız gargarası', 'Mouthwash'], ['Kas kramp', 'Muscle cramp', 'Magnezyum', 'Magnesium'],
  ['Kemik zayıflığı', 'Weak bones', 'Kalsiyum + D vitamini', 'Calcium + vitamin D'], ['Astım krizi', 'Asthma attack', 'Fısfıs (inhaler)', 'Inhaler'], ['Şeker düşmesi', 'Low blood sugar', 'Glikoz tableti', 'Glucose tablet'],
  ['Pişik', 'Nappy rash', 'Pişik kremi', 'Nappy cream'], ['Mide gazı', 'Bloating', 'Gaz giderici', 'Anti-gas drops'], ['Kulak kiri', 'Ear wax', 'Kulak damlası', 'Ear drops'], ['Ayak mantarı', "Athlete's foot", 'Mantar spreyi', 'Antifungal spray'],
  ['Kesik', 'Small cut', 'Antiseptik + yara bandı', 'Antiseptic + plaster'], ['Yol tutması', 'Travel sickness', 'Yol tutması hapı', 'Travel-sickness pill'], ['Hazımsızlık', 'Indigestion', 'Antiasit', 'Antacid'],
]) });
ext('hukuk_dali', { pairs: P2([
  ['Velayet davası', 'Custody case', 'Aile hukuku', 'Family law'], ['Fazla mesai ücreti', 'Unpaid overtime', 'İş hukuku', 'Employment law'], ['Senet borcu', 'Unpaid promissory note', 'Borçlar hukuku', 'Contract law'],
  ['Vasiyetname itirazı', 'Contested will', 'Miras hukuku', 'Inheritance law'], ['Dolandırıcılık', 'Fraud', 'Ceza hukuku', 'Criminal law'], ['Patent ihlali', 'Patent infringement', 'Fikri mülkiyet', 'Intellectual property'],
  ['Şirket iflası', 'Company bankruptcy', 'İcra ve iflas hukuku', 'Insolvency law'], ['Doktor hatası', 'Medical malpractice', 'Tazminat hukuku', 'Tort law'], ['KDV incelemesi', 'VAT audit', 'Vergi hukuku', 'Tax law'],
  ['Ayıplı araç', 'Defective car', 'Tüketici hukuku', 'Consumer law'], ['Belediye yıkım kararı', 'Council demolition order', 'İdare hukuku', 'Administrative law'], ['Tapu sınır anlaşmazlığı', 'Land boundary dispute', 'Eşya hukuku', 'Property law'],
  ['Yabancı ile evlilik tanıma', 'Recognising a foreign marriage', 'Uluslararası özel hukuk', 'Private international law'], ['Gemi çarpışması', 'Ship collision', 'Deniz hukuku', 'Maritime law'], ['Telif hakkı (şarkı)', 'Song copyright', 'Fikri mülkiyet', 'Intellectual property'],
  ['Kişisel verilerin sızdırılması', 'Personal data leak', 'Bilişim hukuku', 'Data protection law'], ['Sporcu sözleşmesi', 'Athlete contract', 'Spor hukuku', 'Sports law'], ['Çevre kirliliği', 'Pollution case', 'Çevre hukuku', 'Environmental law'],
  ['Seçim itirazı', 'Election challenge', 'Anayasa hukuku', 'Constitutional law'], ['Kira artışı anlaşmazlığı', 'Rent increase dispute', 'Borçlar hukuku', 'Contract law'],
]).filter((p, i, a) => a.findIndex(q => q[1] === p[1]) === i) });
ext('ariza_parca', { pairs: P2([
  ['Araba sağa çekiyor', 'Car pulls to the right', 'Rot ayarı', 'Wheel alignment'], ['Farlar sönük', 'Dim headlights', 'Far ampulü', 'Headlight bulb'], ['Silecek camı çiziyor', 'Wipers scratch the glass', 'Silecek lastiği', 'Wiper blade'],
  ['Debriyaj kayıyor', 'Clutch slipping', 'Debriyaj balatası', 'Clutch plate'], ['Araba yağ eksiltiyor', 'Car losing oil', 'Karter contası', 'Sump gasket'], ['Klima serin üflemiyor', 'A/C blows warm', 'Klima gazı', 'A/C refrigerant'],
  ['Marş basmıyor, tık sesi', 'Starter just clicks', 'Marş motoru', 'Starter motor'], ['Lavabo geç akıyor', 'Sink drains slowly', 'Sifon', 'Trap (siphon)'], ['Şofben su ısıtmıyor', 'Water heater stays cold', 'Rezistans', 'Heating element'],
  ['Sigorta sürekli atıyor', 'Breaker keeps tripping', 'Kaçak akım rölesi', 'RCD switch'], ['Çamaşır makinesi su boşaltmıyor', 'Washer won\'t drain', 'Pompa', 'Drain pump'], ['Çamaşır makinesi dönmüyor', 'Drum won\'t spin', 'Kayış', 'Drive belt'],
  ['Buzdolabı kapısı terliyor', 'Fridge door sweating', 'Kapı lastiği', 'Door seal'], ['Bisiklet zinciri atıyor', 'Bike chain slips', 'Vites teli', 'Gear cable'], ['Musluk zor dönüyor', 'Stiff tap', 'Kartuş', 'Cartridge'],
  ['Aspiratör ses yapıyor', 'Noisy extractor fan', 'Fan motoru', 'Fan motor'], ['Kapı kilitlenmiyor', 'Door won\'t lock', 'Barel', 'Lock cylinder'], ['Petek ısınmıyor', 'Radiator stays cold', 'Hava purjörü', 'Bleed valve'],
  ['Egzozdan siyah duman', 'Black exhaust smoke', 'Hava filtresi', 'Air filter'], ['Direksiyon titriyor', 'Steering wheel shakes', 'Balans ayarı', 'Wheel balancing'],
]) });
ext('alet_meslek', { pairs: P2([
  ['Şırınga', 'Syringe', 'Hemşire', 'Nurse'], ['Makas & kumaş', 'Scissors & fabric', 'Terzi', 'Tailor'], ['Örs & çekiç', 'Anvil & hammer', 'Demirci', 'Blacksmith'], ['Kamera', 'Camera', 'Fotoğrafçı', 'Photographer'],
  ['Hortum & merdiven', 'Hose & ladder', 'İtfaiyeci', 'Firefighter'], ['Kelepçe & düdük', 'Handcuffs & whistle', 'Polis', 'Police officer'], ['Klavye', 'Keyboard', 'Yazılımcı', 'Programmer'], ['Çapa', 'Hoe', 'Çiftçi', 'Farmer'],
  ['Teleskop', 'Telescope', 'Astronom', 'Astronomer'], ['Mikroskop', 'Microscope', 'Biyolog', 'Biologist'], ['Oklava', 'Rolling pin', 'Fırıncı', 'Baker'], ['Olta', 'Fishing rod', 'Balıkçı', 'Fisher'],
  ['Baret & metre', 'Hard hat & tape', 'Mühendis', 'Engineer'], ['Cetvel & gönye', 'Ruler & set square', 'Mimar', 'Architect'], ['Baton', 'Baton', 'Orkestra şefi', 'Conductor'], ['Kalem & not defteri', 'Pen & notebook', 'Gazeteci', 'Journalist'],
  ['Kask & kürek', 'Helmet & pick', 'Madenci', 'Miner'], ['Mektup çantası', 'Mailbag', 'Postacı', 'Postman'], ['Hesap makinesi & defter', 'Calculator & ledger', 'Muhasebeci', 'Accountant'], ['Keski', 'Chisel', 'Heykeltıraş', 'Sculptor'],
  ['Kaynak pensi', 'Welding torch', 'Kaynakçı', 'Welder'], ['Tarak & fön', 'Comb & hairdryer', 'Kuaför', 'Hairdresser'], ['Ses kayıt cihazı', 'Voice recorder', 'Muhabir', 'Reporter'], ['Kumpas', 'Calliper', 'Tornacı', 'Machinist'],
]).filter((p, i, a) => a.findIndex(q => q[1] === p[1]) === i) });
ext('sekil_alan', { pairs: P2([
  ['Küre hacmi', 'Sphere volume', '(4/3)πr³', '(4/3)πr³'], ['Küre yüzey alanı', 'Sphere surface area', '4πr²', '4πr²'], ['Koni hacmi', 'Cone volume', '(1/3)πr²h', '(1/3)πr²h'],
  ['Prizma hacmi', 'Prism volume', 'taban alanı·h', 'base area·h'], ['Piramit hacmi', 'Pyramid volume', '(taban·h)/3', '(base·h)/3'], ['Eşkenar üçgen alanı', 'Equilateral triangle area', '(a²√3)/4', '(a²√3)/4'],
  ['Eşkenar dörtgen alanı', 'Rhombus area', '(e·f)/2', '(d₁·d₂)/2'], ['Dikdörtgenler prizması', 'Cuboid volume', 'a·b·c', 'a·b·c'], ['Küp yüzey alanı', 'Cube surface area', '6a²', '6a²'],
  ['Daire dilimi', 'Sector area', 'πr²·(α/360)', 'πr²·(α/360)'], ['Pisagor', 'Pythagoras', 'a²+b²=c²', 'a²+b²=c²'], ['Düzgün altıgen alanı', 'Regular hexagon area', '(3a²√3)/2', '(3a²√3)/2'],
]) });
ext('element_sembol', { pairs: P2([['Neon', 'Neon', 'Ne', 'Ne'], ['Alüminyum', 'Aluminium', 'Al', 'Al'], ['Silisyum', 'Silicon', 'Si', 'Si'], ['Fosfor', 'Phosphorus', 'P', 'P'], ['Kalay', 'Tin', 'Sn', 'Sn'],
  ['Platin', 'Platinum', 'Pt', 'Pt'], ['Uranyum', 'Uranium', 'U', 'U'], ['İyot', 'Iodine', 'I', 'I'], ['Flor', 'Fluorine', 'F', 'F'], ['Lityum', 'Lithium', 'Li', 'Li'], ['Nikel', 'Nickel', 'Ni', 'Ni'], ['Krom', 'Chromium', 'Cr', 'Cr']]) });
// i18n-skip-end
