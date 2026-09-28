// Motorlardan türetilen temalı mini oyunlar. Her tema kendi kuralı, görseli ve içeriğiyle ayrı bir oyundur.
import { timingGame, catchGame, sortGame, pairGame, oddGame, countGame, stackGame, runGame, whackGame, dialGame, quickGame } from './engines.js';
import { register, getGame } from './engine.js';
import { SCENES } from './life.js';

// Yanlış şık üretici: doğrudan farklı, benzersiz, makul sayılar
function near(a, rng, steps = [-3, -2, -1, 1, 2, 3], fmt = String) {
  const w = new Set();
  let guard = 0;
  while (w.size < 3 && guard++ < 50) {
    const v = a + rng.pick(steps);
    if (v !== a && v >= 0) w.add(fmt(v));
  }
  while (w.size < 3) w.add(fmt(a + w.size + 4));
  return { a: fmt(a), w: [...w] };
}
const tl = n => `${Math.round(n).toLocaleString('tr-TR')} TL`;

// ——————————— ZAMANLAMA (8) ———————————
timingGame({ id: 'serbest_atis', name: 'Serbest Atış', icon: '🏀', target: '🗑️', verb: 'Atış', tags: ['spor'] });
timingGame({ id: 'voleybol_servis', name: 'Voleybol Servisi', icon: '🏐', target: '🥅', verb: 'Servis', perfect: 'AS!', tags: ['spor'] });
timingGame({ id: 'okculuk', name: 'Okçuluk', icon: '🏹', target: '🎯', verb: 'Ok', wind: true, tags: ['spor'] });
timingGame({ id: 'dart', name: 'Dart', icon: '🎯', target: '🔴', verb: 'Ok', perfect: 'BULLSEYE!', accel: true, tags: ['spor', 'sosyal'] });
timingGame({ id: 'golf', name: 'Golf Vuruşu', icon: '🏌️', target: '⛳', verb: 'Vuruş', wind: true, perfect: 'Deliğe!', tags: ['spor'] });
timingGame({ id: 'bowling', name: 'Bowling', icon: '🎳', target: '🎳', verb: 'Atış', perfect: 'STRIKE!', tags: ['spor', 'sosyal'] });
timingGame({ id: 'halter', name: 'Halter', icon: '🏋️', target: '💪', verb: 'Kaldırış', perfect: 'Temiz kaldırış!', accel: true, tags: ['spor'] });
timingGame({ id: 'uzun_atlama', name: 'Uzun Atlama', icon: '🏃', target: '🟫', verb: 'Atlayış', perfect: 'Tam tahtadan!', missText: 'Faul!', accel: true, tags: ['spor'] });

// ——————————— YAKALAMA (5) ———————————
catchGame({ id: 'kiraz', name: 'Kiraz Toplama', icon: '🍒', basket: '🧺', good: ['🍒', '🍒', '🍑'], bad: ['🐛', '🍂'], bg: '#1f3b24', tags: ['tarim'] });
catchGame({ id: 'kargo_yakala', name: 'Kargo Bandı', icon: '📦', basket: '🛒', good: ['📦', '📦', '✉️'], bad: ['💥', '🧨'], bg: '#2b2f3a', tags: ['is'] });
catchGame({ id: 'yumurta', name: 'Yumurta Kapma', icon: '🥚', basket: '🪺', good: ['🥚', '🥚', '🐣'], bad: ['🪨', '💩'], bg: '#3a3220', sway: true, tags: ['tarim'] });
catchGame({ id: 'damla', name: 'Yağmur Suyu', icon: '💧', basket: '🪣', good: ['💧', '💧', '💦'], bad: ['🧊', '⚡'], bg: '#1a2a44', sway: true, tags: ['tarim', 'ev'] });
catchGame({ id: 'topla_cop', name: 'Çevre Temizliği', icon: '♻️', basket: '🗑️', good: ['🥤', '📰', '🧃', '🥫'], bad: ['🐦', '🌸'], bg: '#27402c', tags: ['sosyal'] });

