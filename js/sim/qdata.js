// Soru üreticisinin veri tabloları. Her satırdan birden çok soru türetilir.

// [ülke, başkent, kıta, para birimi]
export const COUNTRIES = [
  ['Türkiye', 'Ankara', 'Asya/Avrupa', 'Lira'], ['Fransa', 'Paris', 'Avrupa', 'Euro'], ['Almanya', 'Berlin', 'Avrupa', 'Euro'],
  ['İtalya', 'Roma', 'Avrupa', 'Euro'], ['İspanya', 'Madrid', 'Avrupa', 'Euro'], ['Portekiz', 'Lizbon', 'Avrupa', 'Euro'],
  ['Birleşik Krallık', 'Londra', 'Avrupa', 'Sterlin'], ['Rusya', 'Moskova', 'Avrupa/Asya', 'Ruble'], ['Yunanistan', 'Atina', 'Avrupa', 'Euro'],
  ['Bulgaristan', 'Sofya', 'Avrupa', 'Leva'], ['Romanya', 'Bükreş', 'Avrupa', 'Ley'], ['Macaristan', 'Budapeşte', 'Avrupa', 'Forint'],
  ['Polonya', 'Varşova', 'Avrupa', 'Zloti'], ['Hollanda', 'Amsterdam', 'Avrupa', 'Euro'], ['Belçika', 'Brüksel', 'Avrupa', 'Euro'],
  ['İsviçre', 'Bern', 'Avrupa', 'Frank'], ['Avusturya', 'Viyana', 'Avrupa', 'Euro'], ['İsveç', 'Stockholm', 'Avrupa', 'Kron'],
  ['Norveç', 'Oslo', 'Avrupa', 'Kron'], ['Finlandiya', 'Helsinki', 'Avrupa', 'Euro'], ['Danimarka', 'Kopenhag', 'Avrupa', 'Kron'],
  ['Ukrayna', 'Kiev', 'Avrupa', 'Grivna'], ['Sırbistan', 'Belgrad', 'Avrupa', 'Dinar'], ['Bosna-Hersek', 'Saraybosna', 'Avrupa', 'Mark'],
  ['Arnavutluk', 'Tiran', 'Avrupa', 'Lek'], ['Azerbaycan', 'Bakü', 'Asya', 'Manat'], ['Gürcistan', 'Tiflis', 'Asya', 'Lari'],
  ['Kazakistan', 'Astana', 'Asya', 'Tenge'], ['Özbekistan', 'Taşkent', 'Asya', 'Som'], ['Türkmenistan', 'Aşkabat', 'Asya', 'Manat'],
  ['Kırgızistan', 'Bişkek', 'Asya', 'Som'], ['İran', 'Tahran', 'Asya', 'Riyal'], ['Irak', 'Bağdat', 'Asya', 'Dinar'],
  ['Suriye', 'Şam', 'Asya', 'Lira'], ['Suudi Arabistan', 'Riyad', 'Asya', 'Riyal'], ['Japonya', 'Tokyo', 'Asya', 'Yen'],
  ['Çin', 'Pekin', 'Asya', 'Yuan'], ['Güney Kore', 'Seul', 'Asya', 'Won'], ['Hindistan', 'Yeni Delhi', 'Asya', 'Rupi'],
  ['Pakistan', 'İslamabad', 'Asya', 'Rupi'], ['Endonezya', 'Cakarta', 'Asya', 'Rupiah'], ['Tayland', 'Bangkok', 'Asya', 'Baht'],
  ['Mısır', 'Kahire', 'Afrika', 'Pound'], ['Fas', 'Rabat', 'Afrika', 'Dirhem'], ['Cezayir', 'Cezayir', 'Afrika', 'Dinar'],
  ['Tunus', 'Tunus', 'Afrika', 'Dinar'], ['Nijerya', 'Abuja', 'Afrika', 'Naira'], ['Kenya', 'Nairobi', 'Afrika', 'Şilin'],
  ['Güney Afrika', 'Pretorya', 'Afrika', 'Rand'], ['Etiyopya', 'Addis Ababa', 'Afrika', 'Birr'], ['ABD', 'Washington', 'Amerika', 'Dolar'],
  ['Kanada', 'Ottawa', 'Amerika', 'Dolar'], ['Meksika', 'Meksiko', 'Amerika', 'Peso'], ['Brezilya', 'Brasilia', 'Amerika', 'Real'],
  ['Arjantin', 'Buenos Aires', 'Amerika', 'Peso'], ['Şili', 'Santiago', 'Amerika', 'Peso'], ['Peru', 'Lima', 'Amerika', 'Sol'],
  ['Kolombiya', 'Bogota', 'Amerika', 'Peso'], ['Avustralya', 'Kanberra', 'Okyanusya', 'Dolar'], ['Yeni Zelanda', 'Wellington', 'Okyanusya', 'Dolar'],
];

