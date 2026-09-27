// Başlangıç zarı (Tasarım Dokümanı §3): aynı tohum → aynı başlangıç.
import { RNG } from '../core/rng.js';
import { clamp } from '../core/util.js';
import { SKILLS } from '../config.js';
import { initEnergy } from '../core/energy.js';
import { PARENT_JOBS, JOBS } from './careers.js';
import { NAMES, SURNAMES, CITIES } from './names.js';

export const WEALTH = {
  fakir:    { name: 'Fakir',    icon: '🏚️' },
  orta:     { name: 'Orta',     icon: '🏠' },
  varlikli: { name: 'Varlıklı', icon: '🏡' },
  zengin:   { name: 'Zengin',   icon: '🏰' },
};
export const PLACE = {
  koy:    { name: 'Köy',        icon: '🌄' },
  kasaba: { name: 'Kasaba',     icon: '🏘️' },
  sehir:  { name: 'Büyükşehir', icon: '🌆' },
};
export const RELATION = {
  sicak: { name: 'Sıcak',  icon: '🤗', happy: 12 },
  normal:{ name: 'Normal', icon: '🙂', happy: 0 },
  zor:   { name: 'Zor',    icon: '😣', happy: -12 },
};
export const RARE = {
  ikiz:    { name: 'İkiz',             icon: '👯', text: 'Bir ikiz kardeşin var. Her şeyi birlikte yaşayacaksınız.' },
  mirasci: { name: 'Mirasçı',          icon: '📜', text: 'Uzak bir akrabadan sana bırakılmış bir miras fonu var.' },
  sporcu:  { name: 'Sporcu ailesi',    icon: '🏅', text: 'Ailede herkes sporcu. Kanında hareket var.' },
  gocmen:  { name: 'Göçmen aile',      icon: '🧳', text: 'Ailen yıllar önce başka bir ülkeden geldi; iki dil konuşarak büyüyeceksin.' },
};

export function rollStart(seed) {
  const rng = new RNG(seed);
  const wealth = rng.weighted([['fakir', 30], ['orta', 45], ['varlikli', 20], ['zengin', 5]]);
  const place = rng.weighted([['koy', 25], ['kasaba', 30], ['sehir', 45]]);
  const jobs = rng.shuffle(PARENT_JOBS[wealth]);
  const parents = [
    { role: 'Anne', name: rng.pick(NAMES.k), job: jobs[0][0], path: jobs[0][1], alive: true, age: rng.int(22, 36) },
    { role: 'Baba', name: rng.pick(NAMES.e), job: jobs[1][0], path: jobs[1][1], alive: true, age: rng.int(24, 39) },
  ];
  const siblings = rng.weighted([[0, 25], [1, 38], [2, 22], [3, 10], [4, 5]]);
  const relation = rng.weighted([['sicak', 35], ['normal', 45], ['zor', 20]]);
  const health = Math.round(clamp(rng.normal(78, 12), 40, 100));
  const rare = rng.chance(0.03) ? rng.pick(Object.keys(RARE)) : null;
  const city = rng.pick(CITIES[place]);

  // Gizli potansiyeller
  const talents = {};
  for (const s of SKILLS) talents[s.id] = Math.round(clamp(rng.normal(48, 20), 1, 100));
  // Birkaç çocuğun bir alanı gerçekten parlaktır
  const star = rng.pick(SKILLS).id;
  talents[star] = Math.max(talents[star], rng.int(70, 96));
  // Aile etkisi
  for (const p of parents) {
    const map = { futbol: 'futbol', doktor: 'fen', muhendis: 'matematik', usta: 'el', ciftci: 'doga', tuccar: 'ticaret' };
    if (map[p.path]) talents[map[p.path]] = clamp(talents[map[p.path]] + 8, 1, 100);
  }
  if (rare === 'sporcu') talents.futbol = clamp(talents.futbol + 20, 1, 100);
  if (rare === 'gocmen') talents.dil = clamp(talents.dil + 18, 1, 100);
  if (place === 'koy') talents.doga = clamp(talents.doga + 8, 1, 100);

  return { wealth, place, city, parents, siblings, relation, health, rare, talents, surname: rng.pick(SURNAMES), rngState: rng.s };
}

