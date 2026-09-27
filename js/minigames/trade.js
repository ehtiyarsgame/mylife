import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, sleep, fmtNum } from '../core/util.js';

const kr = v => (v / 100).toLocaleString('tr-TR', { minimumFractionDigits: v % 100 ? 2 : 0, maximumFractionDigits: 2 }) + ' TL';

// ————————————————— PARA ÜSTÜ —————————————————
const ITEMS = [['🍞', 'Ekmek', 1000], ['🥛', 'Süt', 3250], ['🧀', 'Peynir', 12500], ['🍫', 'Çikolata', 2750], ['🥚', 'Yumurta (10)', 6500], ['🍎', 'Elma (1 kg)', 4500], ['📓', 'Defter', 3500], ['🖊️', 'Kalem', 1250], ['🧃', 'Meyve suyu', 2200], ['🍪', 'Bisküvi', 1850], ['🫒', 'Zeytin', 9800], ['🧴', 'Şampuan', 8900]];
const DENOMS = [[20000, '200', 'bill b3'], [10000, '100', 'bill b2'], [5000, '50', 'bill b2'], [2000, '20', 'bill'], [1000, '10', 'bill'], [500, '5', 'bill'], [100, '1', 'coin'], [50, '50kr', 'coin'], [25, '25kr', 'coin'], [10, '10kr', 'coin']];
register({
  id: 'paraustu', name: 'Para Üstü', icon: '🪙',
  how: ['Müşteri alışveriş yaptı ve parasını uzattı.', 'Banknot ve bozukluklarla tam para üstünü oluştur, "Ver"e bas.', 'Zor seviyelerde toplam yazmaz: fiyatları kafadan topla!', '5 müşteri; hızlı ve doğru olmak puan getirir.'],
  play(stage, api) {
    return new Promise(async resolve => {
      let pts = 0;
      const showTotal = api.diff < 0.55;
      const cents = api.diff > 0.3;
      for (let i = 0; i < 5; i++) {
        const n = clamp(1 + Math.round(api.diff * 2) + api.rng.int(0, 1), 1, 4);
        const items = api.rng.shuffle(ITEMS).slice(0, n).map(([e, name, p]) => [e, name, cents ? p : Math.round(p / 1000) * 1000 || 1000]);
        const total = items.reduce((a, b) => a + b[2], 0);
        const paid = [5000, 10000, 20000, 50000].find(v => v > total) || 100000;
        const change = paid - total;
        const r = await new Promise(res => {
          const given = [];
          let done = false;
          const sum = () => given.reduce((a, b) => a + b, 0);
          const out = h('div.center', { style: { fontSize: '22px', fontWeight: 900 } });
          const upd = () => { out.textContent = 'Verilen: ' + kr(sum()); };
          const give = v => { if (done) return; given.push(v); api.sfx.coin(); upd(); };
          stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
            h('div.row', {}, h('span.chip.accent', {}, `Müşteri ${i + 1}/5`), h('span.grow')),
            h('div.tile', {},
              ...items.map(([e, nm, p]) => h('div.row', { style: { justifyContent: 'space-between' } }, h('span', {}, e, ' ', nm), h('b', {}, kr(p)))),
              h('div.row', { style: { justifyContent: 'space-between', borderTop: '1px solid var(--line)', marginTop: '6px', paddingTop: '6px' } }, h('span', {}, 'Toplam'), h('b', {}, showTotal ? kr(total) : '??')),
              h('div.row', { style: { justifyContent: 'space-between' } }, h('span', {}, '💵 Müşteri verdi'), h('b', { style: { color: '#8ff0c4' } }, kr(paid)))),
            out,
            h('div.pill-btns', {}, DENOMS.filter(([v]) => v < paid).map(([v, l, cls]) => h('button.' + cls.split(' ').join('.'), { onclick: () => give(v) }, l))),
            h('div.row', {}, btn('↩ Geri al', () => { given.pop(); upd(); }, 'grow'), btn('Ver ✔', () => submit(), 'green grow'))));
          upd();
          const tl = api.timerLoop((16 - api.diff * 5 + api.ease * 4 + n * 2) , () => submit(true));
          const submit = (timeout) => {
            if (done) return; done = true; tl.stop();
            if (sum() === change) { api.good('Doğru!'); res(20 * (0.6 + 0.4 * tl.left())); }
            else { api.bad(timeout ? 'Süre doldu' : `Doğrusu ${kr(change)}`); res(sum() > change ? -2 : 0); }
          };
        });
        pts += r; api.setScore(Math.round(pts));
        await sleep(700);
      }
      resolve(clamp(pts, 0, 100));
    });
  },
});

