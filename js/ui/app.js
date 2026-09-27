// Uygulama durumu: aktif hayat + kalıcı meta. Tek yerde tutulur, her değişiklikte kaydedilir.
import { loadLife, saveLife, loadMeta, saveMeta, clearLife } from '../core/store.js';
import { setAudio } from '../core/audio.js';

export const app = {
  meta: loadMeta(),
  life: loadLife(),
  screen: null,
  tab: 'yil',
};
setAudio(app.meta.settings);

export function save() {
  if (app.life) saveLife(app.life);
  saveMeta(app.meta);
}
export function endLifeSave() { clearLife(); app.life = null; saveMeta(app.meta); }

const routes = {};
export function route(name, fn) { routes[name] = fn; }
export function go(name, ...args) {
  app.screen = name;
  const root = document.getElementById('app');
  root.replaceChildren();
  window.scrollTo(0, 0);
  routes[name](root, ...args);
}
