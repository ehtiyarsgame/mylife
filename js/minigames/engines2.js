// Yeni oyun motorları: kaydır, sırayı hatırla, doldur, denge, hızlı yazım, doğru anda çek.
// Her motor farklı temalarla (meslek, hobi, bebeklik) ayrı mini oyunlar üretir.
import { register } from './engine.js';
import { h } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';
import { lang } from '../core/i18n.js';

const pct = v => Math.round(clamp(v, 0, 100));
const big = (txt, size = 56) => h('div', { style: { fontSize: size + 'px', textAlign: 'center', lineHeight: 1.1 } }, txt);

// 1) KAYDIR — kart gelir, sola ya da sağa at (iki büyük düğme de çalışır).
// t.sides: [solEtiket, sağEtiket]; t.items: [[metin, 0|1], ...]
export function swipeGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || [`Kart gelince karar ver: ${t.sides[0]} mi, ${t.sides[1]} mi?`, 'Kartı sağa/sola kaydır ya da alttaki düğmelere dokun.', 'Yanlış karar 2 saniye götürür. 30 saniye.'],
    play(stage, api) {
      return new Promise(resolve => {
        let ok = 0, bad = 0, over = false, penalty = 0, cur, k = 0, sx = null;
        const pool = api.rng.shuffle(t.items.slice());
        const card = h('div.qcard', { style: { fontSize: '21px', minHeight: '150px', flexDirection: 'column', transition: 'transform .22s, opacity .22s', touchAction: 'none', userSelect: 'none' } });
        const btnL = h('button.btn', { style: { flex: 1, minHeight: '68px', fontSize: '15px', borderColor: '#ff5b7a' }, onclick: () => pick(0) }, '⬅️ ' + t.sides[0]);
        const btnR = h('button.btn', { style: { flex: 1, minHeight: '68px', fontSize: '15px', borderColor: '#3ddc97' }, onclick: () => pick(1) }, t.sides[1] + ' ➡️');
        stage.replaceChildren(h('div.col', { style: { gap: '16px', margin: 'auto 0' } }, big(t.icon, 44), card, h('div.row', { style: { gap: '10px' } }, btnL, btnR)));
        const next = () => { if (k >= pool.length) { k = 0; api.rng.shuffle(pool); } cur = pool[k++]; card.style.transform = ''; card.style.opacity = '1'; card.textContent = cur[0]; };
        const pick = side => {
          if (over || !cur) return;
          card.style.transform = `translateX(${side ? 140 : -140}px) rotate(${side ? 14 : -14}deg)`; card.style.opacity = '0';
          if (side === cur[1]) { ok++; api.sfx.good(); } else { bad++; penalty += 2; api.bad(`→ ${t.sides[cur[1]]}`); }
          api.setScore(ok);
          const c = cur; cur = null;
          setTimeout(() => { if (!over && !cur && c) next(); }, 200);
        };
        card.addEventListener('pointerdown', e => { sx = e.clientX; });
        card.addEventListener('pointermove', e => { if (sx !== null) card.style.transform = `translateX(${e.clientX - sx}px) rotate(${(e.clientX - sx) / 12}deg)`; });
        card.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) pick(dx > 0 ? 1 : 0); else card.style.transform = ''; });
        next();
        const total = (30 + api.ease * 5 - api.diff * 5) * api.timeMul;
        const t0 = performance.now();
        api.loop(() => {
          const f = 1 - ((performance.now() - t0) / 1000 + penalty) / total;
          api.setTimer(f);
          if (f <= 0 && !over) { over = true; resolve(pct(ok / (t.target || 13) * 100 - bad * 3)); }
        });
      });
    },
  });
}

