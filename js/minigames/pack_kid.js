// Okul çağı (6–13) ek oyunları: matematik, okuma, fen, kodlama, spor, arkadaşlar, ev ve aile, mahalle, tarla, sanat.
// Metinler iki dilli (B). Her oyun "at" ile ilgili eylemin havuzuna girer.
import { B, lang } from '../core/i18n.js';
import { quickGame, sortGame, catchGame, whackGame } from './engines.js';
import { memoryGame, flappyGame, jumpGame, snakeGame, breakoutGame, reactGame, orderGame, compareGame, mazeGame, codeGame, slideGame, lightsGame, rhythmGame, dodgeGame, guessGame } from './engines3.js';
import { mashGame, throwGame, spotGame, schulteGame, sudokuGame, shellGame, stroopGame, patternGame, wordGame, packGame, sumGame, popGame, cleanGame, sliceGame, traceGame } from './engines4.js';

const TR = () => lang === 'tr';
const P = pairs => pairs.map(([a, b]) => B(a, b));
const S = (title, steps) => [B(title[0], title[1]), P(steps)];
const K = (task, need, extra) => [B(task[0], task[1]), P(need), P(extra)];
const nums = n => Array.from({ length: n }, (_, i) => String(i + 1));

// ———————————————— MATEMATİK ————————————————
quickGame({ id: 'carpim_tablosu', ages: [7, 99], name: B('Çarpım Tablosu', 'Times Tables'), icon: '✖️', at: ['mat', 'etut'], tags: ['zeka'], target: 14,
  gen: (rng, d) => { const a = rng.int(2, d > 0.5 ? 12 : 9), b = rng.int(2, 9), c = a * b; const w = new Set(); while (w.size < 3) { const x = c + rng.pick([-b, b, -a, a, 1, -1, 10, -10]); if (x > 0 && x !== c) w.add(x); } return { q: `${a} × ${b} = ?`, a: c, w: [...w] }; } });
quickGame({ id: 'bolme_hizli', ages: [8, 99], name: B('Bölme Yarışı', 'Division Race'), icon: '➗', at: ['mat', 'dershane'], tags: ['zeka'], target: 12,
  gen: (rng, d) => { const b = rng.int(2, d > 0.5 ? 12 : 9), c = rng.int(2, 10), a = b * c; const w = new Set(); while (w.size < 3) { const x = c + rng.pick([-2, -1, 1, 2, 3]); if (x > 0 && x !== c) w.add(x); } return { q: `${a} ÷ ${b} = ?`, a: c, w: [...w] }; } });
quickGame({ id: 'saat_hesabi', ages: [8, 99], name: B('Saat Kaç Olur?', 'What Time Will It Be?'), icon: '⏰', at: ['mat'], tags: ['zeka'], target: 10,
  gen: rng => {
    const hh = rng.int(1, 11), mm = rng.pick([0, 15, 20, 30, 40, 45, 50]), add = rng.pick([10, 15, 20, 25, 30, 40, 45]);
    const f = x => { const m = ((x % 720) + 720) % 720; const H = Math.floor(m / 60) || 12; return `${H}:${String(m % 60).padStart(2, '0')}`; };
    const t0 = hh * 60 + mm, a = f(t0 + add);
    const w = [...new Set([f(t0 + add + 10), f(t0 + add - 10), f(t0 + add + 60), f(t0 - add)])].filter(x => x !== a).slice(0, 3);
    return { q: `⏰ ${f(t0)} + ${add}′ = ?`, a, w };
  } });
schulteGame({ id: 'sayi_avi', name: B('Sayı Avı', 'Number Hunt'), icon: '🔢', at: ['mat', 'etut', 'dershane'], tags: ['zeka'], labels: (rng, n) => nums(n) });
sumGame({ id: 'kumbara', name: B('Kumbara', 'Piggy Bank'), icon: '🐷', at: ['mat', 'bakkal'], tags: ['zeka', 'ticaret'], ask: B('Kumbaradan tam bu kadar para çıkar:', 'Take exactly this much from the piggy bank:'), unit: '🪙', values: [1, 2, 5, 10, 20, 50] });
sudokuGame({ id: 'meyve_sudoku', name: B('Meyve Sudoku', 'Fruit Sudoku'), icon: '🍓', at: ['mat', 'kitap', 'etut'], tags: ['zeka'], symbols: ['🍎', '🍌', '🍇', '🍊'] });
guessGame({ id: 'sayi_tahmin', name: B('Aklımdan Bir Sayı', "I'm Thinking of a Number"), icon: '🤔', at: ['mat', 'arkadas'], tags: ['zeka'], ask: B('Aklımdan 1 ile 100 arasında bir sayı tuttum.', "I'm thinking of a number between 1 and 100."), min: 1, max: 100 });
patternGame({ id: 'desen_ezber', name: B('Desen Ezberle', 'Memorise the Pattern'), icon: '🟪', at: ['mat', 'fen', 'etut'], tags: ['zeka'], mark: '⭐' });
codeGame({ id: 'kasa_sifre', ages: [8, 99], name: B('Kasa Şifresi', 'Safe Code'), icon: '🔐', at: ['mat', 'kodlama'], tags: ['zeka'], symbols: ['1', '2', '3', '4', '5', '6'] });

// ———————————————— OKUMA ————————————————
// i18n-skip-start
const WORDS = [['🍎', 'ELMA', 'APPLE'], ['🐱', 'KEDİ', 'CAT'], ['🚗', 'ARABA', 'CAR'], ['🏠', 'EV', 'HOUSE'], ['⚽', 'TOP', 'BALL'], ['🐟', 'BALIK', 'FISH'], ['🌳', 'AĞAÇ', 'TREE'],
  ['🍌', 'MUZ', 'BANANA'], ['🐶', 'KÖPEK', 'DOG'], ['🌙', 'AY', 'MOON'], ['📚', 'KİTAP', 'BOOK'], ['🦁', 'ASLAN', 'LION'], ['🐸', 'KURBAĞA', 'FROG'], ['🍞', 'EKMEK', 'BREAD'],
  ['🌸', 'ÇİÇEK', 'FLOWER'], ['⏰', 'SAAT', 'CLOCK'], ['🔑', 'ANAHTAR', 'KEY'], ['🎈', 'BALON', 'BALLOON'], ['🧀', 'PEYNİR', 'CHEESE'], ['🐢', 'KAPLUMBAĞA', 'TURTLE'], ['🚲', 'BİSİKLET', 'BICYCLE'], ['☀️', 'GÜNEŞ', 'SUN']];
const OPP_TR = [['sıcak', 'soğuk'], ['büyük', 'küçük'], ['uzun', 'kısa'], ['hızlı', 'yavaş'], ['açık', 'kapalı'], ['dolu', 'boş'], ['yeni', 'eski'], ['ağır', 'hafif'], ['gece', 'gündüz'], ['iç', 'dış'],
  ['ileri', 'geri'], ['güçlü', 'zayıf'], ['mutlu', 'üzgün'], ['erken', 'geç'], ['kalın', 'ince'], ['yukarı', 'aşağı'], ['ıslak', 'kuru'], ['temiz', 'kirli'], ['sert', 'yumuşak'], ['cesur', 'korkak']];
