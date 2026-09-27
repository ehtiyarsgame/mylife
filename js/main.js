// Uygulama girişi: veriyi yükle, ekranları kaydet, başlat.
import { setDeck, setJobsRef } from './sim/events.js';
import { setBank } from './sim/questions.js';
import { JOBS } from './sim/careers.js';
import { setAdProvider } from './core/ads.js';
import { app, go, save } from './ui/app.js';
import { adOverlay } from './ui/flows.js';
import './ui/screens.js';

const t0 = performance.now();
async function boot() {
  const [events, questions] = await Promise.all([
    fetch('data/events.json').then(r => r.json()),
    fetch('data/questions.json').then(r => r.json()),
  ]);
  setDeck(events); setJobsRef(JOBS); setBank(questions);
  window.__deck = events;
  setAdProvider(kind => app.meta.settings.noAds ? Promise.resolve(true) : adOverlay(kind));
  go(app.life && app.life.alive ? 'life' : app.life ? 'death' : 'title');
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
