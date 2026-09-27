// Başlık, yeni hayat, hayat albümü, koleksiyon, mini oyun salonu, ayarlar.
import { h, btn, sheet, toast, confirmBox, info } from './dom.js';
import { app, save, go, route, endLifeSave } from './app.js';
import { sfx, setAudio, vibrate } from '../core/audio.js';
import { fmtTL, todayKey, sleep, grade } from '../core/util.js';
import { hashString } from '../core/rng.js';
import { migrate, rollStart, newLife, newChildLife, lifeScoreTitle, WEALTH, PLACE, RELATION, RARE } from '../sim/character.js';
import { MIZAC, traitLabel } from '../sim/traits.js';
import { CONFIG, APP_VERSION } from '../config.js';
import { NAMES } from '../sim/names.js';
import { JOBS, PATHS, jobTitle, DOORS } from '../sim/careers.js';
import { BIZ_STEPS } from '../sim/business.js';
import { deckSize } from '../sim/events.js';
import * as Y from '../sim/year.js';
import { hintFor } from '../sim/stats.js';
import { allGames, playMinigame } from '../minigames/index.js';
import { lifeScreen, avatarOf } from './lifeScreen.js';
import { watchAdsSeries } from './flows.js';
import { clearLife } from '../core/store.js';

// ——— BAŞLIK ———
route('title', root => {
  const m = app.meta;
  const has = app.life && app.life.alive;
  const dKey = todayKey();
  root.append(h('div.title-screen', {},
    h('img.title-logo', { src: 'icons/icon.svg', alt: 'Hayat Yolu' }),
    h('div.logo', {}, 'Hayat Yolu'),
    h('div.logo-sub', {}, 'Yaşamak istediğin hayatı, küçük de olsa gerçekten oynayarak yaşa.'),
    has ? h('div.card', { style: { marginBottom: '6px' } }, h('div.row', {}, h('div.avatar', {}, avatarOf(app.life)), h('div.grow', {}, h('b', {}, `${app.life.name} ${app.life.surname}`), h('div.small.muted', {}, `${app.life.age} yaş · ${app.life.gen}. nesil`)))) : null,
    has ? btn('▶  Devam et', () => go('life'), 'primary block') : null,
    btn(has ? '✨  Yeni hayat (📺 3 reklam)' : '✨  Yeni hayat', async () => { if (has && !(await abandonLife())) return; go('create'); }, (has ? '' : 'primary ') + 'block'),
    h('div.menu-grid', { style: { marginTop: '6px' } },
      btn([h('b', {}, '📅'), 'Günlük meydan okuma'], async () => { if (has && !(await abandonLife())) return; go('create', { daily: true }); }),
      btn([h('b', {}, '🎮'), 'Mini oyun salonu'], () => go('arcade')),
      btn([h('b', {}, '🌟'), 'Albüm & koleksiyon'], () => go('album')),
      btn([h('b', {}, '⚙️'), 'Ayarlar'], () => go('settings', 'title'))),
    h('div.studio-foot', {}, h('img', { src: 'icons/studio.svg', alt: '' }), 'EHTIYARS GAME'),
    h('p.center.tiny.muted', { style: { marginTop: '6px' } }, `${m.lives} hayat yaşandı · ${Object.keys(m.careers).length} meslek · ${Object.keys(m.legends).length} efsane${m.daily[dKey] ? ` · Bugünün rekoru: ${m.daily[dKey]}` : ''}`),
  ));
});

// Devam eden hayatı silmek: kadere razı olmayanlar 3 reklam izler.
export async function abandonLife() {
  if (!(await confirmBox('Hayatını sil', 'Devam eden hayatın ve bütün emeklerin silinecek. Bu hayat, hayat albümüne girmeyecek.', 'Devam', 'Vazgeç', 'danger'))) return false;
  if (!(await watchAdsSeries('abandon', 3, 'Yeni bir hayat mı?', 'Hayat zor olabilir ama kaçmak bedava değil: bu hayatı silip yenisine başlamak için 3 reklam izlemelisin. Ya da hayatına devam et — belki şansın döner.'))) return false;
  endLifeSave();
  return true;
}

