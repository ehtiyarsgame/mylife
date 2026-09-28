// Finans sekmesi: net servet, banka (mevduat, kredi), borsa ve gayrimenkul.
import { h, btn, sheet, toast, bar, confirmBox } from './dom.js';
import { app, save } from './app.js';
import { sfx } from '../core/audio.js';
import { fmtTL, fmtPct, clamp } from '../core/util.js';
import { T } from '../core/i18n.js';
import { RNG } from '../core/rng.js';
import { CONFIG } from '../config.js';
import { JOBS } from '../sim/careers.js';
import * as Y from '../sim/year.js';
import {
  STOCKS, SECTORS, CYCLES, stockById, initMarket, portfolioValue, buyStock, sellStock, COMMISSION,
  bankOf, scoreLabel, loanRate, loanLimit, loanDebt, yearlyIncome, takeLoan, payOffLoan, annuity,
  housePrice, buyHouse, sellHouse, housesValue, netWorth, lifestyleOf,
} from '../sim/finance.js';

const S = () => app.life;
const pct = (v, d = 1) => fmtPct(v, d, true);
const riskOf = st => st.vol >= 0.4 ? ['Yüksek risk', '#ff9db0'] : st.vol >= 0.25 ? ['Orta risk', '#ffb547'] : ['Düşük risk', '#8ff0c4'];

// Küçük fiyat grafiği (son 12 yıl)
function spark(hist, w = 64, hgt = 22) {
  const mn = Math.min(...hist), mx = Math.max(...hist);
  const pts = hist.map((p, i) => `${(i / Math.max(1, hist.length - 1) * w).toFixed(1)},${(hgt - (p - mn) / (mx - mn || 1) * hgt).toFixed(1)}`).join(' ');
  const up = hist[hist.length - 1] >= hist[0];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', w); svg.setAttribute('height', hgt); svg.setAttribute('viewBox', `0 0 ${w} ${hgt}`);
  const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  pl.setAttribute('points', pts); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', up ? '#3ddc97' : '#ff5b7a'); pl.setAttribute('stroke-width', '2');
  svg.append(pl);
  return svg;
}

