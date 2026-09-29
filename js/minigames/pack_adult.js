// Yetişkinlik ve yaşlılık ek oyunları: spor salonu, tatil, bakım, aşk, ebeveynlik, bahçe, sağlık, hayır, danışmanlık, piyasa, işletme.
import { B } from '../core/i18n.js';
import { sortGame, catchGame, whackGame, quickGame } from './engines.js';
import { fillGame } from './engines2.js';
import { memoryGame, flappyGame, jumpGame, reactGame, orderGame, mazeGame, codeGame, slideGame, rhythmGame, guessGame } from './engines3.js';
import { mashGame, throwGame, spotGame, sudokuGame, shellGame, patternGame, wordGame, packGame, sumGame, cleanGame, sliceGame, stroopGame } from './engines4.js';

const P = pairs => pairs.map(([a, b]) => B(a, b));
const S = (title, steps) => [B(title[0], title[1]), P(steps)];
const K = (task, need, extra) => [B(task[0], task[1]), P(need), P(extra)];

// ———————————————— SPOR SALONU & KOŞU ————————————————
throwGame({ id: 'bowling_atisi', name: B('Bowling Atışı', 'Bowling Roll'), icon: '🎳', at: ['spor_salonu', 'arkadas', 'partner', 'tanis'], tags: ['spor'], thrower: '🧍', target: '🎳', ball: '🎱', bg: '#2a1f3a', ground: '#a0764a' });
reactGame({ id: 'boks_refleks', name: B('Boks Refleksi', 'Boxing Reflex'), icon: '🥊', at: ['spor_salonu'], tags: ['spor'], wait: '🛡️', go: '🥊', fake: '🧤', waitText: B('Gardını al…', 'Guard up…'), goText: B('VUR!', 'PUNCH!'), bg: '#3a1a1a' });
rhythmGame({ id: 'aerobik', name: B('Aerobik Dersi', 'Aerobics Class'), icon: '🤸', at: ['spor_salonu', 'kosu'], tags: ['spor'], notes: ['🤸', '🙆', '🏃'], keys: ['👈', '🙌', '👉'], bg: '#2a1636' });
mashGame({ id: 'agirlik_kaldir', name: B('Halter', 'Weightlifting'), icon: '🏋️', at: ['spor_salonu'], tags: ['spor'], color: '#ff8a3d', tapText: B('Barı dengede tut, kontrolsüz kaldırma!', 'Keep the bar steady — no jerky lifts!') });
jumpGame({ id: 'bisiklet_turu', name: B('Bisiklet Turu', 'Bike Tour'), icon: '🚴', at: ['kosu', 'tatil', 'arkadas'], tags: ['spor'], player: '🚴', obstacles: ['🪨', '🕳️', '🪵'], bonus: '💧', bg: '#3a6a8a', ground: '#6b5a3a' });
flappyGame({ id: 'yuzme_nefes', name: B('Yüzme Nefesi', 'Swim Breathing'), icon: '🏊', at: ['spor_salonu', 'tatil'], tags: ['spor'], player: '🏊', wall: '#1e5a8a', cap: '🫧', bonus: '🐚', bg: '#0e3a5a', hitText: B('Su yuttun!', 'Swallowed water!') });

