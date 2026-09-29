// Yıl motoru: yıl başlat → eylemler & olaylar → sınavlar → yıl sonu.
import { CONFIG, SKILLS } from '../config.js';
import { RNG } from '../core/rng.js';
import { clamp, normCdf, round, fmtTL } from '../core/util.js';
import { spendEnergy, addEnergy } from '../core/energy.js';
import { stageOf, addSkill, addStat, hintFor } from './stats.js';
import { actionById, actionCost, actionLock, resolve, stageId, deptSkill } from './actions.js';
import { JOBS, DOORS, DEPTS, EXAMS, ALANLAR, deptById, jobTitle } from './careers.js';
import { BIZ_STEPS, bizYear, bankrupt } from './business.js';
import { drawCard, checkCond, render, cardById, optionVisible } from './events.js';
import { FRIEND_NAMES, NAMES } from './names.js';
import { looks, charisma, growCharisma, mizacHappy } from './traits.js';
import { homeYear, livingHome, homeBudget, HOME } from './household.js';
import { makeCandidates } from './partner.js';
import { balanceYear, studyHabitBonus, sedentaryRisk } from './balance.js';
import { incomeTax, lifestyleCost, lifestyleOf, initMarket, marketYear, makeHints, loanYear, houseYear, bankOf } from './finance.js';

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
  // Bebeklik: yenidoğan yılı yalnızca olay kartı; 1–5 yaşta oyunla gelişim için 2 eylem
  if (st.id === 'bebek' && s.age >= 1) ep = 2;
  else if (ep > 0) {
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
      workDone: 0, worked: 0, familyPaid: 0, social: 0,
    };
  });
}

// Eğitim yaşı: sınıfta kalan öğrenci okulu bir yıl geriden takip eder
export const eduAge = s => s.age - (s.edu.delay || 0);

function yearTasks(s) {
  const t = [];
  const ea = eduAge(s);
  const inSchool = ['ilkokul', 'orta', 'lise'].includes(s.edu.stage);
  if (inSchool && ea >= 7 && ea <= 17 && !s.flags.okulBirakti) t.push({ id: 'karne', exam: 'karne', done: false });
  if (s.edu.stage === 'orta' && ea === 13) t.push({ id: 'lgs', exam: 'lgs', done: false });
  if (s.edu.stage === 'lise' && ea >= 15 && !s.edu.alan && !s.flags.okulBirakti) {
    if (s.edu.school === 'meslek') s.edu.alan = 'meslek';
    else t.push({ id: 'alan', choice: 'alan', done: false });
  }
  if ((s.edu.stage === 'lise' && ea === 17 && !s.flags.okulBirakti) || s.flags.yksTekrar) t.push({ id: 'yks', exam: 'yks', done: false });
  return t;
}

export const epLeft = s => s.year.ep - s.year.used;

// Cep harçlığı: ailenin durumuna ve yaşa göre haftalık; aile zordaysa azalır ya da kesilir.
export function allowanceWeekly(s) {
  if (s.age < 6 || s.age >= 18) return 0;
  const band = s.age <= 9 ? 1 : s.age <= 13 ? 2 : 3;
  let w = CONFIG.allowanceWeekly[s.family.wealth][band] * s.priceIndex;
  if (!s.home) return w;
  if (s.home.stress >= 50) return 0;
  if (s.home.cash < 0) w *= 0.4;
  else if (s.home.stress >= 30) w *= 0.6;
  return w;
}
export const allowanceYear = s => allowanceWeekly(s) * 52;
export const pocketSaveRate = s => CONFIG.pocketSave[s.pocket || 'harca'] ?? 0.1;

// Mesai zorunluluğu: maaş, işe gidip enerji harcadıkça gelir.
export function workNeed(s) {
  const j = s.career.job;
  if (!j) return 0;
  if (j.id === 'cirak' || s.age < 18 || s.edu.stage === 'uni') return 1;
  return 2;
}

export function canEndYear(s) {
  const y = s.year;
  const reasons = [];
  if (y.used < y.ep) reasons.push(`${y.ep - y.used} eylem puanı kaldı`);
  const t = y.tasks.filter(t => !t.done);
  if (t.length) reasons.push(`Önemli: ${t.map(x => x.choice ? 'Alan seçimi' : EXAMS[x.exam].name).join(', ')}`);
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
  (s.seenAt ||= {})[card.id] = s.age;
  s.year.seenIds.push(card.id);
  const rank = { common: 0, rare: 1, epic: 2, legendary: 3 };
  if (!s.year.bestRarity || rank[card.rarity] > rank[s.year.bestRarity]) s.year.bestRarity = card.rarity;
  return card;
}