// 2) SIRAYI HATIRLA — tuşlar sırayla yanar, aynı sırayla dokun; her turda bir adım uzar.
// t.pads: [[emoji, renk], x4]
export function seqGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || ['Tuşlar sırayla yanar: iyi izle.', 'Sonra aynı sırayla dokun.', 'Her turda sıra bir adım uzar. Bir hata oyunu bitirir.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const pads = t.pads.map(([e, c], i) => h('button', { style: { flex: '1 1 40%', height: '104px', borderRadius: '22px', fontSize: '44px', background: c, opacity: '.45', border: '3px solid rgba(255,255,255,.15)', transition: 'opacity .12s, transform .12s' }, onclick: () => press(i) }, e));
        const info = h('div.center', { style: { fontWeight: 800, minHeight: '24px' } }, '');
        stage.replaceChildren(h('div.col', { style: { gap: '14px', margin: 'auto 0' } }, big(t.icon, 40), info, h('div.row', { style: { flexWrap: 'wrap', gap: '12px' } }, pads)));
        const flash = async (i, ms = 420) => { pads[i].style.opacity = '1'; pads[i].style.transform = 'scale(1.06)'; api.sfx.note?.(i); await sleep(ms); pads[i].style.opacity = '.45'; pads[i].style.transform = ''; };
        const seq = [];
        let len = t.start || (api.ease > 0.5 ? 3 : 2), input = null, best = 0;
        const target = t.target || 9;
        const press = async i => {
          if (!input) return;
          flash(i, 180);
          if (i !== seq[input.k]) { const r = input.res; input = null; r(false); return; }
          input.k++;
          if (input.k >= seq.length) { const r = input.res; input = null; r(true); }
        };
        while (true) {
          while (seq.length < len) seq.push(api.rng.int(0, pads.length - 1));
          info.textContent = t.watch || '👀 İzle…';
          await sleep(500);
          const speed = clamp(480 - api.diff * 150 + api.ease * 80 - len * 10, 220, 560);
          for (const i of seq) { await flash(i, speed); await sleep(110); }
          info.textContent = t.go || '👆 Şimdi sen!';
          const ok = await new Promise(res => { input = { k: 0, res }; });
          if (!ok) { api.bad(t.failText || 'Karıştı!'); break; }
          best = len; api.good(`${len}!`); api.setScore(best);
          if (len >= target + 2) break;
          len++;
          await sleep(500);
        }
        resolve(pct((best - 1) / target * 100));
      });
    },
  });
}

