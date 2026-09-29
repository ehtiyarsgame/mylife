// Lise ve üniversite çağı ek oyunları: dersler, alanlar, staj, kulüp, yarı zamanlı iş, ilk girişim.
import { B, lang } from '../core/i18n.js';
import { quickGame, sortGame, pairGame, whackGame, timingGame } from './engines.js';
import { memoryGame, orderGame, compareGame, mazeGame, dodgeGame, guessGame, codeGame } from './engines3.js';
import { spotGame, packGame, sumGame, wordGame, traceGame, popGame, patternGame, schulteGame } from './engines4.js';

const TR = () => lang === 'tr';
const P = pairs => pairs.map(([a, b]) => B(a, b));
const S = (title, steps) => [B(title[0], title[1]), P(steps)];
const K = (task, need, extra) => [B(task[0], task[1]), P(need), P(extra)];
const DERS = ['dershane', 'etut', 'uni_ders', 'acik_lise'];
const yr = v => String(v);

// ———————————————— SÖZEL: tarih, coğrafya, edebiyat ————————————————
// i18n-skip-start
const CAPS = [['Türkiye', 'Turkey', 'Ankara', 'Ankara'], ['Almanya', 'Germany', 'Berlin', 'Berlin'], ['Fransa', 'France', 'Paris', 'Paris'], ['İtalya', 'Italy', 'Roma', 'Rome'], ['İspanya', 'Spain', 'Madrid', 'Madrid'],
  ['Japonya', 'Japan', 'Tokyo', 'Tokyo'], ['Mısır', 'Egypt', 'Kahire', 'Cairo'], ['Kanada', 'Canada', 'Ottawa', 'Ottawa'], ['Avustralya', 'Australia', 'Kanberra', 'Canberra'], ['Brezilya', 'Brazil', 'Brasilia', 'Brasília'],
  ['Rusya', 'Russia', 'Moskova', 'Moscow'], ['Çin', 'China', 'Pekin', 'Beijing'], ['Hindistan', 'India', 'Yeni Delhi', 'New Delhi'], ['Yunanistan', 'Greece', 'Atina', 'Athens'], ['Azerbaycan', 'Azerbaijan', 'Bakü', 'Baku'],
  ['Birleşik Krallık', 'United Kingdom', 'Londra', 'London'], ['ABD', 'USA', 'Washington', 'Washington'], ['Güney Kore', 'South Korea', 'Seul', 'Seoul'], ['Arjantin', 'Argentina', 'Buenos Aires', 'Buenos Aires'], ['Norveç', 'Norway', 'Oslo', 'Oslo'],
  ['İsveç', 'Sweden', 'Stockholm', 'Stockholm'], ['Hollanda', 'Netherlands', 'Amsterdam', 'Amsterdam'], ['Portekiz', 'Portugal', 'Lizbon', 'Lisbon'], ['Macaristan', 'Hungary', 'Budapeşte', 'Budapest'], ['Kazakistan', 'Kazakhstan', 'Astana', 'Astana'],
  ['Pakistan', 'Pakistan', 'İslamabad', 'Islamabad'], ['Meksika', 'Mexico', 'Meksiko', 'Mexico City'], ['İsviçre', 'Switzerland', 'Bern', 'Bern'], ['Polonya', 'Poland', 'Varşova', 'Warsaw'], ['Fas', 'Morocco', 'Rabat', 'Rabat']];
// i18n-skip-end
quickGame({ id: 'baskent_bil', ages: [10, 99], name: B('Başkentler', 'Capital Cities'), icon: '🏛️', at: ['alan_sozel', ...DERS, 'kitap'], tags: ['dil'], target: 10,
  gen: rng => { const c = rng.pick(CAPS); const k = TR() ? 2 : 3; return { q: TR() ? `${c[0]} ülkesinin başkenti?` : `Capital of ${c[1]}?`, a: c[k], w: rng.shuffle(CAPS.filter(x => x !== c).map(x => x[k])).slice(0, 3) }; } });