// ———————————————— TATİL ————————————————
flappyGame({ id: 'yamac_parasutu', name: B('Yamaç Paraşütü', 'Paragliding'), icon: '🪂', at: ['tatil'], tags: ['spor'], player: '🪂', wall: '#4a6a3a', cap: '🌲', bonus: '🦅', bg: '#5a9ad8' });
packGame({ id: 'bavul_hazirla', name: B('Bavul Hazırla', 'Pack the Suitcase'), icon: '🧳', at: ['tatil'], tags: ['sosyal'], sets: [
  K(['🏖️ Deniz tatili', '🏖️ Beach holiday'], [['🩱 Mayo', '🩱 Swimsuit'], ['🧴 Güneş kremi', '🧴 Sun cream'], ['🕶️ Güneş gözlüğü', '🕶️ Sunglasses'], ['🩴 Terlik', '🩴 Flip-flops']], [['🧤 Kalın eldiven', '🧤 Thick gloves'], ['⛷️ Kayak', '⛷️ Skis'], ['🧣 Yün atkı', '🧣 Wool scarf'], ['🥾 Kar botu', '🥾 Snow boots']]),
  K(['⛷️ Kayak tatili', '⛷️ Ski trip'], [['🧥 Mont', '🧥 Ski jacket'], ['🧤 Eldiven', '🧤 Gloves'], ['🥽 Kayak gözlüğü', '🥽 Goggles'], ['🧦 Termal çorap', '🧦 Thermal socks']], [['🩱 Mayo', '🩱 Swimsuit'], ['🏖️ Plaj şemsiyesi', '🏖️ Beach umbrella'], ['🩴 Terlik', '🩴 Flip-flops'], ['🍉 Karpuz', '🍉 Watermelon']]),
  K(['✈️ Yurt dışı seyahati', '✈️ Trip abroad'], [['🛂 Pasaport', '🛂 Passport'], ['🎫 Uçak bileti', '🎫 Plane ticket'], ['🔌 Priz dönüştürücü', '🔌 Plug adapter']], [['🪴 Saksı', '🪴 Pot plant'], ['🛏️ Yatak', '🛏️ Mattress'], ['🧊 Buz kalıbı', '🧊 Ice tray'], ['🎳 Bowling topu', '🎳 Bowling ball']]),
] });
memoryGame({ id: 'tatil_fotolari', name: B('Tatil Fotoğrafları', 'Holiday Snaps'), icon: '📸', at: ['tatil'], tags: ['sosyal'], back: '📷', bg: '#2a3a5a', items: ['🗽', '🗼', '🏰', '🗿', '🕌', '🏯', '🎡', '🌋', '🏝️'] });
sliceGame({ id: 'karpuz_kes', name: B('Meyve Kes', 'Fruit Slice'), icon: '🍉', at: ['tatil', 'partner', 'aile'], tags: ['sosyal'], good: ['🍉', '🍍', '🍊', '🍎', '🥭', '🥝'], bad: ['💣', '🧨'], cutE: '💦', bg: '#2a1d3a' });
spotGame({ id: 'plajda_havlu', name: B('Havlum Nerede?', 'Where Is My Towel?'), icon: '🏖️', at: ['tatil'], tags: ['sosyal'], bg: '#c9a85a', targets: ['🏖️', '🧺'], noise: ['⛱️', '🩱', '🩳', '🕶️', '🐚', '🦀', '🏐', '🪣', '🧴', '👒', '🍦'] });
jumpGame({ id: 'dalga_sorfu', name: B('Dalga Sörfü', 'Wave Surfing'), icon: '🏄', at: ['tatil'], tags: ['spor'], player: '🏄', obstacles: ['🪨', '🦈', '🪸'], bonus: '🐚', bg: '#3a8ad8', ground: '#1e5a9a' });

// ———————————————— KENDİNE BAK ————————————————
orderGame({ id: 'sabah_rutini', name: B('Sabah Rutini', 'Morning Routine'), icon: '🌅', at: ['bakim', 'dinlen'], tags: ['saglik'], sets: [
  S(['Sağlıklı bir sabah', 'A healthy morning'], [['Uyan', 'Wake up'], ['Bir bardak su iç', 'Drink a glass of water'], ['Esne', 'Stretch'], ['Duş al', 'Shower'], ['Kahvaltı yap', 'Eat breakfast']]),
  S(['Cilt bakımı', 'Skincare'], [['Yüzünü yıka', 'Wash your face'], ['Tonik sür', 'Apply toner'], ['Nemlendir', 'Moisturise'], ['Güneş kremi sür', 'Apply sunscreen']]),
] });
cleanGame({ id: 'ayna_temizle', name: B('Buğulu Ayna', 'Steamy Mirror'), icon: '🪞', at: ['bakim'], tags: ['saglik'], dirt: '#c8d3dc', dirtName: 'buharı', dirtNameEn: 'steam', spots: ['💧'], under: '#dff0ff', reveal: ['😊', '😎', '🤩', '😁'] });
sortGame({ id: 'saglikli_secim', name: B('Sağlıklı Seçim', 'Healthy Choice'), icon: '🥗', at: ['bakim', 'kontrol', 'spor_salonu'], tags: ['saglik'], bins: [B('👍 İyi alışkanlık', '👍 Good habit'), B('👎 Kötü alışkanlık', '👎 Bad habit')], target: 12,
  items: [[B('Günde 7–8 saat uyku', '7–8 hours of sleep'), 0], [B('Merdiven çıkmak', 'Taking the stairs'), 0], [B('Bol su içmek', 'Drinking plenty of water'), 0], [B('Sebze ağırlıklı beslenme', 'Veg-heavy diet'), 0], [B('Yürüyüşe çıkmak', 'Going for walks'), 0],
    [B('Gece 3\'e kadar ekran', 'Screens until 3 a.m.'), 1], [B('Kahvaltıyı atlamak', 'Skipping breakfast'), 1], [B('Günde 5 kutu gazoz', 'Five cans of fizzy drink a day'), 1], [B('Sigara', 'Smoking'), 1], [B('Hiç hareket etmemek', 'No exercise at all'), 1]] });

