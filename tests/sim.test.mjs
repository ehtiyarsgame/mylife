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
