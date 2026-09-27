// Oynanış akışları: eylem, olay kartı, sınav, kapı, iş arama, reklam.
import { h, btn, sheet, toast, rarityReveal, info, confirmBox } from './dom.js';
import { app, save } from './app.js';
import { sfx, vibrate } from '../core/audio.js';
import { fmtTL, signed, sleep, clamp } from '../core/util.js';
import { showRewarded, adsLeft } from '../core/ads.js';
import { addEnergy } from '../core/energy.js';
import { CONFIG, STATS, SKILLS, statById, skillById } from '../config.js';
import { playMinigame, autoMods } from '../minigames/index.js';
import { mgSkillLevel } from '../sim/stats.js';
import { actionById, resolve as res } from '../sim/actions.js';
import { JOBS, DOORS, EXAMS, jobTitle } from '../sim/careers.js';
import { pickQuestions, levelFor } from '../sim/questions.js';
import { render as renderText } from '../sim/events.js';
import * as Y from '../sim/year.js';
import { progress } from './missions.js';
import { choosePartner, SPOUSE_TRAITS, arcLabel } from '../sim/partner.js';
import { WEALTH } from '../sim/character.js';
import { looks, charisma } from '../sim/traits.js';

const S = () => app.life;

// ——— Reklam (prototipte simülasyon) ———
export function adOverlay(kind) {
  return new Promise(resolve => {
    const kid = S() && S().age < 13;
    let n = 3;
    const cnt = h('b', {}, n);
    const ov = h('div.overlay.center', { style: { zIndex: 200 } }, h('div.sheet', {}, h('div.ad-box', {},
      h('div.tiny.muted', {}, kid ? 'AİLE DOSTU REKLAM · KİŞİSELLEŞTİRİLMEMİŞ' : 'ÖDÜLLÜ REKLAM'),
      h('div.spin'),
      h('h3', {}, 'Reklam oynatılıyor…'),
      h('p.muted.small', {}, 'Prototip: gerçek sürümde AdMob ödüllü reklamı burada gösterilir.'),
      h('div', {}, 'Ödül ', cnt, ' sn sonra'))));
    document.body.append(ov);
    const iv = setInterval(() => { n--; cnt.textContent = n; if (n <= 0) { clearInterval(iv); ov.remove(); sfx.coin(); resolve(true); } }, 1000);
  });
}
export async function watchAd(kind) {
  if (adsLeft(app.meta, kind) <= 0) { toast('Bugünlük bu reklam hakkın bitti.'); return false; }
  const ok = await showRewarded(app.meta, kind);
  save();
  return ok;
}

// Çok reklamlı ödüller: ilerleme kaydedilir, yarıda bırakılırsa kaldığı yerden devam eder.
export function watchAdsSeries(kind, n, title, desc) {
  const m = app.meta;
  m.adTokens = m.adTokens || {};
  if (m.settings.noAds) return Promise.resolve(true);
  return new Promise(resolve => {
    const render = close => h('div.center', {},
      h('div', { style: { fontSize: '48px' } }, '📺'),
      h('h2', {}, title),
      h('p.small.muted', {}, desc),
      h('div.row', { style: { justifyContent: 'center', gap: '8px', margin: '12px 0' } },
        Array.from({ length: n }, (_, i) => h('span', { style: { width: '44px', height: '44px', borderRadius: '12px', display: 'grid', placeItems: 'center', fontSize: '22px', background: i < (m.adTokens[kind] || 0) ? 'linear-gradient(135deg,#ffcf4d,#ff9f3d)' : 'var(--card2)', border: '1px solid var(--line)' } }, i < (m.adTokens[kind] || 0) ? '✓' : i + 1))),
      h('div.btns', {},
        btn(`▶ Reklam izle (${(m.adTokens[kind] || 0) + 1}/${n})`, async () => {
          if (await watchAd(kind)) {
            m.adTokens[kind] = (m.adTokens[kind] || 0) + 1; save();
            if (m.adTokens[kind] >= n) { m.adTokens[kind] = 0; save(); close(true); return; }
            close('again');
          }
        }, 'gold block'),
        btn('Vazgeç — kadere razıyım', () => close(false), 'ghost block')));
    const loop = async () => {
      const r = await sheet(c => render(c), { center: true, dismissable: false });
      if (r === 'again') return loop();
      resolve(!!r);
    };
    loop();
  });
}

