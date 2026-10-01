// Görsel tamir oyunları: makinenin resmi üzerinde parçalar yerinde durur. Müşteri şikâyetini anlatır ya da
// usta bir parça ister; oyuncu resimde doğru parçaya dokunur. Öğrenilmemiş parçaların adı resimde yazar,
// öğrendikçe isimler kalkar. Yanlış dokunulan parçanın adı da gösterilir: okumadan, dokunarak öğrenilir.
import { register } from './engine.js';
import { h } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';
import { lang, B } from '../core/i18n.js';
import { MACHINES, LEARNED_AT } from '../sim/repairData.js';

const L = a => (lang === 'tr' ? a[0] : a[1]);
const TX = {
  how1: ['Makinenin resmi açılır; parçalar yerlerinde durur.', 'The machine opens up; every part sits in its real place.'],
  how2: ['Müşteri derdini anlatır ya da usta bir parça ister: resimde doğru parçaya dokun.', 'A customer describes the problem or the master asks for a part: tap the right part on the picture.'],
  how3: ['Bilmediğin parçaların adı altında yazar; öğrendikçe isimler kalkar. 6 iş.', "Parts you don't know yet are labelled; the labels vanish as you learn. 6 jobs."],
  cust: ['Müşteri', 'Customer'], master: ['Usta', 'Master'],
  ask: [n => `${n} nerede? Göster bakalım!`, n => `Where's the ${n.toLowerCase()}? Show me!`],
  which: ['Hangi parça bozuk?', 'Which part is faulty?'],
  learned: ['öğrenildi', 'learned'], newT: ['Yeni terim!', 'New term!'],
  bravo: ['Aferin çırak!', 'Well done, apprentice!'], notThat: ['O değil', 'Not that one'],
};

function boardBg(b) {
  const base = { position: 'absolute', inset: 0, borderRadius: '18px', background: b.bg || '#1f2a3a', overflow: 'hidden' };
  const kids = [];
  if (b.emoji) kids.push(h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '230px', opacity: 0.16 } }, b.emoji));
  if (b.shape === 'fridge') kids.push(h('div', { style: { position: 'absolute', left: '14%', right: '14%', top: '3%', bottom: '3%', border: '4px solid rgba(255,255,255,.25)', borderRadius: '14px' } },
    h('div', { style: { position: 'absolute', left: 0, right: 0, top: '38%', borderTop: '4px solid rgba(255,255,255,.2)' } })));
  if (b.shape === 'washer') kids.push(h('div', { style: { position: 'absolute', left: '10%', right: '10%', top: '4%', bottom: '4%', border: '4px solid rgba(255,255,255,.25)', borderRadius: '14px' } },
    h('div', { style: { position: 'absolute', left: '22%', right: '22%', top: '22%', aspectRatio: '1', border: '6px solid rgba(255,255,255,.2)', borderRadius: '50%' } })));
  if (b.shape === 'bench') kids.push(h('div', { style: { position: 'absolute', inset: '4%', background: 'repeating-linear-gradient(0deg,#5a3f26 0 22px,#4a331e 22px 24px)', borderRadius: '12px', opacity: .55 } }));
  return h('div', { style: base }, kids);
}