// ————————————————— PAZARLIK —————————————————
const DEALS = [['İkinci el tezgâh', 18000], ['Dükkân kirası (aylık)', 45000], ['Kamyonet', 650000], ['Toptan kumaş', 120000], ['Tarla traktörü', 900000], ['Depo kirası (aylık)', 80000]];
register({
  id: 'pazarlik', name: 'Pazarlık', icon: '🤝',
  how: ['Satıcı bir fiyat söyler; aklındaki en düşük fiyatı gizler.', 'Kaydırıcıyla teklif ver. Çok düşük teklif sabrını hızla bitirir!', 'Yüz ifadesini ve sözlerini oku. Sabır biterse masadan kalkar.', 'Gizli taban fiyata ne kadar yaklaşırsan o kadar iyi.'],
  play(stage, api) {
    return new Promise(resolve => {
      const [item, base] = api.extra.deal || api.rng.pick(DEALS);
      const P0 = Math.round(base * api.rng.float(0.9, 1.15) / 100) * 100;
      const R = Math.round(P0 * api.rng.float(0.62, 0.8) / 100) * 100;
      let C = P0, patience = 100, round = 0, done = false, lastOffer = 0;
      const face = h('div.face', {}, '🙂');
      const say = h('div.qcard', { style: { fontSize: '15px', minHeight: '64px' } });
      const patBar = h('i', { style: { width: '100%', background: '#3ddc97' } });
      const offerLbl = h('div.center', { style: { fontSize: '26px', fontWeight: 900 } });
      const slider = h('input.slider', { type: 'range', min: Math.round(P0 * 0.4), max: P0, step: Math.max(100, Math.round(P0 / 200)), value: Math.round(P0 * 0.7) });
      const upd = () => { offerLbl.textContent = fmtNum(+slider.value) + ' TL'; };
      slider.addEventListener('input', upd);
      const counterLbl = h('b');
      const mood = () => {
        face.textContent = patience > 70 ? '🙂' : patience > 45 ? '😐' : patience > 20 ? '😠' : '🤬';
        patBar.style.width = patience + '%'; patBar.style.background = patience > 45 ? '#3ddc97' : patience > 20 ? '#ffb547' : '#ff5b7a';
        counterLbl.textContent = fmtNum(C) + ' TL';
      };
      const finish = price => {
        if (done) return; done = true;
        if (price === null) { api.bad('Satıcı masadan kalktı'); setTimeout(() => resolve(15), 900); return; }
        const ratio = clamp((P0 - price) / Math.max(1, P0 - R), 0, 1.1);
        api.good(`Anlaştınız: ${fmtNum(price)} TL`);
        say.textContent = `🤝 Anlaşma ${fmtNum(price)} TL. (Satıcının gizli tabanı ${fmtNum(R)} TL idi.)`;
        setTimeout(() => resolve(clamp(30 + 70 * ratio, 0, 100)), 1500);
      };
      const offer = () => {
        if (done) return;
        const O = +slider.value; round++;
        api.sfx.tap();
        if (O >= C) return finish(O);
        const insult = Math.max(0, (R - O) / P0);
        if (O >= R && (patience < 35 || api.rng.chance(0.25 + (O - R) / Math.max(1, C - R) * 0.6))) return finish(O);
        patience -= 10 + insult * 90 + api.diff * 6 - api.ease * 4 + (O <= lastOffer ? 10 : 0);
        lastOffer = O;
        if (patience <= 0) { patience = 0; mood(); say.textContent = '🤬 "Benim vaktim boşa gidiyor. İyi günler!"'; return finish(null); }
        const conc = api.rng.float(0.25, 0.5);
        C = Math.max(R, Math.round((C - (C - Math.max(O, R)) * conc) / 100) * 100);
        const near = (C - R) / P0 < 0.06;
        const bluff = api.rng.chance(api.diff * 0.35);
        const lines = near && !bluff ? ['"Bu fiyata zararına satıyorum, daha inemem."', '"Son sözüm bu, emin ol."'] :
          insult > 0.1 ? ['"Şaka mı yapıyorsun?"', '"Bu teklif ayıp oldu ama…"'] : ['"Olmaz, ama biraz inebilirim."', '"Malın kalitesine bak!"', '"Hadi ortada buluşalım."'];
        say.textContent = api.rng.pick(lines) + ` Karşı teklif: ${fmtNum(C)} TL`;
        mood();
        if (round >= 7) { say.textContent += ' — "Son teklifim!"'; }
        if (round >= 8) finish(C);
      };
      stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
        h('div.tile.center', {}, h('div.small.muted', {}, 'Pazarlık konusu'), h('b', {}, item), h('div.small', {}, 'İstenen: ', h('b', {}, fmtNum(P0) + ' TL'))),
        face,
        h('div.meter', {}, 'Sabır', h('div.bar', {}, patBar)),
        say,
        h('div.row', {}, h('span.small.muted', {}, 'Satıcının son teklifi:'), counterLbl),
        offerLbl, slider,
        h('div.row', {}, btn('Teklif ver', offer, 'primary grow'), btn('Son teklifi kabul et', () => finish(C), 'grow'))));
      say.textContent = `"${item} için ${fmtNum(P0)} TL istiyorum. Çok iyi bir fiyat!"`;
      mood(); upd();
      api.timerLoop(55 - api.diff * 15, () => { if (!done) { say.textContent = '"Başka müşteri bekliyor!"'; finish(C); } });
    });
  },
});

