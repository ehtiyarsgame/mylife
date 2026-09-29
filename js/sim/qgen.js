// Veri tablolarından ve formüllerden soru üretir. Her soru kalıcı bir kimlik taşır (tekrar kontrolü için).
// Sorular oyuncunun dilinde üretilir: L(tr, en) kalıbı seçer, tablo hücreleri D() ile sözlükten çevrilir.
import { COUNTRIES, ENGLISH, SYNONYMS, ANTONYMS, ELEMENTS, WORKS, HISTORY, PROVERBS, BIO, UNITS, PLANETS,
  EN_SYNONYMS, EN_ANTONYMS, EN_IDIOMS, SPANISH,
  DISEASES, DRUGS, LABS, VITAMINS, SYMPTOMS, SIGNS, CAR_PARTS, FIRST_AID, TOOLS, TRADE_TERMS } from './qdata.js';
import { lang, T, locale } from '../core/i18n.js';

const TR = () => lang === 'tr';
const L = (tr, en) => (TR() ? tr : en);
const D = x => (TR() ? x : T(x));                 // tablo hücresi
const DS = arr => arr.map(D);
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
const dec = v => { const s = String(Math.round(v * 100) / 100); return TR() ? s.replace('.', ',') : s; };
const num = v => Number(v).toLocaleString(locale());
// Türkçe tamlayan eki: Fransa'nın, Türkiye'nin, Can'ın, Ürdün'ün
export function genitive(w) {
  const v = [...w.toLocaleLowerCase('tr')].reverse().find(c => 'aeıioöuü'.includes(c)) || 'e';
  const h = { a: 'ı', ı: 'ı', o: 'u', u: 'u', e: 'i', i: 'i', ö: 'ü', ü: 'ü' }[v];
  const endsV = 'aeıioöuü'.includes(w.slice(-1).toLocaleLowerCase('tr'));
  return `${w}'${endsV ? 'n' : ''}${h}n`;
}
const MAT = () => L('Matematik', 'Math');

