// Doğuştan gelen, seçilemeyen özellikler: görünüş, karizma, mizaç.
// Anne-babanı seçemediğin gibi bunları da seçemezsin; ama nasıl kullandığın senin elinde.
import { clamp } from '../core/util.js';

export const MIZAC = {
  sakin:    { name: 'Sakin',    icon: '🧘', desc: 'Stres seni zor bulur; mini oyunlarda "stresli" durumu nadiren gelir. Mutluluk tabanı +2.' },
  neseli:   { name: 'Neşeli',   icon: '😄', desc: 'Mutluluk tabanın +6, arkadaş edinmek kolay.' },
  hirsli:   { name: 'Hırslı',   icon: '🔥', desc: 'Tüm gelişimin +%10, iş performansın yüksek; ama mutluluk tabanın −4.' },
  kaygili:  { name: 'Kaygılı',  icon: '😟', desc: 'Sınavlara iyi hazırlanırsın (+6 hazırlık) ama stres kolay gelir.' },
  maceraci: { name: 'Maceracı', icon: '🧭', desc: 'Nadir ve epik olaylar daha sık çıkar. Tatil ve yenilik seni mutlu eder.' },
  duygusal: { name: 'Duygusal', icon: '💗', desc: 'Empati, müzik ve resimde +%15 gelişim; ilişkilerde sevgi daha hızlı büyür.' },
};

export function rollTraits(rng) {
  return {
    gorunus: Math.round(clamp(rng.normal(52, 17), 5, 99)),
    karizma: Math.round(clamp(rng.normal(46, 17), 5, 99)),
    mizac: rng.weighted([['sakin', 18], ['neseli', 20], ['hirsli', 16], ['kaygili', 14], ['maceraci', 14], ['duygusal', 18]]),
    karizmaGain: 0,
  };
}

// Görünüş yaşla, fizikle ve sağlıkla değişir; doğuştan taban en belirleyicisidir.
export function looks(s) {
  const t = s.traits;
  let v = t.gorunus;
  if (s.age >= 35) v -= (s.age - 35) * 0.45;
  v += (s.stats.fizik - 50) * 0.12 + (s.stats.saglik - 60) * 0.06;
  if (s.flags.bakim && s.age - s.flags.bakim <= 2) v += 4;
  return Math.round(clamp(v, 1, 100));
}

// Karizma doğuştan gelir; liderlik ve sosyal eylemlerle en fazla +20 gelişir.
export function charisma(s) {
  return Math.round(clamp(s.traits.karizma + s.traits.karizmaGain, 1, 100));
}
export function growCharisma(s, amount) {
  s.traits.karizmaGain = clamp(s.traits.karizmaGain + amount, 0, 20);
}

export function traitLabel(v) {
  if (v >= 85) return 'Olağanüstü';
  if (v >= 68) return 'Yüksek';
  if (v >= 40) return 'Ortalama';
  if (v >= 22) return 'Düşük';
  return 'Çok düşük';
}

// Mutluluğun kendiliğinden döndüğü taban üzerindeki mizaç etkisi
export const mizacHappy = s => ({ sakin: 2, neseli: 6, hirsli: -4, kaygili: -2, maceraci: 1, duygusal: 0 })[s.traits.mizac] || 0;

// Yetenek gelişimine mizaç ve karizma çarpanı
export function traitGainMul(s, skill) {
  let m = 1;
  const z = s.traits.mizac;
  if (z === 'hirsli') m *= 1.1;
  if (z === 'duygusal' && ['empati', 'muzik', 'resim'].includes(skill)) m *= 1.15;
  if (skill === 'liderlik') m *= 0.8 + charisma(s) / 125;
  return m;
}
