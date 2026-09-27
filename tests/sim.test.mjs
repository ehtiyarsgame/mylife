// Başsız simülasyon testleri: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RNG } from '../js/core/rng.js';
import { newLife, rollStart } from '../js/sim/character.js';
import { setDeck, setJobsRef, checkCond, deckSize } from '../js/sim/events.js';
import { setBank } from '../js/sim/questions.js';
import { JOBS, DOORS } from '../js/sim/careers.js';
import { availableActions, actionById, resolve } from '../js/sim/actions.js';
import * as Y from '../js/sim/year.js';
import { nextStepReqs, advanceBiz } from '../js/sim/business.js';
import { skillGain } from '../js/sim/stats.js';

import { botLife, events } from './bot.mjs';

test('aynı tohum aynı başlangıcı verir', () => {
  assert.deepEqual(rollStart('abc'), rollStart('abc'));
  assert.notDeepEqual(rollStart('abc').talents, rollStart('abd').talents);
});

test('başlangıç zarı dağılımı tasarım dokümanına yakın', () => {
  const c = { fakir: 0, orta: 0, varlikli: 0, zengin: 0 };
  for (let i = 0; i < 4000; i++) c[rollStart('d' + i).wealth]++;
  assert.ok(Math.abs(c.fakir / 4000 - 0.30) < 0.03);
  assert.ok(Math.abs(c.zengin / 4000 - 0.05) < 0.015);
});

test('yetenek artışı tavana yaklaştıkça yavaşlar', () => {
  const s = newLife({ seed: 'g', name: 'A', gender: 'k' });
  s.talents.futbol = 80; s.stats.disiplin = 50;
  s.skills.futbol = 10; const g1 = skillGain(s, 'futbol', 4, 60);
  s.skills.futbol = 80; const g2 = skillGain(s, 'futbol', 4, 60);
  assert.ok(g1 > g2 * 3);
});

test('olay kartları geçerli: seçenek, koşul ve zincir referansları', () => {
  assert.ok(deckSize() >= 100);
  const ids = new Set(events.map(e => e.id));
  for (const e of events) {
    assert.ok(e.options?.length, e.id);
    assert.ok(['common', 'rare', 'epic', 'legendary'].includes(e.rarity), e.id);
    for (const o of e.options) for (const eff of [o.effects, o.success?.effects, o.fail?.effects]) if (eff?.chain) assert.ok(ids.has(eff.chain.id), e.id + ' zincir');
  }
});

test('200 hayat hatasız sonuna kadar oynanır', () => {
  const ages = [];
  for (let i = 0; i < 200; i++) {
    const s = botLife('life' + i, 40 + (i % 5) * 12);
    assert.equal(s.alive, false, 'hayat bitmedi: ' + i);
    ages.push(s.age);
  }
  const avg = ages.reduce((a, b) => a + b, 0) / ages.length;
  assert.ok(avg > 62 && avg < 90, 'ortalama ömür ' + avg);
});

test('iyi oyuncu kötü oyuncudan daha iyi hayat yaşar (beceri > şans)', () => {
  let good = 0, bad = 0;
  for (let i = 0; i < 60; i++) {
    good += Y.lifeScore(botLife('cmp' + i, 85));
    bad += Y.lifeScore(botLife('cmp' + i, 30));
  }
  assert.ok(good > bad * 1.1, `iyi ${good} kötü ${bad}`);
});

test('ticaret yolu: usta oyuncu üst basamaklara çıkar', () => {
  let maxStep = 0;
  for (let i = 0; i < 20; i++) {
    const s = botLife('biz' + i, 85, { biz: true, prefer: ['isletme'] });
    maxStep = Math.max(maxStep, s.career.biz?.step ?? 0);
  }
  assert.ok(maxStep >= 3, 'en yüksek basamak ' + maxStep);
});

// ——— Doğuştan özellikler, hane, mesai, eş ———
import { RNG as R2 } from '../js/core/rng.js';
import { makeCandidates, choosePartner } from '../js/sim/partner.js';
import { homeYear, giveToFamily } from '../js/sim/household.js';
import { looks } from '../js/sim/traits.js';

test('doğuştan özellikler tohumla belirlenir ve yaşla görünüş azalır', () => {
  const a = rollStart('tr1'), b = rollStart('tr1');
  assert.deepEqual(a.traits, b.traits);
  const s = newLife({ seed: 'tr2', name: 'A', gender: 'k' });
  s.age = 25; const young = looks(s);
  s.age = 70; assert.ok(looks(s) < young);
});

test('aileye destek olmak hane stresini düşürür', () => {
  let withHelp = 0, without = 0;
  for (let i = 0; i < 40; i++) {
    for (const help of [true, false]) {
      const s = newLife({ seed: 'hh' + i, name: 'A', gender: 'e' });
      s.family.wealth = 'fakir'; s.family.siblings = 3; s.home.cash = -40000; s.home.stress = 40; s.age = 14;
      if (help) { s.money = 80000; giveToFamily(s, 80000); }
      homeYear(s, new R2(i));
      help ? (withHelp += s.home.stress) : (without += s.home.stress);
    }
  }
  assert.ok(withHelp < without * 0.85, `yardımla ${withHelp} yardımsız ${without}`);
});