// ——————————— AYIKLAMA (10) ———————————
sortGame({ id: 'geri_donusum', name: 'Geri Dönüşüm', icon: '♻️', bins: ['🟦 Kâğıt', '🟨 Plastik', '🟩 Cam', '⬛ Metal'], tags: ['ev'],
  items: [['📰 Gazete', 0], ['📦 Karton kutu', 0], ['📓 Eski defter', 0], ['🧴 Şampuan şişesi', 1], ['🥤 Pet şişe', 1], ['🛍️ Poşet', 1], ['🍾 Cam şişe', 2], ['🫙 Kavanoz', 2], ['🥫 Konserve kutusu', 3], ['🥤 Alüminyum kutu', 3], ['🔩 Vida', 3], ['🧃 Yoğurt kabı', 1], ['📄 Fatura kâğıdı', 0], ['🍷 Kırık bardak', 2]] });
sortGame({ id: 'kutuphane', name: 'Kütüphane Rafı', icon: '📚', bins: ['Roman', 'Bilim', 'Tarih', 'Şiir'], tags: ['zihin'],
  items: [['Suç ve Ceza', 0], ['Kürk Mantolu Madonna', 0], ['Sefiller', 0], ['İnce Memed', 0], ['Kozmos', 1], ['Zamanın Kısa Tarihi', 1], ['Türlerin Kökeni', 1], ['Nutuk', 2], ['Osmanlı Tarihi', 2], ['Kutadgu Bilig', 3], ['Safahat', 3], ['Kuvâyi Milliye Destanı', 3], ['Bencil Gen', 1], ['Yaban', 0], ['Göğe Bakma Durağı', 3], ['Harp Tarihi', 2]] });
sortGame({ id: 'posta', name: 'Postane Ayıklama', icon: '📮', bins: ['Marmara', 'Ege', 'İç Anadolu', 'Karadeniz'], tags: ['is'],
  items: [['İstanbul', 0], ['Bursa', 0], ['Kocaeli', 0], ['Tekirdağ', 0], ['İzmir', 1], ['Aydın', 1], ['Muğla', 1], ['Manisa', 1], ['Ankara', 2], ['Konya', 2], ['Kayseri', 2], ['Eskişehir', 2], ['Trabzon', 3], ['Samsun', 3], ['Rize', 3], ['Ordu', 3], ['Balıkesir', 0], ['Denizli', 1], ['Sivas', 2], ['Giresun', 3]] });
sortGame({ id: 'hayvan_sinif', name: 'Hayvan Sınıfları', icon: '🦁', bins: ['Memeli', 'Kuş', 'Sürüngen', 'Balık'], tags: ['zihin'],
  items: [['🐬 Yunus', 0], ['🦇 Yarasa', 0], ['🐄 İnek', 0], ['🐋 Balina', 0], ['🐧 Penguen', 1], ['🦉 Baykuş', 1], ['🦩 Flamingo', 1], ['🐢 Kaplumbağa', 2], ['🐍 Yılan', 2], ['🦎 Kertenkele', 2], ['🐊 Timsah', 2], ['🦈 Köpekbalığı', 3], ['🐟 Hamsi', 3], ['🐡 Balon balığı', 3], ['🦅 Kartal', 1], ['🐎 At', 0]] });
sortGame({ id: 'kelime_turu', name: 'Kelime Türleri', icon: '🔤', bins: ['İsim', 'Sıfat', 'Fiil', 'Zarf'], tags: ['zihin'],
  items: [['masa', 0], ['kitap', 0], ['şehir', 0], ['güzel', 1], ['kırmızı', 1], ['uzun', 1], ['koşmak', 2], ['yazdı', 2], ['gelecek', 2], ['hızlıca', 3], ['yavaş yavaş', 3], ['dün', 3], ['bahçe', 0], ['akıllı', 1], ['okuyor', 2], ['erken', 3]] });
sortGame({ id: 'asal_sayi', name: 'Sayı Avcısı', icon: '🔢', bins: ['Asal', 'Çift (asal değil)', 'Tek (asal değil)'], target: 16, tags: ['zihin'],
  items: [['2', 0], ['3', 0], ['5', 0], ['7', 0], ['11', 0], ['13', 0], ['17', 0], ['19', 0], ['23', 0], ['29', 0], ['31', 0], ['37', 0], ['4', 1], ['12', 1], ['18', 1], ['28', 1], ['36', 1], ['50', 1], ['9', 2], ['15', 2], ['21', 2], ['25', 2], ['27', 2], ['33', 2], ['39', 2], ['49', 2], ['51', 2]] });
