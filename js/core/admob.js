// Gerçek AdMob ödüllü reklamları (yalnızca Android/iOS uygulamasında).
// Tarayıcıda Capacitor eklentisi yoktur; orada flows.js'deki yer tutucu kullanılır.
import { ADMOB } from '../ads.config.js';

const plugin = () => globalThis.Capacitor?.isNativePlatform?.() ? globalThis.Capacitor.Plugins?.AdMob : null;
export const hasNativeAds = () => !!plugin();
let ready = null;
let consentRequired = false;

// Açılışta bir kez: SDK'yı başlat, gerekirse (AB/İngiltere) onay formunu göster
export function initAds() {
  const A = plugin();
  if (!A) return Promise.resolve(false);
  ready ||= (async () => {
    try {
      await A.initialize({ initializeForTesting: ADMOB.testing, maxAdContentRating: ADMOB.maxAdContentRating });
      try {
        const info = await A.requestConsentInfo();
        consentRequired = info.status !== 'NOT_REQUIRED';
        if (info.isConsentFormAvailable && info.status === 'REQUIRED') await A.showConsentForm();
      } catch (e) { console.warn('Onay bilgisi alınamadı', e); }
      return true;
    } catch (e) { console.warn('AdMob başlatılamadı', e); return false; }
  })();
  return ready;
}

// Ayarlardan: kullanıcının reklam onayını değiştirmesi (AB'de zorunlu)
export const privacyOptionsNeeded = () => consentRequired;
export async function showPrivacyOptions() {
  const A = plugin(); if (!A) return;
  try { await A.showPrivacyOptionsForm(); } catch (e) { console.warn(e); }
}

// Ödüllü reklam göster. Ödül kazanıldıysa true, kapatıldı/yüklenemediyse false.
export async function showNativeRewarded(onLoading) {
  const A = plugin();
  if (!A || !(await initAds())) return false;
  let rewarded = false;
  const handles = [];
  const cleanup = () => handles.forEach(h => { try { h.remove(); } catch {} });
  return new Promise(async resolve => {
    let finished = false;
    const done = v => { if (finished) return; finished = true; cleanup(); resolve(v); };
    try {
      handles.push(await A.addListener('onRewardedVideoAdReward', () => { rewarded = true; }));
      handles.push(await A.addListener('onRewardedVideoAdDismissed', () => setTimeout(() => done(rewarded), 400)));
      handles.push(await A.addListener('onRewardedVideoAdFailedToShow', () => done(false)));
      onLoading?.(true);
      await A.prepareRewardVideoAd({ adId: ADMOB.rewardedAndroid, isTesting: ADMOB.testing });
      onLoading?.(false);
      A.showRewardVideoAd().then(() => { rewarded = true; }).catch(() => done(false));
    } catch (e) {
      onLoading?.(false);
      console.warn('Reklam yüklenemedi', e);
      done(null); // null: yüklenemedi (internet yok / reklam yok)
    }
  });
}
