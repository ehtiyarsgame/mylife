// Olay destesi (Tasarım Dokümanı §8). Kartlar data/events.json dosyasında,
// kod yazmadan eklenebilir. Koşul ve etki dili bu dosyada yorumlanır.
import { CONFIG } from '../config.js';
import { tpl } from '../core/util.js';
import { T, locale, lang } from '../core/i18n.js';
import { hashString } from '../core/rng.js';
import { stageId } from './actions.js';
import { looks, charisma } from './traits.js';
import { livingHome } from './household.js';

let DECK = [];
let BY_ID = {};
export function setDeck(cards) {
  DECK = cards;
  BY_ID = Object.fromEntries(cards.map(c => [c.id, c]));
  for (const c of cards) {
    c._need = needsFrom([c.title, c.text].join(' '), c.id);
    for (const o of c.options || []) o._need = needsFrom([o.text, o.result].join(' '), c.id);
  }
}

// Metinde adı geçen kişiler hayatta/var olmalı: ölen babanın "işten çıkarıldı" kartı gelmesin.
// Ölüm kartları da kişi hayattayken çekilir (ölüm, kartın etkisiyle olur), bu yüzden kurala tabidir.
// Yalnızca geçmişi anan metinler (rahmetli, mezar, "dedenden kalan") kuralın dışında kalır.
const MEMORIAL = /rahmetli|mezar|den kalan|dan kalan|anısına/i;
const WHO = {
  baba: /\{baba\}|\bbaban\b|baban[ıi]n|babana|babanla|baban[ıi]\b|babandan/i,
  anne: /\{anne\}|\bannen\b|annenin|annene|annenle|anneni\b|annenden/i,
  ikisi: /anne-?baban|annenle baban|annen ve baban|annenler/i,
  kardes: /\bkardeşin\b|kardeşinin|kardeşine|kardeşinle|kardeşini\b|kardeşlerin/i,
  dede: /\bdeden\b|dedenin|dedene|dedenle|dedeni\b|\bninen\b|ninenin|ninene|ninenle/i,
  partner: /\{partner\}|\beşin\b|eşinin|eşine|eşinle|eşini\b|\bkarın\b|karının|\bkocan\b|kocanın/i,
};
function needsFrom(txt, id) {
  if (!txt || MEMORIAL.test(txt)) return null;
  const n = {};
  for (const k in WHO) if (WHO[k].test(txt)) n[k] = true;
  if (id === 'dede_vefat') delete n.dede;
  return Object.keys(n).length ? n : null;
}
const parentAlive = (s, role) => s.family.parents.some(p => p.alive && p.role === role);
function needsMet(n, s) {
  if (!n) return true;
  if (n.baba && !parentAlive(s, 'Baba')) return false;
  if (n.anne && !parentAlive(s, 'Anne')) return false;
  if (n.ikisi && !(parentAlive(s, 'Baba') && parentAlive(s, 'Anne'))) return false;
  if (n.kardes && !(s.family.siblings > 0)) return false;
  if (n.dede && (s.seen?.dede_vefat || s.age > 40)) return false;
  if (n.partner && !s.rel.partner) return false;
  return true;
}
// Kart çekilebilir mi: koşul + adı geçen kişiler + en az bir seçeneğin görünmesi
export function cardFits(c, s) {
  return checkCond(c.cond, s) && needsMet(c._need, s) && (c.options || []).some(o => optionVisible(s, o));
}
export const cardById = id => BY_ID[id];
export const deckSize = () => DECK.length;

const has = (s, f) => !!s.flags[f];

export function checkCond(c, s) {
  if (!c) return true;
  const a = s.age;
  if (c.age && (a < c.age[0] || a > c.age[1])) return false;
  if (c.stage && !c.stage.includes(stageId(s))) return false;
  if (c.stats) for (const k in c.stats) if ((s.stats[k] ?? 0) < c.stats[k]) return false;
  if (c.statsMax) for (const k in c.statsMax) if ((s.stats[k] ?? 0) > c.statsMax[k]) return false;
  if (c.skills) for (const k in c.skills) if ((s.skills[k] ?? 0) < c.skills[k]) return false;
  if (c.train) for (const k in c.train) if ((s.train[k] ?? 0) < c.train[k]) return false;
  if (c.place && !c.place.includes(s.family.place)) return false;
  if (c.wealth && !c.wealth.includes(s.family.wealth)) return false;
  if (c.flags && !c.flags.every(f => has(s, f))) return false;
  if (c.anyFlag && !c.anyFlag.some(f => has(s, f))) return false;
  if (c.notFlags && c.notFlags.some(f => has(s, f))) return false;
  if (c.counters) for (const k in c.counters) if ((s.counters[k] ?? 0) < c.counters[k]) return false;
  if (c.job && !(s.career.job && c.job.includes(s.career.job.id))) return false;
  if (c.hasJob !== undefined && !!s.career.job !== c.hasJob) return false;
  if (c.path && !(s.career.job && c.path.includes(jobPath(s)))) return false;
  if (c.biz !== undefined && !(s.career.biz && s.career.biz.step >= c.biz)) return false;
  if (c.noBiz && s.career.biz) return false;
  if (c.edu && !c.edu.includes(s.edu.stage)) return false;
  if (c.partner !== undefined && !!s.rel.partner !== c.partner) return false;
  if (c.married !== undefined && s.rel.married !== c.married) return false;
  if (c.kids !== undefined && (s.rel.children.length > 0) !== c.kids) return false;
  if (c.money !== undefined && s.money < c.money * s.priceIndex) return false;
  if (c.parentsAlive && !s.family.parents.some(p => p.alive)) return false;
  if (c.parentAlive && !s.family.parents.some(p => p.alive && p.role === c.parentAlive)) return false;
  if (c.siblings && s.family.siblings < c.siblings) return false;
  if (c.retired !== undefined && s.career.retired !== c.retired) return false;
  if (c.rare && s.family.rare !== c.rare) return false;
  if (c.looks !== undefined && looks(s) < c.looks) return false;
  if (c.charisma !== undefined && charisma(s) < c.charisma) return false;
  if (c.mizac && !c.mizac.includes(s.traits?.mizac)) return false;
  if (c.livingHome !== undefined && livingHome(s) !== c.livingHome) return false;
  if (c.homeStress !== undefined && (s.home?.stress ?? 0) < c.homeStress) return false;
  if (c.homeStressMax !== undefined && (s.home?.stress ?? 0) > c.homeStressMax) return false;
  if (c.homeBroke && !(s.home && s.home.cash < 0)) return false;
  if (c.partnerTrait && !(s.rel.partner && c.partnerTrait.includes(s.rel.partner.trait))) return false;
  if (c.partnerWealth && !(s.rel.partner && c.partnerWealth.includes(s.rel.partner.wealth))) return false;
  if (c.inSchool !== undefined && ['ilkokul', 'orta', 'lise'].includes(s.edu.stage) !== c.inSchool) return false;
  return true;
}