const OPP_EN = [['hot', 'cold'], ['big', 'small'], ['long', 'short'], ['fast', 'slow'], ['open', 'closed'], ['full', 'empty'], ['new', 'old'], ['heavy', 'light'], ['night', 'day'], ['inside', 'outside'],
  ['forward', 'backward'], ['strong', 'weak'], ['happy', 'sad'], ['early', 'late'], ['thick', 'thin'], ['up', 'down'], ['wet', 'dry'], ['clean', 'dirty'], ['hard', 'soft'], ['brave', 'scared']];
// i18n-skip-end
wordGame({ id: 'kelime_kur', name: B('Kelime Kur', 'Build the Word'), icon: '🔤', at: ['kitap', 'etut'], tags: ['dil'], words: WORDS });
quickGame({ id: 'zit_anlam', ages: [7, 99], name: B('Zıt Anlam', 'Opposites'), icon: '↔️', at: ['kitap', 'etut'], tags: ['dil'], target: 12,
  gen: rng => { const L = TR() ? OPP_TR : OPP_EN; const [a, b] = rng.pick(L); const flip = rng.chance(0.5); const w = flip ? b : a, ans = flip ? a : b; const wr = rng.shuffle(L.flat().filter(x => x !== ans && x !== w)).slice(0, 3); return { q: TR() ? `"${w}" kelimesinin zıttı?` : `Opposite of "${w}"?`, a: ans, w: wr }; } });
orderGame({ id: 'masal_sirasi', ages: [6, 14], name: B('Masalı Sırala', 'Story Order'), icon: '📖', at: ['kitap'], tags: ['dil'], sets: [
  S(['Kaplumbağa ile Tavşan', 'The Tortoise and the Hare'], [['Tavşan kaplumbağayla yarışa girer.', 'The hare challenges the tortoise to a race.'], ['Tavşan hızla öne geçer.', 'The hare races ahead.'], ['Tavşan ağacın altında uyur.', 'The hare naps under a tree.'], ['Kaplumbağa durmadan yürür.', 'The tortoise keeps walking.'], ['Kaplumbağa yarışı kazanır.', 'The tortoise wins the race.']]),
  S(['Kırmızı Başlıklı Kız', 'Little Red Riding Hood'], [['Annesi ona bir sepet verir.', 'Her mother gives her a basket.'], ['Ormanda kurtla karşılaşır.', 'She meets a wolf in the woods.'], ['Kurt ninenin evine koşar.', 'The wolf runs to grandma\'s house.'], ['Kız "Ne büyük dişlerin var!" der.', 'She says, "What big teeth you have!"'], ['Avcı gelir ve herkesi kurtarır.', 'The hunter arrives and saves everyone.']]),
  S(['Üç Küçük Domuz', 'The Three Little Pigs'], [['Domuzlar ev yapmaya karar verir.', 'The pigs decide to build houses.'], ['Biri samandan, biri çubuktan ev yapar.', 'One builds with straw, one with sticks.'], ['Üçüncüsü tuğladan ev yapar.', 'The third builds with bricks.'], ['Kurt üfler, ilk iki ev yıkılır.', 'The wolf huffs and blows two houses down.'], ['Tuğla ev sağlam kalır.', 'The brick house stands strong.']]),
  S(['Karınca ile Ağustos Böceği', 'The Ant and the Grasshopper'], [['Yaz gelir, güneş parlar.', 'Summer comes and the sun shines.'], ['Karınca kış için yiyecek toplar.', 'The ant gathers food for winter.'], ['Ağustos böceği şarkı söyler.', 'The grasshopper sings all day.'], ['Kış gelir, her yer karla kaplanır.', 'Winter comes with snow everywhere.'], ['Karınca yiyeceğini paylaşır.', 'The ant shares its food.']]),
  S(['Bir günüm', 'My day'], [['Uyanırım.', 'I wake up.'], ['Kahvaltı yaparım.', 'I have breakfast.'], ['Okula giderim.', 'I go to school.'], ['Ödevimi yaparım.', 'I do my homework.'], ['Uyurum.', 'I go to sleep.']]),
] });
memoryGame({ id: 'hikaye_hafiza', name: B('Masal Kartları', 'Fairy-Tale Cards'), icon: '🏰', at: ['kitap'], tags: ['dil'], back: '📕', bg: '#4a2a4a', items: ['🏰', '🐉', '👑', '🗝️', '🧙', '🦄', '🧚', '🏴‍☠️', '🪄'] });
spotGame({ id: 'kutuphane_bul', name: B('Kütüphanede Ara', 'Library Search'), icon: '📕', at: ['kitap'], tags: ['dil'], bg: '#3a2a1e', targets: ['📕', '📗', '📘', '📙'], noise: ['📚', '📓', '📔', '📒', '🗞️', '📰', '🖋️', '📜', '🔖'] });
sudokuGame({ id: 'harf_sudoku', name: B('Harf Sudoku', 'Letter Sudoku'), icon: '🔠', at: ['kitap'], tags: ['dil'], symbols: ['A', 'B', 'C', 'D'] });

// ———————————————— FEN ————————————————
orderGame({ id: 'yasam_dongusu', name: B('Yaşam Döngüsü', 'Life Cycles'), icon: '🦋', at: ['fen', 'alan_sayisal'], tags: ['fen'], sets: [
  S(['Kelebeğin yaşamı', 'A butterfly\'s life'], [['🥚 Yumurta', '🥚 Egg'], ['🐛 Tırtıl', '🐛 Caterpillar'], ['🫘 Koza', '🫘 Chrysalis'], ['🦋 Kelebek', '🦋 Butterfly']]),
  S(['Kurbağanın yaşamı', 'A frog\'s life'], [['🥚 Yumurta', '🥚 Frogspawn'], ['〰️ İribaş', '〰️ Tadpole'], ['🦵 Bacaklı iribaş', '🦵 Tadpole with legs'], ['🐸 Kurbağa', '🐸 Frog']]),
  S(['Bitkinin yaşamı', 'A plant\'s life'], [['🌰 Tohum', '🌰 Seed'], ['🌱 Filiz', '🌱 Sprout'], ['🌿 Fide', '🌿 Seedling'], ['🌻 Çiçek', '🌻 Flower'], ['🍎 Meyve', '🍎 Fruit']]),
  S(['Su döngüsü', 'The water cycle'], [['🌊 Deniz suyu ısınır', '🌊 Sea water warms up'], ['♨️ Buharlaşır', '♨️ It evaporates'], ['☁️ Bulut olur', '☁️ Clouds form'], ['🌧️ Yağmur yağar', '🌧️ Rain falls'], ['🏞️ Nehirle denize döner', '🏞️ Rivers carry it back to the sea']]),
  S(['Tavuğun yaşamı', 'A chicken\'s life'], [['🥚 Yumurta', '🥚 Egg'], ['🐣 Yumurtadan çıkış', '🐣 Hatching'], ['🐥 Civciv', '🐥 Chick'], ['🐔 Tavuk', '🐔 Hen']]),
] });
// i18n-skip-start
compareGame({ id: 'gezegen_boyut', name: B('Gezegen Devleri', 'Planet Giants'), icon: '🪐', at: ['fen', 'alan_sayisal'], tags: ['fen'], ask: B('Hangisinin çapı daha büyük?', 'Which has the larger diameter?'), unit: 'km',
  items: [[B('☿️ Merkür', '☿️ Mercury'), 4879], [B('♀️ Venüs', '♀️ Venus'), 12104], [B('🌍 Dünya', '🌍 Earth'), 12742], [B('🔴 Mars', '🔴 Mars'), 6779], [B('🪐 Jüpiter', '🪐 Jupiter'), 139820], [B('🪐 Satürn', '🪐 Saturn'), 116460], [B('🔵 Uranüs', '🔵 Uranus'), 50724], [B('🔵 Neptün', '🔵 Neptune'), 49244], [B('🌕 Ay', '🌕 The Moon'), 3475]] });
