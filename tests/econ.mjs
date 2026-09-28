// Ekonomi dengesi: meslek yollarına göre yaşlara göre servet (nominal, milyon). node tests/econ.mjs
import { botLife } from './bot.mjs';
const prof = [
  ['futbol', { prefer: ['mahalle_maci', 'okul_takimi', 'altyapi', 'kosu'] }],
  ['doktor', { prefer: ['mat', 'fen', 'dershane', 'kitap', 'uni_ders', 'alan_sayisal'], dept: 'tip', alan: 'sayisal' }],
  ['tuccar', { prefer: ['isletme', 'bakkal'], biz: true, honest: true }],
  ['random', {}],
];
const med = a => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : NaN; };
const M = v => (v / 1e6).toFixed(1);
for (const sk of [60, 85]) for (const [name, o] of prof) {
  const at = { 20: [], 25: [], 30: [], 45: [] }; let pros = 0;
  const N = +process.env.N || 40;
  for (let i = 0; i < N; i++) {
    const s = botLife(name + i, sk, o);
    for (const a in at) if (s._moneyAt?.[a] !== undefined) at[a].push(s._moneyAt[a] + (s._wealthAt?.[a] || 0));
    if (s.life.jobs.includes('futbolcu')) pros++;
  }
  console.log(sk, name.padEnd(7), Object.entries(at).map(([a, v]) => `${a}y ${M(med(v))}M (max ${M(Math.max(...v))})`).join(' | '), name === 'futbol' ? `pro ${pros}/${N}` : '');
}