// ——— Değişim çipleri ———
function deltaChips(d) {
  const out = [];
  for (const [k, v] of Object.entries(d)) {
    if (Math.abs(v) < 0.3) continue;
    const def = statById[k] || skillById[k];
    const label = k === 'money' ? '💰' : def ? `${def.icon} ${def.name}` : k;
    const val = k === 'money' ? fmtTL(v) : (v > 0 ? '+' : '') + (Math.abs(v) < 10 ? v.toFixed(1) : Math.round(v));
    out.push(h('span.delta' + (v > 0 ? '.up' : '.down'), {}, label, ' ', k === 'money' && v > 0 ? '+' + val : val));
  }
  return out;
}
function linesToChips(lines) {
  const d = {}; const texts = [];
  for (const l of lines) { if (l.text) texts.push(l.text); if (l.k) d[l.k] = (d[l.k] || 0) + l.v; }
  return { chips: deltaChips(d), texts };
}

// ——— Mini oyun çağrısı (ortak) ———
export async function runMg(id, skill, { stakes = 0.3, mods = [], title, extra, outdoor = false } = {}) {
  const s = S();
  const lvl = mgSkillLevel(s, skill);
  const r = await playMinigame(id, {
    skill: lvl, stakes, title, extra: { age: s.age, ...extra },
    mods: autoMods(s, mods, outdoor),
    skipScore: Y.skipScore(s, skill),
    onRetryAd: () => watchAd('retry'),
  });
  s.life.mgPlayed += r.skipped ? 0 : 1;
  if (!r.skipped) { progress('mg'); if (r.score >= 80) progress('mg_a'); }
  if (!r.skipped) s.life.mgBest[id] = Math.max(s.life.mgBest[id] || 0, r.score);
  return r;
}

// ——— Eylem ———
export async function doAction(id, rerender) {
  const s = S();
  const a = actionById[id];
  const lock = Y.canDo(s, a);
  if (lock) { toast('🔒 ' + lock); sfx.bad(); return; }

  if (a.special === 'jobsearch') return jobSearch(rerender);
  if (a.special === 'bizstart') { Y.startBiz(s); save(); toast('🍪 Okulda satış başladı! "İşletmeni yönet" ile kâr et.'); rerender(); return afterAction(rerender); }
  if (a.special === 'save') { const amt = Y.depositSavings(s); save(); toast(`🏦 ${fmtTL(amt)} birikime yatırıldı.`); rerender(); return afterAction(rerender); }
  if (a.special === 'retire') { Y.retire(s); save(); toast('🪑 Emekli oldun. Hayırlı olsun!'); rerender(); return afterAction(rerender); }
  if (a.exam) return runExam(a.exam, { actionId: id, rerender });

  let perf = 60, skipped = false;
  const mg = res(a.mg, s);
  if (mg) {
    const r = await runMg(mg, res(a.mgSkill, s), { stakes: 0.22 + (s.age > 17 ? 0.1 : 0), title: a.name, outdoor: a.cat === 'spor', extra: { scene: sceneFor(a, s) } });
    perf = r.score; skipped = r.skipped;
  }
  const out = Y.performAction(s, id, perf);
  progress('action');
  save();
  rerender();
  await actionResult(a, out, perf, skipped);
  if (out.candidates) { await partnerChoice(out.candidates); save(); rerender(); }
  await afterAction(rerender);
}