compareGame({ id: 'hayvan_hiz', name: B('Kim Daha Hızlı?', 'Who Is Faster?'), icon: '🐆', at: ['fen', 'kitap', 'kosu'], tags: ['fen'], ask: B('Hangisi daha hızlı koşar / yüzer?', 'Which one runs or swims faster?'), unit: 'km/h',
  items: [[B('🐆 Çita', '🐆 Cheetah'), 110], [B('🦁 Aslan', '🦁 Lion'), 80], [B('🐎 At', '🐎 Horse'), 88], [B('🐇 Yabani tavşan', '🐇 Hare'), 72], [B('🐘 Fil', '🐘 Elephant'), 40], [B('🏃 Usain Bolt', '🏃 Usain Bolt'), 44],
    [B('🐢 Kara kaplumbağası', '🐢 Tortoise'), 0.3], [B('🐌 Salyangoz', '🐌 Snail'), 0.05], [B('🦒 Zürafa', '🦒 Giraffe'), 60], [B('🐻 Boz ayı', '🐻 Grizzly bear'), 56], [B('🐈 Ev kedisi', '🐈 House cat'), 48], [B('🐬 Yunus', '🐬 Dolphin'), 37]] });
compareGame({ id: 'hayvan_agirlik', name: B('Kim Daha Ağır?', 'Who Is Heavier?'), icon: '🐘', at: ['fen', 'kitap'], tags: ['fen'], ask: B('Hangisi daha ağır?', 'Which is heavier?'), unit: 'kg',
  items: [[B('🐋 Mavi balina', '🐋 Blue whale'), 150000], [B('🐘 Fil', '🐘 Elephant'), 6000], [B('🦒 Zürafa', '🦒 Giraffe'), 1200], [B('🐄 İnek', '🐄 Cow'), 700], [B('🐎 At', '🐎 Horse'), 500], [B('🐻‍❄️ Kutup ayısı', '🐻‍❄️ Polar bear'), 450],
    [B('🦁 Aslan', '🦁 Lion'), 190], [B('🧍 İnsan', '🧍 Human'), 70], [B('🐧 İmparator penguen', '🐧 Emperor penguin'), 30], [B('🐕 Köpek', '🐕 Dog'), 25], [B('🐈 Kedi', '🐈 Cat'), 4], [B('🐔 Tavuk', '🐔 Chicken'), 2]] });
// i18n-skip-end
popGame({ id: 'fen_balon', name: B('Bilim Balonları', 'Science Balloons'), icon: '🔬', at: ['fen'], tags: ['fen'], rules: [
  [B('🐾 MEMELİLERİ patlat', '🐾 Pop the MAMMALS'), ['🐄', '🐬', '🦇', '🐘', '🐒', '🐋'], ['🐔', '🐟', '🐍', '🐸', '🦋', '🐢']],
  [B('🐞 BÖCEKLERİ patlat', '🐞 Pop the INSECTS'), ['🐝', '🐞', '🦋', '🐜', '🦗', '🪲'], ['🕷️', '🐌', '🐛', '🐦', '🐟', '🦂'].filter(x => x !== '🐛')],
  [B('🪐 GEZEGENLERİ patlat', '🪐 Pop the PLANETS'), ['🪐', '🌍'], ['☀️', '🌙', '⭐', '☄️']],
  [B('💧 SIVILARI patlat', '💧 Pop the LIQUIDS'), ['💧', '🥛', '☕', '🧃', '🍯'], ['🧊', '🪨', '🧱', '🎈', '🍞']],
] });
packGame({ id: 'deney_hazirla', name: B('Deney Masası', 'Lab Bench'), icon: '🧪', at: ['fen', 'alan_sayisal'], tags: ['fen'], sets: [
  K(['🌋 Yanardağ deneyi', '🌋 Volcano experiment'], [['🧂 Karbonat', '🧂 Baking soda'], ['🍶 Sirke', '🍶 Vinegar'], ['🫙 Kavanoz', '🫙 Jar']], [['🧲 Mıknatıs', '🧲 Magnet'], ['🔋 Pil', '🔋 Battery'], ['🌱 Tohum', '🌱 Seed'], ['🧵 İp', '🧵 String'], ['💡 Ampul', '💡 Bulb'], ['🍫 Çikolata', '🍫 Chocolate']]),
  K(['🌱 Fasulye yetiştir', '🌱 Grow a bean'], [['🫘 Fasulye', '🫘 Bean'], ['🪴 Toprak', '🪴 Soil'], ['💧 Su', '💧 Water'], ['☀️ Güneş ışığı', '☀️ Sunlight']], [['🧂 Tuz', '🧂 Salt'], ['🔋 Pil', '🔋 Battery'], ['🧊 Buz', '🧊 Ice'], ['🧲 Mıknatıs', '🧲 Magnet'], ['🍶 Sirke', '🍶 Vinegar']]),
  K(['💡 Basit elektrik devresi', '💡 Simple circuit'], [['🔋 Pil', '🔋 Battery'], ['〰️ Kablo', '〰️ Wire'], ['💡 Ampul', '💡 Bulb']], [['🧂 Tuz', '🧂 Salt'], ['🌱 Tohum', '🌱 Seed'], ['🧵 Yün ip', '🧵 Wool'], ['🍶 Sirke', '🍶 Vinegar'], ['🪶 Tüy', '🪶 Feather']]),
  K(['🧲 Mıknatıs neyi çeker?', '🧲 What does a magnet pull?'], [['📎 Ataç', '📎 Paper clip'], ['🔩 Demir vida', '🔩 Iron screw'], ['🪛 Çelik tornavida', '🪛 Steel screwdriver']], [['🪵 Tahta', '🪵 Wood'], ['🧻 Kâğıt', '🧻 Paper'], ['🥤 Plastik bardak', '🥤 Plastic cup'], ['🧦 Çorap', '🧦 Sock'], ['🪨 Taş', '🪨 Stone']]),
] });
sortGame({ id: 'madde_hali', name: B('Katı, Sıvı, Gaz', 'Solid, Liquid, Gas'), icon: '🧊', at: ['fen'], tags: ['fen'], bins: [B('🧱 Katı', '🧱 Solid'), B('💧 Sıvı', '💧 Liquid'), B('💨 Gaz', '💨 Gas')], target: 14,
  items: [[B('🧊 Buz', '🧊 Ice'), 0], [B('🪨 Taş', '🪨 Stone'), 0], [B('🪵 Odun', '🪵 Wood'), 0], [B('🥄 Kaşık', '🥄 Spoon'), 0], [B('🧈 Tereyağı (buzdolabında)', '🧈 Butter (from the fridge)'), 0],
    [B('🥛 Süt', '🥛 Milk'), 1], [B('💧 Su', '💧 Water'), 1], [B('🍯 Bal', '🍯 Honey'), 1], [B('🫒 Zeytinyağı', '🫒 Olive oil'), 1], [B('🧃 Meyve suyu', '🧃 Juice'), 1],
    [B('♨️ Su buharı', '♨️ Steam'), 2], [B('🎈 Balondaki hava', '🎈 Air in a balloon'), 2], [B('🫧 Gazozun kabarcığı', '🫧 Soda bubbles'), 2], [B('🌬️ Rüzgâr', '🌬️ Wind'), 2]] });