compareGame({ id: 'tarih_once', name: B('Hangisi Önce Oldu?', 'Which Came First?'), icon: '📜', at: ['alan_sozel', ...DERS], tags: ['dil'], ask: B('Hangisi daha ÖNCE oldu?', 'Which happened EARLIER?'), less: true, fmt: yr,
  items: [[B('Malazgirt Meydan Muharebesi', 'Battle of Manzikert'), 1071], [B('Gutenberg matbaası', "Gutenberg's printing press"), 1440], [B('İstanbul\'un fethi', 'Conquest of Constantinople'), 1453], [B('Kolomb Amerika\'ya ulaştı', 'Columbus reached the Americas'), 1492],
    [B('Fransız Devrimi', 'French Revolution'), 1789], [B('Telefonun icadı', 'Invention of the telephone'), 1876], [B('Edison\'un ampulü', "Edison's light bulb"), 1879], [B('Wright kardeşlerin uçuşu', "Wright brothers' flight"), 1903],
    [B('Titanik\'in batışı', 'Sinking of the Titanic'), 1912], [B('I. Dünya Savaşı\'nın başlaması', 'Start of World War I'), 1914], [B('TBMM\'nin açılışı', 'Opening of the Turkish Grand National Assembly'), 1920], [B('Cumhuriyet\'in ilanı', 'Proclamation of the Turkish Republic'), 1923],
    [B('II. Dünya Savaşı\'nın bitişi', 'End of World War II'), 1945], [B('Ay\'a ilk insan', 'First person on the Moon'), 1969], [B('Berlin Duvarı\'nın yıkılışı', 'Fall of the Berlin Wall'), 1989]] });
compareGame({ id: 'nufus_kiyas', name: B('Kalabalık Ülkeler', 'Crowded Countries'), icon: '🌍', at: ['alan_sozel', 'alan_ea', 'dershane'], tags: ['dil'], ask: B('Hangisinin nüfusu daha fazla?', 'Which has the larger population?'), unit: B('milyon', 'million'),
  items: [[B('🇮🇳 Hindistan', '🇮🇳 India'), 1430], [B('🇨🇳 Çin', '🇨🇳 China'), 1410], [B('🇺🇸 ABD', '🇺🇸 USA'), 335], [B('🇮🇩 Endonezya', '🇮🇩 Indonesia'), 277], [B('🇳🇬 Nijerya', '🇳🇬 Nigeria'), 224], [B('🇧🇷 Brezilya', '🇧🇷 Brazil'), 216],
    [B('🇯🇵 Japonya', '🇯🇵 Japan'), 124], [B('🇪🇬 Mısır', '🇪🇬 Egypt'), 112], [B('🇹🇷 Türkiye', '🇹🇷 Turkey'), 85], [B('🇩🇪 Almanya', '🇩🇪 Germany'), 84], [B('🇬🇧 Birleşik Krallık', '🇬🇧 UK'), 68], [B('🇪🇸 İspanya', '🇪🇸 Spain'), 48], [B('🇨🇦 Kanada', '🇨🇦 Canada'), 40], [B('🇦🇺 Avustralya', '🇦🇺 Australia'), 26]] });
compareGame({ id: 'dag_yukseklik', name: B('Zirveler', 'Summits'), icon: '🏔️', at: ['alan_sozel', 'fen', 'dershane'], tags: ['dil'], ask: B('Hangi dağ daha yüksek?', 'Which mountain is higher?'), unit: 'm',
  items: [[B('Everest', 'Everest'), 8849], [B('Ağrı Dağı', 'Mount Ararat'), 5137], [B('Erciyes', 'Mount Erciyes'), 3917], [B('Uludağ', 'Uludağ'), 2543], [B('Kilimanjaro', 'Kilimanjaro'), 5895], [B('Mont Blanc', 'Mont Blanc'), 4806], [B('Elbruz', 'Elbrus'), 5642], [B('Fuji', 'Mount Fuji'), 3776], [B('Aconcagua', 'Aconcagua'), 6961]] });
