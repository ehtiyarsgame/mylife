// Konuşma sahneleri için soru havuzları. Her tur: "durum | iyi | idare eder | kötü".
// TR ve EN blokları birebir aynı sırayla yazılır; oyun dile göre birini seçer.
// Her sohbet: 1 açılış + 2 orta tur + 1 kapanış. Mülakatta orta turlardan biri mesleğe özeldir.
import { lang } from '../core/i18n.js';

// i18n-skip-start
const TR = {
  tanisma: {
    open: [
      'Kafede yanındaki kişiyle göz göze geldiniz. | Gülümse, ortamla ilgili hafif bir yorum yap | Selam verip telefona dön | Hemen kendini anlatmaya başla',
      'Bir arkadaşının doğum günü partisinde tanıştırıldınız. | Ortak arkadaşınızı nereden tanıdığını sor | "Memnun oldum" deyip uzaklaş | Partinin sıkıcı olduğundan yakın',
      'Kütüphanede aynı kitaba uzandınız. | Gülüp kitabı ona uzat, neden seçtiğini sor | Kitabı alıp masana dön | "Ben önce gördüm" de',
      'Spor salonunda yanındaki aleti kullanıyor, sana bakıp gülümsedi. | Kısa bir selam ver, antrenmanını bölmeden bir şey sor | Başınla selam ver | Ona nasıl çalışması gerektiğini anlatmaya başla',
      'Otobüs durağında yağmur bastırdı, şemsiyeniz tek. | Şemsiyeni paylaşmayı nazikçe teklif et | Görmezden gel | Şemsiyeni kapatıp onunkinin altına gir',
      'Bir konserde yanındaki kişi şarkıya eşlik ediyor. | Şarkıyı sevdiğini söyle, en sevdiği parçayı sor | Sessizce konseri izle | Şarkının sözlerini yanlış söylediğini düzelt',
      'İş yerindeki bir eğitimde aynı masaya düştünüz. | Kendini tanıt, eğitim hakkında ne düşündüğünü sor | Not almaya odaklan | Eğitmeni alaycı bir dille eleştir',
      'Parkta köpeğini gezdiren biri, köpeği sana doğru koştu. | Köpeği sev, adını ve cinsini sor | Köpeği uzaklaştır | "Köpeğinize sahip çıkın" diye söylen',
      'Bir düğünde aynı masaya oturtuldunuz. | Gelin ya da damatla nasıl tanıştığını sor | Yemeğine odaklan | Masadakileri tek tek yorumla',
      'Gönüllü bir çevre temizliğinde aynı gruba düştünüz. | Yardım teklif edip neden gönüllü olduğunu sor | Kendi işine bak | Yorulduğundan şikâyet et',
      'Bir arkadaşın seni biriyle buluşturdu; ilk kez yüz yüzesiniz. | Rahat bir selamla başla, günü nasıl geçti sor | Menüye bakıp sessiz kal | Geç kaldığı için sitem et',
      'Bir kurs sınıfında yanındaki kişi kalemini düşürdü. | Kalemi verip kursa neden katıldığını sor | Kalemi verip dön | Dalgın olduğunu söyleyip takıl',
    ],
    mid: [
      'Elindeki kitabı fark ettin. | Kitap hakkında merakla soru sor | Kendi okuduğun kitapları say | "Kitap okumak sıkıcı" diye takıl',
      'Sohbet koyulaştı; o da sana soru soruyor. | Dürüst ve samimi cevap ver | Kısa geçiştir | Olduğundan farklı görünmeye çalış',
      '"Ne iş yapıyorsun?" diye soruyor. | İşini ya da okulunu anlat, sevdiğin yanını paylaş | Sadece unvanını söyle | Maaşınla övün',
      '"Boş zamanlarında ne yaparsın?" diye soruyor. | Sevdiğin bir hobiyi heyecanla anlat, onunkini de sor | "Pek bir şey yapmam" de | Onun hobilerini küçümse',
      'Sevdiği bir diziden bahsediyor; sen izlemedin. | İzlemediğini söyle, neden sevdiğini merak et | İzlemiş gibi yap | "Diziler zaman kaybı" de',
      'Ailesinden sıcak bir hikâye anlatıyor. | Dikkatle dinle, sen de bir anı paylaş | Başını sallayıp konuyu değiştir | Kendi aileni övmeye başla',
      'Gelecek hayallerini soruyor. | Gerçekçi ama heyecanlı bir hayalini anlat | "Bilmem, bakarız" de | Abartılı bir zenginlik hayali anlat',
      'Bir konuda senden farklı düşündüğü ortaya çıktı. | Görüşünü merak et, saygıyla kendi fikrini söyle | Hemen onu onayla | Tartışmayı kazanmaya çalış',
      'Sakar bir an: içeceğini üstüne döktün. | Kendinle gül, durumu hafife al | Utanıp sus | Garsonu suçla',
      'Telefonun üst üste çalıyor. | Sessize al, "Önemli değilse sonra bakarım" de | Açıp kısa konuş | Açıp uzun uzun konuş',
      'Seyahat etmeyi sevdiğini söylüyor. | En sevdiği yeri ve nedenini sor | Kendi gittiğin yerleri say | "Evim en güzel yer" deyip konuyu kapat',
      'En sevdiği yemeği soruyorsun; aynı yemeği seviyormuşsunuz. | Bunu bir şakayla kutla, iyi bir mekân öner | "Güzel" deyip geç | "Herkes onu sever" de',
      'Eski bir ilişkisinden kısaca bahsetti. | Yargılamadan dinle, konuyu nazikçe ilerlet | Konuyu hemen değiştir | Detayları merakla sorgula',
      'Müzik zevkinizi konuşuyorsunuz. | Birbirinize birer şarkı önerin | Sadece dinlediğin türü söyle | Onun müzik zevkiyle dalga geç',
      'Bir hayvanı olup olmadığını soruyor. | Varsa sevimli bir anı anlat, yoksa ne isterdin söyle | "Yok" deyip sus | "Hayvanlardan hoşlanmam" de',
      'Bir an sessizlik oldu. | Ortamdaki bir şeyle ilgili rahat bir soru sor | Telefonuna bak | Gergin bir şekilde hızlı hızlı konuş',
      'Seni güldürmeye çalışan bir şaka yaptı. | İçtenlikle gül, sen de hafif bir espri yap | Nazikçe gülümse | Şakayı açıklamasını iste',
      'Gönüllü çalıştığı bir dernekten bahsediyor. | Ne yaptıklarını sor, katılmak istediğini söyle | "Güzel" de | "O işler boşuna" de',
      'Hangi şehirde büyüdüğünü soruyor. | Çocukluğundan kısa, renkli bir anı anlat | Sadece şehrin adını söyle | Büyüdüğün yeri kötüle',
      'Stresli bir iş haftasından yakınıyor. | Anladığını söyle, onu neyin rahatlattığını sor | "Herkes yoruluyor" de | Hemen çözüm dersi ver',
    ],
    close: [
      'Kalkma vakti geldi. | Tekrar görüşmeyi nazikçe teklif et | Sadece "İyi günler" de | Israrla numarasını iste',
      'Hesap geldi. | Paylaşmayı ya da bu sefer senin ödemeni kibarca öner | Sessizce kendi payını öde | Hesabı ona bırak',
      'Vedalaşırken sana bakıp gülümsüyor. | Güzel vakit geçirdiğini söyle, bir sonraki buluşmayı öner | El sallayıp git | "Beni ararsın herhalde" de',
      'Konser/etkinlik bitiyor. | Bir dahaki etkinliğe birlikte gitmeyi öner | "Görüşürüz" de | Onu takip etmek için adresini sor',
      'Yağmur dindi, yollar ayrılıyor. | Numaranı verip "Yazarsan sevinirim" de | "Kendine iyi bak" de | "Beni unutma" diye ısrar et',
      'Arkadaşları onu çağırıyor. | "Seni tuttum, sonra devam edelim mi?" de | Ona iyi eğlenceler dile | Arkadaşlarının yanına kendini davet et',
      'Sohbet çok iyi geçti, ama geç oldu. | Güvenle eve varmasını dile, yarın yazmayı teklif et | "İyi geceler" de | Biraz daha kalması için ısrar et',
      'Ortak bir ilgi alanı buldunuz. | O konuda bir etkinlik bulup davet etmeyi teklif et | "Belki bir gün" de | Hemen yarın için plan dayat',
    ],
  },
  mulakat: {
    open: [
      '"Bize kendinizden bahseder misiniz?" | İşle ilgili deneyimini kısa ve net anlat | Çocukluğundan başlayarak hayat hikâyeni anlat | "Özgeçmişimde yazıyor" de',
      'Mülakata 5 dakika erken geldin; görevli seni bekletiyor. | Sakin bekle, notlarını gözden geçir | Telefonda oyun oyna | Görevliye ne kadar bekleyeceğini sor, sitem et',
      'Görüşmeci elini uzatıp "Hoş geldiniz" diyor. | Göz teması kurup sıcak bir tokalaşma yap, teşekkür et | Başınla selam ver | Hemen maaşı sor',
      '"İlanı nereden gördünüz?" | Nerede gördüğünü ve seni neyin çektiğini söyle | "İnternette" de | "Her yere başvuruyorum zaten" de',
      '"Özgeçmişinizde bir yıllık boşluk var, ne yaptınız?" | Dürüstçe anlat ve o dönemde ne öğrendiğini söyle | Konuyu geçiştir | Uydurma bir iş anlat',
      'Görüşmeci "Kısaca neden buradasınız?" diye soruyor. | Bu işte neye katkı verebileceğini tek cümlede söyle | "İşe ihtiyacım var" de | "Arkadaşım zorla gönderdi" diye şaka yap',
    ],
    mid: [
      '"Neden bu şirket?" | Şirketi araştırdığını gösteren somut bir sebep söyle | "Kariyerimde ilerlemek istiyorum" de | "Maaşınız iyi" de',
      '"Zor bir durumu nasıl çözdünüz?" | Durumu, yaptığını ve sonucunu örnekle anlat | Genel olarak çalışkan olduğunu söyle | "Hiç zorluk yaşamadım" de',
      '"En büyük zayıf yönünüz nedir?" | Gerçek bir zayıflığı ve onu nasıl geliştirdiğini anlat | "Mükemmeliyetçiyim" de | "Zayıf yönüm yok" de',
      '"Beş yıl sonra kendinizi nerede görüyorsunuz?" | Bu işte büyüyüp sorumluluk aldığını anlat | "Bilmiyorum" de | "Sizin yerinizde" de',
      '"Bir ekip arkadaşınızla anlaşmazlığa düştüğünüzü düşünün." | Önce dinleyip ortak çözüm aradığını örnekle anlat | "Yöneticiye söylerim" de | "Genelde ben haklı çıkarım" de',
      '"Baskı altında nasıl çalışırsınız?" | Önceliklendirme yaptığın gerçek bir örnek ver | "Baskıyı severim" de | "Baskı altında çalışamam" de',
      '"Bir hata yaptığınız zamanı anlatır mısınız?" | Hatayı, nasıl düzelttiğini ve dersini anlat | Küçük bir hatayı geçiştir | Hatayı başkasına yükle',
      '"Maaş beklentiniz nedir?" | Piyasayı araştırdığını gösteren makul bir aralık söyle | "Ne verirseniz" de | Piyasanın iki katını iste',
      '"Neden önceki işinizden ayrıldınız?" | Gelişim arayışını olumlu bir dille anlat | "Sıkıldım" de | Eski patronunu kötüle',
      '"Sizi diğer adaylardan ayıran ne?" | Somut bir beceri ve başarıyla cevap ver | "Çok çalışkanım" de | "Diğerlerini tanımıyorum ama benden iyisi yok" de',
      '"Aynı anda üç acil iş gelse ne yaparsınız?" | Etkiye ve süreye göre sıralayıp ekiple paylaştığını anlat | "Hepsini birden yaparım" de | "Birini boş veririm" de',
      '"Yeni bir şeyi hızla öğrendiğiniz bir örnek?" | Nasıl öğrendiğini ve sonucunu anlat | "Hızlı öğrenirim" deyip geç | "Öğrenmeyi sevmem" de',
    ],
    close: [
      '"Bize sormak istediğiniz bir şey var mı?" | Ekip ve gelişim fırsatları hakkında soru sor | "Ne zaman izin kullanabilirim?" diye sor | "Yok" de',
      'Görüşme bitiyor; görüşmeci ayağa kalkıyor. | Zamanı için teşekkür et, süreci sor | Sessizce çık | "Beni alırsınız değil mi?" de',
      '"Ne zaman başlayabilirsiniz?" | Net ve gerçekçi bir tarih ver | "Bilmiyorum" de | "Hemen yarın, ama önce bir ay tatil" de',
      '"Son olarak eklemek istediğiniz bir şey?" | Bu işi neden istediğini kısa ve samimi özetle | "Hayır, teşekkürler" de | Aynı şeyleri uzun uzun tekrarla',
      '"Referans verebilir misiniz?" | Eski yöneticinin iletişim bilgisini ver | Bir arkadaşının adını ver | "Referansa gerek yok" de',
      '"Sizi arayacağız." | Teşekkür et, bir hafta içinde haber bekleyeceğini nazikçe söyle | "Tamam" de | "Aramazsanız ben ararım, her gün" de',
    ],
  },
  // Mesleğe özel mülakat soruları: önce işin kendi havuzu, yoksa yolun (path) havuzu
  is_doktor: { mid: [
    'Başhekim soruyor: "Acile aynı anda üç hasta gelse kime önce bakarsınız?" | Hayati tehlikeye göre triyaj yapacağını anlat | Geliş sırasına göre bakacağını söyle | En tanıdık görüneni seçeceğini söyle',
    '"Bir hasta tedaviyi reddederse ne yaparsınız?" | Riskleri anlaşılır dille anlatıp kararına saygı duyacağını söyle | Ailesini ikna etmeye çalışacağını söyle | Zorla tedavi edeceğini söyle',
    '"Tıbbi bir hata yaptığınızı fark etseniz?" | Hemen bildirip hastayı bilgilendireceğini ve düzelteceğini söyle | Kimse fark etmezse susacağını ima et | Hemşireyi suçlayacağını söyle',
    '"Nöbet sonrası çok yorgunken acil bir vaka gelirse?" | Güvenlik için ekipten destek isteyip vakayı paylaşacağını anlat | "Kahve içer devam ederim" de | Vakayı reddedeceğini söyle',
    '"Uzmanlık için hangi alanı düşünüyorsunuz, neden?" | İlgini ve deneyimini somut bir hastayla anlat | "Hangisi çok kazandırırsa" de | "Hiç düşünmedim" de',
    '"Hasta yakını size bağırıyor." | Sakince endişesini dinleyip durumu açıklayacağını söyle | Güvenliği çağıracağını söyle | Sen de sesini yükselteceğini söyle',
  ] },
  is_muhendis: { mid: [
    '"Bir projede teslim tarihi yetişmiyor; ne yaparsınız?" | Kapsamı önceliklendirip müşteriyle erken konuşacağını anlat | Fazla mesaiyle yetiştireceğini söyle | Testleri atlayacağını söyle',
    '"Tasarımınızda güvenlik açığı buldunuz; kimse fark etmemiş." | Hemen raporlayıp düzeltme planı sunacağını söyle | Bir sonraki sürümde bakacağını söyle | Kimseye söylemeyeceğini ima et',
    '"En gurur duyduğunuz teknik iş?" | Problemi, çözümünü ve ölçülebilir sonucunu anlat | Kullandığın araçları say | "Hepsi çok iyiydi" de',
    '"Bir sistemi nasıl test edersiniz?" | Sınır durumlarını, yük testini ve otomasyonu anlat | "Çalışıyor mu diye bakarım" de | "Test işi benim değil" de',
    '"Bilmediğiniz bir teknolojiyle iş verilirse?" | Hızlı öğrenme planını ve kime danışacağını anlat | "Öğrenirim" deyip geç | Başka birine devredeceğini söyle',
    '"Maliyeti düşürmeniz istense ama kalite düşecekse?" | Seçenekleri ve risklerini verilerle yöneticiye sunacağını söyle | Sessizce ucuz malzeme kullanacağını söyle | Talebi reddedeceğini söyle',
  ] },
  is_yazilimci: { mid: [
    '"Canlı sistem gece çöktü, ne yaparsınız?" | Önce hizmeti geri getirip sonra kök nedeni ve raporu hazırlarım de | Sabah bakacağını söyle | Son değişikliği yapanı suçla',
    '"Kod incelemesinde kodunuz sert eleştirildi." | Eleştiriyi dinleyip gerekeni düzeltirim, gerekirse gerekçemi anlatırım de | Sessizce kabul ederim de | İnceleyenin anlamadığını söyle',
    '"Bu fonksiyon neden yavaş olabilir?" | Ölçerek darboğazı bulacağını, sonra optimize edeceğini anlat | Tahmini bir sebep söyle | "Bilgisayar yavaştır" de',
    '"Teknik borç ile yeni özellik arasında nasıl seçersiniz?" | Riskine ve iş etkisine göre ekiple dengeleyeceğini söyle | Hep yeni özelliği seçeceğini söyle | "Teknik borç diye bir şey yok" de',
  ] },
  is_futbol: { mid: [
    'Teknik direktör soruyor: "Yedek kalırsan ne yaparsın?" | Antrenmanda daha çok çalışıp şansımı beklerim de | "Beklerim" de | Basına sitem edeceğini söyle',
    '"Takımın taktiği senin oyun tarzına uymuyorsa?" | Takımın planına uyup gücümü ona katarım de | "Kendi bildiğimi oynarım" de | Transfer isteyeceğini söyle',
    '"Sakatlıktan sonra baskı altında erken dönmen istenirse?" | Sağlık ekibinin onayını bekleyeceğini söyle | "Ağrı kesiciyle oynarım" de | Kulübü tehdit et',
    '"Sosyal medyada taraftarlar sana hakaret ediyor." | Cevap vermeyip sahada göstereceğini söyle | Hesabını kapatacağını söyle | Taraftarlara cevap yazacağını söyle',
    '"Kaptanlık sana verilse ne değiştirirsin?" | Genç oyunculara destek olup iletişimi güçlendiririm de | "Bir şey değişmez" de | "Herkes bana uyar" de',
    '"Rakip menajer gizlice görüşmek istiyor." | Kulübüne ve kurallara saygıyla menajerine yönlendir de | Gizlice görüşeceğini söyle | Hemen basına anlatacağını söyle',
  ] },
  is_usta: { mid: [
    'Usta soruyor: "Müşteri arıza için acele ediyor, parça yok; ne yaparsın?" | Durumu açıkça anlatıp güvenli geçici çözüm öneririm de | Uymayan parçayı takarım de | Müşteriyi başka yere gönder',
    '"İş güvenliği ekipmanını neden takarsın?" | Kazaların çoğu dikkatsizlikten olur, her zaman takarım de | "Usta görürse takarım" de | "Rahatsız ediyor, takmam" de',
    '"Bir işi yanlış yaptığını fark ettin, müşteri henüz bilmiyor." | Müşteriye söyleyip ücretsiz düzeltirim de | Bir dahakine dikkat ederim de | Sessiz kalacağını söyle',
    '"Çırağa işi nasıl öğretirsin?" | Önce gösterip sonra gözetimde yaptırırım de | "İzleyerek öğrenir" de | "Kimse bana öğretmedi" de',
    '"Aletlerinin bakımını nasıl yaparsın?" | Her işten sonra temizleyip düzenli kontrol ederim de | Bozulunca yenisini alırım de | "Alet alet işte" de',
    '"Sana en zor gelen iş hangisiydi?" | Zor bir arızayı adım adım nasıl çözdüğünü anlat | "Hepsi kolay" de | Zor işleri başkasına bıraktığını söyle',
  ] },
  is_ciftci: { mid: [
    '"Kuraklık uyarısı var; sulamayı nasıl planlarsın?" | Damla sulama ve sabah erken sulamayla suyu verimli kullanırım de | Her zamanki gibi sularım de | "Yağmur yağar" de',
    '"Ürünün hastalandı, ne yaparsın?" | Uzmana danışıp doğru ilacı doğru dozda kullanırım de | Komşunun ilacını denerim de | En güçlü ilacı bolca sıkarım de',
    '"Hasat fiyatları düştü." | Depolama, kooperatif ya da doğrudan satış seçeneklerini değerlendiririm de | Ne verirlerse satarım de | Ürünü tarlada çürümeye bırakırım de',
    '"Yeni bir ürün denemek ister misin?" | Küçük bir parselde deneyip sonucu ölçerim de | "Babamdan gördüğüm yeter" de | Bütün tarlayı bir anda değiştiririm de',
    '"Hayvanların bakımında neye dikkat edersin?" | Temiz su, aşı takvimi ve düzenli veteriner kontrolü de | Yem verdiğini söyle | "Hayvan kendi bakar" de',
    '"Toprağın verimi düşüyor." | Nöbetleşe ekim ve toprak analizi yaparım de | Daha çok gübre atarım de | "Toprak toprak işte" de',
  ] },
  is_tuccar: { mid: [
    '"Bir tedarikçi fiyatı birden %30 artırdı." | Alternatifleri araştırıp pazarlık ederim, maliyeti analiz ederim de | Kabul ederim de | Müşteriye hemen iki katına satarım de',
    '"Kârlılığı nasıl ölçersiniz?" | Gelir, maliyet ve nakit akışını düzenli takip ederim de | "Kasada para varsa iyiyiz" de | "Muhasebeci bilir" de',
    '"Kötü yorum alan bir ürününüz var." | Geri bildirimi inceleyip ürünü ya da hizmeti düzeltirim de | Yorumları görmezden gelirim de | Sahte iyi yorum yazdırırım de',
    '"Stok fazlası elinizde kaldı." | Kampanya ya da paket satışla eritip bir dahaki siparişi ayarlarım de | Beklerim de | Zararına hepsini atarım de',
    '"Bir müşteri borcunu ödemiyor." | Nazikçe hatırlatıp ödeme planı öneririm, sonra yasal yola başvururum de | Unuturum de | Kapısına dayanırım de',
    '"Riskli ama çok kârlı bir iş teklifi geldi." | Riskini hesaplayıp küçük başlarım de | Hepsini yatırırım de | Düşünmeden reddederim de',
  ] },
  is_bankaci: { mid: [
    '"Müşteri kredi istiyor ama geliri yetersiz." | Kurallara göre açıklayıp uygun bir alternatif öneririm de | Belgeleri biraz düzeltiriz de | "Olmaz" deyip gönderirim de',
    '"Şüpheli bir para hareketi gördünüz." | Prosedüre göre uyum birimine bildiririm de | Müşteriye sorarım de | Görmezden gelirim de',
    '"Yaşlı bir müşteriye yüksek riskli ürün satmanız istense?" | Risk profiline uygun ürünü öneririm de | Hedef için satarım de | Riskleri anlatmadan satarım de',
    '"Faizler yükselirse mevduat ve kredi nasıl etkilenir?" | Mevduat getirisi artar, kredi pahalanır, talep düşer de | "Bir şey değişmez" de | "Kredi ucuzlar" de',
  ] },
  is_genel: { mid: [
    '"Müşteri ya da vatandaş kuyruğu çok uzun, herkes sinirli." | Sakin kalıp işleri önceliklendirir, bilgilendirme yaparım de | Hızlanmaya çalışırım de | Molaya çıkarım de',
    '"Kurallara uymayan bir iş arkadaşı görürseniz?" | Önce onunla konuşur, devam ederse yöneticiye bildiririm de | Görmezden gelirim de | Herkese anlatırım de',
    '"Rutin işlerde motivasyonunuzu nasıl korursunuz?" | Küçük hedefler koyar, işi iyileştirmenin yollarını ararım de | "Maaş için" de | "Korumam" de',
    '"Vardiya değişikliği istense?" | Esnek olabileceğimi ve planlama için erken haber istediğimi söylerim de | İsteksizce kabul ederim de | Kesinlikle kabul etmem de',
    '"Yeni bir sistem geldi, herkes zorlanıyor." | Önce ben öğrenip arkadaşlarıma yardım ederim de | Eskisi gibi devam ederim de | Sistemi şikâyet ederim de',
    '"İşte sizi en çok ne mutlu eder?" | İşin iyi bittiğini ve insanların memnun kaldığını görmek de | "Paydos saati" de | "Hiçbir şey" de',
  ] },
  is_ogretmen: { mid: [
    '"Sınıfta dersi sürekli bölen bir öğrenci var." | Nedenini anlamak için birebir konuşup velisiyle iş birliği yaparım de | Arka sıraya oturturum de | Sınıftan atarım de',
    '"Farklı hızlarda öğrenen öğrencilere nasıl ders anlatırsınız?" | Seviyeye göre farklı etkinlikler ve ek destek veririm de | Ortalamaya göre anlatırım de | Hızlı olanlara odaklanırım de',
    '"Sınavda kopya çeken bir öğrenci yakaladınız." | Sakince kâğıdını alıp kurala göre işlem yapar, sonra konuşurum de | Görmezden gelirim de | Sınıfın önünde azarlarım de',
    '"Dijital araçları derste kullanır mısınız?" | Amaca uygun, kısa ve etkileşimli şekilde kullanırım de | Sadece video açarım de | "Tahta yeter" de',
  ] },
  is_polis: { mid: [
    '"Gergin bir kavgaya ilk siz ulaştınız." | Güvenliği sağlayıp tarafları ayırır, sakin bir dille konuşurum de | Bağırarak müdahale ederim de | Destek gelene kadar izlerim de',
    '"Bir tanıdığınız trafik cezasını silmenizi istiyor." | Kibarca reddedip kuralları anlatırım de | Bu seferlik olur de | Karşılığında bir şey isterim de',
    '"Kayıp bir çocuğun ailesiyle konuşuyorsunuz." | Sakin ve umut veren bir dille bilgi toplarım de | Formu hızlıca doldururum de | "Bulunur herhalde" de',
    '"Delil toplarken nelere dikkat edersiniz?" | Olay yerini korur, kayıt altına alır, zinciri bozmam de | Bulduğumu cebime koyarım de | Fotoğraf gereksiz de',
  ] },
  is_avukat: { mid: [
    '"Müvekkiliniz size yalan söylediyse?" | Gerçeği öğrenip hukuk ve etik sınırlar içinde savunurum de | Fark etmez de | Yalana ortak olurum de',
    '"Duruşmadan bir gün önce yeni bir delil çıktı." | Dosyayı inceleyip gerekirse erteleme talep ederim de | Eskisi gibi giderim de | Delili saklarım de',
    '"Karmaşık bir hukuki durumu müvekkile nasıl anlatırsınız?" | Sade bir dille, seçenekleri ve riskleriyle anlatırım de | Kanun maddesini okurum de | "Siz karışmayın" de',
    '"Kazanamayacağınız bir dava gelirse?" | Dürüstçe şansını anlatıp uzlaşma seçeneklerini sunarım de | Yine de alırım de | "Kesin kazanırız" derim de',
  ] },
  is_hemsire: { mid: [
    '"Doktorun yazdığı dozda hata olduğunu düşünüyorsunuz." | Uygulamadan önce doktora kibarca sorarım de | Yazıldığı gibi veririm de | Kendi bildiğim dozu veririm de',
    '"Aynı anda iki hasta zili çaldı." | Kısa bir kontrolle önceliği belirler, ekipten destek isterim de | Yakın olana giderim de | İkisini de beklettiririm de',
    '"Korkmuş bir çocuğa iğne yapacaksınız." | Ona açıklar, dikkatini dağıtır, ailesini yanında tutarım de | Hızlıca yaparım de | "Ağlama" diye kızarım de',
    '"Vardiya devrinde neye dikkat edersiniz?" | Hastaların durumunu, ilaçları ve riskleri eksiksiz aktarırım de | Kısaca özetlerim de | Devri yapmadan çıkarım de',
  ] },
  is_gazeteci: { mid: [
    '"Tek bir kaynaktan çarpıcı bir iddia geldi." | Yayınlamadan önce en az iki kaynaktan doğrularım de | Hemen yayınlarım de | Başlığı abartırım de',
    '"Haberin, reklam verenlerden birini zor durumda bırakıyor." | Doğruysa haberi yayınlar, karşı tarafa söz hakkı veririm de | Haberi yumuşatırım de | Haberi çöpe atarım de',
    '"Röportaj yaptığınız kişi soruyu geçiştiriyor." | Soruyu nazik ama net şekilde yeniden sorarım de | Geçerim de | Tartışma çıkarırım de',
    '"Kaynağınızın adını açıklamanız istense?" | Kaynağın gizliliğini korurum de | Duruma göre açıklarım de | Hemen açıklarım de',
  ] },
  is_psikolog: { mid: [
    '"Danışanınız seanslarda hiç konuşmuyor." | Güvenli bir ortam kurup onun hızına saygı gösteririm de | Sorular yağdırırım de | Seansı erken bitiririm de',
    '"Danışanın kendine zarar verme riski var." | Güvenlik planı yapar, gerekirse ilgili birimlere yönlendiririm de | Bir dahaki seansa bırakırım de | Görmezden gelirim de',
    '"Bir danışanla sosyal ortamda karşılaşırsanız?" | Gizliliği korur, onun selamlamasını beklerim de | Adıyla seslenirim de | Seanslardan bahsederim de',
    '"Kendi ruh sağlığınızı nasıl korursunuz?" | Süpervizyon alır, sınırlarımı korur, dinlenirim de | "Ben güçlüyüm" de | "Korumaya gerek yok" de',
  ] },
  is_muzisyen: { mid: [
    '"Sahnede ekipman bozuldu." | Sakin kalıp akustik bir parçayla seyirciyi tutarım de | Çalmayı keserim de | Ses teknisyenine bağırırım de',
    '"Grupla müzikal bir fikir ayrılığı var." | Birlikte deneyip en iyi sonucu dinleyerek seçeriz de | Kendi fikrimi zorlarım de | Gruptan çıkarım de',
    '"Telif hakları neden önemli?" | Emeğin karşılığını korur, adil kazanç sağlar de | "Pek bilmiyorum" de | "Müzik herkesindir, önemsiz" de',
    '"Konser için az seyirci geldi." | Onlar için en iyi performansımı veririm de | Kısa keserim de | Seyirciye sitem ederim de',
  ] },
  sinif: {
    open: [
      'Sınıf seni dinliyor. Nasıl başlarsın? | Sınıfa sorarak başla: "Bu yıl neyi değiştirmek istersiniz?" | Hazırladığın listeyi okumaya başla | Kendini överek başla',
      'Sınıfa girer girmez biri ıslık çaldı, herkes güldü. | Gülümseyip esprili bir cümleyle konuya gir | Gülmelerin bitmesini bekle | Islık çalanı öğretmene şikâyet et',
      'Öğretmen sana 3 dakika verdi. | En önemli üç sözünü net şekilde söyle | Aklına geleni anlat | Süreyi aşarak uzun konuş',
    ],
    mid: [
      'Arka sıralar sıkılmaya başladı, fısıldaşıyorlar. | Onlara doğrudan soru yönelt, fikirlerini iste | Konuyu kısa kes | Sesini yükselt ve devam et',
      'Biri "Sen seçilince ne değişecek ki?" diye soruyor. | Somut bir söz ver: "İlk ay sınıf kütüphanesi kuracağım." | Genel iyi niyetini anlat | Diğer adayı eleştir',
      'Rakip aday "Hep kendi arkadaşlarını kayırırsın" dedi. | Sakince herkes için yaptığın bir işi örnek ver | Cevap vermeden geç | Onun da kusurlarını say',
      'Biri kantin fiyatlarını soruyor. | Okul yönetimiyle konuşup sonucu paylaşacağını söyle | "Bakarız" de | Fiyatları düşüreceğine dair imkânsız söz ver',
      'Sınıfın sessiz öğrencisi çekinerek el kaldırdı. | Ona söz verip fikrini takdir et | Kısa cevap verip geç | Görmezden gel',
    ],
    close: [
      'Kapanış zamanı. | Kısa ve akılda kalıcı bir cümleyle bitir | Herkese teşekkür edip bitir | "Oy vermezseniz pişman olursunuz" de',
      'Zil çalmak üzere. | Tek cümleyle vaadini tekrarla ve teşekkür et | Hızlıca "Bana oy verin" de | Zil çalsa da konuşmaya devam et',
      'Sınıf alkışlamaya başladı. | Teşekkür edip rakibine de iyi şanslar dile | Selam verip otur | Seçimi kazandığını ilan et',
    ],
  },
  barisma: {
    open: [
      'İki taraf da birbirine kırgın. | İkisini ayrı ayrı sakince dinle | "Geçmişi unutun" de | Kimin haklı olduğunu hemen söyle',
      'İki arkadaşın aynı masaya oturmak istemiyor. | Önce kısa, tarafsız bir sohbet için ikna et | Zorla oturt | Birini diğerinin yanında eleştir',
      'Komşular otopark yüzünden kavga ediyor. | Herkesin derdini sırayla anlatmasını iste | "Kendi aranızda çözün" de | Birinin arabasını suçla',
    ],
    mid: [
      'Biri sesini yükseltiyor. | Sakin bir tonla ne hissettiğini anladığını söyle | Konuyu değiştir | Sen de sesini yükselt',
      'Ortak nokta arıyorsun. | İkisinin de değer verdiği bir anıyı hatırlat | Küçük bir öneri sun | Bir tarafı tut',
      'Taraflardan biri "O önce özür dilesin" diyor. | İkisinin de üzüldüğü bir şeyi kabul etmesini öner | Özrü diğerinden iste | "Çocuk gibisiniz" de',
      'Yanlış anlaşılma olduğu ortaya çıktı. | Olayı birlikte baştan, adım adım konuşun | "Neyse, olmuş bir kere" de | Yanlış anlayanı suçla',
      'Biri ağlamaya başladı. | Mola verip ona su getir, sonra devam et | Konuşmaya devam et | "Abartıyorsun" de',
    ],
    close: [
      'Anlaşmaya çok yakınsınız. | Somut bir adım öner: "Pazar günü birlikte yemek yiyelim." | Zamana bırakmayı öner | Zorla el sıkıştır',
      'İkisi de sessizleşti, bakışlar yumuşadı. | Her birine bu adım için teşekkür et | Sessizce çık | "Gördünüz mü, ben haklıydım" de',
      'Barışma sözü verildi. | Bir hafta sonra birlikte bir şey yapmayı teklif et | "Tamam o zaman" de | Eski kavgayı hatırlatıp şaka yap',
    ],
  },
  sunum: {
    open: [
      'Dinleyiciler şüpheci görünüyor. | Onların yaşadığı sorunla başla | Rakamları hızla sırala | "Bana güvenin" de',
      'Projektör çalışmadı. | Slaytsız, hikâyeyle başla | Teknisyeni bekle | Organizasyonu suçla',
      'İlk sırada yöneticiler oturuyor, saatlerine bakıyorlar. | "Size 10 dakikada üç şey söyleyeceğim" diye başla | Hazırladığın uzun girişi oku | Süreyi uzatmalarını iste',
    ],
    mid: [
      'Biri "Bu riskli değil mi?" diye soruyor. | Riski dürüstçe kabul et, önlemleri anlat | Soruyu sonraya bırak | "Hiç risk yok" de',
      'İlgi artıyor. | Gerçek bir başarı hikâyesi anlat | Detaylı bir tablo göster | Abartılı vaatlerde bulun',
      'Biri maliyeti soruyor. | Maliyeti ve geri dönüş süresini açıkça göster | "Detaylar ekte" de | Rakamı düşük göster',
      'Cevabını bilmediğin bir soru geldi. | Bilmediğini söyle, öğrenip dönmeyi teklif et | Genel bir cevap ver | Uydur',
      'Salondaki biri rakip ürünü övüyor. | Farkını tek cümleyle, saygılı şekilde anlat | Duymamış gibi yap | Rakibi kötüle',
    ],
    close: [
      'Karar zamanı. | Net ve kolay bir sonraki adım öner | "Düşünün, haber verin" de | Hemen karar vermeleri için baskı yap',
      'Süren bitiyor. | Ana fikri tek cümleyle özetle | Son slaytı hızla okut | Süreyi aşıp devam et',
      'Alkış geldi ama kimse bir şey söylemiyor. | Soru sorarak ilk küçük adımı birlikte belirle | Teşekkür edip çık | "Almayan kaybeder" de',
    ],
  },
  ders: {
    open: [
      'Ders başladı; öğrenciler uykulu. | Merak uyandıran bir soru ya da deneyle başla | Doğrudan tahtaya yazmaya başla | "Sessiz olun!" diye bağır',
      'Pazartesi ilk ders, sınıf gürültülü. | Sakin bekleyip göz teması kur, sonra başla | Ders anlatmaya başla | Tüm sınıfa ceza ver',
      'Müfettiş derse girdi. | Her zamanki gibi etkileşimli dersine devam et | Aşırı resmî bir anlatıma geç | Öğrencilere susmalarını tembihle',
    ],
    mid: [
      'Bir öğrenci konuyu anlamadı. | Farklı bir örnekle yeniden anlat | Aynı anlatımı tekrarla | "Sonra bakarız" de',
      'İki öğrenci tartışıyor. | İkisini de dinle, sınıf kuralını hatırlat | Görmezden gel | İkisini de dışarı çıkar',
      'Bir öğrenci yanlış cevap verdi, sınıf güldü. | Cevaptaki doğru kısmı takdir edip sınıfı sakinleştir | Doğru cevabı söyle ve geç | Sen de gül',
      'Bir öğrenci "Bu bizim ne işimize yarayacak?" diye soruyor. | Günlük hayattan bir örnekle bağla | "Sınavda çıkacak" de | "Sorgulama" de',
      'Sınıfın yarısı ödevi yapmamış. | Nedenini sorup ödevi derste birlikte başlat | Not düşür | Tüm sınıfı azarla',
    ],
    close: [
      'Ders bitiyor. | Kısa bir özet yap, merak uyandıran bir ödev ver | Ödevi hızlıca söyle | Zil çalınca hiçbir şey demeden çık',
      'Son 5 dakika kaldı. | Hızlı bir soru-cevap oyunu yap | Serbest bırak | Yeni bir konuya başla',
      'Bir öğrenci ders sonunda yanına geldi. | Onu dinle, gerekirse ek zaman ayır | "Sonra" de | "Derste sorsaydın" de',
    ],
  },
  musteri: {
    open: [
      'Müşteri bozuk çıkan ürünle geldi, sesi yüksek. | Sakince dinle, yaşadığı sıkıntı için özür dile | Fişini sor | "Bizim suçumuz değil" de',
      'Telefonda öfkeli bir müşteri var. | Adını söyleyip dinlediğini belirt, notlar al | Bekletmeye al | Telefonu kapat',
      'Müşteri siparişinin yanlış geldiğini söylüyor. | Hatayı kabul edip hemen doğrusunu hazırla | Siparişi kontrol etmeye başla | "Siz öyle istediniz" de',
    ],
    mid: [
      '"Üç gündür uğraşıyorum!" diye bağırıyor. | Zaman kaybını kabul et, hemen çözüm sunacağını söyle | Sıranın arkasında başka müşteri olduğunu hatırlat | Sen de sesini yükselt',
      'Değişim mi iade mi istediğini soruyorsun. | İki seçeneği net anlat, kararı ona bırak | Sadece değişim yapabileceğini söyle | Yöneticinin gelmesini beklemesini söyle',
      'Müşteri indirim istiyor. | Yetkin dahilindeki makul bir jesti sun | "Yapamam" de | Fiyatı kafana göre yarıya indir',
      'Müşteri kuralı bilmediğini söylüyor. | Kuralı nazikçe açıkla ve istisna yapılabilir mi bak | "Tabelada yazıyor" de | "Okuma bilmiyor musunuz?" de',
      'Müşteri başka bir çalışanı şikâyet ediyor. | Dinle, not al ve konuyu yöneticiye ileteceğini söyle | Arkadaşını savun | Arkadaşını müşterinin önünde azarla',
    ],
    close: [
      'Müşteri biraz yumuşadı. | Küçük bir jest (indirim kuponu) sunup teşekkür et | İşlemi bitirip sıradakine geç | "Bir dahakine dikkat edin" de',
      'Sorun çözüldü. | Tekrar yaşarsa doğrudan sana ulaşabileceğini söyle | "Başka bir şey?" de | Oflayarak işlemi kapat',
      'Müşteri teşekkür ediyor. | Anlayışı için teşekkür et, iyi günler dile | Başını salla | "Bağırmasaydınız daha hızlı olurdu" de',
    ],
  },
  hasta: {
    open: [
      'Tahlil sonuçları geldi, hasta endişeli. | Oturup göz teması kurarak sakin bir girişle başla | Ayakta hızla sonuçları oku | Tıbbi terimlerle konuya gir',
      'Hasta yakınlarıyla birlikte odaya girdi. | Hastaya kimin yanında konuşmak istediğini sor | Herkese birden anlat | Yakınları dışarı çıkar',
      'Hasta haberi duymaktan korkuyor. | Ne kadarını bilmek istediğini sor | Hemen sonucu söyle | "Korkulacak bir şey yok" de',
    ],
    mid: [
      '"Ciddi bir şey mi doktor?" diye soruyor. | Durumu dürüst ama anlaşılır bir dille açıkla | "Merak etmeyin, bir şey yok" de | Soruyu geçiştir',
      'Hasta ağlamaya başladı. | Bekle, duygusuna alan tanı, peçete uzat | Tedaviyi anlatmaya devam et | "Ağlamanın faydası yok" de',
      '"İnternette okudum, ben ölecek miyim?" | Kaynağı sakince düzelt, kendi durumunu anlat | "İnternete bakmayın" de | Konuyu değiştir',
      'Hasta ikinci bir görüş almak istiyor. | Bunun hakkı olduğunu söyle, dosyasını hazırla | Gücen | "Başka doktor da aynısını der" de',
      'Hasta tedavi masrafından endişeli. | Sigorta ve destek seçenekleri için yönlendir | "O benim işim değil" de | En pahalı tedaviyi öner',
    ],
    close: [
      'Tedavi planını konuşma vakti. | Adımları sırala, sorularını sor, yazılı bilgi ver | Reçeteyi verip kontrole çağır | "İnternetten okursunuz" de',
      'Görüşme bitiyor. | Ne zaman ve nasıl ulaşabileceğini söyle | "Geçmiş olsun" deyip çık | Kapıya yürürken konuşmayı bitir',
      'Hasta biraz sakinleşti. | Umut veren gerçekçi bir cümle kur, bir sonraki adımı belirle | Dosyayı kapat | "Kader" de',
    ],
  },
  veli: {
    open: [
      'Veli çocuğunun notlarından şikâyetçi. | Önce çocuğun güçlü yanlarından bahset | Not çizelgesini gösterip bekle | "Çocuğunuz tembel" de',
      'Veli görüşmeye geç kaldı ve gergin. | Anlayışla karşıla, kalan süreyi iyi kullanmayı öner | Süreyi hatırlat | Başka güne erteleyip gönder',
      'Veli çocuğun arkadaşlarıyla ilgili endişeli. | Gözlemlerini somut örneklerle paylaş | "Bir şey görmedim" de | Diğer çocukları suçla',
    ],
    mid: [
      '"Öğretmen bizim çocuğa haksızlık ediyor" diyor. | Endişesini anladığını söyle, somut örnekleri birlikte incele | Konuyu değiştir | Savunmaya geçip tartış',
      'Evde ne yapabileceklerini soruyor. | Günlük 30 dakikalık düzenli çalışma planı öner | "Daha çok çalışsın" de | "Özel ders aldırın" de',
      'Veli çocuğun telefona çok vakit harcadığını söylüyor. | Birlikte uygulanabilir kurallar öner | "Bizim zamanımızda yoktu" de | "Benim sorunum değil" de',
      'Veli ağlamaklı: evde zor bir dönemdeler. | Anlayış göster, okul rehber servisine yönlendir | Notlara dön | "Çocuğa yansıtmayın" diye nasihat et',
      'Veli çocuğun sınıf değiştirmesini istiyor. | Nedenlerini dinleyip önce birlikte çözüm denemeyi öner | Hemen kabul et | Kesinlikle reddet',
    ],
    close: [
      'Görüşme bitiyor. | Bir ay sonra tekrar görüşmek için tarih ver | Teşekkür edip uğurla | Saatine bakıp kalk',
      'Veli ikna olmuş görünüyor. | Birlikte kararlaştırdığınız iki adımı özetle | "Tamamdır" de | "Başta söyledim ya" de',
      'Veli teşekkür ediyor. | Çocuğun gelişimini birlikte izleyeceğinizi söyle | Başını salla | Bir sonraki veliyi içeri çağır',
    ],
  },
  basin: {
    open: [
      'Kameralar açık, ilk soru sert geliyor. | Soruyu kısa ve net cevapla | Hazırladığın metni okumaya başla | "Bu soruya cevap vermeyeceğim" de',
      'Salon tıklım tıklım, flaşlar patlıyor. | Sakin bir açılış cümlesiyle ana mesajını ver | Mikrofonu test et, bekle | Gazetecilerin sessiz olmasını iste',
      'Toplantı gecikmeli başladı. | Gecikme için kısaca özür dileyip başla | Hiçbir şey demeden başla | Gecikmeyi organizasyona yükle',
    ],
    mid: [
      'Bir muhabir yanlış bir bilgiyi tekrarlıyor. | Kibarca düzelt, doğru veriyi paylaş | Görmezden gel | Muhabiri azarla',
      'Hata yapıp yapmadığınız soruluyor. | Hatayı kabul et ve alınan önlemleri anlat | Suçu başka birime at | "Hata yok" diye ısrar et',
      'Özel hayatınla ilgili bir soru geldi. | Kibarca konunun dışında olduğunu söyle, ana konuya dön | Uzun uzun cevap ver | Sinirlenip salonu terk et',
      'Aynı soru üçüncü kez soruluyor. | Sabırla aynı net cevabı tekrarla | "Cevap verdim" de | Alay et',
      'Bir muhabir gizli bir belgeyi gösteriyor. | İnceleyip açıklama yapacağınızı söyle | Belgenin sahte olduğunu iddia et | Belgeyi elinden al',
    ],
    close: [
      'Son soru. | Ana mesajını tek cümleyle tekrarla | "Teşekkürler" deyip çık | Soruyu duymamış gibi yap',
      'Toplantı süresi doldu. | Yazılı açıklama paylaşacağını söyle ve teşekkür et | Aniden kalk | Süreyi aşıp tartışmaya devam et',
      'Gazeteciler kalkıyor. | Sorulara açık olduğunu hatırlat | Hızla arka kapıdan çık | "Yazdıklarınıza dikkat edin" de',
    ],
  },
  kriz: {
    open: [
      'Büyük bir sipariş iptal oldu, ekip panikte. | Sakin kal, önce durumu netleştir | Hemen suçluyu sor | Toplantıyı erteleyip düşün',
      'Sunucular çöktü, müşteriler arıyor. | Herkese rol ver: biri çözüm, biri iletişim | Hep birlikte sorunu çözmeye çalışın | Müşterileri bekletin, açıklama yapmayın',
      'Depoda yangın alarmı çaldı, üretim durdu. | Önce herkesin güvende olduğunu doğrula | Üretimi kurtarmaya odaklan | Alarmın yanlış olduğunu varsay',
    ],
    mid: [
      'Herkes aynı anda konuşuyor. | Söz sırası ver, herkesi kısaca dinle | En kıdemliyi dinle | Masaya vurup sustur',
      'İki çözüm önerisi var, ikisi de riskli. | Artı-eksileri yaz, verilerle karar ver | Yazı tura at | Hiçbirini seçme, bekle',
      'Bir ekip üyesi hatanın kendisinden kaynaklandığını itiraf etti. | Dürüstlüğü için teşekkür edip çözüme odaklan | Sessiz kal | Herkesin önünde azarla',
      'Basın aramaya başladı. | Tek bir sözcü belirleyip doğru bilgi ver | "Yorum yok" de | Herkes istediğini söylesin',
      'Bütçe yetmiyor. | Öncelikleri sıralayıp ek kaynak için yönetime net talep sun | Başka projelerden gizlice al | Harcamaya devam et',
    ],
    close: [
      'Karar verildi. | Görev dağılımı yap, takip tarihi koy | Herkese "halledin" de | Toplantıyı bitir, e-postayla bildiririm de',
      'Kriz atlatıldı. | Ekibe teşekkür edip ne öğrendiğinizi yazın | Hemen işlere dönün | Suçluyu arayın',
      'Ekip çok yorgun. | Kısa bir mola ve nöbet planı yap | Devam edin | "Bu işin doğası bu" de',
    ],
  },
};
const EN = {
  tanisma: {
    open: [
      'You made eye contact with the person next to you at a café. | Smile and make a light comment about the place | Say hi and go back to your phone | Immediately start talking about yourself',
      'You were introduced at a friend\'s birthday party. | Ask how they know your mutual friend | Say "Nice to meet you" and walk away | Complain that the party is boring',
      'You both reached for the same book at the library. | Laugh, hand them the book and ask why they chose it | Take the book and go back to your desk | Say "I saw it first"',
      'At the gym they\'re on the machine next to you and smile at you. | Say a quick hi and ask something without interrupting their workout | Nod hello | Start explaining how they should train',
      'Rain pours down at the bus stop and only you have an umbrella. | Politely offer to share your umbrella | Ignore them | Close your umbrella and step under theirs',
      'At a concert the person next to you is singing along. | Say you love the song and ask for their favourite track | Watch the concert quietly | Correct their lyrics',
      'You end up at the same table at a work training. | Introduce yourself and ask what they think of the training | Focus on taking notes | Mock the trainer sarcastically',
      'Someone\'s dog runs up to you in the park. | Pet the dog and ask its name and breed | Push the dog away | Grumble "Control your dog"',
      'You\'re seated at the same table at a wedding. | Ask how they know the bride or groom | Focus on your food | Comment on everyone at the table one by one',
      'You\'re in the same group at a volunteer clean-up. | Offer to help and ask why they volunteered | Mind your own work | Complain about being tired',
      'A friend set you up; you\'re meeting face to face for the first time. | Start with a relaxed hello and ask about their day | Stare at the menu in silence | Complain that they were late',
      'In a course, the person next to you drops their pen. | Hand it back and ask why they joined the course | Hand it back and turn away | Tease them for being clumsy',
    ],
    mid: [
      'You notice the book in their hands. | Ask about the book with curiosity | List the books you\'ve read | Joke that "reading is boring"',
      'The conversation deepens; now they ask you something. | Answer honestly and warmly | Brush it off briefly | Try to seem like someone you\'re not',
      'They ask, "What do you do?" | Describe your job or school and what you love about it | Just state your title | Brag about your salary',
      'They ask, "What do you do in your free time?" | Talk excitedly about a hobby and ask about theirs | Say "Not much" | Look down on their hobbies',
      'They mention a show they love; you haven\'t seen it. | Admit it and ask why they love it | Pretend you\'ve seen it | Say "TV shows are a waste of time"',
      'They tell a warm story about their family. | Listen closely and share a memory of your own | Nod and change the subject | Start praising your own family',
      'They ask about your dreams for the future. | Share a realistic but exciting dream | Say "Dunno, we\'ll see" | Describe an exaggerated dream of getting rich',
      'It turns out they see something differently than you. | Be curious about their view and share yours respectfully | Agree with them right away | Try to win the argument',
      'A clumsy moment: you spilled your drink on yourself. | Laugh at yourself and keep it light | Go quiet with embarrassment | Blame the waiter',
      'Your phone keeps ringing. | Silence it: "If it\'s not important, I\'ll check later" | Answer and keep it short | Answer and talk for ages',
      'They say they love travelling. | Ask about their favourite place and why | List the places you\'ve been | Say "Home is the best place" and close the topic',
      'You ask their favourite food; it\'s yours too. | Celebrate with a joke and suggest a good spot | Say "Nice" and move on | Say "Everyone likes that"',
      'They briefly mention a past relationship. | Listen without judging and gently move on | Change the subject immediately | Dig for details',
      'You talk about music taste. | Recommend a song to each other | Just name the genre you like | Make fun of their music taste',
      'They ask if you have a pet. | Share a cute story, or say what you\'d like to have | Say "No" and go quiet | Say "I don\'t like animals"',
      'There\'s a moment of silence. | Ask a relaxed question about something around you | Check your phone | Talk fast and nervously',
      'They make a joke to make you laugh. | Laugh genuinely and add a light joke of your own | Smile politely | Ask them to explain the joke',
      'They talk about a charity they volunteer for. | Ask what they do and say you\'d like to join | Say "Nice" | Say "That stuff is pointless"',
      'They ask which city you grew up in. | Share a short, colourful childhood memory | Just name the city | Trash-talk where you grew up',
      'They complain about a stressful work week. | Say you understand and ask what helps them relax | Say "Everyone gets tired" | Lecture them on solutions right away',
    ],
    close: [
      'Time to go. | Politely suggest meeting again | Just say "Have a nice day" | Insist on getting their number',
      'The bill arrives. | Kindly offer to split it or to pay this time | Quietly pay your share | Leave the bill to them',
      'They smile at you as you say goodbye. | Say you had a great time and suggest a next meeting | Wave and leave | Say "I guess you\'ll call me"',
      'The concert/event is ending. | Suggest going to the next event together | Say "See you" | Ask for their address to follow them',
      'The rain stopped; your paths split. | Give your number: "I\'d be happy if you texted" | Say "Take care" | Insist "Don\'t forget me"',
      'Their friends are calling them. | Say "I\'ve kept you — shall we continue later?" | Wish them a good time | Invite yourself to their friends',
      'The chat went great, but it\'s late. | Wish them a safe trip home and offer to text tomorrow | Say "Good night" | Insist they stay a bit longer',
      'You found a shared interest. | Offer to find an event on it and invite them | Say "Maybe someday" | Push a plan for tomorrow',
    ],
  },
  mulakat: {
    open: [
      '"Could you tell us about yourself?" | Describe your relevant experience briefly and clearly | Tell your life story from childhood | Say "It\'s in my CV"',
      'You arrived 5 minutes early; the receptionist makes you wait. | Wait calmly and review your notes | Play games on your phone | Complain about how long it\'ll take',
      'The interviewer offers a hand: "Welcome." | Make eye contact, shake warmly and thank them | Nod hello | Ask about the salary at once',
      '"Where did you see the job ad?" | Say where, and what drew you to it | Say "Online" | Say "I apply everywhere anyway"',
      '"There\'s a one-year gap in your CV. What did you do?" | Explain honestly and what you learned then | Dodge the question | Make up a job',
      '"Briefly, why are you here?" | Say in one sentence what you can contribute | Say "I need a job" | Joke that "a friend forced me"',
    ],
    mid: [
      '"Why this company?" | Give a concrete reason that shows you researched it | Say "I want to advance my career" | Say "You pay well"',
      '"How did you handle a difficult situation?" | Describe the situation, your actions and the result | Say you\'re generally hard-working | Say "I\'ve never had difficulties"',
      '"What is your biggest weakness?" | Name a real weakness and how you\'re improving it | Say "I\'m a perfectionist" | Say "I have no weaknesses"',
      '"Where do you see yourself in five years?" | Growing in this role and taking on responsibility | Say "I don\'t know" | Say "In your chair"',
      '"Imagine you disagree with a teammate." | Explain with an example how you listen first and seek a shared solution | Say "I\'d tell the manager" | Say "I\'m usually right"',
      '"How do you work under pressure?" | Give a real example of how you prioritised | Say "I love pressure" | Say "I can\'t work under pressure"',
      '"Tell us about a time you made a mistake." | Describe the mistake, how you fixed it and what you learned | Downplay a small mistake | Blame someone else',
      '"What are your salary expectations?" | Give a reasonable range that shows market research | Say "Whatever you offer" | Ask for twice the market rate',
      '"Why did you leave your previous job?" | Describe seeking growth in positive terms | Say "I got bored" | Badmouth your old boss',
      '"What sets you apart from other candidates?" | Answer with a concrete skill and achievement | Say "I\'m very hard-working" | Say "I don\'t know them, but nobody beats me"',
      '"What would you do if three urgent tasks came at once?" | Rank them by impact and deadline, and share with the team | Say "I\'d do them all at once" | Say "I\'d drop one"',
      '"An example of learning something new quickly?" | Explain how you learned it and the outcome | Say "I learn fast" and move on | Say "I don\'t like learning"',
    ],
    close: [
      '"Do you have any questions for us?" | Ask about the team and growth opportunities | Ask "When can I take vacation?" | Say "No"',
      'The interview is ending; the interviewer stands up. | Thank them for their time and ask about next steps | Leave silently | Say "You\'ll hire me, right?"',
      '"When could you start?" | Give a clear, realistic date | Say "I don\'t know" | Say "Tomorrow — but first a month off"',
      '"Anything you\'d like to add?" | Sum up briefly and sincerely why you want this job | Say "No, thanks" | Repeat the same things at length',
      '"Can you provide references?" | Give your former manager\'s contact details | Give a friend\'s name | Say "References aren\'t needed"',
      '"We\'ll call you." | Thank them and politely say you\'ll expect news within a week | Say "OK" | Say "If you don\'t, I\'ll call you — every day"',
    ],
  },
  is_doktor: { mid: [
    'The chief physician asks: "If three patients reach the ER at once, who comes first?" | Explain you\'d triage by life-threatening risk | Say you\'d go in order of arrival | Say you\'d pick the most familiar face',
    '"What do you do if a patient refuses treatment?" | Explain the risks clearly and respect their decision | Say you\'d try to convince the family | Say you\'d treat them by force',
    '"What if you realised you\'d made a medical error?" | Report it at once, inform the patient and fix it | Hint you\'d stay silent if nobody noticed | Say you\'d blame the nurse',
    '"An emergency comes in when you\'re exhausted after a night shift?" | Ask the team for support and share the case for safety | Say "I\'ll have coffee and carry on" | Say you\'d refuse the case',
    '"Which specialty are you considering, and why?" | Explain your interest with a concrete patient story | Say "Whichever pays most" | Say "I haven\'t thought about it"',
    '"A patient\'s relative is shouting at you." | Say you\'d calmly hear their worry and explain the situation | Say you\'d call security | Say you\'d raise your voice too',
  ] },
  is_muhendis: { mid: [
    '"A project will miss its deadline; what do you do?" | Prioritise the scope and talk to the client early | Say you\'d catch up with overtime | Say you\'d skip the tests',
    '"You found a security flaw in your design that nobody noticed." | Report it immediately with a fix plan | Say you\'d look at it next release | Hint you wouldn\'t tell anyone',
    '"What technical work are you proudest of?" | Describe the problem, your solution and a measurable result | List the tools you used | Say "It was all great"',
    '"How would you test a system?" | Explain edge cases, load tests and automation | Say "I\'d see if it works" | Say "Testing isn\'t my job"',
    '"What if you\'re given work with a technology you don\'t know?" | Describe a fast learning plan and who you\'d consult | Say "I\'ll learn it" and move on | Say you\'d hand it to someone else',
    '"You\'re asked to cut costs, but quality will drop." | Present the options and risks to your manager with data | Say you\'d quietly use cheaper materials | Say you\'d refuse the request',
  ] },
  is_yazilimci: { mid: [
    '"Production went down at night. What do you do?" | Restore service first, then find the root cause and write it up | Say you\'d look in the morning | Blame whoever made the last change',
    '"Your code got harsh criticism in a code review." | Listen, fix what\'s needed and explain your reasoning if necessary | Accept it silently | Say the reviewer didn\'t understand',
    '"Why might this function be slow?" | Measure to find the bottleneck, then optimise | Guess a reason | Say "Computers are slow"',
    '"How do you choose between tech debt and new features?" | Balance it with the team by risk and business impact | Say you\'d always pick new features | Say "Tech debt isn\'t a thing"',
  ] },
  is_futbol: { mid: [
    'The head coach asks: "What will you do if you\'re on the bench?" | Train harder and wait for my chance | Say "I\'ll wait" | Say you\'d complain to the press',
    '"What if the team\'s tactics don\'t suit your style?" | Follow the team plan and bring my strengths to it | Say "I\'ll play my own way" | Say you\'d ask for a transfer',
    '"If you\'re pressured to return early from injury?" | Wait for the medical team\'s approval | Say "I\'ll play on painkillers" | Threaten the club',
    '"Fans are insulting you on social media." | Don\'t reply; show it on the pitch | Say you\'d delete your account | Say you\'d reply to the fans',
    '"If you were made captain, what would you change?" | Support young players and improve communication | Say "Nothing would change" | Say "Everyone follows me"',
    '"A rival agent wants to meet you secretly." | Respect your club and the rules; refer them to your agent | Say you\'d meet secretly | Say you\'d tell the press at once',
  ] },
  is_usta: { mid: [
    'The master asks: "The customer is in a hurry but the part is out of stock?" | Explain openly and offer a safe temporary fix | Say you\'d fit a part that doesn\'t match | Send the customer elsewhere',
    '"Why do you wear safety gear?" | Most accidents come from carelessness; I always wear it | Say "When the boss is watching" | Say "It\'s uncomfortable, I don\'t"',
    '"You realise you did a job wrong; the customer doesn\'t know yet." | Tell the customer and fix it for free | Say you\'ll be careful next time | Say you\'d keep quiet',
    '"How would you teach an apprentice?" | Show first, then let them do it under supervision | Say "They learn by watching" | Say "Nobody taught me"',
    '"How do you maintain your tools?" | Clean them after every job and check them regularly | Say you buy new ones when they break | Say "A tool is a tool"',
    '"What was the hardest job you did?" | Explain how you solved a tough fault step by step | Say "They\'re all easy" | Say you leave hard jobs to others',
  ] },
  is_ciftci: { mid: [
    '"There\'s a drought warning; how will you plan irrigation?" | Use drip irrigation and water early in the morning | Say you\'d water as usual | Say "It\'ll rain"',
    '"Your crop got diseased. What do you do?" | Consult an expert and use the right product at the right dose | Say you\'d try the neighbour\'s spray | Spray the strongest chemical generously',
    '"Harvest prices have dropped." | Consider storage, a co-op or direct sales | Sell for whatever they offer | Leave the crop to rot in the field',
    '"Would you try a new crop?" | Test it on a small plot and measure the results | Say "What I learned from my father is enough" | Switch the whole field at once',
    '"What matters in caring for livestock?" | Clean water, a vaccination schedule and regular vet checks | Say you feed them | Say "Animals look after themselves"',
    '"Your soil\'s fertility is falling." | Rotate crops and test the soil | Say you\'d add more fertiliser | Say "Soil is soil"',
  ] },
  is_tuccar: { mid: [
    '"A supplier suddenly raised prices by 30%." | Research alternatives, negotiate and analyse costs | Say you\'d accept it | Say you\'d double the price for customers',
    '"How do you measure profitability?" | Track revenue, costs and cash flow regularly | Say "If there\'s cash in the till, we\'re fine" | Say "The accountant knows"',
    '"One of your products gets bad reviews." | Study the feedback and improve the product or service | Say you\'d ignore the reviews | Say you\'d buy fake good reviews',
    '"You\'re stuck with excess stock." | Clear it with a promotion or bundle and adjust the next order | Say you\'d wait | Dump it all at a loss',
    '"A customer won\'t pay their debt." | Remind them politely, offer a payment plan, then go legal | Say you\'d forget it | Say you\'d show up at their door',
    '"A risky but very profitable deal comes up." | Calculate the risk and start small | Say you\'d invest everything | Reject it without thinking',
  ] },
  is_bankaci: { mid: [
    '"A customer wants a loan but their income is too low." | Explain the rules and offer a suitable alternative | Say "We\'ll tweak the documents a bit" | Say "No" and send them off',
    '"You notice a suspicious transaction." | Report it to compliance per procedure | Say you\'d ask the customer | Say you\'d ignore it',
    '"You\'re told to sell a high-risk product to an elderly customer?" | Recommend a product that fits their risk profile | Say you\'d sell it to hit the target | Sell it without explaining the risks',
    '"How do rising interest rates affect deposits and loans?" | Deposit returns rise, loans get pricier and demand falls | Say "Nothing changes" | Say "Loans get cheaper"',
  ] },
  is_genel: { mid: [
    '"The queue of customers is very long and everyone is angry." | Stay calm, prioritise and keep people informed | Say you\'d try to go faster | Say you\'d take a break',
    '"What if you saw a colleague breaking the rules?" | Talk to them first, then tell the manager if it continues | Say you\'d ignore it | Say you\'d tell everyone',
    '"How do you stay motivated in routine work?" | Set small goals and look for ways to improve the work | Say "For the salary" | Say "I don\'t"',
    '"What if we asked you to change shifts?" | Say you can be flexible and ask for early notice | Accept reluctantly | Say you\'d never accept',
    '"A new system arrived and everyone is struggling." | Learn it first and help your colleagues | Say you\'d keep doing it the old way | Say you\'d complain about the system',
    '"What makes you happiest at work?" | Seeing a job done well and people satisfied | Say "Clocking-off time" | Say "Nothing"',
  ] },
  is_ogretmen: { mid: [
    '"A student keeps disrupting the class." | Talk one-on-one to understand why and work with the parents | Move them to the back row | Throw them out of class',
    '"How do you teach students who learn at different speeds?" | Use levelled activities and extra support | Teach to the average | Focus on the fast ones',
    '"You catch a student cheating in an exam." | Calmly take the paper, follow the rules, then talk | Ignore it | Scold them in front of the class',
    '"Do you use digital tools in class?" | Yes — short, interactive and purposeful | Say you only play videos | Say "The board is enough"',
  ] },
  is_polis: { mid: [
    '"You\'re first on the scene of a tense fight." | Secure the area, separate the parties and speak calmly | Say you\'d intervene by shouting | Say you\'d watch until backup arrives',
    '"An acquaintance asks you to cancel their traffic fine." | Politely refuse and explain the rules | Say "Just this once" | Ask for something in return',
    '"You\'re talking to the family of a missing child." | Gather information in a calm, hopeful way | Fill in the form quickly | Say "They\'ll probably turn up"',
    '"What do you watch for when collecting evidence?" | Protect the scene, record everything, keep the chain of custody | Say you\'d pocket what you find | Say photos are unnecessary',
  ] },
  is_avukat: { mid: [
    '"What if your client lied to you?" | Find out the truth and defend within legal and ethical limits | Say it doesn\'t matter | Say you\'d go along with the lie',
    '"New evidence appears the day before the hearing." | Review the file and request a postponement if needed | Say you\'d go ahead as planned | Say you\'d hide the evidence',
    '"How do you explain a complex legal situation to a client?" | In plain words, with the options and risks | Read out the statute | Say "Leave it to me"',
    '"What if you get a case you can\'t win?" | Be honest about their chances and offer settlement options | Say you\'d take it anyway | Say "We\'ll definitely win"',
  ] },
  is_hemsire: { mid: [
    '"You think the doctor\'s prescribed dose is wrong." | Politely ask the doctor before giving it | Give it as written | Give the dose you think is right',
    '"Two patients ring their bells at once." | Set priority with a quick check and ask the team for help | Go to the nearer one | Make both wait',
    '"You need to give an injection to a scared child." | Explain, distract them and keep their parent close | Do it quickly | Scold them: "Don\'t cry"',
    '"What matters at shift handover?" | Pass on every patient\'s status, medication and risks fully | Give a short summary | Leave without a handover',
  ] },
  is_gazeteci: { mid: [
    '"A striking claim comes from a single source." | Verify it with at least two sources before publishing | Publish immediately | Exaggerate the headline',
    '"Your story puts one of the advertisers in a tough spot." | Publish it if true and give them the right to reply | Soften the story | Bin the story',
    '"Your interviewee dodges the question." | Ask again, politely but clearly | Move on | Start an argument',
    '"You\'re asked to reveal your source." | Protect the source\'s confidentiality | Say it depends | Reveal it at once',
  ] },
  is_psikolog: { mid: [
    '"Your client doesn\'t speak at all in sessions." | Create a safe space and respect their pace | Fire off questions | End the session early',
    '"A client is at risk of self-harm." | Make a safety plan and refer to the right services if needed | Leave it for the next session | Ignore it',
    '"What if you meet a client socially?" | Protect confidentiality and let them greet you first | Call out their name | Talk about your sessions',
    '"How do you protect your own mental health?" | Get supervision, keep boundaries and rest | Say "I\'m strong" | Say "No need to"',
  ] },
  is_muzisyen: { mid: [
    '"Your equipment breaks on stage." | Stay calm and hold the crowd with an acoustic piece | Stop playing | Shout at the sound technician',
    '"You disagree musically with your band." | Try both together and pick the best by listening | Push your own idea | Quit the band',
    '"Why do royalties matter?" | They protect creative work and ensure fair pay | Say "I don\'t really know" | Say "Music belongs to everyone, it doesn\'t matter"',
    '"Only a few people came to the concert." | Give them your best performance | Cut it short | Complain to the audience',
  ] },
  sinif: {
    open: [
      'The class is listening. How do you start? | Open with a question: "What would you like to change this year?" | Start reading your prepared list | Start by praising yourself',
      'As you walk in, someone whistles and everyone laughs. | Smile and start with a witty line | Wait for the laughter to stop | Report the whistler to the teacher',
      'The teacher gives you 3 minutes. | Clearly state your three most important promises | Say whatever comes to mind | Talk long past the time',
    ],
    mid: [
      'The back rows are getting bored and whispering. | Ask them directly for their ideas | Cut it short | Raise your voice and keep going',
      'Someone asks, "What will change if you\'re elected?" | Make a concrete promise: "In the first month I\'ll set up a class library." | Talk about your good intentions in general | Criticise the other candidate',
      'Your rival says, "You always favour your own friends." | Calmly give an example of something you did for everyone | Move on without answering | List their faults too',
      'Someone asks about canteen prices. | Say you\'ll talk to the school management and share the result | Say "We\'ll see" | Promise impossible price cuts',
      'The class\'s quiet student hesitantly raises a hand. | Give them the floor and appreciate their idea | Answer briefly and move on | Ignore them',
    ],
    close: [
      'Time to wrap up. | End with a short, memorable line | Thank everyone and finish | Say "You\'ll regret it if you don\'t vote for me"',
      'The bell is about to ring. | Repeat your promise in one sentence and say thanks | Quickly say "Vote for me" | Keep talking through the bell',
      'The class starts clapping. | Thank them and wish your rival good luck | Wave and sit down | Declare that you\'ve won',
    ],
  },
  barisma: {
    open: [
      'Both sides are hurt. | Listen to each of them calmly and separately | Say "Forget the past" | Say right away who\'s right',
      'Two friends refuse to sit at the same table. | Persuade them to a short, neutral chat first | Force them to sit | Criticise one in front of the other',
      'Neighbours are fighting over parking. | Ask everyone to explain their side in turn | Say "Sort it out yourselves" | Blame someone\'s car',
    ],
    mid: [
      'Someone raises their voice. | Say calmly that you understand how they feel | Change the subject | Raise your voice too',
      'You\'re looking for common ground. | Remind them of a memory they both treasure | Offer a small suggestion | Take one side',
      'One says, "They should apologise first." | Suggest each acknowledge something they regret | Ask the other to apologise | Say "You\'re acting like kids"',
      'It turns out there was a misunderstanding. | Go over what happened together, step by step | Say "Oh well, it happened" | Blame whoever misunderstood',
      'Someone starts crying. | Take a break, bring water, then continue | Keep talking | Say "You\'re overreacting"',
    ],
    close: [
      'You\'re very close to an agreement. | Suggest a concrete step: "Let\'s have dinner together on Sunday." | Suggest giving it time | Force them to shake hands',
      'Both have gone quiet and their looks have softened. | Thank each of them for this step | Leave quietly | Say "See, I was right"',
      'They\'ve promised to make peace. | Suggest doing something together next week | Say "Alright then" | Joke about the old fight',
    ],
  },
  sunum: {
    open: [
      'The audience looks sceptical. | Start with the problem they face | Rattle off numbers | Say "Trust me"',
      'The projector won\'t work. | Start without slides, with a story | Wait for the technician | Blame the organisers',
      'Managers in the front row are checking their watches. | Open with "I\'ll tell you three things in 10 minutes" | Read your long prepared intro | Ask them for more time',
    ],
    mid: [
      'Someone asks, "Isn\'t this risky?" | Admit the risk honestly and explain the safeguards | Leave the question for later | Say "There\'s no risk at all"',
      'Interest is growing. | Tell a real success story | Show a detailed table | Make exaggerated promises',
      'Someone asks about the cost. | Show the cost and payback period clearly | Say "Details are in the appendix" | Understate the figure',
      'You get a question you can\'t answer. | Say you don\'t know and offer to follow up | Give a vague answer | Make something up',
      'Someone in the room praises a rival product. | Explain your difference respectfully in one sentence | Pretend you didn\'t hear | Trash the rival',
    ],
    close: [
      'Decision time. | Propose a clear, easy next step | Say "Think about it and let me know" | Pressure them to decide now',
      'Your time is running out. | Sum up the main idea in one sentence | Flip through the last slides quickly | Go over time',
      'There\'s applause, but nobody says anything. | Ask questions to agree on a first small step together | Say thanks and leave | Say "Your loss if you don\'t buy"',
    ],
  },
  ders: {
    open: [
      'Class starts; the students are sleepy. | Start with an intriguing question or experiment | Start writing on the board | Shout "Be quiet!"',
      'Monday, first period, the class is noisy. | Wait calmly, make eye contact, then begin | Start teaching anyway | Punish the whole class',
      'An inspector walks into your class. | Carry on with your usual interactive lesson | Switch to an overly formal lecture | Warn the students to stay silent',
    ],
    mid: [
      'A student didn\'t understand the topic. | Explain again with a different example | Repeat the same explanation | Say "We\'ll look at it later"',
      'Two students are arguing. | Hear both and remind them of the class rules | Ignore it | Send both outside',
      'A student answered wrong and the class laughed. | Praise the right part of the answer and calm the class | Give the right answer and move on | Laugh too',
      'A student asks, "What use is this to us?" | Connect it to an everyday example | Say "It\'ll be on the exam" | Say "Don\'t question it"',
      'Half the class didn\'t do the homework. | Ask why and start the homework together in class | Take points off | Scold the whole class',
    ],
    close: [
      'The lesson is ending. | Give a quick summary and an intriguing assignment | Say the homework quickly | Walk out at the bell without a word',
      'Five minutes left. | Play a quick Q&A game | Let them go | Start a new topic',
      'A student comes to you after class. | Listen, and make extra time if needed | Say "Later" | Say "You should\'ve asked in class"',
    ],
  },
  musteri: {
    open: [
      'A customer comes in loudly with a faulty product. | Listen calmly and apologise for the trouble | Ask for the receipt | Say "It\'s not our fault"',
      'An angry customer is on the phone. | Give your name, show you\'re listening and take notes | Put them on hold | Hang up',
      'A customer says their order came wrong. | Admit the mistake and prepare the right one at once | Start checking the order | Say "That\'s what you asked for"',
    ],
    mid: [
      'They shout, "I\'ve been dealing with this for three days!" | Acknowledge the lost time and promise a quick fix | Point out the other customers waiting | Raise your voice too',
      'You ask whether they want an exchange or a refund. | Explain both options clearly and let them choose | Say you can only exchange it | Tell them to wait for the manager',
      'The customer asks for a discount. | Offer a reasonable gesture within your authority | Say "I can\'t" | Halve the price on a whim',
      'The customer says they didn\'t know the rule. | Explain it kindly and see if an exception is possible | Say "It\'s on the sign" | Say "Can\'t you read?"',
      'The customer complains about another employee. | Listen, take notes and say you\'ll pass it to the manager | Defend your colleague | Scold your colleague in front of them',
    ],
    close: [
      'The customer has softened a bit. | Offer a small gesture (a discount voucher) and thank them | Finish the transaction and call the next person | Say "Be more careful next time"',
      'The problem is solved. | Say they can contact you directly if it happens again | Say "Anything else?" | Sigh as you close the ticket',
      'The customer thanks you. | Thank them for their patience and wish them a nice day | Nod | Say "It would\'ve been faster without the shouting"',
    ],
  },
  hasta: {
    open: [
      'The test results are in and the patient is anxious. | Sit down, make eye contact and begin calmly | Read the results quickly standing up | Open with medical jargon',
      'The patient came in with relatives. | Ask the patient who they want present | Tell everyone at once | Send the relatives out',
      'The patient is afraid to hear the news. | Ask how much they want to know | State the result right away | Say "Nothing to be afraid of"',
    ],
    mid: [
      'They ask, "Is it serious, doctor?" | Explain honestly in plain language | Say "Don\'t worry, it\'s nothing" | Dodge the question',
      'The patient starts crying. | Wait, give them space and offer a tissue | Keep explaining the treatment | Say "Crying won\'t help"',
      '"I read online — am I going to die?" | Calmly correct the source and explain their own case | Say "Don\'t look online" | Change the subject',
      'The patient wants a second opinion. | Say it\'s their right and prepare their file | Take offence | Say "Another doctor will say the same"',
      'The patient worries about treatment costs. | Point them to insurance and support options | Say "That\'s not my job" | Recommend the most expensive treatment',
    ],
    close: [
      'Time to discuss the treatment plan. | List the steps, invite questions, give written info | Hand over the prescription and book a check-up | Say "You can read about it online"',
      'The consultation is ending. | Tell them when and how they can reach you | Say "Get well soon" and leave | Finish talking on your way out the door',
      'The patient has calmed down a little. | Say something realistic and hopeful and set the next step | Close the file | Say "It\'s fate"',
    ],
  },
  veli: {
    open: [
      'A parent complains about their child\'s grades. | Start with the child\'s strengths | Show the grade sheet and wait | Say "Your child is lazy"',
      'The parent is late and tense. | Be understanding and suggest using the time well | Remind them of the time | Reschedule and send them off',
      'The parent is worried about the child\'s friends. | Share your observations with concrete examples | Say "I haven\'t seen anything" | Blame the other children',
    ],
    mid: [
      'They say, "The teacher is unfair to our child." | Say you understand and review concrete examples together | Change the subject | Get defensive and argue',
      'They ask what they can do at home. | Suggest a regular 30-minute daily study plan | Say "They should study more" | Say "Get a private tutor"',
      'The parent says the child spends too much time on the phone. | Suggest practical rules to apply together | Say "We didn\'t have phones in my day" | Say "Not my problem"',
      'The parent is close to tears: things are hard at home. | Be understanding and refer them to the school counsellor | Return to the grades | Lecture them: "Don\'t let it affect the child"',
      'The parent wants the child moved to another class. | Hear their reasons and suggest trying a solution together first | Agree at once | Refuse outright',
    ],
    close: [
      'The meeting is ending. | Set a date to meet again in a month | Thank them and see them out | Check your watch and stand up',
      'The parent seems convinced. | Sum up the two steps you agreed on | Say "Great" | Say "Like I said at the start"',
      'The parent thanks you. | Say you\'ll follow the child\'s progress together | Nod | Call in the next parent',
    ],
  },
  basin: {
    open: [
      'Cameras are rolling and the first question is tough. | Answer briefly and clearly | Start reading your prepared statement | Say "I won\'t answer that"',
      'The room is packed and flashes are going off. | Deliver your main message with a calm opening line | Test the mic and wait | Ask the journalists to be quiet',
      'The press conference started late. | Briefly apologise for the delay and begin | Start without a word | Blame the organisers for the delay',
    ],
    mid: [
      'A reporter repeats a false claim. | Correct it politely and share the right data | Ignore it | Scold the reporter',
      'You\'re asked whether mistakes were made. | Admit the mistake and explain the measures taken | Blame another department | Insist "There was no mistake"',
      'A question about your private life comes up. | Politely say it\'s off topic and return to the main issue | Answer at length | Get angry and storm out',
      'The same question is asked for the third time. | Patiently repeat the same clear answer | Say "I\'ve answered that" | Mock them',
      'A reporter shows a confidential document. | Say you\'ll review it and make a statement | Claim the document is fake | Snatch the document',
    ],
    close: [
      'Last question. | Repeat your main message in one sentence | Say "Thank you" and leave | Pretend you didn\'t hear the question',
      'Time\'s up. | Say you\'ll share a written statement and thank them | Stand up abruptly | Keep arguing past the time',
      'The journalists are getting up. | Remind them you\'re open to questions | Slip out the back door | Say "Be careful what you write"',
    ],
  },
  kriz: {
    open: [
      'A big order was cancelled and the team is panicking. | Stay calm and clarify the situation first | Ask who\'s to blame | Postpone the meeting to think',
      'The servers are down and customers are calling. | Assign roles: one on the fix, one on communication | Everyone try to fix it together | Keep customers waiting with no statement',
      'A fire alarm went off in the warehouse and production stopped. | First confirm everyone is safe | Focus on saving production | Assume it\'s a false alarm',
    ],
    mid: [
      'Everyone is talking at once. | Set a speaking order and hear everyone briefly | Listen to the most senior person | Bang the table to silence them',
      'There are two proposals, both risky. | List the pros and cons and decide with data | Flip a coin | Choose neither and wait',
      'A team member admits the mistake was theirs. | Thank them for their honesty and focus on the fix | Stay silent | Scold them in front of everyone',
      'The press starts calling. | Appoint one spokesperson and give accurate information | Say "No comment" | Let everyone say what they like',
      'The budget isn\'t enough. | Rank priorities and make a clear request to management | Quietly take money from other projects | Keep spending',
    ],
    close: [
      'A decision has been made. | Assign tasks and set a follow-up date | Tell everyone to "sort it out" | End the meeting and say you\'ll email',
      'The crisis is over. | Thank the team and write down what you learned | Go straight back to work | Hunt for the culprit',
      'The team is exhausted. | Plan a short break and a rota | Keep going | Say "That\'s the nature of the job"',
    ],
  },
};
// i18n-skip-end

