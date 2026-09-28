# 🌱 Hayat Yolu — Ehtiyars Game

> 📱 **Test APK'sı:** [`apk/HayatYolu-0.4.0-test.apk`](apk/HayatYolu-0.4.0-test.apk) — telefona indir, "bilinmeyen kaynaklardan yükleme" iznini ver ve kur. Her push'ta GitHub Actions da yeni bir APK üretir (Actions → Android APK → Artifacts).
>
> İletişim: ehtiyarsgame@gmail.com

Doğumdan yaşlılığa, her meslek yolunun kendi mini oyunlarıyla oynandığı mobil hayat simülasyonu.
Bu depo, tasarım dokümanındaki **"oynanabilir HTML prototipi"** adımının eksiksiz hâlidir: telefonda
tarayıcıdan oynanır, ana ekrana eklenebilir (PWA), Capacitor ile App Store / Google Play'e paketlenebilir.

## Hızlı başlangıç

```bash
python3 -m http.server 8080      # ya da: npx serve .
# Tarayıcıda: http://localhost:8080
```

Telefonda denemek için bilgisayarla aynı Wi‑Fi'ye bağlanıp `http://<bilgisayar-ip>:8080` adresini açın.
Derleme adımı yoktur; saf HTML + CSS + JavaScript (ES modülleri).

Testler (Node 20+):

```bash
npm test                 # 200+ hayatı otomatik oynatır, dengeyi ve veri dosyalarını doğrular
node tests/diag.mjs      # denge raporu: beceri seviyesine göre meslek/servet/ticaret basamakları
node tests/family-diag.mjs  # fakir ailede aileye destek olan / olmayan çocuk karşılaştırması
```

## Oyun döngüsü

