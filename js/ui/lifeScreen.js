// Ana oyun ekranı.
import { h, btn, sheet, toast, bar, statColor, confirmBox, info } from './dom.js';
import { app, save, go } from './app.js';
import { sfx, vibrate } from '../core/audio.js';
import { fmtTL, fmtTime, signed, clamp } from '../core/util.js';
import { tickEnergy, secondsToNext, secondsToFull } from '../core/energy.js';
import { CONFIG, STATS, SKILLS, statById, skillById } from '../config.js';
import { availableActions, CATEGORIES, actionCost, stageId, resolve as res } from '../sim/actions.js';
import { JOBS, DOORS, DEPTS, EXAMS, PATHS, jobTitle, deptById } from '../sim/careers.js';
import { BIZ_STEPS, nextStepReqs, advanceBiz } from '../sim/business.js';
import { hintFor, stageOf, ceilingOf } from '../sim/stats.js';
import { WEALTH, PLACE, RELATION, RARE } from '../sim/character.js';
import * as Y from '../sim/year.js';
import * as F from './flows.js';
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
    document.getElementById('en-next').textContent = s.energy.value >= s.energy.max ? 'Dolu' : `+1: ${fmtTime(nx)} · dolu: ${fmtTime(secondsToFull(s.energy, app.meta))}`;
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
  // HUD
  wrap.append(h('div.hud', {},
    h('div.card.energy', { onclick: () => F.energySheet(render) },
      h('div.row', {}, h('span', {}, '⚡'), h('span.val', { id: 'en-val' }, Math.floor(s.energy.value)), h('span.muted.small', {}, `/ ${s.energy.max}`), h('span.grow'), h('span.plus-btn', {}, '+')),
      h('div.bar', { style: { marginTop: '6px' } }, h('i', { id: 'en-bar', style: { width: clamp(s.energy.value / s.energy.max * 100, 0, 100) + '%' } })),
      h('div.tiny.muted', { id: 'en-next', style: { marginTop: '5px' } }, s.energy.value >= s.energy.max ? 'Dolu' : '…')),
    h('div.card.money', {},
      h('div.row', {}, h('span', {}, '💰'), h('span.val', { style: { color: s.money < 0 ? '#ff5b7a' : '' } }, fmtTL(s.money))),
      h('div.tiny.muted', { style: { marginTop: '4px' } }, s.savings > 0 ? `🏦 Birikim: ${fmtTL(s.savings)}` : `Fiyat endeksi ×${s.priceIndex.toFixed(2)}`),
      h('div.row', { style: { marginTop: '6px', gap: '5px' } },
        h('span.chip', { title: 'İtibar' }, '⭐ ', Math.round(s.stats.itibar)),
        h('span.chip', { title: 'Mutluluk' }, '😊 ', Math.round(s.stats.mutluluk)),
        h('span.chip', { title: 'Sağlık' }, '❤️ ', Math.round(s.stats.saglik))))));
  wrap.append(yearCard(render));
  // Sekme içeriği
  const tab = app.tab;
  if (tab === 'yil') wrap.append(...actionsTab(render));
  if (tab === 'ben') wrap.append(...meTab(render));
  if (tab === 'kariyer') wrap.append(...careerTab(render));
  if (tab === 'gunluk') wrap.append(...logTab());
  // Sekme çubuğu
  const tabs = [['yil', '🗓️', 'Bu yıl'], ['ben', '🧬', 'Ben'], ['kariyer', '💼', 'Kariyer'], ['gunluk', '📖', 'Günlük']];
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
    const E = EXAMS[t.exam];
    card.append(h('div.task' + (t.done ? '.done' : ''), {},
      h('span', { style: { fontSize: '22px' } }, t.done ? '✅' : '📝'),
      h('div.grow', {}, h('b', {}, E.name), h('div.tiny.muted', {}, t.done ? `Puan: ${t.score}` : `${E.q} soru · zorunlu · hazırlığın ${Y.examPrep(s, t.exam)}`)),
      t.done ? null : btn('Sınava gir', () => guard(() => F.runExam(t.exam, { rerender: render })), 'gold sm')));
  }
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
    sum.notes.length ? h('div.sec-title', {}, 'Önemli') : null,
    sum.notes.map(n => h('p.small', { style: { margin: '5px 0' } }, n)),
    h('div.btns', {}, btn(sum.died ? 'Devam' : `▶ ${sum.age + 1} yaşına geç`, () => close(), 'primary block'))), { dismissable: false });
}