sortGame({ id: 'besin_grubu', name: 'Besin Grupları', icon: '🥗', bins: ['Protein', 'Karbonhidrat', 'Vitamin/Lif', 'Yağ'], tags: ['saglik'],
  items: [['🥚 Yumurta', 0], ['🍗 Tavuk', 0], ['🫘 Mercimek', 0], ['🐟 Balık', 0], ['🍞 Ekmek', 1], ['🍚 Pirinç', 1], ['🍝 Makarna', 1], ['🥔 Patates', 1], ['🥦 Brokoli', 2], ['🥕 Havuç', 2], ['🍊 Portakal', 2], ['🥬 Ispanak', 2], ['🧈 Tereyağı', 3], ['🫒 Zeytinyağı', 3], ['🥜 Fındık', 3], ['🥑 Avokado', 3]] });
sortGame({ id: 'kita_ulke', name: 'Kıtalar', icon: '🌍', bins: ['Avrupa', 'Asya', 'Afrika', 'Amerika'], tags: ['zihin'],
  items: [['Fransa', 0], ['Polonya', 0], ['Norveç', 0], ['Portekiz', 0], ['Japonya', 1], ['Hindistan', 1], ['Vietnam', 1], ['Kazakistan', 1], ['Mısır', 2], ['Nijerya', 2], ['Kenya', 2], ['Fas', 2], ['Brezilya', 3], ['Kanada', 3], ['Meksika', 3], ['Arjantin', 3], ['Macaristan', 0], ['Endonezya', 1], ['Gana', 2], ['Şili', 3]] });
sortGame({ id: 'camasir', name: 'Çamaşır Ayırma', icon: '🧺', bins: ['⚪ Beyazlar', '⚫ Koyular', '🎨 Renkliler', '🧼 Elde yıka'], tags: ['ev'],
  items: [['Beyaz gömlek', 0], ['Beyaz çorap', 0], ['Havlu (beyaz)', 0], ['Siyah kot', 1], ['Lacivert kazak', 1], ['Koyu gri eşofman', 1], ['Kırmızı tişört', 2], ['Sarı elbise', 2], ['Yeşil şort', 2], ['İpek eşarp', 3], ['Yün hırka', 3], ['Dantel bluz', 3]] });
sortGame({ id: 'ilac_dolabi', name: 'Eczane Rafı', icon: '💊', bins: ['Ağrı kesici', 'Antibiyotik', 'Alerji', 'Mide'], tags: ['saglik'],
  items: [['Parasetamol', 0], ['İbuprofen', 0], ['Naproksen', 0], ['Amoksisilin', 1], ['Azitromisin', 1], ['Sefuroksim', 1], ['Setirizin', 2], ['Loratadin', 2], ['Desloratadin', 2], ['Omeprazol', 3], ['Pantoprazol', 3], ['Antiasit şurup', 3]] });

// ——————————— EŞLEŞTİRME (8) ———————————
pairGame({ id: 'baskent', name: 'Başkentler', icon: '🏛️', hint: 'Ülke → başkent', tags: ['zihin'],
  pairs: [['Türkiye', 'Ankara'], ['Fransa', 'Paris'], ['Almanya', 'Berlin'], ['İtalya', 'Roma'], ['İspanya', 'Madrid'], ['Japonya', 'Tokyo'], ['Rusya', 'Moskova'], ['Mısır', 'Kahire'], ['Kanada', 'Ottawa'], ['Avustralya', 'Kanberra'], ['Brezilya', 'Brasilia'], ['Azerbaycan', 'Bakü'], ['Yunanistan', 'Atina'], ['İran', 'Tahran'], ['Hollanda', 'Amsterdam'], ['Güney Kore', 'Seul'], ['Macaristan', 'Budapeşte'], ['Kazakistan', 'Astana']] });
