// Ana oyun ekranı.
import { h, btn, sheet, toast, bar, statColor, confirmBox, info } from './dom.js';
import { app, save, go } from './app.js';
import { sfx, vibrate } from '../core/audio.js';
import { fmtTL, fmtTime, signed, clamp } from '../core/util.js';
import { T } from '../core/i18n.js';
import { tickEnergy, secondsToNext, secondsToFull } from '../core/energy.js';
import { CONFIG, STATS, SKILLS, statById, skillById } from '../config.js';
import { availableActions, CATEGORIES, actionCost, stageId, resolve as res } from '../sim/actions.js';
import { JOBS, DOORS, DEPTS, EXAMS, PATHS, ALANLAR, jobTitle, deptById, examQ } from '../sim/careers.js';
import { incomeTax } from '../sim/finance.js';
import { financeTab } from './financeTab.js';
import { BIZ_STEPS, nextStepReqs, advanceBiz, trendText } from '../sim/business.js';
import { hintFor, stageOf, ceilingOf } from '../sim/stats.js';
import { WEALTH, PLACE, RELATION, RARE } from '../sim/character.js';
import * as Y from '../sim/year.js';
import * as F from './flows.js';
import { looks, charisma, MIZAC, traitLabel } from '../sim/traits.js';
import { homeBudget, homeNeed, giveToFamily, livingHome, stressLabel, nextStep, HOME } from '../sim/household.js';
import { SPOUSE_TRAITS } from '../sim/partner.js';
import { DOMAINS, atRisk, domainsDone } from '../sim/balance.js';
import { missionsCard, progress } from './missions.js';

const S = () => app.life;
let ticker = null;
let busy = false;

export function avatarOf(s) {
  const k = s.gender === 'k';
  if (s.age <= 3) return '👶';
  if (s.age <= 12) return k ? '👧' : '👦';
  if (s.age <= 17) return k ? '👩‍🎓' : '👨‍🎓';
  if (s.age >= 60) return k ? '👵' : '👴';
  const j = s.career.job?.id;
  const jobE = { doktor: k ? '👩‍⚕️' : '👨‍⚕️', hemsire: k ? '👩‍⚕️' : '👨‍⚕️', muhendis: k ? '👩‍🔧' : '👨‍🔧', yazilimci: k ? '👩‍💻' : '👨‍💻', cirak: k ? '👩‍🔧' : '👨‍🔧', ciftci: k ? '👩‍🌾' : '👨‍🌾', ogretmen: k ? '👩‍🏫' : '👨‍🏫', polis: k ? '👮‍♀️' : '👮‍♂️', futbolcu: '⛹️', muzisyen: k ? '👩‍🎤' : '👨‍🎤', tasarimci: k ? '👩‍🎨' : '👨‍🎨' };
  if (jobE[j]) return jobE[j];
  if (s.career.biz && s.career.biz.step >= 2) return k ? '👩‍💼' : '👨‍💼';
  return k ? '👩' : '👨';
}

const STAGE_E = { bebek: '👶', ilkokul: '🎒', orta: '📐', lise: '🎓', genc: '🚀', yetiskin: '🏡', olgun: '🌅' };

export function lifeScreen(root) {
  if (ticker) clearInterval(ticker);
  const s = S();
  if (!s.year) Y.startYear(s);
  tickEnergy(s.energy, app.meta);

  const render = () => {
    const y0 = window.scrollY;
    root.replaceChildren(buildScreen(render));
    window.scrollTo(0, y0);
  };
  render();
  ticker = setInterval(() => {
    if (app.screen !== 'life') { clearInterval(ticker); return; }
    const before = s.energy.value;
    const changed = tickEnergy(s.energy, app.meta);
    // Enerji bir eylem maliyetini geçtiyse kilitler açılsın diye ekranı yeniden çiz
    if (changed && [CONFIG.restEnergy, ...Object.values(CONFIG.actionEnergy)].some(c => before < c && s.energy.value >= c) && !document.querySelector('.overlay, .mg')) { save(); render(); return; }
    const el = document.getElementById('en-val');
    if (!el) return;
    el.textContent = Math.floor(s.energy.value);
    document.getElementById('en-bar').style.width = clamp(s.energy.value / s.energy.max * 100, 0, 100) + '%';
    const nx = secondsToNext(s.energy, app.meta);
    document.getElementById('en-next').textContent = s.energy.value >= s.energy.max ? 'Dolu' : `+1 ${fmtTime(nx)} · dolu ${fmtTime(secondsToFull(s.energy, app.meta))}`;
    if (changed) save();
  }, 1000);
}