// ——— YENİ HAYAT ———
route('create', (root, opts = {}) => {
  const daily = !!opts.daily;
  let gender = null; // oyuncu seçmeli (isimle uyumsuz avatar olmasın)
  // Zar bir kez atılır ve kaydedilir: ekrandan çıkıp girmek yeni zar atmaz. Yeniden atmak 3 reklam.
  const m0 = app.meta;
  if (daily) m0.pendingRoll = { seed: 'gunluk-' + todayKey(), daily: true };
  else if (!m0.pendingRoll || m0.pendingRoll.daily) m0.pendingRoll = { seed: String(Math.floor(Math.random() * 1e9)) };
  save();
  let seed = m0.pendingRoll.seed;
  let rolled = null;
  const nameIn = h('input.input', { placeholder: 'İsim (boş bırakırsan zar seçer)', maxlength: 16 });
  const seg = h('div.seg');
  const drawSeg = () => { seg.replaceChildren(
    h('button' + (gender === 'k' ? '.on' : ''), { onclick: () => { gender = 'k'; drawSeg(); } }, '👧 Kız'),
    h('button' + (gender === 'e' ? '.on' : ''), { onclick: () => { gender = 'e'; drawSeg(); } }, '👦 Erkek'));
    seg.style.borderColor = gender ? '' : '#ffb547'; };
  drawSeg();
  const diceBox = h('div');
  const actions = h('div.col', { style: { marginTop: '14px' } });
  const roll = async () => {
    rolled = rollStart(seed);
    const r = rolled;
    const items = [
      ['Aile durumu', WEALTH[r.wealth].name, WEALTH[r.wealth].icon],
      ['Yer', `${PLACE[r.place].name} · ${r.city}`, PLACE[r.place].icon],
      ['Anne', r.parents[0].job, '👩'],
      ['Baba', r.parents[1].job, '👨'],
      ['Kardeş', r.siblings === 0 ? 'Tek çocuk' : `${r.siblings} kardeş`, '👫'],
      ['Aile ilişkisi', RELATION[r.relation].name, RELATION[r.relation].icon],
      ['Sağlık tabanı', r.health, '❤️'],
      ['Görünüş', `${r.traits.gorunus} · ${traitLabel(r.traits.gorunus)}`, '✨'],
      ['Karizma', `${r.traits.karizma} · ${traitLabel(r.traits.karizma)}`, '🌟'],
      ['Mizaç', MIZAC[r.traits.mizac].name, MIZAC[r.traits.mizac].icon],
      r.rare ? ['Nadir başlangıç!', RARE[r.rare].name, RARE[r.rare].icon] : ['Soyadı', r.surname, '🏷️'],
    ];
    diceBox.replaceChildren(h('div.sec-title', {}, '🎲 Başlangıç zarı', daily ? h('span.chip.gold', {}, 'Günlük tohum') : h('span.tiny', { style: { textTransform: 'none' } }, `tohum ${seed}`)), h('div.dice-grid'));
    const grid = diceBox.lastChild;
    for (let i = 0; i < items.length; i++) {
      const [k, v, e] = items[i];
      grid.append(h('div.dice' + (k.startsWith('Nadir') ? '.rare' : ''), { style: { animationDelay: '0s' } }, h('span.e', {}, e), h('div.k', {}, k), h('div.v', {}, v)));
      sfx.tick(); await sleep(110);
    }
    if (r.rare) { sfx.legend(); vibrate([40, 30, 80]); diceBox.append(h('p.small', { style: { color: '#ffe08a' } }, '✨ ' + RARE[r.rare].text)); }
    diceBox.append(h('p.small.muted', {}, `${MIZAC[r.traits.mizac].icon} ${MIZAC[r.traits.mizac].desc}`));
    diceBox.append(h('p.small.muted', {}, '🎲 Anne-babanı, görünüşünü, karizmanı seçemezsin — bu senin zarın. 🧬 Ayrıca 12 alanda gizli yeteneklerin var; denedikçe ipuçları çıkacak.'));
    actions.replaceChildren(
      btn('🌱  Bu hayatı yaşa', start, 'primary block'),
      daily ? null : btn('🎲  Zarı yeniden at (📺 3 reklam)', async () => {
        if (!(await watchAdsSeries('reroll', 3, 'Kaderini değiştir', 'Anne-babanı, doğduğun yeri ve doğuştan özelliklerini seçemezsin. Ya kadere razı olursun ya da 3 reklam izleyip zarı yeniden atarsın.'))) return;
        seed = String(Math.floor(Math.random() * 1e9)); m0.pendingRoll = { seed }; save(); roll();
      }, 'block'),
      btn('Geri', () => go('title'), 'ghost block'));
  };
  const start = () => {
    if (!gender) { toast('👆 Önce cinsiyetini seç'); seg.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], 300); return; }
    const name = nameIn.value.trim();
    const s = newLife({ seed, name: name || null, gender, daily });
    delete app.meta.pendingRoll;
    if (!name) s.name = NAMES[gender][hashString(seed + gender) % NAMES[gender].length];
    // Kalıcı ilerleme: tamamlanan hayatlar başlangıç ipucu açar
    const ids = Object.keys(s.talents).sort((a, b) => s.talents[b] - s.talents[a]);
    for (let i = 0; i < (app.meta.perks.hints || 0); i++) s.hints[ids[i]] = hintFor(ids[i], s.talents[ids[i]]).tier;
    Y.log(s, `${s.family.city}'da ${WEALTH[s.family.wealth].name.toLowerCase()} bir ailenin çocuğu olarak dünyaya geldi.`, 'rare');
    app.life = s; app.tab = 'yil';
    save();
    go('life');
    if (!app.meta.seenTutorial) tutorial();
  };
  root.append(h('div.screen', {},
    h('h1', {}, daily ? '📅 Günlük meydan okuma' : '✨ Yeni hayat'),
    h('p.muted', {}, daily ? 'Bugün herkes aynı başlangıçla oynuyor. Hayat puanını rekorla karşılaştır!' : 'Her hayat farklı bir zarla başlar.'),
    h('div.col', {}, nameIn, seg),
    diceBox, actions));
  roll();
});