// [il, bölge, plaka]
export const PROVINCES = [
  ['Adana', 'Akdeniz', 1], ['Adıyaman', 'Güneydoğu Anadolu', 2], ['Afyonkarahisar', 'Ege', 3], ['Ağrı', 'Doğu Anadolu', 4], ['Amasya', 'Karadeniz', 5],
  ['Ankara', 'İç Anadolu', 6], ['Antalya', 'Akdeniz', 7], ['Artvin', 'Karadeniz', 8], ['Aydın', 'Ege', 9], ['Balıkesir', 'Marmara', 10],
  ['Bilecik', 'Marmara', 11], ['Bingöl', 'Doğu Anadolu', 12], ['Bitlis', 'Doğu Anadolu', 13], ['Bolu', 'Karadeniz', 14], ['Burdur', 'Akdeniz', 15],
  ['Bursa', 'Marmara', 16], ['Çanakkale', 'Marmara', 17], ['Çankırı', 'İç Anadolu', 18], ['Çorum', 'Karadeniz', 19], ['Denizli', 'Ege', 20],
  ['Diyarbakır', 'Güneydoğu Anadolu', 21], ['Edirne', 'Marmara', 22], ['Elazığ', 'Doğu Anadolu', 23], ['Erzincan', 'Doğu Anadolu', 24], ['Erzurum', 'Doğu Anadolu', 25],
  ['Eskişehir', 'İç Anadolu', 26], ['Gaziantep', 'Güneydoğu Anadolu', 27], ['Giresun', 'Karadeniz', 28], ['Gümüşhane', 'Karadeniz', 29], ['Hakkâri', 'Doğu Anadolu', 30],
  ['Hatay', 'Akdeniz', 31], ['Isparta', 'Akdeniz', 32], ['Mersin', 'Akdeniz', 33], ['İstanbul', 'Marmara', 34], ['İzmir', 'Ege', 35],
  ['Kars', 'Doğu Anadolu', 36], ['Kastamonu', 'Karadeniz', 37], ['Kayseri', 'İç Anadolu', 38], ['Kırklareli', 'Marmara', 39], ['Kırşehir', 'İç Anadolu', 40],
  ['Kocaeli', 'Marmara', 41], ['Konya', 'İç Anadolu', 42], ['Kütahya', 'Ege', 43], ['Malatya', 'Doğu Anadolu', 44], ['Manisa', 'Ege', 45],
  ['Kahramanmaraş', 'Akdeniz', 46], ['Mardin', 'Güneydoğu Anadolu', 47], ['Muğla', 'Ege', 48], ['Muş', 'Doğu Anadolu', 49], ['Nevşehir', 'İç Anadolu', 50],
  ['Niğde', 'İç Anadolu', 51], ['Ordu', 'Karadeniz', 52], ['Rize', 'Karadeniz', 53], ['Sakarya', 'Marmara', 54], ['Samsun', 'Karadeniz', 55],
  ['Siirt', 'Güneydoğu Anadolu', 56], ['Sinop', 'Karadeniz', 57], ['Sivas', 'İç Anadolu', 58], ['Tekirdağ', 'Marmara', 59], ['Tokat', 'Karadeniz', 60],
  ['Trabzon', 'Karadeniz', 61], ['Tunceli', 'Doğu Anadolu', 62], ['Şanlıurfa', 'Güneydoğu Anadolu', 63], ['Uşak', 'Ege', 64], ['Van', 'Doğu Anadolu', 65],
  ['Yozgat', 'İç Anadolu', 66], ['Zonguldak', 'Karadeniz', 67], ['Aksaray', 'İç Anadolu', 68], ['Bayburt', 'Karadeniz', 69], ['Karaman', 'İç Anadolu', 70],
  ['Kırıkkale', 'İç Anadolu', 71], ['Batman', 'Güneydoğu Anadolu', 72], ['Şırnak', 'Güneydoğu Anadolu', 73], ['Bartın', 'Karadeniz', 74], ['Ardahan', 'Doğu Anadolu', 75],
  ['Iğdır', 'Doğu Anadolu', 76], ['Yalova', 'Marmara', 77], ['Karabük', 'Karadeniz', 78], ['Kilis', 'Güneydoğu Anadolu', 79], ['Osmaniye', 'Akdeniz', 80], ['Düzce', 'Karadeniz', 81],
];

// [İngilizce, Türkçe]
export const ENGLISH = [
  ['apple', 'elma'], ['book', 'kitap'], ['window', 'pencere'], ['kitchen', 'mutfak'], ['bridge', 'köprü'], ['weather', 'hava durumu'],
  ['honest', 'dürüst'], ['borrow', 'ödünç almak'], ['achieve', 'başarmak'], ['neighbour', 'komşu'], ['careful', 'dikkatli'], ['journey', 'yolculuk'],
  ['improve', 'geliştirmek'], ['decide', 'karar vermek'], ['angry', 'kızgın'], ['cheap', 'ucuz'], ['wide', 'geniş'], ['forget', 'unutmak'],
  ['library', 'kütüphane'], ['healthy', 'sağlıklı'], ['behaviour', 'davranış'], ['environment', 'çevre'], ['knowledge', 'bilgi'], ['employee', 'çalışan'],
  ['salary', 'maaş'], ['invite', 'davet etmek'], ['arrive', 'varmak'], ['brave', 'cesur'], ['lazy', 'tembel'], ['proud', 'gururlu'],
  ['guilty', 'suçlu'], ['shy', 'utangaç'], ['rent', 'kira'], ['grow', 'büyümek'], ['increase', 'artırmak'], ['reduce', 'azaltmak'],
  ['support', 'desteklemek'], ['explain', 'açıklamak'], ['compare', 'karşılaştırmak'], ['avoid', 'kaçınmak'], ['deserve', 'hak etmek'], ['suggest', 'önermek'],
  ['ancient', 'antik'], ['crowded', 'kalabalık'], ['empty', 'boş'], ['enough', 'yeterli'], ['already', 'zaten'], ['although', 'rağmen'],
  ['hospital', 'hastane'], ['medicine', 'ilaç'], ['cough', 'öksürük'], ['injury', 'yaralanma'], ['field', 'tarla'], ['harvest', 'hasat'],
  ['bank account', 'banka hesabı'], ['loan', 'kredi'], ['profit', 'kâr'], ['loss', 'zarar'], ['customer', 'müşteri'], ['warehouse', 'depo'],
  ['government', 'hükümet'], ['election', 'seçim'], ['law', 'kanun'], ['court', 'mahkeme'], ['witness', 'tanık'], ['evidence', 'kanıt'],
  ['experiment', 'deney'], ['research', 'araştırma'], ['result', 'sonuç'], ['measure', 'ölçmek'], ['earthquake', 'deprem'], ['flood', 'sel'],
];

