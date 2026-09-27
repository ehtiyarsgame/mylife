// Test ve denge betikleri için otomatik oyuncu.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RNG } from '../js/core/rng.js';
import { newLife } from '../js/sim/character.js';
import { setDeck, setJobsRef } from '../js/sim/events.js';
import { setBank } from '../js/sim/questions.js';
import { JOBS } from '../js/sim/careers.js';
import { availableActions } from '../js/sim/actions.js';
import * as Y from '../js/sim/year.js';
import { nextStepReqs, advanceBiz } from '../js/sim/business.js';
import { choosePartner } from '../js/sim/partner.js';
import { giveToFamily, livingHome } from '../js/sim/household.js';

export const events = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url)));
setDeck(events); setJobsRef(JOBS);
setBank(JSON.parse(readFileSync(new URL('../data/questions.json', import.meta.url))));

// Bir hayatı otomatik oynatan bot. skill: 0–100 arası "oyuncu becerisi"
export function botLife(seed, skill = 60, opts = {}) {
  const s = newLife({ seed, name: 'Test', gender: 'e' });
  if (opts.forceWealth) s.family.wealth = opts.forceWealth;
  const r = new RNG('bot' + seed);
  const mg = () => Math.max(0, Math.min(100, Math.round(r.normal(skill, 15))));
  Y.startYear(s);
  let guard = 0;
  while (s.alive && guard++ < 130) {
    // Sınav görevleri
    for (const t of s.year.tasks) {
      if (t.done) continue;
      const res = Y.examScore(s, t.exam, mg());
      const out = Y.applyExam(s, t.exam, res);
      if (out.choices?.kind === 'school') Y.chooseSchool(s, out.choices.list[0].id);
      if (out.choices?.kind === 'dept') Y.chooseDept(s, opts.dept && out.choices.list.find(c => c.id === opts.dept) ? opts.dept : out.choices.list[0].id);
    }
    // Aileye destek
    if (opts.helpFamily && livingHome(s) && s.home.stress >= 20 && s.money > 0) giveToFamily(s, s.money * 0.8);
    s._maxStress = Math.max(s._maxStress || 0, s.home.stress);
    if (s.age < 18) { s._childStress = Math.max(s._childStress || 0, s.home.stress); s._childCards = (s._childCards || 0) + ['aile_fatura','aile_kira','aile_icra','aile_dagilma'].filter(k => s.year.seenIds.includes(k)).length; }
    // Kapılar
    for (const id of Y.visibleDoors(s)) {
      const st = Y.doorStatus(s, id);
      if (!st.miss.length && Y.epLeft(s) >= 1 && s.energy.value >= 14) {
        Y.tryDoorSpend(s, id);
        const d = Y.doorScore(s, id, mg());
        if (d.open) Y.openDoor(s, id); else Y.failDoor(s, id);
      }
    }
    // İş
    if (s.age >= 18 && !s.career.job && s.edu.stage !== 'uni' && Y.epLeft(s) >= 1) {
      const offers = Y.jobOffers(s).filter(o => !o.miss.length).sort((a, b) => b.job.salary - a.job.salary);
      if (offers.length && s.energy.value >= 14) {
        Y.spendActionOnly(s, 'is_ara');
        if (mg() >= Y.interviewNeed(offers[0].id) - 10) Y.hireJob(s, offers[0].id);
      }
    }
    if (opts.biz && s.age >= 10 && !s.career.biz && Y.epLeft(s) >= 1) Y.startBiz(s);
    if (opts.biz && s.career.biz) {
      const n = nextStepReqs(s);
      if (n && !n.miss.length) advanceBiz(s);
      if (opts.trace) { (s._trace ||= []); if (n) s._trace.push(`${s.age}:${s.career.biz.step} ${n.miss.join(';').slice(0,60)} rep${Math.round(s.stats.itibar)}`); }
    }
    // Eylemler
    let loops = 0;
    while (Y.epLeft(s) > 0 && loops++ < 20) {
      s.energy.value = 100; // bot için enerji sınırsız
      const list = availableActions(s).filter(a => !a.special && !Y.canDo(s, a));
      const pref = list.filter(a => opts.prefer?.includes(a.id) || (a.work && Y.workNeed(s) > s.year.workDone));
      const a = (pref.length && r.chance(0.7)) ? r.pick(pref) : r.pick(list);
      if (!a) break;
      if (a.exam) {
        const res = Y.examScore(s, a.exam, mg());
        Y.spendActionOnly(s, a.id);
        Y.applyExam(s, a.exam, res);
      } else {
        const out = Y.performAction(s, a.id, mg());
        if (out.candidates) choosePartner(s, out.candidates.slice().sort((x, y) => (opts.looksFirst ? y.gorunus - x.gorunus : y.compat - x.compat))[0]);
      }
      let ev;
      while ((ev = Y.nextEvent(s))) {
        const okOpts = ev.options.map((o, i) => [o, i]).filter(([o]) => Y.optionAvailable(s, o));
        const honest = okOpts.find(([o]) => o.honest);
        const [o, i] = (opts.honest && honest) ? honest : r.pick(okOpts);
        Y.resolveOption(s, ev, i, o.mg ? mg() : null);
      }
    }
    while (Y.nextEvent(s)) { /* bebeklik */ const ev = s.year; break; }
    // Bebeklik olayları
    let ev;
    while ((ev = Y.nextEvent(s))) Y.resolveOption(s, ev, 0, ev.options[0].mg ? mg() : null);
    const c = Y.canEndYear(s);
    if (!c.ok) {
      // kalan EP'yi dinlenerek bitir
      while (Y.epLeft(s) > 0) { s.energy.value = 100; Y.performAction(s, 'dinlen', 50); }
      let e2; while ((e2 = Y.nextEvent(s))) Y.resolveOption(s, e2, 0, e2.options[0].mg ? mg() : null);
    }
    const c2 = Y.canEndYear(s);
    assert.ok(c2.ok, `Yıl bitirilemedi (yaş ${s.age}): ${c2.reasons.join(', ')}`);
    const sum = Y.endYear(s);
    (s._moneyAt ||= {})[s.age] = Math.round(s.money);
    (s._healthAt ||= {})[s.age] = Math.round(s.stats.saglik);
    if (s.age === 50) s._biz50 = s.career.biz?.step ?? -1;
    for (const k in s.stats) assert.ok(Number.isFinite(s.stats[k]) && s.stats[k] >= 0 && s.stats[k] <= 100, `stat ${k}=${s.stats[k]}`);
    for (const k in s.skills) assert.ok(Number.isFinite(s.skills[k]), `skill ${k}`);
    assert.ok(Number.isFinite(s.money), 'money NaN at ' + s.age);
    if (sum.died) break;
  }
  return s;
}