function buildScreen(render) {
  const s = S();
  const st = stageOf(s.age);
  const wrap = h('div.screen');
  // Üst çubuk
  wrap.append(h('div.topbar', {},
    h('div.avatar', {}, avatarOf(s)),
    h('div.who.grow', {},
      h('h2', {}, `${s.name} ${s.surname}`),
      h('div.muted', {}, `${s.age} yaş · ${st.name} · ${s.calendarYear}`),
      s.career.job ? h('div.tiny', { style: { color: '#c9c2ff', fontWeight: 800 } }, `${JOBS[s.career.job.id].icon} ${jobTitle(s.career.job)}`) : s.edu.stage === 'uni' ? h('div.tiny', { style: { color: '#c9c2ff', fontWeight: 800 } }, `🎓 ${deptById[s.edu.dept].name} ${s.edu.uniYears + 1}. sınıf`) : null),
    h('button.icon-btn', { onclick: () => menuSheet() }, '☰')));
  // HUD: iki eşit kutu + tam genişlik stat şeridi (içerik ne olursa olsun yükseklik sabit)
  const full = s.energy.value >= s.energy.max;
  wrap.append(h('div.hud', {},
    h('div.card.energy', { onclick: () => F.energySheet(render) },
      h('div.hud-top', {}, h('span.hud-ic', {}, '⚡'), h('span.val', { id: 'en-val' }, Math.floor(s.energy.value)), h('span.muted.small', {}, `/${s.energy.max}`), h('span.grow'), h('span.plus-btn', {}, '+')),
      h('div.bar', {}, h('i', { id: 'en-bar', style: { width: clamp(s.energy.value / s.energy.max * 100, 0, 100) + '%' } })),
      h('div.hud-sub', { id: 'en-next' }, full ? 'Dolu' : '…')),
    h('div.card.money', { onclick: () => { app.tab = 'ev'; render(); } },
      h('div.hud-top', {}, h('span.hud-ic', {}, s.age < 18 ? '👛' : '💰'), h('span.val', { style: { color: s.money < 0 ? '#ff5b7a' : '', fontSize: fmtTL(s.money).length > 12 ? '14px' : fmtTL(s.money).length > 10 ? '15.5px' : '' } }, fmtTL(s.money))),
      h('div.hud-sub', {}, s.age < 18
        ? (s.age >= 6 ? `Harçlık ${fmtTL(Y.allowanceWeekly(s))}/hafta` : 'Harçlık yok')
        : s.savings > 0 ? `🏦 ${fmtTL(s.savings)}` : 'Cebindeki'),
      h('div.hud-sub', {}, s.age < 18 ? 'Cebindeki para' : `Endeks ×${s.priceIndex.toFixed(2)}`))));
  wrap.append(h('div.stat-strip', {},
    [['⭐', 'İtibar', s.stats.itibar], ['😊', 'Mutluluk', s.stats.mutluluk], ['❤️', 'Sağlık', s.stats.saglik], ['🧠', 'Zekâ', s.stats.zeka]].map(([e, n, v]) =>
      h('div', { title: n }, h('span', {}, e), h('b', {}, Math.round(v)), h('span.tiny.muted', {}, n)))));
  wrap.append(yearCard(render));
  // Sekme içeriği
  const tab = app.tab;
  if (tab === 'yil') wrap.append(...actionsTab(render));
  if (tab === 'ben') wrap.append(...meTab(render));
  if (tab === 'kariyer') wrap.append(...careerTab(render));
  if (tab === 'gunluk') wrap.append(...logTab());
  if (tab === 'ev') wrap.append(...homeTab(render));
  if (tab === 'finans') wrap.append(...financeTab(render));
  // Sekme çubuğu (Finans 18 yaşında açılır)
  const tabs = [['yil', '🗓️', 'Bu yıl'], ['ev', '🏠', 'Ev'], ['ben', '🧬', 'Ben'], ['kariyer', '💼', 'Kariyer'], ...(s.age >= 18 ? [['finans', '📈', 'Finans']] : []), ['gunluk', '📖', 'Günlük']];
  wrap.append(h('div.tabs', {}, tabs.map(([id, e, n]) => h('button' + (tab === id ? '.on' : ''), { onclick: () => { app.tab = id; sfx.tap(); window.scrollTo(0, 0); render(); } }, h('b', {}, e), n))));
  return wrap;
}

function yearCard(render) {
  const s = S();
  const y = s.year;
  const st = stageOf(s.age);
  const c = Y.canEndYear(s);
  const infant = Y.isInfant(s);
  const card = h('div.card.year-card');
  card.append(h('div.row', {},
    h('span', { style: { fontSize: '26px' } }, STAGE_E[st.id]),
    h('div.grow', {}, h('b', {}, `${s.age}. yaşın`), h('div.tiny.muted', {}, infant ? 'Bebeklikte kararları ailen verir' : 'Eylemlerini seç; tüm eylem puanını harcayınca yıl tamamlanır')),
    !infant && !y.adEP ? h('button.btn.sm', { onclick: () => F.extraEPByAd(render), title: 'Reklam izle, +1 EP' }, '📺 +1 EP') : null));
  if (!infant) {
    card.append(h('div.row', { style: { marginTop: '10px' } },
      h('div.ep-dots', {}, Array.from({ length: y.ep }, (_, i) => h('i' + (i < y.used ? '.on' : '')))),
      h('span.grow'),
      h('span.small', { style: { fontWeight: 800 } }, `Eylem ${y.used}/${y.ep} EP`)));
    if (s.stats.mutluluk < 30 || s.stats.saglik < 25) card.append(h('div.tiny', { style: { color: '#ffb547', marginTop: '6px' } }, s.stats.saglik < 25 ? '⚠️ Sağlığın çok düşük: bu yıl −2 EP' : '⚠️ Mutsuzsun: bu yıl −1 EP'));
  }
  for (const t of y.tasks) {
    if (t.choice === 'alan') {
      card.append(h('div.task' + (t.done ? '.done' : ''), {},
        h('span', { style: { fontSize: '22px' } }, t.done ? '✅' : '🧭'),
        h('div.grow', {}, h('b', {}, 'Alan seçimi'), h('div.tiny.muted', {}, t.done ? (ALANLAR[s.edu.alan]?.name ?? '') : 'Lise 2: Sayısal, Eşit Ağırlık, Sözel ya da Dil. Geleceğini belirler!')),
        t.done ? null : btn('Seç', () => guard(async () => { await F.alanSheet(); render(); }), 'gold sm')));
      continue;
    }
    const E = EXAMS[t.exam];
    card.append(h('div.task' + (t.done ? '.done' : ''), {},
      h('span', { style: { fontSize: '22px' } }, t.done ? '✅' : '📝'),
      h('div.grow', {}, h('b', {}, E.name), h('div.tiny.muted', {}, t.done ? `Puan: ${t.score}` : `${examQ(t.exam, s.age)} soru · zorunlu · hazırlığın ${Y.examPrep(s, t.exam)}`)),
      t.done ? null : btn('Sınava gir', () => guard(() => F.runExam(t.exam, { rerender: render })), 'gold sm')));
  }
  const need = Y.workNeed(s);
  if (need && !infant) {
    const ok = y.workDone >= need;
    card.append(h('div.task' + (ok ? '.done' : ''), {},
      h('span', { style: { fontSize: '22px' } }, ok ? '✅' : '💼'),
      h('div.grow', {}, h('b', {}, `Mesai ${Math.min(y.workDone, need)}/${need}`), h('div.tiny.muted', {}, ok ? 'Maaşın tam yatacak' : 'Maaş, işe gittiğin kadar yatar. Hiç gitmezsen kovulursun.')),
      ok ? null : btn('İşe git', () => guard(() => F.doAction('mesai', render)), 'gold sm')));
  }
  if (livingHome(s) && s.home.stress >= 30 && !infant) {
    const st = stressLabel(s.home.stress);
    card.append(h('div.task', { style: { borderColor: st.c, background: 'rgba(255,91,122,.08)' } }, h('span', { style: { fontSize: '22px' } }, st.e), h('div.grow', {}, h('b', {}, `Evde durum: ${st.t}`), h('div.tiny.muted', {}, 'Ailenin paraya ihtiyacı var. Çalışıp destek olabilirsin (Ev sekmesi).')), btn('Ev', () => { app.tab = 'ev'; render(); }, 'sm')));
  }
  const risk = !infant ? atRisk(s) : [];
  if (risk.length) card.append(h('div.task', { style: { borderColor: '#ff8a5b', background: 'rgba(255,138,91,.08)' } },
    h('span', { style: { fontSize: '22px' } }, '⚖️'),
    h('div.grow', {}, h('b', {}, T('İhmal etme: {x}', { x: risk.map(r => `${r.icon} ${T(r.name)}`).join(', ') })), h('div.tiny.muted', {}, risk.map(r => `${r.name}: ${r.neglect}. yıl olacak`).join(' · ') + '. Yıl sonunda bedeli var!'))));
  const pend = Y.pendingEventCount(s);
  if (pend > 0 && !infant) card.append(h('div.task', { style: { borderColor: '#b36bff', background: 'rgba(179,107,255,.1)' } }, h('span', { style: { fontSize: '22px' } }, '🃏'), h('b.grow', {}, `${pend} olay kartı seni bekliyor`), btn('Aç', () => guard(() => F.afterAction(render)), 'sm')));
  if (infant) {
    card.append(h('div.sp'), btn('▶  Yılı yaşa', () => guard(async () => { await F.afterAction(render); await finishYear(render); }), 'primary block'));
  } else {
    card.append(h('div.sp'), btn(c.ok ? '✔  Yılı tamamla' : `Yılı tamamla`, () => guard(() => c.ok ? finishYear(render) : (toast('⏳ ' + c.reasons.join(' · ')), sfx.bad())), (c.ok ? 'green' : '') + ' block'));
    if (!c.ok) card.append(h('div.tiny.muted.center', { style: { marginTop: '6px' } }, c.reasons.join(' · ')));
  }
  return card;
}

