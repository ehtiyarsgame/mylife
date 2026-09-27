// Yerel kayıt. Bulut yedeği için saveLife/saveMeta çağrıları tek noktadan geçer.
const LIFE_KEY = 'hayatyolu.life.v1';
const META_KEY = 'hayatyolu.meta.v1';

const mem = {};
const ls = (() => {
  try {
    const k = '__hy_test__';
    localStorage.setItem(k, '1'); localStorage.removeItem(k);
    return localStorage;
  } catch {
    return { getItem: k => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; }, removeItem: k => { delete mem[k]; } };
  }
})();

export function loadLife() {
  try { return JSON.parse(ls.getItem(LIFE_KEY)); } catch { return null; }
}
export function saveLife(state) {
  try { ls.setItem(LIFE_KEY, JSON.stringify(state)); } catch (e) { console.warn('Kayıt yazılamadı', e); }
}
export function clearLife() { ls.removeItem(LIFE_KEY); }

export function defaultMeta() {
  return {
    lives: 0,
    careers: {},          // meslek koleksiyonu: id -> {first: yaşam no, name}
    legends: {},          // efsane albümü: kart id -> {title, count}
    albums: [],           // bitmiş hayatların özetleri (son 30)
    perks: { hints: 0 },  // kalıcı ilerleme
    daily: {},            // tarih -> en iyi skor
    settings: { sound: true, haptics: true, testEnergy: false },
    ads: { date: '', counts: {} },
    seenTutorial: false,
  };
}
export function loadMeta() {
  try {
    const m = JSON.parse(ls.getItem(META_KEY));
    if (!m) return defaultMeta();
    const d = defaultMeta();
    return { ...d, ...m, settings: { ...d.settings, ...m.settings }, perks: { ...d.perks, ...m.perks } };
  } catch { return defaultMeta(); }
}
export function saveMeta(meta) {
  try { ls.setItem(META_KEY, JSON.stringify(meta)); } catch {}
}