// 3) DOLDUR — basılı tut, sıvı yükselir; çizgiye gelince bırak. Taşarsa rezil olursun.
// t.cup: emoji, t.color: sıvı rengi, t.unit, t.rounds
export function fillGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || ['Ekrana basılı tut: doldurmaya başlarsın.', 'Kesikli çizgiye gelince parmağını kaldır.', 'Taşırırsan puan yok! 5 deneme.'],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const rounds = t.rounds || 5;
        const liquid = h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '0%', background: t.color || '#c98a3a', borderRadius: '0 0 18px 18px', transition: 'background .2s' } });
        const line = h('div', { style: { position: 'absolute', left: '-10px', right: '-10px', borderTop: '3px dashed #fff', height: 0 } });
        const glass = h('div', { style: { position: 'relative', width: '130px', height: '240px', margin: '0 auto', border: '4px solid rgba(255,255,255,.7)', borderTop: 'none', borderRadius: '0 0 22px 22px', overflow: 'visible' } }, liquid, line);
        const info = h('div.center.small', { style: { fontWeight: 800, minHeight: '20px' } });
        stage.replaceChildren(h('div.col', { style: { gap: '12px', margin: 'auto 0', userSelect: 'none', touchAction: 'none' } }, big(t.cup || t.icon, 48), glass, info, h('div.center.tiny.muted', {}, t.hint || 'Basılı tut → bırak')));
        let total = 0;
        for (let r = 0; r < rounds; r++) {
          const goal = api.rng.float(0.35, 0.88);
          line.style.bottom = goal * 100 + '%';
          liquid.style.height = '0%'; liquid.style.background = t.color || '#c98a3a';
          info.textContent = `${r + 1}/${rounds}`;
          let lvl = 0, holding = false, done = false;
          const speed = (0.28 + api.diff * 0.3 + r * 0.03) * (1 - api.ease * 0.3);
          const down = () => { if (!done) holding = true; };
          const up = () => { if (holding) { holding = false; done = true; } };
          stage.addEventListener('pointerdown', down); window.addEventListener('pointerup', up);
          await new Promise(res => {
            let last = performance.now();
            const f = now => {
              const dt = Math.min(0.05, (now - last) / 1000); last = now;
              if (holding) lvl += speed * dt * (1 + lvl * 0.6);
              liquid.style.height = Math.min(lvl, 1.08) * 100 + '%';
              if (lvl > 1) { done = true; holding = false; }
              if (done) res(); else requestAnimationFrame(f);
            };
            requestAnimationFrame(f);
          });
          stage.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up);
          const d = Math.abs(lvl - goal);
          let sc = 0;
          if (lvl > 1) { api.bad(t.spill || 'Taştı! 😱'); liquid.style.background = '#ff5b7a'; }
          else if (lvl > goal + 0.06) { sc = 0.35; api.bad(t.over || 'Fazla!'); }
          else { sc = d < 0.025 ? 1 : d < 0.06 ? 0.8 : d < 0.12 ? 0.5 : 0.2; sc >= 1 ? api.good(t.perfect || 'Tam kıvamında!') : sc >= 0.5 ? api.good('İyi!') : api.bad(t.under || 'Az kaldı'); }
          total += sc;
          api.setScore(`${Math.round(total / (r + 1) * 100)}%`);
          await sleep(750);
        }
        resolve(pct(total / rounds * 105));
      });
    },
  });
}

// 4) DENGE — nesne sallanır; sola/sağa dokunarak devrilmesini önle.
// t.item: taşınan emoji(ler), t.base: altlık
export function balanceGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || ['Yük sağa sola yatar.', 'Sağa yatınca ekranın SOL yarısına, sola yatınca SAĞ yarısına dokunarak dengele.', 'Devirmeden sona kadar dayan!'],
    play(stage, api) {
      return new Promise(resolve => {
        const items = h('div', { style: { fontSize: '40px', letterSpacing: '2px', textAlign: 'center', height: '52px' } }, t.item);
        const plate = h('div', { style: { width: '220px', height: '14px', margin: '0 auto', background: t.plate || '#c9c9d6', borderRadius: '8px' } });
        const rig = h('div', { style: { transformOrigin: '50% 100%', transition: 'transform .05s linear' } }, items, plate);
        const hero = big(t.base || '🧍', 64);
        const meter = h('i', { style: { width: '50%' } });
        stage.replaceChildren(h('div.col', { style: { gap: '8px', margin: 'auto 0', userSelect: 'none' } }, h('div', { style: { height: '40px' } }), rig, hero, h('div.bar', { style: { marginTop: '20px' } }, meter), h('div.center.tiny.muted', {}, '⬅️ dokun · dokun ➡️')));
        let ang = 0, vel = 0, over = false, wob = 0;
        const limit = 34;
        const push = e => {
          const r = stage.getBoundingClientRect();
          const dir = e.clientX - r.left < r.width / 2 ? -1 : 1;
          vel += dir * (1.1 + api.ease * 0.4);
        };
        stage.addEventListener('pointerdown', push);
        api.onCleanup(() => stage.removeEventListener('pointerdown', push));
        const dur = (t.seconds || 22) * api.timeMul;
        const tm = api.timerLoop(t.seconds || 22, () => { if (!over) { over = true; resolve(pct(60 + clamp(1 - wob / (dur * 14), 0, 1) * 45)); } });
        api.loop(dt => {
          if (over) return;
          const el = tm.elapsed();
          const force = (Math.sin(el * 1.7) * 0.6 + Math.sin(el * 3.1 + 1) * 0.4) * (0.8 + api.diff * 1.4 + el / 20) ;
          vel += (force + ang * 0.06) * dt * 3;
          vel *= 0.985;
          ang += vel * dt * 20;
          wob += Math.abs(ang) * dt;
          rig.style.transform = `rotate(${ang}deg)`;
          meter.style.width = clamp(50 + ang / limit * 50, 0, 100) + '%';
          meter.style.background = Math.abs(ang) > limit * 0.7 ? '#ff5b7a' : '#3ddc97';
          if (Math.abs(ang) > limit) {
            over = true; tm.stop();
            rig.style.transform = `rotate(${ang > 0 ? 80 : -80}deg) translateY(40px)`;
            api.bad(t.fall || 'Devrildi! 💥');
            setTimeout(() => resolve(pct(el / (t.seconds || 22) * 75)), 700);
          }
        });
      });
    },
  });
}