// ———————————————— AŞK & TANIŞMA ————————————————
memoryGame({ id: 'ani_kartlari', name: B('Anı Kartları', 'Memory Lane'), icon: '💞', at: ['partner'], tags: ['sosyal'], back: '💌', bg: '#4a1f3a', items: ['🌹', '🎬', '🍝', '🏖️', '🎡', '☕', '💍', '🎂', '🌅'] });
orderGame({ id: 'romantik_yemek', name: B('Romantik Akşam', 'Romantic Evening'), icon: '🕯️', at: ['partner'], tags: ['sosyal'], sets: [
  S(['Sürpriz akşam yemeği', 'Surprise dinner'], [['Menüyü seç', 'Choose the menu'], ['Alışverişe çık', 'Go shopping'], ['Yemeği pişir', 'Cook'], ['Masayı süsle', 'Decorate the table'], ['Mumları yak', 'Light the candles']]),
  S(['Doğum günü sürprizi', 'Birthday surprise'], [['Arkadaşlara haber ver', 'Tell the friends'], ['Pastayı sipariş et', 'Order the cake'], ['Evi süsle', 'Decorate'], ['Işıkları kapat, saklan', 'Lights off, hide'], ['"Sürpriz!"', '"Surprise!"']]),
] });
throwGame({ id: 'lunapark_halka', name: B('Lunapark Halkası', 'Funfair Ring Toss'), icon: '🎡', at: ['partner', 'tanis', 'cocuk'], tags: ['sosyal'], thrower: '🧑', target: '🍾', ball: '⭕', bg: '#2a1a3a', ground: '#5a3a5a' });
shellGame({ id: 'lunapark_bardak', name: B('Lunapark Bardakları', 'Funfair Cups'), icon: '🎪', at: ['partner', 'cocuk'], tags: ['sosyal'], cup: '🎩', item: '💍' });
rhythmGame({ id: 'dans_gecesi', name: B('Dans Gecesi', 'Dance Night'), icon: '💃', at: ['partner', 'tanis'], tags: ['sosyal'], notes: ['💃', '🕺', '💫'], keys: ['👣', '💫', '👣'], bg: '#2a0f2a' });
slideGame({ id: 'ask_yapbozu', name: B('Aşk Yapbozu', 'Love Puzzle'), icon: '💘', at: ['partner'], tags: ['sosyal'], tiles: ['💌', '🌹', '💐', '🍫', '💍', '🎁', '🕯️', '💘'] });

