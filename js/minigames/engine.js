// Mini oyun çerçevesi: tanıtım → geri sayım → oyun → sonuç.
// Her mini oyun: { id, name, icon, how: [..], play(stage, api) => Promise<0..100> }
// Zorluk: karakter becerisi (ease) oyunu kolaylaştırır ama tek başına kazandırmaz (§7).
import { h, btn } from '../ui/dom.js';
import { sfx, vibrate } from '../core/audio.js';
import { clamp, grade, sleep } from '../core/util.js';
import { fx } from '../core/rng.js';

const REGISTRY = {};
// at: ['kosu', 'job:doktor', ...] → oyun bu eylemin / mesleğin oyun havuzuna da girer
const AT = {};
// Oyunların veri tanımları (t): içerik paketleri bunlara sonradan öğe ekleyebilir (extend)
export const SPEC = {};
export function register(game) {
  REGISTRY[game.id] = game;
  if (game.spec) SPEC[game.id] = game.spec;
  for (const k of game.at || []) (AT[k] ||= []).includes(game.id) || AT[k].push(game.id);
}
export const gamesFor = key => AT[key] || [];
// Var olan bir oyunun havuzuna öğe ekle: extend('esanlam', { pairs: [...] })
export function extend(id, add) {
  const sp = SPEC[id];
  if (!sp) { console.warn('extend: oyun yok', id); return; }
  for (const k in add) { if (Array.isArray(sp[k])) sp[k].push(...add[k]); else sp[k] = add[k]; }
}

// Öğe hafızası: her oyun gösterdiği soru/eşleşmeleri hatırlar; havuz bitmeden aynısı tekrar gelmez.
const ITEM_KEY = 'hayatyolu.itemSeen';
let itemSeen = null;
const loadItems = () => { if (!itemSeen) { try { itemSeen = JSON.parse(localStorage.getItem(ITEM_KEY)) || {}; } catch { itemSeen = {}; } } return itemSeen; };
let itemSaveT = 0;
const saveItems = () => { clearTimeout(itemSaveT); itemSaveT = setTimeout(() => { try { localStorage.setItem(ITEM_KEY, JSON.stringify(itemSeen)); } catch {} }, 300); };
const keyOf = x => typeof x === 'string' ? x : Array.isArray(x) ? String(typeof x[0] === 'string' ? x[0] : JSON.stringify(x[0])) : JSON.stringify(x);
function markItem(gid, k) {
  const m = loadItems(); const arr = (m[gid] ||= []);
  const i = arr.indexOf(k); if (i >= 0) arr.splice(i, 1);
  arr.push(k); if (arr.length > 600) arr.splice(0, arr.length - 600);
  saveItems();
}
const seenIdx = (gid, k) => (loadItems()[gid] || []).indexOf(k);