// 5) HIZLI YAZIM — kelimenin harflerine sırayla dokun.
// t.words (Türkçe) / t.wordsEn (diğer diller)
export function typeGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || ['Üstteki kelimenin harflerine sırayla dokun.', 'Yanlış harf kelimeyi baştan başlatır.', '30 saniyede olabildiğince çok kelime.'],
    play(stage, api) {
      return new Promise(resolve => {
        const words = api.rng.shuffle((lang === 'tr' ? t.words : (t.wordsEn || t.words)).slice());
        const trAlpha = lang === 'tr' && !(t.latin === true || (t.latin === 'tr' && lang === 'tr'));
        const up = s => s.toLocaleUpperCase(trAlpha ? 'tr-TR' : 'en-US');
        let wi = 0, pos = 0, done = 0, over = false, word = '';
        const shown = h('div', { style: { fontSize: '30px', fontWeight: 900, textAlign: 'center', letterSpacing: '3px', minHeight: '44px' } });
        const keys = h('div.row', { style: { flexWrap: 'wrap', gap: '8px', justifyContent: 'center' } });
        stage.replaceChildren(h('div.col', { style: { gap: '18px', margin: 'auto 0' } }, big(t.icon, 40), shown, keys));
        const render = () => {
          shown.replaceChildren(...[...word].map((c, i) => h('span', { style: { color: i < pos ? '#3ddc97' : '#fff' } }, c)));
        };
        const nextWord = () => {
          if (wi >= words.length) { wi = 0; api.rng.shuffle(words); }
          word = up(words[wi++]); pos = 0; render();
          const letters = [...new Set([...word.replace(/\s/g, '')])];
          const pool = trAlpha ? 'ABCÇDEFGHIİKLMNOÖPRSŞTUÜVYZ' : 'ABCDEFGHIJKLMNOPRSTUVWY';
          while (letters.length < Math.min(12, letters.length + 3 + Math.round(api.diff * 3))) { const c = pool[api.rng.int(0, pool.length - 1)]; if (!letters.includes(c)) letters.push(c); }
          keys.replaceChildren(...api.rng.shuffle(letters).map(c => h('button.btn', { style: { width: '54px', height: '54px', fontSize: '20px', fontWeight: 900 }, onclick: () => tap(c) }, c)));
        };
        const tap = c => {
          if (over) return;
          while (word[pos] === ' ') pos++;
          if (c === word[pos]) { pos++; api.sfx.tap(); while (word[pos] === ' ') pos++; if (pos >= word.length) { done++; api.good('✓'); api.setScore(done); nextWord(); return; } }
          else { pos = 0; api.sfx.bad(); }
          render();
        };
        nextWord();
        api.timerLoop(30, () => { over = true; resolve(pct(done / (t.target || 7) * 100)); });
      });
    },
  });
}

