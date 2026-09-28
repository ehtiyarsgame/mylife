// Veri tablolarından ve formüllerden soru üretir. Her soru kalıcı bir kimlik taşır (tekrar kontrolü için).
import { COUNTRIES, PROVINCES, ENGLISH, SYNONYMS, ANTONYMS, ELEMENTS, WORKS, HISTORY, PROVERBS, BIO, UNITS, PLANETS,
  DISEASES, DRUGS, LABS, VITAMINS, SYMPTOMS, SIGNS, CAR_PARTS, FIRST_AID, TOOLS, TRADE_TERMS } from './qdata.js';

const uniq = (arr, bad) => [...new Set(arr.map(String))].filter(x => x !== String(bad));
// Havuzdan doğru cevaptan farklı 3 yanlış şık seç
function wrongFrom(r, pool, correct) {
  return r.shuffle(uniq(pool, correct)).slice(0, 3);
}
// Sayısal yanlış şıklar
function wrongNum(r, ans, steps) {
  const st = steps || [-10, -3, -2, -1, 1, 2, 3, 10, 5, -5];
  const out = new Set();
  let g = 0;
  while (out.size < 3 && g++ < 60) {
    const v = ans + r.pick(st) * (Math.abs(ans) > 60 ? r.int(1, 3) : 1);
    if (v !== ans) out.add(v);
  }
  while (out.size < 3) out.add(ans + out.size * 7 + 11);
  return [...out].map(String);
}
const Q = (id, s, q, a, w, h) => ({ id: 'g:' + id, s, q, a: [String(a), ...uniq(w, a).slice(0, 3)], c: 0, h: h || '' });
const gcd = (a, b) => b ? gcd(b, a % b) : a;
// Türkçe tamlayan eki: Fransa'nın, Türkiye'nin, Can'ın, Ürdün'ün
export function genitive(w) {
  const v = [...w.toLocaleLowerCase('tr')].reverse().find(c => 'aeıioöuü'.includes(c)) || 'e';
  const h = { a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' }[v];
  const endsV = 'aeıioöuü'.includes(w.slice(-1).toLocaleLowerCase('tr'));
  return `${w}'${endsV ? 'n' : ''}${h}n`;
}

// ——— Matematik ———
const M = {
  topla: r => { const a = r.int(12, 89), b = r.int(8, 60); return Q(`topla:${a}:${b}`, 'Matematik', `${a} + ${b} = ?`, a + b, wrongNum(r, a + b)); },
  cikar: r => { const a = r.int(30, 99), b = r.int(5, a - 3); return Q(`cikar:${a}:${b}`, 'Matematik', `${a} − ${b} = ?`, a - b, wrongNum(r, a - b)); },
  carpim: r => { const a = r.int(2, 9), b = r.int(2, 10); return Q(`carpim:${a}:${b}`, 'Matematik', `${a} × ${b} = ?`, a * b, wrongNum(r, a * b, [-a, a, -b, b, 1, -1])); },
  problem: r => {
    const n = r.pick(['Ali', 'Elif', 'Can', 'Zeynep', 'Mert', 'Ayşe', 'Umut', 'Deniz']), [it, its] = r.pick([['ceviz', 'cevizi'], ['bilye', 'bilyesi'], ['kalem', 'kalemi'], ['çıkartma', 'çıkartması'], ['elma', 'elması'], ['misket', 'misketi']]);
    const a = r.int(12, 40), b = r.int(3, a - 4), c = r.int(2, 15);
    return Q(`problem:${a}:${b}:${c}`, 'Matematik', `${genitive(n)} ${a} ${its} vardı. ${b} tanesini arkadaşına verdi, sonra ${c} tane daha aldı. Kaç ${its} oldu?`, a - b + c, wrongNum(r, a - b + c), 'Önce çıkar, sonra ekle.');
  },
  basamak: r => {
    const d = [r.int(1, 9), r.int(1, 9), r.int(1, 9), r.int(1, 9)], n = d.join(''), i = r.int(0, 3), val = d[i] * 10 ** (3 - i);
    const pool = [d[i], d[i] * 10, d[i] * 100, d[i] * 1000].filter(v => v !== val);
    return Q(`basamak:${n}:${i}`, 'Matematik', `${Number(n).toLocaleString('tr-TR')} sayısında ${i + 1}. soldaki rakamın basamak değeri kaçtır?`, val, pool.map(String), 'Birler, onlar, yüzler, binler.');
  },
  bolme: r => { const b = r.int(3, 12), a = r.int(3, 15); return Q(`bolme:${a * b}:${b}`, 'Matematik', `${a * b} ÷ ${b} = ?`, a, wrongNum(r, a, [-2, -1, 1, 2, 3])); },
  yuzde: r => { const p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 75]), n = r.pick([40, 60, 80, 120, 160, 200, 240, 300, 400, 500]); return Q(`yuzde:${n}:${p}`, 'Matematik', `${n} sayısının %${p}'i kaçtır?`, n * p / 100, wrongNum(r, n * p / 100, [-10, -5, 5, 10, 2, -2])); },
  ebob: r => { const g = r.int(2, 9), a = g * r.int(2, 7), b = g * r.int(2, 7); const e = gcd(a, b); if (a === b) return M.ekok(r); return Q(`ebob:${a}:${b}`, 'Matematik', `EBOB(${a}, ${b}) = ?`, e, wrongNum(r, e, [-1, 1, 2, -2, e]), 'Ortak bölenlerin en büyüğü.'); },
  ekok: r => { const a = r.int(3, 12), b = r.int(3, 12); const k = a * b / gcd(a, b); return Q(`ekok:${a}:${b}`, 'Matematik', `EKOK(${a}, ${b}) = ?`, k, uniq([a * b === k ? k + a : a * b, k + a, k - b > 0 ? k - b : k + 2 * b, k * 2], k), 'Ortak katların en küçüğü.'); },
  kesir: r => { const d = r.pick([4, 5, 6, 8, 10, 12]), a = r.int(1, d - 2), b = r.int(1, d - a - 1); return Q(`kesir:${a}:${b}:${d}`, 'Matematik', `${a}/${d} + ${b}/${d} = ?`, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`], 'Paydalar eşitse paylar toplanır.'); },
  tamsayi: r => { const a = r.int(-20, -2), b = r.int(3, 25); const op = r.pick(['+', '×']); const v = op === '+' ? a + b : a * b; return Q(`tamsayi:${a}:${op}:${b}`, 'Matematik', `(${a}) ${op} ${b} = ?`, v, [String(-v), ...wrongNum(r, v)].filter(x => x !== String(v)), 'İşaret kuralına dikkat.'); },
  alan: r => { const a = r.int(3, 15), b = r.int(3, 15); const t = r.pick(['alan', 'çevre']); const v = t === 'alan' ? a * b : 2 * (a + b); return Q(`dikdortgen:${t}:${a}:${b}`, 'Matematik', `Kenarları ${a} cm ve ${b} cm olan dikdörtgenin ${t}${t === 'alan' ? 'ı' : 'si'}?`, v, [String(t === 'alan' ? 2 * (a + b) : a * b), String(a + b), String(v + 2)].filter(x => x !== String(v))); },
  us: r => { const a = r.int(2, 6), b = r.int(2, 4); return Q(`us:${a}:${b}`, 'Matematik', `${a}^${b} = ?`, a ** b, [String(a * b), String(a ** (b + 1)), String(a ** b + a)]); },
  karekok: r => { const a = r.int(4, 20); return Q(`karekok:${a}`, 'Matematik', `√${a * a} = ?`, a, wrongNum(r, a, [-2, -1, 1, 2])); },
  ortalama: r => { const xs = [r.int(40, 100), r.int(40, 100), r.int(40, 100)]; const s = xs.reduce((x, y) => x + y) ; const extra = (3 - s % 3) % 3; xs[0] += extra; const avg = (s + extra) / 3; return Q(`ort:${xs.join(':')}`, 'Matematik', `${xs.join(', ')} notlarının ortalaması?`, avg, wrongNum(r, avg, [-3, -2, 2, 3, 5])); },
  oran: r => { const a = r.int(2, 5), b = r.int(2, 5), k = r.int(3, 9); if (a === b) return M.us(r); return Q(`oran:${a}:${b}:${k}`, 'Matematik', `Kız/erkek oranı ${a}/${b}. ${a * k} kız varsa kaç erkek vardır?`, b * k, wrongNum(r, b * k, [-k, k, -1, 1, 2])); },
  denklem: r => { const x = r.int(-6, 14), a = r.int(2, 9), b = r.int(-15, 20); const rhs = a * x + b; return Q(`denk:${a}:${b}:${x}`, 'Matematik', `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${rhs} ise x = ?`, x, wrongNum(r, x, [-2, -1, 1, 2, 3])); },
  kok: r => { const p = r.int(-6, 8), q = r.int(-6, 8); const s = p + q, m = p * q; const f = `x² ${s > 0 ? '−' : '+'} ${Math.abs(s)}x ${m < 0 ? '−' : '+'} ${Math.abs(m)} = 0`; const t = r.pick(['toplamı', 'çarpımı']); const v = t === 'toplamı' ? s : m; return Q(`kok:${p}:${q}:${t}`, 'Matematik', `${f} denkleminin kökleri ${t} kaçtır?`, v, [String(-v), ...wrongNum(r, v)].filter(x => x !== String(v)), 'Vieta: toplam −b/a, çarpım c/a.'); },
  log: r => { const b = r.pick([2, 3, 5, 10]), e = r.int(1, b === 10 ? 4 : b === 2 ? 7 : 4); return Q(`log:${b}:${e}`, 'Matematik', `log${b === 10 ? '' : '_' + b}(${b ** e}) = ?`, e, wrongNum(r, e, [-1, 1, 2, -2, b])); },
  fonk: r => { const a = r.int(2, 7), b = r.int(-9, 9), c = r.int(-3, 6); const v = a * c * c + b; return Q(`fonk:${a}:${b}:${c}`, 'Matematik', `f(x) = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)} ise f(${c}) = ?`, v, wrongNum(r, v, [-a, a, -2, 2, 1, -1])); },
  dizi: r => { const a1 = r.int(-5, 12), d = r.int(2, 9), n = r.int(6, 25); const v = a1 + (n - 1) * d; return Q(`dizi:${a1}:${d}:${n}`, 'Matematik', `İlk terimi ${a1}, ortak farkı ${d} olan aritmetik dizinin ${n}. terimi?`, v, [String(a1 + n * d), String(a1 + (n - 2) * d), String(v + 1)], 'aₙ = a₁ + (n−1)d'); },
  olasilik: r => { const k = r.int(2, 6), m = r.int(2, 8), total = k + m; const g = gcd(k, total); return Q(`olas:${k}:${m}`, 'Matematik', `Torbada ${k} kırmızı, ${m} mavi top var. Rastgele çekilen topun kırmızı olma olasılığı?`, `${k / g}/${total / g}`, uniq([`${m / gcd(m, total)}/${total / gcd(m, total)}`, `${k}/${m}`, `1/${total}`], `${k / g}/${total / g}`), 'İstenen / tüm durumlar'); },
  pisagor: r => { const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]]); return Q(`pis:${a}:${b}`, 'Matematik', `Dik kenarları ${a} ve ${b} olan dik üçgenin hipotenüsü?`, c, [String(a + b), String(c + 1), String(c - 2)]); },
  aci: r => { const a = r.int(25, 90), b = r.int(20, 150 - a); return Q(`aci:${a}:${b}`, 'Matematik', `Bir üçgenin iki açısı ${a}° ve ${b}°. Üçüncü açı?`, 180 - a - b, wrongNum(r, 180 - a - b, [-10, 10, -5, 5, 20])); },
  kombin: r => { const n = r.int(4, 12); const v = n * (n - 1) / 2; return Q(`komb:${n}`, 'Matematik', `${n} kişilik bir grupta herkes birbiriyle bir kez tokalaşırsa kaç tokalaşma olur?`, v, [String(n * (n - 1)), String(n * 2), String(v + n)], 'C(n,2) = n(n−1)/2'); },
  zam: r => { const p = r.int(4, 40) * 50, z = r.pick([10, 20, 25, 30, 50]), i = r.pick([10, 20, 25]); const v = p * (1 + z / 100) * (1 - i / 100); if (v % 1) return M.yuzde(r); return Q(`zam:${p}:${z}:${i}`, 'Matematik', `${p} TL'lik ürüne önce %${z} zam, sonra %${i} indirim yapıldı. Son fiyat?`, v, [String(p * (1 + (z - i) / 100)), String(p), String(v + 50)].filter(x => x !== String(v)), 'Yüzdeler art arda uygulanır.'); },
  faiz: r => { const a = r.int(2, 20) * 1000, f = r.pick([10, 20, 25, 40, 50]); return Q(`faiz:${a}:${f}`, 'Matematik', `${a} TL, yıllık %${f} basit faizle 2 yılda toplam kaç TL olur?`, a * (1 + 2 * f / 100), [String(a * (1 + f / 100)), String(a * (1 + f / 100) ** 2), String(a * 2)].filter(x => x !== String(a * (1 + 2 * f / 100)))); },
};