pairGame({ id: 'es_anlam', name: 'Eş Anlam', icon: '📝', hint: 'Kelime → eş anlamlısı', tags: ['zihin'],
  pairs: [['siyah', 'kara'], ['kırmızı', 'al'], ['okul', 'mektep'], ['cevap', 'yanıt'], ['soru', 'sual'], ['öğrenci', 'talebe'], ['doktor', 'hekim'], ['yaşlı', 'ihtiyar'], ['hediye', 'armağan'], ['misafir', 'konuk'], ['zengin', 'varlıklı'], ['ülke', 'yurt'], ['yıl', 'sene'], ['akıl', 'us'], ['sınav', 'imtihan'], ['kalp', 'yürek'], ['şehir', 'kent'], ['özgürlük', 'hürriyet']] });
pairGame({ id: 'ingilizce', name: 'İngilizce Kelime', icon: '🇬🇧', hint: 'English → Türkçe', tags: ['zihin'],
  pairs: [['apple', 'elma'], ['book', 'kitap'], ['window', 'pencere'], ['kitchen', 'mutfak'], ['bridge', 'köprü'], ['weather', 'hava durumu'], ['honest', 'dürüst'], ['borrow', 'ödünç almak'], ['achieve', 'başarmak'], ['neighbour', 'komşu'], ['careful', 'dikkatli'], ['journey', 'yolculuk'], ['improve', 'geliştirmek'], ['decide', 'karar vermek'], ['angry', 'kızgın'], ['cheap', 'ucuz'], ['wide', 'geniş'], ['forget', 'unutmak']] });
pairGame({ id: 'alet_meslek', name: 'Alet ve Meslek', icon: '🧰', hint: 'Alet → meslek', tags: ['is'],
  pairs: [['Stetoskop', 'Doktor'], ['Mala', 'Duvarcı'], ['Makas & tarak', 'Berber'], ['Pense', 'Elektrikçi'], ['Rende', 'Marangoz'], ['Boru anahtarı', 'Tesisatçı'], ['Kepçe', 'Aşçı'], ['Tebeşir', 'Öğretmen'], ['Mikrofon', 'Muhabir'], ['Terazi', 'Manav'], ['Fırça & palet', 'Ressam'], ['Düdük', 'Hakem'], ['Tokmak', 'Hâkim'], ['Kaynak maskesi', 'Kaynakçı'], ['Pusula & harita', 'Denizci'], ['Diş aynası', 'Diş hekimi']] });
pairGame({ id: 'element_sembol', name: 'Elementler', icon: '⚗️', hint: 'Element → sembol', tags: ['zihin'],
  pairs: [['Hidrojen', 'H'], ['Oksijen', 'O'], ['Karbon', 'C'], ['Azot', 'N'], ['Sodyum', 'Na'], ['Potasyum', 'K'], ['Demir', 'Fe'], ['Bakır', 'Cu'], ['Altın', 'Au'], ['Gümüş', 'Ag'], ['Kalsiyum', 'Ca'], ['Klor', 'Cl'], ['Kükürt', 'S'], ['Çinko', 'Zn'], ['Magnezyum', 'Mg'], ['Helyum', 'He'], ['Kurşun', 'Pb'], ['Cıva', 'Hg']] });
pairGame({ id: 'yazar_eser', name: 'Yazar ve Eser', icon: '✒️', hint: 'Eser → yazar', tags: ['zihin'],
  pairs: [['Çalıkuşu', 'Reşat Nuri'], ['İnce Memed', 'Yaşar Kemal'], ['Saatleri Ayarlama Enstitüsü', 'A. H. Tanpınar'], ['Kürk Mantolu Madonna', 'Sabahattin Ali'], ['Sinekli Bakkal', 'Halide Edip'], ['Yaban', 'Yakup Kadri'], ['Safahat', 'Mehmet Akif'], ['Memleketimden İnsan Manzaraları', 'Nazım Hikmet'], ['Tutunamayanlar', 'Oğuz Atay'], ['Aşk-ı Memnu', 'Halit Ziya'], ['Suç ve Ceza', 'Dostoyevski'], ['Sefiller', 'Victor Hugo'], ['Hamlet', 'Shakespeare'], ['Dönüşüm', 'Kafka'], ['Semaver', 'Sait Faik'], ['Araba Sevdası', 'Recaizade Ekrem']] });