// 6) DOĞRU ANDA ÇEK — hedef hareket eder, çerçevenin içindeyken dokun.
// t.target: emoji, t.frame: çerçeve etiketi, t.bg
export function aimGame(t) {
  register({
    id: t.id, name: t.name, icon: t.icon, tags: t.tags,
    how: t.how || ['Hedef ekranda dolaşıyor.', 'Tam çerçevenin içindeyken dokun!', `${t.shots || 6} deneme.`],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const shots = t.shots || 6;
        const box = h('div', { style: { position: 'relative', flex: 1, minHeight: '320px', borderRadius: '18px', background: t.bg || '#1b2a3a', overflow: 'hidden' } });
        const frame = h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '96px', height: '96px', transform: 'translate(-50%,-50%)', border: '3px solid rgba(255,255,255,.85)', borderRadius: '14px', boxShadow: '0 0 0 2000px rgba(0,0,0,.18)' } });
        const tgt = h('div', { style: { position: 'absolute', fontSize: '46px', transform: 'translate(-50%,-50%)', pointerEvents: 'none' } }, t.target);
        const flash = h('div', { style: { position: 'absolute', inset: 0, background: '#fff', opacity: 0, transition: 'opacity .25s', pointerEvents: 'none' } });
        box.append(...(t.decor || []).map((d, i) => h('div', { style: { position: 'absolute', fontSize: '30px', left: (10 + i * 23) % 90 + '%', top: (15 + i * 37) % 85 + '%', opacity: .5 } }, d)), frame, tgt, flash);
        const info = h('div.center.small', { style: { fontWeight: 800 } });
        stage.replaceChildren(h('div.col', { style: { gap: '10px', flex: 1 } }, info, box));
        let total = 0;
        for (let s = 0; s < shots; s++) {
          info.textContent = `${t.verb || '📸'} ${s + 1}/${shots}`;
          let x = api.rng.float(0.1, 0.9), y = api.rng.float(0.1, 0.9);
          let vx = api.rng.float(-1, 1), vy = api.rng.float(-1, 1);
          const sp = (0.35 + api.diff * 0.45 + s * 0.04) * (1 - api.ease * 0.3);
          let hit = null;
          const tap = () => { if (hit === null) hit = true; };
          box.addEventListener('pointerdown', tap);
          await new Promise(res => {
            let last = performance.now(), el = 0;
            const f = now => {
              const dt = Math.min(0.05, (now - last) / 1000); last = now; el += dt;
              if (api.rng.chance(dt * 1.2)) { vx += api.rng.float(-0.8, 0.8); vy += api.rng.float(-0.8, 0.8); }
              const n = Math.hypot(vx, vy) || 1; vx /= n; vy /= n;
              x += vx * sp * dt; y += vy * sp * dt;
              if (x < 0.06 || x > 0.94) { vx = -vx; x = clamp(x, 0.06, 0.94); }
              if (y < 0.06 || y > 0.94) { vy = -vy; y = clamp(y, 0.06, 0.94); }
              tgt.style.left = x * 100 + '%'; tgt.style.top = y * 100 + '%';
              if (hit || el > 9) res(); else requestAnimationFrame(f);
            };
            requestAnimationFrame(f);
          });
          box.removeEventListener('pointerdown', tap);
          const r = box.getBoundingClientRect();
          const dx = Math.abs(x - 0.5) * r.width, dy = Math.abs(y - 0.5) * r.height;
          const d = Math.max(dx, dy);
          const sc = !hit ? 0 : d < 18 ? 1 : d < 48 ? 0.7 : d < 80 ? 0.3 : 0;
          flash.style.opacity = hit ? '.7' : '0'; setTimeout(() => { flash.style.opacity = '0'; }, 120);
          sc >= 1 ? api.good(t.perfect || 'Tam kare! 📸') : sc >= 0.7 ? api.good('Güzel!') : api.bad(hit ? (t.miss || 'Bulanık çıktı 😅') : 'Kaçırdın!');
          total += sc; api.setScore(`${Math.round(total / (s + 1) * 100)}%`);
          await sleep(650);
        }
        resolve(pct(total / shots * 105));
      });
    },
  });
}
