// İçerik genişletme: bilgi bankasındaki (kb.js) verilerle var olan oyunların havuzlarını büyütür ve
// bankadan sınırsız soru üreten yeni oyunlar ekler. Öğe hafızası sayesinde havuz bitmeden tekrar yok.
import { h } from '../ui/dom.js';
import { B, lang } from '../core/i18n.js';
import { extend, getGame } from './engine.js';
import { babyPick } from './baby.js';
import { pairGame, sortGame } from './engines.js';
import { popGame } from './engines4.js';
import { FACTS } from './extra.js';
import { WORDS } from './mind.js';
import { COUNTRIES, ANIMALS, CLASSES, HABITATS, FLIERS, FOODS, THINGS, THING_GROUPS, SYN_TR, SYN_EN, ANT_TR, ANT_EN, PICWORDS, POS_TR, POS_EN, IDIOM_TR, IDIOM_EN, ELEMENTS, BOOKS, INVENTIONS, FACTS_BI } from './kb.js';

const TR = lang === 'tr';
const L = (tr, en) => (TR ? tr : en);
const big = (t, s = 26) => h('div', { style: { fontSize: s + 'px', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 } }, t);
const emo = (e, s = 70) => h('div', { style: { fontSize: s + 'px', lineHeight: 1 } }, e);
const txtOpt = (label) => ({ label, style: { fontSize: '16px', fontWeight: 800, minHeight: '64px' } });
// n seçenekli soru: doğru + karışık yanlışlar (aynı etiket tekrar etmez)
function choice(rng, right, wrongPool, n = 3, key = x => x) {
  const seen = new Set([key(right)]);
  const wr = [];
  for (const w of rng.shuffle(wrongPool.slice())) { if (wr.length >= n - 1) break; if (!seen.has(key(w))) { seen.add(key(w)); wr.push(w); } }
  const list = rng.shuffle([right, ...wr]);
  return { list, correct: list.indexOf(right) };
}
const has = (id) => !!getGame(id);
// Ekle ama var olanları tekrar ekleme (aynı soldaki öğe iki kez gelirse eşleştirme bozulur)
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
const uniq = (arr, key = x => x[0]) => { const s = new Set(); return arr.filter(x => { const k = key(x); if (s.has(k)) return false; s.add(k); return true; }); };

// i18n-skip-start
// ———————————————————— 1) VAR OLAN OYUNLARI BÜYÜT ————————————————————
// Eş anlamlılar, zıt anlamlılar, sözcük türleri, deyimler (dile göre)
if (has('es_anlam')) { const cur = new Set(getGame('es_anlam').spec.pairs.map(p => p[0])); ext('es_anlam', { pairs: (TR ? SYN_TR : SYN_EN).filter(p => !cur.has(p[0])) }); }
ext('zit_anlam', { gen: rng => { const Lst = TR ? ANT_TR : ANT_EN; const [a, b] = rng.pick(Lst); const flip = rng.chance(0.5); const w = flip ? b : a, ans = flip ? a : b;
  const wr = rng.shuffle(Lst.flat().filter(x => x !== ans && x !== w)).slice(0, 3); return { q: TR ? `"${w}" kelimesinin zıttı?` : `Opposite of "${w}"?`, a: ans, w: wr }; } });
if (has('kelime_turu')) ext('kelime_turu', { items: TR ? POS_TR : POS_EN });
ext('deyim_anlam', { pairs: TR ? IDIOM_TR : IDIOM_EN });
if (TR) ext('ingilizce', { pairs: uniq(PICWORDS.filter(p => !p[2].includes('(')).map(p => [p[2].toLowerCase(), p[1].toLocaleLowerCase('tr-TR')])) });