async function guard(fn) {
  if (busy) return;
  busy = true;
  try { await fn(); } catch (e) { console.error(e); toast('Hata: ' + e.message); } finally { busy = false; }
}

function actionsTab(render) {
  const s = S();
  const out = [];
  const mc = missionsCard(render);
  if (mc) out.push(mc);
  if (Y.isInfant(s)) {
    out.push(h('div.card', { style: { marginTop: '12px' } }, h('div.center', { style: { fontSize: '48px' } }, '🍼'), h('p.center', {}, 'Henüz çok küçüksün. Ailen senin için seçimler yapacak; olay kartlarında sen de söz sahibisin!'), h('p.center.small.muted', {}, '6 yaşında ilkokul başlar ve eylemler açılır.')));
    return out;
  }
  // Fırsatlar: kapılar ve işletme basamağı
  const doors = Y.visibleDoors(s);
  const nb = s.career.biz ? nextStepReqs(s) : null;
  if (doors.length || (nb && !nb.miss.length)) {
    out.push(h('div.cat-head', {}, '🚪 Fırsatlar'));
    for (const id of doors) {
      const D = DOORS[id]; const st = Y.doorStatus(s, id);
      out.push(h('button.act.door', { onclick: () => guard(() => F.doorSheet(id, render)) },
        h('div.ic', {}, D.icon),
        h('div.grow', {}, h('div.nm', {}, D.name), h('div.ds', {}, st.miss.length ? '🔒 ' + st.miss.slice(0, 2).join(' · ') : '✅ Koşullar tamam — denemeye hazır!')),
        h('div.cost', {}, h('span.chip.gold', {}, 'Kapı'), h('span.chip', {}, '1 EP'))));
    }
    if (nb && !nb.miss.length) out.push(h('button.act.special', { onclick: () => { app.tab = 'kariyer'; render(); } }, h('div.ic', {}, nb.info.icon), h('div.grow', {}, h('div.nm', {}, `Yeni basamak: ${nb.info.name}`), h('div.ds', {}, 'İşletmeni büyütmeye hazırsın (Kariyer sekmesi)')), h('span.chip.green', {}, 'Hazır')));
  }
  const acts = availableActions(s);
  const byCat = {};
  for (const a of acts) (byCat[a.cat] ||= []).push(a);
  for (const [cat, list] of Object.entries(byCat)) {
    const C = CATEGORIES[cat];
    out.push(h('div.cat-head', {}, C.icon, ' ', C.name, h('span', {}, `· ${list.length}`)));
    for (const a of list) out.push(actionCard(a, render));
  }
  return out;
}

function actionCard(a, render) {
  const s = S();
  const lock = Y.canDo(s, a);
  const { money } = actionCost(a, s);
  const mg = res(a.mg, s);
  const en = Y.energyCost(a);
  return h('button.act' + (lock ? '.locked' : '') + (a.special ? '.special' : ''), { onclick: () => guard(() => F.doAction(a.id, render)) },
    h('div.ic', {}, a.icon),
    h('div.grow', {},
      h('div.nm', {}, a.name, mg ? h('span', { style: { marginLeft: '6px', fontSize: '12px' } }, '🎮') : null),
      h('div.ds', {}, lock ? '🔒 ' + lock : a.desc)),
    h('div.cost', {},
      h('span.chip' + (s.energy.value < en ? '.bad' : ''), {}, `⚡${en}`),
      h('span.chip.accent', {}, `${a.ep} EP`),
      money ? h('span.chip.warn', {}, fmtTL(money)) : null));
}

async function finishYear(render) {
  const s = S();
  const c = Y.canEndYear(s);
  if (!c.ok) { toast(c.reasons.join(' · ')); return; }
  const prevStage = stageOf(s.age);
  const sum = Y.endYear(s);
  progress('year');
  save();
  if (s.career.job) F.collectJob(s.career.job.id);
  sfx.level(); vibrate(30);
  await summarySheet(sum);
  if (sum.died) { go('death'); return; }
  if (sum.stageChanged) await stageBanner(sum.stageTo);
  render();
  await F.afterAction(render);
}

