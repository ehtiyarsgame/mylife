// İçerik genişletme 3: ayırma (sort), kaydırma (swipe), sıralama (order) ve kıyas (compare) oyunlarının
// küçük havuzları büyütüldü. Her öğe iki dilli (B). Aynı ilk metin ikinci kez eklenmez.
import { B, lang } from '../core/i18n.js';
import { extend, getGame } from './engine.js';

const k0 = x => (typeof x === 'string' ? x : Array.isArray(x) ? (typeof x[0] === 'string' ? x[0] : JSON.stringify(x[0])) : JSON.stringify(x));
const ext = (id, add) => {
  if (!getGame(id)) return;
  const sp = getGame(id).spec, out = {};
  for (const k in add) {
    if (Array.isArray(add[k]) && Array.isArray(sp[k])) { const seen = new Set(sp[k].map(k0)); out[k] = add[k].filter(x => { const kk = k0(x); if (seen.has(kk)) return false; seen.add(kk); return true; }); }
    else out[k] = add[k];
  }
  extend(id, out);
};
const I = list => list.map(([a, b, k]) => [B(a, b), k]);
const S = (title, steps) => [B(title[0], title[1]), steps.map(([a, b]) => B(a, b))];
const items = (id, list) => ext(id, { items: I(list) });
const sets = (id, list) => ext(id, { sets: list.map(([t, st]) => S(t, st)) });