async function tutorial() {
  const pages = [
    ['⚡', 'Enerji', 'Her eylem enerji harcar. Enerji gerçek zamanda dolar — oyun kapalıyken bile. Günde birkaç kez girip hayatına devam et.'],
    ['🎯', 'Eylem puanı (EP)', 'Her yıl yaşına göre eylem puanın var. Hepsini iyi ya da kötü eylemlere harcadığında yıl tamamlanır. Harcanmayan EP sonraki yıla aktarılmaz.'],
    ['🎮', 'Mini oyunlar', 'Çoğu eylem bir mini oyunla oynanır. Karakterinin becerisi oyunu kolaylaştırır ama senin becerin de önemli! İstersen hızlıca geçebilirsin.'],
    ['🃏', 'Olay kartları', 'Yıl içinde olay kartları açılır: sıradan, nadir, epik ve EFSANEVİ. Efsanevi fırsatlar ancak emek verdiğin alanlarda çıkar.'],
    ['🚪', 'Kapılar', 'Meslekler sırayla açılan kapılardan oluşur. Kapı kapanırsa yol bitmez: tekrar dene ya da yan yola geç.'],
    ['🏠', 'Ailen ve evin', 'Ailenin bir kasası, geliri ve gideri var. Aile zordaysa çalışıp destek ol; yoksa faturalar, kira, icra… sorunlar kademe kademe açılır. İş hayatında maaş, mesaiye gittiğin kadar yatar.'],
    ['⏳', 'Bir ömür, bir hafta', 'Bir hayat gerçek zamanda yaklaşık bir hafta sürer. Günde birkaç kez uğra: enerjin dolmuş, hayatın seni bekliyor olacak.'],
  ];
  for (let i = 0; i < pages.length; i++) {
    const [e, t, d] = pages[i];
    await sheet(close => h('div.center', {}, h('div', { style: { fontSize: '56px' } }, e), h('h2', {}, t), h('p', {}, d), h('div.tiny.muted', {}, `${i + 1}/${pages.length}`), h('div.btns', {}, btn(i < pages.length - 1 ? 'İleri' : 'Hadi başlayalım!', () => close(), 'primary block'))), { center: true, dismissable: false });
  }
  app.meta.seenTutorial = true; save();
}

