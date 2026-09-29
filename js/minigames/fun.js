// Yeni motorlarla eğlenceli meslek ve hobi oyunları. İçerik mantıklı ama gülümsetsin.
import { swipeGame, seqGame, fillGame, balanceGame, typeGame, aimGame } from './engines2.js';

// ——————————— KAYDIR: karar ver (13) ———————————
swipeGame({ id: 'mazeret', name: 'Mazeret mi, Gerçek mi?', icon: '🧑‍🏫', sides: ['Mazeret', 'Gerçek'], tags: ['is'],
  items: [['"Ödevimi köpeğim yedi."', 0], ['"Kardeşim ödevimden uçak yapıp camdan attı."', 0], ['"Uzaylılar kaçırdı, ödevi de götürdüler."', 0], ['"Kalemim tatile çıktı."', 0],
    ['"Wi-Fi ödevimi yuttu."', 0], ['"Defterim kendiliğinden silindi."', 0], ['"Hocam ödev vardı ama rüyamda yaptım."', 0], ['"Kedim klavyede yattı, dosya silindi."', 0],
    ['Hastaneden raporla geldi.', 1], ['Veli toplantısında annesi hasta olduğunu anlattı.', 1], ['Okul servisi arıza yaptı, şoför de doğruladı.', 1], ['Ödevin taslağını ve notlarını getirdi.', 1],
    ['Evde elektrik kesintisi vardı, bütün mahalle karanlıktaydı.', 1], ['Deprem tatbikatı yüzünden ders işlenemedi.', 1]] });
swipeGame({ id: 'spam_filtre', name: 'Spam Filtresi', icon: '📧', sides: ['Spam', 'Güvenli'], tags: ['teknik'],
  items: [['🎉 TEBRİKLER! 1 milyon kazandınız, hemen tıklayın!', 0], ['Uzak bir ülkenin prensi mirasını size bırakmak istiyor.', 0], ['Şifrenizi BU LİNKTEN doğrulayın!!!', 0], ['Mucize hap: 3 günde 30 kilo!', 0],
    ['Hesabınız kapanacak, kart bilgilerinizi gönderin.', 0], ['Bu e-postayı 10 kişiye göndermezsen şansın döner.', 0], ['Toplantı saat 14.00\'e alındı.', 1], ['Kod incelemesine yorum yapıldı.', 1],
    ['Aylık fatura özetiniz hazır.', 1], ['Sunucu bakım bildirimi: pazar 02.00.', 1], ['Takım yemeği cuma akşamı.', 1], ['Yeni sürüm notları ekte.', 1]] });
swipeGame({ id: 'taze_mi', name: 'Taze mi, Bayat mı?', icon: '🛒', sides: ['Bayat', 'Taze'], tags: ['ticaret'],
  items: [['🍌 Kapkara olmuş muz', 0], ['🥖 Taş gibi ekmek', 0], ['🐟 Gözleri bulanık balık', 0], ['🥛 Tarihi geçmiş süt', 0], ['🧀 Yeşillenmiş peynir', 0], ['🍅 Buruşmuş domates', 0],
    ['🥚 Suya atınca yüzen yumurta', 0], ['🍎 Parlak, sıkı elma', 1], ['🥬 Diri marul', 1], ['🐟 Gözleri parlak balık', 1], ['🥖 Sabah fırından çıkmış ekmek', 1], ['🍓 Kırmızı, dalından yeni', 1], ['🥚 Suya atınca batan yumurta', 1]] });
swipeGame({ id: 'sahte_haber', name: 'Haber mi, Uydurma mı?', icon: '📰', sides: ['Uydurma', 'Haber'], tags: ['sosyal'],
  items: [['"Bilim insanları açıkladı: Kediler aslında uzaylı!"', 0], ['"Bu meyveyi yiyen 150 yıl yaşıyor!"', 0], ['"Ünlü şarkıcı Ay\'da konser verecek, biletler satışta!"', 0], ['"Telefonu mikrodalgada şarj etmek pili ikiye katlıyor!"', 0],
    ['"Kaynak: arkadaşımın kuzeninin komşusu"', 0], ['"Yağmur yağınca internet yavaşlıyormuş, uzmanlar şokta!"', 0], ['Belediye yeni bir park açtı.', 1], ['Merkez bankası faiz kararını açıkladı.', 1],
    ['Milli takım hazırlık maçını kazandı.', 1], ['Meteoroloji kuvvetli yağış uyarısı yaptı.', 1], ['Okullar pazartesi açılıyor.', 1], ['Yeni metro hattı hizmete girdi.', 1]] });
