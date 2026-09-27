# 🌱 Hayat Yolu — Ehtiyars Game

> 📱 **Test APK'sı:** [`apk/HayatYolu-0.1.0-test.apk`](apk/HayatYolu-0.1.0-test.apk) — telefona indir, "bilinmeyen kaynaklardan yükleme" iznini ver ve kur. Her push'ta GitHub Actions da yeni bir APK üretir (Actions → Android APK → Artifacts).
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
| **İş = emek** | Maaş, yıl içinde **mesaiye gittiğin oranda** yatar (tam zamanlı iş 2 EP). Hiç gitmezsen maaşın kesilir, üst üste olursa kovulursun. |
| **Eş seçimi** | Her başarılı tanışmada 3 aday: *çok çekici*, *çok uyumlu*, *varlıklı çevreden*. Görünüş, uyum, karakter (destekleyici, tutumlu, savurgan, hırslı, kıskanç, sakin, aile odaklı, maceracı), iş, ailesi ve çocuk isteği farklıdır. Eşin geliri, gider alışkanlığı, mutluluğun ve tartışmalar buna göre şekillenir; sevgi bakımsız kalırsa boşanma ve mal paylaşımı olur. |
| **Eylem puanı (EP)** | Her yıl evreye göre 3–6 EP. Her eylem 1–2 EP ve 6–24 enerji harcar. **Tüm EP harcanınca yıl tamamlanır** — eylemler iyi ya da kötü geçebilir. Mutluluk < 30 → −1 EP, sağlık < 25 → −2 EP. |
| **Mini oyunlar** | Eylemlerin çoğu bir mini oyunla oynanır (28 mini oyun). Karakter becerisi oyunu kolaylaştırır ama tek başına kazandırmaz. İstenirse "hızlı geç" (−10 puan). |
| **Olay kartları** | Yılda 1–3 kart: sıradan / nadir / epik / efsanevi. Efsanevi kartların çoğu yalnızca emek verilen alanlarda çıkar; 8 yıl epik görmeyen oyuncuya şans dengesi. Zincir olaylar. |
| **Sınavlar** | Karne, LGS, YKS, ehliyet, KPSS, TUS, ustalık, iş mülakatı. Oyuncu gerçek soru çözer; puan = %65 oyuncu + %30 hazırlık + şans. Jokerler: öğretmene sor, ezber, çalışma grubu, ekstra süre, reklam jokeri. |
| **Kapılar** | Meslekler sırayla açılan kapılardan oluşur: `yetenek×0,55 + mini oyun×0,55 + geçmiş emek + bağlantı + şans ≥ 100`. Kapanan kapı yolu bitirmez. |
| **Ekonomi** | Harçlık, maaş, terfi, yaşam gideri, enflasyon, birikim, borç, iflas ve yeniden tırmanış. Ticaret yolu 7 basamak (okulda satış → ihracat). |
| **Nesil** | Ölünce hayat albümü; çocuklardan biriyle miras, soyadı itibarı ve aile şirketiyle devam. |

### Mini oyun kataloğu (28)

Spor: **Penaltı, Çalım, Taktik Kartı, Kondisyon** · Zihin: **Sınav, Zihinden İşlem, Kelime Avı, Hafıza Kartları, Desen Hafızası** ·
Teknik: **Devre Kur, Bug Avı, Sök & Tak, Arıza Tespiti** · Sağlık: **Teşhis, Hassas Ameliyat, Acil Triyaj** ·
Ticaret: **Para Üstü, Pazarlık, Fiyat Belirle, Stok Planı, Ürün Sayfası, Teslimat Rotası** ·
Hayat: **Konuşma (6 senaryo), Çelişkiyi Bul, Enkazdan Kurtarma, Ritim, Hasat, Ekim Planı**

Her mini oyun `skill` (karakter becerisi) ve `stakes` (önem) ile ölçeklenir; değiştiriciler
(yağmur, gece, kalabalık, yorgun, stresli, motivasyon, kritik, efsanevi…) oynanışı değiştirir.
Tümü "Mini oyun salonu"nda serbestçe denenebilir.

## Proje yapısı

```
index.html, manifest.webmanifest, sw.js   PWA kabuğu (çevrimdışı çalışır)
css/style.css                              tasarım sistemi (mobil öncelikli)
data/events.json                           olay destesi (145 kart) — kod bilmeden genişletilir
data/questions.json                        soru bankası (+ yaşa göre üretilen matematik soruları)
js/config.js                               tüm denge sayıları (enerji, EP, olasılıklar, ekonomi)
js/core/        rng (tohumlu), energy, store, audio, ads
js/sim/         saf simülasyon: character, traits, household, partner, balance, stats, actions, careers, business, events, year, questions
js/minigames/   engine + 28 mini oyun (sports, mind, tech, health, trade, life)
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
Metinlerde `{ad} {anne} {baba} {partner} {arkadas} {sehir} {yas}` kullanılabilir. `npm test` tüm kartları ve zincir referanslarını doğrular.

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
