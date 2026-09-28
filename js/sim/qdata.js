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

// [eser, yazar, dönem/tür]
export const WORKS = [
  ['Çalıkuşu', 'Reşat Nuri Güntekin'], ['İnce Memed', 'Yaşar Kemal'], ['Saatleri Ayarlama Enstitüsü', 'Ahmet Hamdi Tanpınar'],
  ['Kürk Mantolu Madonna', 'Sabahattin Ali'], ['Sinekli Bakkal', 'Halide Edib Adıvar'], ['Yaban', 'Yakup Kadri Karaosmanoğlu'],
  ['Safahat', 'Mehmet Akif Ersoy'], ['Memleketimden İnsan Manzaraları', 'Nazım Hikmet'], ['Tutunamayanlar', 'Oğuz Atay'],
  ['Aşk-ı Memnu', 'Halit Ziya Uşaklıgil'], ['Araba Sevdası', 'Recaizade Mahmut Ekrem'], ['Vatan Yahut Silistre', 'Namık Kemal'],
  ['Şair Evlenmesi', 'Şinasi'], ['Mai ve Siyah', 'Halit Ziya Uşaklıgil'], ['Huzur', 'Ahmet Hamdi Tanpınar'], ['Semaver', 'Sait Faik Abasıyanık'],
  ['Kuyucaklı Yusuf', 'Sabahattin Ali'], ['Yorgun Savaşçı', 'Kemal Tahir'], ['Tatarcık', 'Yaşar Kemal'], ['Yaprak Dökümü', 'Reşat Nuri Güntekin'],
  ['Ateşten Gömlek', 'Halide Edib Adıvar'], ['Kiralık Konak', 'Yakup Kadri Karaosmanoğlu'], ['Eylül', 'Mehmet Rauf'], ['Nutuk', 'Mustafa Kemal Atatürk'],
  ['Kutadgu Bilig', 'Yusuf Has Hacib'], ['Divânu Lugâti\'t-Türk', 'Kaşgarlı Mahmud'], ['Suç ve Ceza', 'Fyodor Dostoyevski'], ['Sefiller', 'Victor Hugo'],
  ['Hamlet', 'William Shakespeare'], ['Dönüşüm', 'Franz Kafka'], ['Savaş ve Barış', 'Lev Tolstoy'], ['Don Kişot', 'Miguel de Cervantes'],
  ['Küçük Prens', 'Antoine de Saint-Exupéry'], ['1984', 'George Orwell'], ['Simyacı', 'Paulo Coelho'], ['Yüzyıllık Yalnızlık', 'Gabriel García Márquez'],
];

// [olay, yıl]
export const HISTORY = [
  ['Malazgirt Savaşı', 1071], ['İstanbul\'un Fethi', 1453], ['Miryokefalon Savaşı', 1176], ['Osmanlı Devleti\'nin kuruluşu', 1299], ['Ankara Savaşı', 1402],
  ['Çaldıran Savaşı', 1514], ['Mercidabık Savaşı', 1516], ['Mohaç Meydan Muharebesi', 1526], ['Preveze Deniz Savaşı', 1538], ['Viyana Kuşatması (II.)', 1683],
  ['Karlofça Antlaşması', 1699], ['Lale Devri\'nin sonu (Patrona Halil)', 1730], ['Tanzimat Fermanı', 1839], ['Islahat Fermanı', 1856], ['I. Meşrutiyet', 1876],
  ['II. Meşrutiyet', 1908], ['Çanakkale Zaferi', 1915], ['Mondros Ateşkesi', 1918], ['Atatürk\'ün Samsun\'a çıkışı', 1919], ['TBMM\'nin açılışı', 1920],
  ['Sakarya Meydan Muharebesi', 1921], ['Büyük Taarruz', 1922], ['Lozan Antlaşması', 1923], ['Cumhuriyet\'in ilanı', 1923], ['Halifeliğin kaldırılması', 1924],
  ['Harf Devrimi', 1928], ['Soyadı Kanunu', 1934], ['Kadınlara milletvekili seçme ve seçilme hakkı', 1934], ['Hatay\'ın anavatana katılması', 1939], ['Çok partili hayata geçiş (ilk seçim)', 1946],
  ['Türkiye\'nin NATO\'ya girişi', 1952], ['Fransız İhtilali', 1789], ['Amerika\'nın keşfi', 1492], ['Coğrafi Keşifler / Ümit Burnu', 1488], ['I. Dünya Savaşı\'nın başlaması', 1914],
  ['II. Dünya Savaşı\'nın başlaması', 1939], ['II. Dünya Savaşı\'nın bitişi', 1945], ['Berlin Duvarı\'nın yıkılışı', 1989], ['Ay\'a ilk insanın ayak basması', 1969], ['Matbaanın Osmanlı\'ya gelişi (İbrahim Müteferrika)', 1727],
];

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