async function summarySheet(sum) {
  const s = S();
  const top = Object.entries(sum.skillDelta).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const chip = (k, v) => {
    const def = statById[k] || skillById[k];
    return h('span.delta' + (v > 0 ? '.up' : '.down'), {}, def.icon, ' ', def.name, ' ', (v > 0 ? '+' : '') + v.toFixed(1));
  };
  await sheet(close => h('div', {},
    h('h2', {}, sum.died ? '🕊️ Son yıl' : `🎉 ${sum.age} yaşını tamamladın!`),
    h('p.small.muted', {}, `Enflasyon: %${(sum.inflation * 100).toFixed(1)} · ${sum.died ? '' : `+${CONFIG.energy.newYearBonus} enerji hediye`}`),
    sum.promos.map(p => h('div.task.done', {}, p)),
    h('div.sec-title', {}, 'Statlar'),
    h('div', {}, Object.entries(sum.statDelta).filter(([, v]) => Math.abs(v) >= 0.3).map(([k, v]) => chip(k, v))),
    top.length ? h('div.sec-title', {}, 'Yetenek gelişimi') : null,
    h('div', {}, top.map(([k, v]) => chip(k, v))),
    (sum.income.length || sum.expense.length) ? h('div.sec-title', {}, 'Para') : null,
    h('div', {},
      ...sum.income.map(([k, v]) => h('div.sum-line', {}, k, h('b.pos', {}, '+' + fmtTL(v)))),
      ...sum.expense.map(([k, v]) => h('div.sum-line', {}, k, h('b.neg', {}, '−' + fmtTL(v)))),
      (sum.income.length || sum.expense.length) ? h('div.sum-line', { style: { borderBottom: 0 } }, h('b', {}, 'Net'), h('b', { class: sum.net >= 0 ? 'pos' : 'neg' }, (sum.net >= 0 ? '+' : '−') + fmtTL(Math.abs(sum.net)))) : null),
    sum.home && s.family.parents.some(p => p.alive) ? h('div.sum-line', {}, `🏠 ${livingHome(s) ? 'Evin' : 'Anne-babanın evi'}: ${stressLabel(sum.home.stress).t}`, h('b', { class: sum.home.delta > 0 ? 'neg' : 'pos' }, `stres ${Math.round(sum.home.stress)} (${sum.home.delta > 0 ? '+' : ''}${Math.round(sum.home.delta)})`)) : null,
    sum.good?.length ? h('div.sec-title', {}, 'Alışkanlıklar') : null,
    (sum.good || []).map(g => h('p.small', { style: { margin: '4px 0', color: '#8ff0c4' } }, g)),
    sum.notes.length ? h('div.sec-title', {}, 'Önemli') : null,
    sum.notes.map(n => h('p.small', { style: { margin: '5px 0' } }, n)),
    h('div.btns', {}, btn(sum.died ? 'Devam' : `▶ ${sum.age + 1} yaşına geç`, () => close(), 'primary block'))), { dismissable: false });
}

async function stageBanner(st) {
  const texts = {
    ilkokul: 'Okul çantan hazır! Artık eylemler açılıyor: ders, oyun, spor, arkadaşlık…',
    orta: 'Ortaokul: dershane, kulüpler ve ilk küçük ticaretin. Sonunda lise sınavı var!',
    lise: 'Lise yılları: staj, çıraklık, yarışmalar, ilk aşk… Sonunda üniversite sınavı seni bekliyor.',
    genc: 'Artık yetişkinsin! Üniversite, iş, kendi işini kurmak… Kira ve faturalar da başlıyor.',
    yetiskin: 'Kariyerinde yükselme, yatırım, aile… Hayatın en yoğun dönemi.',
    olgun: 'Tecrübenin meyvelerini topla: danışmanlık, torunlar, miras planı.',
  };
  await sheet(close => h('div.stage-banner', {},
    h('div.e', {}, STAGE_E[st.id]),
    h('h1', {}, st.name),
    h('p.muted', {}, texts[st.id] || ''),
    h('p.small', {}, `Yıllık eylem puanı: ${st.ep}`),
    btn('Başla', () => close(), 'primary block')), { center: true, dismissable: false });
}

