// Oyunun tüm ayarlanabilir sayıları burada durur.
// Canlıda bu değerler uzaktan yapılandırmadan (Remote Config) ezilebilir.
export const CONFIG = {
  energy: {
    // Tempo: bir ömür ≈ 1 hafta. Dolu bar (150) ≈ 3,75 saat; günde 3–4 girişle ~9–10 oyun yılı.
    max: 150,
    regenSeconds: 90,
    testRegenSeconds: 2,     // Ayarlar > Test modu açıkken
    newYearBonus: 15,        // Yıl tamamlandığında hediye enerji
    adAmount: 40,            // Ödüllü reklam başına enerji
    adPerDay: 3,
  },
  // Eylem puanı başına enerji maliyeti
  actionEnergy: { 1: 14, 2: 24 },
  restEnergy: 6,

  // Evre tablosu (Tasarım Dokümanı §4)
  stages: [
    { id: 'bebek',   name: 'Bebeklik',       from: 0,  to: 5,   ep: 0 },
    { id: 'ilkokul', name: 'İlkokul',        from: 6,  to: 9,   ep: 3 },
    { id: 'orta',    name: 'Ortaokul',       from: 10, to: 13,  ep: 4 },
    { id: 'lise',    name: 'Lise',           from: 14, to: 17,  ep: 5 },
    { id: 'genc',    name: 'Genç yetişkin',  from: 18, to: 29,  ep: 6 },
    { id: 'yetiskin',name: 'Yetişkin',       from: 30, to: 54,  ep: 6 },
    { id: 'olgun',   name: 'Olgunluk',       from: 55, to: 130, ep: 4 },
  ],

  // Olay destesi nadirlik olasılıkları (§8)
  rarity: {
    common:    { p: 0.70, name: 'Sıradan',  color: '#9aa4b2' },
    rare:      { p: 0.22, name: 'Nadir',    color: '#4ea1ff' },
    epic:      { p: 0.07, name: 'Epik',     color: '#b36bff' },
    legendary: { p: 0.01, name: 'Efsanevi', color: '#ffc53d' },
  },
  pityAfterYears: 8,         // 8 yıl epik/efsanevi yoksa her yıl +%1
  eventsPerYear: [1, 3],

  // Ekonomi (§9) — 2026 TL
  inflation: [0.03, 0.08],
  livingCost: [ // aylık, yaş eşiği
    { age: 35, cost: 45000 },
    { age: 25, cost: 30000 },
    { age: 18, cost: 12000 },
    { age: 15, cost: 3000 },
  ],
  allowance: { fakir: 1500, orta: 5000, varlikli: 15000, zengin: 45000 }, // yıllık harçlık
  startGift: { fakir: 0, orta: 5000, varlikli: 40000, zengin: 250000 },   // 18 yaşında aile desteği

  skipPenalty: 10,           // Mini oyun atlanırsa puan cezası
};

export const STATS = [
  { id: 'zeka',     name: 'Zekâ',     icon: '🧠', color: '#7c9cff' },
  { id: 'fizik',    name: 'Fizik',    icon: '💪', color: '#ff8a5b' },
  { id: 'sosyal',   name: 'Sosyal',   icon: '🗣️', color: '#ffcf5b' },
  { id: 'disiplin', name: 'Disiplin', icon: '🎯', color: '#5bd6a0' },
  { id: 'saglik',   name: 'Sağlık',   icon: '❤️', color: '#ff5b7a' },
  { id: 'mutluluk', name: 'Mutluluk', icon: '😊', color: '#ffd84d' },
  { id: 'itibar',   name: 'İtibar',   icon: '⭐', color: '#c08cff' },
];

// 12 gizli yetenek alanı (§3)
export const SKILLS = [
  { id: 'futbol',    name: 'Futbol',          icon: '⚽', stat: 'fizik' },
  { id: 'matematik', name: 'Matematik',       icon: '➗', stat: 'zeka' },
  { id: 'fen',       name: 'Fen',             icon: '🔬', stat: 'zeka' },
  { id: 'dil',       name: 'Dil',             icon: '📖', stat: 'zeka' },
  { id: 'muzik',     name: 'Müzik',           icon: '🎵', stat: 'mutluluk' },
  { id: 'resim',     name: 'Resim',           icon: '🎨', stat: 'mutluluk' },
  { id: 'el',        name: 'El becerisi',     icon: '🔧', stat: 'fizik' },
  { id: 'ticaret',   name: 'Ticaret zekâsı',  icon: '💼', stat: 'sosyal' },
  { id: 'liderlik',  name: 'Liderlik',        icon: '🧭', stat: 'sosyal' },
  { id: 'empati',    name: 'Empati',          icon: '🤝', stat: 'sosyal' },
  { id: 'doga',      name: 'Doğa',            icon: '🌱', stat: 'saglik' },
  { id: 'teknoloji', name: 'Teknoloji',       icon: '💻', stat: 'zeka' },
];

export const skillById = Object.fromEntries(SKILLS.map(s => [s.id, s]));
export const statById = Object.fromEntries(STATS.map(s => [s.id, s]));