// [kelime, eş anlamlı]
export const SYNONYMS = [
  ['siyah', 'kara'], ['kırmızı', 'al'], ['okul', 'mektep'], ['cevap', 'yanıt'], ['soru', 'sual'], ['öğrenci', 'talebe'], ['doktor', 'hekim'],
  ['yaşlı', 'ihtiyar'], ['hediye', 'armağan'], ['misafir', 'konuk'], ['ülke', 'yurt'], ['yıl', 'sene'], ['akıl', 'us'], ['sınav', 'imtihan'],
  ['kalp', 'yürek'], ['şehir', 'kent'], ['özgürlük', 'hürriyet'], ['beyaz', 'ak'], ['ad', 'isim'], ['cümle', 'tümce'], ['örnek', 'misal'],
  ['kelime', 'sözcük'], ['doğa', 'tabiat'], ['düşünce', 'fikir'], ['zaman', 'vakit'], ['güç', 'kuvvet'], ['savaş', 'harp'], ['barış', 'sulh'],
  ['onur', 'şeref'], ['ilgi', 'alaka'], ['neden', 'sebep'], ['anı', 'hatıra'], ['yoksul', 'fakir'], ['sonuç', 'netice'], ['yardım', 'destek'],
  ['uyarı', 'ikaz'], ['görev', 'vazife'], ['istek', 'arzu'], ['çaba', 'gayret'], ['olanak', 'imkân'],
];
// [kelime, zıt anlamlı]
export const ANTONYMS = [
  ['uzun', 'kısa'], ['sıcak', 'soğuk'], ['zengin', 'fakir'], ['erken', 'geç'], ['kolay', 'zor'], ['hızlı', 'yavaş'], ['genç', 'yaşlı'],
  ['cesur', 'korkak'], ['dolu', 'boş'], ['ağır', 'hafif'], ['temiz', 'kirli'], ['aydınlık', 'karanlık'], ['ucuz', 'pahalı'], ['kazanmak', 'kaybetmek'],
  ['gelmek', 'gitmek'], ['açmak', 'kapamak'], ['yükselmek', 'alçalmak'], ['iyimser', 'kötümser'], ['cömert', 'cimri'], ['dost', 'düşman'],
  ['tatlı', 'acı'], ['geniş', 'dar'], ['derin', 'sığ'], ['ıslak', 'kuru'], ['kalın', 'ince'], ['yakın', 'uzak'], ['var', 'yok'],
  ['alış', 'satış'], ['giriş', 'çıkış'], ['başlangıç', 'bitiş'], ['savaş', 'barış'], ['doğru', 'yanlış'], ['çalışkan', 'tembel'], ['sessiz', 'gürültülü'],
];

// [element, sembol, atom numarası]
export const ELEMENTS = [
  ['Hidrojen', 'H', 1], ['Helyum', 'He', 2], ['Lityum', 'Li', 3], ['Karbon', 'C', 6], ['Azot', 'N', 7], ['Oksijen', 'O', 8], ['Flor', 'F', 9],
  ['Neon', 'Ne', 10], ['Sodyum', 'Na', 11], ['Magnezyum', 'Mg', 12], ['Alüminyum', 'Al', 13], ['Silisyum', 'Si', 14], ['Fosfor', 'P', 15],
  ['Kükürt', 'S', 16], ['Klor', 'Cl', 17], ['Argon', 'Ar', 18], ['Potasyum', 'K', 19], ['Kalsiyum', 'Ca', 20], ['Demir', 'Fe', 26],
  ['Bakır', 'Cu', 29], ['Çinko', 'Zn', 30], ['Gümüş', 'Ag', 47], ['Kalay', 'Sn', 50], ['İyot', 'I', 53], ['Altın', 'Au', 79], ['Cıva', 'Hg', 80], ['Kurşun', 'Pb', 82],
];

// [eser, yazar] — dünya edebiyatı (her dilde ortak)
export const WORKS = [
  ['Suç ve Ceza', 'Fyodor Dostoyevski'], ['Karamazov Kardeşler', 'Fyodor Dostoyevski'], ['Savaş ve Barış', 'Lev Tolstoy'], ['Anna Karenina', 'Lev Tolstoy'],
  ['Sefiller', 'Victor Hugo'], ['Notre Dame\'ın Kamburu', 'Victor Hugo'], ['Hamlet', 'William Shakespeare'], ['Romeo ve Juliet', 'William Shakespeare'],
  ['Dönüşüm', 'Franz Kafka'], ['Dava', 'Franz Kafka'], ['Don Kişot', 'Miguel de Cervantes'], ['Küçük Prens', 'Antoine de Saint-Exupéry'],
  ['1984', 'George Orwell'], ['Hayvan Çiftliği', 'George Orwell'], ['Simyacı', 'Paulo Coelho'], ['Yüzyıllık Yalnızlık', 'Gabriel García Márquez'],
  ['Gurur ve Önyargı', 'Jane Austen'], ['Oliver Twist', 'Charles Dickens'], ['İki Şehrin Hikâyesi', 'Charles Dickens'], ['Yaşlı Adam ve Deniz', 'Ernest Hemingway'],
  ['Faust', 'Johann Wolfgang von Goethe'], ['İlahi Komedya', 'Dante Alighieri'], ['İlyada', 'Homeros'], ['Odysseia', 'Homeros'],
  ['Madame Bovary', 'Gustave Flaubert'], ['Yabancı', 'Albert Camus'], ['Fareler ve İnsanlar', 'John Steinbeck'], ['Bülbülü Öldürmek', 'Harper Lee'],
  ['Kürk Mantolu Madonna', 'Sabahattin Ali'], ['Benim Adım Kırmızı', 'Orhan Pamuk'], ['Mesnevi', 'Mevlana'], ['Rubailer', 'Ömer Hayyam'],
  ['Binbir Gece Masalları', 'Anonim'], ['Robinson Crusoe', 'Daniel Defoe'], ['Frankenstein', 'Mary Shelley'], ['Uğultulu Tepeler', 'Emily Brontë'],
];