| Katman | Nasıl çalışır |
|---|---|
| **Tempo** | **Bir ömür ≈ 1 hafta.** Enerji 90 sn'de 1 dolar, bar 150 (≈ 3,75 saat). Günde 3–4 girişle ~9–10 oyun yılı. Yıl bitince +15, reklamla +40 (günde 3), günlük görevler. |
| **Doğuştan şans** | Anne-baba gibi seçilemez: **görünüş**, **karizma** ve **mizaç** (sakin, neşeli, hırslı, kaygılı, maceracı, duygusal). Görünüş flörtü, eş adaylarını ve ilk izlenimi; karizma liderliği, konuşmayı ve mülakatları etkiler. Görünüş yaşla azalır; karizma emekle +20'ye kadar gelişir. |
| **Hane ekonomisi** | Ailenin kasası, geliri, gideri, krizleri (işten çıkarılma, hastalık, kira zammı, kardeş masrafı, dede bakımı) ve **stresi** var. Harçlık ve kurs parası bu kasadan çıkar. Aile zordaysa çocuk pazar/ayak işi, yarı zamanlı iş ya da çıraklıkla kazanıp **Ev** sekmesinden destek olur. Olmazsa sorunlar kademe kademe açılır: faturalar → kira ihtarı → icra (okulu bırakma kararı) → aile dağılma noktası. Aile kemer sıkar, sosyal yardım alır; sınıf atlayabilir ya da düşebilir. Yetişkinlikte emekli anne-babaya destek gerekir. Çalışan çocuğun okul hazırlığı düşer; okulu bırakan açık liseyle geri dönebilir. |
| **Yaşam dengesi** | 6 alan takip edilir: ders, spor, sosyal, aile, dinlenme, hobi. 3 yıl üst üste emek → alışkanlık ödülü (sağlık, mutluluk, sınav hazırlığı +4, aile bağı). İhmal → kademeli bedel: ders çalışmayan unutur, veli çağrılır, iki yıl üst üste çok zayıf karne **sınıfta bırakır**; spor yapmayanın fiziği ve sağlığı düşer; sosyal hayatı olmayan yalnızlaşır, arkadaş kaybeder; aileyi ihmal eden kopar; dinlenmeyen tükenir. Kullanılmayan beceri 3 yıl sonra körelir. Dengeli yaşayan ~75, özensiz ~65 yıl yaşar. |
| **Kader** | Başlangıç zarı bir kez atılır ve kaydedilir. Zarı yeniden atmak, devam eden hayatı silip yenisine başlamak ya da ölümde (hayat başına bir kez) ikinci şans almak **3 ödüllü reklam** ister; aksi hâlde kadere razı olunur. İzlenen reklam ilerlemesi kaydedilir. |
| **Alan seçimi** | Lise 2'de Sayısal / Eşit Ağırlık / Sözel / Dil. Yeteneklerine göre öneri gelir; alanın YKS'de girebileceğin bölümleri, alan derslerini ve sınav hazırlığını belirler. Meslek lisesi öğrencisinin alanı meslektir. |
| **Kart dengesi** | Kartlar yaşa, aile durumuna (fakirin, orta hallinin, zenginin dertleri ayrı), köy/kasaba/şehre göre gelir. Bir kart nadirliğine göre 6–14 yıl tekrar etmez, aynı kart asla üst üste gelmez; seçenekler yaşa göre gizlenir. Metninde baban/annen/kardeşin/deden/eşin geçen kart ya da seçenek, o kişi öldüyse veya yoksa otomatik olarak gelmez. |
| **İş = emek** | Maaş, yıl içinde **mesaiye gittiğin oranda** yatar (tam zamanlı iş 2 EP). Hiç gitmezsen maaşın kesilir, üst üste olursa kovulursun. |
| **Eş seçimi** | Her başarılı tanışmada 3 aday: *çok çekici*, *çok uyumlu*, *varlıklı çevreden*. Görünüş, uyum, karakter (destekleyici, tutumlu, savurgan, hırslı, kıskanç, sakin, aile odaklı, maceracı), iş, ailesi ve çocuk isteği farklıdır. Eşin geliri, gider alışkanlığı, mutluluğun ve tartışmalar buna göre şekillenir; sevgi bakımsız kalırsa boşanma ve mal paylaşımı olur. |
| **Eylem puanı (EP)** | Her yıl evreye göre 3–6 EP. Her eylem 1–2 EP ve 6–24 enerji harcar. **Tüm EP harcanınca yıl tamamlanır** — eylemler iyi ya da kötü geçebilir. Mutluluk < 30 → −1 EP, sağlık < 25 → −2 EP. |
| **Mini oyunlar** | Eylemlerin çoğu bir mini oyunla oynanır (117 mini oyun). Karakter becerisi oyunu kolaylaştırır ama tek başına kazandırmaz. İstenirse "hızlı geç" (−10 puan). |
| **Olay kartları** | Yılda 1–3 kart: sıradan / nadir / epik / efsanevi. Efsanevi kartların çoğu yalnızca emek verilen alanlarda çıkar; 8 yıl epik görmeyen oyuncuya şans dengesi. Zincir olaylar. |
| **Sınavlar** | Karne, LGS, YKS, ehliyet, KPSS, TUS, ustalık, iş mülakatı. Oyuncu gerçek soru çözer (matematik, Türkçe, coğrafya, tarih, edebiyat, İngilizce, fen — binlerce üretilmiş soru, son 400 soru tekrar gelmez); puan = %65 oyuncu + %30 hazırlık + şans. Jokerler: öğretmene sor, ezber, çalışma grubu, ekstra süre, reklam jokeri. |
| **Kapılar** | Meslekler sırayla açılan kapılardan oluşur: `yetenek×0,55 + mini oyun×0,55 + geçmiş emek + bağlantı + şans ≥ 100`. Kapanan kapı yolu bitirmez. |
| **Ekonomi** | Harçlık, maaş, terfi, yaşam gideri, enflasyon, birikim, borç, iflas ve yeniden tırmanış. Ticaret yolu 7 basamak (okulda satış → ihracat). Ticarette piyasa havası dalgalanır; ürünün tutarsa rekor yıl (kâr kat kat), ortak dolandırıcılığı / yangın / kur şoku / batan müşteri gibi çöküşlerle iflas. Riskli kararlar (🎲) beceri, itibar ve piyasaya göre tutar ya da batar; sigorta yangın ve hırsızlıkta korur. |
| **Finans** | 18 yaşında açılan Finans sekmesi: vadeli mevduat, kredi notu ve ihtiyaç/konut kredisi, 22 hisse ve fon (teknoloji, banka, enerji, gıda, sanayi, sağlık, turizm, emtia; endeks, altın, tahvil, kripto). Piyasa boğa/yatay/ayı döngüsünde, sektör ve şirket haberleriyle yıl sonunda hareket eder; hisseler temettü öder. "Piyasa analizi" eylemi (Al-Sat mini oyunu) gelecek yıla dair ipucu verir — iyi oynayan daha isabetli ipucu alır. Ev ve kiralık daire alınabilir (peşin ya da %30 peşinat + konut kredisi). |
| **Gerçekçi gelir** | Kademeli gelir vergisi (asgari gelir muaf; %20 / %30 / %40), gelir arttıkça büyüyen yaşam standardı (Tutumlu / Normal / Lüks seçimi). Futbolda maaş performansa bağlı, menajer %10 alır, sakatlıklar sezon kaybettirir; Süper Lig ×3,5, milli oyuncu ×7. |
| **Nesil** | Ölünce hayat albümü; çocuklardan biriyle miras, soyadı itibarı ve aile şirketiyle devam. |

