// Eylemler: her biri EP ve enerji harcar. Çoğu bir mini oyunla oynanır (atlanabilir).
// Alanlar:
//   skills: { alan: taban kazanç }   → formülle büyür
//   stats:  { stat: miktar }         → performansla ölçeklenir
//   mg: mini oyun id'si ya da (state) => id
//   req(state) → kilit sebebi (string) ya da null
import { JOBS } from './careers.js';
import { BIZ_STEPS } from './business.js';

const inSchool = s => ['ilkokul', 'orta', 'lise'].includes(s.edu.stage);
const stageIn = (...ids) => s => ids.includes(stageId(s));
export const stageId = s => {
  const a = s.age;
  if (a <= 5) return 'bebek';
  if (a <= 9) return 'ilkokul';
  if (a <= 13) return 'orta';
  if (a <= 17) return 'lise';
  if (a <= 29) return 'genc';
  if (a <= 54) return 'yetiskin';
  return 'olgun';
};
const adult = s => s.age >= 18;
const wealthRank = s => ['fakir', 'orta', 'varlikli', 'zengin'].indexOf(s.family.wealth);

export const CATEGORIES = {
  egitim:  { name: 'Eğitim',        icon: '📚' },
  is:      { name: 'İş & Kariyer',  icon: '💼' },
  ticaret: { name: 'Ticaret',       icon: '💰' },
  spor:    { name: 'Spor',          icon: '⚽' },
  sanat:   { name: 'Sanat & Hobi',  icon: '🎨' },
  sosyal:  { name: 'Sosyal & Aile', icon: '🤝' },
  saglik:  { name: 'Sağlık & Dinlenme', icon: '🌿' },
};