// ————————————————— FİYAT BELİRLEME —————————————————
register({
  id: 'fiyat', name: 'Fiyat Belirle', icon: '🏷️',
  how: ['6 gün boyunca ürününün fiyatını belirle.', 'Pahalıysa az satar, ucuzsa kâr etmezsin: en iyi noktayı bul.', 'Her günün satış ve kâr sonucunu grafikte gör.', 'Haberleri takip et: bayram, rakip indirimi talebi değiştirir.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      const product = api.rng.pick([['☕', 'Kahve', 40], ['🧁', 'Kurabiye kutusu', 90], ['👕', 'Tişört', 180], ['🎒', 'Okul çantası', 350]]);
      const [e, name, cost] = product;
      const bMax = api.rng.float(2.2, 3.2); // talebin sıfırlandığı fiyat / maliyet
      let a = 120, b = a / (cost * bMax);
      let total = 0, best = 0;
      const history = [];
      const noise = 0.14 * (1 - api.ease * 0.5) + api.diff * 0.08;
      for (let day = 1; day <= 6; day++) {
        let news = '';
        let aDay = a;
        if (day === 3 && api.rng.chance(0.6)) { aDay *= 1.35; news = '🎉 Bayram! Talep arttı.'; }
        if (day === 5 && api.rng.chance(0.6)) { aDay *= 0.75; news = '📉 Rakip indirim kampanyası başlattı.'; }
        const price = await new Promise(res => {
          const slider = h('input.slider', { type: 'range', min: Math.round(cost * 0.8), max: Math.round(cost * bMax), step: 1, value: history.length ? history[history.length - 1].p : Math.round(cost * 1.5) });
          const lbl = h('div.center', { style: { fontSize: '28px', fontWeight: 900 } });
          const upd = () => { lbl.textContent = slider.value + ' TL'; };
          slider.addEventListener('input', upd);
          const maxProfit = Math.max(1, ...history.map(x => Math.abs(x.pr)));
          stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
            h('div.row', {}, h('span', { style: { fontSize: '30px' } }, e), h('div.grow', {}, h('b', {}, name), h('div.small.muted', {}, `Birim maliyet: ${cost} TL`)), h('span.chip.accent', {}, `Gün ${day}/6`)),
            news ? h('div.chip.warn', {}, news) : null,
            h('div.tile', {}, h('div.small.muted', {}, 'Geçmiş günler (satış · kâr)'),
              history.length ? h('div.row', { style: { alignItems: 'flex-end', height: '90px', gap: '6px', marginTop: '6px' } }, history.map(x => h('div.col', { style: { flex: 1, alignItems: 'center', gap: '2px' } },
                h('div', { style: { width: '100%', height: Math.max(3, Math.abs(x.pr) / maxProfit * 60) + 'px', background: x.pr >= 0 ? '#3ddc97' : '#ff5b7a', borderRadius: '5px' } }),
                h('span.tiny', {}, x.p + '₺'), h('span.tiny.muted', {}, x.q + ' ad.')))) : h('div.small', { style: { padding: '10px 0' } }, 'Henüz satış yok. İlk fiyatını belirle!')),
            lbl, slider,
            btn('Günü başlat ▶', () => res(+slider.value), 'primary block')));
          upd();
        });
        const q = Math.max(0, Math.round((aDay - b * price) * (1 + api.rng.normal(0, noise))));
        const pr = (price - cost) * q;
        const pOpt = (aDay / b + cost) / 2;
        const bestPr = (pOpt - cost) * Math.max(0, aDay - b * pOpt);
        total += pr; best += bestPr;
        history.push({ p: price, q, pr });
        api.setScore(fmtNum(total) + '₺');
        pr > bestPr * 0.85 ? api.good(`+${fmtNum(pr)} TL`) : pr > 0 ? api.feedback(`+${fmtNum(pr)} TL`, '#ffb547') : api.bad(`${fmtNum(pr)} TL`);
        await sleep(650);
      }
      resolve(clamp(total / Math.max(1, best) * 100 * 1.05, 0, 100));
    });
  },
});