export function financeTab(render) {
  const s = S();
  const out = [];
  if (s.age < 18) {
    out.push(h('div.sec-title', {}, '📈 Finans'));
    out.push(h('div.card', {}, h('p.small', { style: { margin: 0 } }, '18 yaşında banka hesabı açabilir, kredi çekebilir ve borsada yatırım yapabilirsin.'), s.savings > 0 ? h('div.sum-line', { style: { borderBottom: 0 } }, '🏦 Adına açılan hesap', h('b', {}, fmtTL(s.savings))) : null));
    return out;
  }
  const M = initMarket(s, new RNG(`${s.seed}-mk-${s.age}`));
  const B = bankOf(s);
  const pv = portfolioValue(s), hv = housesValue(s), debt = loanDebt(s);

  // ——— Net servet ———
  out.push(h('div.sec-title', {}, '💎 Servetin'));
  out.push(h('div.card', {},
    h('div.sum-line', {}, '💵 Nakit', h('b', { class: s.money >= 0 ? '' : 'neg' }, fmtTL(s.money))),
    h('div.sum-line', {}, '🏦 Vadeli mevduat', h('b', {}, fmtTL(s.savings || 0))),
    h('div.sum-line', {}, '📈 Hisse ve fonlar', h('b', {}, fmtTL(pv))),
    hv ? h('div.sum-line', {}, '🏠 Gayrimenkul', h('b', {}, fmtTL(hv))) : null,
    debt ? h('div.sum-line', {}, '💳 Kredi borcu', h('b.neg', {}, '−' + fmtTL(debt))) : null,
    h('div.sum-line', { style: { borderBottom: 0 } }, h('b', {}, 'Net servet'), h('b', { class: netWorth(s) >= 0 ? 'pos' : 'neg' }, fmtTL(netWorth(s)))),
    h('div.tiny.muted', { style: { margin: '10px 0 6px' } }, 'Yaşam tarzın: gelirin arttıkça harcamaların da büyür. Lüks yaşam mutluluk verir ama birikimi eritir.'),
    h('div.seg', {}, Object.entries(CONFIG.lifestyle).map(([k, L]) =>
      h('button' + ((s.lifestyle || 'normal') === k ? '.on' : ''), { style: { fontSize: '12px', padding: '8px 4px' }, onclick: () => { s.lifestyle = k; save(); render(); } }, `${L.icon} ${L.name}`))),
    h('div.tiny.muted', { style: { marginTop: '6px' } }, T('Temel giderin 3 katını aşan gelirin {p} kadarı yaşam standardına gider (araba, tatil, restoran).', { p: fmtPct(lifestyleOf(s).rate) }))));

  // ——— Banka ———
  const dep = p => { const amt = Y.depositSavings(s, Math.max(0, s.money) * p); if (amt > 0) { sfx.coin(); toast(`🏦 ${fmtTL(amt)} mevduata yatırıldı.`); save(); render(); } };
  const income = yearlyIncome(s, JOBS, Y.levelMult);
  const limit = loanLimit(s, income);
  out.push(h('div.sec-title', {}, '🏦 Banka'));
  out.push(h('div.card', {},
    h('div.row', {}, h('b.grow', {}, 'Vadeli mevduat'), h('span.chip.green', {}, 'Enflasyon + %3')),
    h('div.sum-line', {}, 'Hesaptaki para', h('b', {}, fmtTL(s.savings || 0))),
    h('div.row', { style: { gap: '6px', marginTop: '8px' } },
      btn(T('{p} yatır', { p: fmtPct(0.25) }), () => dep(0.25), 'sm grow' + (s.money > 0 ? '' : ' disabled')),
      btn(fmtPct(0.5), () => dep(0.5), 'sm' + (s.money > 0 ? '' : ' disabled')),
      btn('Tümü', () => dep(1), 'sm' + (s.money > 0 ? '' : ' disabled')),
      btn('Çek', () => { Y.withdrawSavings(s, s.savings); sfx.coin(); save(); render(); }, 'ghost sm' + (s.savings > 0 ? '' : ' disabled'))),
    h('div.tiny.muted', { style: { marginTop: '6px' } }, 'Güvenli liman: enflasyona karşı korur ama borsa kadar kazandırmaz.')));
  out.push(h('div.card', { style: { marginTop: '10px' } },
    h('div.row', {}, h('b.grow', {}, 'Kredi notu'), h('span.chip', {}, `${Math.round(B.score)} · ${scoreLabel(B.score)}`)),
    h('div.bar', { style: { marginTop: '6px' } }, h('i', { style: { width: B.score + '%', background: B.score >= 60 ? '#3ddc97' : B.score >= 35 ? '#ffb547' : '#ff5b7a' } })),
    h('div.tiny.muted', { style: { margin: '6px 0' } }, 'Taksitleri zamanında ödedikçe not yükselir; borçlanmak ve iflas notu düşürür. Not yükseldikçe faiz düşer, limit artar.'),
    h('div.sum-line', {}, 'Kredi faizi (yıllık)', h('b', {}, fmtPct(loanRate(s), 1))),
    h('div.sum-line', {}, 'Kullanılabilir limit', h('b', {}, fmtTL(limit))),
    ...B.loans.map((L, i) => h('div.tile', { style: { marginTop: '6px' } },
      h('div.row', {}, h('b.grow', {}, L.kind === 'konut' ? '🏠 Konut kredisi' : '💳 İhtiyaç kredisi'), btn('Kapat', async () => {
        if (s.money < L.left) { toast('Borcu kapatacak kadar nakdin yok.'); return; }
        if (await confirmBox('Krediyi kapat', `${fmtTL(L.left)} ödenecek.`, 'Öde')) { payOffLoan(s, i); sfx.coin(); save(); render(); }
      }, 'sm')),
      h('div.tiny.muted', {}, `Kalan borç ${fmtTL(L.left)} · yıllık taksit ${fmtTL(L.pay)} · faiz ${fmtPct(L.rate, 1)}`))),
    h('div.btns', {}, btn('💳 Kredi çek', () => loanSheet(render, limit), 'block' + (limit > 1000 ? '' : ' disabled')))));

  // ——— Borsa ———
  out.push(h('div.sec-title', {}, '📈 Borsa'));
  const C = CYCLES[M.cycle];
  out.push(h('div.card', {},
    h('div.row', {}, h('span', { style: { fontSize: '26px' } }, C.icon), h('div.grow', {}, h('b', {}, C.name), h('div.tiny.muted', {}, M.lastYear ? `Geçen yıl endeks ${pct(M.lastYear.ret.ENDX)}` : 'Yeni yıl, yeni fırsatlar'))),
    M.news.length ? h('div', { style: { marginTop: '8px' } }, M.news.slice(0, 4).map(n => h('div.small', { style: { color: n.up ? '#8ff0c4' : '#ff9db0', padding: '2px 0' } }, (n.up ? '▲ ' : '▼ ') + n.t))) : null,
    h('div.tile', { style: { marginTop: '10px' } },
      h('b', {}, '🔮 Gelecek yıl için ipuçları'),
      M.hints ? h('div', {}, M.hints.list.map(x => h('div.small', { style: { color: x.up === true ? '#8ff0c4' : x.up === false ? '#ff9db0' : '' } }, x.text)), h('div.tiny.muted', {}, `Analiz başarın ${Math.round(M.hints.perf)}/100: yüksekse ipuçları daha isabetli. Yine de garantisi yok!`))
        : h('div.tiny.muted', {}, '"Piyasa analizi" eylemiyle (Ticaret) gelecek yılın görünümüne dair ipucu topla.')),
    h('div.tiny.muted', { style: { marginTop: '8px' } }, T('Fiyatlar yıl sonunda değişir. Her al-satta {p} komisyon ödersin. Hisseler temettü (kâr payı) da öder.', { p: fmtPct(COMMISSION, 1) }))));

  const held = Object.keys(s.portfolio || {});
  if (held.length) {
    out.push(h('div.card', { style: { marginTop: '10px' } },
      h('b', {}, `💼 Portföyün · ${fmtTL(pv)}`),
      ...held.map(id => {
        const p = s.portfolio[id], st = stockById[id];
        const val = p.qty * M.prices[id], pl = val / p.cost - 1;
        return h('button.opt', { style: { marginTop: '6px' }, onclick: () => tradeSheet(render, id) },
          h('div.grow', {}, h('div', {}, `${st.name} (${id})`), h('div.tiny.muted', {}, `${p.qty.toLocaleString('tr-TR')} adet · ${fmtTL(val)}`)),
          h('b', { class: pl >= 0 ? 'pos' : 'neg' }, pct(pl)));
      })));
  }
  const bySec = {};
  for (const st of STOCKS) (bySec[st.sector] ||= []).push(st);
  out.push(h('div.card', { style: { marginTop: '10px' } },
    h('b', {}, '🧾 Hisseler ve fonlar'),
    ...Object.entries(bySec).map(([sec, list]) => h('div', {},
      h('div.tiny.muted', { style: { margin: '10px 0 4px', fontWeight: 800 } }, `${SECTORS[sec].icon} ${SECTORS[sec].name}`),
      ...list.map(st => {
        const hist = M.hist[st.id];
        const ch = hist.length > 1 ? hist[hist.length - 1] / hist[hist.length - 2] - 1 : 0;
        return h('button.opt', { style: { marginTop: '4px', padding: '8px 10px' }, onclick: () => tradeSheet(render, st.id) },
          h('div.grow', {}, h('div.small', {}, st.name), h('div.tiny.muted', {}, `${st.id} · ${fmtTL(M.prices[st.id])}`)),
          spark(hist),
          h('b.small', { class: ch >= 0 ? 'pos' : 'neg', style: { minWidth: '58px', textAlign: 'right' } }, hist.length > 1 ? pct(ch) : '—'));
      })))));

  // ——— Gayrimenkul ———
  out.push(h('div.sec-title', {}, '🏠 Gayrimenkul'));
  out.push(h('div.card', {},
    ...(s.houses || []).map((H, i) => h('div.tile', { style: { marginBottom: '6px' } },
      h('div.row', {}, h('b.grow', {}, H.kind === 'ev' ? '🏡 Oturduğun ev' : '🏢 Kiralık daire'), btn('Sat', async () => {
        if (await confirmBox('Satış', `${fmtTL(H.value * 0.97)} (masraflar düşüldü) karşılığında satılsın mı?`, 'Sat')) { sellHouse(s, i); sfx.coin(); save(); render(); }
      }, 'ghost sm')),
      h('div.tiny.muted', {}, `Değeri ${fmtTL(H.value)} · alış ${fmtTL(H.bought)} (${pct(H.value / H.bought - 1, 0)})${H.kind === 'kira' ? ` · yıllık kira ≈ ${fmtTL(H.value * 0.045)}` : ''}`))),
    s.flags.evSahibi && !(s.houses || []).some(x => x.kind === 'ev') ? h('div.small', { style: { marginBottom: '6px' } }, '🏡 Kendi evinde oturuyorsun (kira ödemiyorsun).') : null,
    houseOffer(render, 'ev', '🏡 Oturmak için ev', 'Kira ödemezsin: yaşam giderin %20 düşer. Ev fiyatları genelde enflasyonun biraz üstünde artar.'),
    houseOffer(render, 'kira', '🏢 Kiralık daire (yatırım)', 'Her yıl değerinin ≈%4,5\'i kadar kira getirir; değeri de artabilir.')));
  return out;
}