// ——— Eş adayı seçimi ———
async function partnerChoice(cands) {
  const s = S();
  const pick = await sheet(close => h('div', {},
    h('h2', {}, '💞 Kiminle yakınlaşacaksın?'),
    h('p.small.muted', {}, 'Anne-babanı seçemezsin ama hayat arkadaşını seçebilirsin. Görünüş ilk göze çarpan şeydir; uzun vadede uyum ve karakter belirleyicidir.'),
    cands.map((c, i) => {
      const T = SPOUSE_TRAITS[c.trait];
      return h('button.opt', { style: { flexDirection: 'column', alignItems: 'stretch', gap: '4px' }, onclick: () => close(i) },
        h('div.row', {}, h('span', { style: { fontSize: '28px' } }, c.gender === 'k' ? '👩' : '👨'), h('div.grow', {}, h('b', {}, `${c.name}, ${c.age}`), h('div.tiny.muted', {}, `${c.job} · ${WEALTH[c.wealth].icon} ${WEALTH[c.wealth].name} aile`)), h('span.chip.accent', {}, arcLabel[c.arc])),
        h('div.row', { style: { gap: '6px', flexWrap: 'wrap' } },
          h('span.chip', {}, `✨ Görünüş ${c.gorunus}`),
          h('span.chip' + (c.compat >= 65 ? '.green' : c.compat < 40 ? '.bad' : ''), {}, `💞 Uyum %${c.compat}`),
          h('span.chip', {}, `${T.icon} ${T.name}`),
          h('span.chip', {}, c.wantsKids ? '👶 Çocuk istiyor' : '🚫 Çocuk istemiyor')),
        h('div.tiny.muted', {}, T.desc));
    }),
    h('div.btns', {}, btn('Hiçbiri, acele etmeyeyim', () => close(-1), 'ghost block'))), { dismissable: false });
  if (pick >= 0) {
    choosePartner(s, cands[pick]);
    Y.log(s, `${cands[pick].name} ile ilişkiye başladı.`, 'rare');
    toast(`❤️ ${cands[pick].name} ile birliktesiniz. "Partnerinle vakit" ile ilişkini besle.`);
  }
}

function sceneFor(a, s) {
  if (a.id === 'tanis') return 'tanisma';
  if (a.id === 'kulup') return 'sinif';
  if (a.id === 'danisman') return 'sunum';
  if ((a.work || a.id === 'sertifika') && s.career.job?.id === 'ogretmen') return 'ders';
  return null;
}

async function actionResult(a, out, perf, skipped) {
  const chips = deltaChips(out.deltas);
  if (!chips.length && !out.lines.length && !out.hint) { toast(`${a.icon} ${a.name} tamamlandı`); return; }
  sfx.good();
  await sheet(close => h('div', {},
    h('div.row', {}, h('span', { style: { fontSize: '34px' } }, a.icon), h('div.grow', {}, h('h2', {}, a.name), h('div.small.muted', {}, a.mg ? (skipped ? `Hızlı geçildi · ${perf} puan` : `Performans: ${perf}/100`) : 'Tamamlandı'))),
    h('div.sp'),
    h('div', {}, chips),
    out.lines.map(l => h('p.small', { style: { margin: '6px 0' } }, l)),
    out.hint ? h('div.tile', { style: { borderColor: '#ffc53d', marginTop: '10px' } }, h('div.tiny', { style: { color: '#ffe08a', fontWeight: 900 } }, '✨ GİZLİ YETENEK İPUCU'), h('div', { style: { fontWeight: 700 } }, out.hint)) : null,
    h('div.btns', {}, btn('Devam', () => close(), 'primary block')),
  ), { center: true });
}

// Eylemden sonra sıradaki olay kartları
export async function afterAction(rerender) {
  const s = S();
  let card;
  while ((card = Y.nextEvent(s))) {
    save();
    await showEvent(card);
    save();
    rerender();
  }
}