swipeGame({ id: 'saglikli_tabak', name: 'Sağlıklı Tabak', icon: '🥗', sides: ['Az ye', 'Bol ye'], tags: ['saglik'],
  items: [['🍟 Kızartma', 0], ['🍭 Şeker', 0], ['🥤 Şekerli gazoz', 0], ['🍩 Donut', 0], ['🌭 İşlenmiş sucuk', 0], ['🍫 Koca bir çikolata', 0],
    ['🥦 Brokoli', 1], ['🥕 Havuç', 1], ['🍎 Elma', 1], ['🫘 Mercimek', 1], ['🥛 Ayran', 1], ['🐟 Izgara balık', 1], ['💧 Su', 1]] });
swipeGame({ id: 'iade_masasi', name: 'İade Masası', icon: '🧾', sides: ['Reddet', 'Kabul'], tags: ['ticaret'],
  items: [['Etiketi üstünde, 3 gün önce alınmış.', 1], ['Kutusu açılmamış, fişi var.', 1], ['İlk gün bozuldu, garanti kapsamında.', 1], ['Beden olmadı, hiç giyilmemiş.', 1],
    ['İki yıl giyilmiş, "beğenmedim" diyor.', 0], ['Kedisi kemirmiş, garanti istiyor.', 0], ['Başka mağazadan alınmış.', 0], ['Pastanın yarısını yemiş, "tatlı değil" diyor.', 0],
    ['Düğünde giyip ertesi gün getirdi.', 0], ['Fişi yok, "geçen yüzyılda almıştım" diyor.', 0]] });
swipeGame({ id: 'musteri_hakli', name: 'Şikâyet Haklı mı?', icon: '🍽️', sides: ['Haksız', 'Haklı'], tags: ['is'],
  items: [['Çorbadan saç çıktı.', 1], ['Siparişi 45 dakikadır gelmedi.', 1], ['Hesapta yemediği tatlı var.', 1], ['Et çiğ geldi, iyi pişmiş istemişti.', 1], ['Bardak kırık geldi.', 1],
    ['"Dondurma çok soğuk!"', 0], ['"Fincan yeşil, ben mavi severim."', 0], ['"Menüde fil eti neden yok?"', 0], ['"Salata fazla sağlıklı."', 0], ['"Garson bana gülümsemedi, zam istemiyorum!"', 0]] });
swipeGame({ id: 'hasta_acil', name: 'Acil mi?', icon: '🚑', sides: ['Bekleyebilir', 'Acil'], tags: ['saglik'],
  items: [['Göğüs ağrısı, soğuk terleme', 1], ['Nefes alamıyor', 1], ['Yüksekten düştü, bilinci bulanık', 1], ['Yüzünün bir tarafı düştü, konuşamıyor', 1], ['Durmayan kanama', 1], ['Arı soktu, dudakları şişiyor', 1],
    ['Tırnak batması', 0], ['3 gündür hapşırıyor', 0], ['Sivrisinek ısırdı', 0], ['Rapor almak istiyor', 0], ['Hafif baş ağrısı', 0], ['Kolunda eski bir yara kabuğu', 0]] });
swipeGame({ id: 'bitki_dostu', name: 'Dost mu, Zararlı mı?', icon: '🌱', sides: ['Zararlı', 'Dost'], tags: ['tarim'],
  items: [['🐞 Uğur böceği', 1], ['🐝 Arı', 1], ['🪱 Solucan', 1], ['🦇 Yarasa', 1], ['🐸 Kurbağa', 1], ['🕷️ Bahçe örümceği', 1],
    ['🐛 Yaprak kurdu', 0], ['🦗 Çekirge', 0], ['🐌 Salyangoz', 0], ['🐀 Tarla faresi', 0], ['🍄 Yaprakta küf', 0]] });