function houseOffer(render, kind, title, desc) {
  const s = S();
  if (kind === 'ev' && s.flags.evSahibi) return null;
  const price = housePrice(s, kind);
  const cashOk = s.money >= price;
  const down = price * 0.3;
  const loanOk = s.money >= down && loanLimit(s, yearlyIncome(s, JOBS, Y.levelMult)) * 2.5 >= price * 0.7;
  return h('div.tile', { style: { marginTop: '6px' } },
    h('b', {}, title), h('div.tiny.muted', {}, desc),
    h('div.sum-line', {}, 'Fiyat', h('b', {}, fmtTL(price))),
    h('div.row', { style: { gap: '6px', marginTop: '6px' } },
      btn('Peşin al', async () => {
        if (await confirmBox(title, `${fmtTL(price)} ödenecek.`, 'Satın al')) { buyHouse(s, kind); sfx.level(); Y.log(s, kind === 'ev' ? 'Kendi evini satın aldı.' : 'Yatırım için bir daire aldı.', 'rare'); save(); render(); }
      }, 'sm grow' + (cashOk ? '' : ' disabled')),
      btn('%30 peşin + kredi', async () => {
        const pay = annuity(price * 0.7, loanRate(s) - 0.03, 15);
        if (await confirmBox(title, `Peşinat ${fmtTL(down)}, kalan ${fmtTL(price * 0.7)} 15 yıllık konut kredisi (yıllık taksit ≈ ${fmtTL(pay)}).`, 'Satın al')) {
          buyHouse(s, kind, 0.7, 15); sfx.level(); Y.log(s, kind === 'ev' ? 'Konut kredisiyle ev aldı.' : 'Kredili yatırım dairesi aldı.', 'rare'); save(); render();
        }
      }, 'sm grow' + (loanOk ? '' : ' disabled'))),
    !cashOk && !loanOk ? h('div.tiny', { style: { color: '#ff9db0', marginTop: '4px' } }, `Peşinat için en az ${fmtTL(down)} nakit ve yeterli gelir/kredi notu gerekir.`) : null);
}