export const ACTIONS = [
  // ——— EĞİTİM ———
  { id: 'mat', name: 'Matematik çalış', icon: '🔢', cat: 'egitim', ep: 1, when: s => inSchool(s),
    desc: 'Zihinden işlem sprinti. Hız ve doğruluk.', mg: 'hizlimat', mgSkill: 'matematik',
    skills: { matematik: 4 }, stats: { zeka: 1.2, disiplin: 0.8 }, study: 1, train: 'matematik' },
  { id: 'kitap', name: 'Kitap oku', icon: '📚', cat: 'egitim', ep: 1, when: s => s.age >= 6,
    desc: 'Karışık harflerden kelimeyi bul. Dil ve genel kültür.', mg: 'kelime', mgSkill: 'dil',
    skills: { dil: 4 }, stats: { zeka: 1, mutluluk: 1 }, study: 1, train: 'dil' },
  { id: 'fen', name: 'Fen deneyi', icon: '🔬', cat: 'egitim', ep: 1, when: s => s.age >= 9 && s.age <= 22,
    desc: 'Devreyi tamamla, ampulü yak. Mantık ve fen.', mg: 'devre', mgSkill: 'fen',
    skills: { fen: 4, matematik: 1 }, stats: { zeka: 1.2 }, study: 1, train: 'fen' },
  { id: 'dershane', name: 'Dershane / etüt', icon: '🏫', cat: 'egitim', ep: 2, when: s => ['orta', 'lise'].includes(stageId(s)) && s.edu.stage !== 'none',
    desc: 'Deneme sınavı çöz. Sınav hazırlığını ciddi artırır.', mg: 'sinav', mgSkill: 'zeka', cost: 18000,
    costNote: 'Yıllık ücret — ailen karşılar (fakir ailede sen ödersin)',
    skills: { matematik: 3, fen: 3, dil: 3 }, stats: { zeka: 2, disiplin: 2, mutluluk: -2 }, study: 2 },
  { id: 'kodlama', name: 'Kodlama kursu', icon: '💻', cat: 'egitim', ep: 1, when: s => s.age >= 10,
    desc: 'Koddaki hatalı satırı bul.', mg: 'bugavi', mgSkill: 'teknoloji', cost: 6000,
    skills: { teknoloji: 5, matematik: 1 }, stats: { zeka: 1 }, train: 'teknoloji' },
  { id: 'uni_ders', name: 'Derslere çalış', icon: '🎓', cat: 'egitim', ep: 1, when: s => s.edu.stage === 'uni',
    desc: 'Final sınavına hazırlan. Mezuniyet ortalamanı belirler.', mg: 'sinav', mgSkill: 'zeka', exam: 'uni',
    skills: {}, stats: { zeka: 1.5, disiplin: 1 }, study: 1, uni: true },
  { id: 'staj', name: 'Staj yap', icon: '🧑‍💼', cat: 'egitim', ep: 1, when: s => s.age >= 16 && (s.edu.stage === 'uni' || s.edu.stage === 'lise'),
    desc: 'Gerçek bir iş yerinde deneyim. İş mülakatlarında avantaj.', mg: s => deptMg(s), mgSkill: s => deptSkill(s),
    skills: {}, deptSkills: 4, stats: { disiplin: 1, sosyal: 1 }, flag: 'staj' },
  { id: 'ehliyet', name: 'Ehliyet sınavı', icon: '🚗', cat: 'egitim', ep: 1, when: s => s.age >= 18 && !s.flags.ehliyet, exam: 'ehliyet',
    desc: 'Trafik kuralları sınavı. Şoförlük ve kargo işlerini açar.', cost: 12000, mg: 'sinav', mgSkill: 'zeka' },
  { id: 'kpss', name: 'KPSS\'ye gir', icon: '🏛️', cat: 'egitim', ep: 2, when: s => s.age >= 20 && s.age <= 40 && !s.flags.kpss && s.edu.gpa !== null,
    desc: 'Kamu Personeli Seçme Sınavı. Memurluk ve polisliği açar.', exam: 'kpss', mg: 'sinav', mgSkill: 'zeka' },
  { id: 'sertifika', name: 'Sertifika programı', icon: '📜', cat: 'egitim', ep: 1, when: s => adult(s) && !!s.career.job,
    desc: 'İşinle ilgili uzmanlık eğitimi. Mesleki beceri + terfi şansı.', mg: s => JOBS[s.career.job.id].mg, mgSkill: s => JOBS[s.career.job.id].skill, cost: 15000,
    skills: {}, jobSkill: 5, stats: { disiplin: 1 }, perfBonus: 8 },
  { id: 'tarim_kursu', name: 'Tarım kursu', icon: '🚜', cat: 'egitim', ep: 1, when: s => s.age >= 16 && !s.flags.tarimKursu && (s.family.place !== 'sehir' || s.career.job?.id === 'ciftci'),
    desc: 'Toprak, sulama ve modern teknikler. Modern tarım kapısı için gerekir.', mg: 'ekim', mgSkill: 'doga', cost: 5000,
    skills: { doga: 5 }, flag: 'tarimKursu' },

  // ——— İŞ ———
  { id: 'is_ara', name: 'İş ara', icon: '🔎', cat: 'is', ep: 1, when: s => s.age >= 14 && !s.career.retired && s.edu.stage !== 'uni',
    desc: 'Uygun ilanlara başvur, mülakata gir.', special: 'jobsearch' },
  { id: 'mesai', name: 'Mesaiye odaklan', icon: '💼', cat: 'is', ep: 1, when: s => !!s.career.job,
    desc: 'İşini en iyi şekilde yap. Performans terfiyi ve primi belirler.', mg: s => JOBS[s.career.job.id].mg, mgSkill: s => JOBS[s.career.job.id].skill,
    skills: {}, jobSkill: 3, stats: { disiplin: 0.8 }, work: true },
  { id: 'fazla_mesai', name: 'Fazla mesai', icon: '🌙', cat: 'is', ep: 2, when: s => !!s.career.job && JOBS[s.career.job.id].path !== 'futbol',
    desc: 'Daha çok kazan ama yorul.', mg: s => JOBS[s.career.job.id].mg, mgSkill: s => JOBS[s.career.job.id].skill,
    skills: {}, jobSkill: 2, stats: { mutluluk: -3, saglik: -2 }, work: true, bonusSalary: 0.12 },
  { id: 'yari_zaman', name: 'Yarı zamanlı iş', icon: '🧾', cat: 'is', ep: 1, when: s => s.age >= 15 && !s.career.job && s.age <= 26,
    desc: 'Kafede kasaya geç. Para üstünü doğru ver.', mg: 'paraustu', mgSkill: 'ticaret',
    skills: { ticaret: 2, empati: 1 }, stats: { disiplin: 1 }, earn: 30000 },
  { id: 'danisman', name: 'Danışmanlık yap', icon: '🧓', cat: 'is', ep: 1, when: s => s.age >= 50 && s.life.jobs.length > 0,
    desc: 'Tecrübeni gençlere aktar. Konuşman ikna edici olmalı.', mg: 'konusma', mgSkill: 'liderlik',
    skills: { liderlik: 2 }, stats: { itibar: 2 }, earn: 180000 },

  // ——— TİCARET ———
  { id: 'bakkal', name: 'Bakkala yardım et', icon: '🏪', cat: 'ticaret', ep: 1, when: s => s.age >= 6 && s.age <= 13,
    desc: 'Müşterilere para üstü ver. Harçlık kazan.', mg: 'paraustu', mgSkill: 'ticaret',
    skills: { ticaret: 4, matematik: 1 }, stats: { sosyal: 0.5 }, earn: 1500, train: 'ticaret' },
  { id: 'isletme', name: 'İşletmeni yönet', icon: '📈', cat: 'ticaret', ep: 1, when: s => !!s.career.biz,
    desc: 'Pazarlık, fiyat, stok… İşletmenin yıllık kârı bu oyunlardaki becerine bağlı.', mg: s => bizMg(s), mgSkill: 'ticaret',
    skills: { ticaret: 3 }, stats: { disiplin: 0.5 }, biz: true, train: 'ticaret' },
  { id: 'isletme_ac', name: 'Okulda satış başlat', icon: '🍪', cat: 'ticaret', ep: 1, when: s => s.age >= 10 && !s.career.biz && s.age < 30,
    desc: 'İlk ticaretin: kurabiye ve bileklik sat. Ticaret yolunun ilk basamağı.', special: 'bizstart' },
  { id: 'birikim', name: 'Birikim hesabına yatır', icon: '🏦', cat: 'ticaret', ep: 1, when: s => adult(s) && s.money > 20000 * s.priceIndex,
    desc: 'Nakdinin yarısını faiz getiren hesaba koy. Enflasyona karşı korur.', special: 'save' },

  // ——— SPOR ———
  { id: 'mahalle_maci', name: 'Mahalle maçı', icon: '⚽', cat: 'spor', ep: 1, when: s => s.age >= 6 && s.age <= 13,
    desc: 'Çalım at, gol at. Futbol yeteneği ve arkadaşlık.', mg: s => (s.age % 2 ? 'calim' : 'penalti'), mgSkill: 'futbol',
    skills: { futbol: 4 }, stats: { fizik: 1.5, mutluluk: 1.5, sosyal: 0.5 }, train: 'futbol' },
  { id: 'okul_takimi', name: 'Okul takımı', icon: '🥅', cat: 'spor', ep: 1, when: s => s.age >= 10 && s.age <= 17 && !s.flags.altyapi,
    desc: 'Maç anında doğru taktik kartını seç.', mg: s => (s.age % 2 ? 'taktik' : 'penalti'), mgSkill: 'futbol',
    skills: { futbol: 5, liderlik: 1 }, stats: { fizik: 1.5, sosyal: 1 }, train: 'futbol' },
  { id: 'altyapi', name: 'Altyapı antrenmanı', icon: '🏟️', cat: 'spor', ep: 2, when: s => !!s.flags.altyapi && !s.career.job,
    desc: 'Yoğun kulüp antrenmanı. İyi sezonlar profesyonel sözleşmeyi getirir.', mg: s => ['calim', 'taktik', 'penalti'][s.age % 3], mgSkill: 'futbol',
    skills: { futbol: 8 }, stats: { fizik: 3, disiplin: 1, mutluluk: -1 }, train: 'futbol', altyapi: true },
  { id: 'kosu', name: 'Koşu & kondisyon', icon: '🏃', cat: 'spor', ep: 1, when: s => s.age >= 6,
    desc: 'Temponu hedef bölgede tut.', mg: 'kondisyon', mgSkill: 'fizik',
    skills: { futbol: 1 }, stats: { fizik: 2.5, saglik: 2, disiplin: 0.8 } },
  { id: 'spor_salonu', name: 'Spor salonu', icon: '🏋️', cat: 'spor', ep: 1, when: s => adult(s), cost: 6000,
    desc: 'Düzenli spor: sağlık ve fizik.', mg: 'kondisyon', mgSkill: 'fizik',
    stats: { fizik: 2.5, saglik: 3, disiplin: 1 } },

  // ——— SANAT ———
  { id: 'muzik', name: 'Enstrüman çal', icon: '🎹', cat: 'sanat', ep: 1, when: s => s.age >= 6,
    desc: 'Notalara zamanında dokun.', mg: 'ritim', mgSkill: 'muzik',
    skills: { muzik: 4 }, stats: { mutluluk: 2 }, train: 'muzik' },
  { id: 'resim', name: 'Resim yap', icon: '🎨', cat: 'sanat', ep: 1, when: s => s.age >= 6,
    desc: 'Deseni bir bakışta aklında tut ve yeniden çiz.', mg: 'desen', mgSkill: 'resim',
    skills: { resim: 4 }, stats: { mutluluk: 2 }, train: 'resim' },
  { id: 'tamir', name: 'Tamir & maket', icon: '🔧', cat: 'sanat', ep: 1, when: s => s.age >= 7,
    desc: 'Parçaları doğru sırayla sök ve tak.', mg: 'parca', mgSkill: 'el',
    skills: { el: 4, fen: 1 }, stats: { disiplin: 0.5 }, train: 'el' },

  // ——— SOSYAL ———
  { id: 'arkadas', name: 'Arkadaşlarla vakit', icon: '🧑‍🤝‍🧑', cat: 'sosyal', ep: 1, when: s => s.age >= 6,
    desc: 'Hafıza kartları turnuvası. Arkadaşlık ve mutluluk.', mg: 'hafiza', mgSkill: 'sosyal',
    skills: { empati: 2 }, stats: { sosyal: 2.5, mutluluk: 3 }, friend: true },
  { id: 'kulup', name: 'Okul kulübü / başkanlık', icon: '🗳️', cat: 'sosyal', ep: 1, when: s => s.age >= 10 && s.age <= 22 && s.edu.stage !== 'done',
    desc: 'Sınıfa konuşma yap, oyları topla.', mg: 'konusma', mgSkill: 'liderlik',
    skills: { liderlik: 4, dil: 1 }, stats: { sosyal: 1.5, itibar: 1 }, train: 'liderlik' },
  { id: 'gonullu', name: 'Afet gönüllülüğü', icon: '🦺', cat: 'sosyal', ep: 1, when: s => s.age >= 12,
    desc: 'Tatbikat: enkazdan en kısa yolu bul, herkesi çıkar.', mg: 'kurtarma', mgSkill: 'empati',
    skills: { empati: 3, liderlik: 1 }, stats: { itibar: 2.5, mutluluk: 1.5 }, flag: 'gonullu' },
  { id: 'aile', name: 'Aileyle vakit', icon: '🏡', cat: 'sosyal', ep: 1, when: s => s.age >= 6,
    desc: 'Birlikte yemek, sohbet. Aile bağı güçlenir.', skills: { empati: 1 }, stats: { mutluluk: 4, saglik: 1 }, family: true },
  { id: 'tanis', name: 'Yeni insanlarla tanış', icon: '💞', cat: 'sosyal', ep: 1, when: s => s.age >= 17 && !s.rel.partner && !s.rel.married,
    desc: 'Sohbeti doğru yönlendir. Belki hayatının insanı karşındadır.', mg: 'konusma', mgSkill: 'sosyal',
    skills: { empati: 1 }, stats: { sosyal: 2, mutluluk: 1 }, date: true },
  { id: 'partner', name: 'Partnerinle vakit', icon: '❤️', cat: 'sosyal', ep: 1, when: s => !!s.rel.partner,
    desc: 'İlişkiye emek ver.', stats: { mutluluk: 5 }, love: true },
  { id: 'cocuk', name: 'Çocuklarınla ilgilen', icon: '👨‍👧', cat: 'sosyal', ep: 1, when: s => s.rel.children.some(c => c.age <= 20),
    desc: 'Ödevlerine yardım et, maçlarına git.', stats: { mutluluk: 4, itibar: 0.5 }, kids: true },
  { id: 'hayir', name: 'Burs fonu / hayır işi', icon: '🎗️', cat: 'sosyal', ep: 1, when: s => s.age >= 30 && s.money > 60000 * s.priceIndex, cost: 50000,
    desc: 'Öğrencilere burs ver. İtibar ve iç huzuru.', stats: { itibar: 5, mutluluk: 4 }, skills: { empati: 2 }, honest: true },

  // ——— DOĞA / SAĞLIK ———
  { id: 'tarla', name: 'Tarlada yardım et', icon: '🌾', cat: 'saglik', ep: 1, when: s => s.age >= 6 && s.age <= 17 && s.family.place !== 'sehir',
    desc: 'Olgun ürünü çürümeden topla.', mg: 'hasat', mgSkill: 'doga',
    skills: { doga: 4 }, stats: { fizik: 1, saglik: 1 }, earn: 800, train: 'doga' },
  { id: 'bahce', name: 'Bahçecilik', icon: '🌻', cat: 'saglik', ep: 1, when: s => s.age >= 18,
    desc: 'Mevsime göre ekim planı yap.', mg: 'ekim', mgSkill: 'doga',
    skills: { doga: 3 }, stats: { mutluluk: 2.5, saglik: 1 }, train: 'doga' },
  { id: 'dinlen', name: 'Dinlen', icon: '😴', cat: 'saglik', ep: 1, rest: true, when: s => s.age >= 6,
    desc: 'Az enerjiyle yılı ilerletir. Mutluluk ve sağlık toparlanır.', stats: { mutluluk: 3, saglik: 1.5 } },
  { id: 'kontrol', name: 'Sağlık kontrolü', icon: '🏥', cat: 'saglik', ep: 1, when: s => s.age >= 30, cost: 4000,
    desc: 'Erken teşhis hayat kurtarır. Bu yıl hastalık riski yarıya iner.', stats: { saglik: 4 }, flagYear: 'kontrol' },
  { id: 'tatil', name: 'Tatile çık', icon: '🏖️', cat: 'saglik', ep: 1, when: s => adult(s), cost: 35000,
    desc: 'Deniz, güneş, dinlenme.', stats: { mutluluk: 10, saglik: 2 } },
  { id: 'emekli', name: 'Emekli ol', icon: '🪑', cat: 'is', ep: 1, when: s => s.age >= 58 && !!s.career.job, special: 'retire',
    desc: 'İşi bırak, maaşının %40\'ı emekli aylığı olarak gelir.' },
];