// [olay, yıl] — dünya tarihi (her dilde ortak)
export const HISTORY = [
  ['Mısır\'da Büyük Giza Piramidi\'nin inşası', -2560], ['İlk Olimpiyat Oyunları (Antik Yunan)', -776], ['Büyük İskender\'in ölümü', -323], ['Julius Caesar\'ın öldürülmesi', -44],
  ['Batı Roma İmparatorluğu\'nun çöküşü', 476], ['Magna Carta\'nın imzalanması', 1215], ['İstanbul\'un Fethi (Bizans\'ın sonu)', 1453], ['Gutenberg matbaası', 1450],
  ['Kolomb\'un Amerika\'ya ulaşması', 1492], ['Macellan seferinin dünyayı dolaşması', 1522], ['Amerikan Bağımsızlık Bildirgesi', 1776], ['Fransız İhtilali', 1789],
  ['Waterloo Savaşı', 1815], ['İlk telefon görüşmesi (Bell)', 1876], ['Wright kardeşlerin ilk uçuşu', 1903], ['I. Dünya Savaşı\'nın başlaması', 1914],
  ['I. Dünya Savaşı\'nın bitişi', 1918], ['Türkiye Cumhuriyeti\'nin kuruluşu', 1923], ['Penisilinin keşfi', 1928], ['Büyük Buhran (borsa çöküşü)', 1929],
  ['II. Dünya Savaşı\'nın başlaması', 1939], ['II. Dünya Savaşı\'nın bitişi', 1945], ['Birleşmiş Milletler\'in kuruluşu', 1945], ['Hindistan\'ın bağımsızlığı', 1947],
  ['DNA\'nın çift sarmal yapısının keşfi', 1953], ['İlk uydu Sputnik', 1957], ['Uzaya çıkan ilk insan (Gagarin)', 1961], ['Ay\'a ilk insanın ayak basması', 1969],
  ['Berlin Duvarı\'nın yıkılışı', 1989], ['Nelson Mandela\'nın serbest bırakılması', 1990], ['Web\'in icadı', 1991], ['Sovyetler Birliği\'nin dağılması', 1991],
  ['Avrupa Birliği\'nin kuruluşu (Maastricht)', 1993], ['İnsan Genom Projesi\'nin tamamlanması', 2003], ['İlk akıllı telefon devrimi (iPhone)', 2007], ['Paris İklim Anlaşması', 2015],
];

// İngilizce oyuncu için dil tabloları
export const EN_SYNONYMS = [['big', 'large'], ['quick', 'fast'], ['begin', 'start'], ['happy', 'glad'], ['smart', 'clever'], ['angry', 'furious'], ['tiny', 'little'], ['finish', 'complete'],
  ['shut', 'close'], ['gift', 'present'], ['brave', 'courageous'], ['rich', 'wealthy'], ['hard', 'difficult'], ['choose', 'select'], ['help', 'assist'], ['silent', 'quiet'],
  ['sick', 'ill'], ['buy', 'purchase'], ['old', 'ancient'], ['answer', 'reply'], ['correct', 'right'], ['fix', 'repair'], ['huge', 'enormous'], ['calm', 'peaceful']];
export const EN_ANTONYMS = [['long', 'short'], ['hot', 'cold'], ['rich', 'poor'], ['early', 'late'], ['easy', 'hard'], ['fast', 'slow'], ['young', 'old'], ['brave', 'cowardly'],
  ['full', 'empty'], ['heavy', 'light'], ['clean', 'dirty'], ['cheap', 'expensive'], ['win', 'lose'], ['open', 'close'], ['generous', 'stingy'], ['friend', 'enemy'],
  ['sweet', 'bitter'], ['wide', 'narrow'], ['deep', 'shallow'], ['wet', 'dry'], ['near', 'far'], ['begin', 'end'], ['true', 'false'], ['quiet', 'noisy']];