// ——————————————————— EYLEMLER ———————————————————
export function energyCost(a) {
  if (a.baby) return 0; // bebek oyunları enerji harcamaz
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
  const { money, family } = actionCost(a, s);
  if (money) { s.money -= money; out.lines.push(`−${fmt(money)} ücret`); }
  if (family) { y.familyPaid += family; out.lines.push(`Ücreti (${fmt(family)}) ailen ödedi.`); }
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
  if (a.id === 'bakim') s.flags.bakim = s.age;
  if (a.acikLise) {
    s.counters.acikLise = (s.counters.acikLise || 0) + 1;
    if (s.counters.acikLise >= 2) {
      s.flags.liseDiploma = true; s.flags.yksTekrar = true; s.flags.acikLiseYks = true;
      if (s.edu.gpa === null) s.edu.gpa = Math.round(40 + perf / 3);
      out.lines.push('🎓 Açık liseyi bitirdin! Lise diploman var; seneye üniversite sınavına girebilirsin.');
      log(s, 'Açık liseden diploma aldı.', 'rare');
    } else out.lines.push('📘 Açık lisede bir yılı tamamladın. Bir yıl daha!');
  }
  if (a.earn) { const e = a.earn * s.priceIndex * (0.5 + perf / 100) * (s.age < 18 && a.id === 'yari_zaman' ? 0.6 : 1); s.money += e; out.lines.push(`+${fmt(e)} kazandın`); out.earned = e; if (s.age < 18) y.worked++; }
  if (a.work) y.workDone += a.ep;
  if (['sosyal', 'spor'].includes(a.cat) || a.friend || a.date) y.social++;
  if (a.train === 'liderlik' || (a.stats && a.stats.sosyal)) growCharisma(s, 0.35 * (0.6 + perf / 125));
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
    if (a.analysis) {
      initMarket(s, r);
      const H = makeHints(s, perf, r);
      out.lines.push('📊 Gelecek yıl için piyasa ipuçların hazır (Finans sekmesi):', ...H.list.map(x => '• ' + x.text));
    }
    if (a.date) {
      const p = 0.2 + perf / 220 + s.stats.sosyal / 500 + (looks(s) - 50) / 300 + (charisma(s) - 50) / 350;
      if (r.chance(p)) {
        out.candidates = makeCandidates(s, r, perf);
        out.lines.push('💞 Yeni insanlarla tanıştın. Aralarından biriyle yakınlaştın — kimi seçeceksin?');
      } else out.lines.push('Keyifli sohbetler oldu ama kıvılcım çakmadı.');
    }
    if (a.love && s.rel.partner) {
      s.rel.partner.love = clamp(s.rel.partner.love + 12 * (0.7 + (s.rel.partner.compat ?? 50) / 100) + (s.traits.mizac === 'duygusal' ? 4 : 0), 0, 100);
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

const fmt = v => fmtTL(v);

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
  log(s, 'İlk ticaretine başladı: küçük satışlar.', 'rare');
}

export function depositSavings(s, amt = Math.floor(s.money / 2)) {
  amt = Math.floor(Math.min(amt, s.money));
  if (amt <= 0) return 0;
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
    default: {
      const al = ALANLAR[s.edu.alan];
      const ks = examId === 'yks' && al ? al.skills : ['matematik', 'fen', 'dil'];
      base = ks.reduce((a, k) => a + sk[k], 0) / ks.length * 0.7 + st.zeka * 0.3;
    }
  }
  let mod = studyHabitBonus(s) + (s.traits?.mizac === 'kaygili' ? 6 : 0) - Math.max(0, (s.year?.worked || 0) - 1) * 5;
  if (s.home && livingHome(s) && s.home.stress >= 50) mod -= 5; // evde huzur yok
  return clamp(Math.round(base * 0.6 + recent * 4 + mod), 0, 100);
}