// ——— Olay kartı ———
const RAR = { common: 'Sıradan', rare: 'Nadir', epic: 'Epik', legendary: 'Efsanevi' };
export async function showEvent(card) {
  const s = S();
  await rarityReveal(card.rarity);
  if (card.rarity === 'rare') { sfx.rare(); vibrate(20); }
  const idx = await sheet(close => h('div', {},
    h('div.ev-card.' + card.rarity, {},
      h('span.chip.rar', { style: { color: CONFIG.rarity[card.rarity].color, borderColor: CONFIG.rarity[card.rarity].color } }, RAR[card.rarity]),
      h('div.big', {}, card.icon || '📜'),
      h('h2', {}, renderText(s, card.title)),
      h('p', {}, renderText(s, card.text))),
    h('div.sp'),
    card.options.map((o, i) => {
      const ok = Y.optionAvailable(s, o);
      return h('button.opt' + (ok ? '' : '.disabled'), { onclick: () => { sfx.tap(); close(i); } },
        renderText(s, o.text),
        o.mg ? h('span.chip.accent.tag', {}, '🎮 Mini oyun') : o.honest ? h('span.chip.green.tag', {}, '⭐ Dürüst') : !ok ? h('span.chip.tag', {}, '🔒') : null);
    }),
  ), { dismissable: false });
  const opt = card.options[idx];
  progress('event');
  if (opt.honest) progress('honest');
  let mgScore = null;
  if (opt.mg) {
    const r = await runMg(opt.mg, opt.mgSkill, { stakes: opt.stakes ?? 0.4, title: renderText(s, card.title), mods: card.rarity === 'legendary' ? ['efsanevi'] : card.rarity === 'epic' ? ['kritik'] : [], outdoor: ['penalti', 'calim'].includes(opt.mg) });
    mgScore = r.score;
  }
  const out = Y.resolveOption(s, card, idx, mgScore);
  if (out.legend) {
    const L = app.meta.legends[card.id] || { title: card.title, icon: card.icon, count: 0 };
    L.count++; app.meta.legends[card.id] = L;
  }
  save();
  const { chips, texts } = linesToChips(out.lines);
  await sheet(close => h('div', {},
    h('div.center', { style: { fontSize: '44px' } }, out.success === false ? '😔' : out.success ? '🎉' : card.icon),
    out.result ? h('p.center', { style: { fontWeight: 700, fontSize: '16px' } }, out.result) : null,
    mgScore !== null ? h('p.center.small.muted', {}, `Mini oyun: ${mgScore}/100 ${out.success ? '— başarılı!' : ''}`) : null,
    texts.map(t => h('p.center.small', {}, t)),
    h('div.center', {}, chips),
    out.legend ? h('div.tile.center', { style: { borderColor: '#ffc53d', marginTop: '10px' } }, '🌟 ', h('b', {}, 'Efsane albümüne eklendi!')) : null,
    h('div.btns', {}, btn('Devam', () => close(), 'primary block'))), { center: true, dismissable: false });
}

