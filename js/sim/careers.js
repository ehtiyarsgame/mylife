// Meslekler, bölümler ve kapılar (Tasarım Dokümanı §5).
// Maaşlar 2026 TL aylık; oyunda fiyat endeksiyle çarpılır.

export const PATHS = {
  futbol:   { name: 'Futbolcu',  icon: '⚽', color: '#5bd6a0' },
  doktor:   { name: 'Doktor',    icon: '🩺', color: '#ff5b7a' },
  muhendis: { name: 'Mühendis',  icon: '🛠️', color: '#7c9cff' },
  usta:     { name: 'Usta',      icon: '🔧', color: '#ff8a5b' },
  ciftci:   { name: 'Çiftçi',    icon: '🌾', color: '#a3d65b' },
  tuccar:   { name: 'Tüccar',    icon: '💼', color: '#ffc53d' },
  genel:    { name: 'Diğer',     icon: '🧩', color: '#9aa4b2' },
};

// levels: [unvan, maaş çarpanı, bu seviyede en az yıl (terfi için), terfi kapısı?]
export const JOBS = {
  garson:     { name: 'Garson', icon: '🍽️', path: 'genel', salary: 21000, mg: ['ekim', 'hasat', 'koyun_say', 'yumurta', 'kostebek', 'hasere'], skill: 'empati', stat: 'sosyal', minAge: 16,
                levels: [['Garson', 1, 2], ['Şef garson', 1.3, 3], ['Restoran müdürü', 1.9, 99]] },
  isci:       { name: 'Fabrika işçisi', icon: '🏭', path: 'genel', salary: 24000, mg: ['parca', 'tepki', 'ariza', 'kalite_kontrol', 'kargo_istif', 'vinc'], skill: 'el', stat: 'fizik', minAge: 17,
                levels: [['İşçi', 1, 3], ['Ustabaşı', 1.35, 4], ['Vardiya amiri', 1.8, 99]] },
  kurye:      { name: 'Kargo şoförü', icon: '🚚', path: 'genel', salary: 30000, mg: ['rota', 'tepki', 'kurye_motor', 'surus', 'kargo_istif', 'kargo_yakala'], skill: 'el', stat: 'disiplin', minAge: 18, needFlag: 'ehliyet',
                levels: [['Şoför', 1, 3], ['Bölge sorumlusu', 1.4, 4], ['Lojistik müdürü', 2.1, 99]] },
  memur:      { name: 'Memur', icon: '🏛️', path: 'genel', salary: 38000, mg: ['hizlimat', 'siralama', 'dogruyanlis', 'posta', 'fatura_hesap', 'saat_hesap'], skill: 'matematik', stat: 'disiplin', minAge: 20, needFlag: 'kpss',
                levels: [['Memur', 1, 4], ['Şef', 1.3, 5], ['Müdür', 1.7, 99]] },
  polis:      { name: 'Polis', icon: '👮', path: 'genel', salary: 42000, mg: ['sorgu', 'kurtarma', 'rota', 'surus', 'kalabalik', 'kayip_esya'], skill: 'empati', stat: 'fizik', minAge: 20, needFlag: 'kpss',
                levels: [['Polis memuru', 1, 4], ['Komiser', 1.45, 5], ['Emniyet müdürü', 2.1, 99]] },
  ogretmen:   { name: 'Öğretmen', icon: '👩‍🏫', path: 'genel', salary: 42000, mg: ['konusma', 'dogruyanlis', 'siralama', 'veli_gorusmesi', 'kutuphane'], skill: 'empati', stat: 'sosyal', minAge: 22, needDept: 'ogretmenlik',
                levels: [['Öğretmen', 1, 5], ['Uzman öğretmen', 1.25, 6], ['Okul müdürü', 1.6, 99]] },
  hemsire:    { name: 'Hemşire', icon: '💉', path: 'doktor', salary: 45000, mg: ['triyaj', 'teshis', 'doz_ayari', 'ilac_dolabi', 'hasta_bilgilendirme'], skill: 'empati', stat: 'disiplin', minAge: 22, needDept: 'hemsirelik',
                levels: [['Hemşire', 1, 4], ['Sorumlu hemşire', 1.3, 5], ['Başhemşire', 1.7, 99]] },
  doktor:     { name: 'Doktor', icon: '🩺', path: 'doktor', salary: 85000, mg: ['teshis', 'triyaj', 'ameliyat'], skill: 'fen', stat: 'zeka', minAge: 24, needDept: 'tip',
                levels: [['Pratisyen hekim', 1, 2, 'tus'], ['Uzman doktor', 1.8, 5], ['Doçent', 2.4, 5], ['Başhekim', 3.2, 99]] },
  eczaci:     { name: 'Eczacı', icon: '💊', path: 'doktor', salary: 60000, mg: ['teshis', 'stok', 'ilac_dolabi', 'doz_ayari'], skill: 'fen', stat: 'zeka', minAge: 23, needDept: 'eczacilik',
                levels: [['Eczacı', 1, 4], ['Eczane sahibi', 2.2, 99]] },
  dishekimi:  { name: 'Diş hekimi', icon: '🦷', path: 'doktor', salary: 80000, mg: ['ameliyat', 'teshis', 'hasta_bilgilendirme'], skill: 'el', stat: 'disiplin', minAge: 23, needDept: 'dis',
                levels: [['Diş hekimi', 1, 5], ['Klinik sahibi', 2.5, 99]] },
  muhendis:   { name: 'Mühendis', icon: '🛠️', path: 'muhendis', salary: 65000, mg: ['devre', 'hizlimat', 'rota'], skill: 'matematik', stat: 'zeka', minAge: 22, needDept: 'muhendislik',
                levels: [['Mühendis', 1, 3], ['Kıdemli mühendis', 1.4, 2, 'proje_lideri'], ['Proje lideri', 2, 5], ['Teknik direktör', 3, 99]] },
  yazilimci:  { name: 'Yazılımcı', icon: '💻', path: 'muhendis', salary: 70000, mg: ['bugavi', 'siralama', 'devre', 'dikkat_testi'], skill: 'teknoloji', stat: 'zeka', minAge: 20, needAny: [{ dept: 'bilgisayar' }, { skill: 'teknoloji', min: 60 }],
                levels: [['Yazılımcı', 1, 3], ['Kıdemli yazılımcı', 1.5, 2, 'proje_lideri'], ['Takım lideri', 2.1, 5], ['CTO', 3.4, 99]] },
  avukat:     { name: 'Avukat', icon: '⚖️', path: 'genel', salary: 60000, mg: ['sorgu', 'konusma', 'basin_toplantisi'], skill: 'dil', stat: 'zeka', minAge: 23, needDept: 'hukuk',
                levels: [['Avukat', 1, 4], ['Kıdemli avukat', 1.6, 5], ['Hukuk bürosu ortağı', 2.8, 99]] },
  muhasebeci: { name: 'Muhasebeci', icon: '🧾', path: 'tuccar', salary: 45000, mg: ['hizlimat', 'fiyat', 'siralama', 'yuzde_hesap', 'fatura_hesap', 'sahte_para'], skill: 'matematik', stat: 'disiplin', minAge: 22, needDept: 'isletme',
                levels: [['Muhasebeci', 1, 4], ['Mali müşavir', 1.7, 5], ['Finans müdürü', 2.5, 99]] },
  ziraatmuh:  { name: 'Ziraat mühendisi', icon: '🌿', path: 'ciftci', salary: 50000, mg: ['ekim', 'hasat', 'hastalikli_yaprak', 'hasere'], skill: 'doga', stat: 'zeka', minAge: 22, needDept: 'ziraat',
                levels: [['Ziraat mühendisi', 1, 4], ['Bölge müdürü', 1.6, 99]] },
  cirak:      { name: 'Çırak', icon: '🔩', path: 'usta', salary: 12000, mg: ['ariza', 'parca', 'tugla_duvar', 'kalite_kontrol', 'su_basinci'], skill: 'el', stat: 'disiplin', minAge: 14,
                levels: [['Çırak', 1, 2], ['Kalfa', 2, 2, 'ustalik'], ['Usta', 3.6, 99]] },
  ciftci:     { name: 'Çiftçi', icon: '🌾', path: 'ciftci', salary: 20000, mg: ['ekim', 'hasat'], skill: 'doga', stat: 'fizik', minAge: 16, farm: true,
                levels: [['Çiftçi', 1, 3, 'modern_tarim'], ['Modern çiftçi', 2.4, 5], ['Kooperatif başkanı', 3.5, 99]] },
  futbolcu:   { name: 'Futbolcu', icon: '⚽', path: 'futbol', salary: 45000, mg: ['penalti', 'frikik', 'pas', 'taktik', 'calim', 'kafa', 'kaleci'], skill: 'futbol', stat: 'fizik', minAge: 17, viaDoor: 'futbol_pro',
                levels: [['Alt lig oyuncusu', 1, 2, 'futbol_superlig'], ['Süper Lig oyuncusu', 6, 3, 'futbol_milli'], ['Milli oyuncu', 14, 99]] },
  antrenor:   { name: 'Antrenör', icon: '📋', path: 'futbol', salary: 40000, mg: ['taktik', 'konusma', 'kriz_yonetimi'], skill: 'liderlik', stat: 'sosyal', minAge: 24, needAny: [{ flag: 'eskiFutbolcu' }, { skill: 'futbol', min: 55 }],
                levels: [['Altyapı antrenörü', 1, 3], ['Yardımcı antrenör', 1.6, 4], ['Teknik direktör', 3.5, 99]] },
  psikolog:   { name: 'Psikolog', icon: '🧠', path: 'genel', salary: 50000, mg: ['konusma', 'sorgu', 'hasta_bilgilendirme'], skill: 'empati', stat: 'sosyal', minAge: 22, needDept: 'psikoloji',
                levels: [['Psikolog', 1, 4], ['Uzman psikolog', 1.5, 5], ['Klinik sahibi', 2.3, 99]] },
  gazeteci:   { name: 'Gazeteci', icon: '📰', path: 'genel', salary: 38000, mg: ['sorgu', 'kelime', 'konusma', 'basin_toplantisi'], skill: 'dil', stat: 'sosyal', minAge: 22, needDept: 'iletisim',
                levels: [['Muhabir', 1, 3], ['Editör', 1.5, 5], ['Genel yayın yönetmeni', 2.6, 99]] },
  tercuman:   { name: 'Tercüman', icon: '🌍', path: 'genel', salary: 45000, mg: ['kelime', 'dogruyanlis', 'ingilizce', 'es_anlam'], skill: 'dil', stat: 'zeka', minAge: 22, needDept: 'tercumanlik',
                levels: [['Tercüman', 1, 4], ['Konferans tercümanı', 1.8, 99]] },
  muzisyen:   { name: 'Müzisyen', icon: '🎸', path: 'genel', salary: 25000, mg: ['ritim', 'melodi', 'davul', 'ses_ayari'], skill: 'muzik', stat: 'mutluluk', minAge: 17, needAny: [{ skill: 'muzik', min: 55 }],
                levels: [['Sokak müzisyeni', 1, 2], ['Stüdyo müzisyeni', 1.8, 3], ['Konser sanatçısı', 4, 99]] },
  tasarimci:  { name: 'Grafik tasarımcı', icon: '🎨', path: 'genel', salary: 35000, mg: ['desen', 'urunsayfa', 'kamuflaj'], skill: 'resim', stat: 'mutluluk', minAge: 18, needAny: [{ skill: 'resim', min: 55 }],
                levels: [['Tasarımcı', 1, 3], ['Sanat yönetmeni', 1.9, 99]] },
};

