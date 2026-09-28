// Uygulama girişi: veriyi yükle, ekranları kaydet, başlat.
import { setDeck, setJobsRef } from './sim/events.js';
import { setBank } from './sim/questions.js';
import { JOBS } from './sim/careers.js';
import { setAdProvider } from './core/ads.js';
import { app, go, save } from './ui/app.js';
import { adOverlay } from './ui/flows.js';
import './ui/screens.js';
import { lang, loadDict, installHooks } from './core/i18n.js';
import { DEV } from './config.js';
import { initAds } from './core/admob.js';

const t0 = performance.now();
// Çeviri katmanı: kart metinlerini (koşullar Türkçe metinden hesaplandıktan sonra) değiştirir
function overlayEvents(cards, L) {
  for (const c of cards) {
    const x = L?.[c.id];
    if (!x) continue;
    for (const k of ['title', 'text', 'log']) if (x[k]) c[k] = x[k];
    (c.options || []).forEach((o, i) => {
      const y = x.options?.[i]; if (!y) return;
      if (y.text) o.text = y.text; if (y.result) o.result = y.result;
      if (y.success && o.success) o.success.result = y.success;
      if (y.fail && o.fail) o.fail.result = y.fail;
    });
  }
}
function overlayQuestions(qs, L) {
  if (!Array.isArray(L) || !L.length) return qs;
  return qs.map((q, i) => L[i] ? { ...q, s: L[i].s ?? q.s, q: L[i].q, a: L[i].a, h: L[i].h ?? q.h } : q);
}
async function boot() {
  const tr = lang !== 'tr';
  const [events, questions, evL, qL, dict] = await Promise.all([
    fetch('data/events.json').then(r => r.json()),
    fetch('data/questions.json').then(r => r.json()),
    tr ? fetch(`data/events.${lang}.json`).then(r => r.json()).catch(() => ({})) : null,
    tr ? fetch(`data/questions.${lang}.json`).then(r => r.json()).catch(() => []) : null,
    tr ? import(`./i18n/${lang}.js`).then(m => m.DICT).catch(() => ({})) : null,
  ]);
  if (tr) { loadDict(dict); installHooks(); document.documentElement.lang = lang; }
  setDeck(events); setJobsRef(JOBS);
  if (tr) overlayEvents(events, evL);
  setBank(tr ? overlayQuestions(questions, qL) : questions);
  window.__deck = events;
  // Mağaza sürümünde geliştirici ayarları kapalı
  if (!DEV) { app.meta.settings.testEnergy = false; app.meta.settings.noAds = false; }
  setAdProvider(kind => app.meta.settings.noAds ? Promise.resolve(true) : adOverlay(kind));
  go(app.life && app.life.alive ? 'life' : app.life ? 'death' : 'title');
  // Reklam SDK'sı ve (AB'de) onay formu: açılış animasyonundan sonra
  setTimeout(() => initAds(), 3500);
  // Açılış animasyonu: stüdyo logosu → oyun logosu (dokununca geçer)
  const sp = document.getElementById('splash');
  if (sp) {
    const end = () => { sp.classList.add('out'); setTimeout(() => sp.remove(), 500); };
    sp.addEventListener('click', end);
    setTimeout(end, Math.max(0, 3300 - (performance.now() - t0)));
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  // Android geri tuşu: açık pencereyi kapat → ana menü → uygulamayı arka plana al
  const Cap = window.Capacitor;
  if (Cap?.isNativePlatform?.() && Cap.Plugins?.App) {
    Cap.Plugins.App.addListener('backButton', () => {
      save();
      const ov = [...document.querySelectorAll('.overlay')].pop();
      if (ov && !document.querySelector('.mg')) { ov.click(); return; }
      if (document.querySelector('.mg')) return; // mini oyun sırasında geri tuşu yok sayılır
      if (app.screen !== 'title') { go('title'); return; }
      Cap.Plugins.App.minimizeApp();
    });
    Cap.Plugins.App.addListener('pause', () => save());
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !location.hostname.match(/^(localhost|127\.)/)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
boot().catch(e => {
  console.error(e);
  document.getElementById('app').innerHTML = `<div class="screen"><h2>Yüklenemedi</h2><p class="muted">${e.message}</p></div>`;
});