test('mesaiye gitmeyen daha az maaş alır', () => {
  const pay = shifts => {
    const s = newLife({ seed: 'ms', name: 'A', gender: 'e' });
    s.age = 30; s.edu.stage = 'done'; s.edu.degree = 'muhendislik';
    Y.startYear(s); Y.hireJob(s, 'muhendis');
    for (let i = 0; i < shifts; i++) Y.performAction(s, 'mesai', 60);
    const sum = Y.endYear(s);
    return sum.income.find(x => x[0].startsWith('Maaş'))[1];
  };
  assert.ok(pay(0) < pay(2) * 0.5);
});

test('eş adayları farklı karakterlerde gelir; seçilen eş hayatı etkiler', () => {
  const s = newLife({ seed: 'es', name: 'A', gender: 'e' });
  s.age = 25;
  const c = makeCandidates(s, new R2(7), 70);
  assert.equal(c.length, 3);
  assert.deepEqual(c.map(x => x.arc), ['cekici', 'uyumlu', 'varlikli']);
  choosePartner(s, c[1]); s.rel.married = true; s.rel.partner.salary = 50000; s.rel.partner.love = 80;
  Y.startYear(s);
  const sum = Y.endYear(s);
  assert.ok(sum.income.some(x => x[0].includes(c[1].name)));
});

test('çocuğun cebi gerçekçi kalır: 14 yaşında orta halli ailede ortalama < 20 bin TL', () => {
  let sum = 0, n = 0;
  for (let i = 0; i < 30; i++) {
    const s = botLife('cep' + i, 60, { forceWealth: 'orta' });
    if (s._moneyAt?.[14] !== undefined) { sum += s._moneyAt[14]; n++; }
    assert.ok(Object.entries(s._moneyAt || {}).every(([a, m]) => a >= 18 || m >= 0), 'çocuk borçlu olamaz');
  }
  assert.ok(sum / n < 20000, 'ortalama ' + sum / n);
});

// ——— Yaşam dengesi ———
import { balanceYear } from '../js/sim/balance.js';

test('ders ihmali öğrenileni unutturur, üst üste çok zayıf karne sınıfta bırakır', () => {
  const s = newLife({ seed: 'bl', name: 'A', gender: 'e' });
  s.age = 12; s.edu.stage = 'orta'; s.skills.matematik = 30;
  Y.startYear(s);
  balanceYear(s); // hiç ders çalışmadı
  assert.ok(s.skills.matematik < 30);
  s.edu.grades = [35];
  Y.applyExam(s, 'karne', { score: 30, prep: 10, top: 90 });
  assert.equal(s.edu.delay, 1);
  assert.equal(Y.eduAge(s), 11);
});

test('spor alışkanlığı sağlığı korur, hareketsizlik düşürür', () => {
  const mk = () => { const s = newLife({ seed: 'sp', name: 'A', gender: 'e' }); s.age = 30; s.stats.saglik = 70; return s; };
  const active = mk(), lazy = mk();
  for (let i = 0; i < 5; i++) {
    for (const [s, act] of [[active, true], [lazy, false]]) {
      Y.startYear(s); if (act) s.year.done.push('kosu'); balanceYear(s); s.age++;
    }
  }
  assert.ok(active.stats.saglik > lazy.stats.saglik + 3, `${active.stats.saglik} vs ${lazy.stats.saglik}`);
});

test('kimse 18 yaşından sonra ortaokulda/lisede takılı kalmaz', () => {
  for (let i = 0; i < 40; i++) {
    const s = botLife('okul' + i, 20);
    assert.ok(!(s.age >= 19 && ['orta', 'lise'].includes(s.edu.stage) && !s.flags.yksTekrar), `${s.age} yaşında ${s.edu.stage}`);
  }
});

// ——— Kart kalitesi ———
import { optionVisible } from '../js/sim/events.js';
test('her kartın her uygun yaşta en az bir görünür seçeneği vardır', () => {
  for (const c of events) {
    const [a0, a1] = c.cond?.age || [0, 90];
    for (let age = a0; age <= Math.min(a1, 90); age += 1) {
      const s = newLife({ seed: 'kv', name: 'A', gender: 'e' }); s.age = age;
      assert.ok(c.options.some(o => optionVisible(s, o)), `${c.id} ${age} yaşında seçeneksiz`);
    }
  }
});

test('aynı kart üst üste iki yıl gelmez ve bir hayatta çok çeşitli kart görülür', () => {
  for (let i = 0; i < 20; i++) {
    const s = botLife('tekrar' + i, 60);
    const seq = s._cardSeq || [];
    for (let k = 1; k < seq.length; k++) assert.ok(!(seq[k][0] === seq[k - 1][0] && seq[k][1] - seq[k - 1][1] <= 1 && !events.find(e => e.id === seq[k][0])?.chainOnly), `${seq[k][0]} tekrarlandı`);
    const uniq = new Set(seq.map(x => x[0])).size;
    assert.ok(uniq >= seq.length * 0.4, `çeşitlilik düşük: ${uniq}/${seq.length}`);
  }
});