route('life', root => {
  if (!app.life) return go('title');
  migrate(app.life);
  if (!app.life.alive) return go('death');
  lifeScreen(root);
});

// ——— ÖLÜM & HAYAT ALBÜMÜ ———
const EARLY_DEATH = 50;
route('death', root => {
  const s = app.life;
  if (!s) return go('title');
  // İkinci şans yalnızca erken (vakitsiz) ölümde: yaşlılıkta ölen için yapılacak bir şey yok.
  if (!s.albumSaved && !s.fateDone && !s.revived && s.age < EARLY_DEATH && s.deathCause !== 'oyuncunun kararıyla') {
    root.append(h('div.screen.center', { style: { paddingTop: '60px' } },
      h('div', { style: { fontSize: '72px' } }, '🕯️'),
      h('h1', {}, 'Kader anı'),
      h('p', {}, `${s.name} ${s.surname}, ${s.age} yaşında hayata gözlerini yumdu.`), h('p.small', {}, `Sebep: ${s.deathCause}`),
      h('p.small.muted', {}, 'Vakitsiz bir ölüm… Kadere razı olabilir ya da bir kez, 3 reklam izleyerek ikinci bir şans alabilirsin. (Yaşlılıkta ölümün ikinci şansı yoktur.)'),
      h('div.col', { style: { marginTop: '18px' } },
        btn('🕊️ Kadere razıyım', () => { s.fateDone = true; save(); go('death'); }, 'primary block'),
        btn('📺 İkinci şans (3 reklam)', async () => {
          if (!(await watchAdsSeries('revive', 3, 'İkinci şans', 'Hayat pamuk ipliğine bağlı. 3 reklamın sonunda gözlerini hastanede açacaksın — ama bu şans her hayatta yalnızca bir kez var.'))) return;
          s.alive = true; s.revived = true; s.deathCause = null;
          s.stats.saglik = Math.max(s.stats.saglik, 45); s.stats.mutluluk = Math.max(s.stats.mutluluk, 50);
          Y.log(s, 'Ölümün eşiğinden döndü: ikinci bir şans.', 'legendary');
          Y.startYear(s); save(); go('life');
        }, 'gold block'))));
    return;
  }
  const score = Y.lifeScore(s);
  const m = app.meta;
  if (!s.albumSaved) {
    s.albumSaved = true;
    m.lives++;
    m.albums.unshift({ name: `${s.name} ${s.surname}`, age: s.age, gen: s.gen, score, job: s.career.job ? jobTitle(s.career.job) : s.life.jobs.length ? JOBS[s.life.jobs[s.life.jobs.length - 1]].name : '—', legends: s.legends.length, titles: s.titles, peak: s.life.peakMoney / s.priceIndex, year: s.calendarYear });
    m.albums = m.albums.slice(0, 30);
    if (s.daily) { const k = todayKey(); m.daily[k] = Math.max(m.daily[k] || 0, score); }
    if (m.lives % 3 === 0) m.perks.hints = Math.min(3, (m.perks.hints || 0) + 1);
    save();
  }
  const highlights = s.log.filter(l => l.r === 'legendary' || l.r === 'epic').slice(-8);
  const card = h('div.album-card', {},
    h('div.center', { style: { fontSize: '56px' } }, avatarOf(s)),
    h('h1.center', {}, `${s.name} ${s.surname}`),
    h('p.center.muted', { style: { margin: '4px 0' } }, `${s.calendarYear - s.age} – ${s.calendarYear} · ${s.age} yıl · ${s.gen}. nesil`),
    h('p.center.small', { style: { margin: '0 0 10px' } }, `🕊️ ${s.deathCause}`),
    h('div.center', {}, h('span.chip.gold', { style: { fontSize: '14px' } }, `🏆 ${lifeScoreTitle(score)} · ${score} puan`)),
    h('div.sp'),
    h('div.sum-line', {}, 'Meslek', h('b', {}, s.life.jobs.length ? s.life.jobs.map(j => JOBS[j].name).join(', ') : '—')),
    s.career.biz ? h('div.sum-line', {}, 'Ticaret', h('b', {}, BIZ_STEPS[s.career.biz.step].name)) : null,
    h('div.sum-line', {}, 'En yüksek servet', h('b', {}, fmtTL(s.life.peakMoney))),
    h('div.sum-line', {}, 'İtibar', h('b', {}, Math.round(s.stats.itibar))),
    h('div.sum-line', {}, 'Aile', h('b', {}, `${s.rel.married ? '💍 ' : ''}${s.rel.children.length} çocuk`)),
    h('div.sum-line', {}, 'Dürüst kararlar', h('b', {}, s.life.honest)),
    h('div.sum-line', {}, 'Oynanan mini oyun', h('b', {}, s.life.mgPlayed)),
    s.titles.length ? h('div', { style: { marginTop: '8px' } }, s.titles.map(t => h('span.chip.gold', { style: { margin: '3px' } }, '🏅 ' + t))) : null,
    highlights.length ? h('div.sec-title', {}, 'Unutulmaz anlar') : null,
    highlights.map(l => h('div.small', { style: { padding: '4px 0' } }, `${l.r === 'legendary' ? '🌟' : '💜'} ${l.age} yaş — ${l.text}`)));
  const kids = s.rel.children;
  root.append(h('div.screen', {},
    h('h2.center', { style: { marginBottom: '12px' } }, '📔 Hayat albümü'),
    card,
    h('div.col', { style: { marginTop: '14px' } },
      btn('📤 Paylaş', async () => {
        const text = `Hayat Yolu'nda ${s.name} ${s.surname} olarak ${s.age} yıl yaşadım: ${s.life.jobs.map(j => JOBS[j].name).join(', ') || 'sade bir hayat'} · ${score} puan (${lifeScoreTitle(score)})${s.titles.length ? ' · ' + s.titles.join(', ') : ''} 🌱`;
        try { if (navigator.share) await navigator.share({ title: 'Hayat Yolu', text }); else { await navigator.clipboard.writeText(text); toast('Panoya kopyalandı'); } } catch {}
      }, 'block'),
      kids.length ? h('div.sec-title', {}, '👨‍👧 Nesil devam etsin') : null,
      ...kids.map((c, i) => btn(`${c.gender === 'k' ? '👧' : '👦'} ${c.name} (${c.age} yaş) olarak devam et`, () => {
        const child = newChildLife(s, i, `${s.seed}-g${s.gen + 1}-${i}`);
        app.life = child; app.tab = 'yil'; save(); go('life');
      }, 'gold block')),
      btn('✨ Yepyeni bir hayat', () => { endLifeSave(); go('create'); }, 'primary block'),
      btn('🏠 Ana menü', () => { endLifeSave(); go('title'); }, 'ghost block'))));
  sfx.epic();
});