### Global sürüm (dil, para, içerik)

- **Diller:** Türkçe ve İngilizce. İlk açılışta cihaz diline göre seçilir; Ayarlar → 🌐 Dil'den değiştirilebilir.
  Çeviri katmanı (`js/core/i18n.js`) Türkçe kaynak metni anahtar olarak kullanır: arayüz (`h()`), `textContent` ve canvas yazıları otomatik çevrilir.
  Sözlük `js/i18n/en*.js`, olay kartları `data/events.en.json`, elle yazılmış sorular `data/questions.en.json`. Yeni dil eklemek için bu dosyaların bir kopyası yeterli.
  `node scripts/i18n-extract.mjs --missing en` eksik çevirileri listeler; `node scripts/i18n-events.mjs` kart çevirilerini birleştirir.
- **Ortak para birimi:** Tüm dillerde oyun parası 🪙; sayı biçimi dile göre (12.500 🪙 / 12,500 🪙).
- **Evrensel içerik:** Sınav adları genel (lise sınavı, üniversite sınavı, kamu sınavı, uzmanlık sınavı), tarih ve edebiyat soruları dünya genelinden,
  ülkeye özgü coğrafya/meclis/bayram soruları yok. Dil dersleri dile göre: Türk oyuncuya Türkçe dilbilgisi + İngilizce, İngiliz oyuncuya İngilizce dilbilgisi + İspanyolca.
  İsimler ve memleket şehirleri dile göre (İngilizcede uluslararası isimler ve kurgusal şehirler).

### Mini oyun kataloğu (118)

Spor: **Penaltı, Çalım, Pas, Kaleci, Frikik, Kafa Vuruşu, Taktik Kartı, Kondisyon, Refleks** · Zihin: **Sınav, Zihinden İşlem, Doğru mu Yanlış mı, Sıralama, Kelime Avı, Hafıza Kartları, Desen Hafızası, Melodi** ·
Teknik: **Devre Kur, Bug Avı, Sök & Tak, Arıza Tespiti** · Sağlık: **Teşhis, Hassas Ameliyat, Acil Triyaj** ·
Ticaret: **Para Üstü, Pazarlık, Fiyat Belirle, Stok Planı, Ürün Sayfası, Teslimat Rotası** ·
Fizik ağırlıklı: **Kafa Vuruşu, Frikik (görünür kaleci ve top uçuşu), Basket Atışı, Masa Tenisi, Paralel Park, Boru Tesisatı, Kamyon Yükleme** ·
Hayat: **Konuşma (11 senaryo), Çelişkiyi Bul, Enkazdan Kurtarma, Ritim, Hasat, Ekim Planı**

