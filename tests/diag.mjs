import { botLife } from './bot.mjs';
import * as Y from '../js/sim/year.js';
const prof = [
  ['futbol', { prefer: ['mahalle_maci','okul_takimi','altyapi','kosu'] }],
  ['doktor', { prefer: ['mat','fen','dershane','kitap','uni_ders'], dept: 'tip' }],
  ['tuccar', { prefer: ['isletme','bakkal'], biz: true, honest: true }],
  ['tuccarNH', { prefer: ['isletme','bakkal'], biz: true }],
  ['random', {}],
];
for (const sk of [35, 60, 85]) for (const [name, o] of prof) {
  const res = { jobs: {}, age: 0, money: 0, legends: 0, altyapi: 0, pro: 0, top: [], biz: {} };
  const N = 60;
  for (let i = 0; i < N; i++) {
    const s = botLife(name + i, sk, o);
    res.age += s.age / N; res.money += s.life.peakMoney / s.priceIndex / N; res.legends += s.legends.length / N;
    for (const j of s.life.jobs) res.jobs[j] = (res.jobs[j] || 0) + 1;
    if (s.flags.altyapi) res.altyapi++;
    if (s.edu.yksTop !== null) res.top.push(s.edu.yksTop);
    if (s._biz50 !== undefined) res.biz[s._biz50] = (res.biz[s._biz50] || 0) + 1;
  }
  res.top = res.top.length ? (res.top.reduce((a,b)=>a+b,0)/res.top.length).toFixed(1) : '-';
  console.log(sk, name, 'yaş', res.age.toFixed(0), 'servet(2026TL)', Math.round(res.money).toLocaleString('tr-TR'), 'efsane', res.legends.toFixed(2), 'altyapı', res.altyapi, 'yksTop', res.top, JSON.stringify(res.jobs), 'biz', JSON.stringify(res.biz));
}