pairGame({ id: 'hayvan_yavru', name: 'Hayvan Yavruları', icon: '🐣', hint: 'Hayvan → yavrusu', tags: ['tarim'],
  pairs: [['İnek', 'Buzağı'], ['At', 'Tay'], ['Koyun', 'Kuzu'], ['Keçi', 'Oğlak'], ['Köpek', 'Enik'], ['Kedi', 'Yavru kedi'], ['Tavuk', 'Civciv'], ['Ördek', 'Palaz'], ['Deve', 'Köşek'], ['Eşek', 'Sıpa'], ['Manda', 'Malak'], ['Kurbağa', 'İribaş'], ['Ayı', 'Ayı yavrusu']] });
pairGame({ id: 'sekil_alan', name: 'Formül Eşle', icon: '📐', hint: 'Şekil → alan formülü', tags: ['zihin', 'teknik'],
  pairs: [['Kare', 'a²'], ['Dikdörtgen', 'a·b'], ['Üçgen', '(taban·yükseklik)/2'], ['Daire', 'πr²'], ['Yamuk', '((a+c)/2)·h'], ['Paralelkenar', 'taban·yükseklik'], ['Küp hacmi', 'a³'], ['Silindir hacmi', 'πr²h'], ['Çember çevresi', '2πr'], ['Kare çevresi', '4a'], ['Eşkenar üçgen çevresi', '3a'], ['Dikdörtgen çevresi', '2(a+b)']] });

// ——————————— FARKLIYI BUL (6) ———————————
oddGame({ id: 'kalite_kontrol', name: 'Kalite Kontrol', icon: '🔍', ask: 'Kusurlu ürünü bul', tags: ['is', 'teknik'], pairs: [['🔩', '🪛'], ['🥫', '🥤'], ['🧱', '🟫'], ['⚙️', '🔧'], ['🧴', '🧪']] });
oddGame({ id: 'sahte_para', name: 'Sahte Para', icon: '💵', ask: 'Sahte banknotu bul', tags: ['is', 'ticaret'], pairs: [['💵', '💴'], ['💶', '💷'], ['🪙', '🥇'], ['💴', '💵']] });
oddGame({ id: 'hastalikli_yaprak', name: 'Hastalıklı Bitki', icon: '🍂', ask: 'Hastalanan bitkiyi bul', tags: ['tarim'], pairs: [['🌿', '🍂'], ['🌱', '🥀'], ['🍀', '☘️'], ['🌾', '🌵']] });
oddGame({ id: 'dikkat_testi', name: 'Dikkat Testi', icon: '👁️', ask: 'Farklı harfi bul', tags: ['zihin'], pairs: [['O', 'Q'], ['E', 'F'], ['b', 'd'], ['6', '9'], ['M', 'N'], ['İ', 'I'], ['ş', 's'], ['ğ', 'g']] });
oddGame({ id: 'kayip_esya', name: 'Kayıp Eşya', icon: '🧳', ask: 'Sahibinin tarif ettiği bavulu bul', tags: ['is'], pairs: [['🧳', '💼'], ['🎒', '👜'], ['👝', '👛'], ['🛄', '🧳']] });
oddGame({ id: 'kamuflaj', name: 'Kamuflaj', icon: '🦎', ask: 'Saklanan hayvanı bul', tags: ['zihin', 'spor'], pairs: [['🌳', '🦉'], ['🌿', '🦎'], ['🪨', '🐸'], ['🌾', '🐇'], ['❄️', '🐻‍❄️']] });

// ——————————— SAYMA (4) ———————————
countGame({ id: 'stok_sayimi', name: 'Stok Sayımı', icon: '📋', target: '📦', noise: ['🧴', '🥫', '🛢️', '🧃'], bg: '#2a2a33', tags: ['ticaret', 'is'] });
countGame({ id: 'kalabalik', name: 'Kalabalık Tahmini', icon: '👥', target: '🧍', noise: ['🚶', '🧑‍🦯', '🐕', '🚲'], bg: '#303a2e', tags: ['sosyal'] });
countGame({ id: 'para_say', name: 'Kasa Sayımı', icon: '💰', target: '🪙', noise: ['💵', '🔘', '🧷', '🔑'], bg: '#2e2a1c', tags: ['ticaret'] });
countGame({ id: 'koyun_say', name: 'Sürü Sayımı', icon: '🐑', target: '🐑', noise: ['🐐', '🐄', '🐕', '🐓'], bg: '#2f4a25', tags: ['tarim'] });

