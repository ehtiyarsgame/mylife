# 🚀 Yayın rehberi — Lifetide / Hayat Yolu 1.0.0

Bu depo Google Play'e yüklenmeye hazır. Aşağıdaki adımları sırayla izle.

## 1. İmza anahtarını yedekle (ÇOK ÖNEMLİ)

Yayın derlemeleri `android/ehtiyars-upload.jks` anahtarıyla imzalanır. Şifreler `android/keystore.properties` dosyasındadır.
Bu iki dosya **git'e eklenmez** (`.gitignore`). Sana ayrıca gönderildiler; güvenli bir yere (şifre yöneticisi, harici disk, bulut) yedekle.

- Play App Signing açık olduğunda (varsayılan) bu anahtar yalnızca **yükleme anahtarı**dır; kaybedersen Play Console'dan sıfırlama istenebilir, ama bu günler sürer.
- Anahtar dosyasını kimseyle paylaşma, herkese açık bir yere koyma.

Yeni bir bilgisayarda derlemek için iki dosyayı `android/` klasörüne koyman yeterli.

## 2. AdMob kimliklerini gir

Şu an Google'ın **test** kimlikleri kullanılıyor (reklamlar "Test Ad" yazar, para kazandırmaz).

1. [admob.google.com](https://admob.google.com) → Uygulamalar → **Uygulama ekle** → Android → "Lifetide".
2. Uygulama kimliğini (`ca-app-pub-XXXXXXXX~YYYYYYYY`) kopyala →
   `android/app/src/main/res/values/strings.xml` içindeki `admob_app_id` değerine yapıştır.
3. **Reklam birimi ekle → Ödüllü** ("Rewarded") → kimliği (`ca-app-pub-XXXXXXXX/ZZZZZZZZ`) kopyala →
   `js/ads.config.js` içindeki `rewardedAndroid` değerine yapıştır ve `testing: false` yap.
4. AdMob → **Gizlilik ve mesajlaşma** → GDPR mesajı oluştur ve yayınla (AB'deki oyuncular için onay formu; oyun bunu otomatik gösterir).
5. `app-ads.txt`: AdMob'un verdiği satırı `website/app-ads.txt` dosyasına yaz ve herkese açık siteye yükle (bkz. 3. adım).

> Kendi telefonunda gerçek reklamlara art arda tıklama; hesabın askıya alınabilir. Test için `testing: true` bırak.

## 3. Gizlilik politikasını yayınla (herkese açık site)

Oyun deposu özel olduğu için gizlilik sayfası ayrı, herkese açık bir sitede durur: `website/` klasörü.
Kurulum adımları `website/README.md` içinde (GitHub'da `ehtiyarsgame.github.io` adlı herkese açık depo + Pages). Sonuç:

- Gizlilik politikası: **https://ehtiyarsgame.github.io/lifetide/privacy.html** → Play Console → Uygulama içeriği → Gizlilik politikası
- Web sitesi: **https://ehtiyarsgame.github.io** → Play Console → Mağaza ayarları → Web sitesi (AdMob `app-ads.txt`'yi burada arar)

## 4. Derle

```bash
npm ci
npm test
npm run build:web && npx cap sync android
cd android
./gradlew bundleRelease     # → app/build/outputs/bundle/release/app-release.aab  (Play'e bu yüklenir)
./gradlew assembleRelease   # → app/build/outputs/apk/release/app-release.apk  (telefona doğrudan kurmak için)
```

Her yeni sürümde: `js/config.js` → `APP_VERSION`, `package.json` → `version`,
`android/app/build.gradle` → `versionCode` (+1) ve `versionName`, `sw.js` → önbellek adı.

## 5. Play Console

1. [play.google.com/console](https://play.google.com/console) → **Uygulama oluştur**
   - Ad: **Lifetide: Play Your Life** · Varsayılan dil: İngilizce (ABD) · Oyun · Ücretsiz
2. **Mağaza girişi**: metinler `store/listing.md`'de (İngilizce + Türkçe çeviri ekle).
   - Simge: `store/icon-512.png`
   - Öne çıkan görsel: `store/feature-1024x500-en.png` (Türkçe giriş için `-tr.png`)
   - Telefon ekran görüntüleri: `store/screenshots/en/*.png`, `store/screenshots/tr/*.png` (1080×1920)
   - Kategori: Simülasyon · İletişim e-postası: ehtiyarsgame@gmail.com
3. **Uygulama içeriği**: `store/listing.md` → "Play Console yanıtları" bölümündeki cevaplar
   (reklam: evet, hedef kitle 13+, veri güvenliği, içerik derecelendirmesi).
4. **Test**: önce **Dahili test** kanalına `app-release.aab` yükle, kendi telefonunda dene.
   Yeni kişisel geliştirici hesaplarında üretime çıkmadan önce **kapalı test** (en az 12 test kullanıcısı, 14 gün) zorunludur.
5. **Üretim** → yeni sürüm → AAB'yi yükle → sürüm notu:
   - en: "First release! Live a whole life through 100+ mini-games."
   - tr: "İlk sürüm! 100'den fazla mini oyunla bir ömür yaşa."

## 6. Yayından sonra

- Play Console → İstatistikler ve Android Vitals: çökme/ANR raporlarını izle.
- AdMob → ödüllü reklam doluluk oranını izle.
- Geri bildirim: ehtiyarsgame@gmail.com

## Marka

Stüdyo logosu ve tüm varyantları: `brand/` (ayrıntı: `brand/README.md`). Diğer oyunlarda da aynı dosyaları kullan.