// Başkentler (eşleştirme ve hızlı soru), kıtalar, posta şehirleri
ext('baskent', { pairs: COUNTRIES.filter(c => c[1] !== c[3]).map(c => [B(c[1], c[2]), B(c[3], c[4])]) });
ext('baskent_bil', { gen: rng => { const c = rng.pick(COUNTRIES); const k = TR ? 3 : 4; return { q: TR ? `${c[0]} ${c[1]} ülkesinin başkenti?` : `${c[0]} Capital of ${c[2]}?`, a: c[k], w: rng.shuffle(COUNTRIES.filter(x => x !== c).map(x => x[k])).slice(0, 3) }; } });
ext('kita_ulke', { items: COUNTRIES.filter(c => c[5] !== null && c[5] <= 3).map(c => [B(`${c[0]} ${c[1]}`, `${c[0]} ${c[2]}`), c[5]]) });
ext('posta', { items: [
  [B('Toulouse', 'Toulouse'), 0], [B('Strazburg', 'Strasbourg'), 0], [B('Lille', 'Lille'), 0], [B('Nantes', 'Nantes'), 0], [B('Montpellier', 'Montpellier'), 0], [B('Rennes', 'Rennes'), 0],
  [B('Stuttgart', 'Stuttgart'), 1], [B('Düsseldorf', 'Düsseldorf'), 1], [B('Dresden', 'Dresden'), 1], [B('Leipzig', 'Leipzig'), 1], [B('Bremen', 'Bremen'), 1], [B('Hannover', 'Hanover'), 1],
  [B('Torino', 'Turin'), 2], [B('Bologna', 'Bologna'), 2], [B('Cenova', 'Genoa'), 2], [B('Palermo', 'Palermo'), 2], [B('Verona', 'Verona'), 2], [B('Pisa', 'Pisa'), 2],
  [B('Malaga', 'Málaga'), 3], [B('Zaragoza', 'Zaragoza'), 3], [B('Granada', 'Granada'), 3], [B('Palma', 'Palma'), 3], [B('Alicante', 'Alicante'), 3], [B('Salamanca', 'Salamanca'), 3]] });

// Hayvan sınıfları, besin grupları, geri dönüşüm
ext('hayvan_sinif', { items: ANIMALS.filter(a => a[3] <= 3).map(a => [B(`${a[0]} ${a[1]}`, `${a[0]} ${a[2]}`), a[3]]) });
ext('besin_grubu', { items: [
  [B('🥩 Kırmızı et', '🥩 Red meat'), 0], [B('🦃 Hindi eti', '🦃 Turkey meat'), 0], [B('🍤 Karides', '🍤 Prawns'), 0], [B('🫘 Nohut', '🫘 Chickpeas'), 0], [B('🫘 Kuru fasulye', '🫘 Haricot beans'), 0],
  [B('🧀 Lor peyniri', '🧀 Cottage cheese'), 0], [B('🦑 Kalamar', '🦑 Squid'), 0], [B('🐟 Ton balığı', '🐟 Tuna'), 0], [B('🥚 Haşlanmış yumurta', '🥚 Boiled egg'), 0], [B('🍗 Izgara köfte', '🍗 Grilled meatballs'), 0],
  [B('🍞 Tam buğday ekmeği', '🍞 Wholemeal bread'), 1], [B('🥯 Simit', '🥯 Simit (sesame bagel)'), 1], [B('🌾 Bulgur', '🌾 Bulgur'), 1], [B('🥣 Yulaf', '🥣 Oats'), 1], [B('🌽 Mısır', '🌽 Corn'), 1],
  [B('🥖 Baget', '🥖 Baguette'), 1], [B('🍠 Tatlı patates', '🍠 Sweet potato'), 1], [B('🫓 Lavaş', '🫓 Flatbread'), 1], [B('🍜 Erişte', '🍜 Noodles'), 1], [B('🍚 Pirinç pilavı', '🍚 Rice pilaf'), 1],
  [B('🍎 Elma', '🍎 Apple'), 2], [B('🍐 Armut', '🍐 Pear'), 2], [B('🍓 Çilek', '🍓 Strawberries'), 2], [B('🥝 Kivi', '🥝 Kiwi'), 2], [B('🍇 Üzüm', '🍇 Grapes'), 2], [B('🥒 Salatalık', '🥒 Cucumber'), 2],
  [B('🍅 Domates', '🍅 Tomato'), 2], [B('🫑 Biber', '🫑 Pepper'), 2], [B('🥬 Marul', '🥬 Lettuce'), 2], [B('🍆 Patlıcan', '🍆 Aubergine'), 2], [B('🍑 Şeftali', '🍑 Peach'), 2], [B('🍋 Limon', '🍋 Lemon'), 2],
  [B('🥑 Avokado', '🥑 Avocado'), 3], [B('🌰 Ceviz', '🌰 Walnuts'), 3], [B('🥜 Yer fıstığı', '🥜 Peanuts'), 3], [B('🧈 Margarin', '🧈 Margarine'), 3], [B('🫒 Zeytin', '🫒 Olives'), 3],
  [B('🥥 Hindistan cevizi', '🥥 Coconut'), 3], [B('🌻 Ayçiçek yağı', '🌻 Sunflower oil'), 3], [B('🥜 Badem', '🥜 Almonds'), 3], [B('🧀 Kaymak', '🧀 Clotted cream'), 3]] });
