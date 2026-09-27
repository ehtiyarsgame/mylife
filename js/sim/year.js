// Yıl motoru: yıl başlat → eylemler & olaylar → sınavlar → yıl sonu.
import { CONFIG, SKILLS } from '../config.js';
import { RNG } from '../core/rng.js';
import { clamp, normCdf, round } from '../core/util.js';
import { spendEnergy, addEnergy } from '../core/energy.js';
import { stageOf, addSkill, addStat, hintFor } from './stats.js';
import { actionById, actionCost, actionLock, resolve, stageId, deptSkill } from './actions.js';
import { JOBS, DOORS, DEPTS, EXAMS, deptById, jobTitle } from './careers.js';
import { BIZ_STEPS, bizYear, bankrupt } from './business.js';
import { drawCard, checkCond, render, cardById } from './events.js';
import { FRIEND_NAMES, NAMES } from './names.js';

export function withRng(s, fn) {
  const r = new RNG(s.rng);
  const out = fn(r);
  s.rng = r.s;
  return out;
}

const snapshot = s => ({ stats: { ...s.stats }, skills: { ...s.skills }, money: s.money + s.savings });

export function log(s, text, r = 'common') {
  s.log.push({ age: s.age, text, r });
  if (s.log.length > 400) s.log.shift();
}

// ——————————————————— YIL BAŞI ———————————————————
export function startYear(s) {
  const st = stageOf(s.age);
  let ep = st.ep;
  if (ep > 0) {
    if (s.stats.mutluluk < 30) ep -= 1;
    if (s.stats.saglik < 25) ep -= 2;
    ep = Math.max(1, ep);
  }
  withRng(s, r => {
    const nEv = st.id === 'bebek' ? r.int(1, 2) : r.int(CONFIG.eventsPerYear[0], CONFIG.eventsPerYear[1]);
    const slots = [];
    for (let i = 0; i < nEv; i++) slots.push(ep === 0 ? 0 : r.int(1, ep));
    slots.sort((a, b) => a - b);
    s.year = {
      age: s.age, ep, used: 0, done: [], slots, shown: 0, seenIds: [],
      tasks: yearTasks(s), start: snapshot(s), notes: [], trained: {}, study: 0,
      adEP: false, bestRarity: null, altyapiCounted: false, doorsTried: [],
    };
  });
}

function yearTasks(s) {
  const t = [];
  const inSchool = ['ilkokul', 'orta', 'lise'].includes(s.edu.stage);
  if (inSchool && s.age >= 7 && s.age <= 17) t.push({ id: 'karne', exam: 'karne', done: false });
  if (s.edu.stage === 'orta' && s.age === 13) t.push({ id: 'lgs', exam: 'lgs', done: false });
  if ((s.edu.stage === 'lise' && s.age === 17) || s.flags.yksTekrar) t.push({ id: 'yks', exam: 'yks', done: false });
  return t;
}

export const epLeft = s => s.year.ep - s.year.used;

export function canEndYear(s) {
  const y = s.year;
  const reasons = [];
  if (y.used < y.ep) reasons.push(`${y.ep - y.used} eylem puanı kaldı`);
  const t = y.tasks.filter(t => !t.done);
  if (t.length) reasons.push(`Önemli: ${t.map(x => EXAMS[x.exam].name).join(', ')}`);
  if (pendingEventCount(s) > 0) reasons.push('Açılmamış olay kartı var');
  return { ok: reasons.length === 0, reasons };
}

export function pendingEventCount(s) {
  const y = s.year;
  return y.slots.filter((v, i) => v <= y.used && i >= y.shown).length;
}

// Sıradaki olay kartını çek (UI, eylemden sonra çağırır)
export function nextEvent(s) {
  if (pendingEventCount(s) <= 0) return null;
  const card = withRng(s, r => drawCard(s, r));
  s.year.shown++;
  if (!card) return null;
  s.seen[card.id] = (s.seen[card.id] || 0) + 1;
  s.year.seenIds.push(card.id);
  const rank = { common: 0, rare: 1, epic: 2, legendary: 3 };
  if (!s.year.bestRarity || rank[card.rarity] > rank[s.year.bestRarity]) s.year.bestRarity = card.rarity;
  return card;
}

// ——————————————————— EYLEMLER ———————————————————
export function energyCost(a) {
  if (a.rest) return CONFIG.restEnergy;
  return CONFIG.actionEnergy[a.ep] ?? 14;
}

export function canDo(s, a) {
  if (epLeft(s) < a.ep) return `${a.ep} EP gerekir`;
  if (s.energy.value < energyCost(a)) return 'Enerji yetersiz';
  return actionLock(a, s);
}

export function skipScore(s, skill) {
  // Atlanan mini oyun: yalnızca statla, 10 puan düşük
  const base = skill ? (s.skills[skill] ?? s.stats[skill] ?? 40) : 45;
  return clamp(Math.round(base * 0.8 + 12 - CONFIG.skipPenalty), 5, 80);
}