// Sınav puanı = 0,65 × oyuncu + 0,30 × hazırlık + şans(0–5)
export function examScore(s, examId, playerPct) {
  const prep = examPrep(s, examId);
  const luck = withRng(s, r => r.float(0, 5));
  // İlk sınıflarda (ilk kez öğrenirken) öğretmen teşvik eder; 4. sınıftan sonra çalışma (hazırlık) daha belirleyici
  const ea = eduAge(s);
  const karne = examId === 'karne';
  const early = karne && ea <= 8 ? 8 : karne && ea === 9 ? 4 : 0;
  const wPrep = karne && ea >= 10 ? 0.38 : 0.30, wPlay = karne && ea >= 10 ? 0.58 : 0.65;
  const score = clamp(Math.round(wPlay * playerPct + wPrep * prep + luck + early), 0, 100);
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
      const g = s.edu.grades;
      if (['orta', 'lise'].includes(s.edu.stage) && res.score < 40 && g.length >= 2 && g[g.length - 2] < 40 && (s.edu.delay || 0) < 2 && s.age < 17) {
        s.edu.delay = (s.edu.delay || 0) + 1;
        s.counters.sinifTekrar = (s.counters.sinifTekrar || 0) + 1;
        addStat(s, 'mutluluk', -8);
        out.lines.push('🔁 İki yıl üst üste karnen çok zayıf: SINIFTA KALDIN. Aynı sınıfı bir yıl daha okuyacaksın.');
        log(s, 'Sınıfta kaldı.', 'rare');
        if (!s.chains.some(c => c.id === 'sinifta_kaldin')) s.chains.push({ id: 'sinifta_kaldin', at: s.age });
      }
      break;
    }
    case 'lgs': {
      s.edu.lgsTop = res.top;
      const ch = [];
      if (res.top <= 3) ch.push({ id: 'fen', name: 'Fen Lisesi', icon: '🔭', desc: 'Fen ve matematikte +%20 gelişim, üniversite sınavında avantaj.' });
      if (res.top <= 25) ch.push({ id: 'anadolu', name: 'Anadolu Lisesi', icon: '🏫', desc: 'Dengeli eğitim, dil ağırlıklı.' });
      ch.push({ id: 'meslek', name: 'Meslek Lisesi', icon: '🔧', desc: 'Çıraklık ve ustalığa hızlı giriş, el becerisi +.' });
      ch.push({ id: 'duz', name: 'Mahalle Lisesi', icon: '🏢', desc: 'Evine yakın, sakin bir okul.' });
      out.choices = { kind: 'school', list: ch };
      log(s, `Lise sınavında ilk %${res.top} dilime girdi.`, res.top <= 3 ? 'epic' : 'common');
      break;
    }
    case 'yks': {
      s.edu.yksTop = res.top;
      s.edu.yksTries++;
      delete s.flags.yksTekrar;
      const al = s.edu.alan;
      const fits = d => !al || d.alan === 'hepsi' || (Array.isArray(d.alan) && d.alan.includes(al));
      const list = DEPTS.filter(d => res.top <= d.top && fits(d)).map(d => ({ id: d.id, name: d.name, icon: d.icon, desc: `${d.years} yıl · taban: ilk %${d.top}` }));
      const locked = DEPTS.filter(d => res.top <= d.top && !fits(d));
      if (locked.length) out.lines.push(`🔒 Puanın yetse de alanın (${ALANLAR[al]?.name ?? 'Meslek'}) nedeniyle giremediğin bölümler: ${locked.map(d => d.name).join(', ')}`);
      list.push({ id: 'none', name: 'Üniversiteye gitme', icon: '🛠️', desc: 'Doğrudan iş hayatına ya da çıraklığa başla.' });
      if (s.edu.yksTries < 3) list.push({ id: 'retake', name: 'Seneye tekrar gir', icon: '🔁', desc: 'Bir yıl hazırlan, yeniden dene. Kaybetmek son değil.' });
      out.choices = { kind: 'dept', list };
      log(s, `Üniversite sınavında ilk %${res.top} dilimine girdi.`, res.top <= 2 ? 'epic' : 'common');
      break;
    }
    case 'ehliyet':
      if (res.score >= 55) { s.flags.ehliyet = true; out.pass = true; out.lines.push('🚗 Ehliyetini aldın!'); log(s, 'Ehliyet aldı.'); }
      else { out.pass = false; out.lines.push('Ehliyet sınavını geçemedin. Seneye tekrar dene.'); }
      break;
    case 'kpss':
      if (res.top <= 30) { s.flags.kpss = true; s.counters.kpssTop = res.top; out.pass = true; out.lines.push('🏛️ Kamu sınavı puanın devlet işlerine yetiyor!'); log(s, `Kamu sınavında ilk %${res.top}.`); }
      else { out.pass = false; out.lines.push('Kamu sınavı puanın yetmedi (ilk %30 gerekli). Tekrar deneyebilirsin.'); }
      break;
    case 'uni':
      s.edu.uniGrades.push(res.score);
      break;
  }
  return out;
}

export function chooseAlan(s, id) {
  s.edu.alan = id;
  const t = s.year.tasks.find(x => x.choice === 'alan'); if (t) t.done = true;
  log(s, `Lisede ${ALANLAR[id].name} alanını seçti.`, 'rare');
}
export function alanStrength(s, id) { const ks = ALANLAR[id].skills; return Math.round(ks.reduce((a, k) => a + s.skills[k], 0) / ks.length); }

export function chooseSchool(s, id) {
  s.edu.school = id;
  const names = { fen: 'Fen Lisesi', anadolu: 'Anadolu Lisesi', meslek: 'Meslek Lisesi', duz: 'mahalle lisesi' };
  log(s, `${names[id]}'ne yerleşti.`, id === 'fen' ? 'epic' : 'common');
}