// ———————————————— EBEVEYNLİK ————————————————
packGame({ id: 'cocuk_cantasi', name: B('Okul Çantası', 'School Bag'), icon: '🎒', at: ['cocuk'], tags: ['sosyal'], sets: [
  K(['🏫 Okulun ilk günü', '🏫 First day of school'], [['📓 Defter', '📓 Exercise book'], ['✏️ Kalem', '✏️ Pencil'], ['🥪 Beslenme', '🥪 Lunch box'], ['💧 Su matarası', '💧 Water bottle']], [['🎮 Oyun konsolu', '🎮 Games console'], ['🍭 Kilo kilo şeker', '🍭 A bag of sweets'], ['🔪 Mutfak bıçağı', '🔪 Kitchen knife'], ['📺 Tablet', '📺 Tablet']]),
  K(['⚽ Beden eğitimi günü', '⚽ PE day'], [['👟 Spor ayakkabı', '👟 Trainers'], ['🩳 Eşofman', '🩳 Tracksuit'], ['💧 Su', '💧 Water']], [['👠 Topuklu ayakkabı', '👠 High heels'], ['👔 Takım elbise', '👔 Suit'], ['☂️ Şemsiye', '☂️ Umbrella'], ['🎻 Keman', '🎻 Violin']]),
] });
orderGame({ id: 'uyku_rutini', name: B('Uyku Rutini', 'Bedtime Routine'), icon: '🌙', at: ['cocuk'], tags: ['sosyal'], sets: [
  S(['Yatma vakti', 'Bedtime'], [['Oyuncakları topla', 'Tidy the toys'], ['Banyo yap', 'Bath time'], ['Pijama giy', 'Put on pyjamas'], ['Dişleri fırçala', 'Brush teeth'], ['Masal oku', 'Read a story'], ['Işıkları kıs', 'Dim the lights']]),
  S(['Okul sabahı', 'School morning'], [['Uyandır', 'Wake them up'], ['Kahvaltı hazırla', 'Make breakfast'], ['Giydir', 'Get dressed'], ['Çantayı kontrol et', 'Check the bag'], ['Okula bırak', 'Drop them at school']]),
] });
mazeGame({ id: 'park_labirent', name: B('Parkta Kayboldu', 'Lost in the Park'), icon: '🛝', at: ['cocuk'], tags: ['sosyal'], player: '🧑‍🍼', goal: '🧒', items: ['🎈'], wall: '#7ee081', bg: '#1e3a24' });
spotGame({ id: 'cocuk_saklambac', name: B('Saklambaç (Ebeveyn)', 'Hide and Seek (Parent)'), icon: '🙈', at: ['cocuk'], tags: ['sosyal'], bg: '#3a2f4a', ask: B('Çocuğunu bul:', 'Find your child:'), targets: ['🧒', '👧'], noise: ['🛋️', '🪴', '🧸', '🪑', '📦', '🛏️', '🚪', '🧺', '🖼️', '🪟'] });
catchGame({ id: 'oyuncak_topla', name: B('Oyuncak Topla', 'Toy Tidy-Up'), icon: '🧸', at: ['cocuk', 'ev_isi'], tags: ['sosyal'], basket: '🧺', good: ['🧸', '🪀', '🚗', '🧩', '🪁'], bad: ['🍝', '💧'], bg: '#3a2a4a' });
memoryGame({ id: 'masal_kartlari', name: B('Masal Kartları', 'Bedtime Story Cards'), icon: '📚', at: ['cocuk'], tags: ['sosyal'], back: '🌙', bg: '#1f2a4a', items: ['🐺', '🐷', '👧', '🧙', '🐉', '🏰', '👸', '🐸', '🦊'] });

// ———————————————— BAHÇE ————————————————
whackGame({ id: 'salyangoz_bahce', name: B('Salyangoz Nöbeti', 'Snail Patrol'), icon: '🐌', at: ['bahce', 'tarla'], tags: ['doga'], good: '🐌', bad: '🐞', hole: '🥬', holeBg: '#24502c', how: [B('Marulları yiyen salyangozları 🐌 bahçeden çıkar.', 'Move the lettuce-eating snails 🐌 out of the garden.'), B('Uğur böceğine 🐞 dokunma: bahçenin dostudur!', "Leave the ladybird 🐞 alone — it's a garden friend!"), B('25 saniye.', '25 seconds.')] });
fillGame({ id: 'bahce_sula', name: B('Bahçeyi Sula', 'Water the Garden'), icon: '🚿', at: ['bahce', 'tarla'], tags: ['doga'] });
sliceGame({ id: 'gul_budama', name: B('Gül Budama', 'Rose Pruning'), icon: '🥀', at: ['bahce'], tags: ['doga'], good: ['🥀', '🍂', '🪵'], bad: ['🌹', '🌷', '🐝'], cutE: '🍃', bg: '#20361e', how: [B('Solmuş gülleri ve kuru dalları kes.', 'Snip wilted roses and dry twigs.'), B('Açmış çiçeklere ve arılara dokunma!', "Don't touch the fresh flowers or the bees!"), B('25 saniye.', '25 seconds.')] });
catchGame({ id: 'yaprak_topla', name: B('Sonbahar Yaprakları', 'Autumn Leaves'), icon: '🍁', at: ['bahce', 'ev_isi'], tags: ['doga'], basket: '🧺', good: ['🍁', '🍂'], bad: ['🐝'], bg: '#4a2e1a', sway: true });