compareGame({ id: 'nehir_uzunluk', name: B('Uzun Nehirler', 'Long Rivers'), icon: '🏞️', at: ['alan_sozel', 'dershane', 'etut'], tags: ['dil'], ask: B('Hangi nehir daha uzun?', 'Which river is longer?'), unit: 'km',
  items: [[B('Nil', 'Nile'), 6650], [B('Amazon', 'Amazon'), 6400], [B('Mississippi', 'Mississippi'), 3730], [B('Tuna', 'Danube'), 2850], [B('Fırat', 'Euphrates'), 2800], [B('Dicle', 'Tigris'), 1850], [B('Kızılırmak', 'Kızılırmak'), 1355], [B('Ren', 'Rhine'), 1230], [B('Sakarya', 'Sakarya'), 824]] });
pairGame({ id: 'roman_yazar', ages: [12, 99], name: B('Romanlar ve Yazarları', 'Novels and Authors'), icon: '✒️', at: ['alan_sozel', 'kitap', 'acik_lise'], tags: ['dil'], hint: B('Kim yazdı?', 'Who wrote it?'),
  pairs: [['Sabahattin Ali', B('Kürk Mantolu Madonna', 'Madonna in a Fur Coat')], ['Yaşar Kemal', B('İnce Memed', 'Memed, My Hawk')], ['Reşat Nuri Güntekin', B('Çalıkuşu', 'The Wren')], ['Halide Edib Adıvar', B('Sinekli Bakkal', 'The Clown and His Daughter')],
    ['Ömer Seyfettin', B('Kaşağı', 'The Curry-Comb')], ['Oğuz Atay', B('Tutunamayanlar', 'The Disconnected')], ['Ahmet Hamdi Tanpınar', B('Saatleri Ayarlama Enstitüsü', 'The Time Regulation Institute')], ['Orhan Pamuk', B('Benim Adım Kırmızı', 'My Name Is Red')],
    ['William Shakespeare', 'Hamlet'], ['Cervantes', B('Don Kişot', 'Don Quixote')], ['Lev Tolstoy', B('Savaş ve Barış', 'War and Peace')], ['Victor Hugo', B('Sefiller', 'Les Misérables')], ['George Orwell', '1984'], ['Dostoyevski', B('Suç ve Ceza', 'Crime and Punishment')]] });
orderGame({ id: 'zaman_cizelgesi', name: B('Zaman Çizelgesi', 'Timeline'), icon: '⏳', at: ['alan_sozel', ...DERS], tags: ['dil'], sets: [
  S(['Eskiden yeniye', 'Oldest to newest'], [['🔺 Mısır piramitleri', '🔺 Egyptian pyramids'], ['🏛️ Roma İmparatorluğu', '🏛️ Roman Empire'], ['🏰 Orta Çağ kaleleri', '🏰 Medieval castles'], ['⚙️ Sanayi Devrimi', '⚙️ Industrial Revolution'], ['💻 İnternet çağı', '💻 Internet age']]),
  S(['Cumhuriyet\'e giden yol', 'The road to the Republic'], [['Samsun\'a çıkış (1919)', 'Landing at Samsun (1919)'], ['TBMM\'nin açılışı (1920)', 'Assembly opens (1920)'], ['Büyük Taarruz (1922)', 'Great Offensive (1922)'], ['Lozan Antlaşması (1923)', 'Treaty of Lausanne (1923)'], ['Cumhuriyet\'in ilanı (1923)', 'Republic proclaimed (1923)']]),
  S(['İletişimin tarihi', 'History of communication'], [['✉️ Mektup', '✉️ Letter'], ['📠 Telgraf', '📠 Telegraph'], ['☎️ Telefon', '☎️ Telephone'], ['📻 Radyo', '📻 Radio'], ['📱 Akıllı telefon', '📱 Smartphone']]),
  S(['Ulaşımın tarihi', 'History of transport'], [['🐎 At arabası', '🐎 Horse cart'], ['🚂 Buharlı tren', '🚂 Steam train'], ['🚗 Otomobil', '🚗 Motor car'], ['✈️ Uçak', '✈️ Aeroplane'], ['🚀 Uzay mekiği', '🚀 Space shuttle']]),
] });