// Son görülen turlar (oturumlar arası): aynı soru kısa sürede tekrar gelmesin
const SEEN_KEY = 'hayatyolu.talkSeen';
let seen = [];
try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch { seen = []; }
const remember = ids => {
  seen = [...seen.filter(x => !ids.includes(x)), ...ids].slice(-120);
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch {}
};

// Havuzdan n tane, mümkünse yakın zamanda görülmemiş tur seç
function pickFrom(rng, list, n, taken) {
  const fresh = list.filter(x => !seen.includes(x.id) && !taken.has(x.id));
  const rest = list.filter(x => seen.includes(x.id) && !taken.has(x.id)).sort((a, b) => seen.indexOf(a.id) - seen.indexOf(b.id));
  const out = [...rng.shuffle(fresh), ...rest].slice(0, n);
  out.forEach(x => taken.add(x.id));
  return out;
}
const entries = (key, part) => ((lang === 'tr' ? TR : EN)[key]?.[part] || []).map((line, i) => ({ id: `${key}.${part}.${i}`, line }));

export const hasTalk = key => !!TR[key];
export const talkCount = () => Object.values(TR).reduce((a, sc) => a + Object.values(sc).reduce((b, l) => b + l.length, 0), 0);

// Bir sohbetin 4 turunu döndürür: [durum, [iyi, orta, kötü]]
// Mülakatta { job, path } verilirse orta turlardan en az biri o mesleğe özel olur.
export function talkRounds(key, rng, ctx = {}) {
  const taken = new Set();
  const open = pickFrom(rng, entries(key, 'open'), 1, taken);
  let mid;
  if (key === 'mulakat') {
    const field = [...entries(`is_${ctx.job}`, 'mid'), ...entries(`is_${ctx.path || 'genel'}`, 'mid')];
    const f1 = pickFrom(rng, field.length ? field : entries('is_genel', 'mid'), 1, taken);
    const f2 = pickFrom(rng, rng.chance(0.5) && field.length ? field : entries(key, 'mid'), 1, taken);
    mid = [...f1, ...f2];
  } else mid = pickFrom(rng, entries(key, 'mid'), 2, taken);
  const close = pickFrom(rng, entries(key, 'close'), 1, taken);
  const all = [...open, ...mid, ...close];
  remember(all.map(x => x.id));
  return all.map(x => { const [p, g, o, b] = x.line.split(' | '); return [p, [g, o, b]]; });
}