// ————————————————— STOK TAHMİNİ —————————————————
const SEASONS = ['🌸 İlkbahar', '☀️ Yaz', '🍂 Sonbahar', '❄️ Kış'];
const STOCK = [
  { e: '☂️', n: 'Şemsiye', d: [60, 15, 70, 55], c: 80, p: 150 },
  { e: '🍦', n: 'Dondurma', d: [40, 95, 25, 8], c: 15, p: 35 },
  { e: '🧥', n: 'Mont', d: [20, 5, 50, 80], c: 400, p: 750 },
  { e: '🩱', n: 'Mayo', d: [30, 90, 10, 3], c: 150, p: 320 },
  { e: '📓', n: 'Defter', d: [20, 10, 90, 35], c: 20, p: 45 },
];
register({
  id: 'stok', name: 'Stok Planı', icon: '📦',
  how: ['Dört mevsim boyunca iki ürün için sipariş ver.', 'Tahmin çubuğu ortalama talebi gösterir ama sapma olabilir.', 'Satılmayan mal yarı fiyatına elden çıkar; eksik stok satış kaçırır.', 'Kâr, en iyi olası kâra göre puanlanır.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      const prods = api.rng.shuffle(STOCK).slice(0, 2);
      let profit = 0, best = 0;
      const unc = 0.1 + api.diff * 0.25 - api.ease * 0.05;
      for (let s = 0; s < 4; s++) {
        const actual = prods.map(p => Math.max(0, Math.round(p.d[s] * (1 + api.rng.normal(0, unc)))));
        const fc = prods.map(p => Math.round(p.d[s] * (1 + api.rng.normal(0, unc * 0.6))));
        const orders = await new Promise(res => {
          const q = prods.map(() => 0);
          const lbls = prods.map(() => h('b', { style: { width: '48px', textAlign: 'center', fontSize: '20px' } }, '0'));
          const rows = prods.map((p, i) => h('div.tile', {},
            h('div.row', {}, h('span', { style: { fontSize: '28px' } }, p.e), h('div.grow', {}, h('b', {}, p.n), h('div.tiny.muted', {}, `Maliyet ${p.c} ₺ · Satış ${p.p} ₺`))),
            h('div.small', { style: { margin: '6px 0' } }, `Tahmini talep: ~${fc[i]} adet (±%${Math.round(unc * 100)})`),
            h('div.row', { style: { justifyContent: 'center' } },
              btn('−10', () => { q[i] = Math.max(0, q[i] - 10); lbls[i].textContent = q[i]; }, 'sm'), btn('−1', () => { q[i] = Math.max(0, q[i] - 1); lbls[i].textContent = q[i]; }, 'sm'),
              lbls[i], btn('+1', () => { q[i]++; lbls[i].textContent = q[i]; }, 'sm'), btn('+10', () => { q[i] += 10; lbls[i].textContent = q[i]; }, 'sm'))));
          stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
            h('div.row', {}, h('h3', {}, SEASONS[s]), h('span.grow'), h('span.chip', {}, `Kâr: ${fmtNum(profit)} ₺`)),
            ...rows, btn('Siparişi ver ▶', () => res(q.slice()), 'primary block')));
        });
        let seasonPr = 0, seasonBest = 0;
        const lines = prods.map((p, i) => {
          const sold = Math.min(orders[i], actual[i]);
          const left = orders[i] - sold;
          const pr = sold * p.p + left * p.c * 0.5 - orders[i] * p.c;
          seasonPr += pr; seasonBest += actual[i] * (p.p - p.c);
          return `${p.e} Talep ${actual[i]}, sattın ${sold}${left ? `, ${left} arttı` : ''}${orders[i] < actual[i] ? `, ${actual[i] - orders[i]} kaçtı` : ''}`;
        });
        profit += seasonPr; best += seasonBest;
        api.setScore(fmtNum(profit) + '₺');
        stage.replaceChildren(h('div.qcard', { style: { flexDirection: 'column', fontSize: '15px', gap: '6px' } }, ...lines.map(l => h('div', {}, l)), h('b', { style: { color: seasonPr >= seasonBest * 0.85 ? '#3ddc97' : '#ffb547' } }, `Mevsim kârı: ${fmtNum(seasonPr)} ₺`)));
        await sleep(1700);
      }
      resolve(clamp(profit / Math.max(1, best) * 100, 0, 100));
    });
  },
});