// ———————————————— SAYISAL ————————————————
quickGame({ id: 'denklem_coz', ages: [12, 99], name: B('Denklem Çöz', 'Solve for x'), icon: '🧮', at: ['alan_sayisal', 'dershane', 'mat', 'uni_ders'], tags: ['zeka'], target: 10,
  gen: (rng, d) => { const x = rng.int(-5, 12), a = rng.int(2, d > 0.5 ? 9 : 6), b = rng.int(-15, 20), c = a * x + b; const w = new Set(); while (w.size < 3) { const y = x + rng.pick([-3, -2, -1, 1, 2, 3]); if (y !== x) w.add(y); } return { q: `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${c}   x = ?`, a: x, w: [...w] }; } });
quickGame({ id: 'us_kok', ages: [12, 99], name: B('Üs ve Kök', 'Powers and Roots'), icon: '√', at: ['alan_sayisal', 'dershane', 'mat'], tags: ['zeka'], target: 10,
  gen: rng => {
    const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
    if (rng.chance(0.5)) { const n = rng.int(2, 15); const v = n * n; return { q: `√${v} = ?`, a: n, w: [...new Set([n + 1, n - 1, n + 2, Math.round(v / 2)])].filter(x => x !== n && x > 0).slice(0, 3) }; }
    const b = rng.pick([2, 3, 5, 10]), e = b === 2 ? rng.int(3, 10) : b === 10 ? rng.int(2, 5) : rng.int(2, 4), v = b ** e;
    return { q: `${b}${sup(e)} = ?`, a: v, w: [...new Set([b * e, v * b, v / b, v + b])].filter(x => x !== v).slice(0, 3) };
  } });
quickGame({ id: 'birim_bil', name: B('Birimler', 'SI Units'), icon: '📏', at: ['alan_sayisal', 'fen', 'uni_ders'], tags: ['fen'], target: 8,
  gen: rng => { const L = [[B('Kuvvet', 'Force'), 'Newton'], [B('Enerji', 'Energy'), 'Joule'], [B('Güç', 'Power'), 'Watt'], [B('Direnç', 'Resistance'), 'Ohm'], [B('Frekans', 'Frequency'), 'Hertz'], [B('Basınç', 'Pressure'), 'Pascal'], [B('Elektrik yükü', 'Electric charge'), 'Coulomb'], [B('Sıcaklık (SI)', 'Temperature (SI)'), 'Kelvin'], [B('Akım', 'Current'), 'Amper'], [B('Gerilim', 'Voltage'), 'Volt']];
    const [q, a] = rng.pick(L); return { q, a, w: rng.shuffle(L.map(x => x[1]).filter(x => x !== a)).slice(0, 3) }; } });
pairGame({ id: 'element_eslestir', name: B('Element Sembolleri', 'Element Symbols'), icon: '⚗️', at: ['alan_sayisal', 'fen', 'uni_ders'], tags: ['fen'], hint: B('Sembolü bul', 'Match the symbol'),
  pairs: [[B('Hidrojen', 'Hydrogen'), 'H'], [B('Oksijen', 'Oxygen'), 'O'], [B('Karbon', 'Carbon'), 'C'], [B('Azot', 'Nitrogen'), 'N'], [B('Sodyum', 'Sodium'), 'Na'], [B('Demir', 'Iron'), 'Fe'], [B('Altın', 'Gold'), 'Au'], [B('Gümüş', 'Silver'), 'Ag'],
    [B('Bakır', 'Copper'), 'Cu'], [B('Kalsiyum', 'Calcium'), 'Ca'], [B('Potasyum', 'Potassium'), 'K'], [B('Helyum', 'Helium'), 'He'], [B('Klor', 'Chlorine'), 'Cl'], [B('Kurşun', 'Lead'), 'Pb'], [B('Cıva', 'Mercury'), 'Hg'], [B('Çinko', 'Zinc'), 'Zn'], [B('Kükürt', 'Sulphur'), 'S'], [B('Magnezyum', 'Magnesium'), 'Mg']] });
patternGame({ id: 'matris_ezber', name: B('Matris Ezber', 'Matrix Memory'), icon: '🔢', at: ['alan_sayisal', 'uni_ders'], tags: ['zeka'], mark: '1️⃣', bg: '#101a30', markBg: '#2a3a6a' });