// ——— BEN ———
function meTab(render) {
  const s = S();
  const out = [];
  out.push(h('div.sec-title', {}, '📊 Statlar'));
  out.push(h('div.card', {}, STATS.map(st => h('div.stat-row', {},
    h('span.lbl', {}, st.icon, ' ', st.name), bar(s.stats[st.id], statColor(s.stats[st.id])), h('span.num', {}, Math.round(s.stats[st.id]))))));
  out.push(h('div.sec-title', {}, '🧬 Yetenekler', h('span.tiny', { style: { textTransform: 'none', letterSpacing: 0 } }, '(potansiyelin gizli)')));
  const hintsLeft = 3 - (s.hintAds || 0);
  out.push(h('div.skill-grid', {}, SKILLS.map(sk => {
    const v = s.skills[sk.id];
    const hint = s.hints[sk.id] ? hintFor(sk.id, s.talents[sk.id]) : null;
    return h('div.skill', {},
      h('div.top', {}, h('span', {}, sk.icon, ' ', sk.name), h('span', {}, Math.floor(v))),
      bar(v, hint?.tier === 3 ? '#ffc53d' : hint?.tier === 1 ? '#ff8a5b' : '#7c6cff'),
      hint ? h('div.hint', {}, (hint.tier === 3 ? '✨ ' : hint.tier === 1 ? '⚠️ ' : '🌱 ') + hint.label)
        : hintsLeft > 0 ? h('button.hint', { style: { textDecoration: 'underline' }, onclick: async () => {
          if (await F.watchAd('hint')) { s.hintAds = (s.hintAds || 0) + 1; s.hints[sk.id] = hintFor(sk.id, s.talents[sk.id]).tier; save(); render(); info('✨ Yetenek ipucu', h('p', {}, hintFor(sk.id, s.talents[sk.id]).text)); }
        } }, `📺 Merak ettim (${hintsLeft})`) : h('div.hint', {}, '?'));
  })));
  // Eğitim
  const e = s.edu;
  const eduName = { none: 'Okul öncesi', ilkokul: 'İlkokul', orta: 'Ortaokul', lise: 'Lise', uni: 'Üniversite', done: 'Eğitim tamamlandı' }[e.stage];
  const schoolName = { fen: 'Fen Lisesi', anadolu: 'Anadolu Lisesi', meslek: 'Meslek Lisesi', duz: 'Mahalle Lisesi' }[e.school];
  out.push(h('div.sec-title', {}, '🎓 Eğitim'));
  out.push(h('div.card', {},
    h('div.sum-line', {}, 'Durum', h('b', {}, eduName)),
    schoolName ? h('div.sum-line', {}, 'Lise', h('b', {}, schoolName)) : null,
    s.edu.alan && ALANLAR[s.edu.alan] ? h('div.sum-line', {}, 'Alan', h('b', {}, `${ALANLAR[s.edu.alan].icon} ${ALANLAR[s.edu.alan].name}`)) : null,
    e.gpa !== null ? h('div.sum-line', {}, 'Karne ortalaması', h('b', {}, e.gpa)) : null,
    e.lgsTop !== null ? h('div.sum-line', {}, 'Lise sınavı', h('b', {}, `ilk %${e.lgsTop}`)) : null,
    e.yksTop !== null ? h('div.sum-line', {}, 'Üniversite sınavı', h('b', {}, `ilk %${e.yksTop}`)) : null,
    e.dept ? h('div.sum-line', {}, 'Bölüm', h('b', {}, deptById[e.dept].name + (e.degree ? ' (mezun)' : ` · ${e.uniYears + 1}. sınıf`))) : null,
    h('div.sum-line', { style: { borderBottom: 0 } }, 'Sınav hazırlığı (genel)', h('b', {}, Y.examPrep(s, 'yks')))));
  // Yaşam dengesi
  if (s.bal && s.age >= 6) {
    const done = domainsDone(s);
    out.push(h('div.sec-title', {}, '⚖️ Yaşam dengesi'));
    out.push(h('div.card', {},
      Object.entries(DOMAINS).filter(([k, D]) => D.on(s)).map(([k, D]) => {
        const b = s.bal[k];
        const state = done.has(k) ? ['✅ Bu yıl yapıldı', '#3ddc97'] : b.neglect >= D.warn ? [`⚠️ ${b.neglect} yıldır ihmal`, '#ff5b7a'] : b.neglect > 0 ? [`${b.neglect} yıldır yok`, '#ffb547'] : ['—', 'var(--muted)'];
        return h('div.sum-line', {}, h('span', {}, `${D.icon} ${D.name}`, b.streak >= 3 ? h('span.chip.green', { style: { marginLeft: '6px' } }, `🔥 ${b.streak} yıl seri`) : null), h('b', { style: { color: state[1] } }, state[0]));
      }),
      h('div.tiny.muted', { style: { marginTop: '8px' } }, 'Bir alanda 3 yıl üst üste emek verirsen alışkanlık ödülü alırsın. İhmal edersen: ders → unutma ve sınıfta kalma, spor → fizik ve sağlık kaybı, sosyal → yalnızlık, aile → kopukluk, dinlenme → tükenmişlik. Kullanmadığın beceriler 3 yıl sonra körelir.')));
  }
  // Doğuştan gelenler
  out.push(h('div.sec-title', {}, '🎲 Doğuştan gelenler', h('span.tiny', { style: { textTransform: 'none', letterSpacing: 0 } }, '(seçilemez)')));
  const L = looks(s), K = charisma(s), M = MIZAC[s.traits.mizac];
  out.push(h('div.card', {},
    h('div.stat-row', {}, h('span.lbl', {}, '✨ Görünüş'), bar(L, '#ff8ad8'), h('span.num', {}, L)),
    h('div.tiny.muted', {}, `${traitLabel(L)} · İlk izlenimi, flört şansını ve eş adaylarını etkiler. Yaşla azalır; spor ve bakım korur.`),
    h('div.stat-row', {}, h('span.lbl', {}, '🌟 Karizma'), bar(K, '#ffc53d'), h('span.num', {}, K)),
    h('div.tiny.muted', {}, `${traitLabel(K)} · Liderlik gelişimini, konuşma ve mülakatları kolaylaştırır. Liderlik ve sosyal eylemlerle ${Math.round(20 - s.traits.karizmaGain)} puan daha gelişebilir.`),
    h('div.row', { style: { marginTop: '10px' } }, h('span', { style: { fontSize: '26px' } }, M.icon), h('div.grow', {}, h('b', {}, `Mizaç: ${M.name}`), h('div.tiny.muted', {}, M.desc)))));
  if (s.titles.length || s.legends.length) {
    out.push(h('div.sec-title', {}, '🌟 Bu hayatın efsaneleri'));
    out.push(h('div.card', {},
      s.titles.map(t => h('span.chip.gold', { style: { margin: '3px' } }, '🏅 ', t)),
      s.legends.map(l => h('div.small', { style: { padding: '4px 0' } }, `🌟 ${l.title} (${l.age} yaş)`))));
  }
  return out;
}