// ———————————————— SAĞLIK KONTROLÜ ————————————————
reactGame({ id: 'refleks_testi', name: B('Refleks Testi', 'Reflex Test'), icon: '⚡', at: ['kontrol', 'spor_salonu'], tags: ['saglik'], wait: '⚪', go: '🟢', fake: '🔴', bg: '#1a2a3a' });
spotGame({ id: 'goz_testi', name: B('Göz Testi', 'Eye Test'), icon: '👁️', at: ['kontrol'], tags: ['saglik'], bg: '#f2f2f2', ask: B('Bu yönü gösteren oku bul:', 'Find the arrow pointing:'), targets: ['⬆️', '⬇️', '⬅️', '➡️'], noise: ['⬆️', '⬇️', '⬅️', '➡️', '↗️', '↘️', '↙️', '↖️'] });
patternGame({ id: 'hafiza_testi', name: B('Hafıza Testi', 'Memory Test'), icon: '🧠', at: ['kontrol', 'danisman', 'kitap'], tags: ['saglik'], mark: '🔵', bg: '#1d2447', markBg: '#2a4a8a' });
stroopGame({ id: 'dikkat_olcum', name: B('Dikkat Ölçümü', 'Focus Check'), icon: '🎯', at: ['kontrol', 'danisman'], tags: ['saglik'] });