// ——— Sözel / Fen tabloları ———
const T = {
  baskent: r => { const c = r.pick(COUNTRIES); return Q(`baskent:${c[0]}`, 'Coğrafya', `${genitive(c[0])} başkenti neresidir?`, c[1], wrongFrom(r, COUNTRIES.map(x => x[1]), c[1])); },
  baskentTers: r => { const c = r.pick(COUNTRIES); return Q(`baskentT:${c[1]}`, 'Coğrafya', `${c[1]} hangi ülkenin başkentidir?`, c[0], wrongFrom(r, COUNTRIES.map(x => x[0]), c[0])); },
  para: r => { const c = r.pick(COUNTRIES.filter(x => !['Euro', 'Dolar', 'Peso', 'Dinar', 'Riyal', 'Manat', 'Som', 'Rupi', 'Kron', 'Lira'].includes(x[3]))); return Q(`para:${c[0]}`, 'Genel Kültür', `${genitive(c[0])} para birimi hangisidir?`, c[3], wrongFrom(r, COUNTRIES.map(x => x[3]), c[3])); },
  bolge: r => { const p = r.pick(PROVINCES); return Q(`bolge:${p[0]}`, 'Coğrafya', `${p[0]} hangi coğrafi bölgededir?`, p[1], wrongFrom(r, ['Marmara', 'Ege', 'Akdeniz', 'İç Anadolu', 'Karadeniz', 'Doğu Anadolu', 'Güneydoğu Anadolu'], p[1])); },
  plaka: r => { const p = r.pick(PROVINCES); return Q(`plaka:${p[0]}`, 'Genel Kültür', `${p[2]} plaka kodu hangi ile aittir?`, p[0], wrongFrom(r, PROVINCES.filter(x => Math.abs(x[2] - p[2]) < 12).map(x => x[0]), p[0])); },
  ingTr: r => { const e = r.pick(ENGLISH); return Q(`ing:${e[0]}`, 'İngilizce', `"${e[0]}" kelimesinin Türkçesi nedir?`, e[1], wrongFrom(r, ENGLISH.map(x => x[1]), e[1])); },
  trIng: r => { const e = r.pick(ENGLISH); return Q(`ingT:${e[1]}`, 'İngilizce', `"${e[1]}" kelimesinin İngilizcesi nedir?`, e[0], wrongFrom(r, ENGLISH.map(x => x[0]), e[0])); },
  esAnlam: r => { const e = r.pick(SYNONYMS); return Q(`es:${e[0]}`, 'Türkçe', `"${e[0]}" kelimesinin eş anlamlısı hangisidir?`, e[1], wrongFrom(r, SYNONYMS.map(x => x[1]), e[1])); },
  zitAnlam: r => { const e = r.pick(ANTONYMS); return Q(`zit:${e[0]}`, 'Türkçe', `"${e[0]}" kelimesinin zıt anlamlısı hangisidir?`, e[1], wrongFrom(r, ANTONYMS.map(x => x[1]), e[1])); },
  atasozu: r => { const p = r.pick(PROVERBS); return Q(`atasozu:${p[0]}`, 'Türkçe', `"${p[0]} …" atasözünü tamamla.`, p[1], p[2]); },
  element: r => { const e = r.pick(ELEMENTS); return Q(`elem:${e[0]}`, 'Kimya', `${e[0]} elementinin sembolü hangisidir?`, e[1], wrongFrom(r, ELEMENTS.map(x => x[1]), e[1])); },
  elementNo: r => { const e = r.pick(ELEMENTS); return Q(`elemNo:${e[0]}`, 'Kimya', `Atom numarası ${e[2]} olan element hangisidir?`, e[0], wrongFrom(r, ELEMENTS.slice().sort((x, y) => Math.abs(x[2] - e[2]) - Math.abs(y[2] - e[2])).slice(1, 6).map(x => x[0]), e[0])); },
  eser: r => { const w = r.pick(WORKS); return Q(`eser:${w[0]}`, 'Edebiyat', `"${w[0]}" kimin eseridir?`, w[1], wrongFrom(r, WORKS.map(x => x[1]), w[1])); },
  tarih: r => { const e = r.pick(HISTORY); return Q(`tarih:${e[0]}`, 'Tarih', `${e[0]} hangi yılda gerçekleşti?`, e[1], uniq([e[1] + r.pick([-3, -2, -1]), e[1] + r.pick([1, 2, 4]), e[1] + r.pick([-11, 10, 25, -30])], e[1])); },
  tarihSira: r => { const [a, b] = r.shuffle(HISTORY.filter(x => x[1] > 1800)).slice(0, 2); if (a[1] === b[1]) return T.tarih(r); const first = a[1] < b[1] ? a : b; const second = first === a ? b : a; return Q(`sira:${first[0]}:${second[0]}`, 'Tarih', `Hangisi daha ÖNCE gerçekleşmiştir?`, first[0], [second[0], ...wrongFrom(r, HISTORY.filter(x => x[1] > second[1]).map(x => x[0]), first[0]).slice(0, 2)]); },
  organ: r => { const o = r.pick(BIO); return Q(`bio:${o[0]}`, 'Biyoloji', `"${o[1]}" — bu görev hangisine aittir?`, o[0], wrongFrom(r, BIO.map(x => x[0]), o[0])); },
  birim: r => { const u = r.pick(UNITS); return Q(`birim:${u[0]}`, 'Fizik', `${u[0]} büyüklüğünün SI birimi hangisidir?`, u[1], wrongFrom(r, UNITS.map(x => x[1]), u[1])); },
  gezegen: r => { const i = r.int(0, 7); const sira = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı', 'yedinci', 'sekizinci'][i]; return Q(`gez:${i}`, 'Fen', `Güneş'e uzaklık sırasına göre ${sira} gezegen hangisidir?`, PLANETS[i], wrongFrom(r, PLANETS, PLANETS[i])); },
};


// ——— Meslek sınavları ———
const dec = v => String(Math.round(v * 100) / 100).replace('.', ',');
const P = {
  // Tıp
  etkenGrup: r => { const d = r.pick(DISEASES); return Q(`etkenG:${d[0]}`, 'Tıp', `${d[0]} hastalığının etkeni hangi gruptandır?`, d[1], ['Bakteri', 'Virüs', 'Mantar', 'Parazit'].filter(x => x !== d[1])); },
  etken: r => { const d = r.pick(DISEASES); return Q(`etken:${d[0]}`, 'Tıp', `${d[0]} hastalığının etkeni hangisidir?`, d[2], wrongFrom(r, DISEASES.map(x => x[2]), d[2])); },
  ilacSinif: r => { const d = r.pick(DRUGS); return Q(`ilac:${d[0]}`, 'Farmakoloji', `${d[0]} hangi ilaç grubundandır?`, d[1], wrongFrom(r, DRUGS.map(x => x[1]), d[1])); },
  ilacTers: r => { const d = r.pick(DRUGS); return Q(`ilacT:${d[0]}`, 'Farmakoloji', `Hangisi bir "${d[1]}" ilacıdır?`, d[0], wrongFrom(r, DRUGS.filter(x => x[1] !== d[1]).map(x => x[0]), d[0])); },
  lab: r => { const l = r.pick(LABS); return Q(`lab:${l[0]}`, 'Tıp', `${l[0]} için normal aralık hangisidir?`, l[1], l[2]); },
  vitamin: r => { const v = r.pick(VITAMINS); return r.chance(0.5)
    ? Q(`vit:${v[0]}`, 'Tıp', `${v[0]} eksikliği hangi tabloya yol açar?`, v[1], wrongFrom(r, VITAMINS.map(x => x[1]), v[1]))
    : Q(`vitT:${v[1]}`, 'Tıp', `${v[1]} hangi eksiklikte görülür?`, v[0], wrongFrom(r, VITAMINS.map(x => x[0]), v[0])); },
  bulgu: r => { const b = r.pick(SYMPTOMS); return Q(`bulgu:${b[0]}`, 'Tıp', `"${b[0]}" öncelikle hangi organ/sistemi düşündürür?`, b[1], wrongFrom(r, SYMPTOMS.map(x => x[1]), b[1])); },
  dozKilo: r => { const mg = r.pick([5, 10, 15, 20]), kg = r.int(8, 40) * 2; const v = mg * kg; return Q(`doz:${mg}:${kg}`, 'Farmakoloji', `Çocuk hastaya ${mg} mg/kg ilaç verilecek. Hasta ${kg} kg. Toplam doz?`, `${v} mg`, [`${v * 2} mg`, `${mg + kg} mg`, `${Math.round(v / 2)} mg`]); },
  surup: r => { const c = r.pick([125, 250]), want = c * r.pick([0.4, 0.6, 0.8, 1.2, 1.6, 2]); const ml = want / c * 5; return Q(`surup:${c}:${want}`, 'Farmakoloji', `Şurubun 5 mL'sinde ${c} mg etken madde var. ${want} mg için kaç mL verilir?`, `${dec(ml)} mL`, [`${dec(ml * 2)} mL`, `${dec(ml / 2)} mL`, `${dec(ml + 2.5)} mL`], 'Orantı kur: 5 mL → ' + c + ' mg'); },
  infuzyon: r => { const vol = r.pick([500, 1000, 1500, 2000]), h = r.pick([4, 5, 8, 10, 12, 20]); const v = vol / h; if (v % 1) return P.dozKilo(r); return Q(`inf:${vol}:${h}`, 'Hemşirelik', `${vol} mL serum ${h} saatte verilecek. Saatte kaç mL gitmeli?`, `${v} mL/sa`, [`${v * 2} mL/sa`, `${Math.round(v / 2)} mL/sa`, `${v + 25} mL/sa`]); },
  vki: r => { const boy = r.pick([1.5, 1.6, 1.7, 1.8, 2.0]), vki = r.int(17, 34); const kg = Math.round(vki * boy * boy); const v = kg / (boy * boy); const cat = v < 18.5 ? 'Zayıf' : v < 25 ? 'Normal' : v < 30 ? 'Fazla kilolu' : 'Obez'; return Q(`vki:${boy}:${kg}`, 'Tıp', `Boyu ${dec(boy)} m, kilosu ${kg} kg olan erişkinin VKİ sınıfı?`, cat, ['Zayıf', 'Normal', 'Fazla kilolu', 'Obez'].filter(x => x !== cat), 'VKİ = kg / boy²'); },
  // Ehliyet
  levha: r => { const l = r.pick(SIGNS); return Q(`levha:${l[0]}`, 'Trafik İşaretleri', `${l[0]} ne anlama gelir?`, l[1], wrongFrom(r, SIGNS.map(x => x[1]), l[1])); },
  levhaTers: r => { const l = r.pick(SIGNS); return Q(`levhaT:${l[1]}`, 'Trafik İşaretleri', `"${l[1]}" hangi levhayla gösterilir?`, l[0], wrongFrom(r, SIGNS.map(x => x[0]), l[0])); },
  parca: r => { const p = r.pick(CAR_PARTS); return Q(`parca:${p[0]}`, 'Motor', `${p[0]} ne işe yarar?`, p[1], wrongFrom(r, CAR_PARTS.map(x => x[1]), p[1])); },
  parcaTers: r => { const p = r.pick(CAR_PARTS); return Q(`parcaT:${p[0]}`, 'Motor', `"${p[1]}" — bu görev hangi parçaya aittir?`, p[0], wrongFrom(r, CAR_PARTS.map(x => x[0]), p[0])); },
  ilkYardim: r => { const f = r.pick(FIRST_AID); return Q(`iy:${f[0]}`, 'İlk Yardım', `${f[0]} durumunda doğru ilk yardım hangisidir?`, f[1], wrongFrom(r, FIRST_AID.map(x => x[1]), f[1])); },
  takip: r => { const v = r.pick([40, 50, 60, 70, 80, 90, 100, 110, 120]); return Q(`takip:${v}`, 'Trafik', `"Hızın yarısı kadar metre" kuralına göre ${v} km/s hızda en az takip mesafesi?`, `${v / 2} m`, [`${v} m`, `${v / 4} m`, `${v / 2 + 20} m`]); },
  yakit: r => { const l = r.pick([5, 6, 7, 8, 9]), km = r.pick([150, 200, 250, 300, 350, 400, 450]); const v = l * km / 100; return Q(`yakit:${l}:${km}`, 'Trafik', `100 km'de ${l} L yakan araç ${km} km yolda kaç L yakar?`, `${dec(v)} L`, [`${dec(v * 2)} L`, `${dec(v + l)} L`, `${dec(km / l)} L`].filter(x => x !== `${dec(v)} L`)); },
  // Ustalık
  alet: r => { const t = r.pick(TOOLS); return Q(`alet:${t[0]}`, 'Alet Bilgisi', `${t[0]} ne işe yarar?`, t[1], wrongFrom(r, TOOLS.map(x => x[1]), t[1])); },
  aletTers: r => { const t = r.pick(TOOLS); return Q(`aletT:${t[0]}`, 'Alet Bilgisi', `"${t[1]}" — hangi aletin işidir?`, t[0], wrongFrom(r, TOOLS.map(x => x[0]), t[0])); },
  terim: r => { const t = r.pick(TRADE_TERMS); return Q(`terim:${t[0]}`, 'Meslek Bilgisi', `"${t[0]}" ne demektir?`, t[1], wrongFrom(r, TRADE_TERMS.map(x => x[1]), t[1])); },
  ohm: r => { const R = r.pick([2, 4, 5, 10, 11, 20, 22, 44]), I = r.pick([1, 2, 5, 10]); const V = R * I; const t = r.int(0, 2);
    if (t === 0) return Q(`ohmV:${R}:${I}`, 'Elektrik', `${R} Ω dirençten ${I} A akım geçiyor. Gerilim?`, `${V} V`, [`${R + I} V`, `${dec(R / I)} V`, `${V * 2} V`].filter(x => x !== `${V} V`), 'V = I × R');
    if (t === 1) return Q(`ohmI:${R}:${V}`, 'Elektrik', `${V} V gerilimde ${R} Ω direnç. Akım?`, `${I} A`, [`${V * R} A`, `${I * 2} A`, `${I + 3} A`], 'I = V / R');
    return Q(`ohmR:${V}:${I}`, 'Elektrik', `${V} V gerilimde ${I} A akım çeken yükün direnci?`, `${R} Ω`, [`${V * I} Ω`, `${R * 2} Ω`, `${R + 5} Ω`], 'R = V / I'); },
  guc: r => { const W = r.pick([1100, 2200, 3300, 4400, 660, 1320]); const I = W / 220; return Q(`guc:${W}`, 'Elektrik', `220 V şebekede ${W} W cihaz yaklaşık kaç amper çeker?`, `${dec(I)} A`, [`${dec(I * 2)} A`, `${dec(I / 2)} A`, `${dec(I + 4)} A`], 'P = V × I'); },
  boya: r => { const a = r.pick([3, 4, 5, 6]), b = r.pick([2.5, 3]), kat = r.pick([1, 2]), verim = 10; const v = a * b * kat / verim; return Q(`boya:${a}:${b}:${kat}`, 'Boya', `${a} m × ${dec(b)} m duvar ${kat} kat boyanacak. 1 L boya 10 m² boyuyorsa kaç L gerekir?`, `${dec(v)} L`, [`${dec(v * 2)} L`, `${dec(v + 1)} L`, `${dec(v + 0.5)} L`]); },
  fayans: r => { const a = r.pick([2, 3, 4, 5]), b = r.pick([2, 3, 4]), f = r.pick([0.5, 0.25]); const n = a * b / (f * f); return Q(`fayans:${a}:${b}:${f}`, 'İnşaat', `${a} m × ${b} m zemine ${f * 100}×${f * 100} cm fayans döşenecek. Kaç adet gerekir (fire hariç)?`, n, [String(n / 2), String(a * b * 4), String(n + a * b)].filter(x => x !== String(n))); },
  beton: r => { const a = r.pick([3, 4, 5, 6]), b = r.pick([3, 4, 5]), h = r.pick([0.1, 0.12, 0.15, 0.2]); const v = a * b * h; return Q(`beton:${a}:${b}:${h}`, 'İnşaat', `${a} m × ${b} m, ${dec(h * 100)} cm kalınlıkta döşeme için kaç m³ beton gerekir?`, `${dec(v)} m³`, [`${dec(v * 10)} m³`, `${dec(a * b)} m³`, `${dec(v * 2)} m³`]); },
};

// Seviye → üreticiler (ağırlıklar tekrar yazılarak verilir)
const BY_LEVEL = {
  ilkokul: [M.topla, M.cikar, M.carpim, M.problem, M.basamak, M.bolme, T.esAnlam, T.zitAnlam, T.atasozu, T.gezegen, T.bolge],
  ortaokul: [M.bolme, M.yuzde, M.ebob, M.ekok, M.kesir, M.tamsayi, M.alan, M.us, M.karekok, M.ortalama, M.oran,
    T.baskent, T.bolge, T.ingTr, T.trIng, T.esAnlam, T.zitAnlam, T.atasozu, T.element, T.organ, T.tarih, T.gezegen],
  lise: [M.denklem, M.kok, M.log, M.fonk, M.dizi, M.olasilik, M.pisagor, M.aci, M.kombin, M.zam, M.us,
    T.baskent, T.baskentTers, T.ingTr, T.trIng, T.element, T.elementNo, T.eser, T.tarih, T.tarihSira, T.organ, T.birim],
  genel: [M.yuzde, M.zam, M.faiz, M.denklem, M.olasilik, M.ortalama,
    T.baskent, T.baskentTers, T.para, T.plaka, T.eser, T.tarih, T.tarihSira, T.atasozu, T.ingTr, T.birim, T.organ],
  tip: [P.etkenGrup, P.etken, P.ilacSinif, P.ilacTers, P.lab, P.lab, P.vitamin, P.bulgu, P.dozKilo, P.surup, P.infuzyon, P.vki, T.organ],
  ehliyet: [P.levha, P.levha, P.levhaTers, P.parca, P.parcaTers, P.ilkYardim, P.ilkYardim, P.takip, P.yakit],
  usta: [P.alet, P.aletTers, P.terim, P.terim, P.ohm, P.guc, P.boya, P.fayans, P.beton],
};
export const genLevels = Object.keys(BY_LEVEL);

// Bir soru üret; `avoid` içindeki kimlikleri atlamaya çalışır.
export function genQuestion(r, level, avoid) {
  const gens = BY_LEVEL[level] || BY_LEVEL.ortaokul;
  let q;
  const ok = x => x.a.length === 4 && new Set(x.a).size === 4 && !x.a.some(v => v === '' || /undefined|NaN/.test(v));
  for (let i = 0; i < 30; i++) {
    const c = r.pick(gens)(r);
    if (!ok(c)) continue;
    q = c;
    if (!avoid || !avoid.has(q.id)) break;
  }
  if (!q) q = M.topla(r);
  // Şıklar tamamlanmamışsa (tablo küçükse) sayısal doldur
  q.l = level;
  return q;
}