export const EN_IDIOMS = [
  ['Actions speak louder', 'than words', ['than thoughts', 'than money', 'than time']], ['Better late', 'than never', ['than early', 'than sorry', 'than soon']],
  ['Every cloud has', 'a silver lining', ['a rainy day', 'a golden sun', 'a dark side']], ['Practice makes', 'perfect', ['progress', 'habits', 'friends']],
  ['Don\'t judge a book', 'by its cover', ['by its pages', 'by its title', 'by its price']], ['Rome wasn\'t built', 'in a day', ['in a year', 'by one man', 'without stones']],
  ['The early bird', 'catches the worm', ['sings the song', 'flies the highest', 'sleeps the least']], ['Two heads are', 'better than one', ['worse than one', 'too many', 'a crowd']],
  ['When in Rome,', 'do as the Romans do', ['see the Colosseum', 'speak Latin', 'eat pasta']], ['A penny saved is', 'a penny earned', ['a penny spent', 'a penny lost', 'a dollar made']],
  ['Don\'t count your chickens', 'before they hatch', ['after they hatch', 'in the morning', 'in the dark']], ['Where there\'s a will,', 'there\'s a way', ['there\'s a wish', 'there\'s a road', 'there\'s a gift']],
  ['An apple a day', 'keeps the doctor away', ['makes you strong', 'keeps you awake', 'brings good luck']], ['Honesty is', 'the best policy', ['the hardest road', 'a rare gift', 'always easy']],
  ['Slow and steady', 'wins the race', ['loses the game', 'gets nowhere', 'saves the day']], ['Knowledge is', 'power', ['money', 'silence', 'luck']],
];
export const SPANISH = [['manzana', 'apple'], ['libro', 'book'], ['ventana', 'window'], ['cocina', 'kitchen'], ['puente', 'bridge'], ['tiempo', 'weather'], ['honesto', 'honest'],
  ['vecino', 'neighbor'], ['viaje', 'journey'], ['barato', 'cheap'], ['olvidar', 'to forget'], ['ciudad', 'city'], ['perro', 'dog'], ['agua', 'water'], ['feliz', 'happy'],
  ['escuela', 'school'], ['amigo', 'friend'], ['trabajo', 'work'], ['hospital', 'hospital'], ['médico', 'doctor'], ['dinero', 'money'], ['cliente', 'customer'],
  ['cuidadoso', 'careful'], ['mejorar', 'to improve'], ['decidir', 'to decide'], ['enfadado', 'angry'], ['ancho', 'wide'], ['cosecha', 'harvest'], ['ley', 'law'], ['ganancia', 'profit']];

// [atasözü/deyim başı, doğru devam, yanlışlar]
export const PROVERBS = [
  ['Damlaya damlaya', 'göl olur', ['deniz olur', 'taşar', 'dere olur']], ['Sakla samanı', 'gelir zamanı', ['olur ambarı', 'yakar kışı', 'gider yazı']],
  ['Ayağını yorganına göre', 'uzat', ['sar', 'çek', 'yay']], ['Bin bilsen de', 'bir bilene danış', ['sus', 'az konuş', 'kimseye söyleme']],
  ['Emek olmadan', 'yemek olmaz', ['iş olmaz', 'para olmaz', 'hayat olmaz']], ['Komşu komşunun', 'külüne muhtaçtır', ['ekmeğine muhtaçtır', 'derdine ortaktır', 'kapısını çalar']],
  ['İşleyen demir', 'ışıldar', ['paslanmaz', 'kırılmaz', 'bükülmez']], ['Üzüm üzüme baka baka', 'kararır', ['olgunlaşır', 'tatlanır', 'büyür']],
  ['Söz gümüşse', 'sükût altındır', ['iş altındır', 'akıl altındır', 'dost altındır']], ['Ağaç yaşken', 'eğilir', ['kırılır', 'büyür', 'dikilir']],
  ['Bir elin nesi var', 'iki elin sesi var', ['iki elin gücü var', 'bin elin işi var', 'on elin sesi var']], ['Acele işe', 'şeytan karışır', ['hata karışır', 'kimse karışmaz', 'zarar gelir']],
  ['Dost kara günde', 'belli olur', ['yardım eder', 'gelir', 'unutulmaz']], ['Tatlı dil', 'yılanı deliğinden çıkarır', ['kalbi yumuşatır', 'kapıları açar', 'dostu çoğaltır']],
  ['Sabır acıdır', 'meyvesi tatlıdır', ['sonu güzeldir', 'bekleyene gelir', 'zor kazanılır']], ['Yuvarlanan taş', 'yosun tutmaz', ['durmaz', 'ses çıkarır', 'aşınır']],
  ['Güneş balçıkla', 'sıvanmaz', ['kapanmaz', 'söndürülmez', 'örtülmez']], ['Paranı ver', 'sözünü verme', ['emeğini verme', 'aklını verme', 'sırrını verme']],
  ['Ak akçe', 'kara gün içindir', ['bayram içindir', 'yarın içindir', 'yoksul içindir']], ['Bugünün işini', 'yarına bırakma', ['bugün bitir', 'erteleme', 'unutma']],
  ['Gülü seven', 'dikenine katlanır', ['kokusunu sever', 'bahçe kurar', 'suyunu verir']], ['Keskin sirke', 'küpüne zarar', ['tadı acı', 'çabuk bozulur', 'dökülür']],
  ['Balık baştan', 'kokar', ['tutulur', 'pişer', 'yenir']], ['Her yiğidin bir', 'yoğurt yiyişi vardır', ['hikâyesi vardır', 'derdi vardır', 'huyu vardır']],
];

// [organ/kavram, görev]
export const BIO = [
  ['Kalp', 'Kanı vücuda pompalar'], ['Akciğer', 'Gaz alışverişini sağlar'], ['Böbrek', 'Kanı süzer, idrarı oluşturur'], ['Karaciğer', 'Safra üretir, zehirleri etkisiz hâle getirir'],
  ['Mide', 'Proteinlerin sindirimini başlatır'], ['İnce bağırsak', 'Besinlerin emildiği asıl yer'], ['Pankreas', 'İnsülin salgılar'], ['Beyincik', 'Denge ve koordinasyonu sağlar'],
  ['Alyuvar', 'Oksijen taşır'], ['Akyuvar', 'Vücudu mikroplara karşı savunur'], ['Kan pulcukları', 'Kanın pıhtılaşmasını sağlar'], ['Mitokondri', 'Hücrede enerji (ATP) üretir'],
  ['Ribozom', 'Protein sentezler'], ['Kloroplast', 'Fotosentez yapar'], ['Çekirdek', 'Hücrenin yönetim merkezidir, DNA taşır'], ['Tiroit bezi', 'Metabolizma hızını düzenler'],
];