// ——————————— İSTİFLEME (5) ———————————
stackGame({ id: 'vinc', name: 'Vinç Operatörü', icon: '🏗️', colors: ['#e6a23c', '#c9832a', '#f0b95a'], bg: '#1c2433', tags: ['teknik', 'is'] });
stackGame({ id: 'pasta_kat', name: 'Kat Pasta', icon: '🎂', colors: ['#f7c6d9', '#fff1c1', '#c98a5a', '#f3a6c0'], bg: '#2b1f2b', tags: ['ev', 'is'] });
stackGame({ id: 'kargo_istif', name: 'Palet İstifi', icon: '📦', colors: ['#b08050', '#9a6c40', '#c79a68'], label: '📦', bg: '#23262d', tags: ['is', 'ticaret'] });
stackGame({ id: 'kule_bloklari', name: 'Blok Kule', icon: '🧱', colors: ['#ff6b6b', '#4dabf7', '#ffd43b', '#69db7c'], bg: '#1e1b33', tags: ['zihin'] });
stackGame({ id: 'tugla_duvar', name: 'Duvar Örme', icon: '🧱', colors: ['#b5543a', '#a0482f', '#c7654a'], bg: '#2a2622', tags: ['teknik', 'is'] });

// ——————————— PARKUR (6) ———————————
runGame({ id: 'bisiklet', name: 'Bisiklet Turu', icon: '🚴', player: '🚴', obstacles: ['🕳️', '🚧', '🪨'], bonus: '💧', bg: '#3f5236', tags: ['spor'] });
runGame({ id: 'kurye_motor', name: 'Kurye Teslimatı', icon: '🛵', player: '🛵', obstacles: ['🚗', '🚕', '🚌', '🚧'], bonus: '📦', bg: '#404650', tags: ['is'] });
runGame({ id: 'slalom', name: 'Kayak Slalomu', icon: '⛷️', player: '⛷️', obstacles: ['🌲', '🚩', '🪨'], bonus: '⭐', bg: '#9fb4c8', tags: ['spor'] });
runGame({ id: 'surus', name: 'Güvenli Sürüş', icon: '🚗', player: '🚙', obstacles: ['🚗', '🚚', '🐕', '🚧'], bonus: '⛽', bg: '#3b3f47', tags: ['teknik'] });
runGame({ id: 'engelli_kosu', name: 'Engelli Koşu', icon: '🏃', player: '🏃', obstacles: ['🚧', '🪵', '🧱'], bonus: '⚡', bg: '#7a3d2a', tags: ['spor'] });
runGame({ id: 'yuzme', name: 'Açık Su Yüzme', icon: '🏊', player: '🏊', obstacles: ['🪼', '🛶', '🪸'], bonus: '🫧', bg: '#1b5a7a', tags: ['spor'] });

// ——————————— VURMA (5) ———————————
whackGame({ id: 'balon', name: 'Balon Patlat', icon: '🎈', good: '🎈', bad: '💣', hole: '', holeBg: '#27335a', tags: ['sosyal'] });
whackGame({ id: 'sinek', name: 'Sinek Avı', icon: '🪰', good: '🪰', bad: '🐝', hole: '', holeBg: '#3a3a2a', tags: ['ev'] });
whackGame({ id: 'hasere', name: 'Bağ Zararlıları', icon: '🐛', good: '🐛', bad: '🐞', hole: '🍃', holeBg: '#24411f', how: ['Yaprak kurdu 🐛 çıkınca hemen topla.', 'Uğur böceği 🐞 faydalıdır — ona dokunma!', '25 saniye.'], tags: ['tarim'] });
whackGame({ id: 'kostebek', name: 'Köstebek', icon: '🐹', good: '🐹', bad: '🐱', hole: '🕳️', holeBg: '#4a3520', tags: ['tarim'] });
whackGame({ id: 'yildiz', name: 'Yıldız Kaydı', icon: '🌠', good: '🌠', bad: '🛰️', hole: '', holeBg: '#0f1433', tags: ['zihin'] });