// ——— Matematik ———
const M = {
  topla: r => { const a = r.int(12, 89), b = r.int(8, 60); return Q(`topla:${a}:${b}`, MAT(), `${a} + ${b} = ?`, a + b, wrongNum(r, a + b)); },
  cikar: r => { const a = r.int(30, 99), b = r.int(5, a - 3); return Q(`cikar:${a}:${b}`, MAT(), `${a} − ${b} = ?`, a - b, wrongNum(r, a - b)); },
  carpim: r => { const a = r.int(2, 9), b = r.int(2, 10); return Q(`carpim:${a}:${b}`, MAT(), `${a} × ${b} = ?`, a * b, wrongNum(r, a * b, [-a, a, -b, b, 1, -1])); },
  problem: r => {
    const a = r.int(12, 40), b = r.int(3, a - 4), c = r.int(2, 15);
    if (TR()) {
      const n = r.pick(['Ali', 'Elif', 'Can', 'Zeynep', 'Mert', 'Ayşe', 'Umut', 'Deniz']), its = r.pick(['cevizi', 'bilyesi', 'kalemi', 'çıkartması', 'elması', 'misketi']);
      return Q(`problem:${a}:${b}:${c}`, MAT(), `${genitive(n)} ${a} ${its} vardı. ${b} tanesini arkadaşına verdi, sonra ${c} tane daha aldı. Kaç ${its} oldu?`, a - b + c, wrongNum(r, a - b + c), 'Önce çıkar, sonra ekle.');
    }
    const n = r.pick(['Sam', 'Mia', 'Leo', 'Nora', 'Omar', 'Ava', 'Kai', 'Lina']), it = r.pick(['marbles', 'stickers', 'pencils', 'apples', 'walnuts', 'cards']);
    return Q(`problem:${a}:${b}:${c}`, MAT(), `${n} had ${a} ${it}. They gave ${b} to a friend, then got ${c} more. How many ${it} do they have now?`, a - b + c, wrongNum(r, a - b + c), 'Subtract first, then add.');
  },
  basamak: r => {
    const d = [r.int(1, 9), r.int(1, 9), r.int(1, 9), r.int(1, 9)], n = d.join(''), i = r.int(0, 3), val = d[i] * 10 ** (3 - i);
    const pool = [d[i], d[i] * 10, d[i] * 100, d[i] * 1000].filter(v => v !== val);
    return Q(`basamak:${n}:${i}`, MAT(), L(`${num(n)} sayısında ${i + 1}. soldaki rakamın basamak değeri kaçtır?`, `In ${num(n)}, what is the place value of digit number ${i + 1} from the left?`), val, pool.map(String), L('Birler, onlar, yüzler, binler.', 'Ones, tens, hundreds, thousands.'));
  },
  bolme: r => { const b = r.int(3, 12), a = r.int(3, 15); return Q(`bolme:${a * b}:${b}`, MAT(), `${a * b} ÷ ${b} = ?`, a, wrongNum(r, a, [-2, -1, 1, 2, 3])); },
  yuzde: r => { const p = r.pick([5, 10, 15, 20, 25, 30, 40, 50, 75]), n = r.pick([40, 60, 80, 120, 160, 200, 240, 300, 400, 500]); return Q(`yuzde:${n}:${p}`, MAT(), L(`${n} sayısının %${p}'i kaçtır?`, `What is ${p}% of ${n}?`), n * p / 100, wrongNum(r, n * p / 100, [-10, -5, 5, 10, 2, -2])); },
  ebob: r => { const g = r.int(2, 9), a = g * r.int(2, 7), b = g * r.int(2, 7); const e = gcd(a, b); if (a === b) return M.ekok(r); return Q(`ebob:${a}:${b}`, MAT(), L(`EBOB(${a}, ${b}) = ?`, `GCD(${a}, ${b}) = ?`), e, wrongNum(r, e, [-1, 1, 2, -2, e]), L('Ortak bölenlerin en büyüğü.', 'The greatest common divisor.')); },
  ekok: r => { const a = r.int(3, 12), b = r.int(3, 12); const k = a * b / gcd(a, b); return Q(`ekok:${a}:${b}`, MAT(), L(`EKOK(${a}, ${b}) = ?`, `LCM(${a}, ${b}) = ?`), k, uniq([a * b === k ? k + a : a * b, k + a, k - b > 0 ? k - b : k + 2 * b, k * 2], k), L('Ortak katların en küçüğü.', 'The least common multiple.')); },
  kesir: r => { const d = r.pick([4, 5, 6, 8, 10, 12]), a = r.int(1, d - 2), b = r.int(1, d - a - 1); return Q(`kesir:${a}:${b}:${d}`, MAT(), `${a}/${d} + ${b}/${d} = ?`, `${a + b}/${d}`, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`], L('Paydalar eşitse paylar toplanır.', 'With equal denominators, add the numerators.')); },
  tamsayi: r => { const a = r.int(-20, -2), b = r.int(3, 25); const op = r.pick(['+', '×']); const v = op === '+' ? a + b : a * b; return Q(`tamsayi:${a}:${op}:${b}`, MAT(), `(${a}) ${op} ${b} = ?`, v, [String(-v), ...wrongNum(r, v)].filter(x => x !== String(v)), L('İşaret kuralına dikkat.', 'Watch the sign rules.')); },
  alan: r => { const a = r.int(3, 15), b = r.int(3, 15); const area = r.chance(0.5); const v = area ? a * b : 2 * (a + b);
    return Q(`dikdortgen:${area ? 'alan' : 'çevre'}:${a}:${b}`, MAT(), L(`Kenarları ${a} cm ve ${b} cm olan dikdörtgenin ${area ? 'alanı' : 'çevresi'}?`, `The ${area ? 'area' : 'perimeter'} of a ${a} cm × ${b} cm rectangle?`), v, [String(area ? 2 * (a + b) : a * b), String(a + b), String(v + 2)].filter(x => x !== String(v))); },
  us: r => { const a = r.int(2, 6), b = r.int(2, 4); return Q(`us:${a}:${b}`, MAT(), `${a}^${b} = ?`, a ** b, [String(a * b), String(a ** (b + 1)), String(a ** b + a)]); },
  karekok: r => { const a = r.int(4, 20); return Q(`karekok:${a}`, MAT(), `√${a * a} = ?`, a, wrongNum(r, a, [-2, -1, 1, 2])); },
  ortalama: r => { const xs = [r.int(40, 100), r.int(40, 100), r.int(40, 100)]; const s = xs.reduce((x, y) => x + y); const extra = (3 - s % 3) % 3; xs[0] += extra; const avg = (s + extra) / 3; return Q(`ort:${xs.join(':')}`, MAT(), L(`${xs.join(', ')} notlarının ortalaması?`, `The average of the grades ${xs.join(', ')}?`), avg, wrongNum(r, avg, [-3, -2, 2, 3, 5])); },
  oran: r => { const a = r.int(2, 5), b = r.int(2, 5), k = r.int(3, 9); if (a === b) return M.us(r); return Q(`oran:${a}:${b}:${k}`, MAT(), L(`Kız/erkek oranı ${a}/${b}. ${a * k} kız varsa kaç erkek vardır?`, `The girl/boy ratio is ${a}/${b}. If there are ${a * k} girls, how many boys are there?`), b * k, wrongNum(r, b * k, [-k, k, -1, 1, 2])); },
  denklem: r => { const x = r.int(-6, 14), a = r.int(2, 9), b = r.int(-15, 20); const rhs = a * x + b; return Q(`denk:${a}:${b}:${x}`, MAT(), L(`${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${rhs} ise x = ?`, `If ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${rhs}, x = ?`), x, wrongNum(r, x, [-2, -1, 1, 2, 3])); },
  kok: r => { const p = r.int(-6, 8), q = r.int(-6, 8); const s = p + q, m = p * q; const f = `x² ${s > 0 ? '−' : '+'} ${Math.abs(s)}x ${m < 0 ? '−' : '+'} ${Math.abs(m)} = 0`; const sum = r.chance(0.5); const v = sum ? s : m;
    return Q(`kok:${p}:${q}:${sum ? 'toplamı' : 'çarpımı'}`, MAT(), L(`${f} denkleminin kökleri ${sum ? 'toplamı' : 'çarpımı'} kaçtır?`, `What is the ${sum ? 'sum' : 'product'} of the roots of ${f}?`), v, [String(-v), ...wrongNum(r, v)].filter(x => x !== String(v)), L('Vieta: toplam −b/a, çarpım c/a.', 'Vieta: sum −b/a, product c/a.')); },
  log: r => { const b = r.pick([2, 3, 5, 10]), e = r.int(1, b === 10 ? 4 : b === 2 ? 7 : 4); return Q(`log:${b}:${e}`, MAT(), `log${b === 10 ? '' : '_' + b}(${b ** e}) = ?`, e, wrongNum(r, e, [-1, 1, 2, -2, b])); },
  fonk: r => { const a = r.int(2, 7), b = r.int(-9, 9), c = r.int(-3, 6); const v = a * c * c + b; return Q(`fonk:${a}:${b}:${c}`, MAT(), L(`f(x) = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)} ise f(${c}) = ?`, `If f(x) = ${a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}, f(${c}) = ?`), v, wrongNum(r, v, [-a, a, -2, 2, 1, -1])); },
  dizi: r => { const a1 = r.int(-5, 12), d = r.int(2, 9), n = r.int(6, 25); const v = a1 + (n - 1) * d; return Q(`dizi:${a1}:${d}:${n}`, MAT(), L(`İlk terimi ${a1}, ortak farkı ${d} olan aritmetik dizinin ${n}. terimi?`, `An arithmetic sequence starts at ${a1} with common difference ${d}. What is term ${n}?`), v, [String(a1 + n * d), String(a1 + (n - 2) * d), String(v + 1)], 'aₙ = a₁ + (n−1)d'); },
  olasilik: r => { const k = r.int(2, 6), m = r.int(2, 8), total = k + m; const g = gcd(k, total); return Q(`olas:${k}:${m}`, MAT(), L(`Torbada ${k} kırmızı, ${m} mavi top var. Rastgele çekilen topun kırmızı olma olasılığı?`, `A bag has ${k} red and ${m} blue balls. What is the probability of drawing a red one?`), `${k / g}/${total / g}`, uniq([`${m / gcd(m, total)}/${total / gcd(m, total)}`, `${k}/${m}`, `1/${total}`], `${k / g}/${total / g}`), L('İstenen / tüm durumlar', 'Favorable / all outcomes')); },
  pisagor: r => { const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29]]); return Q(`pis:${a}:${b}`, MAT(), L(`Dik kenarları ${a} ve ${b} olan dik üçgenin hipotenüsü?`, `A right triangle has legs ${a} and ${b}. The hypotenuse?`), c, [String(a + b), String(c + 1), String(c - 2)]); },
  aci: r => { const a = r.int(25, 90), b = r.int(20, 150 - a); return Q(`aci:${a}:${b}`, MAT(), L(`Bir üçgenin iki açısı ${a}° ve ${b}°. Üçüncü açı?`, `Two angles of a triangle are ${a}° and ${b}°. The third angle?`), 180 - a - b, wrongNum(r, 180 - a - b, [-10, 10, -5, 5, 20])); },
  kombin: r => { const n = r.int(4, 12); const v = n * (n - 1) / 2; return Q(`komb:${n}`, MAT(), L(`${n} kişilik bir grupta herkes birbiriyle bir kez tokalaşırsa kaç tokalaşma olur?`, `In a group of ${n}, everyone shakes hands with everyone else once. How many handshakes?`), v, [String(n * (n - 1)), String(n * 2), String(v + n)], 'C(n,2) = n(n−1)/2'); },
  zam: r => { const p = r.int(4, 40) * 50, z = r.pick([10, 20, 25, 30, 50]), i = r.pick([10, 20, 25]); const v = p * (1 + z / 100) * (1 - i / 100); if (v % 1) return M.yuzde(r);
    return Q(`zam:${p}:${z}:${i}`, MAT(), L(`${p} 🪙'luk ürüne önce %${z} zam, sonra %${i} indirim yapıldı. Son fiyat?`, `An item costing ${p} 🪙 gets a ${z}% price increase, then a ${i}% discount. Final price?`), v, [String(p * (1 + (z - i) / 100)), String(p), String(v + 50)].filter(x => x !== String(v)), L('Yüzdeler art arda uygulanır.', 'Percentages apply one after another.')); },
  faiz: r => { const a = r.int(2, 20) * 1000, f = r.pick([10, 20, 25, 40, 50]); const v = a * (1 + 2 * f / 100);
    return Q(`faiz:${a}:${f}`, MAT(), L(`${a} 🪙, yıllık %${f} basit faizle 2 yılda toplam kaç 🪙 olur?`, `${a} 🪙 at ${f}% simple yearly interest: how much after 2 years?`), v, [String(a * (1 + f / 100)), String(a * (1 + f / 100) ** 2), String(a * 2)].filter(x => x !== String(v))); },
};

// ——— Sözel / Fen tabloları ———
const TT = {
  baskent: r => { const c = r.pick(COUNTRIES); return Q(`baskent:${c[0]}`, L('Coğrafya', 'Geography'), L(`${genitive(c[0])} başkenti neresidir?`, `What is the capital of ${D(c[0])}?`), D(c[1]), wrongFrom(r, DS(COUNTRIES.map(x => x[1])), D(c[1]))); },
  baskentTers: r => { const c = r.pick(COUNTRIES); return Q(`baskentT:${c[1]}`, L('Coğrafya', 'Geography'), L(`${c[1]} hangi ülkenin başkentidir?`, `${D(c[1])} is the capital of which country?`), D(c[0]), wrongFrom(r, DS(COUNTRIES.map(x => x[0])), D(c[0]))); },
  para: r => { const c = r.pick(COUNTRIES.filter(x => !['Euro', 'Dolar', 'Peso', 'Dinar', 'Riyal', 'Manat', 'Som', 'Rupi', 'Kron', 'Lira'].includes(x[3]))); return Q(`para:${c[0]}`, L('Genel Kültür', 'General Knowledge'), L(`${genitive(c[0])} para birimi hangisidir?`, `What is the currency of ${D(c[0])}?`), D(c[3]), wrongFrom(r, DS(COUNTRIES.map(x => x[3])), D(c[3]))); },
  // Yabancı dil: Türk oyuncuya İngilizce, İngilizce oyuncuya İspanyolca
  yabanci: r => {
    if (TR()) { const e = r.pick(ENGLISH); return r.chance(0.5)
      ? Q(`ing:${e[0]}`, 'İngilizce', `"${e[0]}" kelimesinin Türkçesi nedir?`, e[1], wrongFrom(r, ENGLISH.map(x => x[1]), e[1]))
      : Q(`ingT:${e[1]}`, 'İngilizce', `"${e[1]}" kelimesinin İngilizcesi nedir?`, e[0], wrongFrom(r, ENGLISH.map(x => x[0]), e[0])); }
    const e = r.pick(SPANISH); return r.chance(0.5)
      ? Q(`es:${e[0]}`, 'Spanish', `What does the Spanish word "${e[0]}" mean?`, e[1], wrongFrom(r, SPANISH.map(x => x[1]), e[1]))
      : Q(`esT:${e[1]}`, 'Spanish', `How do you say "${e[1]}" in Spanish?`, e[0], wrongFrom(r, SPANISH.map(x => x[0]), e[0]));
  },
  esAnlam: r => { const S = TR() ? SYNONYMS : EN_SYNONYMS; const e = r.pick(S); return Q(`syn:${e[0]}`, L('Türkçe', 'English'), L(`"${e[0]}" kelimesinin eş anlamlısı hangisidir?`, `Which word is a synonym of "${e[0]}"?`), e[1], wrongFrom(r, S.map(x => x[1]), e[1])); },
  zitAnlam: r => { const S = TR() ? ANTONYMS : EN_ANTONYMS; const e = r.pick(S); return Q(`ant:${e[0]}`, L('Türkçe', 'English'), L(`"${e[0]}" kelimesinin zıt anlamlısı hangisidir?`, `Which word is the opposite of "${e[0]}"?`), e[1], wrongFrom(r, S.map(x => x[1]), e[1])); },
  atasozu: r => { const S = TR() ? PROVERBS : EN_IDIOMS; const p = r.pick(S); return Q(`atasozu:${p[0]}`, L('Türkçe', 'English'), L(`"${p[0]} …" atasözünü tamamla.`, `Complete the saying: "${p[0]} …"`), p[1], p[2]); },
  element: r => { const e = r.pick(ELEMENTS); return Q(`elem:${e[0]}`, L('Kimya', 'Chemistry'), L(`${e[0]} elementinin sembolü hangisidir?`, `What is the symbol of ${D(e[0])}?`), e[1], wrongFrom(r, ELEMENTS.map(x => x[1]), e[1])); },
  elementNo: r => { const e = r.pick(ELEMENTS); return Q(`elemNo:${e[0]}`, L('Kimya', 'Chemistry'), L(`Atom numarası ${e[2]} olan element hangisidir?`, `Which element has atomic number ${e[2]}?`), D(e[0]), wrongFrom(r, DS(ELEMENTS.slice().sort((x, y) => Math.abs(x[2] - e[2]) - Math.abs(y[2] - e[2])).slice(1, 6).map(x => x[0])), D(e[0]))); },
  eser: r => { const w = r.pick(WORKS); return Q(`eser:${w[0]}`, L('Edebiyat', 'Literature'), L(`"${w[0]}" kimin eseridir?`, `Who wrote "${D(w[0])}"?`), D(w[1]), wrongFrom(r, DS(WORKS.map(x => x[1])), D(w[1]))); },
  tarih: r => { const e = r.pick(HISTORY); const yr = y => (y < 0 ? L(`MÖ ${-y}`, `${-y} BC`) : String(y));
    return Q(`tarih:${e[0]}`, L('Tarih', 'History'), L(`${e[0]} hangi yılda gerçekleşti?`, `In what year did this happen: ${D(e[0])}?`), yr(e[1]), uniq([e[1] + r.pick([-3, -2, -1]), e[1] + r.pick([1, 2, 4]), e[1] + r.pick([-11, 10, 25, -30])], e[1]).map(Number).map(yr)); },
  tarihSira: r => { const [a, b] = r.shuffle(HISTORY.filter(x => x[1] > 1400)).slice(0, 2); if (a[1] === b[1]) return TT.tarih(r); const first = a[1] < b[1] ? a : b; const second = first === a ? b : a;
    return Q(`sira:${first[0]}:${second[0]}`, L('Tarih', 'History'), L('Hangisi daha ÖNCE gerçekleşmiştir?', 'Which happened EARLIER?'), D(first[0]), [D(second[0]), ...wrongFrom(r, DS(HISTORY.filter(x => x[1] > second[1]).map(x => x[0])), D(first[0])).slice(0, 2)]); },
  organ: r => { const o = r.pick(BIO); return Q(`bio:${o[0]}`, L('Biyoloji', 'Biology'), L(`"${o[1]}" — bu görev hangisine aittir?`, `"${D(o[1])}" — which one does this?`), D(o[0]), wrongFrom(r, DS(BIO.map(x => x[0])), D(o[0]))); },
  birim: r => { const u = r.pick(UNITS); return Q(`birim:${u[0]}`, L('Fizik', 'Physics'), L(`${u[0]} büyüklüğünün SI birimi hangisidir?`, `What is the SI unit of ${D(u[0]).toLowerCase()}?`), D(u[1]), wrongFrom(r, DS(UNITS.map(x => x[1])), D(u[1]))); },
  gezegen: r => { const i = r.int(0, 7); const sira = L(['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı', 'yedinci', 'sekizinci'], ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'])[i];
    return Q(`gez:${i}`, L('Fen', 'Science'), L(`Güneş'e uzaklık sırasına göre ${sira} gezegen hangisidir?`, `Which is the ${sira} planet from the Sun?`), D(PLANETS[i]), wrongFrom(r, DS(PLANETS), D(PLANETS[i]))); },
};

// ——— Meslek sınavları ———
const P = {
  // Tıp
  etkenGrup: r => { const d = r.pick(DISEASES); return Q(`etkenG:${d[0]}`, L('Tıp', 'Medicine'), L(`${d[0]} hastalığının etkeni hangi gruptandır?`, `What type of pathogen causes ${D(d[0])}?`), D(d[1]), DS(['Bakteri', 'Virüs', 'Mantar', 'Parazit'].filter(x => x !== d[1]))); },
  etken: r => { const d = r.pick(DISEASES); return Q(`etken:${d[0]}`, L('Tıp', 'Medicine'), L(`${d[0]} hastalığının etkeni hangisidir?`, `What causes ${D(d[0])}?`), D(d[2]), wrongFrom(r, DS(DISEASES.map(x => x[2])), D(d[2]))); },
  ilacSinif: r => { const d = r.pick(DRUGS); return Q(`ilac:${d[0]}`, L('Farmakoloji', 'Pharmacology'), L(`${d[0]} hangi ilaç grubundandır?`, `Which drug class does ${D(d[0])} belong to?`), D(d[1]), wrongFrom(r, DS(DRUGS.map(x => x[1])), D(d[1]))); },
  ilacTers: r => { const d = r.pick(DRUGS); return Q(`ilacT:${d[0]}`, L('Farmakoloji', 'Pharmacology'), L(`Hangisi bir "${d[1]}" ilacıdır?`, `Which of these is a "${D(d[1])}" drug?`), D(d[0]), wrongFrom(r, DS(DRUGS.filter(x => x[1] !== d[1]).map(x => x[0])), D(d[0]))); },
  lab: r => { const l = r.pick(LABS); return Q(`lab:${l[0]}`, L('Tıp', 'Medicine'), L(`${l[0]} için normal aralık hangisidir?`, `What is the normal range for ${D(l[0]).toLowerCase()}?`), D(l[1]), DS(l[2])); },
  vitamin: r => { const v = r.pick(VITAMINS); return r.chance(0.5)
    ? Q(`vit:${v[0]}`, L('Tıp', 'Medicine'), L(`${v[0]} eksikliği hangi tabloya yol açar?`, `A lack of ${D(v[0])} leads to what?`), D(v[1]), wrongFrom(r, DS(VITAMINS.map(x => x[1])), D(v[1])))
    : Q(`vitT:${v[1]}`, L('Tıp', 'Medicine'), L(`${v[1]} hangi eksiklikte görülür?`, `${D(v[1])} is caused by a lack of what?`), D(v[0]), wrongFrom(r, DS(VITAMINS.map(x => x[0])), D(v[0]))); },
  bulgu: r => { const b = r.pick(SYMPTOMS); return Q(`bulgu:${b[0]}`, L('Tıp', 'Medicine'), L(`"${b[0]}" öncelikle hangi organ/sistemi düşündürür?`, `"${D(b[0])}" points first to which organ/system?`), D(b[1]), wrongFrom(r, DS(SYMPTOMS.map(x => x[1])), D(b[1]))); },
  dozKilo: r => { const mg = r.pick([5, 10, 15, 20]), kg = r.int(8, 40) * 2; const v = mg * kg; return Q(`doz:${mg}:${kg}`, L('Farmakoloji', 'Pharmacology'), L(`Çocuk hastaya ${mg} mg/kg ilaç verilecek. Hasta ${kg} kg. Toplam doz?`, `A child needs ${mg} mg/kg of a drug and weighs ${kg} kg. Total dose?`), `${v} mg`, [`${v * 2} mg`, `${mg + kg} mg`, `${Math.round(v / 2)} mg`]); },
  surup: r => { const c = r.pick([125, 250]), want = c * r.pick([0.4, 0.6, 0.8, 1.2, 1.6, 2]); const ml = want / c * 5; return Q(`surup:${c}:${want}`, L('Farmakoloji', 'Pharmacology'), L(`Şurubun 5 mL'sinde ${c} mg etken madde var. ${want} mg için kaç mL verilir?`, `A syrup has ${c} mg per 5 mL. How many mL for ${want} mg?`), `${dec(ml)} mL`, [`${dec(ml * 2)} mL`, `${dec(ml / 2)} mL`, `${dec(ml + 2.5)} mL`], L('Orantı kur: 5 mL → ', 'Set up a ratio: 5 mL → ') + c + ' mg'); },
  infuzyon: r => { const vol = r.pick([500, 1000, 1500, 2000]), h = r.pick([4, 5, 8, 10, 12, 20]); const v = vol / h; if (v % 1) return P.dozKilo(r); const u = L('mL/sa', 'mL/h'); return Q(`inf:${vol}:${h}`, L('Hemşirelik', 'Nursing'), L(`${vol} mL serum ${h} saatte verilecek. Saatte kaç mL gitmeli?`, `${vol} mL of IV fluid over ${h} hours. How many mL per hour?`), `${v} ${u}`, [`${v * 2} ${u}`, `${Math.round(v / 2)} ${u}`, `${v + 25} ${u}`]); },
  vki: r => { const boy = r.pick([1.5, 1.6, 1.7, 1.8, 2.0]), vki = r.int(17, 34); const kg = Math.round(vki * boy * boy); const v = kg / (boy * boy); const cats = L(['Zayıf', 'Normal', 'Fazla kilolu', 'Obez'], ['Underweight', 'Normal', 'Overweight', 'Obese']); const cat = cats[v < 18.5 ? 0 : v < 25 ? 1 : v < 30 ? 2 : 3];
    return Q(`vki:${boy}:${kg}`, L('Tıp', 'Medicine'), L(`Boyu ${dec(boy)} m, kilosu ${kg} kg olan erişkinin VKİ sınıfı?`, `An adult is ${dec(boy)} m tall and weighs ${kg} kg. BMI category?`), cat, cats.filter(x => x !== cat), L('VKİ = kg / boy²', 'BMI = kg / height²')); },
  // Ehliyet
  levha: r => { const l = r.pick(SIGNS); return Q(`levha:${l[0]}`, L('Trafik İşaretleri', 'Road Signs'), L(`${l[0]} ne anlama gelir?`, `What does this mean: ${D(l[0]).toLowerCase()}?`), D(l[1]), wrongFrom(r, DS(SIGNS.map(x => x[1])), D(l[1]))); },
  levhaTers: r => { const l = r.pick(SIGNS); return Q(`levhaT:${l[1]}`, L('Trafik İşaretleri', 'Road Signs'), L(`"${l[1]}" hangi levhayla gösterilir?`, `Which sign means "${D(l[1])}"?`), D(l[0]), wrongFrom(r, DS(SIGNS.map(x => x[0])), D(l[0]))); },
  parca: r => { const p = r.pick(CAR_PARTS); return Q(`parca:${p[0]}`, L('Motor', 'Vehicle'), L(`${p[0]} ne işe yarar?`, `What does the ${D(p[0]).toLowerCase()} do?`), D(p[1]), wrongFrom(r, DS(CAR_PARTS.map(x => x[1])), D(p[1]))); },
  parcaTers: r => { const p = r.pick(CAR_PARTS); return Q(`parcaT:${p[0]}`, L('Motor', 'Vehicle'), L(`"${p[1]}" — bu görev hangi parçaya aittir?`, `"${D(p[1])}" — which part does this?`), D(p[0]), wrongFrom(r, DS(CAR_PARTS.map(x => x[0])), D(p[0]))); },
  ilkYardim: r => { const f = r.pick(FIRST_AID); return Q(`iy:${f[0]}`, L('İlk Yardım', 'First Aid'), L(`${f[0]} durumunda doğru ilk yardım hangisidir?`, `What is the right first aid for: ${D(f[0]).toLowerCase()}?`), D(f[1]), wrongFrom(r, DS(FIRST_AID.map(x => x[1])), D(f[1]))); },
  takip: r => { const v = r.pick([40, 50, 60, 70, 80, 90, 100, 110, 120]); return Q(`takip:${v}`, L('Trafik', 'Traffic'), L(`"Hızın yarısı kadar metre" kuralına göre ${v} km/s hızda en az takip mesafesi?`, `By the "half your speed in meters" rule, what is the minimum following distance at ${v} km/h?`), `${v / 2} m`, [`${v} m`, `${v / 4} m`, `${v / 2 + 20} m`]); },
  yakit: r => { const l = r.pick([5, 6, 7, 8, 9]), km = r.pick([150, 200, 250, 300, 350, 400, 450]); const v = l * km / 100; return Q(`yakit:${l}:${km}`, L('Trafik', 'Traffic'), L(`100 km'de ${l} L yakan araç ${km} km yolda kaç L yakar?`, `A car uses ${l} L per 100 km. How much fuel for ${km} km?`), `${dec(v)} L`, [`${dec(v * 2)} L`, `${dec(v + l)} L`, `${dec(km / l)} L`].filter(x => x !== `${dec(v)} L`)); },
  // Ustalık
  alet: r => { const t = r.pick(TOOLS); return Q(`alet:${t[0]}`, L('Alet Bilgisi', 'Tools'), L(`${t[0]} ne işe yarar?`, `What is a ${D(t[0]).toLowerCase()} used for?`), D(t[1]), wrongFrom(r, DS(TOOLS.map(x => x[1])), D(t[1]))); },
  aletTers: r => { const t = r.pick(TOOLS); return Q(`aletT:${t[0]}`, L('Alet Bilgisi', 'Tools'), L(`"${t[1]}" — hangi aletin işidir?`, `"${D(t[1])}" — which tool does this?`), D(t[0]), wrongFrom(r, DS(TOOLS.map(x => x[0])), D(t[0]))); },
  terim: r => { const t = r.pick(TRADE_TERMS); return Q(`terim:${t[0]}`, L('Meslek Bilgisi', 'Trade Knowledge'), L(`"${t[0]}" ne demektir?`, `What does "${D(t[0])}" mean?`), D(t[1]), wrongFrom(r, DS(TRADE_TERMS.map(x => x[1])), D(t[1]))); },
  ohm: r => { const R = r.pick([2, 4, 5, 10, 11, 20, 22, 44]), I = r.pick([1, 2, 5, 10]); const V = R * I; const t = r.int(0, 2); const E = L('Elektrik', 'Electrical');
    if (t === 0) return Q(`ohmV:${R}:${I}`, E, L(`${R} Ω dirençten ${I} A akım geçiyor. Gerilim?`, `${I} A flows through a ${R} Ω resistor. Voltage?`), `${V} V`, [`${R + I} V`, `${dec(R / I)} V`, `${V * 2} V`].filter(x => x !== `${V} V`), 'V = I × R');
    if (t === 1) return Q(`ohmI:${R}:${V}`, E, L(`${V} V gerilimde ${R} Ω direnç. Akım?`, `A ${R} Ω resistor at ${V} V. Current?`), `${I} A`, [`${V * R} A`, `${I * 2} A`, `${I + 3} A`], 'I = V / R');
    return Q(`ohmR:${V}:${I}`, E, L(`${V} V gerilimde ${I} A akım çeken yükün direnci?`, `A load draws ${I} A at ${V} V. Resistance?`), `${R} Ω`, [`${V * I} Ω`, `${R * 2} Ω`, `${R + 5} Ω`], 'R = V / I'); },
  guc: r => { const W = r.pick([1100, 2200, 3300, 4400, 660, 1320]); const I = W / 220; return Q(`guc:${W}`, L('Elektrik', 'Electrical'), L(`220 V şebekede ${W} W cihaz yaklaşık kaç amper çeker?`, `About how many amps does a ${W} W appliance draw at 220 V?`), `${dec(I)} A`, [`${dec(I * 2)} A`, `${dec(I / 2)} A`, `${dec(I + 4)} A`], 'P = V × I'); },
  boya: r => { const a = r.pick([3, 4, 5, 6]), b = r.pick([2.5, 3]), kat = r.pick([1, 2]); const v = a * b * kat / 10; return Q(`boya:${a}:${b}:${kat}`, L('Boya', 'Painting'), L(`${a} m × ${dec(b)} m duvar ${kat} kat boyanacak. 1 L boya 10 m² boyuyorsa kaç L gerekir?`, `A ${a} m × ${dec(b)} m wall gets ${kat} coat(s). If 1 L covers 10 m², how many liters?`), `${dec(v)} L`, [`${dec(v * 2)} L`, `${dec(v + 1)} L`, `${dec(v + 0.5)} L`]); },
  fayans: r => { const a = r.pick([2, 3, 4, 5]), b = r.pick([2, 3, 4]), f = r.pick([0.5, 0.25]); const n = a * b / (f * f); return Q(`fayans:${a}:${b}:${f}`, L('İnşaat', 'Construction'), L(`${a} m × ${b} m zemine ${f * 100}×${f * 100} cm fayans döşenecek. Kaç adet gerekir (fire hariç)?`, `How many ${f * 100}×${f * 100} cm tiles cover a ${a} m × ${b} m floor (no waste)?`), n, [String(n / 2), String(a * b * 4), String(n + a * b)].filter(x => x !== String(n))); },
  beton: r => { const a = r.pick([3, 4, 5, 6]), b = r.pick([3, 4, 5]), h = r.pick([0.1, 0.12, 0.15, 0.2]); const v = a * b * h; return Q(`beton:${a}:${b}:${h}`, L('İnşaat', 'Construction'), L(`${a} m × ${b} m, ${dec(h * 100)} cm kalınlıkta döşeme için kaç m³ beton gerekir?`, `How many m³ of concrete for a ${a} m × ${b} m slab, ${dec(h * 100)} cm thick?`), `${dec(v)} m³`, [`${dec(v * 10)} m³`, `${dec(a * b)} m³`, `${dec(v * 2)} m³`]); },
};

// ——— İlk sınıflar (1–2. sınıf): ilk kez öğrenen çocuk için kolay sorular ———
const DAYS_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SEASONS = [['❄️', 'Kış', 'Winter'], ['🌸', 'İlkbahar', 'Spring'], ['☀️', 'Yaz', 'Summer'], ['🍂', 'Sonbahar', 'Autumn']];
const E1 = {
  topla: r => { const a = r.int(1, 10), b = r.int(1, 10); return Q(`t1:${a}:${b}`, MAT(), `${a} + ${b} = ?`, a + b, wrongNum(r, a + b, [-2, -1, 1, 2, 3])); },
  cikar: r => { const a = r.int(5, 20), b = r.int(1, Math.min(9, a - 1)); return Q(`c1:${a}:${b}`, MAT(), `${a} − ${b} = ?`, a - b, wrongNum(r, a - b, [-2, -1, 1, 2, 3])); },
  say: r => { const e = r.pick(['🍎', '⭐', '🐟', '🎈', '🌸', '🐞']), n = r.int(3, 9); return Q(`s1:${e}:${n}`, MAT(), L(`Kaç tane var?  ${e.repeat(n)}`, `How many?  ${e.repeat(n)}`), n, wrongNum(r, n, [-2, -1, 1, 2])); },
  sira: r => { const a = r.int(1, 15), st = r.pick([1, 2, 5, 10]); const seq = [a, a + st, a + 2 * st]; return Q(`sq1:${a}:${st}`, MAT(), L(`Sırada hangi sayı gelir? ${seq.join(', ')}, ?`, `What comes next? ${seq.join(', ')}, ?`), a + 3 * st, wrongNum(r, a + 3 * st, [-st, st, -1, 1, 2])); },
  buyuk: r => { const ns = r.shuffle([...new Set([r.int(1, 50), r.int(1, 50), r.int(1, 50), r.int(1, 50), r.int(51, 99)])]).slice(0, 4); const mx = Math.max(...ns); return Q(`b1:${ns.join('-')}`, MAT(), L('Hangisi en büyük sayıdır?', 'Which is the biggest number?'), mx, ns.filter(x => x !== mx).map(String)); },
  kose: r => { const S = [['Üçgenin', 'triangle', 3], ['Karenin', 'square', 4], ['Beşgenin', 'pentagon', 5], ['Altıgenin', 'hexagon', 6]]; const [tr, en, n] = r.pick(S); return Q(`k1:${n}`, MAT(), L(`${tr} kaç köşesi vardır?`, `How many corners does a ${en} have?`), n, uniq([n - 1, n + 1, n + 2, 0], n)); },
  gun: r => { const i = r.int(0, 6); const Dy = TR() ? DAYS_TR : DAYS_EN; return Q(`g1:${i}`, L('Hayat Bilgisi', 'Life Skills'), L(`${Dy[i]} gününden sonra hangi gün gelir?`, `Which day comes after ${Dy[i]}?`), Dy[(i + 1) % 7], wrongFrom(r, Dy, Dy[(i + 1) % 7])); },
  mevsim: r => { const i = r.int(0, 3); const [e, tr, en] = SEASONS[i]; return Q(`m1:${i}`, L('Hayat Bilgisi', 'Life Skills'), L(`${e} Bu resim hangi mevsimi anlatır?`, `${e} Which season is this?`), TR() ? tr : en, SEASONS.filter((_, k) => k !== i).map(x => TR() ? x[1] : x[2])); },
};

// Seviye → üreticiler (tekrar yazmak ağırlık verir). Belirli bir ülkeye özgü sorular yok; tarih ve edebiyat dünya geneli.
const BY_LEVEL = {
  ilkokul1: [E1.topla, E1.topla, E1.cikar, E1.cikar, E1.say, E1.sira, E1.buyuk, E1.kose, E1.gun, E1.mevsim],
  ilkokul: [M.topla, M.cikar, M.carpim, M.problem, M.problem, M.basamak, M.bolme, TT.esAnlam, TT.zitAnlam, TT.atasozu, TT.gezegen],
  ortaokul: [M.bolme, M.yuzde, M.ebob, M.ekok, M.kesir, M.tamsayi, M.alan, M.us, M.karekok, M.ortalama, M.oran,
    TT.baskent, TT.yabanci, TT.yabanci, TT.esAnlam, TT.zitAnlam, TT.atasozu, TT.element, TT.organ, TT.tarih, TT.gezegen],
  lise: [M.denklem, M.kok, M.log, M.fonk, M.dizi, M.olasilik, M.pisagor, M.aci, M.kombin, M.zam, M.us,
    TT.baskent, TT.baskentTers, TT.yabanci, TT.yabanci, TT.element, TT.elementNo, TT.eser, TT.tarih, TT.tarihSira, TT.organ, TT.birim],
  genel: [M.yuzde, M.zam, M.faiz, M.denklem, M.olasilik, M.ortalama,
    TT.baskent, TT.baskentTers, TT.para, TT.eser, TT.tarih, TT.tarih, TT.tarihSira, TT.atasozu, TT.yabanci, TT.birim, TT.organ],
  tip: [P.etkenGrup, P.etken, P.ilacSinif, P.ilacTers, P.lab, P.lab, P.vitamin, P.bulgu, P.dozKilo, P.surup, P.infuzyon, P.vki, TT.organ],
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
  q.l = level;
  return q;
}
