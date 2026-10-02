# 🚀 Yayın rehberi — Lifetide 1.0.0

Paket adı: `com.ehtiyarsgame.lifetide` · Play'e yüklenen dosya: `apk/Lifetide-1.0.0.aab`

Bu depo Google Play'e yüklenmeye hazır. Aşağıdaki adımları sırayla izle.

## 1. İmza anahtarını yedekle (ÇOK ÖNEMLİ)

Yayın derlemeleri `android/ehtiyars-upload.jks` anahtarıyla imzalanır. Şifreler `android/keystore.properties` dosyasındadır.
Bu iki dosya **git'e eklenmez** (`.gitignore`). Sana ayrıca gönderildiler; güvenli bir yere (şifre yöneticisi, harici disk, bulut) yedekle.

- Play App Signing açık olduğunda (varsayılan) bu anahtar yalnızca **yükleme anahtarı**dır; kaybedersen Play Console'dan sıfırlama istenebilir, ama bu günler sürer.
- Anahtar dosyasını kimseyle paylaşma, herkese açık bir yere koyma.

Yeni bir bilgisayarda derlemek için iki dosyayı `android/` klasörüne koyman yeterli.

## 2. AdMob ✅ (yapıldı)

- Uygulama kimliği: `ca-app-pub-8279712116721351~6538286864` · Ödüllü birim: `ca-app-pub-8279712116721351/5616173156` · `testing: false`
- `app-ads.txt` yayında: https://ehtiyarsgame.github.io/app-ads.txt
- Kalan: AdMob → **Gizlilik ve mesajlaşma** → GDPR mesajını oluştur ve yayınla. Uygulama Play'de yayınlanınca AdMob'da uygulamayı mağaza girişine bağla.

> Kendi telefonunda gerçek reklamlara art arda tıklama; hesabın askıya alınabilir.

## 3. Gizlilik politikası ✅ (yayında)

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
   - en: "First release! Live a whole life through 500+ mini-games."
   - tr: "İlk sürüm! 500'den fazla mini oyunla bir ömür yaşa."

## 6. Yayından sonra

- Play Console → İstatistikler ve Android Vitals: çökme/ANR raporlarını izle.
- AdMob → ödüllü reklam doluluk oranını izle.
- Geri bildirim: ehtiyarsgame@gmail.com

## Marka

Stüdyo logosu ve tüm varyantları: `brand/` (ayrıntı: `brand/README.md`). Diğer oyunlarda da aynı dosyaları kullan.