spotGame({ id: 'mikroskop', name: B('Mikroskop', 'Microscope'), icon: '🔬', at: ['fen', 'alan_sayisal'], tags: ['fen'], bg: '#1d3a2e', ask: B('Bul:', 'Find:'), targets: ['🦠'], noise: ['⚪', '🟢', '🫧', '🟡', '💚', '🔘', '🟤'] });
patternGame({ id: 'yildiz_haritasi', name: B('Takımyıldızı', 'Constellations'), icon: '✨', at: ['fen'], tags: ['fen'], mark: '⭐', bg: '#0c1030', markBg: '#23285a' });
lightsGame({ id: 'lamba_devre', name: B('Lambaları Söndür', 'Lights Out'), icon: '💡', at: ['fen', 'tamir', 'ev_isi'], tags: ['teknik'], on: '💡', off: '⚫' });

// ———————————————— KODLAMA ————————————————
mazeGame({ id: 'robot_labirent', name: B('Robot Labirenti', 'Robot Maze'), icon: '🤖', at: ['kodlama'], tags: ['teknik'], player: '🤖', goal: '🔋', items: ['💾'], wall: '#5ce1e6', bg: '#0f1d33' });
schulteGame({ id: 'ikili_sayi', name: B('İkilik Sayılar', 'Binary Numbers'), icon: '💻', at: ['kodlama'], tags: ['teknik'], hint: '1, 10, 11, 100…', labels: (rng, n) => Array.from({ length: n }, (_, i) => (i + 1).toString(2)) });
orderGame({ id: 'algoritma_adim', name: B('Algoritma Kur', 'Build the Algorithm'), icon: '🧑‍💻', at: ['kodlama', 'mat'], tags: ['teknik'], sets: [
  S(['Diş fırçalama algoritması', 'Tooth-brushing algorithm'], [['Fırçayı al', 'Pick up the brush'], ['Macunu sür', 'Add toothpaste'], ['2 dakika fırçala', 'Brush for 2 minutes'], ['Ağzını çalkala', 'Rinse your mouth'], ['Fırçayı yıka', 'Rinse the brush']]),
  S(['Çay demleme', 'Brewing tea'], [['Suyu kaynat', 'Boil the water'], ['Demliğe çay koy', 'Put tea in the teapot'], ['Kaynar suyu dök', 'Pour the boiling water'], ['15 dakika demle', 'Let it brew for 15 minutes'], ['Bardağa doldur', 'Pour into a glass']]),
  S(['Oyuna giriş', 'Logging in to a game'], [['Uygulamayı aç', 'Open the app'], ['Kullanıcı adını yaz', 'Type your username'], ['Şifreni yaz', 'Type your password'], ['Giriş\'e bas', 'Press Log in'], ['Oyunu başlat', 'Start the game']]),
  S(['Sayıları topla', 'Adding numbers'], [['toplam = 0', 'total = 0'], ['Sıradaki sayıyı al', 'Take the next number'], ['toplam = toplam + sayı', 'total = total + number'], ['Sayı bitti mi? Değilse başa dön', 'Out of numbers? If not, repeat'], ['Toplamı yaz', 'Print the total']]),
] });
breakoutGame({ id: 'bug_avla', name: B('Hata Avcısı', 'Bug Hunter'), icon: '🐛', at: ['kodlama', 'job:yazilimci'], tags: ['teknik'], bricks: ['🐛', '🐞', '🪲', '🦗'], ball: '💿', paddle: '#5ce1e6', bg: '#0f1d33' });
snakeGame({ id: 'veri_yilani', name: B('Veri Yılanı', 'Data Snake'), icon: '🐍', at: ['kodlama', 'job:yazilimci'], tags: ['teknik'], head: '🐍', food: ['💾', '📀', '🧮'], bad: ['🐛'], body: '#5ce1e6', bg: '#0f1d33' });
stroopGame({ id: 'renk_tuzagi', ages: [7, 99], name: B('Renk Tuzağı', 'Colour Trap'), icon: '🎨', at: ['kodlama', 'mat', 'arkadas', 'kitap'], tags: ['zeka'] });

// ———————————————— SPOR ————————————————
jumpGame({ id: 'cit_atlama', name: B('Çit Atlama', 'Hurdle Jump'), icon: '🏃', at: ['kosu', 'okul_takimi'], tags: ['spor'], player: '🏃', obstacles: ['🚧'], bonus: '🥇', bg: '#2a4a6a', ground: '#b5543c' });
jumpGame({ id: 'ip_atlama', ages: [6, 17], name: B('İp Atlama', 'Jump Rope'), icon: '🪢', at: ['kosu', 'arkadas', 'mahalle_maci'], tags: ['spor'], player: '🧒', obstacles: ['〰️', '➰'], bonus: '⭐', ground: '#555a6a' });
dodgeGame({ id: 'yakan_top', ages: [6, 17], name: B('Yakan Top', 'Dodgeball'), icon: '🏐', at: ['mahalle_maci', 'arkadas', 'okul_takimi'], tags: ['spor'], player: '🧒', bad: ['🏐'], good: ['⭐'], angle: true, bg: '#3a5a2a' });
throwGame({ id: 'kagit_top', ages: [6, 17], name: B('Çöpe Kâğıt Topu', 'Paper Ball Toss'), icon: '🗑️', at: ['arkadas', 'kitap', 'etut'], tags: ['spor'], thrower: '🧑‍🎓', target: '🗑️', ball: '📃', bg: '#3a3150', ground: '#6a5a4a' });
throwGame({ id: 'misket', ages: [6, 17], name: B('Misket', 'Marbles'), icon: '🔵', at: ['mahalle_maci', 'arkadas'], tags: ['spor'], thrower: '🧒', target: '⚪', ball: '🔵', ground: '#8a6a45', wind: false });
reactGame({ id: 'start_refleks', name: B('Start Çizgisi', 'Starting Line'), icon: '🏁', at: ['kosu', 'okul_takimi', 'altyapi'], tags: ['spor'], wait: '🔴', go: '🟢', fake: '🟡', goText: B('KOŞ!', 'GO!') });
reactGame({ id: 'kaleci_refleks', name: B('Kaleci Refleksi', 'Goalkeeper Reflex'), icon: '🧤', at: ['mahalle_maci', 'okul_takimi', 'altyapi', 'job:futbolcu'], tags: ['spor', 'futbol'], wait: '🧤', go: '⚽', fake: '🏐', goText: B('KURTAR!', 'SAVE!'), bg: '#1e4a2a' });
mashGame({ id: 'bisiklet_pompa', name: B('Bisiklet Pompası', 'Bike Pump'), icon: '🚲', at: ['kosu', 'arkadas', 'tamir'], tags: ['spor'], color: '#4d8dff', tapText: B('Pompala ama lastiği patlatma!', "Pump it, but don't burst the tyre!") });
flappyGame({ id: 'ucurtma', name: B('Uçurtma', 'Kite Flying'), icon: '🪁', at: ['arkadas', 'kosu'], tags: ['spor'], player: '🪁', wall: '#2f6b3a', cap: '🌳', bonus: '🌟', bg: '#3a78b8' });
breakoutGame({ id: 'duvar_topu', name: B('Duvar Topu', 'Wall Ball'), icon: '🧱', at: ['mahalle_maci', 'arkadas'], tags: ['spor'], bricks: ['🧱'], ball: '⚽', paddle: '#ffd166', bg: '#3a3040' });