// ——— Sınav ———
export async function runExam(examId, { actionId = null, rerender, doorScoreOnly = false } = {}) {
  const s = S();
  const E = EXAMS[examId];
  if (actionId) {
    const a = actionById[actionId];
    const lock = Y.canDo(s, a);
    if (lock) { toast('🔒 ' + lock); return null; }
    const cost = (a.cost || 0) * s.priceIndex;
    Y.spendActionOnly(s, actionId);
    if (cost) s.money -= cost;
  }
  const level = E.level === 'auto' ? levelFor(s.age) : E.level;
  s.qRecent = s.qRecent || [];
  const questions = pickQuestions(level, E.q, s.qRecent);
  s.qRecent.push(...questions.map(q => q.id).filter(id => id !== 'gen'));
  s.qRecent = s.qRecent.slice(-200);
  const prep = Y.examPrep(s, examId);
  const jokers = {
    ogretmen: !!s.flags.ogretmen,
    ezber: s.year.study >= 2 || (s.studyLog.slice(-1)[0] || 0) >= 3,
    grup: !!s.flags.calismaGrubu,
    sure: s.stats.disiplin >= 60,
  };
  const r = await playMinigame('sinav', {
    skill: prep, stakes: examId === 'karne' ? 0.2 : 0.6, title: `${E.name} · ${E.q} soru · soru başı ${E.t} sn`,
    mods: autoMods(s, examId === 'karne' ? [] : ['kritik']),
    skipScore: clamp(prep - 10, 5, 80),
    extra: { questions, perQ: E.t, prep, jokers, examName: E.name, adJoker: () => watchAd('joker') },
  });
  const sc = Y.examScore(s, examId, r.score);
  progress('exam');
  if (doorScoreOnly) { save(); return sc; }
  const out = Y.applyExam(s, examId, sc);
  save();
  rerender?.();
  const topTxt = ['lgs', 'yks', 'kpss', 'tus'].includes(examId) ? `Türkiye sıralaması: ilk %${sc.top}` : null;
  await sheet(close => h('div', {},
    h('div.center', { style: { fontSize: '44px' } }, sc.score >= 80 ? '🏆' : sc.score >= 55 ? '📄' : '📉'),
    h('h2.center', {}, `${E.name}: ${sc.score} puan`),
    topTxt ? h('p.center', { style: { fontWeight: 800, color: '#ffe08a' } }, topTxt) : null,
    h('div.tile', { style: { marginTop: '10px' } },
      h('div.sum-line', {}, 'Senin cevapların', h('b', {}, `%${Math.round(r.score)}${r.skipped ? ' (atlandı)' : ''}`)),
      h('div.sum-line', {}, 'Karakterin hazırlığı', h('b', {}, prep)),
      h('div.small.muted', { style: { marginTop: '6px' } }, 'Puan = %65 senin cevapların + %30 hazırlık + küçük şans payı')),
    out.lines.map(l => h('p.small.center', {}, l)),
    h('div.btns', {}, btn('Devam', () => close(), 'primary block'))), { center: true, dismissable: false });
  if (out.choices) await choiceSheet(out.choices);
  save();
  rerender?.();
  if (actionId) await afterAction(rerender);
  return sc;
}

async function choiceSheet(ch) {
  const s = S();
  const title = ch.kind === 'school' ? '🏫 Hangi liseye gideceksin?' : '🎓 Tercihini yap';
  const id = await sheet(close => h('div', {},
    h('h2', {}, title),
    h('p.small.muted', {}, ch.kind === 'school' ? 'LGS sonucuna göre girebileceğin okullar:' : 'YKS sıralamana göre girebileceğin bölümler:'),
    ch.list.map(o => h('button.opt', { onclick: () => close(o.id) }, h('span', { style: { fontSize: '24px' } }, o.icon), h('div', {}, h('div', {}, o.name), h('div.tiny.muted', {}, o.desc)))),
  ), { dismissable: false });
  if (ch.kind === 'school') Y.chooseSchool(s, id); else Y.chooseDept(s, id);
  save();
}

