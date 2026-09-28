// AdMob ayarları. Şu an Google'ın TEST kimlikleri kullanılıyor (gerçek para kazandırmaz).
// Yayından önce: AdMob hesabında uygulama + "Ödüllü" reklam birimi oluştur, aşağıdaki
// rewardedAndroid değerini ve android/app/src/main/res/values/strings.xml içindeki
// admob_app_id değerini gerçek kimliklerle değiştir, testing'i false yap. (Ayrıntı: RELEASE.md)
export const ADMOB = {
  rewardedAndroid: 'ca-app-pub-3940256099942544/5224354917',
  testing: true,
  // Oyun her yaştan oyuncuya uygun; reklam içeriği en fazla "ebeveyn rehberliği" düzeyinde
  maxAdContentRating: 'ParentalGuidance',
};