// perf: 0–100 mini oyun skoru (ya da atlama skoru)
export function performAction(s, id, perf = 60) {
  const a = actionById[id];
  const y = s.year;
  const out = { lines: [], deltas: {}, id };
  spendEnergy(s.energy, energyCost(a));
  const { money } = actionCost(a, s);
  if (money) { s.money -= money; out.lines.push(`−${fmt(money)} ücret`); }
  y.used += a.ep;
  y.done.push(id);
  const pm = 0.6 + perf / 125; // performans çarpanı 0,6–1,4

  const d = out.deltas;
  const addD = (k, v) => { d[k] = (d[k] || 0) + v; };
  for (const [k, t] of Object.entries(a.skills || {})) addD(k, addSkill(s, k, t, perf));
  if (a.jobSkill && s.career.job) { const k = JOBS[s.career.job.id].skill; addD(k, addSkill(s, k, a.jobSkill, perf)); }
  if (a.deptSkills) { const k = deptSkill(s); addD(k, addSkill(s, k, a.deptSkills, perf)); }
  for (const [k, v] of Object.entries(a.stats || {})) addD(k, addStat(s, k, v < 0 ? v : v * pm));

  if (a.train) y.trained[a.train] = true;
  if (a.study) y.study += a.study;
  if (a.flag) s.flags[a.flag] = true;
  if (a.flagYear) y[a.flagYear] = true;
  if (a.earn) { const e = a.earn * s.priceIndex * (0.5 + perf / 100); s.money += e; out.lines.push(`+${fmt(e)} kazandın`); out.earned = e; }
  if (a.work && s.career.job) {
    const j = s.career.job; j.perfSum += perf; j.perfN++;
    if (a.bonusSalary) { const e = JOBS[j.id].salary * levelMult(j) * 12 * a.bonusSalary * s.priceIndex; s.money += e; out.lines.push(`+${fmt(e)} fazla mesai`); }
    if (JOBS[j.id].farm) j.farmSum = (j.farmSum || 0) + perf;
  }
  if (a.perfBonus && s.career.job) { s.career.job.perfSum += a.perfBonus * 2; }
  if (a.biz && s.career.biz) { s.career.biz.skillSum += perf; s.career.biz.skillN++; }
  if (a.altyapi && perf >= 60 && !y.altyapiCounted) {
    y.altyapiCounted = true; s.counters.altyapiIyi = (s.counters.altyapiIyi || 0) + 1;
    out.lines.push('İyi bir sezon! Hocalar seni not etti.');
  }
  withRng(s, r => {
    if (a.friend) {
      if (s.rel.friends < 8 && r.chance(0.35 + perf / 300)) { s.rel.friends++; out.lines.push('Yeni bir arkadaş edindin.'); }
      if (!s.rel.bestFriend && r.chance(0.5)) { s.rel.bestFriend = r.pick(FRIEND_NAMES); out.lines.push(`${s.rel.bestFriend} artık en yakın arkadaşın.`); }
    }
    if (a.family) s.flags.aileBag = (s.flags.aileBag || 0) + 1;
    if (a.date) {
      const p = 0.18 + perf / 220 + s.stats.sosyal / 400;
      if (r.chance(p)) {
        const g = s.gender === 'k' ? 'e' : 'k';
        s.rel.partner = { name: r.pick(NAMES[g]), love: 35 + Math.round(perf / 4), since: s.age };
        out.lines.push(`💞 ${s.rel.partner.name} ile tanıştın. Aranızda bir şey var!`);
        log(s, `${s.rel.partner.name} ile tanıştı.`, 'rare');
      } else out.lines.push('Keyifli sohbetler oldu ama kıvılcım çakmadı.');
    }
    if (a.love && s.rel.partner) {
      s.rel.partner.love = clamp(s.rel.partner.love + 12, 0, 100);
      if (!s.rel.married && s.rel.partner.love >= 70 && s.age >= 21 && !s.chains.some(c => c.id === 'evlilik_teklifi')) {
        s.chains.push({ id: 'evlilik_teklifi', at: s.age });
        if (!y.slots.some((v, i) => i >= y.shown && v <= y.used)) y.slots.push(y.used);
      }
    }
    if (a.kids) s.flags.cocukBag = (s.flags.cocukBag || 0) + 1;
    if (a.honest) { s.life.honest++; }
    // Gizli yetenek ipucu
    if (a.train && !s.hints[a.train]) {
      s.counters['t_' + a.train] = (s.counters['t_' + a.train] || 0) + 1;
      if (s.counters['t_' + a.train] >= 2 && r.chance(0.6)) {
        const h = hintFor(a.train, s.talents[a.train]);
        s.hints[a.train] = h.tier;
        out.hint = h.text;
      }
    }
  });
  // Yol geçmişi (kapı puanı için)
  const pth = pathOfAction(a, s);
  if (pth) s.career.pathEP[pth] = (s.career.pathEP[pth] || 0) + a.ep;
  s.life.peakMoney = Math.max(s.life.peakMoney, s.money + s.savings);
  return out;
}

function pathOfAction(a, s) {
  if (a.train === 'futbol') return 'futbol';
  if (a.work && s.career.job) return JOBS[s.career.job.id].path;
  if (a.biz || a.id === 'bakkal') return 'tuccar';
  if (a.train === 'el') return 'usta';
  if (a.train === 'doga' || a.id === 'tarim_kursu') return 'ciftci';
  if (a.train === 'fen') return 'doktor';
  if (a.train === 'matematik' || a.train === 'teknoloji') return 'muhendis';
  return null;
}

const fmt = v => Math.round(v).toLocaleString('tr-TR') + ' TL';

// Özel eylemler
export function spendActionOnly(s, id) {
  const a = actionById[id];
  spendEnergy(s.energy, energyCost(a));
  s.year.used += a.ep;
  s.year.done.push(id);
}

export function startBiz(s) {
  spendActionOnly(s, 'isletme_ac');
  s.career.biz = { step: 0, years: 0, skillSum: 0, skillN: 0, bankrupt: 0 };
  log(s, 'İlk ticaretine başladı: okulda kurabiye satışı.', 'rare');
}

export function depositSavings(s) {
  spendActionOnly(s, 'birikim');
  const amt = Math.floor(s.money / 2);
  s.money -= amt; s.savings += amt;
  return amt;
}

export function withdrawSavings(s, amt) {
  amt = Math.min(amt, s.savings);
  s.savings -= amt; s.money += amt;
}

export function retire(s) {
  spendActionOnly(s, 'emekli');
  const j = s.career.job;
  s.career.pension = JOBS[j.id].salary * levelMult(j) * 0.4;
  s.career.retired = true;
  log(s, `${jobTitle(j)} olarak emekli oldu.`, 'rare');
  s.career.job = null;
}