// i18n-skip-start
// ———————————————————— KAYDIRMA (iki taraf) ————————————————————
items('mazeret', [
  ['"Otobüs beni görmedi, durmadan geçti."', '"The bus didn\'t see me and drove past."', 0], ['"Ödevim bulutta kaldı, internet yoktu."', '"My homework is stuck in the cloud, no internet."', 0], ['"Annem ödevi çöpe attı sandı."', '"Mum thought my homework was rubbish and binned it."', 0],
  ['"Kalemim kırıldı, başka kalemim yoktu."', '"My pencil broke and I had no other pencil."', 0], ['"Ödevi yaptım ama evde unuttum… her hafta."', '"I did it but left it at home… every week."', 0], ['"Robot süpürge defterimi yedi."', '"The robot vacuum ate my notebook."', 0],
  ['"Yolda bir kediyi kurtarıyordum, 3 saat sürdü."', '"I was rescuing a cat on the way, it took 3 hours."', 0], ['"Saatim geri kaldı, sonra telefonum da, sonra…"', '"My watch was slow, then my phone, then…"', 0], ['"Bugün dünyanın en kötü günüydü, sorma."', '"Worst day in the world, don\'t ask."', 0],
  ['Doktor raporunu müdür yardımcısına verdi.', 'Handed the doctor\'s note to the deputy head.', 1], ['Okul çantası çalındığı için tutanak getirdi.', 'Brought a police report because the bag was stolen.', 1], ['Dedesinin cenazesi vardı; aile önceden haber verdi.', 'Grandad\'s funeral; the family told the school in advance.', 1],
  ['Sınav günü yoğun kar yağışından okullar tatildi.', 'School was closed on exam day due to heavy snow.', 1], ['Ödevin yarısını getirdi, kalanı için süre istedi.', 'Brought half the homework and asked for more time.', 1], ['Spor müsabakası için okul izin belgesi verdi.', 'Had a school permission slip for a sports match.', 1],
  ['Evlerinde su baskını oldu, fotoğraflarını gösterdi.', 'Their home flooded; showed photos.', 1], ['Hastanede kardeşine refakat ettiği yazılıydı.', 'A hospital letter says they stayed with a sibling.', 1],
]);
items('spam_filtre', [
  ['📦 Kargonuz bekliyor! Gümrük için 9,99 ₺ ödeyin: bit.ly/xx', '📦 Parcel waiting! Pay a £1.99 customs fee: bit.ly/xx', 0], ['Banka: hesabınız donduruldu, bu linkten giriş yapın.', 'Bank: your account is frozen, log in via this link.', 0], ['Tebrikler, yeni iPhone kazandınız! Adresinizi yazın.', 'Congrats, you won a new iPhone! Enter your address.', 0],
  ['Evden çalışarak günde 5.000 ₺! Sadece kayıt ücreti…', 'Earn £500 a day from home! Just a sign-up fee…', 0], ['Hesabına garip giriş! Şifreni cevap olarak yaz.', 'Strange login! Reply with your password.', 0], ['Kripto fırsatı: 1 haftada paranı 10 katına çıkar!', 'Crypto deal: 10× your money in a week!', 0],
  ['Faturanız iade edilecek, kart numaranızı girin.', 'You are owed a refund, enter your card number.', 0], ['Patronunuz: acil hediye kartı alıp kodları atar mısın?', 'Your boss: can you urgently buy gift cards and send the codes?', 0], ['Sevgilim, yeni numaram bu, acil para lazım.', 'Hi love, this is my new number, I need money urgently.', 0],
  ['Diş randevunuz yarın 10.30\'da.', 'Your dental appointment is tomorrow at 10:30.', 1], ['Sipariş #4821 kargoya verildi (uygulamada takip edin).', 'Order #4821 has shipped (track it in the app).', 1], ['Proje dosyası paylaşıldı: Q3 rapor taslağı.', 'Project file shared: Q3 report draft.', 1],
  ['Okul aile birliği toplantısı perşembe 18.00.', 'Parent–teacher meeting Thursday 6 pm.', 1], ['İzin talebiniz onaylandı.', 'Your leave request has been approved.', 1], ['Kütüphane: ödünç kitabınızın süresi 3 gün sonra doluyor.', 'Library: your loan is due in 3 days.', 1],
  ['Doğum günün kutlu olsun! — Ayşe teyze', 'Happy birthday! — Auntie Sue', 1], ['Ekip: yarınki demo 15.00\'e kaydı.', 'Team: tomorrow\'s demo moved to 3 pm.', 1],
]);
items('taze_mi', [
  ['🥑 Basınca çökmüş, içi kararmış avokado', '🥑 Mushy avocado, brown inside', 0], ['🥩 Gri renkli, kötü kokan et', '🥩 Grey, smelly meat', 0], ['🍞 Üstünde yeşil benekler olan ekmek', '🍞 Bread with green spots', 0], ['🥬 Sararmış, sümüklü marul', '🥬 Yellow, slimy lettuce', 0],
  ['🍗 Kapağı şişmiş tavuk paketi', '🍗 Chicken pack with a bloated lid', 0], ['🥛 Kesilmiş, topak topak süt', '🥛 Curdled, lumpy milk', 0], ['🍓 Beyaz pamuk gibi küflenmiş çilek', '🍓 Strawberries with white fluffy mould', 0], ['🥫 Kenarı şişmiş konserve', '🥫 Bulging can', 0],
  ['🍊 Yumuşamış, küflü portakal', '🍊 Soft, mouldy orange', 0], ['🐟 Yapışkan, kötü kokan balık', '🐟 Sticky, smelly fish', 0], ['🍌 Sapı yeşil, hafif sarı muz', '🍌 Banana with a green stem, just yellow', 1], ['🥕 Kıtır kıtır havuç', '🥕 Crunchy carrot', 1],
  ['🥩 Kırmızı, kokusuz et', '🥩 Red, odour-free meat', 1], ['🍅 Sıkı, parlak domates', '🍅 Firm, shiny tomato', 1], ['🥦 Koyu yeşil, sıkı brokoli', '🥦 Dark green, firm broccoli', 1], ['🐟 Solungaçları kırmızı balık', '🐟 Fish with bright red gills', 1],
  ['🍇 Salkımı diri üzüm', '🍇 Grapes on a fresh green stem', 1], ['🥛 Tarihi yarın biten, soğukta duran süt', '🥛 Chilled milk, use-by tomorrow', 1], ['🍋 Ağır, kabuğu parlak limon', '🍋 Heavy lemon with shiny skin', 1],
]);
items('sahte_haber', [
  ['"Bilim insanları: çikolata yiyen kilo verir! (kaynak yok)"', '"Scientists: eating chocolate makes you thin! (no source)"', 0], ['"Şok! 5G kuleleri kuşları uyutuyor"', '"Shock! 5G masts put birds to sleep"', 0], ['"Paylaş, yoksa hesabın silinecek!"', '"Share this or your account will be deleted!"', 0],
  ['"Ünlü oyuncu uzaya taşınıyor, ev aldı"', '"Famous actor moving to space, bought a house"', 0], ['"Limon suyu her hastalığı iyileştiriyor"', '"Lemon water cures every disease"', 0], ['"Yarın Güneş doğmayacak, NASA gizliyor"', '"The Sun won\'t rise tomorrow, NASA is hiding it"', 0],
  ['"Mıknatıslı bileklikle zeka 2 kat artıyor"', '"Magnetic bracelet doubles your IQ"', 0], ['"Bu fotoğraf: Ay\'da piknik yapan astronotlar"', '"This photo: astronauts picnicking on the Moon"', 0],
  ['Meteoroloji: yarın kuvvetli yağış bekleniyor.', 'Met Office: heavy rain expected tomorrow.', 1], ['Merkez bankası faizi 1 puan artırdı.', 'The central bank raised rates by 1 point.', 1], ['Belediye: köprü bakım için 2 gün kapalı.', 'Council: bridge closed 2 days for repairs.', 1],
  ['Milli takım hazırlık maçını 2–1 kazandı.', 'The national team won the friendly 2–1.', 1], ['Bakanlık: okullar 9 Eylül\'de açılıyor.', 'Ministry: schools open on 9 September.', 1], ['Hastane yeni acil servisini açtı.', 'The hospital opened its new A&E.', 1], ['Uzay ajansı yeni uydu fırlattı.', 'The space agency launched a new satellite.', 1],
]);
items('saglikli_tabak', [
  ['🍟 Kızarmış patates', '🍟 Fries', 0], ['🍩 Şekerli çörek', '🍩 Doughnut', 0], ['🥤 Kola', '🥤 Cola', 0], ['🍬 Şeker', '🍬 Sweets', 0], ['🌭 Sosis', '🌭 Hot dog', 0], ['🍰 Pasta', '🍰 Cake', 0],
  ['🧂 Fazla tuz', '🧂 Lots of salt', 0], ['🥓 Pastırma / bacon', '🥓 Bacon', 0], ['🍕 Bol peynirli pizza', '🍕 Extra-cheese pizza', 0], ['🍪 Paketli kurabiye', '🍪 Packaged biscuits', 0],
  ['🥦 Brokoli', '🥦 Broccoli', 1], ['🥗 Salata', '🥗 Salad', 1], ['🍎 Elma', '🍎 Apple', 1], ['🫘 Kuru fasulye', '🫘 Beans', 1], ['🐟 Izgara balık', '🐟 Grilled fish', 1], ['🥕 Havuç', '🥕 Carrot', 1],
  ['🥛 Yoğurt', '🥛 Yoghurt', 1], ['💧 Su', '💧 Water', 1], ['🥚 Haşlanmış yumurta', '🥚 Boiled egg', 1], ['🍊 Portakal', '🍊 Orange', 1], ['🌾 Tam buğday ekmeği', '🌾 Wholemeal bread', 1], ['🫒 Zeytin', '🫒 Olives', 1],
]);
items('iade_masasi', [
  ['Etiketi koparılmış, 3 kez giyilmiş elbise', 'Dress worn three times, tag ripped off', 0], ['Fişsiz, 2 yıl önce alınmış kulaklık', 'Headphones bought 2 years ago, no receipt', 0], ['Kullanılmış iç çamaşırı', 'Worn underwear', 0],
  ['Müşterinin düşürüp kırdığı telefon', 'Phone the customer dropped and broke', 0], ['Açılıp yarısı yenmiş çikolata', 'Chocolate half eaten', 0], ['İndirimde "iade yok" yazan ürün', 'Sale item marked "no returns"', 0], ['Kişiye özel isim yazılmış kupa', 'Personalised mug with a name', 0],
  ['Kutusu açılmamış, fişi olan oyuncak', 'Unopened toy with a receipt', 1], ['Kutudan arızalı çıkan tost makinesi', 'Toaster faulty out of the box', 1], ['Yanlış beden, etiketi duran tişört', 'Wrong size T-shirt, tags still on', 1],
  ['Bir haftada dikişi sökülen ayakkabı', 'Shoes whose stitching split in a week', 1], ['14 gün içinde iade, faturalı kitap', 'Book returned within 14 days with an invoice', 1], ['Tarihi geçmiş satılan süt', 'Milk sold past its date', 1], ['Ekranı ölü pikselli yeni monitör', 'New monitor with dead pixels', 1],
]);
items('musteri_hakli', [
  ['"Siparişim 1 saattir gelmedi."', '"My order hasn\'t come for an hour."', 1], ['"Faturama iki kez aynı ürün yazılmış."', '"The same item is on my bill twice."', 1], ['"Çorbada saç çıktı."', '"There\'s a hair in my soup."', 1], ['"Garanti süresindeki saatim durdu."', '"My watch stopped while under warranty."', 1],
  ['"Rezervasyonum vardı ama masam yok."', '"I booked but there\'s no table."', 1], ['"Para üstümü eksik verdiniz."', '"You gave me the wrong change."', 1], ['"Menüde vejetaryen yazıyordu, içinde et var."', '"The menu said vegetarian but it has meat."', 1],
  ['"Kapanış saatinden sonra içeri almadınız."', '"You didn\'t let me in after closing time."', 0], ['"Kuponum 2 yıl önce bitti ama geçmeli."', '"My voucher expired 2 years ago but it should still work."', 0], ['"Kahvem neden sıcak?"', '"Why is my coffee hot?"', 0],
  ['"Sırada beklemek istemiyorum, önce beni alın."', '"I don\'t want to queue, serve me first."', 0], ['"Kullanılmış ayakkabıyı yenisiyle değiştirin."', '"Swap my worn shoes for new ones."', 0], ['"Yemeği bitirdim ama beğenmedim, para iade."', '"I ate it all but didn\'t like it, refund me."', 0], ['"Bedava WiFi neden çok hızlı değil?"', '"Why isn\'t the free WiFi faster?"', 0],
]);
items('hasta_acil', [
  ['Göğüs ağrısı ve sol kola yayılan uyuşma', 'Chest pain spreading to the left arm', 1], ['Konuşması bozuldu, yüzü kaydı', 'Slurred speech, face drooping', 1], ['Ciddi alerji: dudaklar şişti, nefes darlığı', 'Severe allergy: swollen lips, short of breath', 1],
  ['Durmayan kanama', 'Bleeding that won\'t stop', 1], ['Bilinç kaybı', 'Lost consciousness', 1], ['Bebekte yüksek ateş ve havale', 'Baby with high fever and a seizure', 1], ['Ağır yanık', 'Severe burn', 1], ['Zehirli madde içti', 'Swallowed a poison', 1], ['Kafa travması, kusma', 'Head injury with vomiting', 1],
  ['Hafif burun akıntısı', 'Mild runny nose', 0], ['Rapor yenileme', 'Renewing a medical note', 0], ['Bir haftalık sırt ağrısı', 'Backache for a week', 0], ['Sivilce', 'Acne', 0], ['Tahlil sonucu gösterme', 'Showing test results', 0],
  ['Hafif boğaz ağrısı', 'Slight sore throat', 0], ['Aşı randevusu', 'Vaccination appointment', 0], ['Batık tırnak', 'Ingrown toenail', 0], ['Göz numarası kontrolü', 'Eye prescription check', 0],
]);
items('bitki_dostu', [
  ['🐞 Uğur böceği', '🐞 Ladybird', 1], ['🐝 Arı', '🐝 Bee', 1], ['🪱 Solucan', '🪱 Earthworm', 1], ['🦋 Kelebek', '🦋 Butterfly', 1], ['🐦 Serçe', '🐦 Sparrow', 1], ['🦔 Kirpi', '🦔 Hedgehog', 1], ['🐸 Kurbağa', '🐸 Frog', 1], ['🕷️ Bahçe örümceği', '🕷️ Garden spider', 1],
  ['🐌 Sümüklü böcek', '🐌 Slug', 0], ['🐛 Lahana tırtılı', '🐛 Cabbage caterpillar', 0], ['🦗 Çekirge sürüsü', '🦗 Locust swarm', 0], ['🐀 Tarla faresi', '🐀 Field mouse', 0], ['🍄 Kök çürüklüğü mantarı', '🍄 Root-rot fungus', 0],
  ['🪲 Patates böceği', '🪲 Potato beetle', 0], ['🦟 Yaprak biti', '🦟 Aphid', 0], ['🌿 Yabani ot', '🌿 Weeds', 0],
]);
items('itiraz', [
  ['Hakem ofsayt verdi, VAR görüntüsü açıkça onside.', 'Offside given, but VAR clearly shows onside.', 1], ['Not hatası: cevap anahtarı yanlış basılmış.', 'Wrong mark: the answer key was misprinted.', 1], ['Ceza yazıldı ama park yeri tabelası yokmuş.', 'Fined, but there was no parking sign.', 1],
  ['Fatura başkasının sayacından çıkarılmış.', 'The bill came from someone else\'s meter.', 1], ['Sınav süresi 10 dk erken bitirildi, tutanak var.', 'Exam ended 10 min early, and it\'s on record.', 1], ['Hız cezası, ama araç o gün serviste (fatura var).', 'Speeding fine, but the car was in the garage that day (invoice).', 1],
  ['"Hakem bizi sevmiyor" dedi, delil yok.', '"The ref hates us" — no evidence.', 0], ['Sınavda kopya yakalandı, "ben bakmadım" diyor.', 'Caught cheating, says "I wasn\'t looking".', 0], ['Kırmızı ışıkta geçti, kamera kaydı net.', 'Ran a red light; the camera footage is clear.', 0],
  ['Süresi geçtikten 3 ay sonra itiraz etti.', 'Appealed 3 months after the deadline.', 0], ['"Bu kural saçma" diye itiraz ediyor.', 'Appealing because "this rule is silly".', 0], ['Ödevi hiç teslim etmedi, notu yükseltilsin istiyor.', 'Never handed it in, wants a higher grade.', 0],
]);
items('transfer_mi', [
  ['21 yaşında, 30 maçta 18 gol', 'Age 21, 18 goals in 30 games', 1], ['Uygun bonservis, sakatlık geçmişi yok', 'Fair fee, no injury history', 1], ['Takımın eksik mevkisinde, liderlik var', 'Plays the position we lack, a leader', 1], ['Genç, hızlı, sözleşmesi bitiyor (bedava)', 'Young, fast, contract expiring (free)', 1],
  ['Altyapıdan yetenekli bek', 'Talented academy full-back', 1], ['Deneyimli kaleci, ucuz maaş', 'Experienced keeper, low wages', 1],
  ['34 yaşında, dev maaş, son 2 yıl sakat', 'Age 34, huge wages, injured for 2 years', 0], ['Soyunma odasında sürekli kavga', 'Constant dressing-room fights', 0], ['Bonservis bütçenin 3 katı', 'Fee is triple the budget', 0],
  ['Aynı mevkide zaten 4 oyuncu var', 'Already have 4 players in that position', 0], ['Sosyal medyada sadece reklam yapıyor', 'Only does adverts on social media', 0], ['Doping cezası yeni bitti', 'Just finished a doping ban', 0],
]);
items('bina_guvenli', [
  ['Kolonlarda derin çatlak', 'Deep cracks in the columns', 0], ['Zemin kat dükkân için kolon kesilmiş', 'A column was cut for a ground-floor shop', 0], ['Deniz kumu ile beton dökülmüş', 'Concrete poured with sea sand', 0], ['Ruhsatsız 3 kat eklenmiş', '3 storeys added without a permit', 0],
  ['Demirler paslanmış, beton dökülüyor', 'Rusty rebar, crumbling concrete', 0], ['Fay hattının tam üstünde, eski yapı', 'Old building right on a fault line', 0], ['Bodrumu sürekli su basıyor', 'Basement always floods', 0],
  ['Deprem yönetmeliğine göre yapılmış, raporlu', 'Built to earthquake code, with a report', 1], ['Zemin etüdü yapılmış, kayalık zemin', 'Ground survey done, rocky soil', 1], ['Yangın merdiveni ve tüpleri tam', 'Fire escape and extinguishers in place', 1],
  ['Düzenli bakım, kolonlar sağlam', 'Regular maintenance, solid columns', 1], ['Güçlendirme yapılmış, belgesi var', 'Retrofitted, with certificate', 1], ['Yeni yapı denetim onayı var', 'Passed building inspection', 1],
]);
items('yatirim_teklif', [
  ['"Ayda %40 garantili kazanç!"', '"Guaranteed 40% a month!"', 0], ['"Sadece 2 kişi daha alınacak, hemen karar ver!"', '"Only 2 places left, decide now!"', 0], ['Kimsenin bilmediği yeni coin, sitesi 1 günlük', 'Unknown new coin, website is a day old', 0],
  ['"Arkadaşlarını getir, onların parasıyla kazan"', '"Bring friends and earn from their money"', 0], ['Lisanssız aracı kurum, yurtdışı hesap', 'Unlicensed broker, offshore account', 0], ['"Risk sıfır, kazanç sonsuz"', '"Zero risk, unlimited returns"', 0],
  ['Devlet tahvili, düşük ama güvenli faiz', 'Government bond, low but safe interest', 1], ['Geniş endeks fonu, uzun vade', 'Broad index fund, long term', 1], ['Lisanslı bankada vadeli mevduat', 'Fixed deposit at a licensed bank', 1],
  ['Kâr eden şirketin hisseleri, dağıtılmış sepet', 'Shares of profitable companies, diversified', 1], ['Bireysel emeklilik + devlet katkısı', 'Pension plan with state top-up', 1], ['Kendi eğitimin için kurs (mesleki)', 'A vocational course for yourself', 1],
]);
// ———————————————————— AYIRMA (kutular) ————————————————————
items('servis_sirasi', [
  ['Mercimek çorbası', 'Lentil soup', 0], ['Humus', 'Hummus', 0], ['Sigara böreği', 'Cheese rolls', 0], ['Cacık', 'Tzatziki', 0], ['Mevsim salatası', 'Seasonal salad', 0], ['Ezogelin', 'Red lentil & bulgur soup', 0],
  ['Karnıyarık', 'Stuffed aubergine', 1], ['Izgara köfte', 'Grilled meatballs', 1], ['Tavuk şiş', 'Chicken skewers', 1], ['Mantı', 'Turkish dumplings', 1], ['Levrek ızgara', 'Grilled sea bass', 1], ['Hünkâr beğendi', 'Lamb on aubergine purée', 1],
  ['Sütlaç', 'Rice pudding', 2], ['Künefe', 'Künefe', 2], ['Kazandibi', 'Caramelised milk pudding', 2], ['Dondurma', 'Ice cream', 2], ['Profiterol', 'Profiteroles', 2], ['Kabak tatlısı', 'Candied pumpkin', 2],
  ['Ayran', 'Ayran (yoghurt drink)', 3], ['Şalgam', 'Turnip juice', 3], ['Türk kahvesi', 'Turkish coffee', 3], ['Limonata', 'Lemonade', 3], ['Maden suyu', 'Sparkling water', 3], ['Demli çay', 'Strong tea', 3],
]);
items('evrak_ayikla', [
  ['Doğum belgesi', 'Birth certificate', 0], ['Kimlik kartı yenileme', 'ID card renewal', 0], ['Evlilik cüzdanı', 'Marriage certificate', 0], ['Adres değişikliği', 'Change of address', 0], ['Pasaport başvurusu', 'Passport application', 0],
  ['Ev satış sözleşmesi', 'House sale contract', 1], ['İpotek kaydı', 'Mortgage record', 1], ['Arsa ölçüm krokisi', 'Land survey sketch', 1], ['Kat mülkiyeti belgesi', 'Leasehold title', 1], ['Miras intikali (tapu)', 'Inheritance transfer (deed)', 1],
  ['Gelir vergisi beyannamesi', 'Income tax return', 2], ['KDV beyannamesi', 'VAT return', 2], ['Emlak vergisi makbuzu', 'Property tax receipt', 2], ['Vergi borcu yoktur yazısı', 'No tax debt letter', 2], ['Motorlu taşıt vergisi', 'Vehicle tax', 2],
  ['Emeklilik başvurusu', 'Pension application', 3], ['Hizmet dökümü', 'Employment record', 3], ['İşe giriş bildirgesi', 'New hire declaration', 3], ['Sağlık provizyonu', 'Health coverage check', 3], ['İşsizlik maaşı başvurusu', 'Unemployment benefit claim', 3],
]);
items('odev_okuma', [
  ['12 × 12 = 144', '12 × 12 = 144', 0], ['7 × 7 = 47', '7 × 7 = 47', 1], ['100 ÷ 4 = 25', '100 ÷ 4 = 25', 0], ['Bir yıl 365 gündür', 'A year has 365 days', 0], ['Penguenler uçar', 'Penguins can fly', 1], ['Su 0 °C\'de donar', 'Water freezes at 0 °C', 0],
  ['Örümceklerin 6 bacağı vardır', 'Spiders have 6 legs', 1], ['Dünya\'nın uydusu Ay\'dır', 'Earth\'s moon is the Moon', 0], ['Bir saat 100 dakikadır', 'An hour is 100 minutes', 1], ['Karenin 4 eşit kenarı vardır', 'A square has 4 equal sides', 0], ['0,25 = 1/4', '0.25 = 1/4', 0],
  ['Güneş bir yıldızdır', 'The Sun is a star', 0], ['Bitkiler karbondioksit alır', 'Plants take in carbon dioxide', 0], ['Yarasalar kuştur', 'Bats are birds', 1], ['5³ = 15', '5³ = 15', 1], ['Ankara Türkiye\'nin başkentidir', 'Ankara is Turkey\'s capital', 0],
  ['Işık sesten yavaştır', 'Light is slower than sound', 1], ['Bir düzine 12 tanedir', 'A dozen is 12', 0], ['%20\'si 50 olan sayı 250\'dir', '20% of 250 is 50', 0], ['Altıgenin 5 kenarı vardır', 'A hexagon has 5 sides', 1],
]);
items('belirti_bolum', [
  ['Kalp ritim bozukluğu', 'Irregular heartbeat', 0], ['Merdivende göğüs sıkışması', 'Chest tightness on stairs', 0], ['Yüksek kolesterol', 'High cholesterol', 0], ['Bacakta varis, şişme', 'Swollen varicose legs', 0],
  ['Migren atakları', 'Migraine attacks', 1], ['Unutkanlık artışı', 'Growing forgetfulness', 1], ['Bacakta karıncalanma', 'Pins and needles in the leg', 1], ['Baş dönmesi, denge kaybı', 'Dizziness, loss of balance', 1],
  ['Ayak bileği burkulması', 'Sprained ankle', 2], ['Kalça ağrısı', 'Hip pain', 2], ['Menisküs yırtığı', 'Torn meniscus', 2], ['Skolyoz (eğri omurga)', 'Scoliosis (curved spine)', 2], ['Tenisçi dirseği', 'Tennis elbow', 2],
  ['Egzama', 'Eczema', 3], ['Saç dökülmesi', 'Hair loss', 3], ['Siğil', 'Wart', 3], ['Sedef hastalığı', 'Psoriasis', 3], ['Tırnak mantarı', 'Nail fungus', 3],
]);
items('hata_turu', [
  ['Tanımsız değişken kullanılmış', 'Undefined variable used', 0], ['Tırnak işareti kapanmamış', 'Unclosed quote mark', 0], ['Girinti hatası (Python)', 'Indentation error (Python)', 0], ['if yerine fi yazılmış', 'Typed fi instead of if', 0],
  ['Toplam yerine ortalama gösteriliyor', 'Shows the average instead of the total', 1], ['Yaş 0 girilince "yetişkin" diyor', 'Age 0 is labelled "adult"', 1], ['Ay sırası 0\'dan başladığı için Ocak boş', 'January blank because months start at 0', 1], ['İndirim fiyatı artırıyor', 'The discount raises the price', 1],
  ['Liste her seferinde baştan sıralanıyor', 'List re-sorted from scratch every time', 2], ['Resimler sıkıştırılmadan 20 MB yükleniyor', 'Uncompressed 20 MB images', 2], ['Aynı API\'ye saniyede 100 istek', '100 requests per second to the same API', 2], ['Uygulama açılışı 15 saniye', 'App takes 15 seconds to open', 2],
  ['API anahtarı kodun içinde açıkta', 'API key exposed in the code', 3], ['Oturum süresi hiç dolmuyor', 'Sessions never expire', 3], ['Dosya yüklemede tür kontrolü yok', 'No file-type check on uploads', 3], ['Hata mesajı veritabanı şifresini gösteriyor', 'Error message shows the database password', 3],
]);
items('gelir_gider', [
  ['Hizmet bedeli tahsilatı', 'Service fees received', 0], ['Komisyon geliri', 'Commission income', 0], ['Hurda satışı', 'Scrap sales', 0], ['Danışmanlık ücreti (alınan)', 'Consulting fee earned', 0],
  ['İnternet faturası', 'Internet bill', 1], ['Kırtasiye', 'Stationery', 1], ['Muhasebe ücreti (ödenen)', 'Accountant\'s fee paid', 1], ['Yakıt', 'Fuel', 1], ['Sigorta primi', 'Insurance premium', 1],
  ['Bilgisayarlar', 'Computers', 2], ['Müşteri alacakları', 'Customer receivables', 2], ['Bankadaki para', 'Money in the bank', 2], ['Ofis binası', 'Office building', 2], ['Patent hakkı', 'Patent rights', 2],
  ['Kredi kartı borcu', 'Credit card balance', 3], ['Ödenecek maaşlar', 'Wages payable', 3], ['Leasing borcu', 'Lease liability', 3], ['Ödenecek SGK primi', 'Social security payable', 3],
]);
items('mevki_sec', [
  ['Penaltı kurtarmada usta', 'Great at saving penalties', 0], ['Ayaklarıyla oyun kurabilen kaleci', 'Keeper who can play with their feet', 0], ['Kale çizgisinde çok çevik', 'Very agile on the goal line', 0],
  ['Adam markajında sert', 'Tough man-marker', 1], ['Ofsayt taktiğini iyi bilir', 'Knows the offside trap well', 1], ['Kafa toplarında rakipsiz stoper', 'Unbeatable centre-back in the air', 1], ['Çizgiye inip orta açan bek', 'Full-back who overlaps and crosses', 1],
  ['Top kapan ön libero', 'Ball-winning holding midfielder', 2], ['Kilit pas uzmanı 10 numara', 'Playmaker, master of the key pass', 2], ['İki yönlü oynayan box-to-box', 'Box-to-box, both ways', 2], ['Duran top ustası', 'Set-piece specialist', 2],
  ['Ceza sahasında fırsatçı golcü', 'Poacher in the box', 3], ['Pivot santrfor, sırtı dönük oynar', 'Target man, plays back to goal', 3], ['Hızlı kanat, içe kat edip şut', 'Fast winger who cuts inside to shoot', 3],
]);
items('duygu_oku', [
  ['"Sınav yaklaştıkça midem düğümleniyor."', '"My stomach knots as the exam gets closer."', 0], ['"Ya işten atılırsam diye uyuyamıyorum."', '"I can\'t sleep worrying I\'ll be fired."', 0], ['"Kalabalıkta kalbim hızlanıyor."', '"My heart races in crowds."', 0], ['"Hep kötü bir şey olacak gibi."', '"It feels like something bad will happen."', 0],
  ['"Kedim öldü, hiçbir şey yapmak istemiyorum."', '"My cat died, I don\'t want to do anything."', 1], ['"Arkadaşım taşındı, çok özlüyorum."', '"My friend moved away, I miss them so much."', 1], ['"Eskisi gibi hiçbir şeyden zevk almıyorum."', '"Nothing feels fun like it used to."', 1],
  ['"Kardeşim odamı izinsiz karıştırdı!"', '"My sibling went through my room without asking!"', 2], ['"Sırada biri önüme geçti, sinirden titriyorum."', '"Someone cut the queue, I\'m shaking with rage."', 2], ['"Emeğimi başkası sahiplendi!"', '"Someone took credit for my work!"', 2],
  ['"Üniversiteyi kazandım!"', '"I got into university!"', 3], ['"Bebeğimiz doğdu!"', '"Our baby was born!"', 3], ['"Terfi aldım, kutlayalım!"', '"I got promoted, let\'s celebrate!"', 3], ['"Yıllar sonra eski dostumu buldum."', '"I found my old friend after years."', 3],
]);
items('haber_masasi', [
  ['Enflasyon beklentinin altında geldi', 'Inflation came in below forecast', 0], ['Altın fiyatı rekor kırdı', 'Gold price hits a record', 0], ['Yeni fabrika 2.000 kişiye iş verecek', 'New factory to hire 2,000 people', 0], ['İhracat bu ay %8 arttı', 'Exports up 8% this month', 0],
  ['Basketbol takımı Avrupa finalinde', 'Basketball team reaches the European final', 1], ['Maraton rekoru kırıldı', 'Marathon record broken', 1], ['Teknik direktör istifa etti', 'Head coach resigns', 1], ['Voleybolcular olimpiyat biletini aldı', 'Volleyball team qualifies for the Olympics', 1],
  ['Grip aşısı kampanyası başladı', 'Flu-jab campaign begins', 2], ['Yeni şehir hastanesi açıldı', 'New city hospital opens', 2], ['Uzmanlar: günde 8 bardak su', 'Experts: 8 glasses of water a day', 2], ['Kızamık vakaları arttı', 'Measles cases rise', 2],
  ['Yeni bir ötegezegen keşfedildi', 'New exoplanet discovered', 3], ['Dinozor fosili bulundu', 'Dinosaur fossil found', 3], ['Kuantum bilgisayarda yeni rekor', 'New quantum-computing record', 3], ['Mars aracı su izi buldu', 'Mars rover finds signs of water', 3],
]);
items('kredi_basvuru', [
  ['Kamu çalışanı, düzenli maaş, borcu yok', 'Public employee, steady salary, no debt', 0], ['Yüksek gelir, eski kredisini erken kapatmış', 'High income, repaid an old loan early', 0], ['Kendi evi var, istenen tutar küçük', 'Owns a home, small amount requested', 0],
  ['Yeni işe başlamış, gelir iyi ama geçmiş kısa', 'Just started a job, good pay but short history', 1], ['Öğrenci, ailesi destek oluyor', 'Student, supported by family', 1], ['Serbest çalışan, gelir dalgalı', 'Freelancer with uneven income', 1],
  ['3 kredi kartı limitte, gecikmeler var', '3 maxed credit cards, missed payments', 2], ['İcra takibi devam ediyor', 'Debt enforcement in progress', 2], ['Gelirinin 2 katı taksit istiyor', 'Wants instalments twice their income', 2], ['Belgelerde tutarsızlık var', 'Inconsistent documents', 2],
]);
items('saglikli_secim', [
  ['🚶 Asansör yerine merdiven', '🚶 Stairs instead of the lift', 0], ['😴 Her gece 8 saat uyku', '😴 8 hours of sleep every night', 0], ['🪥 Günde iki kez diş fırçalamak', '🪥 Brushing teeth twice a day', 0], ['🧴 Güneş kremi sürmek', '🧴 Wearing sunscreen', 0],
  ['🧘 Mola verip esneme yapmak', '🧘 Taking stretching breaks', 0], ['🥗 Kahvaltı etmek', '🥗 Eating breakfast', 0], ['🧼 Yemekten önce el yıkamak', '🧼 Washing hands before eating', 0], ['📵 Yatmadan önce ekranı bırakmak', '📵 No screens before bed', 0],
  ['🚬 Sigara içmek', '🚬 Smoking', 1], ['📱 Gece 3\'e kadar telefon', '📱 Phone until 3 am', 1], ['🥤 Günde 3 kutu enerji içeceği', '🥤 3 energy drinks a day', 1], ['🛋️ Bütün gün kanepede', '🛋️ All day on the sofa', 1],
  ['🍔 Her gün fast food', '🍔 Fast food every day', 1], ['🍽️ Öğün atlamak', '🍽️ Skipping meals', 1], ['🎧 Kulaklıkta en yüksek ses', '🎧 Max volume in headphones', 1], ['🚗 Emniyet kemeri takmamak', '🚗 Not wearing a seatbelt', 1],
]);
items('haber_etkisi', [
  ['Şirket rekor kâr açıkladı', 'Company reports record profit', 0], ['Yeni ilacı onay aldı', 'New drug gets approval', 0], ['Dev bir ihale kazandı', 'Wins a huge contract', 0], ['Hisse geri alım programı', 'Share buyback announced', 0], ['Yeni ürünü çok sattı', 'New product sells out', 0],
  ['CEO yolsuzluktan gözaltında', 'CEO detained for corruption', 1], ['Fabrikada büyük yangın', 'Major fire at the factory', 1], ['Ürünleri toplatılıyor (geri çağırma)', 'Product recall', 1], ['Kâr uyarısı yaptı', 'Issues a profit warning', 1], ['Büyük müşterisini kaybetti', 'Loses its biggest client', 1],
]);
items('acil_mi', [
  ['Kalp krizi şüphesi', 'Suspected heart attack', 0], ['Trafik kazası, açık kırık', 'Car crash, open fracture', 0], ['Nefes alamıyor', 'Can\'t breathe', 0], ['İnme belirtileri', 'Stroke symptoms', 0], ['Yüksekten düşme', 'Fall from a height', 0], ['Arı sokması sonrası şişlik ve nefes darlığı', 'Bee sting with swelling and breathlessness', 0],
  ['Kontrol randevusu', 'Follow-up appointment', 1], ['Reçete yazdırma', 'Getting a prescription', 1], ['Hafif soğuk algınlığı', 'Mild cold', 1], ['Kronik eklem ağrısı', 'Chronic joint pain', 1], ['Kan tahlili', 'Blood test', 1], ['Uyku sorunu', 'Trouble sleeping', 1],
]);
items('delil_mi', [
  ['Parmak izi raporu', 'Fingerprint report', 1], ['Güvenlik kamerası kaydı', 'CCTV footage', 1], ['Banka dekontu', 'Bank transfer receipt', 1], ['DNA analizi', 'DNA analysis', 1], ['İmzalı sözleşme', 'Signed contract', 1], ['Telefon HTS kaydı', 'Phone records', 1], ['Bilirkişi raporu', 'Expert witness report', 1],
  ['"Komşunun kuzeni görmüş"', '"The neighbour\'s cousin saw it"', 0], ['Sosyal medyadaki isimsiz yorum', 'Anonymous social-media comment', 0], ['"Herkes biliyor"', '"Everybody knows"', 0], ['Kahvehane dedikodusu', 'Café gossip', 0], ['Rüyada görülen olay', 'Something seen in a dream', 0], ['Kaynağı belirsiz ekran görüntüsü', 'Screenshot from an unknown source', 0],
]);
items('kredi_uygun', [
  ['Düzenli maaş, düşük borç', 'Steady salary, low debt', 1], ['Teminatı var, kredi notu yüksek', 'Has collateral, high credit score', 1], ['İş planı sağlam, ortağı kefil', 'Solid business plan, partner guarantees', 1], ['10 yıldır aynı işte', 'Same job for 10 years', 1],
  ['Gelir belgesi yok', 'No proof of income', 0], ['Kart borçları ödenmemiş', 'Unpaid card debts', 0], ['Taksit gelirin %80\'i', 'Instalment is 80% of income', 0], ['Sahte bordro getirdi', 'Brought a fake payslip', 0], ['Karşılıksız çek geçmişi', 'History of bounced cheques', 0],
]);
items('risk_sepeti', [
  ['Devlet tahvili', 'Government bond', 0], ['Mevduat', 'Bank deposit', 0], ['Altın', 'Gold', 0], ['Para piyasası fonu', 'Money-market fund', 0], ['Büyük şirket hissesi (temettü)', 'Blue-chip dividend stock', 0], ['Endeks fonu', 'Index fund', 0],
  ['Yeni çıkmış coin', 'Newly launched coin', 1], ['Kaldıraçlı forex', 'Leveraged forex', 1], ['Girişim (start-up) payı', 'Start-up stake', 1], ['Opsiyon sözleşmesi', 'Options contract', 1], ['Küçük şirket hissesi', 'Small-cap stock', 1], ['NFT koleksiyonu', 'NFT collection', 1],
]);
items('gider_mi', [
  ['Ofis kirası', 'Office rent', 1], ['Müşteri yemeği', 'Client lunch', 1], ['Şirket telefon faturası', 'Company phone bill', 1], ['Mesleki eğitim kursu', 'Professional training course', 1], ['Yazılım lisansı', 'Software licence', 1], ['Fuar standı', 'Trade-fair stand', 1],
  ['Aile tatili', 'Family holiday', 0], ['Çocuğun okul ücreti', 'Child\'s school fees', 0], ['Ev kirası', 'Home rent', 0], ['Spor salonu üyeliği', 'Gym membership', 0], ['Doğum günü hediyesi', 'Birthday present', 0], ['Kişisel kıyafet', 'Personal clothes', 0],
]);
items('belge_tamam', [
  ['Kimlik + ikametgâh + fotoğraf + imza', 'ID + proof of address + photo + signature', 1], ['Form eksiksiz, ıslak imzalı', 'Form complete, signed in ink', 1], ['Harç ödendi, dekont ekli', 'Fee paid, receipt attached', 1], ['Tüm sayfalar paraflı', 'All pages initialled', 1],
  ['İmza yok', 'Not signed', 0], ['Fotoğraf eksik', 'Photo missing', 0], ['Kimlik süresi dolmuş', 'ID expired', 0], ['Tarih kısmı boş', 'Date left blank', 0], ['Harç dekontu yok', 'No fee receipt', 0], ['Fotokopisi okunmuyor', 'Photocopy is illegible', 0],
]);
items('madde_hali', [
  ['Buz', 'Ice', 0], ['Taş', 'Stone', 0], ['Tahta', 'Wood', 0], ['Demir', 'Iron', 0], ['Şeker', 'Sugar', 0], ['Tuz', 'Salt', 0], ['Cam', 'Glass', 0], ['Tereyağı (buzdolabında)', 'Butter (from the fridge)', 0],
  ['Su', 'Water', 1], ['Süt', 'Milk', 1], ['Zeytinyağı', 'Olive oil', 1], ['Bal', 'Honey', 1], ['Cıva', 'Mercury', 1], ['Meyve suyu', 'Juice', 1], ['Erimiş çikolata', 'Melted chocolate', 1],
  ['Su buharı', 'Steam', 2], ['Oksijen', 'Oxygen', 2], ['Helyum (balon)', 'Helium (balloon)', 2], ['Karbondioksit', 'Carbon dioxide', 2], ['Doğalgaz', 'Natural gas', 2], ['Hava', 'Air', 2],
]);
items('camasir_ayir', [
  ['Beyaz çarşaf', 'White bedsheet', 0], ['Beyaz okul gömleği', 'White school shirt', 0], ['Krem havlu', 'Cream towel', 0], ['Beyaz çorap', 'White socks', 0], ['Beyaz yastık kılıfı', 'White pillowcase', 0], ['Beyaz atlet', 'White vest', 0],
  ['Kırmızı kazak', 'Red jumper', 1], ['Mavi kot', 'Blue jeans', 1], ['Yeşil tişört', 'Green T-shirt', 1], ['Siyah pantolon', 'Black trousers', 1], ['Desenli pijama', 'Patterned pyjamas', 1], ['Mor eşofman', 'Purple tracksuit', 1],
]);
items('yardim_kolisi', [
  ['Pirinç', 'Rice', 0], ['Makarna', 'Pasta', 0], ['Konserve fasulye', 'Tinned beans', 0], ['Un', 'Flour', 0], ['Mama (bebek)', 'Baby formula', 0], ['Çay', 'Tea', 0], ['Mercimek', 'Lentils', 0],
  ['Kışlık mont', 'Winter coat', 1], ['Bere', 'Beanie', 1], ['Çocuk ayakkabısı', 'Children\'s shoes', 1], ['Battaniye', 'Blanket', 1], ['Yün çorap', 'Wool socks', 1], ['Eşofman', 'Tracksuit', 1],
  ['Diş macunu', 'Toothpaste', 2], ['Sabun', 'Soap', 2], ['Şampuan', 'Shampoo', 2], ['Islak mendil', 'Wet wipes', 2], ['Bebek bezi', 'Nappies', 2], ['Hijyenik ped', 'Sanitary pads', 2],
]);
items('arz_talep', [
  ['Bayram öncesi kurbanlık talebi patladı', 'Demand for livestock spikes before the holiday', 0], ['Kuraklık: domates hasadı yarıya düştü', 'Drought halves the tomato harvest', 0], ['Ünlü biri o markayı giydi', 'A celebrity wore the brand', 0], ['Liman grevi: ithal ürün gelmiyor', 'Port strike: imports stuck', 0],
  ['Okullar açılıyor: kırtasiye talebi arttı', 'Back to school: stationery demand up', 0], ['Fabrika yangını: çip üretimi durdu', 'Factory fire halts chip production', 0],
  ['Bol hasat: elma her yerde', 'Bumper harvest: apples everywhere', 1], ['Yeni rakip fabrika açıldı', 'A new rival factory opens', 1], ['Moda geçti, kimse almıyor', 'Out of fashion, nobody buys', 1], ['Yaz bitti: dondurma talebi düştü', 'Summer\'s over: ice-cream demand falls', 1],
  ['Yeni teknoloji üretimi ucuzlattı', 'New technology cuts production cost', 1], ['Stoklar depolara sığmıyor', 'Warehouses overflowing with stock', 1],
]);
// ———————————————————— SIRALAMA (adımlar) ————————————————————
sets('masal_sirasi', [
  [['Pinokyo', 'Pinocchio'], [['Geppetto tahtadan bir kukla yapar.', 'Geppetto carves a wooden puppet.'], ['Kukla canlanır.', 'The puppet comes to life.'], ['Pinokyo yalan söyleyince burnu uzar.', 'When Pinocchio lies, his nose grows.'], ['Balinanın karnında babasını bulur.', 'He finds his father inside a whale.'], ['Gerçek bir çocuk olur.', 'He becomes a real boy.']]],
  [['Külkedisi', 'Cinderella'], [['Üvey annesi onu çalıştırır.', 'Her stepmother makes her work.'], ['Peri anne elbise verir.', 'The fairy godmother gives her a dress.'], ['Balo\'da prensle dans eder.', 'She dances with the prince at the ball.'], ['Gece yarısı kaçarken ayakkabısı düşer.', 'Running at midnight, she loses a shoe.'], ['Prens ayakkabının sahibini bulur.', 'The prince finds the shoe\'s owner.']]],
  [['Çirkin Ördek Yavrusu', 'The Ugly Duckling'], [['Yumurtadan farklı bir yavru çıkar.', 'A different chick hatches.'], ['Herkes onunla alay eder.', 'Everyone makes fun of him.'], ['Yalnız başına kışı geçirir.', 'He spends the winter alone.'], ['Baharda suya bakar.', 'In spring he looks into the water.'], ['Güzel bir kuğu olduğunu görür.', 'He sees he is a beautiful swan.']]],
  [['Keloğlan ve Dev', 'Keloğlan and the Giant'], [['Keloğlan yola çıkar.', 'Keloğlan sets off.'], ['Ormanda bir devle karşılaşır.', 'He meets a giant in the forest.'], ['Peyniri taş diye sıkıp devi korkutur.', 'He squeezes cheese like a stone to scare the giant.'], ['Dev ona hazinesini verir.', 'The giant gives him his treasure.'], ['Keloğlan anasına döner.', 'Keloğlan returns to his mother.']]],
  [['Hansel ve Gretel', 'Hansel and Gretel'], [['Kardeşler ormanda kaybolur.', 'The siblings get lost in the woods.'], ['Şekerden bir ev bulurlar.', 'They find a house made of sweets.'], ['Cadı onları yakalar.', 'A witch catches them.'], ['Gretel cadıyı kandırır.', 'Gretel tricks the witch.'], ['Evlerine dönerler.', 'They return home.']]],
  [['Uyuyan Güzel', 'Sleeping Beauty'], [['Prenses doğar, büyük bir şölen yapılır.', 'A princess is born and there is a feast.'], ['Kötü peri lanet okur.', 'A wicked fairy curses her.'], ['Prenses iğneye dokunur.', 'The princess pricks her finger on a spindle.'], ['Bütün saray uykuya dalar.', 'The whole palace falls asleep.'], ['Bir prens gelir ve onu uyandırır.', 'A prince comes and wakes her.']]],
  [['Bir bitki büyütmek', 'Growing a plant'], [['Saksıya toprak koy.', 'Fill a pot with soil.'], ['Tohumu ek.', 'Plant the seed.'], ['Sula.', 'Water it.'], ['Güneşe koy.', 'Put it in the sun.'], ['Filizlenmesini izle.', 'Watch it sprout.']]],
]);
sets('yasam_dongusu', [
  [['Arının yaşamı', 'A bee\'s life'], [['🥚 Yumurta', '🥚 Egg'], ['🐛 Larva', '🐛 Larva'], ['🫘 Pupa', '🫘 Pupa'], ['🐝 Arı', '🐝 Bee']]],
  [['Ağacın yaşamı', 'A tree\'s life'], [['🌰 Palamut', '🌰 Acorn'], ['🌱 Fide', '🌱 Seedling'], ['🌿 Fidan', '🌿 Sapling'], ['🌳 Ağaç', '🌳 Tree']]],
  [['İnsanın yaşamı', 'A human\'s life'], [['👶 Bebek', '👶 Baby'], ['🧒 Çocuk', '🧒 Child'], ['🧑 Genç', '🧑 Teenager'], ['🧔 Yetişkin', '🧔 Adult'], ['👴 Yaşlı', '👴 Elderly']]],
  [['Kaplumbağanın yaşamı', 'A turtle\'s life'], [['🏖️ Kuma yumurta bırakılır', '🏖️ Eggs laid in sand'], ['🥚 Yumurtalar çatlar', '🥚 Eggs hatch'], ['🐢 Yavrular denize koşar', '🐢 Hatchlings race to the sea'], ['🌊 Okyanusta büyür', '🌊 Grows up in the ocean']]],
  [['Ay\'ın evreleri', 'Phases of the Moon'], [['🌑 Yeni ay', '🌑 New moon'], ['🌒 Hilal', '🌒 Crescent'], ['🌓 İlk dördün', '🌓 First quarter'], ['🌕 Dolunay', '🌕 Full moon'], ['🌗 Son dördün', '🌗 Last quarter']]],
  [['Mevsimler', 'The seasons'], [['🌸 İlkbahar', '🌸 Spring'], ['☀️ Yaz', '☀️ Summer'], ['🍂 Sonbahar', '🍂 Autumn'], ['❄️ Kış', '❄️ Winter']]],
  [['Ekmek nasıl yapılır?', 'How bread is made'], [['🌾 Buğday ekilir', '🌾 Wheat is sown'], ['🚜 Hasat edilir', '🚜 It is harvested'], ['🏭 Un olur', '🏭 Milled into flour'], ['🥣 Hamur yoğrulur', '🥣 Dough is kneaded'], ['🍞 Fırında pişer', '🍞 Baked in the oven']]],
]);
sets('algoritma_adim', [
  [['Kapıdan çıkış', 'Leaving the house'], [['Ayakkabıları giy', 'Put on shoes'], ['Anahtarı al', 'Take the keys'], ['Kapıyı aç', 'Open the door'], ['Dışarı çık', 'Step outside'], ['Kapıyı kilitle', 'Lock the door']]],
  [['En büyük sayıyı bul', 'Find the largest number'], [['enBüyük = ilk sayı', 'max = first number'], ['Sıradaki sayıya bak', 'Look at the next number'], ['Daha büyükse enBüyük yap', 'If bigger, set it as max'], ['Liste bitene kadar tekrarla', 'Repeat until the list ends'], ['enBüyük\'ü yazdır', 'Print max']]],
  [['Robot kare çizer', 'Robot draws a square'], [['Kalemi indir', 'Pen down'], ['10 adım ilerle', 'Move 10 steps'], ['90° sağa dön', 'Turn right 90°'], ['Bunu 4 kez tekrarla', 'Repeat 4 times'], ['Kalemi kaldır', 'Pen up']]],
  [['Mesaj gönderme', 'Sending a message'], [['Uygulamayı aç', 'Open the app'], ['Kişiyi seç', 'Choose the contact'], ['Mesajı yaz', 'Type the message'], ['Gönder\'e bas', 'Press Send'], ['İletildi işaretini kontrol et', 'Check the delivered tick']]],
  [['Sayı tahmin oyunu', 'Number-guessing game'], [['Rastgele sayı seç', 'Pick a random number'], ['Oyuncudan tahmin al', 'Get the player\'s guess'], ['Büyük/küçük ipucu ver', 'Say higher or lower'], ['Doğru bilene kadar tekrarla', 'Repeat until correct'], ['"Bildin!" yaz', 'Print "You got it!"']]],
]);
sets('tarif_sirasi', [
  [['🥞 Krep', '🥞 Pancakes'], [['Yumurta ve sütü çırp', 'Whisk eggs and milk'], ['Unu ekle', 'Add the flour'], ['Tavayı yağla', 'Grease the pan'], ['Hamuru dök', 'Pour in the batter'], ['Çevir ve pişir', 'Flip and cook']]],
  [['🍵 Çay', '🍵 Tea'], [['Çaydanlığa su koy', 'Fill the kettle'], ['Suyu kaynat', 'Boil it'], ['Demliğe çay koy', 'Put tea in the pot'], ['Kaynar suyu dök', 'Pour the hot water'], ['Demlenince bardağa koy', 'Pour into glasses once brewed']]],
  [['🥗 Çoban salata', '🥗 Shepherd\'s salad'], [['Sebzeleri yıka', 'Wash the vegetables'], ['Domates ve salatalığı doğra', 'Chop tomato and cucumber'], ['Soğanı ekle', 'Add the onion'], ['Tuz, limon, yağ koy', 'Add salt, lemon and oil'], ['Karıştır', 'Toss']]],
  [['🍚 Pilav', '🍚 Rice pilaf'], [['Pirinci yıka', 'Rinse the rice'], ['Tereyağında kavur', 'Toast it in butter'], ['Sıcak su ve tuz ekle', 'Add hot water and salt'], ['Kısık ateşte pişir', 'Simmer on low heat'], ['Demlendir', 'Let it rest']]],
  [['🍪 Kurabiye', '🍪 Cookies'], [['Tereyağı ve şekeri karıştır', 'Cream butter and sugar'], ['Yumurta ekle', 'Add an egg'], ['Unu ekleyip yoğur', 'Add flour and knead'], ['Şekil ver', 'Shape them'], ['Fırında pişir', 'Bake']]],
  [['🥤 Ayran', '🥤 Ayran'], [['Yoğurdu kaba koy', 'Put yoghurt in a jug'], ['Soğuk su ekle', 'Add cold water'], ['Tuz ekle', 'Add salt'], ['Çırp', 'Whisk'], ['Bardaklara dök', 'Pour into glasses']]],
]);
sets('sabah_rutini', [
  [['Hafta sonu sabahı', 'Weekend morning'], [['Uyan', 'Wake up'], ['Yatağını topla', 'Make your bed'], ['Yüzünü yıka', 'Wash your face'], ['Kahvaltı yap', 'Have breakfast'], ['Parka git', 'Go to the park']]],
  [['İşe hazırlık', 'Getting ready for work'], [['Alarmı kapat', 'Turn off the alarm'], ['Duş al', 'Shower'], ['Giyin', 'Get dressed'], ['Kahveni iç', 'Drink your coffee'], ['Otobüse bin', 'Catch the bus']]],
]);
// ———————————————————— KIYAS ————————————————————
const V = (id, list) => ext(id, { items: list.map(([a, b, v]) => [B(a, b), v]) });
V('hayvan_hiz', [['🦅 Kartal (dalış)', '🦅 Eagle (dive)', 240], ['🐎 Yarış atı', '🐎 Racehorse', 70], ['🦘 Kanguru', '🦘 Kangaroo', 56], ['🐺 Kurt', '🐺 Wolf', 60], ['🦈 Köpek balığı', '🦈 Shark', 50], ['🐊 Timsah (karada)', '🐊 Crocodile (on land)', 17],
  ['🐧 Penguen (yüzerken)', '🐧 Penguin (swimming)', 36], ['🐿️ Sincap', '🐿️ Squirrel', 20], ['🐁 Fare', '🐁 Mouse', 13], ['🦓 Zebra', '🦓 Zebra', 64], ['🐪 Deve', '🐪 Camel', 65], ['🦦 Su samuru', '🦦 Otter', 11], ['🐷 Domuz', '🐷 Pig', 17], ['🐕 Tazı', '🐕 Greyhound', 72]]);