// ——— KARİYER ———
function careerTab(render) {
  const s = S();
  const out = [];
  out.push(h('div.sec-title', {}, '💼 İş'));
  const j = s.career.job;
  if (j) {
    const J = JOBS[j.id];
    out.push(h('div.card', {},
      h('div.row', {}, h('span', { style: { fontSize: '34px' } }, J.icon), h('div.grow', {}, h('h3', {}, jobTitle(j)), h('div.small.muted', {}, `${PATHS[J.path].name} yolu · bu seviyede ${j.years} yıl`))),
      h('div.sp'),
      h('div.row', { style: { gap: '4px', flexWrap: 'wrap' } }, J.levels.map((lv, i) => h('span.chip' + (i === j.level ? '.accent' : i < j.level ? '.green' : ''), {}, lv[0]))),
      h('div.sp'),
      h('div.sum-line', {}, 'Aylık maaş (şu an)', h('b', {}, fmtTL(J.salary * Y.levelMult(j) * s.priceIndex))),
      h('div.sum-line', {}, 'Bu yılki performans', h('b', {}, j.perfN ? Math.round(j.perfSum / j.perfN) : '—')),
      h('div.sum-line', { style: { borderBottom: 0 } }, 'Terfi', h('b', {}, (() => { const lv = J.levels[j.level]; if (j.level >= J.levels.length - 1) return 'Zirvedesin'; if (lv[3]) return `Kapı: ${DOORS[lv[3]].name} (${lv[2]} yıl sonra)`; return `${lv[2]} yıl + performans 55`; })())),
      h('div.btns', {}, btn('İşten ayrıl', async () => { if (await confirmBox('İşten ayrıl', 'Emin misin? Maaşın kesilecek.', 'Ayrıl', 'Vazgeç', 'danger')) { Y.quitJob(s); save(); render(); } }, 'ghost sm'))));
  } else {
    out.push(h('div.card', {}, h('p', { style: { margin: 0 } }, s.career.retired ? `🪑 Emeklisin. Aylık emekli maaşı: ${fmtTL(s.career.pension * s.priceIndex)}` : s.age < 14 ? 'Henüz çalışma yaşında değilsin.' : 'Şu an bir işin yok. "İş ara" eylemiyle başvurabilirsin.')));
  }
  // Kapılar
  const allDoors = Object.keys(DOORS).filter(id => s.career.doors[id]?.open || Y.visibleDoors(s).includes(id));
  if (allDoors.length) {
    out.push(h('div.sec-title', {}, '🚪 Kapılar'));
    out.push(h('div.card', {}, allDoors.map(id => {
      const d = s.career.doors[id];
      return h('div.sum-line', {}, `${DOORS[id].icon} ${DOORS[id].name}`, h('b', {}, d?.open ? '✅ Açık' : d?.tries ? `❌ ${d.tries} deneme` : '⏳'));
    })));
  }
  if (s.savings > 0) out.push(h('div.card', { style: { marginTop: '12px' } }, h('div.row', {}, h('span', {}, '🏦'), h('b.grow', {}, `Mevduat: ${fmtTL(s.savings)}`), s.age < 18 ? h('span.chip', {}, '18 yaşında') : btn('Finans', () => { app.tab = 'finans'; window.scrollTo(0, 0); render(); }, 'sm')), h('div.tiny.muted', {}, 'Her yıl enflasyon + %3 getiri. Basamak atlarken otomatik kullanılır.')));
  // Kendi işin (girişimcilik): yalnızca ilgi gösterene ya da işi kurmuş olana görünür
  const b = s.career.biz;
  const nb = nextStepReqs(s);
  const bizInterest = b || s.skills.ticaret >= 15 || (s.train.ticaret || 0) >= 1 || s.edu.alan === 'ea';
  if (!bizInterest) {
    out.push(h('div.sec-title', {}, '🏪 Kendi işin'));
    out.push(h('div.card', {}, h('p.small.muted', { style: { margin: 0 } }, 'Ticarete ilgi gösterirsen (bakkala yardım, pazarda çalışma, ticaret dersleri) kendi işini kurma yolu açılır.')));
    return out;
  }
  out.push(h('div.sec-title', {}, '🏪 Kendi işin'));
  out.push(h('div.card', {},
    h('div.row', { style: { gap: '4px', flexWrap: 'wrap' } }, BIZ_STEPS.map((st, i) => h('span.chip' + (b && i === b.step ? '.gold' : b && i < b.step ? '.green' : ''), {}, st.icon, ' ', st.name))),
    h('div.sp'),
    b ? h('div', {},
      h('div.sum-line', {}, 'Basamak', h('b', {}, `${BIZ_STEPS[b.step].icon} ${BIZ_STEPS[b.step].name} · ${b.years} yıl`)),
      h('div.sum-line', {}, 'Ortalama aylık net (beceri 60)', h('b', {}, fmtTL(BIZ_STEPS[b.step].monthly * s.priceIndex * (0.2 + 1.2 * 0.6)))),
      b.lastNet !== undefined ? h('div.sum-line', {}, 'Geçen yıl', h('b', { class: b.lastNet >= 0 ? 'pos' : 'neg' }, fmtTL(b.lastNet))) : null,
      b.lastReason ? h('div.tiny.muted', { style: { padding: '2px 0 6px' } }, (b.lastKind === 'boom' ? '🚀 ' : b.lastKind === 'crash' ? '💥 ' : '📉 ') + b.lastReason) : null,
      h('div.sum-line', {}, 'Piyasa', h('b', {}, trendText(b.trend ?? 0))),
      b.boost ? h('div.sum-line', {}, 'Büyüme hamlesi', h('b', {}, `×${b.boost.mul} · ${b.boost.years} yıl`)) : null,
      h('div.sum-line', {}, 'Bu yılki ticaret becerisi', h('b', {}, b.skillN ? Math.round(b.skillSum / b.skillN) : '— (işletmeni yönet!)')),
      h('div.sum-line', { style: { borderBottom: 0 } }, 'Kötü yıl riski', h('b', {}, `%${Math.round(BIZ_STEPS[b.step].risk * 100)} × beceri etkisi`)),
      h('div.tiny.muted', {}, 'Ticaret risklidir: ürünün tutarsa bir yılda servet kazanabilir, ortak dolandırıcılığı, yangın ya da kur şokuyla bir anda batabilirsin. Beceri, itibar ve sigorta riski azaltır.')) :h('p.small.muted', {}, 'Ticarete ilgin var. "Kendi küçük işini kur" eylemiyle (12+ yaş) girişimcilik yoluna başlayabilirsin.'),
    nb ? h('div.tile', { style: { marginTop: '10px' } },
      h('b', {}, `Sonraki: ${nb.info.icon} ${nb.info.name}`),
      h('div.small.muted', {}, `Sermaye ${fmtTL(nb.info.capital * s.priceIndex)} (nakit ×1,2 gerekir) · İtibar ${nb.info.rep}+ · ${nb.info.age}+ yaş`),
      nb.miss.length ? nb.miss.map(m => h('div.small', { style: { color: '#ff9db0' } }, '• ' + m)) : h('div.small', { style: { color: '#8ff0c4' } }, '✅ Hazırsın!'),
      nb.step >= 2 && s.career.job ? h('div.tiny', { style: { color: '#ffb547' } }, '⚠️ Dükkândan itibaren işletme tam zamanlıdır: mevcut işinden ayrılırsın.') : null,
      !nb.miss.length && b ? btn(`${nb.info.icon} Basamak atla`, async () => { if (await confirmBox(nb.info.name, `${fmtTL(nb.info.capital * s.priceIndex)} sermaye yatırılacak. Kalan nakit işletme sermayesi olarak kalır.`, 'Yatır ve büyü')) { advanceBiz(s); Y.log(s, `${nb.info.name} basamağına geçti!`, 'epic'); save(); sfx.level(); render(); } }, 'gold block') : null) : h('p.small', {}, '🌍 Zirvedesin: ihracatçısın!')));
  // Birikim
  return out;
}

function logTab() {
  const s = S();
  return [h('div.sec-title', {}, '📖 Hayat günlüğü'), h('div.card', {}, s.log.slice().reverse().map(l => h('div.log-item.' + l.r, {}, h('span.age', {}, l.age + ' y'), h('span.t', {}, l.text))), s.log.length ? null : h('p.muted', {}, 'Henüz bir şey yazılmadı.'))];
}

async function menuSheet() {
  const s = S();
  await sheet(close => h('div', {},
    h('h2', {}, 'Menü'),
    h('div.btns', {},
      btn('🏠 Ana menü', () => { close(); go('title'); }, 'block'),
      btn('⚙️ Ayarlar', () => { close(); go('settings', 'life'); }, 'block'),
      btn('🗑️ Bu hayatı sil, yenisine başla (📺 3 reklam)', async () => { close(); const { abandonLife } = await import('./screens.js'); if (await abandonLife()) go('create'); }, 'ghost block'),
      btn('Kapat', () => close(), 'ghost block'))));
}