// Üniversite bölümleri: YKS'de en fazla yüzde kaçlık dilimde olmak gerekir.
// Lise alanları: YKS'de hangi bölümlere girilebileceğini belirler
export const ALANLAR = {
  sayisal: { name: 'Sayısal (MF)',  icon: '🔬', skills: ['matematik', 'fen'],            desc: 'Matematik, fizik, kimya, biyoloji. Tıp, mühendislik, bilgisayar yolu.' },
  ea:      { name: 'Eşit Ağırlık',  icon: '⚖️', skills: ['matematik', 'dil', 'ticaret'], desc: 'Matematik ve edebiyat-sosyal. Hukuk, işletme, psikoloji yolu.' },
  sozel:   { name: 'Sözel',         icon: '📜', skills: ['dil', 'empati'],               desc: 'Edebiyat, tarih, coğrafya. Öğretmenlik, gazetecilik yolu.' },
  dil:     { name: 'Yabancı Dil',   icon: '🌍', skills: ['dil'],                         desc: 'Yoğun İngilizce. Tercümanlık, turizm, dış ilişkiler yolu.' },
};

export const DEPTS = [
  { id: 'tip',          name: 'Tıp Fakültesi',          top: 2,   years: 6, icon: '🩺', skills: ['fen'], alan: ['sayisal'] },
  { id: 'dis',          name: 'Diş Hekimliği',          top: 4,   years: 5, icon: '🦷', skills: ['fen', 'el'], alan: ['sayisal'] },
  { id: 'eczacilik',    name: 'Eczacılık',              top: 6,   years: 5, icon: '💊', skills: ['fen'], alan: ['sayisal'] },
  { id: 'bilgisayar',   name: 'Bilgisayar Mühendisliği', top: 8,  years: 4, icon: '💻', skills: ['teknoloji', 'matematik'], alan: ['sayisal'] },
  { id: 'hukuk',        name: 'Hukuk',                  top: 10,  years: 4, icon: '⚖️', skills: ['dil'], alan: ['ea'] },
  { id: 'psikoloji',    name: 'Psikoloji',              top: 22,  years: 4, icon: '🧠', skills: ['empati'], alan: ['ea'] },
  { id: 'tercumanlik',  name: 'Mütercim-Tercümanlık',   top: 25,  years: 4, icon: '🌍', skills: ['dil'], alan: ['dil'] },
  { id: 'iletisim',     name: 'Gazetecilik',            top: 45,  years: 4, icon: '📰', skills: ['dil', 'empati'], alan: ['sozel', 'ea'] },
  { id: 'muhendislik',  name: 'Makine / İnşaat Müh.',   top: 14,  years: 4, icon: '🛠️', skills: ['matematik', 'fen'], alan: ['sayisal'] },
  { id: 'ogretmenlik',  name: 'Öğretmenlik',            top: 30,  years: 4, icon: '👩‍🏫', skills: ['empati', 'dil'], alan: ['sayisal', 'ea', 'sozel', 'dil'] },
  { id: 'isletme',      name: 'İşletme',                top: 38,  years: 4, icon: '📊', skills: ['ticaret', 'matematik'], alan: ['ea', 'sayisal'] },
  { id: 'hemsirelik',   name: 'Hemşirelik',             top: 42,  years: 4, icon: '💉', skills: ['empati', 'fen'], alan: ['sayisal'] },
  { id: 'ziraat',       name: 'Ziraat Mühendisliği',    top: 52,  years: 4, icon: '🌿', skills: ['doga', 'fen'], alan: ['sayisal', 'meslek'] },
  { id: 'spor',         name: 'Spor Bilimleri',         top: 60,  years: 4, icon: '🏃', skills: ['futbol', 'liderlik'], alan: 'hepsi' },
  { id: 'onlisans',     name: 'Meslek Yüksekokulu',     top: 75,  years: 2, icon: '🎓', skills: ['el', 'teknoloji'], alan: 'hepsi' },
];
export const deptById = Object.fromEntries(DEPTS.map(d => [d.id, d]));