V('hayvan_agirlik', [['🦏 Gergedan', '🦏 Rhino', 2300], ['🦛 Su aygırı', '🦛 Hippo', 1500], ['🐊 Timsah', '🐊 Crocodile', 500], ['🦍 Goril', '🦍 Gorilla', 160], ['🐐 Keçi', '🐐 Goat', 60], ['🐑 Koyun', '🐑 Sheep', 70], ['🦌 Geyik', '🦌 Deer', 120],
  ['🐼 Panda', '🐼 Panda', 100], ['🦊 Tilki', '🦊 Fox', 7], ['🐇 Tavşan', '🐇 Rabbit', 2.5], ['🦔 Kirpi', '🦔 Hedgehog', 1], ['🐁 Fare', '🐁 Mouse', 0.02], ['🦢 Kuğu', '🦢 Swan', 11], ['🐢 Dev kaplumbağa', '🐢 Giant tortoise', 250]]);
V('gezegen_boyut', [['☀️ Güneş', '☀️ The Sun', 1392700], ['🪨 Plüton', '🪨 Pluto', 2377], ['🌑 Ganymede (Jüpiter uydusu)', '🌑 Ganymede (Jupiter moon)', 5268], ['🌑 Titan (Satürn uydusu)', '🌑 Titan (Saturn moon)', 5150], ['🌑 Europa', '🌑 Europa', 3122], ['🪨 Ceres', '🪨 Ceres', 940]]);
V('tarih_once', [['Piramitlerin yapımı', 'Building of the Pyramids', -2560], ['İlk Olimpiyat Oyunları', 'First Olympic Games', -776], ['Roma\'nın kuruluşu', 'Founding of Rome', -753], ['Büyük İskender\'in ölümü', 'Death of Alexander the Great', -323],
  ['Göktürk Kitabeleri', 'Orkhon inscriptions', 732], ['Ayasofya\'nın yapımı', 'Hagia Sophia built', 537], ['Osmanlı Devleti\'nin kuruluşu', 'Founding of the Ottoman state', 1299], ['Amerikan Bağımsızlık Bildirgesi', 'US Declaration of Independence', 1776],
  ['Buhar makinesi (Watt)', 'Watt\'s steam engine', 1769], ['Dünyanın ilk fotoğrafı', 'First photograph', 1826], ['İlk otomobil (Benz)', 'First car (Benz)', 1886], ['Kadınlara seçme seçilme hakkı (Türkiye)', 'Women\'s vote in Turkey', 1934],
  ['İlk uydu Sputnik', 'Sputnik, first satellite', 1957], ['İnternetin (WWW) doğuşu', 'Birth of the World Wide Web', 1991], ['İlk akıllı telefon (iPhone)', 'First iPhone', 2007], ['Penisilinin keşfi', 'Discovery of penicillin', 1928]]);
