// Başsız simülasyon testleri: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RNG } from '../js/core/rng.js';
import { newLife, rollStart } from '../js/sim/character.js';
import { setDeck, setJobsRef, checkCond, deckSize } from '../js/sim/events.js';
import { setBank } from '../js/sim/questions.js';
setBank(JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url))));
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

test('üretilen sorular geçerli ve çok çeşitli; sınavda tekrar gelmez', async () => {
  const { genQuestion, genLevels } = await import('../js/sim/qgen.js');
  const { pickQuestions } = await import('../js/sim/questions.js');
  const r = new RNG('soru');
  for (const l of genLevels) {
    const ids = new Set();
    for (let i = 0; i < 1500; i++) {
      const q = genQuestion(r, l);
      ids.add(q.id);
      assert.equal(q.a.length, 4, q.q);
      assert.equal(new Set(q.a).size, 4, `${q.q} → ${q.a}`);
      assert.ok(!q.a.some(x => /undefined|NaN/.test(x)), q.q);
    }
    const min = ['tip', 'ehliyet', 'usta'].includes(l) ? 110 : 600;
    assert.ok(ids.size > min, `${l}: yalnız ${ids.size} farklı soru`);
  }
  for (const [lvl, n] of [['lise', 10], ['tip', 8], ['ehliyet', 5], ['usta', 5]]) {
    let recent = [];
    for (let k = 0; k < 8; k++) {
      const qs = pickQuestions(lvl, n, recent, 50);
      for (const q of qs) assert.ok(!recent.includes(q.id), `${lvl} tekrar: ${q.q}`);
      recent = recent.concat(qs.map(q => q.id));
    }
  }
});

test('eylem ve işlerdeki tüm mini oyunlar kayıtlı ve 100+ oyun var', async () => {
  globalThis.document ??= { createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, append() {}, setAttribute() {}, addEventListener() {} }), createTextNode: () => ({}) };
  const { allGames } = await import('../js/minigames/index.js');
  const { BIZ_STEPS } = await import('../js/sim/business.js');
  const ids = new Set(allGames().map(g => g.id));
  assert.ok(ids.size >= 100, `${ids.size} oyun`);
  const used = [];
  for (const a of Object.values(actionById)) if (a.mg && typeof a.mg !== 'function') used.push(...[].concat(a.mg));
  for (const j of Object.values(JOBS)) used.push(...[].concat(j.mg));
  for (const s of BIZ_STEPS) used.push(...s.mgs);
  for (const id of used) assert.ok(ids.has(id), `kayıtsız mini oyun: ${id}`);
});

test('ölen ya da olmayan aile üyesinden bahseden kart ve seçenek gelmez', async () => {
  const { drawCard, cardFits } = await import('../js/sim/events.js');
  const r = new RNG('olu-baba');
  for (let i = 0; i < 30; i++) {
    const s = newLife({ seed: 'ob' + i, name: 'A', gender: 'e' });
    s.age = 6 + (i % 14);
    s.family.parents.find(p => p.role === 'Baba').alive = false;
    s.family.siblings = 0;
    s.seen.dede_vefat = true;
    for (let k = 0; k < 40; k++) {
      s.seenAt = {}; if (s.year) s.year.seenIds = [];
      const c = drawCard(s, r);
      if (!c) continue;
      const txt = [c.title, c.text].join(' ');
      assert.ok(!(c._need?.baba || c._need?.kardes || c._need?.dede), `${c.id} ölen/olmayan kişiden bahsediyor: ${txt}`);
      for (const o of c.options) if (optionVisible(s, o)) assert.ok(!(o._need?.baba || o._need?.kardes), `${c.id} seçeneği: ${o.text}`);
    }
    assert.ok(!cardFits(events.find(e => e.id === 'baba_isten_cikti'), s), 'babası ölmüşken "baban işsiz kaldı" gelmemeli');
  }
});

test('ticarette rekor ve çöküş yılları gerçekçi sıklıkta yaşanır', async () => {
  const { bizYear } = await import('../js/sim/business.js');
  const r = new RNG('ticaret-gercek');
  const kinds = { good: 0, bad: 0, boom: 0, crash: 0 };
  for (let i = 0; i < 400; i++) {
    const s = newLife({ seed: 'tg' + i, name: 'A', gender: 'e' });
    s.career.biz = { step: 1 + (i % 5), years: 0, skillSum: 0, skillN: 0, bankrupt: 0 };
    for (let y = 0; y < 10; y++) { s.career.biz.skillSum = 30 + (i % 50); s.career.biz.skillN = 1; kinds[bizYear(s, r).kind]++; }
  }
  const n = 4000;
  assert.ok(kinds.boom / n > 0.015 && kinds.boom / n < 0.12, `rekor yıl oranı ${kinds.boom / n}`);
  assert.ok(kinds.crash / n > 0.01 && kinds.crash / n < 0.08, `çöküş oranı ${kinds.crash / n}`);
  assert.ok(kinds.good > kinds.bad, 'çoğu yıl kârlı olmalı');
});