// ———————————————— HAYIR & DANIŞMANLIK & YAŞLILIK ————————————————
packGame({ id: 'koli_hazirla', name: B('Kış Kolisi', 'Winter Aid Box'), icon: '📦', at: ['hayir', 'gonullu'], tags: ['sosyal'], sets: [
  K(['❄️ Kış yardım kolisi', '❄️ Winter aid box'], [['🧥 Mont', '🧥 Coat'], ['🧤 Eldiven', '🧤 Gloves'], ['🧣 Atkı', '🧣 Scarf'], ['🥫 Konserve', '🥫 Tinned food']], [['🩱 Mayo', '🩱 Swimsuit'], ['🕶️ Güneş gözlüğü', '🕶️ Sunglasses'], ['🍦 Dondurma', '🍦 Ice cream'], ['🩴 Terlik', '🩴 Flip-flops']]),
  K(['📚 Köy okuluna kitap', '📚 Books for a village school'], [['📚 Hikâye kitapları', '📚 Story books'], ['🖍️ Boya kalemleri', '🖍️ Crayons'], ['📓 Defterler', '📓 Exercise books']], [['🍺 Bira', '🍺 Beer'], ['🚬 Sigara', '🚬 Cigarettes'], ['💊 Reçeteli ilaç', '💊 Prescription pills'], ['🔪 Bıçak seti', '🔪 Knife set']]),
] });
mazeGame({ id: 'yardim_dagit', name: B('Yardım Dağıtımı', 'Aid Delivery'), icon: '🚚', at: ['hayir', 'gonullu'], tags: ['sosyal'], player: '🚚', goal: '🏫', items: ['📦'], wall: '#ffd166', bg: '#2a2f3a' });
sudokuGame({ id: 'emekli_sudoku', name: B('Sudoku', 'Sudoku'), icon: '🔢', at: ['danisman', 'aile', 'kitap', 'dinlen'], tags: ['zeka'], symbols: ['1', '2', '3', '4'] });
codeGame({ id: 'akil_kupu', name: B('Akıl Küpü', 'Brain Teaser'), icon: '🧩', at: ['danisman', 'kitap', 'arkadas'], tags: ['zeka'], symbols: ['🔺', '🟦', '🟡', '🟩', '🟣', '⭐'] });
orderGame({ id: 'strateji_plan', name: B('Strateji Planı', 'Strategy Plan'), icon: '♟️', at: ['danisman', 'isletme'], tags: ['ticaret'], sets: [
  S(['Şirkete danışmanlık', 'Consulting a company'], [['Sorunu dinle', 'Listen to the problem'], ['Veriyi incele', 'Study the data'], ['Kök nedeni bul', 'Find the root cause'], ['Çözüm öner', 'Propose a solution'], ['Sonucu ölç', 'Measure the result']]),
  S(['Yeni pazara açılma', 'Entering a new market'], [['Pazar araştırması', 'Market research'], ['Rakip analizi', 'Competitor analysis'], ['Fiyat belirleme', 'Set the price'], ['Deneme satışı', 'Pilot sale'], ['Büyüme', 'Scale up']]),
] });
wordGame({ id: 'bulmaca_kelime', name: B('Kelime Bulmacası', 'Word Puzzle'), icon: '📰', at: ['kitap', 'danisman', 'dinlen'], tags: ['dil'], target: 5,
  words: [['🌻', 'AYÇİÇEĞİ', 'SUNFLOWER'], ['🏔️', 'DAĞ', 'MOUNTAIN'], ['🧭', 'PUSULA', 'COMPASS'], ['📮', 'POSTA', 'MAIL'], ['🕰️', 'ZAMAN', 'TIME'], ['🎻', 'KEMAN', 'VIOLIN'], ['🧶', 'YUMAK', 'YARN'], ['🌊', 'DALGA', 'WAVE'], ['🍯', 'BAL', 'HONEY'], ['🦉', 'BAYKUŞ', 'OWL'], ['🫖', 'DEMLİK', 'TEAPOT'], ['🚂', 'TREN', 'TRAIN']] });
mazeGame({ id: 'bayram_ziyareti', name: B('Bayram Ziyareti', 'Holiday Visit'), icon: '🍬', at: ['aile'], tags: ['sosyal'], player: '🚗', goal: '🏡', items: ['🍬'], wall: '#ffb547', bg: '#2e2a3a' });
throwGame({ id: 'bilardo', ages: [14, 99], name: B('Bilardo', 'Pool'), icon: '🎱', at: ['arkadas', 'tanis'], tags: ['sosyal'], thrower: '🧑', target: '🕳️', ball: '🎱', bg: '#0e4a2a', ground: '#0a3a1e' });

// ———————————————— PİYASA & İŞLETME ————————————————
sortGame({ id: 'haber_etkisi', name: B('Haber Etkisi', 'News Impact'), icon: '📰', at: ['piyasa', 'job:yatirimci'], tags: ['ticaret'], bins: [B('📈 Hisse yükselir', '📈 Stock rises'), B('📉 Hisse düşer', '📉 Stock falls')], target: 12,
  items: [[B('Şirket rekor kâr açıkladı', 'Company posts record profit'), 0], [B('Büyük bir sözleşme imzaladı', 'Signs a major contract'), 0], [B('Yeni ürünü çok beğenildi', 'New product is a hit'), 0], [B('Borcunu erken kapattı', 'Paid its debt off early'), 0], [B('Temettü artırdı', 'Raised the dividend'), 0],
    [B('Fabrikada yangın çıktı', 'Factory fire'), 1], [B('Ürünleri geri çağırdı', 'Product recall'), 1], [B('Yöneticisi usulsüzlükten tutuklandı', 'CEO arrested for fraud'), 1], [B('Satışlar beklentinin altında', 'Sales missed forecasts'), 1], [B('Büyük müşterisini kaybetti', 'Lost its biggest customer'), 1]] });