// Kapılar. score = ilgili yetenek×0,55 + mini oyun×0,55 + geçmiş(≤20) + bağlantı(≤20) + şans(0–10) ≥ 100
export const DOORS = {
  futbol_altyapi: {
    name: 'Altyapı seçmesi', icon: '🏟️', path: 'futbol', age: [11, 15],
    need: { skills: { futbol: 40 }, train: { futbol: 3 } },
    mg: 'calim', mgSkill: 'futbol', stakes: 0.55, modifiers: ['kalabalik'],
    text: 'Büyük bir kulübün altyapı seçmeleri var. Hocalar çalımlarını izleyecek.',
    open: { flags: ['altyapi'], log: 'Altyapıya seçildin! Artık haftada beş gün antrenman var.' },
    side: ['Okul takımında devam et', 'Futbol antrenörlüğüne yönel (ileride)'],
  },
  futbol_pro: {
    name: 'Profesyonel sözleşme', icon: '✍️', path: 'futbol', age: [17, 21],
    need: { flags: ['altyapi'], counters: { altyapiIyi: 2 }, skills: { futbol: 55 } },
    mg: 'penalti', mgSkill: 'futbol', stakes: 0.7, modifiers: ['kritik', 'kalabalik'],
    text: 'Sezonun son maçı. Menajerler tribünde. Maç penaltılara kaldı…',
    open: { job: 'futbolcu', log: 'İlk profesyonel sözleşmeni imzaladın!' },
    side: ['Amatör ligde oyna, işe gir', 'Spor Bilimleri okuyup antrenör ol'],
  },
  futbol_superlig: {
    name: 'Süper Lig transferi', icon: '🌟', path: 'futbol', age: [19, 30],
    need: { job: 'futbolcu', skills: { futbol: 68 } },
    mg: 'taktik', mgSkill: 'futbol', stakes: 0.75, modifiers: ['kritik'],
    text: 'Bir Süper Lig kulübü seni izliyor. Kritik maçta takımı sen yöneteceksin.',
    open: { promote: true, log: 'Süper Lig\'e transfer oldun!' },
  },
  futbol_milli: {
    name: 'Milli takım çağrısı', icon: '🇹🇷', path: 'futbol', age: [20, 32],
    need: { job: 'futbolcu', skills: { futbol: 80 }, stats: { itibar: 45 } },
    mg: 'penalti', mgSkill: 'futbol', stakes: 0.9, modifiers: ['efsanevi', 'kalabalik'],
    text: 'Milli takım hocası kadroyu açıklıyor. Son hazırlık maçında penaltı sende.',
    open: { promote: true, legend: 'milli_takim', log: 'Milli formayı giydin!' },
  },
  tus: {
    name: 'TUS — Uzmanlık', icon: '📚', path: 'doktor', age: [24, 45],
    need: { job: 'doktor' },
    exam: 'tus',
    text: 'Tıpta Uzmanlık Sınavı. Uzman olmak için yeterli puanı almalısın.',
    open: { promote: true, log: 'TUS\'u kazandın, uzmanlık eğitimine başladın.' },
  },
  proje_lideri: {
    name: 'Proje liderliği', icon: '📐', path: 'muhendis', age: [25, 60],
    need: { jobAny: ['muhendis', 'yazilimci'], skills: { liderlik: 40 } },
    mg: 'devre', mgSkill: 'matematik', stakes: 0.7, modifiers: ['kritik'],
    text: 'Büyük bir projenin teslim günü. Sistemi zamanında ayağa kaldırabilirsen proje senin.',
    open: { promote: true, log: 'Proje lideri oldun.' },
  },
  ustalik: {
    name: 'Ustalık belgesi', icon: '📜', path: 'usta', age: [18, 60],
    need: { job: 'cirak' },
    exam: 'usta',
    text: 'Ustalık belgesi sınavı: teori soruları ve uygulama.',
    open: { promote: true, flags: ['ustalik'], log: 'Ustalık belgeni aldın!' },
  },
  modern_tarim: {
    name: 'Modern tarım', icon: '🚜', path: 'ciftci', age: [18, 70],
    need: { job: 'ciftci', anyFlag: ['tarimKursu', 'dept_ziraat'], money: 100000 },
    mg: 'ekim', mgSkill: 'doga', stakes: 0.6,
    cost: 100000,
    text: 'Damla sulama ve seralara geçiş. İlk sezonu iyi planlarsan kredi onaylanacak.',
    open: { promote: true, log: 'Modern tarıma geçtin; verim ikiye katlandı.' },
  },
  dukkan_usta: {
    name: 'Kendi dükkânı', icon: '🏪', path: 'usta', age: [20, 65],
    need: { flags: ['ustalik'], money: 150000, notFlags: ['kendiDukkan'] },
    mg: 'pazarlik', mgSkill: 'ticaret', stakes: 0.55,
    cost: 150000,
    text: 'Sanayide boş bir dükkân var. Kirayı mal sahibiyle pazarlık etmelisin.',
    open: { flags: ['kendiDukkan'], log: 'Kendi dükkânını açtın! Gelirin artık sana ait.' },
  },
};

