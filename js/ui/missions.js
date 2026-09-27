// Günlük görevler: her gün yenilenir, ödülü enerjidir (geri dönüş sebebi).
import { todayKey } from '../core/util.js';
import { hashString, RNG } from '../core/rng.js';
import { addEnergy } from '../core/energy.js';
import { app, save } from './app.js';
import { h, btn, toast } from './dom.js';
import { sfx } from '../core/audio.js';

const POOL = [
  { id: 'mg', text: 'mini oyun oyna', goal: 3, reward: 15, e: '🎮' },
  { id: 'mg_a', text: 'mini oyunda A ya da S al', goal: 1, reward: 15, e: '🏅' },
  { id: 'year', text: 'yıl tamamla', goal: 1, reward: 20, e: '🗓️' },
  { id: 'event', text: 'olay kartı aç', goal: 2, reward: 10, e: '🃏' },
  { id: 'action', text: 'eylem yap', goal: 5, reward: 15, e: '🎯' },
  { id: 'honest', text: 'dürüst bir karar ver', goal: 1, reward: 15, e: '⭐' },
  { id: 'exam', text: 'sınava gir', goal: 1, reward: 15, e: '📝' },
];

export function missions() {
  const m = app.meta;
  const t = todayKey();
  if (!m.missions || m.missions.date !== t) {
    const r = new RNG(hashString('gorev' + t));
    m.missions = { date: t, list: r.shuffle(POOL).slice(0, 3).map(p => ({ id: p.id, prog: 0, claimed: false })) };
    save();
  }
  return m.missions.list.map(x => ({ ...POOL.find(p => p.id === x.id), ...x }));
}

export function progress(id, n = 1) {
  const list = missions();
  const raw = app.meta.missions.list;
  let hit = false;
  raw.forEach((x, i) => { if (x.id === id && x.prog < list[i].goal) { x.prog = Math.min(list[i].goal, x.prog + n); hit = true; if (x.prog >= list[i].goal) toast(`🎯 Görev tamam: ${list[i].text}`); } });
  if (hit) save();
}

export function missionsCard(rerender) {
  const list = missions();
  if (list.every(x => x.claimed)) return null;
  return h('div.card', { style: { marginTop: '12px' } },
    h('div.row', {}, h('b.grow', {}, '🎯 Günlük görevler'), h('span.tiny.muted', {}, 'her gün yenilenir')),
    list.map((x, i) => h('div.row', { style: { marginTop: '8px' } },
      h('span', { style: { fontSize: '20px' } }, x.e),
      h('div.grow', {}, h('div.small', { style: { fontWeight: 800 } }, `${x.goal > 1 ? x.goal + ' ' : ''}${x.text}`), h('div.bar', { style: { marginTop: '4px', height: '6px' } }, h('i', { style: { width: (x.prog / x.goal * 100) + '%', background: '#29d3a6' } }))),
      x.claimed ? h('span.chip.green', {}, '✓') : x.prog >= x.goal
        ? btn(`⚡+${x.reward}`, () => { app.meta.missions.list[i].claimed = true; addEnergy(app.life.energy, x.reward); sfx.coin(); save(); rerender(); }, 'gold sm')
        : h('span.chip', {}, `${x.prog}/${x.goal}`))));
}