// [büyüklük, birim]
export const UNITS = [
  ['Kuvvet', 'Newton'], ['Enerji', 'Joule'], ['Güç', 'Watt'], ['Elektrik akımı', 'Amper'], ['Gerilim', 'Volt'], ['Direnç', 'Ohm'], ['Basınç', 'Pascal'],
  ['Frekans', 'Hertz'], ['Sıcaklık (SI)', 'Kelvin'], ['Madde miktarı', 'Mol'], ['Işık şiddeti', 'Kandela'], ['Elektrik yükü', 'Coulomb'], ['Kütle', 'Kilogram'],
];

// Gezegenler (Güneş'e uzaklık sırasıyla)
export const PLANETS = ['Merkür', 'Venüs', 'Dünya', 'Mars', 'Jüpiter', 'Satürn', 'Uranüs', 'Neptün'];

// ——————————— MESLEK SINAVLARI ———————————
// TIP — [hastalık, etken grubu, etken]
export const DISEASES = [
  ['Tüberküloz', 'Bakteri', 'Mycobacterium tuberculosis'], ['Grip', 'Virüs', 'İnfluenza virüsü'], ['Sıtma', 'Parazit', 'Plasmodium'],
  ['Pamukçuk', 'Mantar', 'Candida albicans'], ['Kızamık', 'Virüs', 'Kızamık virüsü'], ['Tetanoz', 'Bakteri', 'Clostridium tetani'],
  ['Kolera', 'Bakteri', 'Vibrio cholerae'], ['Hepatit B', 'Virüs', 'Hepatit B virüsü'], ['AIDS', 'Virüs', 'HIV'], ['Kuduz', 'Virüs', 'Kuduz virüsü'],
  ['Şarbon', 'Bakteri', 'Bacillus anthracis'], ['Toksoplazmoz', 'Parazit', 'Toxoplasma gondii'], ['Uyuz', 'Parazit', 'Sarcoptes scabiei'],
  ['Suçiçeği', 'Virüs', 'Varisella-zoster virüsü'], ['Boğmaca', 'Bakteri', 'Bordetella pertussis'], ['Difteri', 'Bakteri', 'Corynebacterium diphtheriae'],
  ['Kabakulak', 'Virüs', 'Kabakulak virüsü'], ['Şark çıbanı', 'Parazit', 'Leishmania'], ['Mantar (tinea) enfeksiyonu', 'Mantar', 'Dermatofitler'],
  ['Bruselloz', 'Bakteri', 'Brucella'], ['Kırım-Kongo kanamalı ateşi', 'Virüs', 'KKKA virüsü'], ['Giardiyaz', 'Parazit', 'Giardia lamblia'],
  ['Aspergilloz', 'Mantar', 'Aspergillus'], ['Çocuk felci', 'Virüs', 'Poliovirüs'], ['Frengi (sifiliz)', 'Bakteri', 'Treponema pallidum'],
];
// [ilaç, sınıf]
export const DRUGS = [
  ['Amoksisilin', 'Antibiyotik'], ['Sefazolin', 'Antibiyotik'], ['Siprofloksasin', 'Antibiyotik'], ['Azitromisin', 'Antibiyotik'],
  ['İbuprofen', 'Ağrı kesici (NSAİİ)'], ['Naproksen', 'Ağrı kesici (NSAİİ)'], ['Diklofenak', 'Ağrı kesici (NSAİİ)'],
  ['Metformin', 'Antidiyabetik'], ['Gliklazid', 'Antidiyabetik'], ['Amlodipin', 'Tansiyon düşürücü'], ['Ramipril', 'Tansiyon düşürücü'],
  ['Losartan', 'Tansiyon düşürücü'], ['Metoprolol', 'Tansiyon düşürücü'], ['Varfarin', 'Kan sulandırıcı (antikoagülan)'], ['Heparin', 'Kan sulandırıcı (antikoagülan)'],
  ['Rivaroksaban', 'Kan sulandırıcı (antikoagülan)'], ['Setirizin', 'Antihistaminik'], ['Loratadin', 'Antihistaminik'], ['Omeprazol', 'Mide asidi baskılayıcı (PPI)'],
  ['Pantoprazol', 'Mide asidi baskılayıcı (PPI)'], ['Salbutamol', 'Bronş genişletici'], ['Formoterol', 'Bronş genişletici'], ['Sertralin', 'Antidepresan'],
  ['Fluoksetin', 'Antidepresan'], ['Essitalopram', 'Antidepresan'], ['Atorvastatin', 'Kolesterol düşürücü (statin)'], ['Rosuvastatin', 'Kolesterol düşürücü (statin)'],
  ['Levotiroksin', 'Tiroit hormonu'], ['Furosemid', 'İdrar söktürücü (diüretik)'], ['Hidroklorotiyazid', 'İdrar söktürücü (diüretik)'],
];
// [test, normal değer, yanlışlar]
export const LABS = [
  ['Açlık kan şekeri', '70–100 mg/dL', ['140–200 mg/dL', '30–50 mg/dL', '200–300 mg/dL']],
  ['Hemoglobin (yetişkin erkek)', '13,5–17,5 g/dL', ['5–8 g/dL', '20–25 g/dL', '9–11 g/dL']],
  ['Potasyum (K)', '3,5–5,0 mEq/L', ['135–145 mEq/L', '7–9 mEq/L', '1–2 mEq/L']],
  ['Sodyum (Na)', '135–145 mEq/L', ['3,5–5,0 mEq/L', '100–110 mEq/L', '160–175 mEq/L']],
  ['Kalsiyum (Ca)', '8,5–10,5 mg/dL', ['2–4 mg/dL', '14–18 mg/dL', '70–100 mg/dL']],
  ['Trombosit', '150.000–400.000 /µL', ['10.000–50.000 /µL', '4.000–10.000 /µL', '600.000–900.000 /µL']],
  ['Lökosit (beyaz küre)', '4.000–10.000 /µL', ['150.000–400.000 /µL', '500–1.000 /µL', '25.000–40.000 /µL']],
  ['Kreatinin', '0,6–1,2 mg/dL', ['3–5 mg/dL', '10–15 mg/dL', '0,01–0,1 mg/dL']],
  ['Solunum sayısı (yetişkin)', '12–20 /dk', ['30–40 /dk', '4–8 /dk', '60–100 /dk']],
  ['Oksijen satürasyonu (SpO₂)', '%95–100', ['%70–80', '%85–88', '%50–60']],
  ['Arteriyel kan pH', '7,35–7,45', ['6,8–7,0', '7,6–7,8', '7,0–7,2']],
  ['Nabız (dinlenmede, yetişkin)', '60–100 /dk', ['30–45 /dk', '120–150 /dk', '160–200 /dk']],
  ['Kan basıncı (ideal, yetişkin)', '120/80 mmHg', ['180/110 mmHg', '80/40 mmHg', '160/100 mmHg']],
  ['Vücut kitle indeksi (normal)', '18,5–24,9 kg/m²', ['30–35 kg/m²', '10–15 kg/m²', '25–29,9 kg/m²']],
];
// [vitamin/mineral, eksiklik tablosu]
export const VITAMINS = [
  ['C vitamini', 'Skorbüt'], ['D vitamini', 'Raşitizm'], ['B1 vitamini', 'Beriberi'], ['B3 vitamini (niasin)', 'Pellagra'], ['A vitamini', 'Gece körlüğü'],
  ['K vitamini', 'Pıhtılaşma bozukluğu (kanama)'], ['B12 vitamini', 'Pernisiyöz anemi'], ['Folik asit (gebelikte)', 'Nöral tüp defekti'], ['İyot', 'Guatr'], ['Demir', 'Demir eksikliği anemisi'],
];
// [bulgu/tablo, organ ya da sistem]
export const SYMPTOMS = [
  ['Sarılık (gözlerde sararma)', 'Karaciğer'], ['Hırıltılı solunum, nefes darlığı', 'Solunum sistemi (akciğer)'], ['Göğüs ağrısı, sol kola yayılım', 'Kalp'],
  ['İdrarda yanma, sık idrara çıkma', 'İdrar yolları'], ['Yüzün bir yarısında kayma, konuşma bozukluğu', 'Beyin (inme)'], ['Boyunda şişlik (guatr)', 'Tiroit bezi'],
  ['Sağ üst karın ağrısı, yağlı yemek sonrası', 'Safra kesesi'], ['Kanlı öksürük, gece terlemesi', 'Akciğer'], ['Böğür ağrısı, idrarda kan', 'Böbrek (taş)'], ['Diz ve kalçada sabah tutukluğu', 'Eklemler'],
];