// ——————————————————— SINAVLAR ———————————————————
export function examPrep(s, examId) {
  const st = s.stats, sk = s.skills;
  const recent = s.studyLog.slice(-2).reduce((a, b) => a + b, 0) + s.year.study;
  let base;
  switch (examId) {
    case 'tus': base = sk.fen * 0.7 + st.zeka * 0.3; break;
    case 'usta': base = sk.el * 0.7 + st.disiplin * 0.3; break;
    case 'ehliyet': base = st.zeka * 0.5 + st.disiplin * 0.5; break;
    case 'is': base = st.sosyal * 0.5 + st.zeka * 0.3 + (s.flags.staj ? 20 : 0); break;
    default: base = (sk.matematik + sk.fen + sk.dil) / 3 * 0.7 + st.zeka * 0.3;
  }
  return clamp(Math.round(base * 0.6 + recent * 4 + (s.flags.dershaneBurs ? 5 : 0)), 0, 100);
}

// Sınav puanı = 0,65 × oyuncu + 0,30 × hazırlık + şans(0–5)
export function examScore(s, examId, playerPct) {
  const prep = examPrep(s, examId);
  const luck = withRng(s, r => r.float(0, 5));
  const score = clamp(Math.round(0.65 * playerPct + 0.30 * prep + luck), 0, 100);
  // Sanal adaylar içinde sıralama: 90 puan ≈ ilk %2
  const top = round(100 * (1 - normCdf((score - 55) / 17)), 1);
  return { score, prep, top: Math.max(0.1, top) };
}

export function applyExam(s, examId, res) {
  const out = { ...res, examId, lines: [], choices: null };
  s.life.examResults.push({ age: s.age, exam: examId, score: res.score, top: res.top });
  const task = s.year.tasks.find(t => t.exam === examId && !t.done);
  if (task) { task.done = true; task.score = res.score; }
  switch (examId) {
    case 'karne': {
      s.edu.grades.push(res.score);
      s.edu.gpa = round(s.edu.grades.reduce((a, b) => a + b, 0) / s.edu.grades.length, 1);
      if (res.score >= 85) { s.flags.takdir = true; addStat(s, 'mutluluk', 3); out.lines.push('🏅 Takdir belgesi aldın!'); }
      else if (res.score >= 70) out.lines.push('📄 Teşekkür belgesi aldın.');
      else if (res.score < 45) { addStat(s, 'mutluluk', -3); out.lines.push('Karnen zayıf geldi. Seneye daha çok çalışmalısın.'); }
      break;
    }
    case 'lgs': {
      s.edu.lgsTop = res.top;
      const ch = [];
      if (res.top <= 3) ch.push({ id: 'fen', name: 'Fen Lisesi', icon: '🔭', desc: 'Fen ve matematikte +%20 gelişim, YKS\'de avantaj.' });
      if (res.top <= 25) ch.push({ id: 'anadolu', name: 'Anadolu Lisesi', icon: '🏫', desc: 'Dengeli eğitim, dil ağırlıklı.' });
      ch.push({ id: 'meslek', name: 'Meslek Lisesi', icon: '🔧', desc: 'Çıraklık ve ustalığa hızlı giriş, el becerisi +.' });
      ch.push({ id: 'duz', name: 'Mahalle Lisesi', icon: '🏢', desc: 'Evine yakın, sakin bir okul.' });
      out.choices = { kind: 'school', list: ch };
      log(s, `LGS'de ilk %${res.top} dilime girdi.`, res.top <= 3 ? 'epic' : 'common');
      break;
    }
    case 'yks': {
      s.edu.yksTop = res.top;
      s.edu.yksTries++;
      delete s.flags.yksTekrar;
      const list = DEPTS.filter(d => res.top <= d.top).map(d => ({ id: d.id, name: d.name, icon: d.icon, desc: `${d.years} yıl · taban: ilk %${d.top}` }));
      list.push({ id: 'none', name: 'Üniversiteye gitme', icon: '🛠️', desc: 'Doğrudan iş hayatına ya da çıraklığa başla.' });
      if (s.edu.yksTries < 3) list.push({ id: 'retake', name: 'Seneye tekrar gir', icon: '🔁', desc: 'Bir yıl hazırlan, yeniden dene. Kaybetmek son değil.' });
      out.choices = { kind: 'dept', list };
      log(s, `YKS'de ilk %${res.top} dilimine girdi.`, res.top <= 2 ? 'epic' : 'common');
      break;
    }
    case 'ehliyet':
      if (res.score >= 55) { s.flags.ehliyet = true; out.pass = true; out.lines.push('🚗 Ehliyetini aldın!'); log(s, 'Ehliyet aldı.'); }
      else { out.pass = false; out.lines.push('Ehliyet sınavını geçemedin. Seneye tekrar dene.'); }
      break;
    case 'kpss':
      if (res.top <= 30) { s.flags.kpss = true; s.counters.kpssTop = res.top; out.pass = true; out.lines.push('🏛️ KPSS puanın kamu işlerine yetiyor!'); log(s, `KPSS'de ilk %${res.top}.`); }
      else { out.pass = false; out.lines.push('KPSS puanın yetmedi (ilk %30 gerekli). Tekrar deneyebilirsin.'); }
      break;
    case 'uni':
      s.edu.uniGrades.push(res.score);
      break;
  }
  return out;
}

export function chooseSchool(s, id) {
  s.edu.school = id;
  const names = { fen: 'Fen Lisesi', anadolu: 'Anadolu Lisesi', meslek: 'Meslek Lisesi', duz: 'mahalle lisesi' };
  log(s, `${names[id]}'ne yerleşti.`, id === 'fen' ? 'epic' : 'common');
}

export function chooseDept(s, id) {
  if (id === 'retake') { s.flags.yksTekrar = true; s.edu.pendingDept = null; log(s, 'YKS\'ye bir yıl daha hazırlanmaya karar verdi.'); return; }
  if (id === 'none') { s.edu.pendingDept = 'none'; return; }
  s.edu.pendingDept = id;
  log(s, `${deptById[id].name} bölümünü kazandı!`, id === 'tip' ? 'epic' : 'rare');
}