// ——— Kapılar ———
export async function doorSheet(id, rerender) {
  const s = S();
  const D = DOORS[id];
  const st = Y.doorStatus(s, id);
  const can = !st.miss.length && Y.epLeft(s) >= 1 && s.energy.value >= CONFIG.actionEnergy[1];
  const go = await sheet(close => h('div', {},
    h('div.row', {}, h('span', { style: { fontSize: '40px' } }, D.icon), h('div.grow', {}, h('h2', {}, D.name), h('div.small.muted', {}, 'Kariyer kapısı'))),
    h('p', {}, D.text),
    h('div.tile', {},
      h('div.small', { style: { fontWeight: 800, marginBottom: '6px' } }, st.miss.length ? '🔒 Eksik koşullar' : '✅ Koşullar tamam'),
      st.miss.map(m => h('div.small', { style: { color: '#ff9db0' } }, '• ' + m))),
    h('p.small.muted', {}, `Kapı puanı = yetenek×0,55 + ${D.exam ? 'sınav' : 'mini oyun'}×0,55 + geçmiş emek (≤20) + bağlantı (≤20) + şans (0–10). 100'ü geçerse kapı açılır.`),
    D.cost ? h('p.small', {}, `Açılış maliyeti: ${fmtTL(D.cost * s.priceIndex)}`) : null,
    h('div.btns', {},
      btn(`🚪 Kapıyı dene (1 EP · ⚡${CONFIG.actionEnergy[1]})`, () => close(true), 'gold block' + (can ? '' : ' disabled')),
      btn('Kapat', () => close(false), 'ghost block'))));
  if (!go) return;
  Y.tryDoorSpend(s, id);
  save();
  let mg;
  if (D.exam) { const sc = await runExam(D.exam, { doorScoreOnly: true }); mg = sc.score; }
  else { const r = await runMg(D.mg, D.mgSkill, { stakes: D.stakes, mods: D.modifiers || [], title: D.name, outdoor: D.mg === 'penalti' || D.mg === 'calim' }); mg = r.score; }
  const ds = Y.doorScore(s, id, mg);
  let open = ds.open;
  if (!open && ds.score >= 90 && (await adOffer('door', `Kapı puanın ${ds.score}. Reklam izleyip +10 puan alırsan kapı açılır!`))) { ds.score += 10; ds.parts.reklam = 10; open = ds.score >= 100; }
  let msg;
  if (open) { msg = Y.openDoor(s, id); if (DOORS[id].open.job) collectJob(DOORS[id].open.job); if (s.career.job) collectJob(s.career.job.id); sfx.level(); vibrate([50, 40, 120]); }
  else Y.failDoor(s, id);
  save(); rerender();
  const L = { yetenek: 'Yetenek', oyun: D.exam ? 'Sınav' : 'Mini oyun', gecmis: 'Geçmiş emek', baglanti: 'Bağlantı', sans: 'Şans', reklam: 'Reklam' };
  await sheet(close => h('div', {},
    h('div.center', { style: { fontSize: '54px' } }, open ? '🚪✨' : '🚪🔒'),
    h('h2.center', {}, open ? 'Kapı açıldı!' : 'Kapı bu sefer açılmadı'),
    h('div.tile', { style: { marginTop: '10px' } },
      Object.entries(ds.parts).filter(([, v]) => v).map(([k, v]) => h('div.sum-line', {}, L[k], h('b', {}, '+' + Math.round(v)))),
      h('div.sum-line', { style: { borderBottom: 0 } }, h('b', {}, 'Toplam'), h('b', { class: open ? 'pos' : 'neg' }, `${Math.round(ds.score)} / 100`))),
    open ? h('p.center', { style: { fontWeight: 700 } }, msg) : h('div', {},
      h('p.small', {}, 'Başarısızlık yolu bitirmez. Seçeneklerin:'),
      h('div.small', {}, '🔁 Seneye yeniden dene (emek ve beceri puanını artırır)'),
      ...(D.side || []).map(t => h('div.small', {}, '↪️ ' + t)),
      h('div.small', {}, '🧭 Tamamen farklı bir yol seç — hayat uzun!')),
    h('div.btns', {}, btn('Devam', () => close(), 'primary block'))), { center: true, dismissable: false });
  await afterAction(rerender);
}

async function adOffer(kind, text) {
  if (adsLeft(app.meta, kind) <= 0) return false;
  const yes = await sheet(close => h('div', {}, h('h3', {}, '📺 Fırsat'), h('p', {}, text), h('div.btns', {}, btn('Reklam izle', () => close(true), 'gold block'), btn('Hayır, teşekkürler', () => close(false), 'ghost block'))), { center: true, dismissable: false });
  if (!yes) return false;
  return watchAd(kind);
}

export function collectJob(jobId) {
  if (!app.meta.careers[jobId]) { app.meta.careers[jobId] = { first: app.meta.lives + 1, name: JOBS[jobId].name }; toast(`🗂️ Meslek koleksiyonu: ${JOBS[jobId].name} açıldı!`); }
}