export const EXAMS = {
  karne:  { name: 'Karne yazılısı', q: 3,  t: 30, level: 'auto' },
  lgs:    { name: 'LGS',            q: 8,  t: 40, level: 'ortaokul' },
  yks:    { name: 'YKS',            q: 10, t: 45, level: 'lise' },
  ehliyet:{ name: 'Ehliyet sınavı', q: 5,  t: 30, level: 'ehliyet' },
  kpss:   { name: 'KPSS',           q: 8,  t: 40, level: 'genel' },
  tus:    { name: 'TUS',            q: 8,  t: 45, level: 'tip' },
  is:     { name: 'İş mülakatı',    q: 4,  t: 40, level: 'genel' },
  usta:   { name: 'Ustalık belgesi',q: 5,  t: 40, level: 'usta' },
  uni:    { name: 'Final sınavı',   q: 4,  t: 40, level: 'lise' },
};

// Anne-baba meslekleri (aile durumuna göre ağırlıklı)
export const PARENT_JOBS = {
  fakir:    [['Çiftçi', 'ciftci'], ['İşçi', 'usta'], ['Garson', 'genel'], ['Ev hanımı / ev işleri', 'genel'], ['Seyyar satıcı', 'tuccar'], ['Oto tamircisi', 'usta'], ['Şoför', 'genel']],
  orta:     [['Öğretmen', 'genel'], ['Memur', 'genel'], ['Hemşire', 'doktor'], ['Esnaf', 'tuccar'], ['Tesisatçı', 'usta'], ['Polis', 'genel'], ['Çiftçi', 'ciftci'], ['Muhasebeci', 'tuccar'], ['Aşçı', 'genel']],
  varlikli: [['Mühendis', 'muhendis'], ['Doktor', 'doktor'], ['Avukat', 'genel'], ['Mağaza sahibi', 'tuccar'], ['Yazılımcı', 'muhendis'], ['Eczacı', 'doktor'], ['Eski futbolcu', 'futbol']],
  zengin:   [['Fabrika sahibi', 'tuccar'], ['Başhekim', 'doktor'], ['İhracatçı', 'tuccar'], ['Mimar', 'muhendis'], ['Kulüp yöneticisi', 'futbol'], ['Büyük çiftlik sahibi', 'ciftci']],
};

export function jobTitle(job) {
  if (!job) return null;
  const J = JOBS[job.id];
  return J.levels[Math.min(job.level, J.levels.length - 1)][0];
}