ext('tarih_once', { fmt: v => (v < 0 ? (lang === 'tr' ? `MÖ ${-v}` : `${-v} BC`) : String(v)) });
V('nufus_kiyas', [['🇵🇰 Pakistan', '🇵🇰 Pakistan', 240], ['🇧🇩 Bangladeş', '🇧🇩 Bangladesh', 173], ['🇷🇺 Rusya', '🇷🇺 Russia', 144], ['🇲🇽 Meksika', '🇲🇽 Mexico', 129], ['🇪🇹 Etiyopya', '🇪🇹 Ethiopia', 127], ['🇵🇭 Filipinler', '🇵🇭 Philippines', 117],
  ['🇻🇳 Vietnam', '🇻🇳 Vietnam', 99], ['🇮🇷 İran', '🇮🇷 Iran', 89], ['🇫🇷 Fransa', '🇫🇷 France', 68], ['🇮🇹 İtalya', '🇮🇹 Italy', 59], ['🇰🇷 Güney Kore', '🇰🇷 South Korea', 52], ['🇦🇷 Arjantin', '🇦🇷 Argentina', 46], ['🇳🇱 Hollanda', '🇳🇱 Netherlands', 18], ['🇦🇿 Azerbaycan', '🇦🇿 Azerbaijan', 10], ['🇳🇴 Norveç', '🇳🇴 Norway', 5.5]]);
