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
  garson:     { name: 'Garson', icon: '🍽️', path: 'genel', salary: 21000, mg: ['servis_sirasi', 'pasta_kat', 'paraustu', 'musteri_sikayeti', 'fatura_hesap', 'saat_hesap', 'tepsi_tasi', 'cay_doldur', 'musteri_hakli', 'kahve_kopugu'], skill: 'empati', stat: 'sosyal', minAge: 16,
                levels: [['Garson', 1, 2], ['Şef garson', 1.3, 3], ['Restoran müdürü', 1.9, 99]] },
  isci:       { name: 'Fabrika işçisi', icon: '🏭', path: 'genel', salary: 24000, mg: ['uretim_bandi', 'parca', 'kalite_kontrol', 'kargo_istif', 'vinc', 'yukleme', 'ariza', 'tugla_tasi', 'kasa_yuk'], skill: 'el', stat: 'fizik', minAge: 17,
                levels: [['İşçi', 1, 3], ['Ustabaşı', 1.35, 4], ['Vardiya amiri', 1.8, 99]] },
  kurye:      { name: 'Kargo şoförü', icon: '🚚', path: 'genel', salary: 30000, mg: ['teslimat_suresi', 'kurye_motor', 'rota', 'surus', 'park', 'yukleme', 'kargo_yakala', 'benzin_doldur', 'kasa_yuk'], skill: 'el', stat: 'disiplin', minAge: 18, needFlag: 'ehliyet',
                levels: [['Şoför', 1, 3], ['Bölge sorumlusu', 1.4, 4], ['Lojistik müdürü', 2.1, 99]] },
  memur:      { name: 'Memur', icon: '🏛️', path: 'genel', salary: 38000, mg: ['evrak_ayikla', 'posta', 'saat_hesap', 'fatura_hesap', 'musteri_sikayeti', 'dikkat_testi', 'dilekce'], skill: 'matematik', stat: 'disiplin', minAge: 20, needFlag: 'kpss',
                levels: [['Memur', 1, 4], ['Şef', 1.3, 5], ['Müdür', 1.7, 99]] },
  polis:      { name: 'Polis', icon: '👮', path: 'genel', salary: 42000, mg: ['supheli_teshis', 'devriye', 'sorgu', 'kurtarma', 'kalabalik', 'kayip_esya', 'surus', 'trafik_isaret', 'radar'], skill: 'empati', stat: 'fizik', minAge: 20, needFlag: 'kpss',
                levels: [['Polis memuru', 1, 4], ['Komiser', 1.45, 5], ['Emniyet müdürü', 2.1, 99]] },
  ogretmen:   { name: 'Öğretmen', icon: '👩‍🏫', path: 'genel', salary: 42000, mg: ['odev_okuma', 'sinif_ortalama', 'konusma', 'veli_gorusmesi', 'kutuphane', 'mazeret', 'tahta_yaz'], skill: 'empati', stat: 'sosyal', minAge: 22, needDept: 'ogretmenlik',
                levels: [['Öğretmen', 1, 5], ['Uzman öğretmen', 1.25, 6], ['Okul müdürü', 1.6, 99]] },
  hemsire:    { name: 'Hemşire', icon: '💉', path: 'doktor', salary: 45000, mg: ['serum_hizi', 'triyaj', 'doz_ayari', 'ilac_dolabi', 'hasta_bilgilendirme', 'teshis', 'siringa_cek', 'hasta_acil', 'alet_uzat'], skill: 'empati', stat: 'disiplin', minAge: 22, needDept: 'hemsirelik',
                levels: [['Hemşire', 1, 4], ['Sorumlu hemşire', 1.3, 5], ['Başhemşire', 1.7, 99]] },
  doktor:     { name: 'Doktor', icon: '🩺', path: 'doktor', salary: 85000, mg: ['teshis', 'belirti_bolum', 'triyaj', 'ameliyat', 'hasta_bilgilendirme', 'alet_uzat', 'hasta_acil', 'rontgen', 'recete_yaz'], skill: 'fen', stat: 'zeka', minAge: 24, needDept: 'tip',
                levels: [['Pratisyen hekim', 1, 2, 'tus'], ['Uzman doktor', 1.8, 5], ['Doçent', 2.4, 5], ['Başhekim', 3.2, 99]] },
  eczaci:     { name: 'Eczacı', icon: '💊', path: 'doktor', salary: 60000, mg: ['recete_eslestir', 'ilac_dolabi', 'doz_ayari', 'stok', 'teshis', 'recete_yaz', 'siringa_cek'], skill: 'fen', stat: 'zeka', minAge: 23, needDept: 'eczacilik',
                levels: [['Eczacı', 1, 4], ['Eczane sahibi', 2.2, 99]] },
  dishekimi:  { name: 'Diş hekimi', icon: '🦷', path: 'doktor', salary: 80000, mg: ['curuk_temizle', 'ameliyat', 'teshis', 'hasta_bilgilendirme', 'alet_uzat', 'rontgen'], skill: 'el', stat: 'disiplin', minAge: 23, needDept: 'dis',
                levels: [['Diş hekimi', 1, 5], ['Klinik sahibi', 2.5, 99]] },
  muhendis:   { name: 'Mühendis', icon: '🛠️', path: 'muhendis', salary: 65000, mg: ['kopru_kur', 'yuk_hesabi', 'devre', 'vinc', 'birim_cevirme', 'rota', 'bina_guvenli'], skill: 'matematik', stat: 'zeka', minAge: 22, needDept: 'muhendislik',
                levels: [['Mühendis', 1, 3], ['Kıdemli mühendis', 1.4, 2, 'proje_lideri'], ['Proje lideri', 2, 5], ['Teknik direktör', 3, 99]] },
  yazilimci:  { name: 'Yazılımcı', icon: '💻', path: 'muhendis', salary: 70000, mg: ['hata_turu', 'bugavi', 'devre', 'siralama', 'dikkat_testi', 'kod_yaz', 'spam_filtre'], skill: 'teknoloji', stat: 'zeka', minAge: 20, needAny: [{ dept: 'bilgisayar' }, { skill: 'teknoloji', min: 60 }],
                levels: [['Yazılımcı', 1, 3], ['Kıdemli yazılımcı', 1.5, 2, 'proje_lideri'], ['Takım lideri', 2.1, 5], ['CTO', 3.4, 99]] },
  avukat:     { name: 'Avukat', icon: '⚖️', path: 'genel', salary: 60000, mg: ['hukuk_dali', 'sorgu', 'konusma', 'basin_toplantisi', 'itiraz'], skill: 'dil', stat: 'zeka', minAge: 23, needDept: 'hukuk',
                levels: [['Avukat', 1, 4], ['Kıdemli avukat', 1.6, 5], ['Hukuk bürosu ortağı', 2.8, 99]] },
  bankaci:    { name: 'Bankacı', icon: '🏦', path: 'tuccar', salary: 40000, mg: ['kredi_basvuru', 'para_say', 'sahte_para', 'yuzde_hesap', 'fatura_hesap', 'borsa', 'sifre_hatirla', 'yatirim_teklif'], skill: 'ticaret', stat: 'disiplin', minAge: 21, needAny: [{ dept: 'isletme' }, { dept: 'ekonomi' }],
                levels: [['Gişe yetkilisi', 1, 2], ['Müşteri temsilcisi', 1.35, 3], ['Şube müdürü', 2.1, 4], ['Bölge müdürü', 3, 99]] },
  yatirimci:  { name: 'Portföy yöneticisi', icon: '📈', path: 'tuccar', salary: 55000, mg: ['borsa', 'getiri_hesap', 'yuzde_hesap', 'fiyat', 'yatirim_teklif'], skill: 'ticaret', stat: 'zeka', minAge: 22, needAny: [{ dept: 'ekonomi' }, { dept: 'isletme' }, { dept: 'bilgisayar' }],
                levels: [['Yatırım analisti', 1, 3], ['Portföy yöneticisi', 1.9, 4], ['Fon müdürü', 3.2, 99]] },
  muhasebeci: { name: 'Muhasebeci', icon: '🧾', path: 'tuccar', salary: 45000, mg: ['gelir_gider', 'fatura_hesap', 'yuzde_hesap', 'fiyat', 'sahte_para', 'sifre_hatirla'], skill: 'matematik', stat: 'disiplin', minAge: 22, needDept: 'isletme',
                levels: [['Muhasebeci', 1, 4], ['Mali müşavir', 1.7, 5], ['Finans müdürü', 2.5, 99]] },
  ziraatmuh:  { name: 'Ziraat mühendisi', icon: '🌿', path: 'ciftci', salary: 50000, mg: ['toprak_ph', 'hastalikli_yaprak', 'ekim', 'hasat', 'hasere', 'bitki_dostu', 'kus_gozlem'], skill: 'doga', stat: 'zeka', minAge: 22, needDept: 'ziraat',
                levels: [['Ziraat mühendisi', 1, 4], ['Bölge müdürü', 1.6, 99]] },
  cirak:      { name: 'Çırak', icon: '🔩', path: 'usta', salary: 12000, mg: ['ariza_parca', 'ariza', 'parca', 'tugla_duvar', 'su_basinci', 'boru', 'harc_suyu', 'tugla_tasi'], skill: 'el', stat: 'disiplin', minAge: 14,
                levels: [['Çırak', 1, 2], ['Kalfa', 2, 2, 'ustalik'], ['Usta', 3.6, 99]] },
  ciftci:     { name: 'Çiftçi', icon: '🌾', path: 'ciftci', salary: 20000, mg: ['traktor', 'hasat_sepeti', 'ekim', 'hasat', 'hasere', 'koyun_say', 'sut_sag', 'bitki_dostu', 'karpuz_tasi'], skill: 'doga', stat: 'fizik', minAge: 16, farm: true,
                levels: [['Çiftçi', 1, 3, 'modern_tarim'], ['Modern çiftçi', 2.4, 5], ['Kooperatif başkanı', 3.5, 99]] },
  futbolcu:   { name: 'Futbolcu', icon: '⚽', path: 'futbol', salary: 45000, mg: ['penalti', 'frikik', 'pas', 'taktik', 'calim', 'kafa', 'kaleci'], skill: 'futbol', stat: 'fizik', minAge: 17, viaDoor: 'futbol_pro',
                levels: [['Alt lig oyuncusu', 1, 2, 'futbol_superlig'], ['Süper Lig oyuncusu', 3.5, 3, 'futbol_milli'], ['Milli oyuncu', 7, 99]] },
  antrenor:   { name: 'Antrenör', icon: '📋', path: 'futbol', salary: 40000, mg: ['mevki_sec', 'taktik', 'konusma', 'kriz_yonetimi', 'transfer_mi'], skill: 'liderlik', stat: 'sosyal', minAge: 24, needAny: [{ flag: 'eskiFutbolcu' }, { skill: 'futbol', min: 55 }],
                levels: [['Altyapı antrenörü', 1, 3], ['Yardımcı antrenör', 1.6, 4], ['Teknik direktör', 3.5, 99]] },
  psikolog:   { name: 'Psikolog', icon: '🧠', path: 'genel', salary: 50000, mg: ['duygu_oku', 'konusma', 'hasta_bilgilendirme', 'sorgu', 'mazeret'], skill: 'empati', stat: 'sosyal', minAge: 22, needDept: 'psikoloji',
                levels: [['Psikolog', 1, 4], ['Uzman psikolog', 1.5, 5], ['Klinik sahibi', 2.3, 99]] },
  gazeteci:   { name: 'Gazeteci', icon: '📰', path: 'genel', salary: 38000, mg: ['haber_masasi', 'sorgu', 'kelime', 'basin_toplantisi', 'sahte_haber', 'manset', 'foto_muhabir'], skill: 'dil', stat: 'sosyal', minAge: 22, needDept: 'iletisim',
                levels: [['Muhabir', 1, 3], ['Editör', 1.5, 5], ['Genel yayın yönetmeni', 2.6, 99]] },
  tercuman:   { name: 'Tercüman', icon: '🌍', path: 'genel', salary: 45000, mg: ['kelime', 'dogruyanlis', 'ingilizce', 'es_anlam', 'ceviri_yaz'], skill: 'dil', stat: 'zeka', minAge: 22, needDept: 'tercumanlik',
                levels: [['Tercüman', 1, 4], ['Konferans tercümanı', 1.8, 99]] },
  muzisyen:   { name: 'Müzisyen', icon: '🎸', path: 'genel', salary: 25000, mg: ['akort', 'ritim', 'melodi', 'davul', 'ses_ayari', 'sahne_isik', 'dans_figur'], skill: 'muzik', stat: 'mutluluk', minAge: 17, needAny: [{ skill: 'muzik', min: 55 }],
                levels: [['Sokak müzisyeni', 1, 2], ['Stüdyo müzisyeni', 1.8, 3], ['Konser sanatçısı', 4, 99]] },
  tasarimci:  { name: 'Grafik tasarımcı', icon: '🎨', path: 'genel', salary: 35000, mg: ['renk_tonu', 'desen', 'urunsayfa', 'kamuflaj'], skill: 'resim', stat: 'mutluluk', minAge: 18, needAny: [{ skill: 'resim', min: 55 }],
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
  { id: 'ekonomi',      name: 'Ekonomi',                top: 32,  years: 4, icon: '📉', skills: ['matematik', 'ticaret'], alan: ['ea', 'sayisal'] },
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
    name: 'Uzmanlık sınavı', icon: '📚', path: 'doktor', age: [24, 45],
    need: { job: 'doktor' },
    exam: 'tus',
    text: 'Tıpta Uzmanlık Sınavı. Uzman olmak için yeterli puanı almalısın.',
    open: { promote: true, log: 'Uzmanlık sınavını kazandın, uzmanlık eğitimine başladın.' },
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
  // Karne yazılısı sınıf büyüdükçe uzar ve zorlaşır: 1–2. sınıf 6 kolay soru, ilkokul 8, ortaokul 10, lise 12
  karne:  { name: 'Karne yazılısı', q: 8,  t: 28, level: 'auto', qBy: { ilkokul1: 6, ilkokul: 8, ortaokul: 10, lise: 12 } },
  lgs:    { name: 'Lise sınavı',     q: 12, t: 38, level: 'ortaokul' },
  yks:    { name: 'Üniversite sınavı', q: 15, t: 42, level: 'lise' },
  ehliyet:{ name: 'Ehliyet sınavı', q: 8,  t: 30, level: 'ehliyet' },
  kpss:   { name: 'Kamu sınavı',     q: 12, t: 38, level: 'genel' },
  tus:    { name: 'Uzmanlık sınavı', q: 10, t: 42, level: 'tip' },
  is:     { name: 'İş mülakatı',    q: 5,  t: 40, level: 'genel' },
  usta:   { name: 'Ustalık belgesi',q: 8,  t: 38, level: 'usta' },
  uni:    { name: 'Final sınavı',   q: 10, t: 38, level: 'lise' },
};
export const examLevel = (id, age) => EXAMS[id].level === 'auto' ? (age <= 8 ? 'ilkokul1' : age <= 9 ? 'ilkokul' : age <= 13 ? 'ortaokul' : 'lise') : EXAMS[id].level;
export const examQ = (id, age) => EXAMS[id].qBy?.[examLevel(id, age)] ?? EXAMS[id].q;

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
