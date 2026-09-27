// Stat ve yetenek gelişimi (Tasarım Dokümanı §3).
import { CONFIG, SKILLS } from '../config.js';
import { clamp } from '../core/util.js';
import { traitGainMul, charisma } from './traits.js';

export function stageOf(age) {
  return CONFIG.stages.find(s => age >= s.from && age <= s.to) || CONFIG.stages[CONFIG.stages.length - 1];
}

export const ceilingOf = P => 40 + 0.6 * P;

// Yetenek artışı: taban × potansiyel × disiplin × performans × tavana kalan pay.
// t: eylemin taban kazancı, P: gizli potansiyel, D: disiplin, S: mevcut, T = 40 + 0,6P
export function skillGain(state, skill, t = 4, perf = 60) {
  const P = state.talents[skill];
  const T = ceilingOf(P);
  const S = state.skills[skill];
  const D = state.stats.disiplin;
  if (S >= T) return 0.04 * t; // tavanda neredeyse durur
  let g = t * (0.4 + P / 100) * (0.7 + D / 150) * (0.6 + perf / 125) * (1 - S / T);
  if (state.stats.mutluluk < 30) g *= 0.8;
  if (state.flags.mentor === skill) g *= 1.2;
  if (state.traits) g *= traitGainMul(state, skill);
  return Math.max(0.1, g);
}

export function addSkill(state, skill, t, perf) {
  const g = skillGain(state, skill, t, perf);
  state.skills[skill] = clamp(state.skills[skill] + g, 0, 100);
  return g;
}

// Görünür statlar: yukarı çıktıkça artış yavaşlar.
export function addStat(state, stat, amount) {
  if (stat === 'money') { state.money += amount; return amount; }
  const cur = state.stats[stat];
  let d = amount;
  if (amount > 0 && stat !== 'itibar') d = amount * Math.max(0.15, 1 - cur / 115);
  state.stats[stat] = clamp(cur + d, 0, 100);
  return state.stats[stat] - cur;
}

// Mini oyunun kolaylığı için kullanılan "beceri" (0–100): yetenek + bağlı stat.
export function mgSkillLevel(state, skill) {
  if (!skill) return 50;
  if (skill === 'sosyal' && state.traits) return clamp(state.stats.sosyal * 0.7 + charisma(state) * 0.3, 0, 100);
  if (state.stats[skill] !== undefined) return state.stats[skill];
  const def = SKILLS.find(s => s.id === skill);
  const base = state.skills[skill] ?? 50;
  const st = def ? state.stats[def.stat] : 50;
  if (skill === 'liderlik' && state.traits) return clamp(base * 0.6 + charisma(state) * 0.4, 0, 100);
  return clamp(base * 0.75 + st * 0.25, 0, 100);
}

// Gizli yetenek ipuçları
const HINTS = {
  futbol:    ['Topa dokunuşun diğer çocuklardan farklı.', 'Topla aran iyi ama bacakların hep yoruluyor.', 'Futbolu seviyorsun ama top pek sözünü dinlemiyor.'],
  matematik: ['Sayılar sana adeta konuşuyor.', 'Matematikte emek verdikçe açılıyorsun.', 'Sayılarla aran biraz soğuk.'],
  fen:       ['Her şeyin nasıl çalıştığını merak ediyorsun; öğretmenlerin fark etti.', 'Deneyleri seviyorsun.', 'Fen konuları sana biraz yabancı geliyor.'],
  dil:       ['Kelimeleri çok çabuk kapıyorsun.', 'Okudukça dilin açılıyor.', 'Okumak sana zor geliyor ama pes etmiyorsun.'],
  muzik:     ['Kulağın mükemmel; duyduğun melodiyi hemen çalıyorsun.', 'Ritim duygun gelişiyor.', 'Notalar biraz karışık geliyor.'],
  resim:     ['Çizimlerinde bambaşka bir göz var.', 'Renkleri iyi kullanıyorsun.', 'Çizim yaparken sabırsızlanıyorsun.'],
  el:        ['Ellerin her şeyi onarabiliyor gibi.', 'Aletlerle aran iyi.', 'Vida sıkarken bile zorlanıyorsun.'],
  ticaret:   ['Bir şeyi satmanın yolunu hep buluyorsun.', 'Para hesabın sağlam.', 'Pazarlık yapınca hep sen kaybediyorsun.'],
  liderlik:  ['İnsanlar farkında olmadan seni takip ediyor.', 'Grup çalışmalarında sözün dinleniyor.', 'Kalabalık önünde konuşmak seni geriyor.'],
  empati:    ['Arkadaşların dertlerini hep sana anlatıyor.', 'Başkalarını anlamaya çalışıyorsun.', 'İnsanların ne hissettiğini çözmekte zorlanıyorsun.'],
  doga:      ['Toprakla aran çok iyi; diktiğin her şey yeşeriyor.', 'Hayvanları ve bitkileri seviyorsun.', 'Doğada çabuk sıkılıyorsun.'],
  teknoloji: ['Bilgisayarı kimseye sormadan çözüyorsun.', 'Teknolojiye ilgin artıyor.', 'Cihazlar seni biraz korkutuyor.'],
};
export function hintFor(skill, P) {
  const h = HINTS[skill];
  if (P >= 72) return { tier: 3, text: h[0], label: 'Parlak yetenek' };
  if (P >= 42) return { tier: 2, text: h[1], label: 'Gelişmeye açık' };
  return { tier: 1, text: h[2], label: 'Zorlu alan' };
}