// ——— ALBÜM & KOLEKSİYON ———
route('album', root => {
  const m = app.meta;
  const legendCards = window.__deck.filter(c => c.rarity === 'legendary');
  const doorLegends = Object.values(DOORS).filter(d => d.open.legend).map(d => ({ id: d.open.legend, title: d.name, icon: d.icon }));
  const allLeg = [...legendCards.map(c => ({ id: c.id, title: c.title, icon: c.icon })), ...doorLegends];
  root.append(h('div.screen', {},
    h('div.row', {}, h('h1.grow', {}, '🌟 Albüm'), btn('← Geri', () => go('title'), 'ghost sm')),
    h('div.sec-title', {}, `Efsane albümü · ${Object.keys(m.legends).length}/${allLeg.length}`),
    h('div.legend-grid', {}, allLeg.map(L => { const got = m.legends[L.id]; return h('div.legend.' + (got ? 'on' : 'off'), {}, h('b', {}, got ? L.icon : '❔'), got ? L.title : '???', got && got.count > 1 ? h('span.tiny.muted', {}, `×${got.count}`) : null); })),
    h('div.sec-title', {}, `Meslek koleksiyonu · ${Object.keys(m.careers).length}/${Object.keys(JOBS).length}`),
    h('div.legend-grid', {}, Object.entries(JOBS).map(([id, J]) => { const got = m.careers[id]; return h('div.legend.' + (got ? 'on' : 'off'), {}, h('b', {}, got ? J.icon : '❔'), got ? J.name : '???', h('span.tiny.muted', {}, PATHS[J.path].name)); })),
    h('div.sec-title', {}, `Geçmiş hayatlar · ${m.lives}`),
    m.albums.length ? h('div.card', {}, m.albums.map(a => h('div.log-item', {}, h('span.age', {}, a.age + ' y'), h('div.grow', {}, h('b', {}, a.name), h('div.tiny.muted', {}, `${a.job} · ${a.score} puan${a.legends ? ` · 🌟${a.legends}` : ''}${a.gen > 1 ? ` · ${a.gen}. nesil` : ''}`))))) : h('p.muted', {}, 'Henüz tamamlanmış hayat yok.'),
    h('div.sec-title', {}, 'Kalıcı ilerleme'),
    h('div.card', {}, h('p.small', { style: { margin: 0 } }, `Her 3 tamamlanan hayatta yeni hayatlara bir ücretsiz yetenek ipucu açılır. Şu an: ${m.perks.hints || 0} ipucu.`))));
});