// ——————————— HASSAS AYAR (6) ———————————
dialGame({ id: 'terazi', name: 'Manav Terazisi', icon: '⚖️', min: 0, max: 5, dec: 2, unit: 'kg', ask: 'Müşteri istedi', gen: r => r.pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5]) + r.pick([0, 0.1, 0.2]), tags: ['ticaret'] });
dialGame({ id: 'doz_ayari', name: 'İlaç Dozu', icon: '💉', min: 0, max: 10, dec: 1, unit: 'ml', ask: 'Reçetedeki doz', tags: ['saglik'] });
dialGame({ id: 'firin_isi', name: 'Fırın Ayarı', icon: '🔥', min: 100, max: 260, dec: 0, unit: '°C', ask: 'Tarif sıcaklığı', gen: r => r.pick([150, 160, 170, 175, 180, 190, 200, 210, 220, 230]), tags: ['ev'] });
dialGame({ id: 'tarif_olcusu', name: 'Tarif Ölçüsü', icon: '🥣', min: 0, max: 1000, dec: 0, unit: 'g', ask: 'Tarife göre un', gen: r => r.int(6, 36) * 25, tags: ['ev'] });
dialGame({ id: 'ses_ayari', name: 'Ses Mikseri', icon: '🎚️', min: 0, max: 100, dec: 0, unit: 'dB', ask: 'Sahne sesi', tags: ['teknik', 'sanat'] });
dialGame({ id: 'su_basinci', name: 'Basınç Ayarı', icon: '🔧', min: 0, max: 6, dec: 1, unit: 'bar', ask: 'Tesisat basıncı', tags: ['teknik'] });

// ——————————— HIZLI SORU (6) ———————————
quickGame({ id: 'hedef_sayi', name: 'Zihinden İşlem', icon: '🧮', target: 11, tags: ['zihin'], gen: (r, d) => {
  const hi = 10 + Math.round(d * 60);
  const a = r.int(3, hi), b = r.int(2, Math.max(4, Math.round(hi / 2)));
  const op = r.pick(d > 0.5 ? ['+', '−', '×'] : ['+', '−']);
  const v = op === '+' ? a + b : op === '−' ? Math.abs(a - b) : a * (b % 12 + 2);
  const q = op === '×' ? `${a} × ${b % 12 + 2}` : op === '−' ? `${Math.max(a, b)} − ${Math.min(a, b)}` : `${a} + ${b}`;
  return { q: `${q} = ?`, ...near(v, r, op === '×' ? [-a, a, -2, 2, 10, -10] : [-10, -2, -1, 1, 2, 10]) };
} });
quickGame({ id: 'kesir_karsilastir', name: 'Kesir Kıyası', icon: '➗', target: 10, tags: ['zihin'], gen: r => {
  let fr = [];
  while (fr.length < 4) {
    const b = r.int(2, 12), a = r.int(1, b - 1), v = a / b;
    if (!fr.some(f => Math.abs(f.v - v) < 0.01)) fr.push({ s: `${a}/${b}`, v });
  }
  const big = r.chance(0.5);
  const best = fr.reduce((m, f) => (big ? f.v > m.v : f.v < m.v) ? f : m);
  return { q: `Hangisi en ${big ? 'BÜYÜK' : 'KÜÇÜK'}?`, a: best.s, w: fr.filter(f => f !== best).map(f => f.s) };
} });
quickGame({ id: 'fatura_hesap', name: 'Fatura Hesabı', icon: '🧾', target: 9, tags: ['ticaret', 'ev'], gen: (r, d) => {
  const t = r.int(0, 2);
  if (t === 0) { const n = r.int(2, 9), p = r.int(3, 40) * 5; return { q: `${n} adet × ${tl(p)} = ?`, ...near(n * p, r, [-p, p, -10, 10, 5 * n], tl) }; }
  if (t === 1) { const p = r.int(10, 80) * 10, pc = r.pick([10, 20, 25, 50]); return { q: `${tl(p)} ürüne %${pc} indirim. Yeni fiyat?`, ...near(p - p * pc / 100, r, [-p * 0.05, p * 0.05, p * pc / 100, -10], tl) }; }
  const k = r.int(80, 400), fiyat = r.pick([2, 3, 4, 5]); return { q: `${k} kWh elektrik, kWh başı ${fiyat} TL. Fatura?`, ...near(k * fiyat, r, [-k, k, -20, 20, 50], tl) };
} });
quickGame({ id: 'birim_cevirme', name: 'Birim Çevirme', icon: '📏', target: 10, tags: ['zihin', 'teknik'], gen: r => {
  const T = [['km', 'm', 1000], ['m', 'cm', 100], ['kg', 'g', 1000], ['L', 'mL', 1000], ['saat', 'dakika', 60], ['dakika', 'saniye', 60], ['ton', 'kg', 1000], ['gün', 'saat', 24]];
  const [a, b, k] = r.pick(T), n = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15]);
  const v = n * k;
  return { q: `${n} ${a} = kaç ${b}?`, a: String(v), w: [String(v * 10), String(v / 10), String(n * (k === 60 ? 100 : k === 24 ? 12 : 60))].filter(x => x !== String(v)).concat([String(v + k)]).slice(0, 3) };
} });
quickGame({ id: 'yuzde_hesap', name: 'Faiz ve Yüzde', icon: '📈', target: 9, tags: ['ticaret', 'zihin'], gen: r => {
  const ana = r.int(2, 20) * 1000, f = r.pick([5, 10, 15, 20, 25, 30, 40, 50]);
  if (r.chance(0.5)) return { q: `${tl(ana)} yıllık %${f} faizle 1 yıl sonra?`, ...near(ana * (1 + f / 100), r, [-ana * 0.05, ana * 0.05, -ana * f / 100, ana * 0.1], tl) };
  return { q: `${tl(ana)} tutarın %${f}'i kaç?`, ...near(ana * f / 100, r, [-ana * 0.05, ana * 0.05, ana * 0.1, -500], tl) };
} });
quickGame({ id: 'saat_hesap', name: 'Vardiya Saati', icon: '⏰', target: 10, tags: ['is'], gen: r => {
  const bh = r.int(6, 20), bm = r.pick([0, 15, 30, 45]), dh = r.int(1, 9), dm = r.pick([0, 15, 30, 45]);
  const tot = (bh * 60 + bm + dh * 60 + dm) % (24 * 60);
  const f = m => `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String(((m % 60) + 60) % 60).padStart(2, '0')}`;
  return { q: `Vardiya ${f(bh * 60 + bm)}'de başladı, ${dh} saat ${dm} dakika sürdü. Bitiş?`, a: f(tot), w: [f(tot + 60), f(tot - 30), f(tot + 15)] };
} });