async function stageBanner(st) {
  const texts = {
    ilkokul: 'Okul çantan hazır! Artık eylemler açılıyor: ders, oyun, spor, arkadaşlık…',
    orta: 'Ortaokul: dershane, kulüpler ve ilk küçük ticaretin. Sonunda LGS var!',
    lise: 'Lise yılları: staj, çıraklık, yarışmalar, ilk aşk… Sonunda YKS seni bekliyor.',
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
    e.gpa !== null ? h('div.sum-line', {}, 'Karne ortalaması', h('b', {}, e.gpa)) : null,
    e.lgsTop !== null ? h('div.sum-line', {}, 'LGS', h('b', {}, `ilk %${e.lgsTop}`)) : null,
    e.yksTop !== null ? h('div.sum-line', {}, 'YKS', h('b', {}, `ilk %${e.yksTop}`)) : null,
    e.dept ? h('div.sum-line', {}, 'Bölüm', h('b', {}, deptById[e.dept].name + (e.degree ? ' (mezun)' : ` · ${e.uniYears + 1}. sınıf`))) : null,
    h('div.sum-line', { style: { borderBottom: 0 } }, 'Sınav hazırlığı (genel)', h('b', {}, Y.examPrep(s, 'yks')))));
  // Aile
  const f = s.family;
  out.push(h('div.sec-title', {}, '👨‍👩‍👧 Aile & ilişkiler'));
  out.push(h('div.card', {},
    h('div.sum-line', {}, 'Doğduğun yer', h('b', {}, `${PLACE[f.place].icon} ${f.city}`)),
    h('div.sum-line', {}, 'Aile durumu', h('b', {}, `${WEALTH[f.wealth].icon} ${WEALTH[f.wealth].name}`)),
    ...f.parents.map(p => h('div.sum-line', {}, `${p.role}: ${p.name}`, h('b', {}, p.alive ? `${p.job}, ${p.age} yaş` : '🕊️'))),
    h('div.sum-line', {}, 'Kardeş', h('b', {}, f.siblings)),
    h('div.sum-line', {}, 'Aile ilişkisi', h('b', {}, `${RELATION[f.relation].icon} ${RELATION[f.relation].name}`)),
    f.rare ? h('div.sum-line', {}, 'Nadir başlangıç', h('b', { style: { color: '#ffc53d' } }, `${RARE[f.rare].icon} ${RARE[f.rare].name}`)) : null,
    h('div.sum-line', {}, 'Arkadaş', h('b', {}, `${s.rel.friends}${s.rel.bestFriend ? ' · en yakını ' + s.rel.bestFriend : ''}`)),
    s.rel.partner ? h('div.sum-line', {}, s.rel.married ? 'Eşin' : 'Partnerin', h('b', {}, `❤️ ${s.rel.partner.name} (${Math.round(s.rel.partner.love)})`)) : null,
    s.rel.children.length ? h('div.sum-line', { style: { borderBottom: 0 } }, 'Çocuklar', h('b', {}, s.rel.children.map(c => `${c.name} (${c.age})`).join(', '))) : null));
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
  // Ticaret
  out.push(h('div.sec-title', {}, '📈 Ticaret yolu'));
  const b = s.career.biz;
  const nb = nextStepReqs(s);
  out.push(h('div.card', {},
    h('div.row', { style: { gap: '4px', flexWrap: 'wrap' } }, BIZ_STEPS.map((st, i) => h('span.chip' + (b && i === b.step ? '.gold' : b && i < b.step ? '.green' : ''), {}, st.icon, ' ', st.name))),
    h('div.sp'),
    b ? h('div', {},
      h('div.sum-line', {}, 'Basamak', h('b', {}, `${BIZ_STEPS[b.step].icon} ${BIZ_STEPS[b.step].name} · ${b.years} yıl`)),
      h('div.sum-line', {}, 'Ortalama aylık net (beceri 60)', h('b', {}, fmtTL(BIZ_STEPS[b.step].monthly * s.priceIndex * (0.2 + 1.2 * 0.6)))),
      b.lastNet !== undefined ? h('div.sum-line', {}, 'Geçen yıl', h('b', { class: b.lastNet >= 0 ? 'pos' : 'neg' }, fmtTL(b.lastNet))) : null,
      h('div.sum-line', {}, 'Bu yılki ticaret becerisi', h('b', {}, b.skillN ? Math.round(b.skillSum / b.skillN) : '— (işletmeni yönet!)')),
      h('div.sum-line', { style: { borderBottom: 0 } }, 'Kötü yıl riski', h('b', {}, `%${Math.round(BIZ_STEPS[b.step].risk * 100)} × beceri etkisi`))) : h('p.small.muted', {}, 'Henüz ticarete başlamadın. 10 yaşından itibaren "Okulda satış başlat" ile başla.'),
    nb ? h('div.tile', { style: { marginTop: '10px' } },
      h('b', {}, `Sonraki: ${nb.info.icon} ${nb.info.name}`),
      h('div.small.muted', {}, `Sermaye ${fmtTL(nb.info.capital * s.priceIndex)} (nakit ×1,2 gerekir) · İtibar ${nb.info.rep}+ · ${nb.info.age}+ yaş`),
      nb.miss.length ? nb.miss.map(m => h('div.small', { style: { color: '#ff9db0' } }, '• ' + m)) : h('div.small', { style: { color: '#8ff0c4' } }, '✅ Hazırsın!'),
      nb.step >= 2 && s.career.job ? h('div.tiny', { style: { color: '#ffb547' } }, '⚠️ Dükkândan itibaren işletme tam zamanlıdır: mevcut işinden ayrılırsın.') : null,
      !nb.miss.length && b ? btn(`${nb.info.icon} Basamak atla`, async () => { if (await confirmBox(nb.info.name, `${fmtTL(nb.info.capital * s.priceIndex)} sermaye yatırılacak. Kalan nakit işletme sermayesi olarak kalır.`, 'Yatır ve büyü')) { advanceBiz(s); Y.log(s, `${nb.info.name} basamağına geçti!`, 'epic'); save(); sfx.level(); render(); } }, 'gold block') : null) : h('p.small', {}, '🌍 Zirvedesin: ihracatçısın!')));
  // Birikim
  if (s.savings > 0) out.push(h('div.card', { style: { marginTop: '12px' } }, h('div.row', {}, h('span', {}, '🏦'), h('b.grow', {}, `Birikim: ${fmtTL(s.savings)}`), btn('Tümünü çek', () => { Y.withdrawSavings(s, s.savings); save(); render(); }, 'sm')), h('div.tiny.muted', {}, 'Her yıl enflasyon + %3 getiri. Basamak atlarken otomatik kullanılır.')));
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
      btn('🏳️ Bu hayatı bitir', async () => { close(); if (await confirmBox('Hayatı bitir', 'Bu hayat sona erecek ve hayat albümün oluşturulacak. Emin misin?', 'Bitir', 'Vazgeç', 'danger')) { s.alive = false; s.deathCause = 'oyuncunun kararıyla'; save(); go('death'); } }, 'ghost block'),
      btn('Kapat', () => close(), 'ghost block'))));
}