export function newLife({ seed, name, gender, surname, daily = false, inherit = null }) {
  const r = rollStart(seed);
  const rngCont = new RNG(r.rngState);
  const skills = Object.fromEntries(SKILLS.map(s => [s.id, 0]));
  const state = {
    v: 1,
    seed: String(seed),
    rng: rngCont.s,
    daily,
    gen: inherit ? inherit.gen + 1 : 1,
    name: name || rngCont.pick(NAMES[gender || 'k']),
    surname: surname || r.surname,
    gender: gender || 'k',
    age: 0,
    alive: true,
    calendarYear: inherit ? inherit.calendarYear : 2026,
    family: {
      wealth: r.wealth, place: r.place, city: r.city, parents: r.parents,
      siblings: r.rare === 'ikiz' ? Math.max(1, r.siblings) : r.siblings,
      relation: r.relation, rare: r.rare, famRep: inherit ? inherit.famRep : 0,
    },
    talents: r.talents,
    hints: {},
    hintAds: 0,
    stats: {
      zeka: 12, fizik: 12, sosyal: 12, disiplin: 8,
      saglik: r.health, mutluluk: clamp(62 + RELATION[r.relation].happy, 0, 100),
      itibar: inherit ? Math.min(25, Math.round(inherit.famRep / 4)) : 0,
    },
    skills,
    money: 0,
    savings: 0,
    priceIndex: inherit ? inherit.priceIndex : 1,
    energy: initEnergy(),
    edu: { stage: 'none', grades: [], gpa: null, school: null, dept: null, uniYears: 0, uniGrades: [], degree: null, lgsTop: null, yksTop: null, yksTries: 0 },
    career: { job: null, biz: null, doors: {}, retired: false, pension: 0, jobsHad: [], pathEP: {} },
    rel: { friends: 1, partner: null, married: false, children: [], exes: 0 },
    flags: {},
    counters: {},
    train: {},          // alanda antrenman/çalışma yapılan yıl sayısı
    studyLog: [],       // son yılların ders eylemi sayısı (sınav hazırlığı)
    pity: 0,
    chains: [],
    seen: {},
    year: null,
    log: [],
    legends: [],
    titles: [],
    life: { honest: 0, peakMoney: 0, examResults: [], jobs: [], mgPlayed: 0, mgBest: {}, bankrupt: 0 },
  };
  if (r.rare === 'mirasci') state.flags.mirasFonu = true;
  if (inherit) {
    state.money = 0;
    state.inheritance = inherit.money;       // 18 yaşında eline geçer
    state.flags.aileSirketi = inherit.bizStep ?? null;
    state.family.surnameLegacy = inherit.titles || [];
  }
  return state;
}

// Nesil sistemi: ölen karakterin çocuğuyla devam. Çocuk mevcut yaşıyla başlar.
export function newChildLife(parent, childIdx, seed) {
  const c = parent.rel.children[childIdx];
  const estate = Math.max(0, parent.money + parent.savings) * 0.9 / Math.max(1, parent.rel.children.length);
  const real = (Math.max(0, parent.money + parent.savings)) / parent.priceIndex;
  const wealth = real >= 50e6 ? 'zengin' : real >= 5e6 ? 'varlikli' : real >= 5e5 ? 'orta' : 'fakir';
  const s = newLife({
    seed, name: c.name, gender: c.gender, surname: parent.surname,
    inherit: {
      gen: parent.gen, famRep: parent.family.famRep + Math.round(parent.stats.itibar / 2),
      priceIndex: parent.priceIndex, calendarYear: parent.calendarYear, money: estate,
      bizStep: parent.career.biz ? parent.career.biz.step : null, titles: parent.titles,
    },
  });
  const rng = new RNG(s.rng);
  s.family.wealth = wealth;
  s.family.place = parent.family.place;
  s.family.city = parent.family.city;
  s.family.siblings = parent.rel.children.length - 1;
  s.family.relation = (parent.flags.cocukBag || 0) >= 4 ? 'sicak' : 'normal';
  const pRole = parent.gender === 'k' ? 'Anne' : 'Baba';
  const other = { role: pRole === 'Anne' ? 'Baba' : 'Anne', name: parent.rel.partner?.name || rng.pick(NAMES[parent.gender === 'k' ? 'e' : 'k']), job: 'Emekli', path: 'genel', alive: !!parent.rel.partner, age: parent.age - 2 };
  const self = { role: pRole, name: parent.name, job: parent.career.job ? JOBS[parent.career.job.id].name : parent.life.jobs.length ? JOBS[parent.life.jobs[parent.life.jobs.length - 1]].name : 'Ev hayatı', path: 'genel', alive: false, age: parent.age };
  s.family.parents = pRole === 'Anne' ? [self, other] : [other, self];
  if (c.talent) s.talents[c.talent] = clamp(s.talents[c.talent] + 15, 1, 100);
  // Çocuğun yaşına kadar olan gelişimi özetle
  const a = c.age;
  s.age = a;
  for (const k of Object.keys(s.skills)) s.skills[k] = clamp(Math.min(40 + 0.6 * s.talents[k], s.talents[k] * a / 45 * rng.float(0.5, 1)), 0, 100);
  s.stats.zeka = clamp(12 + a * 2, 0, 65); s.stats.fizik = clamp(12 + a * 2.2, 0, 70);
  s.stats.sosyal = clamp(12 + a * 1.8, 0, 60); s.stats.disiplin = clamp(8 + a * 1.5, 0, 55);
  s.edu.stage = a < 6 ? 'none' : a < 10 ? 'ilkokul' : a < 14 ? 'orta' : a < 18 ? 'lise' : 'done';
  if (a >= 14) s.edu.school = 'duz';
  if (a >= 7) { s.edu.grades = [65]; s.edu.gpa = 65; }
  if (a >= 18) { s.money = estate; s.inheritance = 0; if (s.flags.aileSirketi != null) { s.career.biz = { step: Math.max(0, s.flags.aileSirketi - 1), years: 0, skillSum: 0, skillN: 0, bankrupt: 0 }; } }
  s.log.push({ age: a, text: `${parent.name} ${parent.surname}'ın mirasını devraldı. Aile hikâyesi ${s.gen}. nesilde sürüyor.`, r: 'epic' });
  s.rng = rng.s;
  return s;
}

export function lifeScoreTitle(score) {
  if (score >= 900) return 'Efsanevi Hayat';
  if (score >= 700) return 'Parlak Hayat';
  if (score >= 500) return 'Dolu Dolu Hayat';
  if (score >= 350) return 'Güzel Hayat';
  return 'Sade Hayat';
}