export const actionById = Object.fromEntries(ACTIONS.map(a => [a.id, a]));

function deptMg(s) {
  const d = s.edu.dept;
  return { tip: 'teshis', dis: 'ameliyat', eczacilik: 'teshis', bilgisayar: 'bugavi', hukuk: 'sorgu', muhendislik: 'devre', ogretmenlik: 'konusma',
    isletme: 'fiyat', hemsirelik: 'triyaj', ziraat: 'ekim', spor: 'taktik', onlisans: 'parca' }[d] || 'parca';
}
function deptSkill(s) {
  const d = s.edu.dept;
  return { tip: 'fen', dis: 'el', eczacilik: 'fen', bilgisayar: 'teknoloji', hukuk: 'dil', muhendislik: 'matematik', ogretmenlik: 'empati',
    isletme: 'ticaret', hemsirelik: 'empati', ziraat: 'doga', spor: 'futbol', onlisans: 'el' }[d] || 'el';
}
export { deptSkill };
function bizMg(s) {
  const st = BIZ_STEPS[s.career.biz.step];
  const n = (s.year?.done?.filter(d => d === 'isletme').length || 0) + s.age;
  return st.mgs[n % st.mgs.length];
}

export function resolve(v, s) { return typeof v === 'function' ? v(s) : v; }