ext('geri_donusum', { items: [
  [B('📚 Eski dergi', '📚 Old magazine'), 0], [B('🧻 Rulo kartonu', '🧻 Cardboard roll'), 0], [B('✉️ Zarf', '✉️ Envelope'), 0], [B('🥚 Karton yumurta kolisi', '🥚 Cardboard egg box'), 0],
  [B('📃 Broşür', '📃 Leaflet'), 0], [B('🗞️ El ilanı', '🗞️ Flyer'), 0], [B('📦 Kargo kutusu', '📦 Delivery box'), 0], [B('🗒️ Müsvedde kâğıt', '🗒️ Scrap paper'), 0],
  [B('🧼 Deterjan bidonu', '🧼 Detergent bottle'), 1], [B('🧺 Plastik kasa', '🧺 Plastic crate'), 1], [B('🥤 Plastik bardak', '🥤 Plastic cup'), 1], [B('🧴 Krem tüpü', '🧴 Lotion bottle'), 1],
  [B('🍶 Plastik süt şişesi', '🍶 Plastic milk bottle'), 1], [B('🪣 Plastik kova', '🪣 Plastic bucket'), 1], [B('🍱 Plastik yemek kabı', '🍱 Plastic food tub'), 1],
  [B('🫙 Reçel kavanozu', '🫙 Jam jar'), 2], [B('🫙 Turşu kavanozu', '🫙 Pickle jar'), 2], [B('🧪 Cam ilaç şişesi', '🧪 Glass medicine bottle'), 2], [B('🌶️ Cam sos şişesi', '🌶️ Glass sauce bottle'), 2],
  [B('🧃 Cam meyve suyu şişesi', '🧃 Glass juice bottle'), 2], [B('🫒 Cam zeytinyağı şişesi', '🫒 Glass olive-oil bottle'), 2],
  [B('🐟 Ton balığı konservesi', '🐟 Tuna tin'), 3], [B('🔑 Eski anahtar', '🔑 Old key'), 3], [B('🍳 Eski tava', '🍳 Old frying pan'), 3], [B('📎 Ataş', '📎 Paper clips'), 3],
  [B('🧷 Çengelli iğne', '🧷 Safety pins'), 3], [B('🥄 Eski kaşık', '🥄 Old spoon'), 3], [B('🛢️ Boş boya tenekesi', '🛢️ Empty paint tin'), 3], [B('🥫 Bezelye konservesi', '🥫 Tin of peas'), 3]] });

// Kütüphane rafı: Roman / Bilim / Tarih / Şiir
ext('kutuphane', { items: [
  ...BOOKS.filter(b => !['Safahat', 'Memleketimden İnsan Manzaraları', 'İlahi Komedya', 'Faust', 'Romeo ve Juliet', 'Macbeth', 'Kaşağı'].includes(b[0])).map(b => [B(b[0], b[1]), 0]),
  [B('Sessiz Bahar', 'Silent Spring'), 1], [B('Principia', 'Principia'), 1], [B('Görelilik Kuramı', 'Relativity'), 1], [B('Evrenin Zarafeti', 'The Elegant Universe'), 1], [B('Soluk Mavi Nokta', 'Pale Blue Dot'), 1], [B('Kaos', 'Chaos'), 1], [B('Gen: Bir Mahrem Tarih', 'The Gene: An Intimate History'), 1],
  [B('Tüfek, Mikrop ve Çelik', 'Guns, Germs, and Steel'), 2], [B('Nutuk', 'Nutuk (The Great Speech)'), 2], [B('Osmanlı İmparatorluğu: Klasik Çağ', 'The Ottoman Empire: The Classical Age'), 2], [B('Bizans Devleti Tarihi', 'History of the Byzantine State'), 2], [B('Çanakkale 1915', 'Gallipoli 1915'), 2],
  [B('Safahat', 'Safahat'), 3], [B('Memleketimden İnsan Manzaraları', 'Human Landscapes from My Country'), 3], [B('İlahi Komedya', 'The Divine Comedy'), 3], [B('Çile', 'Çile (Ordeal)'), 3], [B('Kendi Gök Kubbemiz', 'Our Own Firmament'), 3], [B('Kuvâyi Milliye', 'National Forces'), 3]] });