async function loanSheet(render, limit) {
  const s = S();
  let amt = Math.round(limit * 0.5), years = 5;
  await sheet(close => {
    const box = h('div');
    const draw = () => {
      const rate = loanRate(s), pay = annuity(amt, rate, years);
      box.replaceChildren(
        h('h2', {}, '💳 İhtiyaç kredisi'),
        h('p.small.muted', {}, 'Kredi parası hemen nakdine geçer. Taksitler her yıl sonunda otomatik ödenir; ödeyemezsen notun düşer.'),
        h('div.sum-line', {}, 'Tutar', h('b', {}, fmtTL(amt))),
        h('div.seg', {}, [0.25, 0.5, 1].map(p => h('button' + (Math.abs(amt - limit * p) < 1 ? '.on' : ''), { onclick: () => { amt = Math.round(limit * p); draw(); } }, fmtPct(p)))),
        h('div.sum-line', { style: { marginTop: '8px' } }, 'Vade', h('b', {}, `${years} yıl`)),
        h('div.seg', {}, [1, 3, 5, 10].map(y => h('button' + (years === y ? '.on' : ''), { onclick: () => { years = y; draw(); } }, `${y} yıl`))),
        h('div.sum-line', { style: { marginTop: '8px' } }, 'Faiz', h('b', {}, fmtPct(rate, 1))),
        h('div.sum-line', {}, 'Yıllık taksit', h('b', {}, fmtTL(pay))),
        h('div.sum-line', { style: { borderBottom: 0 } }, 'Toplam geri ödeme', h('b.neg', {}, fmtTL(pay * years))),
        h('div.btns', {}, btn('Vazgeç', () => close(), 'ghost'), btn('Krediyi çek', () => { takeLoan(s, amt, years); sfx.coin(); Y.log(s, `${fmtTL(amt)} kredi çekti.`); save(); close(); render(); }, 'primary')));
    };
    draw();
    return box;
  });
}