// ——— MİNİ OYUN SALONU ———
route('arcade', root => {
  let skill = 50, stakes = 0.3;
  const skillLbl = h('b', {}, skill);
  const stakesLbl = h('b', {}, 'Normal');
  const games = allGames();
  root.append(h('div.screen', {},
    h('div.row', {}, h('h1.grow', {}, '🎮 Salon'), btn('← Geri', () => go('title'), 'ghost sm')),
    h('p.muted', {}, `${games.length} mini oyunu serbestçe dene. Burada ödül yok, yalnızca pratik!`),
    h('div.card', {},
      h('div.row', {}, h('span.grow', {}, 'Karakter becerisi'), skillLbl),
      h('input.slider', { type: 'range', min: 0, max: 100, value: skill, oninput: e => { skill = +e.target.value; skillLbl.textContent = skill; } }),
      h('div.row', {}, h('span.grow', {}, 'Önem'), stakesLbl),
      h('input.slider', { type: 'range', min: 0, max: 100, value: 30, oninput: e => { stakes = e.target.value / 100; stakesLbl.textContent = stakes < 0.35 ? 'Sıradan' : stakes < 0.7 ? 'Kritik' : 'Efsanevi'; } })),
    h('div.sp'),
    games.map(g => h('button.act', { onclick: async () => {
      const r = await playMinigame(g.id, { skill, stakes, mods: stakes >= 0.7 ? ['efsanevi'] : stakes >= 0.35 ? ['kritik'] : [], allowSkip: false, extra: { age: 16 } });
      const best = app.meta.arcadeBest || (app.meta.arcadeBest = {});
      if (r.score > (best[g.id] || 0)) { best[g.id] = r.score; save(); toast(`🏅 Yeni rekor: ${r.score}`); go('arcade'); }
    } }, h('div.ic', {}, g.icon), h('div.grow', {}, h('div.nm', {}, g.name), h('div.ds', {}, g.how[0])), (app.meta.arcadeBest || {})[g.id] ? h('span.chip.gold', {}, `🏅 ${app.meta.arcadeBest[g.id]}`) : null))));
});