// ———————————————— EŞİT AĞIRLIK & DİL ————————————————
sortGame({ id: 'arz_talep', name: B('Arz ve Talep', 'Supply and Demand'), icon: '📈', at: ['alan_ea', 'piyasa', 'uni_ders'], tags: ['ticaret'], bins: [B('📈 Fiyat artar', '📈 Price rises'), B('📉 Fiyat düşer', '📉 Price falls')], target: 12,
  items: [[B('Yazın dondurma talebi patlıyor', 'Ice-cream demand soars in summer'), 0], [B('Kuraklık, buğday hasadı azaldı', 'Drought cuts the wheat harvest'), 0], [B('Yeni telefon için uzun kuyruklar', 'Long queues for a new phone'), 0], [B('Tek fabrika kapandı, ürün kıt', 'The only factory closed; goods are scarce'), 0], [B('Bayram öncesi herkes aynı şeyi alıyor', 'Everyone buys the same thing before the holiday'), 0],
    [B('Bol hasat, pazar domates dolu', 'Bumper harvest; the market is full of tomatoes'), 1], [B('Kimse eski model istemiyor', 'Nobody wants the old model'), 1], [B('Yeni rakipler piyasaya girdi', 'New competitors entered the market'), 1], [B('Kışın mayo talebi düştü', 'Swimsuit demand drops in winter'), 1], [B('Üretim teknolojisi ucuzladı', 'Production became cheaper'), 1]] });
sumGame({ id: 'butce_denkle', name: B('Bütçeyi Denkle', 'Balance the Budget'), icon: '📒', at: ['alan_ea', 'isletme_ac', 'uni_ders'], tags: ['ticaret'], ask: B('Bu harcamayı karşılayacak kalemleri seç:', 'Pick items that exactly cover this spend:'), unit: '🪙', values: [500, 250, 100, 50, 20, 10] });
wordGame({ id: 'eng_kelime', ages: [10, 99], name: B('İngilizce Kelime', 'Turkish Words'), icon: '🇬🇧', at: ['alan_dil', 'uni_ders', 'kitap'], tags: ['dil'], flip: true, target: 5,
  how: [B('Resme bak; kelimeyi İNGİLİZCE kur.', 'Look at the picture and build the word in TURKISH.'), B('Harflere sırayla dokun.', 'Tap the letters in order.'), B('45 saniye.', '45 seconds.')],
  words: [['🌍', 'DÜNYA', 'WORLD'], ['👨‍👩‍👧', 'AİLE', 'FAMILY'], ['🏫', 'OKUL', 'SCHOOL'], ['🌧️', 'YAĞMUR', 'RAIN'], ['🎁', 'HEDİYE', 'GIFT'], ['⏰', 'SAAT', 'CLOCK'], ['🌉', 'KÖPRÜ', 'BRIDGE'], ['🍳', 'MUTFAK', 'KITCHEN'], ['🧳', 'BAVUL', 'SUITCASE'], ['🎶', 'ŞARKI', 'SONG'], ['🦋', 'KELEBEK', 'BUTTERFLY'], ['🗝️', 'ANAHTAR', 'KEY']] });
pairGame({ id: 'deyim_anlam', ages: [11, 99], name: B('Deyimler', 'Idioms'), icon: '💬', at: ['alan_dil', 'alan_sozel', 'kitap'], tags: ['dil'], hint: B('Anlamını bul', 'Find the meaning'),
  pairs: [[B('Etekleri zil çalmak', 'Over the moon'), B('Çok sevinmek', 'Very happy')], [B('Kulak misafiri olmak', 'To overhear'), B('İstemeden duymak', 'Hear by chance')], [B('Göz atmak', 'Take a look'), B('Kısaca bakmak', 'Glance quickly')], [B('Ağzı kulaklarına varmak', 'Grin from ear to ear'), B('Çok gülmek', 'Smile widely')],
    [B('Burnu havada olmak', 'Nose in the air'), B('Kibirli olmak', 'Be arrogant')], [B('Eli açık olmak', 'Open-handed'), B('Cömert olmak', 'Be generous')], [B('Dili tutulmak', 'Tongue-tied'), B('Konuşamamak', 'Unable to speak')], [B('Pireyi deve yapmak', 'Make a mountain out of a molehill'), B('Abartmak', 'Exaggerate')],
    [B('Göz yummak', 'Turn a blind eye'), B('Görmezden gelmek', 'Ignore it')], [B('Kafa yormak', 'Rack your brains'), B('Çok düşünmek', 'Think hard')]] });

