// Uygulama girişi: veriyi yükle, ekranları kaydet, başlat.
import { setDeck, setJobsRef } from './sim/events.js';
import { setBank } from './sim/questions.js';
import { JOBS } from './sim/careers.js';
import { setAdProvider } from './core/ads.js';
import { app, go, save } from './ui/app.js';
import { adOverlay } from './ui/flows.js';
import './ui/screens.js';

async function boot() {
  const [events, questions] = await Promise.all([
    fetch('data/events.json').then(r => r.json()),
    fetch('data/questions.json').then(r => r.json()),
  ]);
  setDeck(events); setJobsRef(JOBS); setBank(questions);
  window.__deck = events;
  setAdProvider(kind => app.meta.settings.noAds ? Promise.resolve(true) : adOverlay(kind));
  document.getElementById('splash')?.remove();
  go(app.life && app.life.alive ? 'life' : app.life ? 'death' : 'title');
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !location.hostname.match(/^(localhost|127\.)/)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
boot().catch(e => {
  console.error(e);
  document.getElementById('app').innerHTML = `<div class="screen"><h2>Yüklenemedi</h2><p class="muted">${e.message}</p></div>`;
});