// ——— AYARLAR ———
route('settings', (root, back = 'title') => {
  const st = app.meta.settings;
  const toggle = (key, label, desc) => h('div.row.tile', { style: { marginBottom: '8px' } },
    h('div.grow', {}, h('b', {}, label), h('div.tiny.muted', {}, desc)),
    h('button.btn.sm' + (st[key] ? '.green' : ''), { onclick: () => { st[key] = !st[key]; setAudio(st); save(); go('settings', back); } }, st[key] ? 'Açık' : 'Kapalı'));
  root.append(h('div.screen', {},
    h('div.row', {}, h('h1.grow', {}, '⚙️ Ayarlar'), btn('← Geri', () => go(back), 'ghost sm')),
    h('div.sp'),
    toggle('sound', '🔊 Ses efektleri', 'Dokunma, başarı ve kart açılış sesleri'),
    toggle('haptics', '📳 Titreşim', 'Destekleyen cihazlarda'),
    toggle('testEnergy', '🧪 Test modu: hızlı enerji', 'Prototip testleri için: enerji her 2 saniyede dolar'),
    toggle('noAds', '🚫 Reklamsız paket (simülasyon)', 'Ödüllü reklam ödülleri doğrudan verilir, sınır yok'),
    h('div.sec-title', {}, 'Tempo'),
    h('div.card', {}, h('p.small', { style: { margin: 0 } }, `⏳ Enerji ${CONFIG.energy.regenSeconds} saniyede 1 dolar, bar ${CONFIG.energy.max}. Günde 3–4 kez uğrayan bir oyuncu günde ~9–10 oyun yılı yaşar: bir ömür ≈ 1 hafta. Bebeklik yılları enerji harcamaz.`)),
    h('div.sec-title', {}, 'Hakkında'),
    h('div.card', { style: { marginBottom: '10px' } },
      h('div.row', {}, h('img', { src: 'icons/studio.svg', style: { width: '44px', height: '44px' } }), h('div.grow', {}, h('b', {}, 'Ehtiyars Game'), h('div.tiny.muted', {}, 'Hayat Yolu · sürüm ' + APP_VERSION))),
      h('p.small', { style: { margin: '10px 0 4px' } }, '📧 İletişim ve geri bildirim: ', h('a', { href: 'mailto:ehtiyarsgame@gmail.com', style: { color: '#b9b0ff' } }, 'ehtiyarsgame@gmail.com')),
      h('p.tiny.muted', { style: { margin: 0 } }, 'Gizlilik: Oyun ilerlemen yalnızca cihazında saklanır; kişisel veri toplanmaz ve sunucuya gönderilmez. Reklamlar 13 yaş altı için kişiselleştirilmez.')),
    h('div.card', {}, h('p.small', { style: { margin: 0 } }, `Hayat Yolu — test sürümü. ${deckSize()} olay kartı, ${allGames().length} mini oyun, ${Object.keys(JOBS).length} meslek. İçerik ilkeleri: kumar, şans oyunu, ücretli sandık, içki/sigara ve kolay para yolları yoktur. Emek, akıl ve dürüstlük kazandırır.`)),
    h('div.sp'),
    btn('🗑️ Tüm ilerlemeyi sıfırla', async () => {
      if (await confirmBox('Her şeyi sıfırla', 'Tüm hayatlar, albüm ve koleksiyon silinecek.', 'Sıfırla', 'Vazgeç', 'danger')) {
        clearLife(); localStorage.clear(); location.reload();
      }
    }, 'danger block')));
});
