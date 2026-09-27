// Eş seçimi: her tanışmada farklı karakterde adaylar. Seçtiğin kişi hayatını şekillendirir.
import { clamp } from '../core/util.js';
import { NAMES } from './names.js';
import { SKILLS } from '../config.js';
import { looks, charisma } from './traits.js';

export const SPOUSE_TRAITS = {
  destekleyici: { name: 'Destekleyici', icon: '🤝', desc: 'Zor günlerde yanında. Mutluluk +4, disiplin artar.' },
  tutumlu:      { name: 'Tutumlu',      icon: '🐷', desc: 'Hane giderleri %12 daha az.' },
  savurgan:     { name: 'Savurgan',     icon: '🛍️', desc: 'Hayat renkli ama giderler %20 fazla.' },
  hirsli:       { name: 'Hırslı',       icon: '📈', desc: 'Kariyerinde hızla yükselir (+%25 gelir), ama ilişkiye az zaman ayırır.' },
  kiskanc:      { name: 'Kıskanç',      icon: '😒', desc: 'Sosyal hayatını kıskanır; tartışmalar çıkar.' },
  sakin:        { name: 'Sakin',        icon: '🍃', desc: 'Huzurlu bir ev. Tartışma az, mutluluk +2.' },
  aile_odakli:  { name: 'Aile odaklı',  icon: '🏡', desc: 'Çocuklarla çok ilgilenir; aile bağları güçlü.' },
  maceraci:     { name: 'Maceracı',     icon: '🧭', desc: 'Birlikte yeni yerler, yeni deneyimler. Tatiller daha değerli.' },
};

const PJOBS = [
  // [iş, aylık maaş 2026 TL, kalite eşiği]
  ['İşsiz / iş arıyor', 0, 0], ['Garson', 21000, 0], ['Fabrika işçisi', 24000, 0], ['Kasiyer', 22000, 0],
  ['Esnaf', 40000, 25], ['Öğretmen', 42000, 30], ['Hemşire', 45000, 30], ['Polis', 42000, 30], ['Muhasebeci', 45000, 35],
  ['Mühendis', 65000, 50], ['Yazılımcı', 70000, 50], ['Avukat', 60000, 55], ['Mimar', 62000, 55],
  ['Doktor', 85000, 65], ['Şirket müdürü', 110000, 70], ['İş insanı', 160000, 78],
];

const archetypes = ['cekici', 'uyumlu', 'varlikli'];

export function makeCandidates(s, rng, perf = 60) {
  const moneyScore = clamp(Math.log10(Math.max(1, (s.money + s.savings) / s.priceIndex)) * 14, 0, 100);
  const Q = clamp(looks(s) * 0.28 + charisma(s) * 0.24 + s.stats.sosyal * 0.16 + s.stats.itibar * 0.12 + moneyScore * 0.1 + perf * 0.1, 8, 95);
  const g = s.gender === 'k' ? 'e' : 'k';
  const top = Object.entries(s.skills).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  const n = perf >= 45 ? 3 : 2;
  const used = new Set();
  const out = [];
  for (let i = 0; i < n; i++) {
    const arc = archetypes[i];
    let name; do { name = rng.pick(NAMES[g]); } while (used.has(name)); used.add(name);
    const trait = arc === 'uyumlu' ? rng.pick(['destekleyici', 'sakin', 'aile_odakli', 'tutumlu']) : rng.pick(Object.keys(SPOUSE_TRAITS));
    const gor = clamp(Math.round(rng.normal(Q + (arc === 'cekici' ? 18 : 0), 10)), 5, 99);
    const interests = rng.shuffle(SKILLS.map(x => x.id)).slice(0, 2);
    if (arc === 'uyumlu' && !interests.some(x => top.includes(x))) interests[0] = rng.pick(top);
    const shared = interests.filter(x => top.includes(x)).length;
    let compat = 42 + shared * 16 + rng.int(-10, 10) + (arc === 'uyumlu' ? 14 : arc === 'cekici' ? -10 : 0);
    if (['destekleyici', 'sakin'].includes(trait)) compat += 5;
    if (trait === 'kiskanc') compat -= 6;
    compat = clamp(compat, 10, 98);
    const wealth = arc === 'varlikli' ? rng.weighted([['varlikli', 3], ['zengin', Q > 60 ? 2 : 0.5]]) : rng.weighted([['fakir', 30], ['orta', 50], ['varlikli', 15 + Q / 10], ['zengin', 2]]);
    const jobs = PJOBS.filter(j => j[2] <= Q + (arc === 'varlikli' ? 15 : 5));
    const job = rng.pick(jobs.slice(-6));
    out.push({
      name, gender: g, age: clamp(s.age + rng.int(-3, 3), 18, 90), arc,
      gorunus: gor, trait, interests, compat, wealth,
      job: job[0], salary: job[1],
      wantsKids: rng.chance(0.8),
    });
  }
  return out;
}

export function choosePartner(s, c) {
  s.rel.partner = { ...c, love: 40 + Math.round(c.compat / 5), since: s.age };
}

export const arcLabel = { cekici: '✨ Çok çekici', uyumlu: '💞 Çok uyumlu', varlikli: '💎 Varlıklı çevre' };