Temalı oyunlar (`js/minigames/engines.js` motorları + `themes.js` temaları, 76 oyun):
- Zamanlama: Serbest Atış, Voleybol Servisi, Okçuluk (rüzgârlı), Dart, Golf, Bowling, Halter, Uzun Atlama
- Yakalama: Kiraz, Kargo Bandı, Yumurta, Yağmur Suyu, Çevre Temizliği
- Ayıklama: Geri Dönüşüm, Kütüphane, Postane, Hayvan Sınıfları, Kelime Türleri, Sayı Avcısı, Besin Grupları, Kıtalar, Çamaşır, Eczane Rafı
- Eşleştirme: Başkentler, Eş Anlam, İngilizce, Alet-Meslek, Elementler, Yazar-Eser, Hayvan Yavruları, Formüller
- Farklıyı bul: Kalite Kontrol, Sahte Para, Hastalıklı Bitki, Dikkat Testi, Kayıp Eşya, Kamuflaj
- Sayma: Stok Sayımı, Kalabalık, Kasa Sayımı, Sürü Sayımı · İstifleme: Vinç, Kat Pasta, Palet, Blok Kule, Duvar Örme
- Parkur: Bisiklet, Kurye, Slalom, Güvenli Sürüş, Engelli Koşu, Açık Su Yüzme · Vurma: Balon, Sinek, Bağ Zararlıları, Köstebek, Yıldız
- Hassas ayar: Terazi, İlaç Dozu, Fırın, Tarif Ölçüsü, Ses Mikseri, Basınç · Hızlı soru: Zihinden İşlem, Kesir, Fatura, Birim, Faiz, Vardiya Saati
- Konuşma sahneleri: Müşteri Şikâyeti, Hasta Bilgilendirme, Veli Görüşmesi, Basın Toplantısı, Kriz Toplantısı · Davul, Dans
- Borsa: Al-Sat (haberi oku, doğru anda al-sat)

Konuşma oyunları (`js/minigames/talk.js`) 240+ turluk havuzdan her sohbette 1 açılış + 2 orta tur + 1 kapanış seçer; yakın zamanda görülen turlar tekrar gelmez.
İş mülakatında sorulardan en az biri mesleğe özeldir (doktor, mühendis, yazılımcı, futbolcu, usta, çiftçi, tüccar, bankacı, öğretmen, polis, avukat, hemşire, gazeteci, psikolog, müzisyen).

Her eylem ve meslek birkaç oyundan birini rastgele seçer (ör. Spor salonu: kondisyon, halter, serbest atış, voleybol, okçuluk…); köyde tarla işleri, şehirde ev işleri gibi bağlama uygun oyunlar gelir.

Her mini oyun `skill` (karakter becerisi) ve `stakes` (önem) ile ölçeklenir; değiştiriciler
(yağmur, gece, kalabalık, yorgun, stresli, motivasyon, kritik, efsanevi…) oynanışı değiştirir.
Tümü "Mini oyun salonu"nda serbestçe denenebilir.

## Proje yapısı

```
index.html, manifest.webmanifest, sw.js   PWA kabuğu (çevrimdışı çalışır)
css/style.css                              tasarım sistemi (mobil öncelikli)
data/events.json                           olay destesi (216 kart) — kod bilmeden genişletilir
data/questions.json                        elle yazılmış soru bankası (tıp, ehliyet, ustalık, KPSS…)
js/sim/qgen.js, qdata.js                   veri tablolarından soru üretici (okul seviyelerinde 1.300+, tıp ~420, ustalık ~200, ehliyet ~130 farklı soru)
js/config.js                               tüm denge sayıları (enerji, EP, olasılıklar, ekonomi)
js/core/        rng (tohumlu), energy, store, audio, ads
js/sim/         saf simülasyon: character, traits, household, partner, balance, stats, actions, careers, business, events, year, questions
js/minigames/   engine + 112 mini oyun (sports, mind, tech, health, trade, life, extra, engines+themes)
js/ui/          app, dom, flows (eylem/olay/sınav/kapı akışları), lifeScreen, screens
tests/          başsız simülasyon testleri ve denge botu
```

`js/sim/` DOM'a dokunmaz; Node'da test edilir ve Unity'ye (C#) birebir taşınabilecek şekilde yazıldı.

## İçerik ekleme

**Olay kartı** (`data/events.json`):