// ————————————————— ÜRÜN SAYFASI —————————————————
const PRODUCTS = [
  { e: '🎧', n: 'Kablosuz kulaklık', t: ['Kablosuz Bluetooth Kulaklık – 30 Saat Pil, Mikrofonlu', 'SÜPER KULAKLIK!!! EN UCUZ!!! KAÇIRMA!!!', 'Orijinal Dünya Markası Kulaklık (muadil ürün)'], d: ['Bluetooth 5.3, 30 saat pil, 2 yıl garanti, kutu içeriği fotoğraflı.', 'Çok iyi kulaklık. Alın.', 'Hiç bozulmaz, ömür boyu kullanılır, doktorlar öneriyor.'] },
  { e: '👟', n: 'Koşu ayakkabısı', t: ['Hafif Koşu Ayakkabısı – Nefes Alan Kumaş, 36–45 Numara', 'AYAKKABI AYAKKABI SPOR AYAKKABI KOŞU', 'Profesyonel sporcuların giydiği model (benzer tasarım)'], d: ['280 gram, nefes alan file kumaş, numara tablosu ve iade koşulları var.', 'Güzel ayakkabı, rahat.', 'Giyen herkes maratonu kazanıyor!'] },
  { e: '🍯', n: 'Süzme bal', t: ['Doğal Çiçek Balı 850 g – Analiz Raporlu', 'BAL BAL BAL %100 EN İYİ BAL', 'Her derde deva mucize bal'], d: ['Yayla çiçek balı, analiz raporu ve üretim tarihi sayfada.', 'Lezzetli bal.', 'Tüm hastalıkları iyileştirir.'] },
  { e: '🪴', n: 'Saksı bitkisi', t: ['Paşa Kılıcı Bitkisi – 40 cm, Az Su İsteyen, Saksılı', 'bitki çiçek saksı ucuz bitki', 'Asla ölmeyen sihirli bitki'], d: ['40 cm, haftada bir sulama, dolaylı ışık; bakım kartı hediye.', 'Güzel bitki.', 'Hiç bakım istemez, sonsuza kadar yaşar.'] },
];
const PHOTO = [['Aydınlık, ürün net, sade fon', ''], ['Karanlık ve bulanık', 'blur(3px) brightness(.45)'], ['Ürün küçük, arka plan karmaşık', 'saturate(2) hue-rotate(40deg)']];
register({
  id: 'urunsayfa', name: 'Ürün Sayfası', icon: '🛒',
  how: ['Her ürün için en iyi fotoğrafı, başlığı ve açıklamayı seç.', 'Açık ve dürüst bilgi satışı artırır; abartı ve yanıltma iade ve kötü yorum getirir.', 'Fiyatı rakiplere göre ayarla.', '3 ürün, süre sınırlı.'],
  play(stage, api) {
    return new Promise(async resolve => {
      let pts = 0;
      const list = api.rng.shuffle(PRODUCTS).slice(0, 3);
      const tl = api.timerLoop(75 - api.diff * 20 + api.ease * 10, () => { timeUp = true; });
      let timeUp = false;
      for (let i = 0; i < 3 && !timeUp; i++) {
        const P = list[i];
        const comp = api.rng.int(200, 900);
        const steps = [
          { k: 'Fotoğraf', opts: api.rng.shuffle(PHOTO.map((p, j) => ({ v: j === 0 ? 8 : 0, node: h('div.col', { style: { alignItems: 'center' } }, h('span', { style: { fontSize: '38px', filter: p[1], display: 'block', padding: '6px', background: j === 2 ? 'repeating-linear-gradient(45deg,#553,#335 6px)' : '#eef', borderRadius: '10px' } }, P.e), h('span.tiny', {}, p[0])) }))) },
          { k: 'Başlık', opts: api.rng.shuffle(P.t.map((t, j) => ({ v: j === 0 ? 10 : j === 1 ? 2 : -6, node: t }))) },
          { k: 'Açıklama', opts: api.rng.shuffle(P.d.map((t, j) => ({ v: j === 0 ? 8 : j === 1 ? 2 : -6, node: t }))) },
          { k: 'Fiyat', opts: api.rng.shuffle([{ v: 7, node: `${Math.round(comp * 0.95)} TL (rakibin biraz altında)` }, { v: 1, node: `${Math.round(comp * 0.6)} TL (zararına)` }, { v: 1, node: `${Math.round(comp * 1.5)} TL (rakibin çok üstünde)` }]) },
        ];
        for (const st of steps) {
          if (timeUp) break;
          const v = await new Promise(res => {
            stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
              h('div.row', {}, h('span', { style: { fontSize: '30px' } }, P.e), h('b.grow', {}, P.n), h('span.chip', {}, `${i + 1}/3`)),
              h('div.small.muted', {}, `${st.k} seç` + (st.k === 'Fiyat' ? ` — rakip fiyatı: ${comp} TL` : '')),
              st.k === 'Fotoğraf'
                ? h('div.picks', {}, st.opts.map(o => h('button.pick', { onclick: () => res(o.v) }, o.node)))
                : h('div.qopts', {}, st.opts.map(o => h('button.qopt', { style: { fontSize: '13.5px' }, onclick: () => res(o.v) }, o.node)))));
          });
          pts += v; v >= 7 ? api.sfx.good() : v < 0 ? api.bad('Yanıltıcı!') : api.sfx.tap();
          api.setScore(Math.round(clamp(pts / 99 * 100, 0, 100)));
        }
      }
      tl.stop();
      resolve(clamp(pts / 99 * 100, 0, 100));
    });
  },
});