// EHLİYET — [levha, anlamı]
export const SIGNS = [
  ['Kırmızı sekizgen "DUR" levhası', 'Tam dur, yol ver, sonra geç'], ['Ters üçgen, kırmızı kenarlı levha', 'Ana yoldaki araçlara yol ver'],
  ['Kırmızı daire içinde beyaz yatay bant', 'Taşıt trafiğine kapalı (giriş yok)'], ['Mavi daire içinde beyaz ok', 'Mecburi yön'],
  ['Mavi kare içinde beyaz "P"', 'Park yeri'], ['Kırmızı çerçeveli daire içinde "50"', 'Azami hız 50 km/s'], ['Mavi daire içinde "30"', 'Asgari hız 30 km/s'],
  ['Kırmızı kenarlı üçgen içinde yürüyen çocuklar', 'Okul geçidi'], ['Kırmızı kenarlı üçgen içinde ünlem işareti', 'Dikkat (diğer tehlikeler)'],
  ['Mavi zemin, kırmızı çerçeve ve kırmızı çarpı (X)', 'Duraklamak ve park etmek yasak'], ['Mavi zemin, kırmızı çerçeve ve tek çapraz çizgi', 'Park etmek yasak'],
  ['Kırmızı çerçeveli dairede yan yana iki otomobil (biri kırmızı)', 'Öndeki taşıtı geçmek yasak'], ['Kırmızı kenarlı üçgen içinde tren', 'Kontrollü demiryolu geçidi'],
  ['Kırmızı kenarlı üçgen içinde kayan araç', 'Kaygan yol'], ['Kırmızı kenarlı üçgen içinde daralan yol çizgileri', 'Yol daralması'],
  ['Mavi kare içinde yaya geçidi çizgileri', 'Yaya geçidi'], ['Kırmızı daire içinde üstü çizili sağa ok', 'Sağa dönülmez'],
  ['Kırmızı daire içinde üstü çizili U dönüş oku', 'U dönüşü yapılmaz'], ['Kırmızı kenarlı üçgen içinde yol çalışan işçi', 'Yolda çalışma var'],
  ['Kırmızı kenarlı üçgen içinde geyik', 'Vahşi hayvan çıkabilir'], ['Kırmızı çerçeveli dairede üstü çizili korna', 'Sesli işaret (korna) yasak'],
];
// [araç parçası, görevi]
export const CAR_PARTS = [
  ['Debriyaj', 'Motor gücünü vites kutusuna iletir ya da keser'], ['Akü', 'Elektrik enerjisini depolar'], ['Radyatör', 'Motor soğutma suyunu soğutur'],
  ['Alternatör (şarj dinamosu)', 'Motor çalışırken aküyü şarj eder'], ['Buji', 'Benzinli motorda yakıt-hava karışımını ateşler'], ['Hava filtresi', 'Motora temiz hava sağlar'],
  ['Termostat', 'Motorun çalışma sıcaklığını ayarlar'], ['Diferansiyel', 'Virajda tekerleklerin farklı hızda dönmesini sağlar'], ['Amortisör', 'Yay salınımlarını sönümler'],
  ['ABS', 'Ani frende tekerleklerin kilitlenmesini önler'], ['Marş motoru', 'Motoru ilk hareket ettirir'], ['Katalitik konvertör', 'Zararlı egzoz gazlarını azaltır'],
  ['Su pompası', 'Soğutma suyunu motor ve radyatör arasında dolaştırır'], ['Enjektör', 'Yakıtı silindire püskürtür'], ['Kızdırma bujisi', 'Dizel motorun soğukta ilk çalışmasını kolaylaştırır'],
];
// [durum, doğru ilk yardım]
export const FIRST_AID = [
  ['Burun kanaması', 'Baş hafif öne eğilir, burun kanatları 5–10 dk sıkılır'], ['Birinci derece yanık', 'Yanık bölge 10–20 dk tazyiksiz serin suyla soğutulur'],
  ['Kırık şüphesi', 'Bölge hareket ettirilmeden sabitlenir (tespit)'], ['Dış kanama', 'Kanayan yere temiz bezle doğrudan baskı uygulanır'],
  ['Bilinci kapalı, solunumu var', 'Koma (derlenme) pozisyonu verilir'], ['Solunum yok, bilinç kapalı', 'Temel yaşam desteği (kalp masajı) başlatılır'],
  ['Bilinçli yetişkinde tam hava yolu tıkanıklığı', 'Heimlich manevrası uygulanır'], ['Şok belirtileri (soluk, soğuk terli, hızlı nabız)', 'Sırtüstü yatırılıp bacaklar hafif yükseltilir'],
  ['Göze yabancı cisim kaçması', 'Göz ovuşturulmaz, bol temiz suyla yıkanır'], ['Kimyasal madde yutma', 'Kusturulmaz, 112 aranıp bilgi verilir'],
  ['Omurga yaralanması şüphesi', 'Baş-boyun-gövde ekseni korunur, gereksiz hareket ettirilmez'], ['Sıcak çarpması', 'Serin yere alınır, vücut ıslak bezlerle soğutulur'],
  ['Arı sokması (alerji yoksa)', 'İğne varsa kazınarak çıkarılır, soğuk uygulanır'], ['Donma', 'Yavaşça ısıtılır, ovuşturulmaz'],
];