// ——————————— KONUŞMA SAHNELERİ (5) ———————————
const scene = (id, name, icon, key, tags) => register({
  id, name, icon, tags,
  how: [SCENES[key].t, 'Her turda karşındakinin ruh hâlini oku ve en uygun cevabı seç.', 'Sakin, dürüst ve çözüm odaklı olmak ikna eder.', 'Süre sınırlı.'],
  play: (stage, api) => getGame('konusma').play(stage, { ...api, extra: { ...api.extra, scene: key } }),
});
scene('musteri_sikayeti', 'Müşteri Şikâyeti', '😠', 'musteri', ['ticaret', 'sosyal']);
scene('hasta_bilgilendirme', 'Hasta Bilgilendirme', '🩺', 'hasta', ['saglik', 'sosyal']);
scene('veli_gorusmesi', 'Veli Görüşmesi', '👪', 'veli', ['sosyal']);
scene('basin_toplantisi', 'Basın Toplantısı', '🎙️', 'basin', ['sosyal', 'liderlik']);
scene('kriz_yonetimi', 'Kriz Toplantısı', '🚨', 'kriz', ['liderlik']);

// ——————————— RİTİM ÇEŞİTLERİ (2) ———————————
const rhythm = (id, name, icon, tags, how) => register({ id, name, icon, tags, how, play: (stage, api) => getGame('ritim').play(stage, api) });
rhythm('davul', 'Davul Ritmi', '🥁', ['sanat'], ['Davul vuruşları dört şeritte düşer.', 'Vuruş çizgiye gelince o şeride dokun.', 'Tempo becerine göre artar.']);
rhythm('dans', 'Dans Adımları', '💃', ['sanat', 'sosyal'], ['Adımlar dört şeritte gelir.', 'Adım çizgiye gelince o şeride dokun.', 'Kombo kaçırma, sahne seni izliyor!']);