// ——————————————————— İŞ & KAPILAR ———————————————————
export const levelMult = j => JOBS[j.id].levels[Math.min(j.level, JOBS[j.id].levels.length - 1)][1];

export function jobEligible(s, id) {
  const J = JOBS[id];
  const miss = [];
  if (J.viaDoor) miss.push('Kapı ile açılır');
  if (s.age < J.minAge) miss.push(`${J.minAge} yaş`);
  if (J.needFlag && !s.flags[J.needFlag]) miss.push(J.needFlag === 'ehliyet' ? 'Ehliyet' : 'KPSS');
  if (J.needDept && s.edu.degree !== J.needDept) miss.push(`${deptById[J.needDept].name} mezuniyeti`);
  if (J.needAny && !J.needAny.some(o => (o.dept && s.edu.degree === o.dept) || (o.skill && s.skills[o.skill] >= o.min) || (o.flag && s.flags[o.flag]))) {
    miss.push(J.needAny.map(o => o.dept ? deptById[o.dept].name : o.skill ? `${o.skill} ${o.min}+` : 'deneyim').join(' veya '));
  }
  if (J.farm && s.family.place === 'sehir' && !s.flags.arazi) miss.push('Köyde/kasabada arazi');
  if (s.career.job?.id === id) miss.push('Zaten bu işi yapıyorsun');
  if (s.edu.stage === 'lise' && id !== 'cirak' && id !== 'garson') miss.push('Önce liseyi bitir');
  if (s.career.biz && s.career.biz.step >= 2) miss.push('İşletmen tam zamanlı');
  return miss;
}

export function jobOffers(s) {
  return Object.keys(JOBS).map(id => ({ id, job: JOBS[id], miss: jobEligible(s, id) })).filter(o => !JOBS[o.id].viaDoor);
}

// Mülakat: iş ne kadar prestijliyse o kadar yüksek skor ister
export function interviewNeed(id) {
  const sal = JOBS[id].salary;
  return clamp(Math.round(25 + sal / 2000), 30, 70);
}

export function hireJob(s, id) {
  if (s.career.job) s.career.jobsHad.push(s.career.job.id);
  s.career.job = { id, level: 0, years: 0, perfSum: 0, perfN: 0 };
  s.career.retired = false;
  if (!s.life.jobs.includes(id)) s.life.jobs.push(id);
  if (id === 'ciftci' && s.family.place !== 'sehir') s.flags.arazi = true;
  log(s, `${JOBS[id].name} olarak işe başladı.`, 'rare');
}

export function quitJob(s) {
  if (!s.career.job) return;
  s.career.jobsHad.push(s.career.job.id);
  log(s, `${jobTitle(s.career.job)} işinden ayrıldı.`);
  s.career.job = null;
}

export function doorStatus(s, id) {
  const D = DOORS[id];
  const miss = [];
  const n = D.need || {};
  if (s.career.doors[id]?.open) return { open: true, miss: [] };
  if (s.age < D.age[0] || s.age > D.age[1]) miss.push(`${D.age[0]}–${D.age[1]} yaş`);
  for (const k in n.skills || {}) if (s.skills[k] < n.skills[k]) miss.push(`${k} ${n.skills[k]}+ (şu an ${Math.floor(s.skills[k])})`);
  for (const k in n.stats || {}) if (s.stats[k] < n.stats[k]) miss.push(`${k} ${n.stats[k]}+`);
  for (const k in n.train || {}) if ((s.train[k] || 0) < n.train[k]) miss.push(`En az ${n.train[k]} yıl antrenman (şu an ${s.train[k] || 0})`);
  for (const k in n.counters || {}) if ((s.counters[k] || 0) < n.counters[k]) miss.push(`Altyapıda ${n.counters[k]} iyi sezon (şu an ${s.counters[k] || 0})`);
  for (const f of n.flags || []) if (!s.flags[f]) miss.push(f === 'altyapi' ? 'Altyapı oyuncusu olmak' : f === 'ustalik' ? 'Ustalık belgesi' : f);
  for (const f of n.notFlags || []) if (s.flags[f]) miss.push('Zaten sahipsin');
  if (n.anyFlag && !n.anyFlag.some(f => s.flags[f])) miss.push('Tarım kursu ya da ziraat eğitimi');
  if (n.job && s.career.job?.id !== n.job) miss.push(`${JOBS[n.job].name} olmak`);
  if (n.jobAny && !n.jobAny.includes(s.career.job?.id)) miss.push('Mühendis ya da yazılımcı olmak');
  if (n.money && s.money < n.money * s.priceIndex) miss.push(`${fmt(n.money * s.priceIndex)} nakit`);
  // Terfi kapısı: iş seviyesi ve yıl uygun mu
  const J = s.career.job && JOBS[s.career.job.id];
  if (J && D.open.promote) {
    const lv = J.levels[s.career.job.level];
    if (lv[3] !== id) miss.push('Kariyerinde bu basamakta değilsin');
    else if (s.career.job.years < lv[2]) miss.push(`Bu seviyede ${lv[2]} yıl (şu an ${s.career.job.years})`);
  }
  if (s.year?.doorsTried.includes(id)) miss.push('Bu yıl zaten denedin');
  return { open: false, miss };
}

export function visibleDoors(s) {
  return Object.keys(DOORS).filter(id => {
    const D = DOORS[id];
    if (s.career.doors[id]?.open) return false;
    if (s.age > D.age[1] || s.age < D.age[0] - 3) return false;
    if (D.open.promote) {
      const J = s.career.job && JOBS[s.career.job.id];
      return J && J.levels[s.career.job.level][3] === id;
    }
    if (id.startsWith('futbol_') && !s.train.futbol && !s.flags.altyapi) return false;
    if (id === 'dukkan_usta') return !!s.flags.ustalik;
    return true;
  });
}