async function tradeSheet(render, id) {
  const s = S();
  const M = s.market, st = stockById[id];
  await sheet(close => {
    const box = h('div');
    const draw = () => {
      const price = M.prices[id], p = s.portfolio[id];
      const [risk, rc] = riskOf(st);
      const canBuy = n => Math.floor(Math.max(0, s.money) * n / (price * (1 + COMMISSION)));
      const doBuy = n => { const q = canBuy(n); if (q > 0 && buyStock(s, id, q)) { sfx.coin(); toast(`✅ ${q.toLocaleString('tr-TR')} adet ${st.id} alındı.`); save(); draw(); render(); } };
      const doSell = n => { const q = Math.floor((p?.qty || 0) * n); if (q > 0) { const got = sellStock(s, id, q); sfx.coin(); toast(`💵 ${fmtTL(got)} nakde geçti.`); save(); draw(); render(); } };
      const hist = M.hist[id];
      box.replaceChildren(
        h('div.row', {}, h('span', { style: { fontSize: '30px' } }, SECTORS[st.sector].icon), h('div.grow', {}, h('h2', {}, st.name), h('div.small.muted', {}, `${st.id} · ${SECTORS[st.sector].name}`))),
        h('div.row', { style: { margin: '10px 0' } }, spark(hist, 200, 50), h('div.grow'), h('b', { style: { fontSize: '20px' } }, fmtTL(price))),
        h('div.sum-line', {}, 'Risk', h('b', { style: { color: rc } }, risk)),
        h('div.sum-line', {}, 'Temettü verimi', h('b', {}, st.div ? T('{p} / yıl', { p: fmtPct(st.div) }) : 'Yok')),
        hist.length > 1 ? h('div.sum-line', {}, `${hist.length - 1} yıllık değişim`, h('b', { class: price >= hist[0] ? 'pos' : 'neg' }, pct(price / hist[0] - 1, 0))) : null,
        p ? h('div.sum-line', {}, 'Elindeki', h('b', {}, `${p.qty.toLocaleString('tr-TR')} adet · ${fmtTL(p.qty * price)} (${pct(p.qty * price / p.cost - 1)})`)) : null,
        h('div.tiny.muted', { style: { margin: '6px 0' } }, st.crypto ? 'Kripto çok oynaktır: bir yılda yarıya da inebilir, katlanabilir de.' : st.bond ? 'Tahvil güvenlidir; getirisi enflasyonun biraz üstündedir.' : st.haven ? 'Altın krizlerde değer kazanma eğilimindedir (güvenli liman).' : st.fund ? 'Fon, riski birçok şirkete yayar.' : 'Tek şirket riski: haberler fiyatı sert etkileyebilir. Riskini dağıt!'),
        h('div.small', { style: { fontWeight: 800, marginTop: '8px' } }, `Al (nakit ${fmtTL(Math.max(0, s.money))})`),
        h('div.row', { style: { gap: '6px' } }, [0.1, 0.25, 0.5, 1].map(n => btn(fmtPct(n), () => doBuy(n), 'sm grow' + (canBuy(n) > 0 ? '' : ' disabled')))),
        p ? h('div.small', { style: { fontWeight: 800, marginTop: '10px' } }, 'Sat') : null,
        p ? h('div.row', { style: { gap: '6px' } }, [0.25, 0.5, 1].map(n => btn(n === 1 ? 'Tümünü sat' : fmtPct(n), () => doSell(n), 'sm grow ghost'))) : null,
        h('div.btns', {}, btn('Kapat', () => close(), 'ghost block')));
    };
    draw();
    return box;
  });
}