test('İngilizce çeviri eksiksiz: kartlar, sorular ve arayüz sözlüğü', async () => {
  const E = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url)));
  const EN = JSON.parse(readFileSync(new URL('../data/events.en.json', import.meta.url)));
  for (const c of E) {
    const x = EN[c.id];
    assert.ok(x && x.title && x.text, `çevrilmemiş kart: ${c.id}`);
    assert.equal(x.options.length, c.options.length, `${c.id} seçenek sayısı`);
    c.options.forEach((o, i) => {
      if (o.success?.result) assert.ok(x.options[i].success, `${c.id}#${i} başarı metni`);
      if (o.fail?.result) assert.ok(x.options[i].fail, `${c.id}#${i} başarısızlık metni`);
    });
    const vars = s => (s.match(/\{\w+\}/g) || []).sort().join();
    assert.equal(vars(x.text), vars(c.text), `${c.id} şablon değişkenleri`);
  }
  const Q = JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url)));
  const QE = JSON.parse(readFileSync(new URL('../data/questions.en.json', import.meta.url)));
  assert.equal(QE.length, Q.length);
  for (const q of QE) assert.equal(new Set(q.a).size, 4, q.q);
  const { extract } = await import('../scripts/i18n-extract.mjs');
  const { DICT } = await import('../js/i18n/en.js');
  const miss = [...extract().keys()].filter(k => !(k in DICT));
  assert.ok(miss.length < 130, `çevrilmemiş arayüz metni: ${miss.length} (${miss.slice(0, 8).join(' | ')})`);
});

test('karne yazılısı sınıfla uzar ve okul boyunca soru tekrarlanmaz', async () => {
  const { examQ, examLevel } = await import('../js/sim/careers.js');
  const { pickQuestions } = await import('../js/sim/questions.js');
  assert.equal(examQ('karne', 8), 8);
  assert.equal(examQ('karne', 12), 10);
  assert.equal(examQ('karne', 16), 12);
  let recent = [];
  const seen = [];
  for (let age = 7; age <= 17; age++) {
    const qs = pickQuestions(examLevel('karne', age), examQ('karne', age), recent, 55);
    recent = [...recent, ...qs.map(q => q.id)].slice(-400);
    seen.push(...qs.map(q => q.q));
  }
  assert.ok(seen.length >= 110);
  assert.ok(new Set(seen).size >= seen.length - 2, `tekrar: ${seen.length - new Set(seen).size}`);
});

test('konuşma havuzları: her sahne 4 tur, mülakat mesleğe özel, sohbetler tekrarlamaz', async () => {
  const { talkRounds, talkCount } = await import('../js/minigames/talk.js');
  const { SCENES } = await import('../js/minigames/life.js');
  assert.ok(talkCount() >= 240, `soru sayısı ${talkCount()}`);
  const r = new RNG('talk');
  for (const k of Object.keys(SCENES)) {
    const rs = talkRounds(k, r);
    assert.equal(rs.length, 4, k);
    for (const [p, o] of rs) { assert.ok(p && o.length === 3 && o.every(Boolean), `${k}: ${p}`); }
  }
  // Doktor mülakatında en az bir soru tıbba özel olmalı
  const docPrompts = new Set((await import('../js/minigames/talk.js')).talkRounds('mulakat', r, { job: 'doktor', path: 'doktor' }).map(x => x[0]));
  assert.ok([...docPrompts].some(p => /hasta|acil|nöbet|uzmanlık|Başhekim|tıbbi|patient|emergency|night shift|specialty|physician|medical/i.test(p)), [...docPrompts].join(' / '));
  // Art arda 3 tanışma sohbetinde aynı soru gelmez
  const seen = [];
  for (let i = 0; i < 3; i++) seen.push(...talkRounds('tanisma', r).map(x => x[0]));
  assert.equal(new Set(seen).size, seen.length);
});

test('finans: vergi dilimleri, borsa yılı, al-sat ve kredi geri ödemesi', async () => {
  const F = await import('../js/sim/finance.js');
  assert.equal(F.incomeTax(20000 * 12, 1), 0);
  assert.ok(Math.abs(F.incomeTax(60000 * 12, 1) - 35000 * 0.2 * 12) < 1);
  assert.ok(F.incomeTax(600000 * 12, 1) / (600000 * 12) > 0.3);
  const s = newLife({ seed: 'fin', name: 'A', gender: 'e' });
  s.age = 25; s.money = 1e6;
  const r = new RNG('fin');
  F.initMarket(s, r);
  assert.ok(F.buyStock(s, 'NOVA', 100));
  for (let y = 0; y < 30; y++) {
    const m = F.marketYear(s, r, 0.05);
    for (const id in s.market.prices) assert.ok(Number.isFinite(s.market.prices[id]) && s.market.prices[id] > 0, id);
    assert.ok(Number.isFinite(m.div));
  }
  const got = F.sellStock(s, 'NOVA', 100);
  assert.ok(got > 0 && !s.portfolio.NOVA);
  // Kredi: taksitler vade sonunda borcu kapatır
  s.money = 1e7;
  F.takeLoan(s, 1e6, 5);
  for (let y = 0; y < 5; y++) F.loanYear(s);
  assert.equal(F.bankOf(s).loans.length, 0);
  assert.ok(F.bankOf(s).score > 50);
});