swipeGame({ id: 'itiraz', name: 'İtiraz!', icon: '⚖️', sides: ['Reddedilir', 'Kabul'], tags: ['is'],
  items: [['Tanık yönlendiriliyor.', 1], ['Delil süresinde sunulmadı.', 1], ['Soru davayla ilgisiz.', 1], ['Tanık tahmin yürütüyor.', 1], ['Aynı soru üçüncü kez soruluyor.', 1],
    ['Karşı avukatın kravatı çirkin.', 0], ['Hâkimin sesi çok kalın.', 0], ['Tanık çok uzun konuşuyor ama doğru söylüyor.', 0], ['Müvekkilim bugün yorgun.', 0], ['Salonun kliması üşütüyor.', 0]] });
swipeGame({ id: 'transfer_mi', name: 'Transfer Masası', icon: '📋', sides: ['Pas geç', 'Transfer'], tags: ['spor'],
  items: [['Gol makinesi, sakatlık yok, maaşı makul', 1], ['Genç, hızlı, öğrenmeye açık', 1], ['Takım oyuncusu, kaptanlık yapmış', 1], ['Deneyimli kaleci, penaltı canavarı', 1], ['Pas isabeti %92, disiplinli', 1],
    ['Sadece sosyal medyada iyi', 0], ['Son üç sezon hep sakat', 0], ['Maaşı kulübün bütçesinin yarısı', 0], ['Antrenmana gelmeyi sevmiyor', 0], ['Menajeri "o bir yıldız" diyor, maç izlememiş', 0]] });
swipeGame({ id: 'bina_guvenli', name: 'Bina Denetimi', icon: '🏢', sides: ['Riskli', 'Güvenli'], tags: ['teknik'],
  items: [['Kolonda derin çatlak', 0], ['Demirler paslanmış', 0], ['İzinsiz kat çıkılmış', 0], ['Taşıyıcı duvar yıkılmış', 0], ['Deniz kumu kullanılmış', 0],
    ['Deprem yönetmeliğine uygun', 1], ['Zemin etüdü yapılmış', 1], ['Beton numuneleri sağlam', 1], ['Yangın merdiveni var', 1], ['Proje ve denetim raporu eksiksiz', 1]] });
swipeGame({ id: 'yatirim_teklif', name: 'Yatırım Teklifi', icon: '💼', sides: ['Uzak dur', 'Değerlendir'], tags: ['ticaret'],
  items: [['"Ayda %50 garanti kazanç!"', 0], ['"Kimseye söyleme, sadece sana özel."', 0], ['"Parayı bugün yatırmazsan fırsat kaçar!"', 0], ['"Üç arkadaşını getir, onlar da üçer kişi getirsin."', 0],
    ['Şirketin denetlenmiş bilançosu var.', 1], ['Riskler ve olası zarar açıkça yazılmış.', 1], ['Uzun vadeli, çeşitlendirilmiş fon.', 1], ['Lisanslı aracı kurum üzerinden.', 1]] });

// ——————————— SIRAYI HATIRLA (6) ———————————
seqGame({ id: 'tarif_sira', name: 'Pasta Tarifi', icon: '🎂', pads: [['🥚', '#e8c26a'], ['🧈', '#f0d77a'], ['🥛', '#9ec5ff'], ['🍫', '#8b5a3c']], tags: ['ev'], watch: '👀 Tarifi izle…', go: '🥣 Sırayla ekle!', failText: 'Pasta göçtü! 🎂💥' });
seqGame({ id: 'sifre_hatirla', name: 'Kasa Şifresi', icon: '🔐', pads: [['1', '#4a6cf7'], ['2', '#3ddc97'], ['3', '#ffb547'], ['4', '#ff5b7a']], tags: ['ticaret'], watch: '👀 Şifreyi ezberle…', go: '🔢 Şifreyi gir!', failText: 'Alarm çaldı! 🚨' });
seqGame({ id: 'dans_figur', name: 'Dans Figürü', icon: '💃', pads: [['⬅️', '#b36bff'], ['⬆️', '#ff6fb5'], ['➡️', '#4ad6ff'], ['⬇️', '#ffd23f']], tags: ['sanat', 'sosyal'], watch: '👀 Hocayı izle…', go: '🕺 Sıra sende!', failText: 'Ayağına bastın! 😅' });
seqGame({ id: 'trafik_isaret', name: 'Trafik Yönet', icon: '👮', pads: [['✋', '#ff5b7a'], ['👉', '#3ddc97'], ['👈', '#4a6cf7'], ['⬆️', '#ffb547']], tags: ['is'], watch: '👀 Işıkları izle…', go: '🚦 İşaret ver!', failText: 'Kavşak kilitlendi! 🚗🚗' });
seqGame({ id: 'alet_uzat', name: 'Alet Uzat', icon: '🩺', pads: [['✂️', '#9ec5ff'], ['🧵', '#ffb3c7'], ['💉', '#b8f0d4'], ['🩹', '#ffe28a']], tags: ['saglik'], watch: '👀 Doktoru dinle…', go: '🧤 Sırayla uzat!', failText: 'Doktor kaşını kaldırdı 🤨' });
seqGame({ id: 'ksilofon', name: 'Ksilofon', icon: '🎶', pads: [['🔴', '#ff5b7a'], ['🟡', '#ffd23f'], ['🟢', '#3ddc97'], ['🔵', '#4a6cf7']], tags: ['bebek', 'sanat'], start: 2, target: 6, watch: '👀 Dinle…', go: '🎵 Sen çal!', failText: 'Tın tın! 😄' });