guessGame({ id: 'endeks_tahmin', name: B('Endeks Tahmini', 'Index Guess'), icon: '📊', at: ['piyasa'], tags: ['ticaret'], ask: B('Günün kapanış endeksini bul (analist ipucu verir).', "Find today's closing index (the analyst gives hints)."), min: 1000, max: 20000, step: 100 });
sumGame({ id: 'kasa_kapanis', name: B('Kasa Kapanışı', 'Cashing Up'), icon: '🧾', at: ['isletme'], tags: ['ticaret'], ask: B('Günlük hasılatı banknotlarla tam hazırla:', "Make up the day's takings exactly in notes:"), unit: '🪙', values: [200, 100, 50, 20, 10, 5], gen: rng => rng.int(8, 120) * 5 });
packGame({ id: 'dukkan_ac', name: B('Dükkânı Aç', 'Open the Shop'), icon: '🏪', at: ['isletme', 'isletme_ac'], tags: ['ticaret'], sets: [
  K(['🥖 Fırını açarken', '🥖 Opening the bakery'], [['🌾 Un', '🌾 Flour'], ['🧂 Tuz', '🧂 Salt'], ['🔥 Fırını yak', '🔥 Heat the oven'], ['🧾 Yazar kasa', '🧾 Till']], [['🎳 Bowling topu', '🎳 Bowling ball'], ['🏄 Sörf tahtası', '🏄 Surfboard'], ['🛏️ Yatak', '🛏️ Bed'], ['🐍 Yılan', '🐍 Snake']]),
  K(['👗 Butik açılışı', '👗 Boutique opening'], [['👗 Yeni sezon', '👗 New collection'], ['🪞 Ayna', '🪞 Mirror'], ['🏷️ Etiketler', '🏷️ Price tags'], ['🛍️ Poşet', '🛍️ Bags']], [['🚜 Traktör', '🚜 Tractor'], ['🐟 Balık', '🐟 Fish'], ['🧯 Boş yangın tüpü', '🧯 Empty extinguisher'], ['🧱 Tuğla', '🧱 Bricks']]),
] });
orderGame({ id: 'siparis_sureci', name: B('Sipariş Süreci', 'Order Fulfilment'), icon: '📦', at: ['isletme', 'job:muhasebeci'], tags: ['ticaret'], sets: [
  S(['İnternetten gelen sipariş', 'An online order'], [['Siparişi onayla', 'Confirm the order'], ['Stoktan çek', 'Pick from stock'], ['Paketle', 'Pack it'], ['Kargoya ver', 'Ship it'], ['Faturayı kes', 'Issue the invoice']]),
  S(['Tedarikçiden mal alma', 'Buying from a supplier'], [['Teklif iste', 'Request quotes'], ['Pazarlık yap', 'Negotiate'], ['Sipariş ver', 'Place the order'], ['Malı teslim al', 'Receive the goods'], ['Ödemeyi yap', 'Pay the supplier']]),
] });
slideGame({ id: 'vitrin_duzen', name: B('Vitrin Düzeni', 'Window Display'), icon: '🛍️', at: ['isletme'], tags: ['ticaret'], tiles: ['👗', '👠', '👜', '🧥', '👒', '🧣', '👟', '🕶️'] });
mazeGame({ id: 'depo_labirent', name: B('Depo Labirenti', 'Warehouse Maze'), icon: '🛒', at: ['isletme', 'job:isci'], tags: ['ticaret'], player: '🛒', goal: '🚚', items: ['📦'], wall: '#c9a45a', bg: '#2a2a2a' });
quickGame({ id: 'kar_zarar', name: B('Kâr mı, Zarar mı?', 'Profit or Loss?'), icon: '💹', at: ['isletme', 'isletme_ac', 'alan_ea'], tags: ['ticaret'], target: 10,
  gen: rng => { const c = rng.int(4, 40) * 5, p = c + rng.pick([-20, -15, -10, -5, 5, 10, 15, 20, 25]); const d = p - c; const a = d > 0 ? `+${d}` : `${d}`; return { q: `🏷️ ${c} → 💰 ${p}`, a, w: [...new Set([`+${Math.abs(d) + 5}`, `-${Math.abs(d)}`, `+${Math.abs(d)}`, `${d > 0 ? '-' : '+'}${Math.abs(d) + 5}`])].filter(x => x !== a).slice(0, 3) }; } });
