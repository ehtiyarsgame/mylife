# Ehtiyars Game — herkese açık site

Bu klasör oyun deposundan (özel) bağımsız, **herkese açık** bir GitHub deposuna yüklenir.
Google Play gizlilik politikası adresi ve AdMob `app-ads.txt` buradan yayınlanır.

## Kurulum (bir kez, 5 dakika)

1. GitHub'da **New repository** → ad tam olarak: `ehtiyarsgame.github.io` → **Public** → Create.
2. **Add file → Upload files** → bu klasörün *içindekileri* (index.html, app-ads.txt, lifetide/, assets/) sürükle → Commit.
3. Depo **Settings → Pages** → Source: "Deploy from a branch" → `main` / `(root)` → Save.
4. 1–2 dakika sonra site açılır:
   - Ana sayfa: https://ehtiyarsgame.github.io/
   - Gizlilik politikası: **https://ehtiyarsgame.github.io/lifetide/privacy.html** → Play Console'a bu yazılır
   - app-ads.txt: https://ehtiyarsgame.github.io/app-ads.txt

## Play Console / AdMob

- Play Console → Mağaza ayarları → **Web sitesi**: `https://ehtiyarsgame.github.io`
- Play Console → Uygulama içeriği → **Gizlilik politikası**: `https://ehtiyarsgame.github.io/lifetide/privacy.html`
- AdMob app-ads.txt'yi bu web sitesinin kökünde arar; oyun Play'de yayınlanıp site adresi girildikten sonra birkaç gün içinde doğrular.

Yeni oyun çıkınca `lifetide/` gibi yeni bir klasör açıp kendi gizlilik sayfasını koy, ana sayfaya bir kart ekle.
