// Oyunun tüm ayarlanabilir sayıları burada durur.
// Canlıda bu değerler uzaktan yapılandırmadan (Remote Config) ezilebilir.
export const APP_VERSION = '1.0.0';
// Geliştirici modu: yalnızca tarayıcıda yerel sunucuda (mağaza sürümünde kapalı)
export const DEV = typeof location !== 'undefined' && !globalThis.Capacitor?.isNativePlatform?.() && /^(localhost|127\.)/.test(location.hostname);

export const CONFIG = {
  energy: {
    // Tempo: bir ömür ≈ 1 hafta. Dolu bar (150) ≈ 3,75 saat; günde 3–4 girişle ~9–10 oyun yılı.
    max: 150,
    regenSeconds: 90,
    testRegenSeconds: 2,     // Ayarlar > Test modu açıkken
    newYearBonus: 0,         // Yıl sonu hediye enerjisi kapalı: enerji yalnızca zamanla ve reklamla dolar
    adAmount: 40,            // Ödüllü reklam başına enerji
    adPerDay: 3,
  },
  // Eylem puanı başına enerji maliyeti
  actionEnergy: { 1: 14, 2: 24 },
  restEnergy: 6,
  babyEnergy: 8,           // Bebeklik oyunu başına enerji

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
  // Haftalık cep harçlığı (2026 TL), yaş bandına göre: [0–5, 6–9, 10–13, 14–17]
  allowanceWeekly: {
    fakir:    [0, 40, 100, 200],
    orta:     [0, 120, 300, 500],
    varlikli: [0, 300, 700, 1200],
    zengin:   [0, 800, 1800, 3000],
  },
  // Harçlığın ne kadarı biriktirilir (kalanı kantin, yol, arkadaşlar)
  pocketSave: { harca: 0.1, yarisi: 0.5, biriktir: 0.8 },
  bigPrizeToAccount: 10000, // 18 yaş altı: bu tutarın üstündeki ödüller aile tarafından hesaba yatırılır
  // Gelir vergisi (aylık brüt, 2026 TL): [eşik, oran]. Asgari gelir vergiden muaf.
  incomeTax: [[25000, 0], [60000, 0.2], [150000, 0.3], [Infinity, 0.4]],
  // Gelir arttıkça yaşam standardı da artar: temel giderin 3 katını aşan gelirin bu kadarı
  // araba, tatil, restorana gider. Oyuncu tarzını seçer (mutluluk etkisiyle).
  lifestyle: {
    tutumlu: { rate: 0.1, happy: -2, name: 'Tutumlu', icon: '🐷' },
    normal:  { rate: 0.22, happy: 0, name: 'Normal', icon: '⚖️' },
    luks:    { rate: 0.45, happy: 3, name: 'Lüks', icon: '💎' },
  },
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