export function chooseDept(s, id) {
  if (id === 'retake') { s.flags.yksTekrar = true; s.edu.pendingDept = null; log(s, 'Üniversite sınavına bir yıl daha hazırlanmaya karar verdi.'); return; }
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
  if (J.needFlag && !s.flags[J.needFlag]) miss.push(J.needFlag === 'ehliyet' ? 'Ehliyet' : 'Kamu sınavı');
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
  if (!optionVisible(s, opt)) return false;
  if (!opt.req) return true;
  return checkCond(opt.req, s);
}

export function applyEffects(s, e, card) {
  const lines = [];
  if (!e) return lines;
  const pi = s.priceIndex;
  for (const [k, v] of Object.entries(e.stats || {})) { const d = addStat(s, k, v); if (Math.abs(d) >= 0.5) lines.push({ k, v: d }); }
  for (const [k, v] of Object.entries(e.skills || {})) { s.skills[k] = clamp(s.skills[k] + v, 0, 100); lines.push({ k, v }); }
  if (e.money) {
    const v = e.money * pi;
    if (s.age < 18 && v > CONFIG.bigPrizeToAccount * pi) {
      s.savings += v; lines.push({ text: `🏦 ${fmt(v)} ailen tarafından senin adına bankaya yatırıldı.` });
    } else { s.money += v; lines.push({ k: 'money', v }); }
  }
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
  if (e.bizBoost && s.career.biz) s.career.biz.boost = { ...e.bizBoost };
  if (e.bizTrend && s.career.biz) s.career.biz.trend = clamp((s.career.biz.trend ?? 0) + e.bizTrend, -1, 1);
  // bizMoney: işletmenin aylık kârı cinsinden tutar (her basamakta orantılı büyür)
  if (e.bizMoney && s.career.biz) {
    const v = e.bizMoney * BIZ_STEPS[s.career.biz.step].monthly * pi;
    s.money += v; lines.push({ k: 'money', v });
  }
  if (e.giveMoneyPct && s.home) { const amt = Math.max(0, s.money) * e.giveMoneyPct; s.money -= amt; s.home.cash += amt; s.home.helpYear += amt; s.home.helpTotal += amt; if (amt > 0) lines.push({ k: 'money', v: -amt, text: `🏠 Ailene ${fmt(amt)} verdin.` }); }
  if (e.homeCash && s.home) { s.home.cash += e.homeCash * pi; lines.push({ text: `🏠 Aile kasası ${e.homeCash > 0 ? '+' : '−'}${fmt(Math.abs(e.homeCash * pi))}` }); }
  if (e.homeStress && s.home) { s.home.stress = clamp(s.home.stress + e.homeStress, 0, 100); lines.push({ text: `🏠 Aile stresi ${e.homeStress > 0 ? '+' : ''}${e.homeStress}` }); }
  if (e.homeCrisis && s.home) { s.home.crises.push({ ...e.homeCrisis }); }
  if (e.homeIncPct && s.home) s.home.incPct *= e.homeIncPct;
  if (e.homeExpPct && s.home) s.home.expPct *= e.homeExpPct;
  if (e.relation) s.family.relation = e.relation;
  if (e.karizma && s.traits) growCharisma(s, e.karizma);
  if (e.partnerSalaryPct && s.rel.partner) s.rel.partner.salary = Math.round((s.rel.partner.salary || 0) * e.partnerSalaryPct);
  if (e.partnerJobless && s.rel.partner) s.rel.partner.jobless = e.partnerJobless;
  if (e.eduDrop) {
    s.edu.stage = 'done'; s.flags.okulBirakti = true;
    for (const t of s.year.tasks) t.done = true;
    log(s, 'Ailesi için okulu bırakıp çalışmaya başladı.', 'epic');
  }
  if (e.parentHealth) { const p = s.family.parents.find(x => x.alive); if (p) p.age += e.parentHealth; }
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
      const p = typeof e.parentDies === 'string' ? alive.find(x => x.role === e.parentDies) : alive.sort((a, b) => b.age - a.age)[0];
      if (p) {
        p.alive = false;
        const share = inheritanceShare(s) / Math.max(1, alive.length);
        log(s, `${p.role === 'Anne' ? 'Annesi' : 'Babası'} ${p.name} ${p.age} yaşında vefat etti.`, 'epic');
        lines.push({ text: `🕊️ ${p.name} aramızdan ayrıldı.` });
        if (share > 0) {
          if (s.age < 18) { s.savings += share; lines.push({ text: `🏦 Payına düşen miras (${fmt(share)}) 18 yaşına kadar senin adına bankada.` }); }
          else { s.money += share; lines.push({ k: 'money', v: share, text: 'Miras' }); }
        }
        if (s.age < 18) {
          if (!s.family.parents.some(x => x.alive)) { s.flags.akrabaYaninda = true; lines.push({ text: '🏠 Artık akrabalarının yanında büyüyeceksin.' }); }
          else lines.push({ text: '🏠 Evin geliri düştü; yetim aylığı bağlandı.' });
        }
      }
    }
    if (e.siblingDies && s.family.siblings > 0) {
      s.family.siblings--;
      log(s, 'Kardeşini kaybetti.', 'epic');
    }
    if (e.partnerDies && s.rel.partner) {
      const P = s.rel.partner;
      log(s, `Eşi ${P.name} vefat etti.`, 'epic');
      lines.push({ text: `🕊️ ${P.name} aramızdan ayrıldı.` });
      s.rel.partner = null; s.rel.married = false; s.flags.dul = true;
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
  // Riskli karar: başarı şansı beceri, itibar ve piyasa havasına bağlı (mini oyunsuz)
  if (opt.gamble && !opt.mg) {
    const g = opt.gamble;
    const sk = g.skill ? (s.skills[g.skill] ?? 0) : 50;
    const tr = s.career.biz?.trend ?? 0;
    const p = clamp((g.p ?? 0.5) + (sk - 50) / 250 + tr * 0.1 + (s.stats.itibar - 50) / 500, 0.08, 0.92);
    mgScore = withRng(s, r => r.chance(p)) ? 100 : 0;
  }
  if ((opt.mg || opt.gamble) && mgScore !== null) {
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

  for (const k of Object.keys(y.trained)) { s.train[k] = (s.train[k] || 0) + 1; (s.lastTrain ||= {})[k] = s.age; }
  const bal = balanceYear(s);
  sum.notes.push(...bal.notes);
  sum.good = bal.good;
  for (const id of bal.cards) if (!s.chains.some(c => c.id === id) && !(s.seenAt?.[id] !== undefined && s.age - s.seenAt[id] < 10)) s.chains.push({ id, at: s.age + 1 });
  s.studyLog.push(y.study); if (s.studyLog.length > 4) s.studyLog.shift();

  withRng(s, r => {
    let earned = 0; // bu yıl eline geçen net gelir (yaşam standardı için)
    // ——— Ekonomi ———
    const infl = r.float(CONFIG.inflation[0], CONFIG.inflation[1]);
    s.priceIndex *= 1 + infl;
    sum.inflation = infl;
    const pi = s.priceIndex;

    if (s.age < 18 && s.age >= 6) {
      const al = allowanceYear(s);
      if (al > 0) {
        const keep = al * pocketSaveRate(s);
        s.money += keep; s.home.cash -= al;
        sum.income.push([`Harçlık (haftada ${fmt(al / 52)})`, al]);
        sum.expense.push(['Harcadığın (kantin, yol, arkadaşlar)', al - keep]);
        if (s.pocket === 'biriktir') { addStat(s, 'disiplin', 1); addStat(s, 'mutluluk', -1.5); }
        if (s.pocket === 'harca') addStat(s, 'mutluluk', 1);
      } else sum.notes.push('🪙 Ailen bu yıl harçlık veremedi; evde para yok.');
    }
    // Gençler cebindeki parayı da harcar: telefon, kıyafet, arkadaşlar
    if (s.age >= 6 && s.age < 18 && s.money > 0) {
      const rate = { harca: 0.6, yarisi: 0.35, biriktir: 0.12 }[s.pocket || 'harca'];
      const sp = s.money * rate;
      if (sp > 1) { s.money -= sp; sum.expense.push(['Kişisel harcamalar (telefon, kıyafet, gezme)', sp]); }
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
      const perf = j.perfN ? j.perfSum / j.perfN : 25;
      const need = workNeed(s);
      const wf = need ? Math.min(1, y.workDone / need) : 1;
      // Futbolda maaş performansa çok daha bağlı: yedek kalan az, yıldız çok kazanır
      const perfF = J.path === 'futbol' ? Math.min(1.4, 0.55 + perf / 110) : 0.85 + perf / 333;
      let sal = J.salary * levelMult(j) * 12 * pi * perfF * (0.35 + 0.65 * wf);
      if (s.traits.mizac === 'hirsli') sal *= 1.05;
      if (wf < 1) sum.notes.push(wf === 0 ? '⚠️ Bu yıl işe hiç gitmedin! Maaşının çoğu kesildi; üst üste olursa kovulursun.' : `⚠️ Mesailerin eksikti (${y.workDone}/${need}); maaşın kesintili yattı.`);
      if (wf === 0) j.absent = (j.absent || 0) + 1; else j.absent = 0;
      if (J.farm) {
        const farmPerf = j.farmSum ? j.farmSum / Math.max(1, j.perfN) : 45;
        sal = J.salary * levelMult(j) * 12 * pi * (0.5 + farmPerf / 100) * r.float(0.85, 1.2);
      }
      if (j.id === 'cirak' && s.flags.kendiDukkan) sal *= 1.7;
      if (s.age < 18 && j.id !== 'cirak') sal *= 0.5;
      // Futbolcu sakatlığı: yaş ilerledikçe sıklaşır, sezonun yarısını kaçırırsın
      if (j.id === 'futbolcu' && r.chance(0.1 + Math.max(0, s.age - 28) * 0.025)) {
        sal *= 0.6; addStat(s, 'saglik', -6); addStat(s, 'mutluluk', -4);
        sum.notes.push('🩼 Sakatlık: sezonun yarısını kaçırdın, maaşın ve primlerin düştü.');
      }
      s.money += sal; sum.income.push([`Maaş · ${jobTitle(j)}`, sal]);
      const tax = incomeTax(sal, pi);
      if (tax > 0) { s.money -= tax; sum.expense.push(['Gelir vergisi', tax]); }
      let fee = 0;
      if (J.path === 'futbol' && j.id === 'futbolcu') { fee = sal * 0.1; s.money -= fee; sum.expense.push(['Menajer payı (%10)', fee]); }
      earned += sal - tax - fee;
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
      if ((j.absent >= 2) || (perf < 30 && j.years > 1 && r.chance(0.35))) {
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
        const label = { boom: '🚀 Rekor yıl', crash: '💥 Çöküş', bad: 'Kötü yıl', good: 'Kâr' }[br.kind];
        if (br.bad) sum.expense.push([`${label} · ${br.step.name}`, -br.net]);
        else sum.income.push([`${label} · ${br.step.name} (beceri ${Math.round(br.skill)})`, br.net]);
        s.money += br.net;
        // İşletme kârı da gelir vergisine tabidir
        const btax = br.net > 0 ? incomeTax(br.net, pi) : 0;
        if (btax > 0) { s.money -= btax; sum.expense.push(['Gelir vergisi (işletme)', btax]); }
        if (br.net > 0) earned += br.net - btax;
        if (br.kind === 'boom') { sum.notes.push(`🚀 ${br.reason} Kâr normalin kat kat üstünde!`); log(s, `Ticarette rekor yıl: ${br.reason}`, 'epic'); }
        else if (br.kind === 'crash') { sum.notes.push(`💥 ${br.reason} Birikimin açığı kapatamazsa iflas kapıda.`); log(s, `Ticarette büyük darbe: ${br.reason}`, 'rare'); }
        else if (br.kind === 'bad') sum.notes.push(`📉 Kötü yıl: ${br.reason} Beceri yükseldikçe bu risk azalır.`);
      }
    }

    // Yaşam gideri
    if (s.age >= 15) {
      const lc = CONFIG.livingCost.find(l => s.age >= l.age).cost;
      let cost = lc * 12 * pi;
      const wr = ['fakir', 'orta', 'varlikli', 'zengin'].indexOf(s.family.wealth);
      if (s.age < 18) cost = 0;                    // aile karşılar
      else if (s.edu.stage === 'uni') {
        // Öğrencinin gideri: aile payını kendi kasasından öder (kasası elverdiği ölçüde)
        const famShare = [0, 0.5, 0.9, 1][wr];
        const full = cost * (s.flags.burs ? 0.5 : 1);
        const fam = s.home && s.family.parents.some(p => p.alive) ? Math.min(full * famShare, Math.max(0, s.home.cash + homeBudget(s).net)) : 0;
        y.familyPaid += fam;
        if (fam > 0) sum.notes.push(`🎓 Ailen okul masraflarının ${fmt(fam)} kadarını karşıladı.`);
        cost = full - fam;
      }
      else if (!s.career.job && !s.career.biz && !s.career.retired) cost *= 0.55; // işsizken asgari yaşam (aileyle / küçük ev)
      if (s.rel.married && s.rel.partner) {
        const P = s.rel.partner;
        cost *= 1.5;
        if (P.trait === 'tutumlu') cost *= 0.88;
        if (P.trait === 'savurgan') cost *= 1.2;
        const pSal = (P.salary ?? 26000) * (P.trait === 'hirsli' ? 1.25 : 1) * (P.jobless ? 0 : 1);
        const pInc = pSal * 12 * pi;
        if (pInc > 0) { s.money += pInc; sum.income.push([`${P.name}'in geliri (${P.job ?? 'çalışıyor'})`, pInc]); }
        if (P.jobless) { P.jobless--; if (!P.jobless) sum.notes.push(`💼 ${P.name} yeniden iş buldu.`); }
      }
      if (s.flags.evSahibi) cost *= 0.8;
      const kids = s.rel.children.filter(c => c.age < 18).length;
      cost += kids * 7000 * 12 * pi;
      if (cost > 0) { s.money -= cost; sum.expense.push(['Yaşam gideri (kira, fatura, mutfak)', cost]); }
      // Yaşam standardı: gelir arttıkça araba, tatil, restoran, lüks harcamalar da artar
      if (s.age >= 18 && earned > 0) {
        const ls = lifestyleCost(s, earned, lc * 12 * pi);
        if (ls > 0) { s.money -= ls; sum.expense.push([`Yaşam standardı · ${lifestyleOf(s).name} (araba, tatil, restoran)`, ls]); addStat(s, 'mutluluk', lifestyleOf(s).happy); }
      }
    }

    // ——— Hane (ailen) ———
    const ho = homeYear(s, r, y.familyPaid);
    sum.home = { net: ho.net, stress: s.home.stress, delta: ho.stressDelta, cash: s.home.cash };
    sum.notes.push(...ho.notes);
    for (const card of ho.cards) {
      const id = livingHome(s) ? card : (card === 'aile_fatura' ? null : 'ebeveyn_zor');
      if (id && !s.chains.some(c => c.id === id)) s.chains.push({ id, at: s.age + 1 });
    }
    if (livingHome(s) && s.home.stress >= 30) addStat(s, 'mutluluk', -s.home.stress / 12);

    // Birikim getirisi (enflasyon + %3)
    if (s.savings > 0) {
      const g = s.savings * (infl + 0.03);
      s.savings += g; sum.income.push(['Mevduat faizi', g]);
    }
    // ——— Borsa, gayrimenkul, kredi ———
    if (s.market || s.age >= 18) {
      const mk = marketYear(s, r, infl);
      if (mk.div > 0) { s.money += mk.div; sum.income.push(['Temettü (hisse kâr payı)', mk.div]); }
      if (Object.keys(s.portfolio || {}).length) sum.notes.push(`📈 Portföyün bu yıl ${mk.change >= 0 ? '+' : '−'}${fmt(Math.abs(mk.change))} ${mk.change >= 0 ? 'değer kazandı' : 'değer kaybetti'}.`);
      if (mk.news.length && s.age >= 18) sum.notes.push(`📰 Borsa: ${mk.news[0].t}`);
    }
    if (s.houses?.length) {
      const hy = houseYear(s, r, infl);
      if (hy.rent > 0) { s.money += hy.rent; sum.income.push(['Kira geliri', hy.rent]); }
    } else if (s.market) s.market.house = (s.market.house ?? 1) * (1 + r.normal(0.02, 0.06));
    if (s.bank?.loans.length) {
      const ly = loanYear(s);
      if (ly.paid > 0) sum.expense.push(['Kredi taksitleri', ly.paid]);
      sum.notes.push(...ly.notes);
    }
    // Çocuk borçlanamaz: cepteki açığı ailesi kapatır
    if (s.age < 18 && s.money < 0 && s.home) { s.home.cash += s.money; sum.notes.push(`🏠 Cebindeki açığı (${fmt(-s.money)}) ailen kapattı.`); s.money = 0; }
    // Borç
    if (s.money < 0) {
      if (s.savings > 0) { const t = Math.min(s.savings, -s.money); s.savings -= t; s.money += t; sum.notes.push('🏦 Açığı birikiminden kapattın.'); }
      if (s.money < 0 && s.career.biz && s.career.biz.step > 0) {
        const ns = bankrupt(s);
        s.life.bankrupt++;
        bankOf(s).score = Math.max(0, bankOf(s).score - 30);
        sum.notes.push(`💥 İflas! İşletmen "${BIZ_STEPS[ns].name}" basamağına geriledi, borç yapılandırıldı. Oyun bitmedi — yeniden tırman.`);
        log(s, 'İflas etti ve yeniden başladı.', 'rare');
        s.money = 0;
      } else if (s.money < 0) {
        s.money *= 1.1; // borç faizi
        if (s.age >= 18) bankOf(s).score = Math.max(0, bankOf(s).score - 6);
        // Borç yapılandırma: borç en fazla 2 yıllık yaşam giderine kadar birikir
        const cap = -2 * (CONFIG.livingCost.find(l => s.age >= l.age)?.cost ?? 12000) * 12 * pi;
        if (s.money < cap) { s.money = cap; addStat(s, 'itibar', -2); sum.notes.push('🏦 Borcun yapılandırıldı; faiz durduruldu ama itibarın biraz zedelendi.'); }
        addStat(s, 'mutluluk', -5);
        sum.notes.push('💳 Borçlusun. Borç her yıl %10 büyür; bir iş bulmak ya da gideri azaltmak toparlanmanın yolu.');
      }
    }

    // ——— Eğitim geçişleri ———
    const nextAge = eduAge(s) + 1;
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
    // 18 yaşına gelip hâlâ ortaokul/lisedeysen örgün eğitim biter: açık liseyle devam edebilirsin
    if (s.age + 1 >= 18 && ['orta', 'lise'].includes(s.edu.stage) && eduAge(s) + 1 < 18) {
      s.edu.stage = 'done'; s.flags.okulBirakti = true;
      sum.notes.push('🏫 Yaşın örgün eğitim sınırını geçti; okul hayatın sona erdi. Açık liseyle diplomanı alabilirsin.');
      log(s, 'Örgün eğitimi tamamlayamadı; açık lise yolu açıldı.');
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
    if (s.edu.stage === 'done' && !s.edu.degree && s.edu.pendingDept && s.edu.pendingDept !== 'none' && !s.flags.yksTekrar && s.flags.acikLiseYks) {
      s.edu.stage = 'uni'; s.edu.dept = s.edu.pendingDept; s.edu.uniYears = 0; s.edu.uniGrades = []; delete s.flags.acikLiseYks;
      sum.notes.push(`🎓 Geç de olsa üniversiteli oldun: ${deptById[s.edu.pendingDept].name}!`);
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
    if (s.age < 45 && s.stats.saglik < 65) addStat(s, 'saglik', 0.8); // genç beden toparlanır
    if (s.age >= 45) addStat(s, 'saglik', -0.5);
    if (s.age >= 60) addStat(s, 'saglik', -1);
    if (s.age >= 70) addStat(s, 'saglik', -0.9);
    if (s.stats.fizik > 50) addStat(s, 'saglik', 0.5);
    // Mutluluk dengeye döner
    const P = s.rel.partner;
    const pBonus = P && s.rel.married ? ({ destekleyici: 4, sakin: 2, kiskanc: -2, maceraci: 1 }[P.trait] || 0) + (P.love - 50) / 10 : 0;
    const base = 55 + (s.rel.married ? 6 : 0) + pBonus + mizacHappy(s) + (s.rel.friends >= 3 ? 4 : 0) + (s.money < 0 ? -10 : 0);
    if (P && s.rel.married && P.trait === 'destekleyici') addStat(s, 'disiplin', 0.5);
    s.stats.mutluluk = clamp(s.stats.mutluluk + (base - s.stats.mutluluk) * 0.12, 0, 100);
    s.stats.disiplin = clamp(s.stats.disiplin + (s.age < 25 ? 0.6 : 0.2), 0, 100);

    // ——— Aile ———
    for (const p of s.family.parents) if (p.alive) p.age++;
    for (const c of s.rel.children) c.age++;
    if (P) {
      let decay = (s.rel.married ? 3 : 6) * (1.5 - (P.compat ?? 50) / 100);
      if (P.trait === 'hirsli') decay += 1.5;
      if (P.trait === 'kiskanc' && y.social >= 3) { decay += 4; sum.notes.push(`😒 ${P.name}, sosyal hayatına çok vakit ayırmandan rahatsız.`); }
      if (P.trait === 'sakin') decay -= 1;
      P.love = clamp(P.love - decay, 0, 100);
      if (P.age !== undefined) P.age++;
    }
    if (P && P.love < 12) {
      if (s.rel.married) {
        const split = Math.max(0, s.money) * 0.5 + s.savings * 0.5;
        s.money -= Math.max(0, s.money) * 0.5; s.savings *= 0.5;
        sum.notes.push(`💔 ${P.name} ile boşandınız. Mal paylaşımında ${fmt(split)} ${P.name}'e geçti.`);
        log(s, `${P.name} ile boşandı.`, 'rare');
        addStat(s, 'mutluluk', -15);
      } else {
        sum.notes.push(`💔 ${P.name} ile aranız soğudu ve ayrıldınız.`);
        log(s, `${P.name} ile ayrıldı.`);
        addStat(s, 'mutluluk', -8);
      }
      s.rel.partner = null; s.rel.married = false; s.rel.exes++;
    }
    // Emeklilik: ebeveynlerin geliri düşer
    for (const p of s.family.parents) if (p.alive && p.age === 62) sum.notes.push(`🪑 ${p.role === 'Anne' ? 'Annen' : 'Baban'} emekli oldu; ailenin geliri azaldı.`);
    // Aile üyelerinin vefatı: yaşa bağlı risk; genç yaşta ani kayıplar nadir ama mümkün
    const due = id => s.chains.some(c => c.id === id);
    for (const p of s.family.parents) {
      const id = p.role === 'Anne' ? 'anne_vefat' : 'baba_vefat';
      if (p.alive && !due(id) && r.chance(deathP(p.age, 62) * (p.role === 'Baba' ? 1.15 : 0.95))) s.chains.push({ id, at: s.age + 1 });
    }
    if (s.family.siblings > 0 && !due('kardes_vefat') && r.chance(0.0012 * s.family.siblings)) s.chains.push({ id: 'kardes_vefat', at: s.age + 1 });
    if (P && s.rel.married && (P.age ?? s.age) >= 45 && !due('es_vefat') && r.chance(deathP(P.age ?? s.age, 62))) s.chains.push({ id: 'es_vefat', at: s.age + 1 });

    // ——— Ölüm ———
    let dp = deathP(s.age, s.stats.saglik) * sedentaryRisk(s);
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
// Yenidoğan: eylem yok, yalnızca olay kartları (1–5 yaş bebek oyunları oynar)
export const isInfant = s => stageId(s) === 'bebek' && s.age < 1;
export const isBaby = s => stageId(s) === 'bebek';