// ———————————————— ARKADAŞLAR ————————————————
shellGame({ id: 'bardak_oyunu', name: B('Bardak Oyunu', 'Cups and Coin'), icon: '🥤', at: ['arkadas'], tags: ['zeka'], cup: '🥤', item: '🪙' });
memoryGame({ id: 'kart_hafiza', name: B('Hafıza Kartları', 'Memory Cards'), icon: '🃏', at: ['arkadas', 'kitap'], tags: ['zeka'], back: '🃏', items: ['🚀', '🦖', '🏆', '🎮', '🍕', '🎸', '🛹', '🦄', '🐙'] });
snakeGame({ id: 'yilan_klasik', name: B('Yılan', 'Snake'), icon: '🐍', at: ['arkadas'], tags: ['zeka'], head: '🐍', food: ['🍎'], body: '#7ee081' });
flappyGame({ id: 'ucak_ucur', name: B('Uçak Uçur', 'Fly the Plane'), icon: '🛩️', at: ['arkadas'], tags: ['zeka'], player: '🛩️', wall: '#6b7a90', cap: '☁️', bonus: '⭐', bg: '#27507a' });
breakoutGame({ id: 'tugla_kir', name: B('Tuğla Kır', 'Brick Breaker'), icon: '🟥', at: ['arkadas'], tags: ['zeka'], bricks: ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪'] });
rhythmGame({ id: 'dans_yarismasi', ages: [6, 30], name: B('Dans Yarışması', 'Dance-Off'), icon: '🕺', at: ['arkadas', 'muzik', 'kulup'], tags: ['muzik'], notes: ['💃', '🕺', '✨'], keys: ['⬅️', '⬆️', '➡️'], bg: '#2a1640' });
spotGame({ id: 'saklambac', ages: [6, 17], name: B('Saklambaç', 'Hide and Seek'), icon: '🙈', at: ['arkadas', 'mahalle_maci'], tags: ['sosyal'], bg: '#2a4a2a', ask: B('Sobele:', 'Find:'), targets: ['🧒', '👧', '🧑'], noise: ['🌳', '🌲', '🪨', '🏠', '🚗', '🌷', '🌿', '🛝', '🗑️', '🚲'] });
mazeGame({ id: 'hazine_avi', ages: [6, 17], name: B('Hazine Avı', 'Treasure Hunt'), icon: '💎', at: ['arkadas'], tags: ['zeka'], player: '🧒', goal: '💎', items: ['🗝️'], wall: '#ffb547', bg: '#2e2233' });

// ———————————————— EV İŞİ & AİLE ————————————————
cleanGame({ id: 'cam_sil', name: B('Cam Sil', 'Window Cleaning'), icon: '🪟', at: ['ev_isi'], tags: ['ev'], dirt: '#8f9aa6', dirtName: 'tozu', dirtNameEn: 'dust', spots: ['💧'], under: '#bfe3ff', reveal: ['🌳', '🏙️', '🌅', '🐦', '🌈'] });
cleanGame({ id: 'bulasik_yika', name: B('Bulaşık Yıka', 'Wash the Dishes'), icon: '🍽️', at: ['ev_isi', 'job:garson'], tags: ['ev'], dirt: '#a8834f', dirtName: 'yemek artığını', dirtNameEn: 'leftovers', spots: ['🍝', '🫧', '🍅'], under: '#f4f7ff', reveal: ['🍽️', '🥣', '🍳', '☕', '🥄'] });
sortGame({ id: 'camasir_ayir', name: B('Çamaşır Ayır', 'Sort the Laundry'), icon: '🧺', at: ['ev_isi'], tags: ['ev'], bins: [B('⚪ Beyazlar', '⚪ Whites'), B('🌈 Renkliler', '🌈 Colours')], target: 16,
  items: [[B('👕 Beyaz tişört', '👕 White T-shirt'), 0], [B('🧦 Beyaz çorap', '🧦 White socks'), 0], [B('🛏️ Beyaz çarşaf', '🛏️ White sheet'), 0], [B('🧻 Beyaz havlu', '🧻 White towel'), 0], [B('👔 Beyaz gömlek', '👔 White shirt'), 0],
    [B('👖 Kot pantolon', '👖 Jeans'), 1], [B('🧣 Kırmızı atkı', '🧣 Red scarf'), 1], [B('👗 Mavi elbise', '👗 Blue dress'), 1], [B('🧦 Yeşil çorap', '🧦 Green socks'), 1], [B('👕 Siyah tişört', '👕 Black T-shirt'), 1], [B('🩳 Sarı şort', '🩳 Yellow shorts'), 1]] });
lightsGame({ id: 'lambalari_kapat', name: B('Elektrik Tasarrufu', 'Save Electricity'), icon: '🔌', at: ['ev_isi', 'aile'], tags: ['ev'], on: '💡', off: '🌑', onBg: '#6b5a1a' });
spotGame({ id: 'kayip_corap', name: B('Kayıp Çorap', 'The Missing Sock'), icon: '🧦', at: ['ev_isi'], tags: ['ev'], bg: '#3a2f4a', targets: ['🧦'], noise: ['👕', '👖', '🧢', '🧤', '🧣', '👟', '🩳', '👗', '🎒', '🧸'] });
packGame({ id: 'sofra_kur', name: B('Sofrayı Kur', 'Set the Table'), icon: '🍽️', at: ['ev_isi', 'aile', 'job:garson'], tags: ['ev'], sets: [
  K(['🍲 Çorba içilecek', '🍲 Soup is served'], [['🥣 Kâse', '🥣 Bowl'], ['🥄 Kaşık', '🥄 Spoon'], ['🍞 Ekmek', '🍞 Bread']], [['🥢 Yemek çubuğu', '🥢 Chopsticks'], ['🍷 Kadeh', '🍷 Wine glass'], ['🔪 Balta', '🔪 Cleaver'], ['🍦 Dondurma külahı', '🍦 Ice-cream cone'], ['🧂 Şeker kavanozu', '🧂 Sugar jar']]),
  K(['🍳 Kahvaltı', '🍳 Breakfast'], [['🫖 Çaydanlık', '🫖 Teapot'], ['🧀 Peynir', '🧀 Cheese'], ['🫒 Zeytin', '🫒 Olives'], ['🍳 Yumurta', '🍳 Eggs']], [['🍝 Makarna', '🍝 Pasta'], ['🍰 Doğum günü pastası', '🍰 Birthday cake'], ['🌮 Tako', '🌮 Taco'], ['🥩 Kuzu tandır', '🥩 Roast lamb']]),
  K(['🍝 Makarna yenecek', '🍝 Pasta for dinner'], [['🍴 Çatal', '🍴 Fork'], ['🍽️ Düz tabak', '🍽️ Plate'], ['🧀 Rendelenmiş peynir', '🧀 Grated cheese']], [['🥣 Çorba kâsesi', '🥣 Soup bowl'], ['🥢 Yemek çubuğu', '🥢 Chopsticks'], ['☕ Türk kahvesi fincanı', '☕ Coffee cup'], ['🥄 Tatlı kaşığı', '🥄 Dessert spoon']]),
] });
memoryGame({ id: 'aile_albumu', name: B('Aile Albümü', 'Family Album'), icon: '📷', at: ['aile'], tags: ['sosyal'], back: '📷', bg: '#4a3a2a', items: ['👴', '👵', '👨', '👩', '👦', '👧', '👶', '🐶', '🏡'] });
orderGame({ id: 'tarif_sirasi', name: B('Tarifi Sırala', 'Recipe Order'), icon: '🍳', at: ['aile', 'ev_isi', 'job:garson'], tags: ['ev'], sets: [
  S(['🍳 Menemen', '🍳 Menemen (Turkish eggs)'], [['Biberi doğra', 'Chop the peppers'], ['Yağda kavur', 'Sauté in oil'], ['Domatesi ekle', 'Add the tomatoes'], ['Yumurtaları kır', 'Crack in the eggs'], ['Sıcak servis et', 'Serve hot']]),
  S(['🥪 Tost', '🥪 Toastie'], [['Ekmeği al', 'Take the bread'], ['Kaşarı koy', 'Add the cheese'], ['Ekmeği kapat', 'Close the sandwich'], ['Tost makinesine koy', 'Put it in the toaster'], ['Dilimle, afiyet olsun', 'Slice and enjoy']]),
  S(['🍋 Limonata', '🍋 Lemonade'], [['Limonları yıka', 'Wash the lemons'], ['Limonları sık', 'Squeeze the lemons'], ['Su ekle', 'Add water'], ['Şekeri karıştır', 'Stir in sugar'], ['Buz koy', 'Add ice']]),
  S(['🍝 Makarna', '🍝 Pasta'], [['Suyu kaynat', 'Boil water'], ['Tuz ekle', 'Add salt'], ['Makarnayı at', 'Add the pasta'], ['Süzgeçten geçir', 'Drain it'], ['Sosla karıştır', 'Mix with the sauce']]),
] });
packGame({ id: 'piknik_sepeti', name: B('Piknik Sepeti', 'Picnic Basket'), icon: '🧺', at: ['aile', 'arkadas'], tags: ['sosyal'], sets: [
  K(['🌳 Parkta piknik', '🌳 Picnic in the park'], [['🧺 Sepet', '🧺 Basket'], ['🥪 Sandviç', '🥪 Sandwiches'], ['💧 Su', '💧 Water'], ['🧻 Peçete', '🧻 Napkins']], [['⛷️ Kayak', '⛷️ Skis'], ['🧥 Kaban', '🧥 Heavy coat'], ['🖥️ Bilgisayar', '🖥️ Desktop computer'], ['🛁 Küvet', '🛁 Bathtub'], ['🎄 Yılbaşı ağacı', '🎄 Christmas tree']]),
  K(['🏖️ Deniz kenarı', '🏖️ At the beach'], [['🧴 Güneş kremi', '🧴 Sun cream'], ['🩱 Mayo', '🩱 Swimsuit'], ['🏖️ Şemsiye', '🏖️ Beach umbrella'], ['🍉 Karpuz', '🍉 Watermelon']], [['🧤 Eldiven', '🧤 Gloves'], ['⛸️ Paten', '⛸️ Ice skates'], ['📚 Ansiklopedi', '📚 Encyclopedia'], ['🔦 Kafa lambası', '🔦 Head torch'], ['🧣 Atkı', '🧣 Scarf']]),
  K(['⛺ Kamp', '⛺ Camping'], [['⛺ Çadır', '⛺ Tent'], ['🔦 Fener', '🔦 Torch'], ['🛏️ Uyku tulumu', '🛏️ Sleeping bag'], ['💧 Su', '💧 Water']], [['🖥️ Televizyon', '🖥️ Television'], ['👠 Topuklu ayakkabı', '👠 High heels'], ['🎂 Düğün pastası', '🎂 Wedding cake'], ['🪑 Koltuk takımı', '🪑 Sofa set']]),
] });
shellGame({ id: 'hediye_nerede', name: B('Hediye Hangisinde?', 'Which Box Has the Gift?'), icon: '🎁', at: ['aile'], tags: ['sosyal'], cup: '🎁', item: '🍬' });
sudokuGame({ id: 'aile_sudoku', name: B('Aile Sudokusu', 'Family Sudoku'), icon: '👨‍👩‍👧', at: ['aile'], tags: ['zeka'], symbols: ['👴', '👵', '👦', '👧'] });

// ———————————————— MAHALLE: BAKKAL, AYAK İŞİ, PAZAR ————————————————
sumGame({ id: 'para_ustu_kid', name: B('Para Üstü', 'Give the Change'), icon: '🪙', at: ['bakkal', 'pazar_isi', 'ayak_isi'], tags: ['ticaret'], ask: B('Müşteriye tam bu kadar para üstü ver:', 'Give the customer exactly this much change:'), unit: '🪙', values: [1, 5, 10, 20, 50, 100] });
spotGame({ id: 'raf_bul', name: B('Rafta Bul', 'Find It on the Shelf'), icon: '🛒', at: ['bakkal', 'ayak_isi', 'pazar_isi'], tags: ['ticaret'], bg: '#3a2a1a', targets: ['🧃', '🥫', '🍞', '🧀', '🥚', '🧈'], noise: ['🍫', '🍬', '🥛', '🍪', '🧂', '🍯', '🥤', '🍝', '🍚', '🫘', '🧴', '🧻'] });
mazeGame({ id: 'mahalle_teslimat', name: B('Mahalle Teslimatı', 'Neighbourhood Delivery'), icon: '🚲', at: ['ayak_isi', 'bakkal'], tags: ['ticaret'], player: '🚲', goal: '🏠', items: ['🥖'], wall: '#ffb547', bg: '#253047' });
packGame({ id: 'alisveris', name: B('Alışveriş Listesi', 'Shopping List'), icon: '📝', at: ['ayak_isi', 'bakkal', 'ev_isi'], tags: ['ticaret'], sets: [
  K(['🍳 Menemen yapılacak', '🍳 Making menemen'], [['🥚 Yumurta', '🥚 Eggs'], ['🍅 Domates', '🍅 Tomatoes'], ['🫑 Biber', '🫑 Peppers']], [['🍫 Çikolata', '🍫 Chocolate'], ['🧻 Tuvalet kâğıdı', '🧻 Toilet roll'], ['🍉 Karpuz', '🍉 Watermelon'], ['🧃 Meyve suyu', '🧃 Juice'], ['🍦 Dondurma', '🍦 Ice cream']]),
  K(['🎂 Kek yapılacak', '🎂 Baking a cake'], [['🌾 Un', '🌾 Flour'], ['🥚 Yumurta', '🥚 Eggs'], ['🍬 Şeker', '🍬 Sugar'], ['🥛 Süt', '🥛 Milk']], [['🧅 Soğan', '🧅 Onion'], ['🐟 Balık', '🐟 Fish'], ['🧄 Sarımsak', '🧄 Garlic'], ['🫒 Zeytin', '🫒 Olives']]),
  K(['🥗 Salata yapılacak', '🥗 Making a salad'], [['🥬 Marul', '🥬 Lettuce'], ['🥒 Salatalık', '🥒 Cucumber'], ['🍋 Limon', '🍋 Lemon']], [['🍫 Çikolata', '🍫 Chocolate'], ['🍬 Şeker', '🍬 Sugar'], ['🧁 Kek', '🧁 Cupcake'], ['🍭 Lolipop', '🍭 Lollipop']]),
] });
sumGame({ id: 'pazar_terazi', name: B('Pazar Terazisi', 'Market Scales'), icon: '⚖️', at: ['pazar_isi', 'bakkal'], tags: ['ticaret'], ask: B('Terazide tam bu ağırlığı tart:', 'Weigh out exactly this much:'), unit: 'g', values: [1000, 500, 250, 100, 50],
  label: v => v >= 1000 ? '1 kg' : `${v} g`, gen: rng => rng.pick([150, 300, 350, 600, 750, 850, 1250, 1500, 1750, 2100, 2350]) });

// ———————————————— TARLA & BAHÇE ————————————————
mazeGame({ id: 'misir_labirenti', name: B('Mısır Labirenti', 'Corn Maze'), icon: '🌽', at: ['tarla', 'arkadas'], tags: ['doga'], player: '🧑‍🌾', goal: '🚜', items: ['🌽'], wall: '#e4c34a', bg: '#35522a' });
sliceGame({ id: 'ot_bicme', name: B('Yabani Ot Biç', 'Weed Whacker'), icon: '🌿', at: ['tarla', 'bahce', 'job:ciftci'], tags: ['doga'], good: ['🌿', '🍂', '☘️'], bad: ['🌷', '🐞'], cutE: '🍃', bg: '#20361e' });
whackGame({ id: 'karga_kovala', name: B('Karga Kovala', 'Shoo the Crows'), icon: '🐦‍⬛', at: ['tarla', 'job:ciftci'], tags: ['doga'], good: '🐦‍⬛', bad: '🐔', hole: '🌾', holeBg: '#5a4a1c' });
dodgeGame({ id: 'ari_kac', name: B('Arılardan Kaç', 'Dodge the Bees'), icon: '🐝', at: ['tarla', 'bahce'], tags: ['doga'], player: '🧒', bad: ['🐝'], good: ['🍯'], angle: true, bg: '#2e4a24' });
catchGame({ id: 'yumurta_topla', name: B('Yumurta Topla', 'Egg Catch'), icon: '🥚', at: ['tarla', 'job:ciftci'], tags: ['doga'], basket: '🧺', good: ['🥚'], bad: ['🪨', '💩'], bg: '#4a3a20' });

// ———————————————— SANAT & MÜZİK & TAMİR ————————————————
traceGame({ id: 'serbest_cizim', name: B('Şekil Çiz', 'Draw the Shape'), icon: '✏️', at: ['resim'], tags: ['sanat'], shapes: ['yildiz', 'ev', 'sarmal', 'kalp', 'daire'], ink: '#b36bff' });
patternGame({ id: 'mozaik', name: B('Mozaik Ezber', 'Mosaic Memory'), icon: '🟧', at: ['resim'], tags: ['sanat'], mark: '🟧', bg: '#26204a', markBg: '#4a3a7a' });
quickGame({ id: 'renk_karistir', name: B('Renk Karıştır', 'Mix the Colours'), icon: '🎨', at: ['resim', 'fen'], tags: ['sanat'], target: 10,
  gen: rng => { const L = [['🔴 + 🟡', '🟠'], ['🔵 + 🟡', '🟢'], ['🔴 + 🔵', '🟣'], ['⚫ + ⚪', '🩶'], ['🔴 + ⚪', '🩷'], ['🔵 + ⚪', '🩵'], ['🟠 + ⚫', '🟤']]; const [q, a] = rng.pick(L); return { q: `${q} = ?`, a, w: rng.shuffle(['🟠', '🟢', '🟣', '🩶', '🩷', '🩵', '🟤', '🔴'].filter(x => x !== a)).slice(0, 3) }; } });
slideGame({ id: 'resim_yapboz', name: B('Resim Yapbozu', 'Picture Puzzle'), icon: '🖼️', at: ['resim', 'tamir'], tags: ['sanat'], tiles: ['🌅', '🌄', '🏞️', '🌇', '🌆', '🌉', '🏙️', '🌃'] });
rhythmGame({ id: 'piyano_tuslari', name: B('Piyano Tuşları', 'Piano Keys'), icon: '🎹', at: ['muzik'], tags: ['muzik'], notes: ['🎵', '🎶', '🎼'], keys: ['Do', 'Mi', 'Sol'], bg: '#15152a' });
orderGame({ id: 'nota_sirasi', name: B('Nota Sırası', 'Note Order'), icon: '🎼', at: ['muzik'], tags: ['muzik'], sets: [
  S(['Gam yukarı çık', 'Climb the scale'], [['Do', 'Do'], ['Re', 'Re'], ['Mi', 'Mi'], ['Fa', 'Fa'], ['Sol', 'Sol'], ['La', 'La']]),
  S(['Gamdan aşağı in', 'Down the scale'], [['Si', 'Ti'], ['La', 'La'], ['Sol', 'Sol'], ['Fa', 'Fa'], ['Mi', 'Mi'], ['Re', 'Re']]),
  S(['Uzundan kısaya nota süreleri', 'Note lengths, long to short'], [['𝅝 Birlik', '𝅝 Whole note'], ['𝅗𝅥 İkilik', '𝅗𝅥 Half note'], ['♩ Dörtlük', '♩ Quarter note'], ['♪ Sekizlik', '♪ Eighth note']]),
  S(['Sesi ince olandan kalına', 'Highest to lowest instrument'], [['🎶 Pikolo flüt', '🎶 Piccolo'], ['🎻 Keman', '🎻 Violin'], ['🎻 Viyola', '🎻 Viola'], ['🎻 Çello', '🎻 Cello'], ['🎻 Kontrbas', '🎻 Double bass']]),
] });
memoryGame({ id: 'enstruman_kart', name: B('Enstrüman Kartları', 'Instrument Cards'), icon: '🎸', at: ['muzik', 'muzik_bebek'], tags: ['muzik'], back: '🎵', bg: '#3a1f4a', items: ['🎸', '🎹', '🥁', '🎺', '🎻', '🪕', '🎷', '🪗', '🪘'] });
orderGame({ id: 'maket_montaj', name: B('Maket Montajı', 'Model Assembly'), icon: '🛠️', at: ['tamir'], tags: ['teknik'], sets: [
  S(['🐦 Kuş yuvası', '🐦 Birdhouse'], [['Tahtaları ölç', 'Measure the boards'], ['Kes ve zımparala', 'Cut and sand'], ['Duvarları çivile', 'Nail the walls'], ['Çatıyı tak', 'Fit the roof'], ['Boya ve as', 'Paint and hang it']]),
  S(['✈️ Model uçak', '✈️ Model plane'], [['Parçaları ayır', 'Separate the parts'], ['Gövdeyi yapıştır', 'Glue the body'], ['Kanatları tak', 'Attach the wings'], ['Tekerlekleri tak', 'Fit the wheels'], ['Çıkartmaları yapıştır', 'Add the stickers']]),
  S(['🚲 Patlak lastik', '🚲 Flat tyre'], [['Tekerleği sök', 'Remove the wheel'], ['İç lastiği çıkar', 'Take out the inner tube'], ['Deliği bul', 'Find the hole'], ['Yamayı yapıştır', 'Glue on a patch'], ['Şişir ve tak', 'Inflate and refit']]),
] });
packGame({ id: 'alet_cantasi', name: B('Alet Çantası', 'Toolbox'), icon: '🧰', at: ['tamir', 'job:cirak'], tags: ['teknik'], sets: [
  K(['🖼️ Duvara tablo as', '🖼️ Hang a picture'], [['🔨 Çekiç', '🔨 Hammer'], ['📌 Çivi', '📌 Nail'], ['📏 Metre', '📏 Tape measure']], [['🪚 Testere', '🪚 Saw'], ['🧽 Sünger', '🧽 Sponge'], ['🍳 Tava', '🍳 Frying pan'], ['🔧 Boru anahtarı', '🔧 Pipe wrench'], ['✂️ Makas', '✂️ Scissors']]),
  K(['🪑 Sallanan sandalye vidası', '🪑 Tighten a wobbly chair'], [['🪛 Tornavida', '🪛 Screwdriver'], ['🔩 Vida', '🔩 Screw']], [['🔨 Balyoz', '🔨 Sledgehammer'], ['🧴 Şampuan', '🧴 Shampoo'], ['🪚 Testere', '🪚 Saw'], ['🧯 Yangın tüpü', '🧯 Extinguisher'], ['🪣 Kova', '🪣 Bucket']]),
  K(['🚰 Damlayan musluk', '🚰 Dripping tap'], [['🔧 İngiliz anahtarı', '🔧 Wrench'], ['⭕ Conta', '⭕ Washer'], ['🧽 Bez', '🧽 Cloth']], [['🔨 Çekiç', '🔨 Hammer'], ['📌 Raptiye', '📌 Drawing pin'], ['🎨 Fırça', '🎨 Paintbrush'], ['🧲 Mıknatıs', '🧲 Magnet']]),
] });

// ———————————————— GÖNÜLLÜLÜK & KULÜP ————————————————
packGame({ id: 'deprem_cantasi', name: B('Deprem Çantası', 'Emergency Kit'), icon: '🎒', at: ['gonullu', 'aile'], tags: ['sosyal'], sets: [
  K(['🎒 Deprem çantası hazırla', '🎒 Pack an earthquake kit'], [['💧 Su', '💧 Water'], ['🔦 El feneri', '🔦 Torch'], ['🩹 İlk yardım seti', '🩹 First-aid kit'], ['📻 Pilli radyo', '📻 Battery radio'], ['🔋 Yedek pil', '🔋 Spare batteries']], [['🎮 Oyun konsolu', '🎮 Games console'], ['🖼️ Çerçeveli tablo', '🖼️ Framed picture'], ['🎂 Yaş pasta', '🎂 Cream cake'], ['🪴 Saksı', '🪴 Plant pot']]),
  K(['🏕️ Toplanma alanına giderken', '🏕️ Heading to the assembly point'], [['🪪 Kimlik', '🪪 ID card'], ['🧥 Mont', '🧥 Coat'], ['📯 Düdük', '📯 Whistle']], [['🛗 Asansör', '🛗 Lift'], ['📺 Televizyon', '📺 Television'], ['🎸 Gitar', '🎸 Guitar'], ['🛋️ Kanepe', '🛋️ Sofa']]),
] });
sortGame({ id: 'yardim_kolisi', name: B('Yardım Kolileri', 'Aid Parcels'), icon: '📦', at: ['gonullu', 'hayir'], tags: ['sosyal'], bins: [B('🥫 Gıda', '🥫 Food'), B('🧥 Giysi', '🧥 Clothes'), B('🧼 Hijyen', '🧼 Hygiene')], target: 14,
  items: [[B('🍚 Pirinç', '🍚 Rice'), 0], [B('🥫 Konserve', '🥫 Tinned food'), 0], [B('🫘 Mercimek', '🫘 Lentils'), 0], [B('🍝 Makarna', '🍝 Pasta'), 0],
    [B('🧥 Mont', '🧥 Coat'), 1], [B('🧤 Eldiven', '🧤 Gloves'), 1], [B('🧦 Yün çorap', '🧦 Wool socks'), 1], [B('🧣 Atkı', '🧣 Scarf'), 1],
    [B('🧼 Sabun', '🧼 Soap'), 2], [B('🪥 Diş fırçası', '🪥 Toothbrush'), 2], [B('🧴 Şampuan', '🧴 Shampoo'), 2], [B('🧻 Tuvalet kâğıdı', '🧻 Toilet roll'), 2]] });
orderGame({ id: 'cok_kapan_tutun', name: B('Deprem Tatbikatı', 'Earthquake Drill'), icon: '🦺', at: ['gonullu', 'kulup'], tags: ['sosyal'], sets: [
  S(['Deprem anında', 'During an earthquake'], [['Sakin kal', 'Stay calm'], ['ÇÖK', 'DROP'], ['KAPAN', 'COVER'], ['TUTUN', 'HOLD ON'], ['Sarsıntı bitince dışarı çık', 'Leave once the shaking stops']]),
  S(['Yangın görürsen', 'If you see a fire'], [['"Yangın var!" diye uyar', 'Shout "Fire!"'], ['112\'yi ara', 'Call the emergency number'], ['Merdivenden in, asansöre binme', 'Take the stairs, not the lift'], ['Toplanma alanına git', 'Go to the assembly point']]),
  S(['Küçük bir yarada', 'For a small cut'], [['Ellerini yıka', 'Wash your hands'], ['Yarayı suyla temizle', 'Rinse the cut with water'], ['Kurula', 'Pat it dry'], ['Yara bandı yapıştır', 'Put on a plaster']]),
] });
mazeGame({ id: 'fidan_dikimi', name: B('Fidan Dikimi', 'Tree Planting'), icon: '🌱', at: ['gonullu', 'bahce'], tags: ['doga'], player: '🧑‍🌾', goal: '🌳', items: ['🌱'], wall: '#8fd18a', bg: '#243a22' });
codeGame({ id: 'kulup_bulmaca', name: B('Kulüp Bulmacası', 'Club Puzzle'), icon: '🧩', at: ['kulup', 'arkadas'], tags: ['zeka'], symbols: ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'] });