export function doorConnection(s, id) {
  const D = DOORS[id];
  let c = 0;
  if (s.family.parents.some(p => p.path === D.path)) c += 12;
  if (s.flags.mentor && D.path === s.flags.mentorPath) c += 8;
  if (s.family.rare === 'sporcu' && D.path === 'futbol') c += 6;
  return Math.min(20, c);
}

// score = yetenek×0,55 + mini oyun×0,55 + geçmiş(≤20) + bağlantı(≤20) + şans(0–10)
export function doorScore(s, id, mg, adBonus = 0) {
  const D = DOORS[id];
  const skill = D.mgSkill ? s.skills[D.mgSkill] ?? s.stats[D.mgSkill] : 50;
  const past = Math.min(20, (s.career.pathEP[D.path] || 0) * 1.2);
  const conn = doorConnection(s, id);
  const luck = withRng(s, r => r.float(0, 10));
  const parts = { yetenek: skill * 0.55, oyun: mg * 0.55, gecmis: past, baglanti: conn, sans: luck, reklam: adBonus };
  const score = Object.values(parts).reduce((a, b) => a + b, 0);
  return { score: Math.round(score), parts, open: score >= 100 };
}

export function tryDoorSpend(s, id) {
  spendEnergy(s.energy, CONFIG.actionEnergy[1]);
  s.year.used += 1;
  s.year.done.push('kapi:' + id);
  s.year.doorsTried.push(id);
}

export function openDoor(s, id) {
  const D = DOORS[id];
  s.career.doors[id] = { open: true, age: s.age };
  if (D.cost) s.money -= D.cost * s.priceIndex;
  const o = D.open;
  for (const f of o.flags || []) s.flags[f] = true;
  if (o.job) hireJob(s, o.job);
  if (o.promote && s.career.job) { s.career.job.level++; s.career.job.years = 0; }
  if (o.legend) addLegend(s, o.legend, D.name);
  addStat(s, 'mutluluk', 6);
  addStat(s, 'itibar', 3);
  log(s, o.log, 'epic');
  return o.log;
}

export function failDoor(s, id) {
  const d = s.career.doors[id] || { tries: 0 };
  d.tries = (d.tries || 0) + 1;
  d.lastFail = s.age;
  s.career.doors[id] = d;
  addStat(s, 'mutluluk', -4);
  log(s, `${DOORS[id].name} kapısı bu yıl açılmadı.`);
}

export function addLegend(s, id, title) {
  if (!s.legends.find(l => l.id === id)) s.legends.push({ id, title, age: s.age });
}

// ——————————————————— OLAY SEÇENEKLERİ ———————————————————
export function optionAvailable(s, opt) {
  if (!opt.req) return true;
  return checkCond(opt.req, s);
}

export function applyEffects(s, e, card) {
  const lines = [];
  if (!e) return lines;
  const pi = s.priceIndex;
  for (const [k, v] of Object.entries(e.stats || {})) { const d = addStat(s, k, v); if (Math.abs(d) >= 0.5) lines.push({ k, v: d }); }
  for (const [k, v] of Object.entries(e.skills || {})) { s.skills[k] = clamp(s.skills[k] + v, 0, 100); lines.push({ k, v }); }
  if (e.money) { s.money += e.money * pi; lines.push({ k: 'money', v: e.money * pi }); }
  if (e.moneyPct) { const v = Math.max(0, s.money) * e.moneyPct; s.money += v; lines.push({ k: 'money', v }); }
  for (const f of e.flags || []) s.flags[f] = true;
  for (const f of e.unflags || []) delete s.flags[f];
  for (const [k, v] of Object.entries(e.counters || {})) s.counters[k] = (s.counters[k] || 0) + v;
  if (e.energy) addEnergy(s.energy, e.energy);
  if (e.honest) { addStat(s, 'itibar', 4); s.life.honest++; lines.push({ k: 'itibar', v: 4 }); }
  if (e.famRep) s.family.famRep += e.famRep;
  if (e.door) { s.career.doors[e.door] = { open: true, age: s.age }; for (const f of DOORS[e.door]?.open.flags || []) s.flags[f] = true; }
  if (e.legend) addLegend(s, e.legend, card?.title || e.legend);
  if (e.title && !s.titles.includes(e.title)) s.titles.push(e.title);
  if (e.friend) s.rel.friends = clamp(s.rel.friends + e.friend, 0, 10);
  if (e.mentor) { s.flags.mentor = e.mentor; s.flags.mentorPath = e.mentorPath || null; }
  if (e.chain) s.chains.push({ id: e.chain.id, at: s.age + (e.chain.delay ?? 1) });
  if (e.job) hireJob(s, e.job);
  if (e.loseJob) quitJob(s);
  if (e.biz === 'start' && !s.career.biz) s.career.biz = { step: 0, years: 0, skillSum: 0, skillN: 0, bankrupt: 0 };
  if (e.biz === 'down' && s.career.biz) bankrupt(s);
  if (e.bizSkill && s.career.biz) { s.career.biz.skillSum += e.bizSkill; s.career.biz.skillN++; }
  if (e.partnerLove && s.rel.partner) s.rel.partner.love = clamp(s.rel.partner.love + e.partnerLove, 0, 100);
  withRng(s, r => {
    if (e.partner === 'new' && !s.rel.partner) {
      s.rel.partner = { name: r.pick(NAMES[s.gender === 'k' ? 'e' : 'k']), love: 45, since: s.age };
      lines.push({ text: `💞 ${s.rel.partner.name} hayatına girdi.` });
    }
    if (e.partner === 'lose' && s.rel.partner) {
      lines.push({ text: `💔 ${s.rel.partner.name} ile yollarınız ayrıldı.` });
      s.rel.partner = null; s.rel.married = false; s.rel.exes++;
    }
    if (e.marry && s.rel.partner) { s.rel.married = true; s.rel.partner.love = clamp(s.rel.partner.love + 15, 0, 100); log(s, `${s.rel.partner.name} ile evlendi.`, 'epic'); }
    if (e.child) {
      const g = r.chance(0.5) ? 'k' : 'e';
      const c = { name: r.pick(NAMES[g]), gender: g, age: 0, talent: r.pick(SKILLS).id };
      s.rel.children.push(c);
      lines.push({ text: `👶 ${c.name} dünyaya geldi!` });
      log(s, `${c.name} adında bir çocuğu oldu.`, 'epic');
    }
    if (e.parentDies) {
      const alive = s.family.parents.filter(p => p.alive);
      if (alive.length) {
        const p = alive.sort((a, b) => b.age - a.age)[0];
        p.alive = false;
        const share = inheritanceShare(s) / Math.max(1, alive.length);
        s.money += share;
        log(s, `${p.role === 'Anne' ? 'Annesi' : 'Babası'} ${p.name} vefat etti.`, 'rare');
        lines.push({ text: `🕊️ ${p.name} aramızdan ayrıldı.` });
        if (share > 0) lines.push({ k: 'money', v: share, text: 'Miras' });
      }
    }
    if (e.random) {
      const opt = r.weighted(e.random.map(x => [x, x.w ?? 1]));
      lines.push(...applyEffects(s, opt.effects, card));
      if (opt.result) lines.push({ text: render(s, opt.result) });
    }
  });
  return lines;
}