// Aynı oyunları üst üste oynatmamak için: son oynananları hatırla, havuzdan en uzun süredir oynanmayanı seç.
const RECENT_KEY = 'hayatyolu.mgRecent';
let recent = null;
const loadRecent = () => { if (!recent) { try { recent = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { recent = []; } } return recent; };
export function markPlayed(id) {
  const r = loadRecent().filter(x => x !== id);
  r.push(id); recent = r.slice(-150);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch {}
}
export function pickFresh(list) {
  const ids = [...new Set(list)].filter(id => REGISTRY[id]);
  if (!ids.length) return list[0];
  const r = loadRecent();
  const unseen = ids.filter(id => !r.includes(id));
  if (unseen.length) return fx.pick(unseen);
  // Hepsi yakın zamanda oynandıysa en eskilerden (ilk üçte biri) birini seç
  const byAge = ids.slice().sort((a, b) => r.lastIndexOf(a) - r.lastIndexOf(b));
  return fx.pick(byAge.slice(0, Math.max(1, Math.ceil(byAge.length / 3))));
}
export const getGame = id => REGISTRY[id];
export const allGames = () => Object.values(REGISTRY);

export const MODIFIERS = {
  yagmur:   { name: 'Yağmur',     icon: '🌧️', hard: 0.08 },
  gece:     { name: 'Gece',       icon: '🌙', hard: 0.06 },
  kalabalik:{ name: 'Kalabalık',  icon: '📣', hard: 0.05 },
  sessiz:   { name: 'Sessiz salon', icon: '🤫', hard: -0.03 },
  yorgun:   { name: 'Yorgun',     icon: '🥱', hard: 0.08, time: 0.9 },
  sakat:    { name: 'Sakat',      icon: '🩹', hard: 0.12 },
  stresli:  { name: 'Stresli',    icon: '😰', hard: 0.07, time: 0.92 },
  motive:   { name: 'Motivasyon', icon: '🔥', hard: -0.08, time: 1.1 },
  kritik:   { name: 'Kritik an',  icon: '⚠️', hard: 0.1 },
  efsanevi: { name: 'Efsanevi',   icon: '🌟', hard: 0.18 },
  zayif:    { name: 'Zayıf rakip', icon: '🐣', hard: -0.12 },
  guclu:    { name: 'Güçlü rakip', icon: '🦁', hard: 0.14 },
};

// Karakter durumuna göre otomatik değiştiriciler
export function autoMods(state, base = [], outdoor = false) {
  const m = new Set(base);
  if (state) {
    const z = state.traits?.mizac;
    const stressAt = z === 'sakin' ? 22 : z === 'kaygili' ? 48 : 35;
    if (state.stats.mutluluk < stressAt) m.add('stresli');
    else if (state.stats.mutluluk > 78) m.add('motive');
    if (state.stats.saglik < 40 || state.energy.value < 20) m.add('yorgun');
  }
  if (outdoor) {
    if (fx.chance(0.18)) m.add('yagmur');
    if (fx.chance(0.12)) m.add('gece');
  }
  return [...m].slice(0, 3);
}

function difficulty(skill, stakes, mods) {
  const modHard = mods.reduce((a, k) => a + (MODIFIERS[k]?.hard || 0), 0);
  // Becerisi düşük olan için oyun gerçekten zor, ustası için rahat (üstel eğri)
  return clamp(0.12 + stakes * 0.5 + modHard + Math.pow(1 - skill / 100, 1.3) * 0.62, 0.05, 1);
}

// ctx: { skill 0–100, stakes 0–1, mods [], title, allowSkip, skipScore, onRetryAd(): Promise<bool>, extra }
export async function playMinigame(id, ctx = {}) {
  const game = REGISTRY[id];
  if (!game) { console.warn('Mini oyun yok:', id); return { score: ctx.skipScore ?? 50, skipped: true }; }
  const skill = clamp(ctx.skill ?? 50, 0, 100);
  const stakes = ctx.stakes ?? 0.3;
  const mods = ctx.mods || [];
  const diff = difficulty(skill, stakes, mods);
  const timeMul = mods.reduce((a, k) => a * (MODIFIERS[k]?.time || 1), 1);

  markPlayed(id); // tanıtımı görüp geri dönse de bir dahaki sefere başka oyun gelsin
  const root = h('div.mg');
  const inner = h('div.mg-inner');
  root.append(inner);
  document.body.append(root);

  const cleanup = [];
  const close = () => { cleanup.forEach(f => { try { f(); } catch {} }); root.remove(); };

  // ——— Tanıtım ———
  const choice = await new Promise(res => {
    const dots = Math.round(1 + diff * 4);
    inner.replaceChildren(h('div.mg-intro', {},
      h('div.ic', {}, game.icon),
      h('h2', {}, game.name),
      ctx.title ? h('p.center.muted', { style: { margin: '0 0 4px' } }, ctx.title) : null,
      h('div.row', { style: { justifyContent: 'center', gap: '14px', marginTop: '8px' } },
        h('div.col', { style: { alignItems: 'center', gap: '4px' } }, h('span.tiny.muted', {}, 'ZORLUK'), h('div.diff-meter', {}, [1, 2, 3, 4, 5].map(i => h('i' + (i <= dots ? '.on' : ''))))),
        h('div.col', { style: { alignItems: 'center', gap: '4px' } }, h('span.tiny.muted', {}, 'KARAKTER BECERİSİ'), h('b', {}, Math.round(skill))),
      ),
      mods.length ? h('div.row', { style: { justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px', gap: '6px' } },
        mods.map(k => h('span.chip' + ((MODIFIERS[k]?.hard || 0) > 0 ? '.warn' : '.green'), {}, MODIFIERS[k]?.icon, ' ', MODIFIERS[k]?.name))) : null,
      h('div.how', {}, h('ul', {}, game.how.map(t => h('li', {}, t)))),
      skill >= 60 ? h('p.small.center', { style: { color: '#8ff0c4', margin: '0 0 10px' } }, '✨ Yüksek becerin oyunu kolaylaştırıyor.')
        : skill < 30 ? h('p.small.center', { style: { color: '#ff9db0', margin: '0 0 10px' } }, '⚠️ Bu alanda deneyimin yok denecek kadar az: oyun zor olacak. Emek verdikçe kolaylaşır.') : null,
      h('div.col', {},
        btn('▶  Oyna', () => res('play'), 'primary block'),
        ctx.allowSkip !== false ? btn(`⏭  Hızlı geç (tahmini ${ctx.skipScore ?? 40} puan)`, () => res('skip'), 'ghost block') : null,
        ctx.allowCancel !== false ? h('button.btn.ghost.block', { 'data-back': '1', onclick: () => res('cancel') }, '← Geri') : null,
      ),
    ));
  });
  if (choice === 'cancel') { close(); return { score: null, cancelled: true }; }
  if (choice === 'skip') { close(); return { score: ctx.skipScore ?? 40, skipped: true }; }

  let result;
  let attempt = 0;
  while (true) {
    attempt++;
    // ——— Oyun alanı ———
    const scoreEl = h('div.sc', {}, '');
    const timerI = h('i', { style: { width: '100%' } });
    const timer = h('div.bar.mg-timer', {}, timerI);
    const stage = h('div.mg-stage');
    // Geri bildirim yazıları oyun alanının üstünde ayrılmış tek satırda çıkar:
    // oyunun kendi çizdiği yazılarla (GOL, ISKA…) asla üst üste binmez, yenisi eskisinin yerini alır.
    const msg = h('div.mg-msg');
    inner.replaceChildren(
      h('div.mg-head', {}, h('span', { style: { fontSize: '24px' } }, game.icon), h('span.t', {}, game.name), scoreEl),
      timer, msg, stage);
    let msgT = 0;
    // Geri sayım
    const cd = h('div.countdown');
    stage.append(cd);
    for (const n of ['3', '2', '1']) { cd.replaceChildren(h('span', {}, n)); sfx.tick(); await sleep(520); }
    cd.remove();

    const localClean = [];
    const api = {
      skill, ease: skill / 100, stakes, diff, mods: new Set(mods), timeMul, rng: fx, extra: ctx.extra || {},
      // Görülmeyenler önce (karışık), sonra en eski görülenler; take verilirse ilk take öğe görüldü sayılır
      fresh(list, keyFn = keyOf, take = 0) {
        const sh = fx.shuffle(list.slice());
        const unseen = sh.filter(x => seenIdx(id, keyFn(x)) < 0);
        const seen = sh.filter(x => seenIdx(id, keyFn(x)) >= 0).sort((a, b) => seenIdx(id, keyFn(a)) - seenIdx(id, keyFn(b)));
        const out = [...unseen, ...seen];
        for (const x of out.slice(0, take)) markItem(id, keyFn(x));
        return out;
      },
      mark(x, keyFn = keyOf) { markItem(id, keyFn(x)); },
      isSeen(x, keyFn = keyOf) { return seenIdx(id, keyFn(x)) >= 0; },
      setTimer(f) { timerI.style.width = clamp(f, 0, 1) * 100 + '%'; timer.classList.toggle('low', f < 0.25); },
      setScore(t) { scoreEl.textContent = t; },
      hideTimer() { timer.style.visibility = 'hidden'; },
      onCleanup(fn) { localClean.push(fn); },
      feedback(text, color = '#fff') {
        const el = h('span.mg-fb', { style: { color } }, text);
        msg.replaceChildren(el);
        clearTimeout(msgT); msgT = setTimeout(() => el.remove(), 900);
      },
      good(text = 'Harika!') { sfx.good(); vibrate(15); api.feedback(text, '#3ddc97'); },
      bad(text = 'Olmadı') { sfx.bad(); vibrate([30, 30, 30]); api.feedback(text, '#ff5b7a'); },
      sfx, vibrate,
      // Süre sayacı: onTick(kalan oran), süre bitince resolve
      timerLoop(seconds, onEnd) {
        const total = seconds * timeMul * 1000;
        const t0 = performance.now();
        let stopped = false, raf;
        const step = () => {
          if (stopped) return;
          const left = 1 - (performance.now() - t0) / total;
          api.setTimer(left);
          if (left <= 0) { stopped = true; onEnd(); return; }
          raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        const stop = () => { stopped = true; cancelAnimationFrame(raf); };
        localClean.push(stop);
        return { stop, elapsed: () => (performance.now() - t0) / 1000, left: () => Math.max(0, 1 - (performance.now() - t0) / total) };
      },
      canvas(opts = {}) {
        const c = h('canvas');
        stage.append(c);
        const ctx2 = c.getContext('2d');
        const fit = () => {
          const r = stage.getBoundingClientRect();
          const dpr = Math.min(2, window.devicePixelRatio || 1);
          c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr);
          ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
          c._w = r.width; c._h = r.height;
        };
        fit();
        window.addEventListener('resize', fit);
        localClean.push(() => window.removeEventListener('resize', fit));
        return { c, ctx: ctx2, get W() { return c._w; }, get H() { return c._h; } };
      },
      loop(fn) {
        let raf, last = performance.now(), on = true;
        const f = now => { if (!on) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; fn(dt, now); raf = requestAnimationFrame(f); };
        raf = requestAnimationFrame(f);
        const stop = () => { on = false; cancelAnimationFrame(raf); };
        localClean.push(stop);
        return stop;
      },
    };
    let score;
    try {
      score = await game.play(stage, api);
    } catch (e) {
      console.error(e); score = ctx.skipScore ?? 40;
    }
    localClean.forEach(f => { try { f(); } catch {} });
    score = clamp(Math.round(score), 0, 100);
    result = { score, skipped: false };

    // ——— Sonuç ———
    const g = grade(score);
    score >= 65 ? sfx.level() : score >= 45 ? sfx.good() : sfx.bad();
    const again = await new Promise(res => {
      const canRetry = ctx.onRetryAd && attempt === 1 && score < 70;
      inner.replaceChildren(h('div.mg-result', {},
        h('div.grade', { style: { color: g.c, textShadow: `0 0 40px ${g.c}` } }, g.g),
        h('div.score', {}, `${score} / 100`),
        h('p.muted', {}, score >= 92 ? 'Kusursuz! Efsane bir performans.' : score >= 80 ? 'Çok iyi iş çıkardın!' : score >= 65 ? 'Güzel, sağlam bir performans.' : score >= 45 ? 'Fena değil. Biraz daha pratik!' : 'Bu sefer olmadı. Pes etmek yok!'),
        h('div.col', { style: { marginTop: '18px' } },
          h('button.btn.primary.block', { 'data-back': '1', onclick: () => res(false) }, 'Devam'),
          canRetry ? btn('📺 Reklam izle, bir kez daha dene', async () => { if (await ctx.onRetryAd()) res(true); }, 'gold block') : null,
        ),
      ));
    });
    if (!again) break;
  }
  close();
  return result;
}