// ——————————— DOLDUR (7) ———————————
fillGame({ id: 'cay_doldur', name: 'Çay Doldur', icon: '🫖', cup: '🫖', color: '#b5541f', tags: ['is'], perfect: 'Tavşan kanı! 👌', spill: 'Tepsi çay gölü oldu! 😱' });
fillGame({ id: 'benzin_doldur', name: 'Depoyu Doldur', icon: '⛽', cup: '⛽', color: '#e0c040', tags: ['is'], perfect: 'Tam depo!', spill: 'Pompa taştı, ayakkabın benzin kokuyor 😬', hint: 'Basılı tut, istenen litrede bırak' });
fillGame({ id: 'siringa_cek', name: 'Şırınga Çek', icon: '💉', cup: '💉', color: '#9ad0ff', tags: ['saglik'], perfect: 'Tam doz!', spill: 'Fazla doz! Baştan 😰' });
fillGame({ id: 'harc_suyu', name: 'Harç Suyu', icon: '🪣', cup: '🪣', color: '#8f8f8f', tags: ['teknik'], perfect: 'Harç tam kıvamında!', spill: 'Çorba gibi oldu 🫠' });
fillGame({ id: 'sut_sag', name: 'Süt Sağ', icon: '🐄', cup: '🐄', color: '#f4f4f4', tags: ['tarim'], perfect: 'Kova tam dolu! 🥛', spill: 'İnek tekme attı, kova devrildi 🐄💢' });
fillGame({ id: 'kahve_kopugu', name: 'Süt Köpüğü', icon: '☕', cup: '☕', color: '#e8d7b5', tags: ['is'], perfect: 'Latte sanatı! 🤎', spill: 'Köpük tavana ulaştı ☁️' });
fillGame({ id: 'biberon', name: 'Biberon Hazırla', icon: '🍼', cup: '🍼', color: '#fffaf0', tags: ['sosyal'], perfect: 'Bebek mutlu! 👶💛', spill: 'Mama her yerde 🙈' });

// ——————————— DENGE (5) ———————————
balanceGame({ id: 'tepsi_tasi', name: 'Tepsi Taşı', icon: '🍽️', item: '🍵🍰🥤', base: '🤵', tags: ['is'], fall: 'Tepsi devrildi! Pasta tavanda 🍰💥' });
balanceGame({ id: 'tugla_tasi', name: 'Tuğla Taşı', icon: '🧱', item: '🧱🧱🧱', base: '👷', plate: '#8a6a4a', tags: ['teknik', 'is'], fall: 'Tuğlalar ayağına düştü! 🦶💥' });
balanceGame({ id: 'karpuz_tasi', name: 'Karpuz Taşı', icon: '🍉', item: '🍉🍉🍉', base: '🧑‍🌾', plate: '#6ab04c', tags: ['ticaret', 'tarim'], fall: 'Karpuzlar yola döküldü! 🍉🍉' });
balanceGame({ id: 'ip_cambazi', name: 'İp Cambazı', icon: '🤸', item: '🤸', base: '🎪', plate: '#e0e0e0', tags: ['spor'], fall: 'File seni kurtardı 😅' });
balanceGame({ id: 'kasa_yuk', name: 'Koli Kulesi', icon: '📦', item: '📦📦📦', base: '🧑‍🔧', plate: '#b08050', tags: ['is'], fall: 'Koliler yağdı! 📦📦📦' });