function inheritanceShare(s) {
  const base = { fakir: 50000, orta: 400000, varlikli: 3000000, zengin: 25000000 }[s.family.wealth];
  return base * s.priceIndex / (1 + s.family.siblings);
}

// mgScore: seçenek bir mini oyun istiyorsa skor
export function resolveOption(s, card, idx, mgScore = null) {
  const opt = card.options[idx];
  const out = { lines: [], result: null, success: null };
  if (opt.honest) { out.lines.push(...applyEffects(s, { honest: true }, card)); }
  out.lines.push(...applyEffects(s, opt.effects, card));
  let result = opt.result;
  if (opt.mg && mgScore !== null) {
    const need = opt.success?.min ?? 60;
    out.success = mgScore >= need;
    const br = out.success ? opt.success : opt.fail;
    if (br) {
      out.lines.push(...applyEffects(s, br.effects, card));
      if (br.result) result = br.result;
    }
  }
  if (card.rarity === 'legendary' && (out.success !== false)) {
    addLegend(s, card.id, card.title);
    out.legend = true;
  }
  out.result = result ? render(s, result) : null;
  if (card.rarity !== 'common' || card.log) log(s, render(s, card.log || `${card.title}: ${out.result || opt.text}`), card.rarity);
  return out;
}

// ——————————————————— YIL SONU ———————————————————
export function endYear(s) {
  const y = s.year;
  const sum = { age: s.age, lines: [], income: [], expense: [], promos: [], stageFrom: stageOf(s.age), notes: [] };

  for (const k of Object.keys(y.trained)) s.train[k] = (s.train[k] || 0) + 1;
  s.studyLog.push(y.study); if (s.studyLog.length > 4) s.studyLog.shift();

  withRng(s, r => {
    // ——— Ekonomi ———
    const infl = r.float(CONFIG.inflation[0], CONFIG.inflation[1]);
    s.priceIndex *= 1 + infl;
    sum.inflation = infl;
    const pi = s.priceIndex;

    if (s.age < 18) {
      const al = CONFIG.allowance[s.family.wealth] * pi * (s.age < 6 ? 0.2 : 1);
      s.money += al; sum.income.push(['Harçlık', al]);
    }
    if (s.age === 17) {
      const g = CONFIG.startGift[s.family.wealth] * pi;
      if (g) { s.money += g; sum.income.push(['Aile desteği (18 yaş)', g]); }
      if (s.flags.mirasFonu) { const m = 300000 * pi; s.money += m; sum.income.push(['Miras fonu', m]); }
      if (s.inheritance) { s.money += s.inheritance; sum.income.push(['Aile mirası', s.inheritance]); s.inheritance = 0; }
      if (s.flags.aileSirketi != null && !s.career.biz) {
        s.career.biz = { step: Math.max(0, s.flags.aileSirketi - 1), years: 0, skillSum: 0, skillN: 0, bankrupt: 0 };
        sum.notes.push(`🏢 Aile işletmesini devraldın: ${BIZ_STEPS[s.career.biz.step].name}.`);
      }
    }

    const j = s.career.job;
    if (j) {
      const J = JOBS[j.id];
      const perf = j.perfN ? j.perfSum / j.perfN : 45;
      let sal = J.salary * levelMult(j) * 12 * pi * (0.85 + perf / 333);
      if (J.farm) {
        const farmPerf = j.farmSum ? j.farmSum / Math.max(1, j.perfN) : 45;
        sal = J.salary * levelMult(j) * 12 * pi * (0.5 + farmPerf / 100) * r.float(0.85, 1.2);
      }
      if (j.id === 'cirak' && s.flags.kendiDukkan) sal *= 1.7;
      if (s.age < 18 && j.id !== 'cirak') sal *= 0.5;
      s.money += sal; sum.income.push([`Maaş · ${jobTitle(j)}`, sal]);
      j.years++;
      j.lastPerf = perf;
      j.perfAll = ((j.perfAll || perf) * 2 + perf) / 3;
      // Terfi
      const lv = J.levels[j.level];
      if (j.level < J.levels.length - 1 && !lv[3] && j.years >= lv[2] && perf >= 55) {
        j.level++; j.years = 0;
        const t = jobTitle(j);
        sum.promos.push(`🎉 Terfi: ${t}`);
        log(s, `${t} oldu.`, 'rare');
        addStat(s, 'mutluluk', 5); addStat(s, 'itibar', 2);
      } else if (lv[3] && j.years >= lv[2]) {
        sum.notes.push(`🚪 "${DOORS[lv[3]].name}" kapısı seni bekliyor (Kariyer sekmesi).`);
      }
      if (perf < 30 && j.years > 1 && r.chance(0.35)) {
        sum.notes.push('⚠️ Performansın çok düşüktü; işten çıkarıldın.');
        log(s, `${jobTitle(j)} işinden çıkarıldı.`);
        quitJob(s);
        addStat(s, 'mutluluk', -8);
      }
      if (s.career.job) { s.career.job.perfSum = 0; s.career.job.perfN = 0; s.career.job.farmSum = 0; }
      // Futbolcu emekliliği
      if (s.career.job?.id === 'futbolcu' && s.age >= 34 && r.chance(0.35 + (s.age - 34) * 0.2)) {
        s.flags.eskiFutbolcu = true;
        sum.notes.push('⚽ Kramponlarını astın. Artık antrenörlük seni bekliyor.');
        log(s, 'Profesyonel futbolu bıraktı.', 'epic');
        quitJob(s);
      }
    }
    if (s.career.retired && s.career.pension) {
      const p = s.career.pension * 12 * pi; s.money += p; sum.income.push(['Emekli aylığı', p]);
    }

    // Ticaret
    if (s.career.biz) {
      const br = bizYear(s, r);
      if (br) {
        if (br.bad) sum.expense.push([`Kötü yıl · ${br.step.name}`, -br.net]);
        else sum.income.push([`${br.step.name} kârı (beceri ${Math.round(br.skill)})`, br.net]);
        s.money += br.net;
        if (br.bad) sum.notes.push('📉 Kötü bir yıl geçirdin: iade dalgası, maliyet artışı… Beceri yükseldikçe bu risk azalır.');
      }
    }

    // Yaşam gideri
    if (s.age >= 15) {
      const lc = CONFIG.livingCost.find(l => s.age >= l.age).cost;
      let cost = lc * 12 * pi;
      const wr = ['fakir', 'orta', 'varlikli', 'zengin'].indexOf(s.family.wealth);
      if (s.age < 18) cost = 0;                    // aile karşılar
      else if (s.edu.stage === 'uni') cost *= [1, 0.5, 0.1, 0][wr] * (s.flags.burs ? 0.5 : 1);
      if (s.rel.married) {
        cost *= 1.5;
        const pInc = 26000 * 12 * pi; s.money += pInc; sum.income.push([`${s.rel.partner?.name ?? 'Eş'}in katkısı`, pInc]);
      }
      const kids = s.rel.children.filter(c => c.age < 18).length;
      cost += kids * 7000 * 12 * pi;
      if (cost > 0) { s.money -= cost; sum.expense.push(['Yaşam gideri (kira, fatura, mutfak)', cost]); }
    }

    // Birikim getirisi (enflasyon + %3)
    if (s.savings > 0) {
      const g = s.savings * (infl + 0.03);
      s.savings += g; sum.income.push(['Birikim getirisi', g]);
    }
    // Borç
    if (s.money < 0) {
      if (s.savings > 0) { const t = Math.min(s.savings, -s.money); s.savings -= t; s.money += t; sum.notes.push('🏦 Açığı birikiminden kapattın.'); }
      if (s.money < 0 && s.career.biz && s.career.biz.step > 0) {
        const ns = bankrupt(s);
        s.life.bankrupt++;
        sum.notes.push(`💥 İflas! İşletmen "${BIZ_STEPS[ns].name}" basamağına geriledi, borç yapılandırıldı. Oyun bitmedi — yeniden tırman.`);
        log(s, 'İflas etti ve yeniden başladı.', 'rare');
        s.money = 0;
      } else if (s.money < 0) {
        s.money *= 1.2; // borç faizi
        addStat(s, 'mutluluk', -5);
        sum.notes.push('💳 Borçlusun. Borç her yıl %20 büyür; gelirini artırmalı ya da giderini azaltmalısın.');
      }
    }

    // ——— Eğitim geçişleri ———
    const nextAge = s.age + 1;
    if (s.edu.stage === 'uni') {
      s.edu.uniYears++;
      const D = deptById[s.edu.dept];
      if (s.edu.uniYears >= D.years) {
        const g = s.edu.uniGrades.length ? s.edu.uniGrades.reduce((a, b) => a + b, 0) / s.edu.uniGrades.length : 55;
        s.edu.degree = s.edu.dept; s.edu.stage = 'done'; s.edu.uniGpa = round(g, 1);
        s.flags['dept_' + s.edu.dept] = true;
        sum.notes.push(`🎓 ${D.name} mezunu oldun! (ortalama ${Math.round(g)})`);
        log(s, `${D.name} bölümünden mezun oldu.`, 'rare');
        addStat(s, 'itibar', 5);
      }
    }
    if (nextAge === 6) s.edu.stage = 'ilkokul';
    if (nextAge === 10 && s.edu.stage === 'ilkokul') s.edu.stage = 'orta';
    if (nextAge === 14 && s.edu.stage === 'orta') { s.edu.stage = 'lise'; if (!s.edu.school) s.edu.school = 'duz'; }
    if (s.edu.stage === 'lise' && nextAge >= 18 && !s.flags.yksTekrar) {
      const pd = s.edu.pendingDept;
      if (pd && pd !== 'none') {
        s.edu.stage = 'uni'; s.edu.dept = pd; s.edu.uniYears = 0; s.edu.uniGrades = [];
        sum.notes.push(`🎓 Artık ${deptById[pd].name} öğrencisisin!`);
      } else {
        s.edu.stage = 'done';
        sum.notes.push('🎓 Liseden mezun oldun.');
      }
    }
    if (s.edu.school === 'fen' && s.edu.stage === 'lise') { s.skills.fen = clamp(s.skills.fen + 1.5, 0, 100); s.skills.matematik = clamp(s.skills.matematik + 1.5, 0, 100); }
    if (s.edu.school === 'meslek' && s.edu.stage === 'lise') { s.skills.el = clamp(s.skills.el + 2, 0, 100); }
    if (s.edu.school === 'anadolu' && s.edu.stage === 'lise') { s.skills.dil = clamp(s.skills.dil + 1.5, 0, 100); }
    // Okulda otomatik küçük gelişim
    if (['ilkokul', 'orta', 'lise'].includes(s.edu.stage)) {
      for (const k of ['matematik', 'dil', 'fen']) s.skills[k] = clamp(s.skills[k] + 0.6, 0, 100);
      addStat(s, 'zeka', 0.8);
    }
    // Bebeklik: yetenekler kendiliğinden filizlenir
    if (s.age <= 5) {
      for (const sk of SKILLS) s.skills[sk.id] = clamp(s.skills[sk.id] + s.talents[sk.id] / 60, 0, 100);
      addStat(s, 'fizik', 2); addStat(s, 'zeka', 2); addStat(s, 'sosyal', 1.5); addStat(s, 'disiplin', 1);
    }

    // ——— Yaşlanma ———
    if (s.age >= 30) addStat(s, 'fizik', -0.6);
    if (s.age >= 32) s.skills.futbol = clamp(s.skills.futbol - 1, 0, 100);
    if (s.age >= 45) addStat(s, 'saglik', -0.8);
    if (s.age >= 60) addStat(s, 'saglik', -1.4);
    if (s.age >= 70) addStat(s, 'saglik', -1.2);
    if (s.stats.fizik > 50) addStat(s, 'saglik', 0.5);
    // Mutluluk dengeye döner
    const base = 55 + (s.rel.married ? 8 : 0) + (s.rel.friends >= 3 ? 4 : 0) + (s.money < 0 ? -10 : 0);
    s.stats.mutluluk = clamp(s.stats.mutluluk + (base - s.stats.mutluluk) * 0.12, 0, 100);
    s.stats.disiplin = clamp(s.stats.disiplin + (s.age < 25 ? 0.6 : 0.2), 0, 100);

    // ——— Aile ———
    for (const p of s.family.parents) if (p.alive) p.age++;
    for (const c of s.rel.children) c.age++;
    if (s.rel.partner && !s.rel.married) s.rel.partner.love -= 6;
    if (s.rel.partner && s.rel.married) s.rel.partner.love -= 3;
    if (s.rel.partner && s.rel.partner.love < 12) {
      sum.notes.push(`💔 ${s.rel.partner.name} ile aranız soğudu ve ayrıldınız.`);
      log(s, `${s.rel.partner.name} ile ayrıldı.`);
      s.rel.partner = null; s.rel.married = false; s.rel.exes++;
      addStat(s, 'mutluluk', -8);
    }
    // Ebeveyn vefatı yaşa bağlı
    for (const p of s.family.parents) {
      if (p.alive && p.age > 62 && r.chance(deathP(p.age, 60) * 0.9) && !s.chains.some(c => c.id === 'ebeveyn_vefat')) {
        s.chains.push({ id: 'ebeveyn_vefat', at: s.age + 1 });
      }
    }

    // ——— Ölüm ———
    let dp = deathP(s.age, s.stats.saglik);
    if (y.kontrol) dp *= 0.7;
    if (r.chance(dp)) {
      s.alive = false;
      s.deathCause = s.age < 60 ? r.pick(['ani bir kalp krizi', 'ağır bir hastalık', 'bir trafik kazası']) : r.pick(['huzur içinde, uykusunda', 'yaşlılığa bağlı bir hastalık', 'sevdiklerinin yanında, huzurla']);
    }
  });

  // Nadirlik şans dengesi
  if (y.bestRarity === 'epic' || y.bestRarity === 'legendary') s.pity = 0; else s.pity++;

  // Stat farkları
  sum.statDelta = {}; sum.skillDelta = {};
  for (const k in s.stats) sum.statDelta[k] = s.stats[k] - y.start.stats[k];
  for (const k in s.skills) sum.skillDelta[k] = s.skills[k] - y.start.skills[k];
  sum.moneyDelta = s.money + s.savings - y.start.money;
  sum.net = sum.income.reduce((a, b) => a + b[1], 0) - sum.expense.reduce((a, b) => a + b[1], 0);

  if (s.alive) {
    s.age++;
    s.calendarYear++;
    addEnergy(s.energy, CONFIG.energy.newYearBonus);
    sum.stageTo = stageOf(s.age);
    sum.stageChanged = sum.stageTo.id !== sum.stageFrom.id;
    if (sum.stageChanged) log(s, `${sum.stageTo.name} dönemi başladı.`);
    startYear(s);
  } else {
    sum.died = true;
    log(s, `${s.age} yaşında hayata gözlerini yumdu (${s.deathCause}).`, 'epic');
  }
  s.life.peakMoney = Math.max(s.life.peakMoney, s.money + s.savings);
  return sum;
}

export function deathP(age, health) {
  if (age < 18) return 0.0003;
  const base = 0.00035 * Math.exp(0.088 * (age - 20));
  const hm = 1.8 - (health / 100) * 1.3;
  return clamp(base * hm + (health < 10 ? 0.12 : 0), 0, 0.85);
}

// Hayat puanı: albüm ve günlük meydan okuma için
export function lifeScore(s) {
  const wealth = Math.max(0, s.life.peakMoney / s.priceIndex);
  const w = wealth > 0 ? Math.log10(wealth + 1) * 45 : 0;
  const jobLv = s.career.job ? s.career.job.level + 1 : (s.life.jobs.length ? 1 : 0);
  const biz = s.career.biz ? s.career.biz.step + 1 : 0;
  return Math.round(s.age * 2 + s.stats.itibar * 3 + s.stats.mutluluk * 1.5 + w + s.legends.length * 60 + s.titles.length * 40 + jobLv * 25 + biz * 20 + s.life.honest * 5 + s.rel.children.length * 15);
}

// Bebeklik yılı: eylem yok, yalnızca olaylar
export const isInfant = s => stageId(s) === 'bebek';
