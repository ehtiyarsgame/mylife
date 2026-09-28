# Ehtiyars Game — marka kiti

Stüdyonun tüm oyunlarında kullanılacak logo dosyaları. "Ehtiyar" (ihtiyar) adından ilhamla:
kulaklıklı, gözlüklü, beyaz bıyıklı, göz kırpan neşeli bir oyuncu dede.

## Dosyalar

| Dosya | Ne için |
|---|---|
| `ehtiyars-mark.svg` | Yalnızca amblem (yuvarlak). Uygulama içi küçük logo, favicon, profil resmi |
| `ehtiyars-logo-horizontal-dark.svg` / `-light.svg` | Yatay logo (amblem + yazı). **dark** = koyu zemin için (beyaz yazı), **light** = açık zemin için (lacivert yazı) |
| `ehtiyars-logo-stacked-dark.svg` / `-light.svg` | Dikey logo: açılış ekranı, mağaza görselleri, afiş |
| `ehtiyars-wordmark-dark.svg` / `-light.svg` | Yalnızca "EHTIYARS GAME" yazısı (küçük alanlar, jenerik) |
| `png/` | Hazır PNG'ler: amblem 1024/512/192/96, yatay 2000 px, dikey 1440 px, profil resmi 1024², kapak 1500×500 |
| `fonts/` | Nunito Black / ExtraBold (SIL Open Font License) |

Yazılar yola (path) çevrilmiştir: font yüklü olmayan her yerde aynı görünür.

## Renkler

| Renk | Kod |
|---|---|
| Gün batımı sarısı | `#ffcf4d` |
| Mercan | `#ff7b54` |
| Mor | `#9b5cff` |
| Gece laciverti (yazı, çizgi) | `#1a1440` |
| Koyu zemin | `#0d1020` |
| "GAME" gradyanı | `#ffb23e → #ff6f7d` |

## Kullanım

- Amblemin çevresinde en az çapının %15'i kadar boşluk bırakın.
- Logoyu esnetmeyin, döndürmeyin, renklerini değiştirmeyin; koyu zeminde `-dark`, açık zeminde `-light` kullanın.
- Yeni oyunlarda açılış sırası: stüdyo logosu (≈1,5 sn) → oyun logosu.

## Yeniden üretme

```bash
npm i --no-save opentype.js@1.3.4
node scripts/make-brand-logo.cjs     # SVG varyantları
node scripts/export-brand-png.cjs    # PNG'ler (Playwright)
```