// ————————————————— ROTA —————————————————
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [x, ...p]));
}
register({
  id: 'rota', name: 'Teslimat Rotası', icon: '🗺️',
  how: ['Depodan çık, tüm adreslere uğra ve depoya dön.', 'Adreslere ziyaret sırasına göre dokun.', 'Kırmızı bölgeler trafik: içinden geçen yol iki kat uzun sayılır.', 'En kısa rotaya ne kadar yaklaşırsan o kadar iyi. 3 tur.'],
  play(stage, api) {
    return new Promise(async resolve => {
      let total = 0;
      for (let round = 0; round < 3; round++) {
        const W = stage.clientWidth, H = Math.min(stage.clientHeight - 70, W * 1.1);
        const n = clamp(4 + Math.round(api.diff * 2) + (round === 2 ? 1 : 0), 4, 7);
        const nodes = [{ x: W / 2, y: H / 2 }];
        while (nodes.length <= n) {
          const p = { x: api.rng.float(30, W - 30), y: api.rng.float(30, H - 30) };
          if (nodes.every(q => Math.hypot(p.x - q.x, p.y - q.y) > 55)) nodes.push(p);
        }
        const jams = api.diff > 0.3 ? [{ x: api.rng.float(60, W - 60), y: api.rng.float(60, H - 60), r: 45 + api.diff * 25 }] : [];
        const dist = (a, b) => {
          let d = Math.hypot(a.x - b.x, a.y - b.y);
          for (const j of jams) { // yolun trafik bölgesinde kalan kısmı
            let inside = 0; for (let t = 0; t <= 1; t += 0.05) if (Math.hypot(a.x + (b.x - a.x) * t - j.x, a.y + (b.y - a.y) * t - j.y) < j.r) inside += 0.05;
            d += d * inside;
          }
          return d;
        };
        const routeLen = r => { let s = 0, prev = nodes[0]; for (const i of r) { s += dist(prev, nodes[i]); prev = nodes[i]; } return s + dist(prev, nodes[0]); };
        const idx = [...Array(n).keys()].map(i => i + 1);
        const opt = Math.min(...permutations(idx).map(routeLen));
        const r = await new Promise(res => {
          const seq = [];
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('width', W); svg.setAttribute('height', H);
          const draw = () => {
            let s = '';
            for (const j of jams) s += `<circle cx="${j.x}" cy="${j.y}" r="${j.r}" fill="rgba(255,91,122,.22)" stroke="rgba(255,91,122,.6)" stroke-dasharray="4 4"/>`;
            let prev = nodes[0];
            for (const i of seq) { s += `<line x1="${prev.x}" y1="${prev.y}" x2="${nodes[i].x}" y2="${nodes[i].y}" stroke="#7c6cff" stroke-width="4" stroke-linecap="round"/>`; prev = nodes[i]; }
            if (seq.length === n) s += `<line x1="${prev.x}" y1="${prev.y}" x2="${nodes[0].x}" y2="${nodes[0].y}" stroke="#7c6cff" stroke-width="4" stroke-dasharray="6 6"/>`;
            nodes.forEach((p, i) => {
              const k = seq.indexOf(i);
              s += `<circle cx="${p.x}" cy="${p.y}" r="${i ? 17 : 21}" fill="${i === 0 ? '#ffb547' : k >= 0 ? '#29d3a6' : '#232a52'}" stroke="#fff" stroke-width="2"/>`;
              s += `<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="${i ? 13 : 16}" font-weight="900" fill="#fff">${i === 0 ? '🏭' : k >= 0 ? k + 1 : '🏠'}</text>`;
            });
            svg.innerHTML = s;
          };
          svg.addEventListener('pointerdown', e => {
            const b = svg.getBoundingClientRect(); const x = e.clientX - b.left, y = e.clientY - b.top;
            const i = nodes.findIndex((p, k) => k > 0 && Math.hypot(p.x - x, p.y - y) < 26);
            if (i > 0 && !seq.includes(i)) { seq.push(i); api.sfx.tap(); draw(); }
          });
          stage.replaceChildren(h('div.col', {},
            h('div.row', {}, h('span.chip.accent', {}, `Rota ${round + 1}/3`), h('span.grow'), h('span.small.muted', {}, `${n} adres`)),
            h('div', { style: { background: '#101533', borderRadius: '16px', border: '1px solid var(--line)' } }, svg),
            h('div.row', {}, btn('↩ Geri', () => { seq.pop(); draw(); }, 'grow'), btn('Rotayı gönder', () => { if (seq.length === n) { tl.stop(); res(opt / routeLen(seq)); } }, 'green grow'))));
          draw();
          const tl = api.timerLoop(30 - api.diff * 8 + api.ease * 6, () => res(seq.length === n ? opt / routeLen(seq) * 0.9 : 0));
        });
        total += r;
        r > 0.97 ? api.good('En kısa rota!') : r > 0.85 ? api.good('İyi rota') : api.bad(`%${Math.round((1 / Math.max(r, 0.01) - 1) * 100)} uzun`);
        api.setScore(Math.round(total / (round + 1) * 100) + '%');
        await sleep(800);
      }
      resolve(clamp(Math.pow(total / 3, 2.2) * 100, 0, 100));
    });
  },
});