// Elementler, eserler
const ELP = ELEMENTS.map(e => [B(e[0], e[1]), e[2]]);
ext('element_sembol', { pairs: ELP });
ext('element_eslestir', { pairs: ELP });
ext('yazar_eser', { pairs: BOOKS.map(b => [B(b[0], b[1]), b[2]]) });
ext('roman_yazar', { pairs: BOOKS.map(b => [b[2], B(b[0], b[1])]) });

// Doğru mu yanlış mı + kelime avı
FACTS.push(...FACTS_BI.map(f => [B(f[0], f[1]), f[2]]));
{
  const cat = (src, tr, en) => src.map(x => [x[0], x[1], x[2], L(tr, en)]);
  const extra = [...cat(ANIMALS, 'bir hayvan', 'an animal'), ...cat(FOODS, 'yiyecek', 'food'), ...cat(THINGS, 'bir eşya', 'a thing')]
    .map(([e, tr, en, c]) => [TR ? tr.toLocaleUpperCase('tr-TR') : en.toUpperCase(), `${e} · ${c}`])
    .filter(([w]) => !/[\s()'-.]/.test(w) && w.length >= 3 && w.length <= 10);
  const have = new Set(WORDS.map(w => w[0]));
  WORDS.push(...uniq(extra).filter(w => !have.has(w[0])));
}
// Kelime kurma oyunları: resimli kelimeler
const PW = uniq(PICWORDS.filter(p => !/[\s()'-.]/.test(p[1] + p[2]) && p[1].length <= 9 && p[2].length <= 9).map(p => [p[0], p[1].toLocaleUpperCase('tr-TR'), p[2].toUpperCase()]), p => p[1]);
for (const id of ['kelime_kur', 'bulmaca_kelime', 'eng_kelime', 'ceviri_kelime']) if (has(id)) { const cur = new Set(getGame(id).spec.words.map(w => w[1])); ext(id, { words: PW.filter(w => !cur.has(w[1])) }); }

// Balon oyunları: bankadan yeni kurallar
const em = arr => arr.map(x => x[0]);
const RULES = [
  [B('🐾 MEMELİLERİ patlat', '🐾 Pop the MAMMALS'), em(ANIMALS.filter(a => a[3] === 0)), em(ANIMALS.filter(a => a[3] > 0))],
  [B('🐦 KUŞLARI patlat', '🐦 Pop the BIRDS'), em(ANIMALS.filter(a => a[3] === 1)), em(ANIMALS.filter(a => a[3] !== 1))],
  [B('🐟 SUDA YAŞAYANLARI patlat', '🐟 Pop what lives in WATER'), em(ANIMALS.filter(a => 'dt'.includes(a[4]))), em(ANIMALS.filter(a => !'dtk'.includes(a[4]) && a[3] !== 5))],
  [B('🍎 MEYVELERİ patlat', '🍎 Pop the FRUIT'), em(FOODS.filter(f => f[3] === 'm')), em(FOODS.filter(f => f[3] === 's'))],
  [B('🥕 SEBZELERİ patlat', '🥕 Pop the VEGETABLES'), em(FOODS.filter(f => f[3] === 's')), em(FOODS.filter(f => f[3] === 'm'))],
  [B('🚗 TAŞITLARI patlat', '🚗 Pop the VEHICLES'), em(THINGS.filter(t => 'thd'.includes(t[3]))), em(THINGS.filter(t => !'thd'.includes(t[3])))],
  [B('🎵 MÜZİK ALETLERİNİ patlat', '🎵 Pop the INSTRUMENTS'), em(THINGS.filter(t => t[3] === 'z')), em(THINGS.filter(t => t[3] !== 'z'))],
  [B('🧸 OYUNCAKLARI patlat', '🧸 Pop the TOYS'), em(THINGS.filter(t => t[3] === 'o')), em(THINGS.filter(t => !'o'.includes(t[3]) && t[3] !== 's'))],
  [B('🔴 KIRMIZI olanları patlat', '🔴 Pop the RED ones'), em(FOODS.filter(f => f[4] === 'k')), em(FOODS.filter(f => f[4] !== 'k'))],
  [B('🟡 SARI olanları patlat', '🟡 Pop the YELLOW ones'), em(FOODS.filter(f => f[4] === 's')), em(FOODS.filter(f => f[4] !== 's'))],
  [B('🦋 UÇANLARI patlat', '🦋 Pop the ones that FLY'), FLIERS, em(ANIMALS.filter(a => !FLIERS.includes(a[0]) && a[3] !== 1))],
];
ext('balon_patlat', { rules: RULES });
ext('fen_balon', { rules: RULES.slice(0, 5) });

// ———————————————————— 2) BANKADAN SORU ÜRETEN YENİ OYUNLAR ————————————————————
const KIDS = ['zeka_oyun', 'masal', 'oyuncak'];
const SCHOOL = ['kitap', 'fen', 'etut', 'arkadas', 'mat'];

// Bil bakalım: kategori soruları (oyuncak mı, meyve mi, kışın mı giyilir, havada mı gider, uçar mı, suda mı yaşar…)
function kidQuestion(rng, n) {
  const kind = rng.pick(['thing', 'thing', 'thing', 'fruit', 'veg', 'animal', 'fly', 'water', 'egg', 'herb', 'color']);
  if (kind === 'thing') {
    const g = rng.pick(Object.keys(THING_GROUPS));
    const right = rng.pick(THINGS.filter(t => t[3] === g));
    const clash = { g: 'gy', y: 'gy', t: 'thd', h: 'thd', d: 'thd' }[g] || g;
    const c = choice(rng, right, THINGS.filter(t => !clash.includes(t[3])), n, x => x[0]);
    return { prompt: [emo('🤔', 40), big(L(...THING_GROUPS[g]))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'fruit' || kind === 'veg') {
    const want = kind === 'fruit' ? 'm' : 's';
    const right = rng.pick(FOODS.filter(f => f[3] === want));
    const c = choice(rng, right, [...FOODS.filter(f => f[3] !== want && f[3] !== 'y'), ...THINGS.slice(0, 20)], n, x => x[0]);
    return { prompt: [emo(kind === 'fruit' ? '🧺' : '🥗', 40), big(kind === 'fruit' ? L('Hangisi MEYVE?', 'Which one is a FRUIT?') : L('Hangisi SEBZE?', 'Which one is a VEGETABLE?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'animal') {
    const right = rng.pick(ANIMALS);
    const c = choice(rng, right, [...FOODS, ...THINGS], n, x => x[0]);
    return { prompt: [emo('🐾', 40), big(L('Hangisi bir HAYVAN?', 'Which one is an ANIMAL?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'fly') {
    const right = rng.pick(ANIMALS.filter(a => FLIERS.includes(a[0])));
    const c = choice(rng, right, ANIMALS.filter(a => !FLIERS.includes(a[0]) && a[3] !== 1), n, x => x[0]);
    return { prompt: [emo('☁️', 40), big(L('Hangisi UÇABİLİR?', 'Which one can FLY?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'water') {
    const right = rng.pick(ANIMALS.filter(a => 'd'.includes(a[4])));
    const c = choice(rng, right, ANIMALS.filter(a => 'çcsoey'.includes(a[4]) && !FLIERS.includes(a[0])), n, x => x[0]);
    return { prompt: [emo('🌊', 40), big(L('Hangisi DENİZDE yaşar?', 'Which one lives in the SEA?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'egg') {
    const right = rng.pick(ANIMALS.filter(a => a[3] >= 1 && a[3] <= 5));
    const c = choice(rng, right, ANIMALS.filter(a => a[3] === 0 && a[0] !== '🦇'), n, x => x[0]);
    return { prompt: [emo('🥚', 40), big(L('Hangisi YUMURTLAR?', 'Which one lays EGGS?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  if (kind === 'herb') {
    const right = rng.pick(ANIMALS.filter(a => a[5] === 'o' && a[3] === 0));
    const c = choice(rng, right, ANIMALS.filter(a => a[5] === 'e' && a[3] === 0), n, x => x[0]);
    return { prompt: [emo('🌿', 40), big(L('Hangisi OT yer?', 'Which one eats PLANTS?'))], list: c.list, correct: c.correct, lbl: x => x[0] };
  }
  const COL = { k: ['KIRMIZI', 'RED', '🔴'], s: ['SARI', 'YELLOW', '🟡'], y: ['YEŞİL', 'GREEN', '🟢'], t: ['TURUNCU', 'ORANGE', '🟠'], m: ['MOR', 'PURPLE', '🟣'] };
  const ck = rng.pick(Object.keys(COL));
  const right = rng.pick(FOODS.filter(f => f[4] === ck && f[3] !== 'y'));
  const c = choice(rng, right, FOODS.filter(f => f[4] !== ck && f[3] !== 'y'), n, x => x[0]);
  return { prompt: [emo(COL[ck][2], 44), big(L(`Hangisi ${COL[ck][0]}?`, `Which one is ${COL[ck][1]}?`))], list: c.list, correct: c.correct, lbl: x => x[0] };
}
const kidRound = n => (rng) => { const q = kidQuestion(rng, n); return { prompt: q.prompt, opts: q.list.map(x => ({ label: q.lbl(x) })), correct: q.correct }; };
babyPick({ id: 'bil_bakalim', name: B('Bil Bakalım', 'Guess What'), icon: '🤔', at: KIDS, rounds: 8,
  how: [B('Soruyu dinle ya da oku: oyuncak mı, meyve mi, uçar mı?', 'Hear or read the question: a toy? a fruit? can it fly?'), B('Doğru resme dokun!', 'Tap the right picture!')], round: kidRound(3) });
babyPick({ id: 'bil_bakalim_okul', name: B('Bilgi Yarışması', 'Quiz Time'), icon: '🏆', at: SCHOOL, ages: [6, 13], rounds: 10,
  how: [B('Her soruda farklı bir konu: hayvanlar, yiyecekler, taşıtlar, eşyalar…', 'A different topic each time: animals, food, vehicles, things…'), B('Doğru resme dokun. 10 soru.', 'Tap the right picture. 10 questions.')], round: kidRound(4) });

// Resimli sözlük: kelimeyi oku → resmini bul (kendi dilinde); yabancı dil: İngilizce (Türkçe oyuncuya) / Türkçe (İngilizce oyuncuya)
const PIC = uniq(PICWORDS, p => p[0]);
const picRound = (foreign) => (rng, i) => {
  const right = rng.pick(PIC);
  const c = choice(rng, right, PIC, i < 3 ? 3 : 4, x => x[0]);
  const word = foreign ? (TR ? right[2] : right[1]) : (TR ? right[1] : right[2]);
  return { prompt: [big(foreign ? '🌍' : '📖', 30), big(word.toLocaleUpperCase(TR && !foreign ? 'tr-TR' : 'en-US'), 30)], opts: c.list.map(x => ({ label: x[0] })), correct: c.correct };
};
babyPick({ id: 'resim_kelime', name: B('Resimli Sözlük', 'Picture Dictionary'), icon: '📖', at: ['masal', 'kitap', 'etut'], ages: [4, 12], rounds: 8,
  how: [B('Kelimeyi oku.', 'Read the word.'), B('Onun resmini bul!', 'Find its picture!')], round: picRound(false) });
babyPick({ id: 'yabanci_kelime', name: B('İngilizce Resimli Kelime', 'Turkish Picture Words'), icon: '🌍', at: ['alan_dil', 'kitap', 'uni_ders', 'etut'], ages: [7, 99], rounds: 10,
  how: [B('İngilizce kelimeyi oku.', 'Read the Turkish word.'), B('Hangi resim? Dokun!', 'Which picture is it? Tap it!')], round: picRound(true) });

// Hayvanlar nerede yaşar?
const HAB_KEYS = Object.keys(HABITATS);
babyPick({ id: 'hayvan_yeri', name: B('Hayvanlar Nerede Yaşar?', 'Where Do Animals Live?'), icon: '🌍', at: ['fen', 'zeka_oyun', 'kitap'], rounds: 8,
  how: [B('Hayvana bak.', 'Look at the animal.'), B('Yaşadığı yere dokun!', 'Tap where it lives!')],
  round: (rng, i) => {
    const a = rng.pick(ANIMALS.filter(x => x[4] !== 'e'));
    const keys = choice(rng, a[4], HAB_KEYS.filter(k => k !== a[4] && !(a[4] === 'o' && k === 'y') && !(a[4] === 'y' && k === 'o') && !(a[4] === 't' && k === 'd') && !(a[4] === 'd' && k === 't') && k !== 'e'), i < 3 ? 3 : 4);
    return { prompt: [emo(a[0], 76), big(L(a[1], a[2]), 22)], opts: keys.list.map(k => ({ label: HABITATS[k][2] + '\n' + L(HABITATS[k][0], HABITATS[k][1]), style: { fontSize: '26px', whiteSpace: 'pre-line', lineHeight: 1.2 } })), correct: keys.correct };
  } });
// Hayvan sınıfı (6+): memeli mi, kuş mu…
babyPick({ id: 'hayvan_sinifi_bul', name: B('Hangi Sınıf?', 'Which Class?'), icon: '🦁', at: ['fen', 'kitap'], ages: [7, 99], rounds: 10,
  how: [B('Hayvan memeli mi, kuş mu, sürüngen mi, balık mı, böcek mi?', 'Is it a mammal, bird, reptile, fish or insect?'), B('Doğru sınıfa dokun.', 'Tap the right class.')],
  round: rng => {
    const a = rng.pick(ANIMALS.filter(x => x[3] <= 5));
    const c = choice(rng, a[3], [0, 1, 2, 3, 4, 5].filter(k => k !== a[3]), 4);
    return { prompt: [emo(a[0], 76), big(L(a[1], a[2]), 22)], opts: c.list.map(k => txtOpt(L(...CLASSES[k]))), correct: c.correct };
  } });
// Bayraklar ve kıtalar (9+)
babyPick({ id: 'bayrak_bil', name: B('Bayrağı Tanı', 'Name the Flag'), icon: '🏳️', at: ['alan_sozel', 'kitap', 'etut', 'dershane'], ages: [8, 99], rounds: 10,
  how: [B('Bayrağa bak.', 'Look at the flag.'), B('Hangi ülkenin bayrağı? Dokun!', 'Which country does it belong to? Tap it!')],
  round: rng => { const c = rng.pick(COUNTRIES); const ch = choice(rng, c, COUNTRIES, 4, x => x[1]); return { prompt: emo(c[0], 90), opts: ch.list.map(x => txtOpt(L(x[1], x[2]))), correct: ch.correct }; } });
babyPick({ id: 'kita_bul', name: B('Hangi Kıtada?', 'Which Continent?'), icon: '🗺️', at: ['alan_sozel', 'dershane', 'etut'], ages: [9, 99], rounds: 10,
  how: [B('Ülkenin hangi kıtada olduğunu bul.', 'Find which continent the country is on.'), B('Doğru kıtaya dokun.', 'Tap the right continent.')],
  round: rng => {
    const KT = [['Avrupa', 'Europe'], ['Asya', 'Asia'], ['Afrika', 'Africa'], ['Amerika', 'Americas'], ['Okyanusya', 'Oceania']];
    const c = rng.pick(COUNTRIES.filter(x => x[5] !== null)); const ch = choice(rng, c[5], [0, 1, 2, 3, 4].filter(k => k !== c[5]), 4);
    return { prompt: [emo(c[0], 60), big(L(c[1], c[2]), 22)], opts: ch.list.map(k => txtOpt(L(...KT[k]))), correct: ch.correct };
  } });
// İcatlar ve mucitler (10+)
pairGame({ id: 'mucit_icat', ages: [10, 99], name: B('Mucitler ve Buluşlar', 'Inventors and Inventions'), icon: '💡', at: ['fen', 'alan_sayisal', 'uni_ders', 'kitap'], tags: ['fen'], hint: B('Kim buldu?', 'Who came up with it?'),
  pairs: INVENTIONS.map(x => [B(x[0], x[1]), x[2]]) });
// Kim ne yer? (otçul / etçil / hepçil) sıralama
sortGame({ id: 'kim_ne_yer', name: B('Kim Ne Yer?', 'Who Eats What?'), icon: '🍽️', at: ['fen', 'zeka_oyun', 'kitap'], tags: ['fen'], bins: [B('🌿 Otçul', '🌿 Herbivore'), B('🥩 Etçil', '🥩 Carnivore'), B('🍽️ Hepçil', '🍽️ Omnivore')], target: 14,
  items: ANIMALS.filter(a => a[3] <= 3).map(a => [B(`${a[0]} ${a[1]}`, `${a[0]} ${a[2]}`), { o: 0, e: 1, h: 2 }[a[5]]]) });
// i18n-skip-end

// ———————————————————— 3) BEBEK OYUNLARININ KÜÇÜK LİSTELERİNİ BANKAYA BAĞLA ————————————————————
// i18n-skip-start
const SHADOWABLE = uniq([...ANIMALS, ...THINGS, ...FOODS].filter(x => !['🐦‍⬛', '🐻‍❄️', '🕊️', '🕷️', '🐿️'].includes(x[0])), x => x[0]);
ext('golge_esle', { round: (rng, i) => { const r = rng.pick(SHADOWABLE); const c = choice(rng, r, SHADOWABLE, i < 3 ? 3 : 4, x => x[0]);
  return { prompt: h('div', { style: { fontSize: '86px', lineHeight: 1, filter: 'brightness(0)', opacity: .85 } }, r[0]), opts: c.list.map(x => ({ label: x[0] })), correct: c.correct }; } });
ext('kelime_resim', { round: picRound(false) });
ext('meyve_bul', { round: (rng, i) => { const F = FOODS.filter(f => f[3] !== 'y'); const r = rng.pick(F); const c = choice(rng, r, F, i < 3 ? 3 : 4, x => x[0]);
  return { prompt: big(L(r[1], r[2]).toLocaleUpperCase(TR ? 'tr-TR' : 'en-US'), 28), opts: c.list.map(x => ({ label: x[0] })), correct: c.correct }; } });
ext('ilk_harf', { round: rng => {
  const P = PIC.filter(p => /^[A-Za-zÇĞİÖŞÜçğıöşü]/.test(L(p[1], p[2])));
  const r = rng.pick(P); const first = x => L(x[1], x[2]).toLocaleUpperCase(TR ? 'tr-TR' : 'en-US')[0];
  const letters = [...new Set(P.map(first))];
  const c = choice(rng, first(r), letters, 3);
  return { prompt: emo(r[0], 80), opts: c.list.map(l => ({ label: l, style: { fontWeight: 900 } })), correct: c.correct }; } });
const SIZEABLE = ANIMALS.filter(a => !['🐦‍⬛', '🐻‍❄️'].includes(a[0]));
ext('buyuk_kucuk', { round: rng => { const e = rng.pick(SIZEABLE)[0], bigger = rng.chance(0.5); const sizes = rng.shuffle([34, 70]);
  return { prompt: [emo(bigger ? '⬆️' : '⬇️', 34), big(bigger ? L('Hangisi BÜYÜK?', 'Which is BIG?') : L('Hangisi KÜÇÜK?', 'Which is SMALL?'), 24)], opts: sizes.map(sz => ({ label: e, style: { fontSize: sz + 'px' } })), correct: bigger ? sizes.indexOf(70) : sizes.indexOf(34) }; } });
const COUNTABLE = uniq([...FOODS.filter(f => f[3] !== 'y'), ...ANIMALS.filter(a => a[3] <= 4), ...THINGS.filter(t => t[3] === 'o')], x => x[0]).map(x => x[0]).filter(e => ![...e].some(ch => ch === '‍'));
ext('say_bakalim', { round: (rng, i) => {
  const n = rng.int(1, i < 3 ? 4 : 6), e = rng.pick(COUNTABLE);
  const nums = rng.shuffle([...new Set([n, ...rng.shuffle([1, 2, 3, 4, 5, 6].filter(x => x !== n)).slice(0, 2)])]);
  return { prompt: h('div', { style: { fontSize: '40px', letterSpacing: '4px', maxWidth: '260px', textAlign: 'center' } }, e.repeat(n)), opts: nums.map(x => ({ label: String(x), style: { fontWeight: 900 } })), correct: nums.indexOf(n) }; } });
ext('hangisi_cok', { round: rng => { const e = rng.pick(COUNTABLE); const a = rng.int(1, 5); let b; do b = rng.int(1, 6); while (b === a);
  return { prompt: big(L('Hangisi ÇOK?', 'Which has MORE?'), 24), opts: [a, b].map(x => ({ label: e.repeat(x), style: { fontSize: '24px', letterSpacing: '2px' } })), correct: a > b ? 0 : 1 }; } });
ext('nerede_yasar', { round: (rng, i) => {
  const a = rng.pick(ANIMALS.filter(x => x[4] !== 'e'));
  const keys = choice(rng, a[4], HAB_KEYS.filter(k => k !== a[4] && k !== 'e' && !(a[4] + k).match(/^(oy|yo|td|dt)$/)), i < 3 ? 3 : 4);
  return { prompt: [emo(a[0], 70), big('🏠 ❓', 26)], opts: keys.list.map(k => ({ label: HABITATS[k][2] })), correct: keys.correct }; } });
// Hafıza kartları: daha geniş resim havuzu
ext('hayvan_kartlari', { items: uniq(ANIMALS.filter(a => a[3] <= 4), a => a[0]).map(a => a[0]) });
ext('oyuncak_kartlari', { items: THINGS.filter(t => 'oz'.includes(t[3])).map(t => t[0]) });
ext('kart_hafiza', { items: uniq([...FOODS, ...THINGS], x => x[0]).map(x => x[0]).slice(0, 80) });
// i18n-skip-end