// ———————————————— ÜNİVERSİTE & STAJ ————————————————
orderGame({ id: 'sunum_hazirla', name: B('Sunum Hazırla', 'Prepare a Presentation'), icon: '📊', at: ['uni_ders', 'staj', 'kulup'], tags: ['is'], sets: [
  S(['Sunum hazırlığı', 'Building a presentation'], [['Konuyu seç', 'Choose the topic'], ['Kaynakları araştır', 'Research sources'], ['Taslak çıkar', 'Draft an outline'], ['Slaytları hazırla', 'Make the slides'], ['Prova yap', 'Rehearse']]),
  S(['Bitirme projesi', 'Final-year project'], [['Danışman seç', 'Pick a supervisor'], ['Proje önerisi yaz', 'Write a proposal'], ['Veriyi topla', 'Collect data'], ['Analiz et', 'Analyse'], ['Tezi teslim et', 'Submit the thesis']]),
] });
packGame({ id: 'ofis_ilk_gun', name: B('Stajın İlk Günü', 'First Day at the Internship'), icon: '🧑‍💼', at: ['staj', 'is_ara'], tags: ['is'], sets: [
  K(['🏢 Ofise ilk gün', '🏢 First day at the office'], [['🪪 Kimlik kartı', '🪪 ID badge'], ['📓 Defter', '📓 Notebook'], ['🖊️ Kalem', '🖊️ Pen'], ['😊 Güler yüz', '😊 A smile']], [['🎮 Oyun konsolu', '🎮 Games console'], ['🩴 Terlik', '🩴 Flip-flops'], ['🛏️ Yastık', '🛏️ Pillow'], ['📢 Megafon', '📢 Megaphone']]),
  K(['💻 Online toplantı', '💻 Online meeting'], [['🎧 Kulaklık', '🎧 Headset'], ['🔌 Şarj aleti', '🔌 Charger'], ['📝 Toplantı notları', '📝 Meeting notes']], [['🍿 Patlamış mısır', '🍿 Popcorn'], ['🐶 Havlayan köpek', '🐶 Barking dog'], ['🎸 Elektro gitar', '🎸 Electric guitar'], ['🚿 Duş', '🚿 Shower']]),
] });
orderGame({ id: 'eposta_yaz', name: B('Resmî E-posta', 'Formal E-mail'), icon: '📧', at: ['staj', 'uni_ders'], tags: ['is'], sets: [
  S(['Resmî e-posta', 'A formal e-mail'], [['Konu satırı', 'Subject line'], ['Hitap: "Sayın…"', 'Greeting: "Dear…"'], ['Amacını kısaca yaz', 'State your purpose'], ['Ayrıntılar', 'Details'], ['Teşekkür ve imza', 'Thanks and signature']]),
  S(['İş başvurusu', 'Job application'], [['İlanı oku', 'Read the ad'], ['CV\'ni güncelle', 'Update your CV'], ['Ön yazı yaz', 'Write a cover letter'], ['Başvuruyu gönder', 'Send the application'], ['Mülakata hazırlan', 'Prepare for the interview']]),
] });
spotGame({ id: 'dosya_bul', name: B('Dosyayı Bul', 'Find the File'), icon: '📁', at: ['staj', 'job:memur'], tags: ['is'], bg: '#27303f', targets: ['📂'], noise: ['📁', '🗂️', '📄', '📃', '📑', '🗃️', '📋', '🗄️'] });
memoryGame({ id: 'kahve_siparisi', name: B('Kahve Siparişleri', 'Coffee Orders'), icon: '☕', at: ['staj', 'yari_zaman'], tags: ['is'], back: '🧾', bg: '#3a2a1e', items: ['☕', '🧋', '🍵', '🥤', '🧃', '🥛', '🍫', '🧁', '🥐'] });
mazeGame({ id: 'kampus_labirent', name: B('Kampüste Kayboldum', 'Lost on Campus'), icon: '🎓', at: ['uni_ders'], tags: ['is'], player: '🎓', goal: '🏛️', items: ['📚'], wall: '#8f7bff', bg: '#1d2240' });
dodgeGame({ id: 'sinav_gecesi', name: B('Sınav Gecesi', 'Exam Night'), icon: '📚', at: ['uni_ders', 'dershane', 'etut'], tags: ['zeka'], player: '🧠', bad: ['📱', '🎮', '📺', '🍕'], good: ['📚', '📝'], bg: '#1d1a33', hitText: B('Dikkatin dağıldı!', 'Distracted!') });
whackGame({ id: 'kutuphane_sus', name: B('Kütüphanede Sessizlik', 'Library Quiet'), icon: '🤫', at: ['uni_ders', 'kitap'], tags: ['sosyal'], good: '🗣️', bad: '📖', hole: '🪑', holeBg: '#3a2c1c', how: [B('Gürültü yapanlara 🗣️ dokunup sustur.', 'Tap the chatterboxes 🗣️ to hush them.'), B('Kitap okuyanı 📖 rahatsız etme!', "Don't disturb the readers 📖!"), B('25 saniye.', '25 seconds.')] });
quickGame({ id: 'ofis_kisayol', name: B('Klavye Kısayolları', 'Keyboard Shortcuts'), icon: '⌨️', at: ['staj', 'sertifika', 'kodlama'], tags: ['teknik'], target: 8,
  gen: rng => { const L = [['Ctrl + C', B('Kopyala', 'Copy')], ['Ctrl + V', B('Yapıştır', 'Paste')], ['Ctrl + Z', B('Geri al', 'Undo')], ['Ctrl + S', B('Kaydet', 'Save')], ['Ctrl + P', B('Yazdır', 'Print')], ['Ctrl + F', B('Bul', 'Find')], ['Ctrl + A', B('Tümünü seç', 'Select all')], ['Ctrl + X', B('Kes', 'Cut')]];
    const [q, a] = rng.pick(L); return { q, a, w: rng.shuffle(L.map(x => x[1]).filter(x => x !== a)).slice(0, 3) }; } });