let jobsRef = null;
export function setJobsRef(j) { jobsRef = j; }
const jobPath = s => jobsRef?.[s.career.job.id]?.path;

// Yıl içinde kart çek. chain kartları önceliklidir.
export function drawCard(s, rng) {
  const dueIdx = s.chains.findIndex(c => c.at <= s.age);
  if (dueIdx >= 0) {
    const due = s.chains.splice(dueIdx, 1)[0];
    const card = BY_ID[due.id];
    if (card && cardFits(card, s)) return card;
  }
  const P = { ...Object.fromEntries(Object.entries(CONFIG.rarity).map(([k, v]) => [k, v.p])) };
  if (s.traits?.mizac === 'maceraci') { P.rare *= 1.25; P.epic *= 1.35; P.legendary *= 1.2; }
  if (s.pity >= CONFIG.pityAfterYears) {
    const bonus = (s.pity - CONFIG.pityAfterYears + 1) * 0.01;
    P.epic += bonus * 0.7; P.legendary += bonus * 0.3; P.common -= bonus;
  }
  const order = ['legendary', 'epic', 'rare', 'common'];
  let rar = rng.weighted(order.map(k => [k, P[k]]));
  for (let i = order.indexOf(rar); i < order.length; i++) {
    // Tekrar önleme: kart, nadirliğine göre yıllarca geri gelmez; aynı kart üst üste iki yıl asla çıkmaz
    for (const strict of [1, 0.5]) {
      const pool = DECK.filter(c => c.rarity === order[i] && !c.chainOnly && cardFits(c, s) && !(c.once && s.seen[c.id])
        && !s.year?.seenIds?.includes(c.id) && cooledDown(s, c, strict));
      if (pool.length) return rng.weighted(pool.map(c => [c, (c.weight ?? 1) * (s.seen[c.id] ? 0.4 : 1)]));
    }
  }
  return null;
}

const COOLDOWN = { common: 6, rare: 9, epic: 14, legendary: 30 };
function cooledDown(s, c, strict) {
  const at = s.seenAt?.[c.id];
  if (at === undefined) return true;
  const gap = s.age - at;
  return gap >= 2 && gap >= (c.cooldown ?? COOLDOWN[c.rarity]) * strict;
}
// Seçenek yaşa/duruma uygun mu (uygunsuzsa hiç gösterilmez)
export const optionVisible = (s, o) => (!o.show || checkCond(o.show, s)) && needsMet(o._need, s);

export function textVars(s) {
  const alive = s.family.parents;
  return {
    ad: s.name, soyad: s.surname, yas: s.age, sehir: s.family.city,
    anne: alive[0].name, baba: alive[1].name,
    partner: s.rel.partner?.name ?? T('partnerin'),
    kardes: T(s.family.siblings > 0 ? 'kardeşin' : 'kuzenin'),
    arkadas: s.rel.bestFriend ?? T('en yakın arkadaşın'),
    yil: s.calendarYear,
    saat: eventTime(s),
  };
}
// Olay saati: hayat ve yaşa göre sabit ama rastgele (ör. deprem kartı). Gerçek bir afetin saati kullanılmaz.
function eventTime(s) {
  const h0 = hashString(`${s.seed}-saat-${s.age}`);
  let hh = h0 % 24, mm = Math.floor(h0 / 24) % 60;
  if (hh === 4 && mm === 17) mm = 38;
  const pad = n => String(n).padStart(2, '0');
  if (lang !== 'tr') return `${(hh % 12) || 12}:${pad(mm)} ${hh < 12 ? 'am' : 'pm'}`;
  const part = hh < 6 ? 'Gece' : hh < 12 ? 'Sabah' : hh < 18 ? 'Öğleden sonra' : hh < 22 ? 'Akşam' : 'Gece';
  return `${part} ${pad(hh)}.${pad(mm)}`;
}
export const render = (s, str) => {
  const out = tpl(str, textVars(s));
  // "{kardes} …" gibi şablonla başlayan cümlenin ilk harfi büyük olsun
  return out ? out[0].toLocaleUpperCase(locale()) + out.slice(1) : out;
};