// ——————————— HIZLI YAZIM (6) ——————————— (kelimeler dile göre seçilir)
// i18n-skip-start
typeGame({ id: 'dilekce', name: 'Dilekçe Yaz', icon: '📝', tags: ['is'], words: ['dilekçe', 'imza', 'mühür', 'tarih', 'onay', 'evrak', 'kayıt', 'başvuru', 'belge', 'arşiv'], wordsEn: ['form', 'stamp', 'signed', 'date', 'approve', 'record', 'permit', 'request', 'archive', 'file'] });
typeGame({ id: 'manset', name: 'Manşet Yaz', icon: '🗞️', tags: ['sosyal'], words: ['haber', 'manşet', 'kaynak', 'basın', 'gazete', 'muhabir', 'flaş', 'özel', 'röportaj'], wordsEn: ['news', 'headline', 'source', 'press', 'scoop', 'report', 'story', 'editor', 'breaking'] });
typeGame({ id: 'kod_yaz', name: 'Kod Yaz', icon: '⌨️', tags: ['teknik'], latin: true, words: ['if', 'else', 'return', 'while', 'const', 'class', 'import', 'true', 'null', 'async'], wordsEn: ['if', 'else', 'return', 'while', 'const', 'class', 'import', 'true', 'null', 'async'] });
typeGame({ id: 'tahta_yaz', name: 'Tahtaya Yaz', icon: '🧑‍🏫', tags: ['is'], words: ['ödev', 'sınav', 'kitap', 'defter', 'tahta', 'okul', 'ders', 'kalem', 'sınıf'], wordsEn: ['homework', 'exam', 'book', 'lesson', 'school', 'pencil', 'class', 'board', 'chalk'] });
typeGame({ id: 'recete_yaz', name: 'Reçete Yaz', icon: '💊', tags: ['saglik'], words: ['şurup', 'tablet', 'doz', 'günde', 'kapsül', 'krem', 'damla', 'aç', 'tok'], wordsEn: ['syrup', 'tablet', 'dose', 'daily', 'capsule', 'cream', 'drops', 'meal'] });
typeGame({ id: 'ceviri_yaz', name: 'Çeviri Yaz', icon: '🌍', tags: ['zihin'], latin: true, words: ['hello', 'thanks', 'please', 'friend', 'water', 'house', 'book', 'love', 'happy'], wordsEn: ['hola', 'gracias', 'amigo', 'agua', 'casa', 'libro', 'feliz', 'gato', 'sol'] });

// i18n-skip-end

// ——————————— DOĞRU ANDA ÇEK (6) ———————————
aimGame({ id: 'foto_muhabir', name: 'Haber Fotoğrafı', icon: '📸', target: '🏃', bg: '#2c3440', decor: ['🏟️', '👥', '🏁'], tags: ['sosyal'], perfect: 'Manşetlik kare! 📰' });
aimGame({ id: 'kus_gozlem', name: 'Kuş Gözlemi', icon: '🦜', target: '🐦', bg: '#23422f', decor: ['🌳', '🌿', '🌳', '🌾'], tags: ['tarim', 'zihin'], perfect: 'Nadir tür, kayda geçti! 🦜' });
aimGame({ id: 'radar', name: 'Radar Kontrol', icon: '📡', target: '🚗', bg: '#2d2f38', decor: ['🛣️', '🚦', '🌳'], tags: ['is'], verb: '📡', perfect: 'Hız tespit edildi! 🚨', miss: 'Radar boşluğa çekti' });
aimGame({ id: 'rontgen', name: 'Röntgen Çek', icon: '🩻', target: '🦴', bg: '#0f1a2a', decor: [], tags: ['saglik'], verb: '🩻', perfect: 'Net görüntü!', miss: 'Hasta kıpırdadı 😅' });
aimGame({ id: 'sahne_isik', name: 'Sahne Işığı', icon: '💡', target: '🕺', bg: '#1c1030', decor: ['🎤', '🎸', '🥁'], tags: ['sanat'], verb: '💡', perfect: 'Spot tam üstünde! ✨', miss: 'Işık bateriste gitti 🥁' });
aimGame({ id: 'balik_tut', name: 'Balık Tut', icon: '🎣', target: '🐟', bg: '#1b4a6a', decor: ['🌊', '🪸', '🌊'], tags: ['sosyal', 'spor'], verb: '🎣', perfect: 'Koca balık! 🐟', miss: 'Olta boş döndü 🥾' });