```json
{
  "id": "izci_mahalle_maci", "rarity": "legendary", "icon": "🔭", "title": "Mahalle maçında izci",
  "cond": { "age": [10, 15], "skills": { "futbol": 38 }, "train": { "futbol": 2 } }, "once": true,
  "text": "Tribünde not alan biri var…",
  "options": [
    { "text": "Maça odaklan", "mg": "calim", "mgSkill": "futbol", "stakes": 0.45,
      "success": { "min": 55, "effects": { "door": "futbol_altyapi", "chain": { "id": "izci_aile", "delay": 0 } }, "result": "…" },
      "fail":    { "effects": { "skills": { "futbol": 2 } }, "result": "…" } }
  ]
}
```

Koşullar: `age, stage, looks, charisma, mizac, livingHome, homeStress, homeBroke, partnerTrait, partnerWealth, inSchool, stats, statsMax, skills, train, place, wealth, flags, anyFlag, notFlags, counters, job, hasJob, path, biz, edu, partner, married, kids, money, retired`.
Etkiler: `stats, homeCash, homeStress, homeCrisis, homeIncPct, homeExpPct, giveMoneyPct, eduDrop, relation, karizma, partnerSalaryPct, partnerJobless, skills, money, moneyPct, flags, unflags, counters, energy, honest, famRep, door, legend, title, friend, mentor, chain, job, loseJob, biz, bizSkill, partner, partnerLove, marry, child, parentDies, random`.
Metinlerde `{ad} {anne} {baba} {partner} {arkadas} {sehir} {yas}` kullanılabilir. `npm test` tüm kartları ve zincir referanslarını doğrular. Seçenekte `"gamble": { "p": 0.5, "skill": "ticaret" }` + `success`/`fail` dalları riskli karar yapar; `bizMoney` (işletmenin aylık kârı cinsinden), `bizBoost` ve `bizTrend` ticaret etkileridir.

**Soru** (`data/questions.json`): `{"l": "lise", "s": "Fizik", "q": "…", "a": ["doğru", "yanlış", "yanlış", "yanlış"], "c": 0, "h": "ipucu"}` — şıklar oyunda karıştırılır.

## Android APK derleme

Proje Capacitor 8 ile paketlenir (`com.ehtiyarsgame.hayatyolu`). Gerekenler: Node 22, JDK 21, Android SDK (platform 36).

```bash
npm ci
npm run android:apk            # www/ oluşturur, Android'e senkronlar, debug APK derler
# çıktı: android/app/build/outputs/apk/debug/app-debug.apk
node scripts/make-android-assets.cjs   # icons/*.svg'den ikon ve açılış görsellerini yeniden üretir
```

Play Store için imzalı sürüm: Android Studio → Build → Generate Signed Bundle (AAB). Mağaza görselleri `store/` klasöründe.

## Mobil mağazalara paketleme (Capacitor)

```bash
npm i -D @capacitor/cli && npm i @capacitor/core @capacitor/android @capacitor/ios
npx cap init "Hayat Yolu" com.hayatyolu.app --web-dir .
npx cap add android && npx cap add ios
npx cap copy && npx cap open android   # Android Studio'da çalıştır / imzala
```

Reklam için `@capacitor-community/admob` eklenip `js/main.js` içinde `setAdProvider(kind => AdMob.showRewardVideoAd()…)`
verilmesi yeterlidir; tüm ödül noktaları ve günlük sınırlar `js/core/ads.js` içinde hazır. 13 yaş altı için
kişiselleştirilmemiş, aile uyumlu reklam isteği yapılmalıdır (Families / çocuk kategorisi kuralları).

## Test modu

Ayarlar → **Test modu: hızlı enerji** (enerji 2 sn'de dolar) ve **Reklamsız paket (simülasyon)**.
10–15 kişilik oyun testleri için idealdir; hangi mini oyunun sevildiği "Mini oyun salonu" rekorlarından ve hayat albümlerinden izlenebilir.

## İçerik ilkeleri

Kumar, şans oyunu, ücretli sandık, içki/sigara ve "kolay para" seçenekleri yoktur. Dürüst kararlar itibar (+4)
kazandırır; itibar ticaretin üst basamaklarının asıl kilididir. Kötü olaylar (dolandırıcılık, zorbalık, hastalık)
korunmayı ve toparlanmayı öğretir; her zaman bir toparlanma yolu vardır.