// USTALIK — [alet, işlevi]
export const TOOLS = [
  ['Su terazisi', 'Yüzeyin yatay/düşey olduğunu kontrol eder'], ['Kumpas', 'Çap ve uzunluğu hassas ölçer'], ['Mikrometre', 'Çok hassas (0,01 mm) ölçüm yapar'],
  ['Tork anahtarı', 'Cıvatayı belirli bir kuvvetle sıkar'], ['Pafta', 'Mile dış vida dişi açar'], ['Kılavuz', 'Deliğe iç vida dişi açar'], ['Eğe', 'Metal yüzeyden talaş kaldırıp düzeltir'],
  ['Mengene', 'İş parçasını sabit tutar'], ['Gönye', 'Dik açıyı kontrol eder'], ['Şakül', 'Duvarın düşeyliğini kontrol eder'], ['İzolasyon test cihazı (megger)', 'Kablo yalıtım direncini ölçer'],
  ['Pens ampermetre', 'Kabloyu kesmeden akım ölçer'], ['Havya', 'Lehim yapar'], ['Spiral taşlama', 'Metal keser ve taşlar'], ['Perçin tabancası', 'Perçinle birleştirme yapar'],
  ['Mala', 'Harç alır ve sürer'], ['Mastar', 'Sıvayı düz çeker'], ['Boru anahtarı', 'Boru ve rakorları sıkar'], ['Kerpeten', 'Çivi söker, tel keser'], ['Keski', 'Metal ya da taşı yontar'],
];
// [malzeme/terim, açıklama]
export const TRADE_TERMS = [
  ['Kür', 'Betonun dayanım kazanması için nemli tutulması'], ['Priz', 'Çimento harcının katılaşmaya başlaması'], ['Derz', 'Fayans ya da tuğla arası boşluk dolgusu'],
  ['Ankraj', 'Yapı elemanını betona sabitleme'], ['Kalıp', 'Betona şekil veren geçici yapı'], ['Etriye', 'Kolon/kiriş donatısını saran çember demir'],
  ['Sıva', 'Duvar yüzeyini düzgünleştiren harç tabakası'], ['Tesviye', 'Yüzeyi düzleme (terazisine getirme)'], ['Lehim', 'Metal parçaları düşük erime noktalı alaşımla birleştirme'],
  ['Kaçak akım', 'Devreden toprağa ya da insana kaçan akım'], ['Kısa devre', 'Faz ile nötrün dirençsiz temas etmesi'], ['Topraklama', 'Cihaz gövdesini toprağa bağlama'],
  ['Rakor', 'Boruları söküp takılabilir biçimde birleştiren parça'], ['Conta', 'İki yüzey arasında sızdırmazlık sağlayan parça'], ['Pah', 'Keskin kenarın eğimli kırılması'],
];