// ——— İş arama ———
export async function jobSearch(rerender) {
  const s = S();
  const offers = Y.jobOffers(s);
  const ok = offers.filter(o => !o.miss.length).sort((a, b) => b.job.salary - a.job.salary);
  const no = offers.filter(o => o.miss.length);
  const pick = await sheet(close => h('div', {},
    h('h2', {}, '🔎 İş ilanları'),
    h('p.small.muted', {}, 'Başvurmak 1 EP harcar. Maaşı yüksek işler mülakat ister.'),
    ok.length ? ok.map(o => h('button.opt', { onclick: () => close(o.id) },
      h('span', { style: { fontSize: '26px' } }, o.job.icon),
      h('div.grow', {}, h('div', {}, o.job.name), h('div.tiny.muted', {}, `${fmtTL(o.job.salary * s.priceIndex)}/ay · ${o.job.salary >= 30000 ? 'Mülakat' : 'Hemen başla'}`)))) : h('p', {}, 'Şu an uygun ilan yok.'),
    no.length ? h('details', { style: { marginTop: '12px' } }, h('summary.small.muted', {}, `Kilitli ${no.length} meslek (koşullar)`),
      no.map(o => h('div.small', { style: { padding: '6px 0', borderBottom: '1px dashed var(--line)' } }, `${o.job.icon} ${o.job.name}: `, h('span.muted', {}, o.miss.join(', '))))) : null,
    h('div.btns', {}, btn('Kapat', () => close(null), 'ghost block'))));
  if (!pick) return;
  if (s.career.job) {
    if (!(await confirmBox('İş değiştir', `Şu anki işin (${jobTitle(s.career.job)}) bırakılacak. Emin misin?`, 'Evet, başvur'))) return;
  }
  Y.spendActionOnly(s, 'is_ara');
  const J = JOBS[pick];
  let hired = true, score = null;
  if (J.salary >= 30000) {
    const r = await runMg('konusma', 'sosyal', { stakes: 0.35, title: `${J.name} mülakatı`, extra: { scene: 'mulakat' } });
    score = r.score;
    // İlk izlenim: karizma ve görünüş mülakatta biraz etkili; ama asıl belirleyici performans
    const firstImp = Math.round((charisma(s) - 50) / 8 + (looks(s) - 50) / 20);
    const need = Y.interviewNeed(pick) - (s.flags.staj ? 8 : 0) - (s.edu.uniGpa >= 80 ? 5 : 0) - firstImp;
    hired = score >= need;
  }
  if (hired) { Y.hireJob(s, pick); collectJob(pick); sfx.level(); }
  save(); rerender();
  await info(hired ? '🎉 İşe alındın!' : '😔 Olumsuz dönüş', h('p', {}, hired ? `Artık ${J.name} olarak çalışıyorsun. "Mesaiye odaklan" ile performansını artır, terfi al.` : `Mülakat skorun ${score}. Bu iş için yeterli olmadı. Becerilerini geliştirip tekrar dene ya da başka ilanlara bak.`));
  await afterAction(rerender);
}

// ——— Enerji ———
export async function energySheet(rerender) {
  const s = S();
  const left = adsLeft(app.meta, 'energy');
  await sheet(close => h('div', {},
    h('h2', {}, '⚡ Enerji'),
    h('p.small', {}, `Enerji gerçek zamanlı dolar (1 enerji / ${app.meta.settings.testEnergy ? CONFIG.energy.testRegenSeconds : CONFIG.energy.regenSeconds} sn). Oyun kapalıyken de dolmaya devam eder.`),
    h('p.small.muted', {}, `Her yıl tamamlandığında +${CONFIG.energy.newYearBonus} enerji hediye.`),
    h('div.btns', {},
      btn(`📺 Reklam izle: +${CONFIG.energy.adAmount} enerji (bugün ${left} hak)`, async () => {
        if (await watchAd('energy')) { addEnergy(s.energy, CONFIG.energy.adAmount); save(); rerender(); toast(`⚡ +${CONFIG.energy.adAmount} enerji`); close(); }
      }, 'gold block' + (left > 0 ? '' : ' disabled')),
      btn('Kapat', () => close(), 'ghost block'))), { center: true });
}

export async function extraEPByAd(rerender) {
  const s = S();
  if (s.year.adEP) { toast('Bu yıl ek eylem puanını zaten aldın.'); return; }
  if (await watchAd('ep')) { s.year.ep += 1; s.year.adEP = true; save(); rerender(); toast('➕ Bu yıl için +1 eylem puanı'); }
}