// ——— EV ———
function homeTab(render) {
  const s = S();
  const out = [];
  const f = s.family;
  const h0 = s.home;
  const parentsAlive = f.parents.some(p => p.alive);
  const inHome = livingHome(s);
  out.push(h('div.sec-title', {}, inHome ? '🏠 Ailenin evi' : '👵 Anne-babanın evi'));
  if (parentsAlive) {
    const b = homeBudget(s);
    const st = stressLabel(h0.stress);
    const need = homeNeed(s);
    const nx = nextStep(s);
    const give = pct => { const amt = giveToFamily(s, Math.max(0, s.money) * pct); if (amt > 0) { sfx.coin(); toast(`🏠 Ailene ${fmtTL(amt)} verdin. Stres yıl sonunda azalacak.`); save(); render(); } };
    out.push(h('div.card', {},
      h('div.row', {}, h('span', { style: { fontSize: '30px' } }, st.e), h('div.grow', {}, h('b', {}, st.t), h('div.tiny.muted', {}, `${WEALTH[f.wealth].icon} ${WEALTH[f.wealth].name} aile · ${PLACE[f.place].icon} ${f.city}`)), h('span.chip', { style: { color: st.c, borderColor: st.c } }, `Stres ${Math.round(h0.stress)}`)),
      h('div.bar', { style: { marginTop: '8px' } }, h('i', { style: { width: h0.stress + '%', background: st.c } })),
      h('div.sp'),
      h('div.sum-line', {}, 'Aile kasası', h('b', { class: h0.cash >= 0 ? 'pos' : 'neg' }, fmtTL(h0.cash))),
      h('div.sum-line', {}, 'Evin geliri (anne-baba maaşı)', h('b', {}, `${fmtTL(b.inc / 12)}/ay · ${fmtTL(b.inc)}/yıl`)),
      h('div.sum-line', {}, 'Evin gideri (kira, fatura, mutfak, okul)', h('b', {}, `${fmtTL(b.exp / 12)}/ay · ${fmtTL(b.exp)}/yıl`)),
      h('div.sum-line', {}, 'Tahmini yıl sonu', h('b', { class: b.net >= 0 ? 'pos' : 'neg' }, (b.net >= 0 ? '+' : '−') + fmtTL(Math.abs(b.net)))),
      h0.crises.length ? h('div.sum-line', {}, 'Zor dönem', h('b', { style: { color: '#ffb547' } }, h0.crises.map(c => `${c.name} (${c.years} yıl)`).join(', '))) : null,
      need > 0 ? h('div.tile', { style: { borderColor: '#ffb547', marginTop: '10px' } }, h('b', {}, `🙏 Ailenin ihtiyacı: ${fmtTL(need)}`), h('div.tiny.muted', {}, 'Bu yıl bu açık kapanmazsa aile borçlanır ve stres artar.')) : null,
      nx && h0.stress >= 15 ? h('div.tiny', { style: { color: '#ff9db0', marginTop: '8px' } }, h0.stress >= nx.at ? `⚠️ Yakında: ${nx.label}. Ailene destek olursan önlenebilir.` : `⚠️ Stres ${nx.at}'u geçerse: ${nx.label}.`) : null,
      h('div.tiny.muted', { style: { marginTop: '8px' } }, inHome
        ? 'Ailenle yaşadığın sürece evin derdi senin de derdin. Harçlık, kurs ve dershane parası bu kasadan çıkar. Pazar işi, ayak işi, yarı zamanlı iş ya da çıraklıkla kazanıp destek olabilirsin.'
        : 'Yaşlanan anne-baban emekli olunca gelirleri düşer. Desteğin onların sağlığını ve huzurunu korur.'),
      h('div.row', { style: { marginTop: '10px', gap: '6px' } },
        btn('Aileye %25 ver', () => give(0.25), 'sm grow' + (s.money > 0 ? '' : ' disabled')),
        btn('%50', () => give(0.5), 'sm' + (s.money > 0 ? '' : ' disabled')),
        btn('Tümü', () => give(1), 'gold sm' + (s.money > 0 ? '' : ' disabled'))),
      h0.helpTotal > 0 ? h('div.tiny', { style: { color: '#8ff0c4', marginTop: '6px' } }, `💚 Şimdiye kadar ailene ${fmtTL(h0.helpTotal)} destek oldun.`) : null));
  }
  if (s.age >= 6 && s.age < 18) {
    const w = Y.allowanceWeekly(s);
    const rate = Y.pocketSaveRate(s);
    const setP = k => { s.pocket = k; save(); render(); };
    out.push(h('div.sec-title', {}, '🪙 Senin cep bütçen'));
    out.push(h('div.card', {},
      h('div.sum-line', {}, 'Haftalık harçlık', h('b', {}, w > 0 ? fmtTL(w) : 'Bu yıl yok')),
      h('div.sum-line', {}, 'Yıllık toplam', h('b', {}, fmtTL(w * 52))),
      h('div.sum-line', {}, 'Cebindeki birikim', h('b', {}, fmtTL(s.money))),
      s.savings > 0 ? h('div.sum-line', {}, '🏦 Adına açılan hesap (18\'de senin)', h('b', {}, fmtTL(s.savings))) : null,
      h('div.tiny.muted', { style: { margin: '8px 0 6px' } }, 'Harçlık ailenin kasasından çıkar; aile zordaysa azalır ya da kesilir. Çoğu kantin, yol ve arkadaşlarla harcanır. Ne kadarını biriktireceğine sen karar ver:'),
      h('div.seg', {}, [['harca', '🍫 Harca (%10)'], ['yarisi', '⚖️ Yarısı (%50)'], ['biriktir', '🐷 Biriktir (%80)']].map(([k, t]) =>
        h('button' + ((s.pocket || 'harca') === k ? '.on' : ''), { style: { fontSize: '12px', padding: '8px 4px' }, onclick: () => setP(k) }, t))),
      h('div.tiny.muted', { style: { marginTop: '6px' } }, rate >= 0.8 ? 'Biriktirmek disiplin kazandırır ama arkadaşlarınla daha az şey yaparsın (mutluluk −).' : rate <= 0.1 ? 'Harçlığının tadını çıkarıyorsun (mutluluk +), ama cebinde pek bir şey kalmıyor.' : 'Dengeli bir alışkanlık.')));
  }
  out.push(h('div.card', { style: { marginTop: '12px' } },
    ...f.parents.map(p => h('div.sum-line', {}, `${p.role === 'Anne' ? '👩' : '👨'} ${p.role}: ${p.name}`, h('b', {}, p.alive ? `${p.job}, ${p.age} yaş${p.age >= 62 ? ' (emekli)' : ''}` : '🕊️'))),
    h('div.sum-line', {}, '👫 Kardeş', h('b', {}, f.siblings || 'Yok')),
    h('div.sum-line', {}, 'Aile ilişkisi', h('b', {}, `${RELATION[f.relation].icon} ${RELATION[f.relation].name}`)),
    f.rare ? h('div.sum-line', {}, 'Nadir başlangıç', h('b', { style: { color: '#ffc53d' } }, `${RARE[f.rare].icon} ${RARE[f.rare].name}`)) : null,
    h('div.sum-line', { style: { borderBottom: 0 } }, 'Arkadaş', h('b', {}, `${s.rel.friends}${s.rel.bestFriend ? ' · en yakını ' + s.rel.bestFriend : ''}`))));
  // Eş / partner
  const P = s.rel.partner;
  out.push(h('div.sec-title', {}, s.rel.married ? '💍 Eşin' : '💞 İlişki'));
  if (P) {
    const T = SPOUSE_TRAITS[P.trait];
    out.push(h('div.card', {},
      h('div.row', {}, h('span', { style: { fontSize: '36px' } }, P.gender === 'k' ? '👩' : '👨'), h('div.grow', {}, h('h3', {}, P.name), h('div.small.muted', {}, `${P.age ? P.age + ' yaş · ' : ''}${P.job ?? ''}${P.jobless ? ' (şu an işsiz)' : ''}`))),
      h('div.meter', { style: { marginTop: '8px' } }, '❤️ Sevgi', bar(P.love, P.love > 50 ? '#ff5b7a' : '#ffb547'), h('b', {}, Math.round(P.love))),
      T ? h('div.row', { style: { marginTop: '8px' } }, h('span', { style: { fontSize: '22px' } }, T.icon), h('div.grow', {}, h('b', {}, T.name), h('div.tiny.muted', {}, T.desc))) : null,
      P.compat !== undefined ? h('div.sum-line', {}, 'Uyum', h('b', {}, `%${P.compat}`)) : null,
      P.salary ? h('div.sum-line', {}, 'Geliri', h('b', {}, `${fmtTL(P.salary * s.priceIndex * (P.trait === 'hirsli' ? 1.25 : 1))}/ay`)) : null,
      P.wealth ? h('div.sum-line', {}, 'Ailesi', h('b', {}, `${WEALTH[P.wealth].icon} ${WEALTH[P.wealth].name}`)) : null,
      P.wantsKids !== undefined ? h('div.sum-line', { style: { borderBottom: 0 } }, 'Çocuk', h('b', {}, P.wantsKids ? 'İstiyor' : 'İstemiyor')) : null,
      h('div.tiny.muted', { style: { marginTop: '6px' } }, s.rel.married ? 'Sevgi her yıl biraz azalır; "Partnerinle vakit" eylemiyle besle. 12\'nin altına düşerse boşanırsınız ve birikim paylaşılır.' : 'Sevgi 70\'e ulaşınca evlilik teklifi gündeme gelir.')));
  } else {
    out.push(h('div.card', {}, h('p.small', { style: { margin: 0 } }, s.age >= 17 ? '"Yeni insanlarla tanış" eylemiyle eş adayları çıkar. Görünüşün, karizman, sosyal çevren ve itibarın aday havuzunu belirler; kiminle hayatını birleştireceğine sen karar verirsin.' : 'Henüz çok gençsin.')));
  }
  if (s.rel.children.length) {
    out.push(h('div.sec-title', {}, '👶 Çocukların'));
    out.push(h('div.card', {}, s.rel.children.map(c => h('div.sum-line', {}, `${c.gender === 'k' ? '👧' : '👦'} ${c.name}`, h('b', {}, `${c.age} yaş`)))));
  }
  // Kendi hanenin bütçesi
  if (!inHome) {
    const pi = s.priceIndex;
    const j = s.career.job;
    const lc = (CONFIG.livingCost.find(l => s.age >= l.age)?.cost ?? 12000) * (s.rel.married ? 1.5 : 1) * (P && s.rel.married ? (P.trait === 'tutumlu' ? 0.88 : P.trait === 'savurgan' ? 1.2 : 1) : 1) * (s.flags.evSahibi ? 0.8 : 1);
    const kids = s.rel.children.filter(c => c.age < 18).length * 7000;
    const inc = (j ? JOBS[j.id].salary * Y.levelMult(j) : 0) + (P && s.rel.married && !P.jobless ? (P.salary || 0) * (P.trait === 'hirsli' ? 1.25 : 1) : 0) + (s.career.retired ? s.career.pension : 0);
    const tax = j ? incomeTax(JOBS[j.id].salary * Y.levelMult(j) * 12 * pi, pi) / 12 : 0;
    const left = (inc - lc - kids) * pi - tax;
    out.push(h('div.sec-title', {}, '💳 Senin hanen (aylık, tahmini)'));
    out.push(h('div.card', {},
      h('div.sum-line', {}, 'Maaş(lar)', h('b.pos', {}, fmtTL(inc * pi))),
      tax > 0 ? h('div.sum-line', {}, 'Gelir vergisi', h('b.neg', {}, '−' + fmtTL(tax))) : null,
      h('div.sum-line', {}, `Kira, fatura, mutfak${s.flags.evSahibi ? ' (ev sahibi)' : ''}`, h('b.neg', {}, '−' + fmtTL(lc * pi))),
      kids ? h('div.sum-line', {}, 'Çocuk masrafları', h('b.neg', {}, '−' + fmtTL(kids * pi))) : null,
      h('div.sum-line', { style: { borderBottom: 0 } }, h('b', {}, 'Kalan'), h('b', { class: left >= 0 ? 'pos' : 'neg' }, fmtTL(left))),
      h('div.tiny.muted', {}, 'İşletme kârı ve prim hariçtir. Maaş, mesaiye gittiğin oranda yatar. Gelirin yükseldikçe yaşam standardın da büyür (Finans sekmesinden ayarla).')));
  }
  return out;
}