// ———————————————— KULÜP, YARI ZAMANLI İŞ, İLK GİRİŞİM ————————————————
traceGame({ id: 'afis_ciz', name: B('Afiş Tasarla', 'Design the Poster'), icon: '🖌️', at: ['kulup', 'resim'], tags: ['sanat'], shapes: ['yildiz', 'kare', 'dalga', 'ev'], ink: '#3ddc97' });
sumGame({ id: 'kermes_kasa', name: B('Kermes Kasası', 'Bake-Sale Till'), icon: '🧁', at: ['kulup', 'gonullu', 'isletme_ac'], tags: ['ticaret'], ask: B('Kermeste para üstünü tam ver:', 'Give exact change at the bake sale:'), unit: '🪙', values: [1, 5, 10, 20, 50] });
orderGame({ id: 'etkinlik_plani', name: B('Etkinlik Planı', 'Event Plan'), icon: '🎪', at: ['kulup', 'gonullu'], tags: ['sosyal'], sets: [
  S(['Okul şenliği', 'School fair'], [['Fikir toplantısı', 'Brainstorm'], ['Okuldan izin al', 'Get school approval'], ['Görev dağılımı', 'Assign jobs'], ['Afiş as', 'Put up posters'], ['Şenliği yap', 'Hold the fair']]),
  S(['Kitap bağış kampanyası', 'Book drive'], [['Hedef belirle', 'Set a goal'], ['Duyuru yap', 'Announce it'], ['Kitapları topla', 'Collect the books'], ['Ayır ve paketle', 'Sort and pack'], ['Köy okuluna gönder', 'Send to a village school']]),
] });
popGame({ id: 'oy_sayimi', name: B('Oy Sayımı', 'Vote Count'), icon: '🗳️', at: ['kulup'], tags: ['sosyal'], rules: [
  [B('Geçerli oyları patlat (tek ✅)', 'Pop VALID ballots (one ✅)'), ['✅', '☑️'], ['✅✅', '❌', '⬜', '🖍️']],
  [B('Mavi takıma verilenleri patlat', 'Pop votes for the BLUE team'), ['🔵', '💙'], ['🔴', '❤️', '🟢', '💚']],
] });
memoryGame({ id: 'kafe_siparis', name: B('Kafe Siparişleri', 'Café Orders'), icon: '🥐', at: ['yari_zaman', 'pazar_isi'], tags: ['is'], back: '📝', bg: '#3a2a22', items: ['🥐', '🍩', '🧇', '🥪', '🍰', '☕', '🧃', '🍪', '🥯'] });
sumGame({ id: 'kasa_yogun', name: B('Yoğun Kasa', 'Rush-Hour Till'), icon: '🧾', at: ['yari_zaman', 'pazar_isi'], tags: ['ticaret'], ask: B('Para üstünü tam ver, sıra uzuyor!', 'Give exact change — the queue is growing!'), unit: '🪙', values: [1, 5, 10, 20, 50, 100] });
schulteGame({ id: 'raf_numarasi', name: B('Raf Numaraları', 'Shelf Numbers'), icon: '🏷️', at: ['yari_zaman'], tags: ['is'], hint: '1, 2, 3…', labels: (rng, n) => Array.from({ length: n }, (_, i) => String(i + 1)) });
packGame({ id: 'tezgah_kur', name: B('Tezgâh Kur', 'Set Up the Stall'), icon: '🏪', at: ['isletme_ac', 'isletme', 'pazar_isi'], tags: ['ticaret'], sets: [
  K(['🍋 Limonata standı', '🍋 Lemonade stand'], [['🍋 Limon', '🍋 Lemons'], ['🧊 Buz', '🧊 Ice'], ['🥤 Bardak', '🥤 Cups'], ['🪧 Fiyat tabelası', '🪧 Price sign']], [['🧥 Kaban', '🧥 Coat'], ['🎹 Piyano', '🎹 Piano'], ['🛋️ Kanepe', '🛋️ Sofa'], ['🎿 Kayak', '🎿 Skis']]),
  K(['🍪 Kurabiye satışı', '🍪 Cookie sale'], [['🍪 Kurabiye', '🍪 Cookies'], ['📦 Paket', '📦 Bags'], ['🪙 Bozuk para', '🪙 Change float'], ['🧤 Hijyen eldiveni', '🧤 Food gloves']], [['🧲 Mıknatıs', '🧲 Magnet'], ['🪚 Testere', '🪚 Saw'], ['🐍 Yılan', '🐍 Snake'], ['📺 TV', '📺 TV']]),
] });
guessGame({ id: 'fiyat_bul', name: B('Doğru Fiyat', 'Price It Right'), icon: '🏷️', at: ['isletme_ac', 'isletme', 'piyasa'], tags: ['ticaret'], ask: B('Müşterilerin ödemeye razı olduğu en yüksek fiyatı bul.', 'Find the highest price customers will accept.'), min: 5, max: 200, step: 5, unit: '🪙', up: B('⬆️ Daha pahalı da alırlar', '⬆️ They would pay more'), down: B('⬇️ Çok pahalı, kimse almaz', '⬇️ Too pricey, nobody buys') });
timingGame({ id: 'kurabiye_firini', name: B('Kurabiye Fırını', 'Cookie Oven'), icon: '🍪', at: ['isletme_ac', 'ev_isi'], tags: ['ticaret'], target: '🍪', verb: B('Tepsi', 'Tray'), perfect: B('Altın sarısı!', 'Golden brown!'), okText: B('Yenir', 'Edible'), missText: B('Yandı!', 'Burnt!') });
codeGame({ id: 'kasa_kodu', name: B('Dükkân Kasası', 'Shop Safe'), icon: '🔒', at: ['isletme', 'isletme_ac'], tags: ['ticaret'], symbols: ['🍎', '🍋', '🍇', '🍒', '🍑', '🥝'] });
