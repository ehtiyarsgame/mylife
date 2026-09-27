// Fakir ailede aileye yardım eden ve etmeyen çocuk karşılaştırması
import { botLife } from './bot.mjs';
import { rollStart } from '../js/sim/character.js';
const seeds = []; for (let i = 0; seeds.length < 60 && i < 3000; i++) { const r = rollStart('fam' + i); if (r.wealth === 'fakir' && r.siblings >= 2) seeds.push('fam' + i); }
for (const help of [false, true]) {
  let cstress = 0, ccards = 0, stress = 0, drop = 0, cards = {}, happy = 0, married = 0, div = 0, score = 0;
  for (const sd of seeds) {
    const s = botLife(sd, 60, { helpFamily: help, prefer: help ? ['pazar_isi', 'ayak_isi', 'yari_zaman'] : [] });
    stress += s._maxStress / seeds.length; cstress += (s._childStress || 0) / seeds.length; ccards += (s._childCards || 0);
    if (s.flags.okulBirakti) drop++;
    for (const k of ['aile_fatura', 'aile_kira', 'aile_icra', 'aile_dagilma', 'ebeveyn_zor']) if (s.seen[k]) cards[k] = (cards[k] || 0) + 1;
    if (s.rel.married || s.rel.exes) married++;
    div += s.rel.exes;
  }
  console.log(help ? 'YARDIM EDEN ' : 'YARDIM ETMEYEN', 'çocuklukta max stres', cstress.toFixed(0), 'çocuklukta kriz kartı', ccards, 'ömür boyu max', stress.toFixed(0), 'okulu bırakan', drop, JSON.stringify(cards), 'evlenen/ilişki', married, 'ayrılık', div, 'evli ölen', seeds.length);
}