export function repairGame(t) {
  const M = MACHINES[t.machine];
  register({
    id: t.id, name: t.name, icon: t.icon || M.icon, tags: ['tamir', ...(t.tags || [])], at: t.at, ages: t.ages,
    how: [B(...TX.how1), B(...TX.how2), B(...TX.how3)],
    play(stage, api) {
      return new Promise(async resolve => {
        api.hideTimer();
        const terms = api.extra.terms || {};
        const known = id => (terms[id] || 0) >= LEARNED_AT;
        let pts = 0;
        const rounds = 6;
        // Öğretici sıra: bilinmeyenler önce sorulur
        const askOrder = api.rng.shuffle(M.parts.slice()).sort((a, b) => (terms[a.id] || 0) - (terms[b.id] || 0));
        const faults = api.rng.shuffle(M.faults.slice());
        for (let r = 0; r < rounds; r++) {
          const useFault = faults.length && (r % 2 === 0 || !askOrder.length);
          const f = useFault ? faults.pop() : null;
          const target = f ? M.parts.find(p => p.id === f.p) : askOrder.shift() || api.rng.pick(M.parts);
          const got = await new Promise(res => {
            let tries = 0, fin = false;
            const board = h('div', { style: { position: 'relative', height: '380px', touchAction: 'manipulation' } }, boardBg(M.board));
            const pop = h('div', { style: { position: 'absolute', left: '6%', right: '6%', bottom: '4%', padding: '10px 12px', borderRadius: '14px', background: 'rgba(10,13,28,.92)', border: '1px solid var(--line)', display: 'none', zIndex: 5, textAlign: 'center' } });
            board.append(pop);
            const btns = M.parts.map(p => {
              const lbl = h('div', { style: { fontSize: '10.5px', fontWeight: 800, lineHeight: 1.1, marginTop: '2px', color: '#fff', textShadow: '0 1px 3px #000', whiteSpace: 'nowrap', visibility: known(p.id) ? 'hidden' : 'visible' } }, L(p.n));
              const ic = h('div', { style: { width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', transition: 'transform .15s, background .2s' } }, p.icon);
              const el = h('button', { style: { position: 'absolute', left: p.x + '%', top: p.y + '%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 0, padding: 0, zIndex: 2 },
                onclick: () => {
                  if (fin) return;
                  if (p.id === target.id) {
                    fin = true; ic.style.background = '#2f9e6e'; ic.style.transform = 'scale(1.25)'; api.sfx.good();
                    const first = tries === 0;
                    const before = terms[p.id] || 0;
                    if (first) terms[p.id] = before + 1;
                    const newlyLearned = first && before + 1 === LEARNED_AT;
                    pop.replaceChildren(h('div', { style: { fontSize: '30px' } }, p.icon), h('b', { style: { fontSize: '17px' } }, L(p.n)), h('div.small.muted', {}, L(p.d)),
                      ...(newlyLearned ? [h('div.small', { style: { color: '#3ddc97', fontWeight: 900, marginTop: '4px' } }, `⭐ ${L(TX.learned)}!`)] : []));
                    pop.style.display = 'block';
                    api.good(first ? L(TX.bravo) : '👍');
                    setTimeout(() => res(first ? 1 : 0.5), 1500);
                  } else {
                    tries++; api.bad(`${p.icon} ${L(p.n)} · ${L(TX.notThat)}`);
                    lbl.style.visibility = 'visible'; ic.style.background = 'rgba(255,91,122,.4)';
                    if (tries >= 2) { fin = true; btns.find(b => b.id === target.id).ic.style.background = '#c98a1e'; btns.find(b => b.id === target.id).lbl.style.visibility = 'visible';
                      pop.replaceChildren(h('div', { style: { fontSize: '30px' } }, target.icon), h('b', { style: { fontSize: '17px' } }, L(target.n)), h('div.small.muted', {}, L(target.d)));
                      pop.style.display = 'block'; setTimeout(() => res(0), 2000); }
                  }
                } }, ic, lbl);
              board.append(el);
              return { id: p.id, ic, lbl };
            });
            const who = f ? `🧑 ${L(TX.cust)}` : `👨‍🔧 ${L(TX.master)}`;
            const say = f ? `"${L(f.s)}"` : `"${L(TX.ask)(L(target.n))}"`;
            stage.replaceChildren(h('div.col', { style: { gap: '8px' } },
              h('div.row', {}, h('span.chip.accent', {}, `${r + 1}/${rounds}`), h('span.grow'), h('span', { style: { fontSize: '22px' } }, M.icon)),
              h('div.qcard', { style: { flexDirection: 'column', gap: '4px', fontSize: '15px', minHeight: '86px', padding: '10px' } },
                f ? h('div', { style: { fontSize: '28px', letterSpacing: '4px' } }, f.ic) : h('div', { style: { fontSize: '30px' } }, known(target.id) ? '❓' : target.icon),
                h('div.tiny.muted', {}, who), h('div', { style: { fontWeight: 800 } }, say), f ? h('div.tiny', { style: { color: '#ffd27a' } }, L(TX.which)) : null),
              board));
          });
          pts += got * (100 / rounds); api.setScore(Math.round(pts));
          await sleep(200);
        }
        resolve(Math.round(clamp(pts, 0, 100)));
      });
    },
  });
}

// ——— Tamir oyunları ———
const C = ['job:cirak'];
repairGame({ id: 'oto_tamir', name: B('Oto Sanayi', "Car Workshop"), machine: 'araba', at: [...C, 'tamir'], ages: [10, 99] });
repairGame({ id: 'buzdolabi_tamir', name: B('Buzdolabı Servisi', "Fridge Repair"), machine: 'buzdolabi', at: C });
repairGame({ id: 'camasir_tamir', name: B('Çamaşır Makinesi Servisi', "Washing-Machine Repair"), machine: 'camasir', at: C });
repairGame({ id: 'tesisat_tamir', name: B('Su Tesisatı', "Plumbing Job"), machine: 'tesisat', at: [...C, 'ev_isi'], ages: [12, 99] });
repairGame({ id: 'elektrik_tamir', name: B('Elektrik Arızası', "Electrical Fault"), machine: 'elektrik', at: [...C, 'job:muhendis'] });
repairGame({ id: 'usta_alet', name: B('Usta Ne İstedi?', "What Did the Master Ask For?"), icon: '🧰', machine: 'aletler', at: [...C, 'tamir', 'job:isci'] });