// Eylemin kilidi / maliyeti
export function actionCost(a, s) {
  let money = (a.cost || 0) * s.priceIndex;
  if (a.id === 'dershane' || a.id === 'kodlama') {
    // Çocukken aile öder; fakir ailede çocuk kendi harçlığından öder
    if (s.age < 18 && wealthRank(s) >= 1) money = 0;
  }
  return { money };
}

export function actionLock(a, s) {
  const { money } = actionCost(a, s);
  if (money > 0 && s.money < money) return `Para yetmiyor (${Math.round(money).toLocaleString('tr-TR')} TL)`;
  if (a.id === 'is_ara' && s.career.job && s.year?.done.includes('is_ara')) return 'Bu yıl zaten iş aradın';
  if (a.special === 'bizstart' && s.year?.done.includes('isletme_ac')) return null;
  if (a.exam && a.id !== 'uni_ders' && s.year?.done.includes(a.id)) return 'Bu sınava yılda bir kez girebilirsin';
  if (a.id === 'staj' && s.year?.done.includes('staj')) return 'Yılda bir staj';
  if (a.id === 'tatil' && s.year?.done.includes('tatil')) return 'Yılda bir tatil';
  if (a.id === 'kontrol' && s.year?.done.includes('kontrol')) return 'Bu yıl kontrol oldun';
  if (a.id === 'emekli' && s.career.retired) return 'Zaten emeklisin';
  return null;
}

export function availableActions(s) {
  if (stageId(s) === 'bebek') return [];
  return ACTIONS.filter(a => a.when(s));
}