V('dag_yukseklik', [['K2', 'K2', 8611], ['Aconcagua', 'Aconcagua', 6961], ['Denali', 'Denali', 6190], ['Fuji', 'Mount Fuji', 3776], ['Matterhorn', 'Matterhorn', 4478], ['Kaçkar', 'Kaçkar', 3937], ['Süphan Dağı', 'Mount Süphan', 4058], ['Olimpos', 'Mount Olympus', 2917], ['Etna', 'Mount Etna', 3357], ['Ben Nevis', 'Ben Nevis', 1345]]);
V('nehir_uzunluk', [['Yangtze', 'Yangtze', 6300], ['Volga', 'Volga', 3530], ['Kongo', 'Congo', 4700], ['Ganj', 'Ganges', 2525], ['Sakarya', 'Sakarya', 824], ['Seyhan', 'Seyhan', 560], ['Thames', 'Thames', 346], ['Sen', 'Seine', 777], ['Mekong', 'Mekong', 4900], ['Yeşilırmak', 'Yeşilırmak', 519]]);
V('yapi_yukseklik', [['🗼 Tokyo Skytree', '🗼 Tokyo Skytree', 634], ['🏢 Shanghai Kulesi', '🏢 Shanghai Tower', 632], ['🏙️ Petronas Kuleleri', '🏙️ Petronas Towers', 452], ['🕌 Süleymaniye minaresi', '🕌 Süleymaniye minaret', 76], ['⛪ Köln Katedrali', '⛪ Cologne Cathedral', 157],
  ['🗽 Taipei 101', '🗽 Taipei 101', 508], ['🏟️ Atatürk Kültür Merkezi', '🏟️ Atatürk Cultural Centre', 40], ['🌉 Golden Gate (kule)', '🌉 Golden Gate (tower)', 227], ['🗼 CN Kulesi', '🗼 CN Tower', 553]]);
// i18n-skip-end
