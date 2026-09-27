import { register } from './engine.js';
import { h, btn } from '../ui/dom.js';
import { clamp, sleep } from '../core/util.js';

// ————————————————— KONUŞMA —————————————————
// Her turda dinleyicinin ruh hâlini oku ve en uygun cevabı seç. g: iyi, o: idare eder, b: kötü
const SCENES = {
  sinif: { t: 'Sınıf başkanlığı konuşması', who: '🧑‍🎓', rounds: [
    ['Sınıf seni dinliyor. Nasıl başlarsın?', ['Sınıfa sorarak başla: "Bu yıl neyi değiştirmek istersiniz?"', 'Hazırladığın listeyi okumaya başla', 'Kendini överek başla']],
    ['Arka sıralar sıkılmaya başladı, fısıldaşıyorlar.', ['Onlara doğrudan soru yönelt, fikirlerini iste', 'Konuyu kısa kes', 'Sesini yükselt ve devam et']],
    ['Biri "Sen seçilince ne değişecek ki?" diye soruyor.', ['Somut bir söz ver: "İlk ay sınıf kütüphanesi kuracağım."', 'Genel iyi niyetini anlat', 'Diğer adayı eleştir']],
    ['Kapanış zamanı.', ['Kısa ve akılda kalıcı bir cümleyle bitir', 'Herkese teşekkür edip bitir', '"Oy vermezseniz pişman olursunuz" de']],
  ] },
  mulakat: { t: 'İş mülakatı', who: '👩‍💼', rounds: [
    ['"Bize kendinizden bahseder misiniz?"', ['İşle ilgili deneyimini kısa ve net anlat', 'Çocukluğundan başlayarak hayat hikâyeni anlat', '"Özgeçmişimde yazıyor" de']],
    ['"Neden bu şirket?"', ['Şirketi araştırdığını gösteren somut bir sebep söyle', '"Kariyerimde ilerlemek istiyorum" de', '"Maaşınız iyi" de']],
    ['"Zor bir durumu nasıl çözdünüz?"', ['Durumu, yaptığını ve sonucunu örnekle anlat', 'Genel olarak çalışkan olduğunu söyle', '"Hiç zorluk yaşamadım" de']],
    ['"Bize sormak istediğiniz bir şey var mı?"', ['Ekip ve gelişim fırsatları hakkında soru sor', '"Ne zaman izin kullanabilirim?" diye sor', '"Yok" de']],
  ] },
  tanisma: { t: 'Tanışma sohbeti', who: '🙂', rounds: [
    ['Kafede yanındaki kişiyle göz göze geldiniz.', ['Gülümse, ortamla ilgili hafif bir yorum yap', 'Selam verip telefona dön', 'Hemen kendini anlatmaya başla']],
    ['Elindeki kitabı fark ettin.', ['Kitap hakkında merakla soru sor', 'Kendi okuduğun kitapları say', '"Kitap okumak sıkıcı" diye takıl']],
    ['Sohbet koyulaştı; o da sana soru soruyor.', ['Dürüst ve samimi cevap ver', 'Kısa geçiştir', 'Olduğundan farklı görünmeye çalış']],
    ['Kalkma vakti geldi.', ['Tekrar görüşmeyi nazikçe teklif et', 'Sadece "İyi günler" de', 'Israrla numarasını iste']],
  ] },
  barisma: { t: 'Arabuluculuk', who: '😤', rounds: [
    ['İki taraf da birbirine kırgın.', ['İkisini ayrı ayrı sakince dinle', '"Geçmişi unutun" de', 'Kimin haklı olduğunu hemen söyle']],
    ['Biri sesini yükseltiyor.', ['Sakin bir tonla ne hissettiğini anladığını söyle', 'Konuyu değiştir', 'Sen de sesini yükselt']],
    ['Ortak nokta arıyorsun.', ['İkisinin de değer verdiği bir anıyı hatırlat', 'Küçük bir öneri sun', 'Bir tarafı tut']],
    ['Anlaşmaya çok yakınsınız.', ['Somut bir adım öner: "Pazar günü birlikte yemek yiyelim."', 'Zamana bırakmayı öner', 'Zorla el sıkıştır']],
  ] },
  sunum: { t: 'İkna sunumu', who: '🧐', rounds: [
    ['Dinleyiciler şüpheci görünüyor.', ['Onların yaşadığı sorunla başla', 'Rakamları hızla sırala', '"Bana güvenin" de']],
    ['Biri "Bu riskli değil mi?" diye soruyor.', ['Riski dürüstçe kabul et, önlemleri anlat', 'Soruyu sonraya bırak', '"Hiç risk yok" de']],
    ['İlgi artıyor.', ['Gerçek bir başarı hikâyesi anlat', 'Detaylı bir tablo göster', 'Abartılı vaatlerde bulun']],
    ['Karar zamanı.', ['Net ve kolay bir sonraki adım öner', '"Düşünün, haber verin" de', 'Hemen karar vermeleri için baskı yap']],
  ] },
  ders: { t: 'Sınıfta ders', who: '🧒', rounds: [
    ['Ders başladı; öğrenciler uykulu.', ['Merak uyandıran bir soru ya da deneyle başla', 'Doğrudan tahtaya yazmaya başla', '"Sessiz olun!" diye bağır']],
    ['Bir öğrenci konuyu anlamadı.', ['Farklı bir örnekle yeniden anlat', 'Aynı anlatımı tekrarla', '"Sonra bakarız" de']],
    ['İki öğrenci tartışıyor.', ['İkisini de dinle, sınıf kuralını hatırlat', 'Görmezden gel', 'İkisini de dışarı çıkar']],
    ['Ders bitiyor.', ['Kısa bir özet yap, merak uyandıran bir ödev ver', 'Ödevi hızlıca söyle', 'Zil çalınca hiçbir şey demeden çık']],
  ] },
};
register({
  id: 'konusma', name: 'Konuşma', icon: '🎤',
  how: ['Her turda karşındakinin ruh hâlini oku.', 'Üç cevaptan en uygununu seç — süren sınırlı.', 'Dürüst, somut ve saygılı cevaplar ikna eder.', 'Sonunda ilgi çubuğu puanını belirler.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      const key = api.extra.scene && SCENES[api.extra.scene] ? api.extra.scene : api.rng.pick(Object.keys(SCENES));
      const S = SCENES[key];
      let mood = 45;
      for (let i = 0; i < S.rounds.length; i++) {
        const [prompt, opts] = S.rounds[i];
        const moodTxt = mood > 70 ? 'Gözleri parlıyor, seni dikkatle dinliyor.' : mood > 45 ? 'İlgili ama henüz ikna olmadı.' : mood > 25 ? 'Sıkılmaya başladı, saatine bakıyor.' : 'Kollarını kavuşturdu, ikna olmuş görünmüyor.';
        const q = [['g', opts[0]], ['o', opts[1]], ['b', opts[2]]];
        const pick = await new Promise(res => {
          let done = false;
          const tBar = h('i', { style: { width: '100%' } });
          const limit = (10 - api.diff * 4 + api.ease * 2) * api.timeMul;
          const t0 = performance.now();
          const loop = () => { if (done) return; const f = 1 - (performance.now() - t0) / 1000 / limit; tBar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) { done = true; res('b'); } else requestAnimationFrame(loop); };
          stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
            h('div.row', {}, h('span.chip.accent', {}, S.t), h('span.grow'), h('span.chip', {}, `${i + 1}/4`)),
            h('div.face', {}, mood > 70 ? '😃' : mood > 45 ? '🙂' : mood > 25 ? '😐' : '😒'),
            h('div.meter', {}, 'İlgi', h('div.bar', {}, h('i', { style: { width: mood + '%', background: mood > 45 ? '#3ddc97' : '#ffb547' } }))),
            h('div.small.muted.center', {}, moodTxt),
            h('div.qcard', { style: { fontSize: '15.5px', minHeight: '70px' } }, prompt),
            h('div.bar', {}, tBar),
            h('div.qopts', {}, api.rng.shuffle(q).map(([k, t]) => h('button.qopt', { style: { fontSize: '14px' }, onclick: () => { if (!done) { done = true; res(k); } } }, t)))));
          loop();
          api.onCleanup(() => { done = true; });
        });
        mood = clamp(mood + (pick === 'g' ? 16 + api.ease * 6 : pick === 'o' ? 3 : -14 - api.diff * 4), 0, 100);
        pick === 'g' ? api.good('Etkili!') : pick === 'o' ? api.feedback('Hımm…', '#ffb547') : api.bad('Ters tepti');
        api.setScore(Math.round(mood));
        await sleep(600);
      }
      resolve(mood);
    });
  },
});

// ————————————————— SORGU / ÇELİŞKİ —————————————————
const CASES = [
  { f: 'Dükkândan saat 21.00\'de kasa çalındı. Yağmur 20.30\'da başladı ve gece boyunca sürdü.', s: ['"21.00\'de evdeydim, annemle dizi izliyordum."', '"Dükkânın önünden 21.00 gibi geçtim, hava kupkuruydu, yıldızlar parlıyordu."', '"Dükkânı 19.00\'da kapatıp çıktım."'], x: 1 },
  { f: 'Olay salı günü yaşandı. Şehir kütüphanesi salı günleri kapalıdır.', s: ['"Salı günü bütün gün kütüphanede ders çalıştım."', '"Salı akşamı arkadaşımın doğum günündeydim."', '"O gün işteydim, kart kayıtlarına bakabilirsiniz."'], x: 0 },
  { f: 'Semtte elektrikler 22.00 ile 23.00 arasında kesikti.', s: ['"22.30\'da mum ışığında kitap okuyordum."', '"22.30\'da evde bilgisayarda çevrim içi oyun oynuyordum."', '"23.15\'te ışıklar gelince yattım."'], x: 1 },
  { f: 'Maç 20.00\'de başladı ve 1-0 bitti. Tek golü 75. dakikada ev sahibi attı.', s: ['"Maçı başından sonuna tribünden izledim."', '"İlk yarıda atılan o golü unutamam!"', '"İkinci yarıda stattan çıktım."'], x: 1 },
  { f: 'Belediye otobüsleri gece 00.00\'da son seferini yapar.', s: ['"Saat 01.00\'de otobüsle eve döndüm."', '"Gece yarısından önce eve taksiyle döndüm."', '"23.30\'daki son otobüse zor yetiştim."'], x: 0 },
  { f: 'Toplantı 3. katta yapıldı. Asansör o gün bakımdaydı.', s: ['"Merdivenleri çıkarken nefes nefese kaldım."', '"Asansörle 3. kata çıkıp toplantıya yetiştim."', '"Toplantıya 10 dakika geç kaldım."'], x: 1 },
  { f: 'Köprü, kaza nedeniyle 18.00–20.00 arası trafiğe kapalıydı.', s: ['"19.00\'da köprüden geçtim, yol bomboştu."', '"Köprü kapalı olduğu için sahil yolunu kullandım."', '"20.30\'da evime vardım."'], x: 0 },
  { f: 'Mağaza sahibi çalınan telefonun siyah olduğunu söyledi.', s: ['"Şüpheli siyah bir telefonu cebine koydu."', '"Şüphelinin beyaz telefonu cebine koyduğunu gördüm; o çalınan telefondu."', '"Şüpheli kapıdan koşarak çıktı."'], x: 1 },
  { f: 'Tanık olayı saat 15.00\'te, güneşli bir öğleden sonra gördüğünü söylüyor.', s: ['"Gözlüklerimi takmıştım, her şeyi net gördüm."', '"Hava kararmıştı, sokak lambaları yanıyordu."', '"Şüpheli mavi bir ceket giyiyordu."'], x: 1 },
  { f: 'Kayıp köpek parka sabah 08.00\'de getirildi. Park 07.00\'de açılıyor.', s: ['"Parkı 07.00\'de açtım, köpek yoktu."', '"08.00\'de köpeği bankın yanında gördüm."', '"Köpeği 06.30\'da parkın içinde gezdirirken gördüm."'], x: 2 },
];
register({
  id: 'sorgu', name: 'Çelişkiyi Bul', icon: '🕵️',
  how: ['Önce dosyadaki kesin bilgiyi oku.', 'İfadelerden hangisi bu bilgiyle çelişiyor? Ona dokun.', 'Hızlı olmak bonus getirir.', '4 dosya.'],
  play(stage, api) {
    return new Promise(async resolve => {
      const list = api.rng.shuffle(CASES).slice(0, 4);
      let pts = 0;
      for (let i = 0; i < list.length; i++) {
        const C = list[i];
        const order = api.rng.shuffle([0, 1, 2]);
        const r = await new Promise(res => {
          let done = false;
          const els = order.map(k => h('button.qopt', { style: { fontSize: '14px' }, onclick: () => pick(k, els[order.indexOf(k)]) }, '🗣️ ', C.s[k]));
          stage.replaceChildren(h('div.col', { style: { gap: '10px' } },
            h('div.row', {}, h('span.chip.accent', {}, `Dosya ${i + 1}/4`)),
            h('div.tile', { style: { borderColor: '#ffb547' } }, h('div.small', { style: { color: '#ffd28a', fontWeight: 800 } }, '📁 Kesin bilgi'), h('div', { style: { fontWeight: 700 } }, C.f)),
            h('div.small.muted', {}, 'Hangi ifade gerçekle çelişiyor?'),
            h('div.qopts', {}, els)));
          const pick = (k, el) => {
            if (done) return; done = true; tl.stop();
            if (k === C.x) { el.classList.add('ok'); api.good('Yakaladın!'); res(18 + 7 * tl.left()); }
            else { if (el) el.classList.add('no'); els[order.indexOf(C.x)].classList.add('ok'); api.bad('Yanlış kişi'); res(0); }
          };
          const tl = api.timerLoop(20 - api.diff * 7 + api.ease * 5, () => pick(-1, null));
        });
        pts += r; api.setScore(Math.round(pts));
        await sleep(1000);
      }
      resolve(clamp(pts, 0, 100));
    });
  },
});

// ————————————————— KURTARMA —————————————————
register({
  id: 'kurtarma', name: 'Enkazdan Kurtarma', icon: '🦺',
  how: ['Toz yüzünden yalnızca çevreni görebilirsin.', 'Komşu karelere dokunarak ilerle, 🧍 kişilere ulaş.', 'Onları 🚪 çıkışa getir: kurtarılan sayılırlar.', 'Artçı sarsıntılar yeni enkaz düşürür — acele et!'],
  play(stage, api) {
    return new Promise(resolve => {
      const C = 7, R = 9;
      const vis = Math.round(2 + api.ease * 1.2 - api.diff * 0.6);
      let grid, pos, exit, people;
      const bfs = (from, to, g) => {
        const seen = new Set([from]); const q = [from];
        while (q.length) { const c = q.shift(); if (c === to) return true; const r = Math.floor(c / C), k = c % C; for (const [dr, dk] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nk = k + dk; const j = nr * C + nk; if (nr >= 0 && nk >= 0 && nr < R && nk < C && !seen.has(j) && g[j] !== 1) { seen.add(j); q.push(j); } } }
        return false;
      };
      for (let tries = 0; tries < 60; tries++) {
        grid = new Array(C * R).fill(0);
        exit = (R - 1) * C + Math.floor(C / 2);
        for (let i = 0; i < C * R; i++) if (i !== exit && api.rng.chance(0.26 + api.diff * 0.08)) grid[i] = 1;
        const free = [...grid.keys()].filter(i => grid[i] === 0 && i !== exit && Math.floor(i / C) < R - 2);
        people = api.rng.shuffle(free).slice(0, 3);
        if (people.length === 3 && people.every(p => bfs(exit, p, grid))) break;
      }
      people.forEach(p => grid[p] = 2);
      pos = exit;
      let carrying = 0, saved = 0, over = false, visited = new Set([exit]);
      const cells = grid.map((_, i) => h('div.cell', { style: { fontSize: '20px', borderRadius: '8px' }, onclick: () => move(i) }));
      const info = h('div.center.small', { style: { fontWeight: 800 } });
      stage.replaceChildren(h('div.col', {}, info, h('div.grid-board', { style: { gridTemplateColumns: `repeat(${C}, 1fr)`, gap: '3px', maxWidth: '360px' } }, cells)));
      const draw = () => {
        const pr = Math.floor(pos / C), pk = pos % C;
        cells.forEach((el, i) => {
          const r = Math.floor(i / C), k = i % C;
          const d = Math.abs(r - pr) + Math.abs(k - pk);
          const seen = d <= vis;
          if (seen) visited.add(i);
          const known = seen || visited.has(i);
          let t = '', bg = '#1a1f3d';
          if (!known) { bg = '#0a0c18'; }
          else if (i === pos) { t = '🦺'; bg = '#2c3a7a'; }
          else if (i === exit) { t = '🚪'; bg = '#1e4d3a'; }
          else if (grid[i] === 1) { t = '🧱'; bg = '#3a2f2a'; }
          else if (grid[i] === 2) { t = '🧍'; bg = '#4a3d1a'; }
          if (known && !seen) bg += 'aa';
          el.textContent = t; el.style.background = bg;
          el.style.opacity = known ? (seen ? 1 : 0.55) : 1;
        });
        info.textContent = `Yanında: ${carrying} · Kurtarılan: ${saved}/3`;
        api.setScore(`${saved}/3`);
      };
      const move = i => {
        if (over) return;
        const d = Math.abs(Math.floor(i / C) - Math.floor(pos / C)) + Math.abs(i % C - pos % C);
        if (d !== 1 || grid[i] === 1) return;
        pos = i; api.sfx.tap();
        if (grid[i] === 2) { grid[i] = 0; carrying++; api.good('Buldun!'); }
        if (i === exit && carrying) { saved += carrying; api.good(`${carrying} kişi kurtuldu!`); carrying = 0; if (saved === 3) end(); }
        draw();
      };
      const end = () => { if (over) return; over = true; tl.stop(); clearInterval(shock); resolve(clamp(saved / 3 * 85 + carrying * 8 + (saved === 3 ? tl.left() * 30 : 0), 0, 100)); };
      const tl = api.timerLoop(45 - api.diff * 10 + api.ease * 6, end);
      const shock = setInterval(() => {
        if (over) return;
        const cand = [...grid.keys()].filter(i => grid[i] === 0 && i !== pos && i !== exit);
        for (let k = 0; k < 2 + Math.round(api.diff * 2); k++) {
          const c = api.rng.pick(cand);
          grid[c] = 1;
          const ok = bfs(pos, exit, grid) && people.filter(p => grid[p] === 2).every(p => bfs(pos, p, grid));
          if (!ok) grid[c] = 0;
        }
        api.vibrate([40, 30, 40]); api.feedback('Artçı sarsıntı!', '#ffb547');
        stage.style.animation = 'shake .35s'; setTimeout(() => stage.style.animation = '', 400);
        draw();
      }, (6 - api.diff * 2) * 1000);
      api.onCleanup(() => clearInterval(shock));
      draw();
    });
  },
});

// ————————————————— RİTİM —————————————————
register({
  id: 'ritim', name: 'Ritim', icon: '🎵',
  how: ['Notalar dört şeritte aşağı düşer.', 'Nota çizgiye geldiğinde o şeride dokun.', 'Tam zamanlama MÜKEMMEL, yakın zamanlama İYİ sayılır.', 'Yanlış anda dokunmak kombonu bozar.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      const bpm = 84 + api.diff * 60;
      const beat = 60 / bpm;
      const dur = 24;
      const notes = [];
      for (let t = 2; t < dur - 1; t += beat * api.rng.pick([1, 1, 0.5, 2, 1])) {
        notes.push({ t, lane: api.rng.int(0, 3), hit: null });
        if (api.diff > 0.6 && api.rng.chance(0.15)) notes.push({ t, lane: api.rng.int(0, 3), hit: null });
      }
      const fall = 1.6 - api.diff * 0.5;
      const winP = 0.07 * (1 + api.ease * 0.5), winG = 0.15 * (1 + api.ease * 0.4);
      let t0 = performance.now(), perfect = 0, good = 0, combo = 0, flash = [0, 0, 0, 0], label = null;
      const now = () => (performance.now() - t0) / 1000;
      const tap = e => {
        const r = stage.getBoundingClientRect();
        const lane = clamp(Math.floor((e.clientX - r.left) / (r.width / 4)), 0, 3);
        flash[lane] = 0.15;
        const tn = now();
        let best = null, bd = 1;
        for (const n of notes) if (n.lane === lane && n.hit === null) { const d = Math.abs(n.t - tn); if (d < bd) { bd = d; best = n; } }
        if (best && bd <= winG) { best.hit = bd <= winP ? 'p' : 'g'; best.hit === 'p' ? perfect++ : good++; combo++; api.sfx.note(lane); label = { t: best.hit === 'p' ? 'MÜKEMMEL' : 'İYİ', c: best.hit === 'p' ? '#ffc53d' : '#3ddc97', at: tn }; }
        else { combo = 0; label = { t: 'ISKA', c: '#ff5b7a', at: tn }; }
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));
      api.loop(dt => {
        const W = stage.clientWidth, H = stage.clientHeight;
        const tn = now();
        api.setTimer(1 - tn / dur);
        for (const n of notes) if (n.hit === null && tn - n.t > winG) { n.hit = 'm'; combo = 0; }
        if (tn >= dur) { api.setTimer(0); resolve(clamp((perfect + good * 0.6) / notes.length * 105, 0, 100)); t0 = -1e12; return; }
        ctx.fillStyle = '#0e1128'; ctx.fillRect(0, 0, W, H);
        const lw = W / 4, hitY = H * 0.85;
        const cols = ['#7c6cff', '#29d3a6', '#ffb547', '#ff5b7a'];
        for (let l = 0; l < 4; l++) {
          ctx.fillStyle = flash[l] > 0 ? cols[l] + '44' : (l % 2 ? '#12163a' : '#141a40'); ctx.fillRect(l * lw, 0, lw, H);
          flash[l] = Math.max(0, flash[l] - dt);
        }
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(0, hitY - 2, W, 4);
        for (const n of notes) {
          if (n.hit && n.hit !== 'm') continue;
          const y = hitY - (n.t - tn) / fall * hitY;
          if (y < -30 || y > H + 30) continue;
          ctx.fillStyle = n.hit === 'm' ? '#555' : cols[n.lane];
          ctx.beginPath(); ctx.roundRect(n.lane * lw + 8, y - 11, lw - 16, 22, 10); ctx.fill();
        }
        ctx.textAlign = 'center';
        if (label && tn - label.at < 0.5) { ctx.fillStyle = label.c; ctx.font = '900 26px Nunito'; ctx.fillText(label.t, W / 2, H * 0.45); }
        if (combo > 2) { ctx.fillStyle = '#fff'; ctx.font = '800 16px Nunito'; ctx.fillText(`Kombo ×${combo}`, W / 2, H * 0.52); }
        ctx.textAlign = 'left';
        api.setScore(`${perfect + good}/${notes.length}`);
      });
    });
  },
});

// ————————————————— HASAT —————————————————
register({
  id: 'hasat', name: 'Hasat', icon: '🧺',
  how: ['Ürünler büyür, olgunlaşır ve bir süre sonra çürür.', 'Yalnızca OLGUN ürünlere dokun (🍅🌽🍇).', 'Ham ürüne dokunmak ceza. 🐛 zararlıları hemen temizle!', '30 saniye.'],
  play(stage, api) {
    return new Promise(resolve => {
      const N = 16;
      const FRUITS = ['🍅', '🌽', '🍇', '🍓'];
      const plots = Array.from({ length: N }, () => ({ st: 0, t: api.rng.float(0, 3), f: api.rng.pick(FRUITS), pest: false }));
      let harvested = 0, ripeTotal = 0, bad = 0, over = false;
      const ripeWin = clamp(1.6 - api.diff * 0.8 + api.ease * 0.5, 0.6, 2);
      const cells = plots.map((p, i) => h('button.cell', { style: { fontSize: '30px' }, onclick: () => tap(i) }));
      stage.replaceChildren(h('div.grid-board', { style: { gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '360px', margin: 'auto' } }, cells));
      const draw = () => cells.forEach((el, i) => {
        const p = plots[i];
        el.textContent = p.pest ? '🐛' : ['', '🌱', '🌿', p.f, '🥀'][p.st];
        el.style.background = p.st === 3 ? 'rgba(61,220,151,.22)' : p.st === 4 ? 'rgba(120,80,40,.4)' : '#3b2a1c';
      });
      const tap = i => {
        if (over) return;
        const p = plots[i];
        if (p.pest) { p.pest = false; api.sfx.tap(); draw(); return; }
        if (p.st === 3) { harvested++; p.st = 0; p.t = api.rng.float(0.5, 2); api.sfx.coin(); api.setScore(harvested); }
        else if (p.st === 1 || p.st === 2) { bad++; p.st = 0; p.t = 1.5; api.bad('Ham!'); }
        else if (p.st === 4) { p.st = 0; p.t = 0.5; }
        draw();
      };
      api.timerLoop(30, () => { over = true; resolve(clamp(harvested / Math.max(1, ripeTotal) * 110 - bad * 4, 0, 100)); });
      api.loop(dt => {
        if (over) return;
        let ch = false;
        for (const p of plots) {
          if (p.pest) { p.pt -= dt; if (p.pt <= 0) { p.pest = false; p.st = 4; p.t = 1.5; ch = true; } continue; }
          p.t -= dt * (1 + api.diff * 0.5);
          if (p.t <= 0) {
            ch = true;
            if (p.st === 0) { p.st = 1; p.t = api.rng.float(1, 2); }
            else if (p.st === 1) { p.st = 2; p.t = api.rng.float(1, 2); if (api.rng.chance(api.diff * 0.25)) { p.pest = true; p.pt = 2.2 - api.diff * 0.6; } }
            else if (p.st === 2) { p.st = 3; p.t = ripeWin; ripeTotal++; }
            else if (p.st === 3) { p.st = 4; p.t = 1.2; }
            else { p.st = 0; p.t = api.rng.float(0.5, 2); }
          }
        }
        if (ch) draw();
      });
      draw();
    });
  },
});

// ————————————————— EKİM PLANI —————————————————
const CROPS = [
  { e: '🌾', n: 'Buğday', w: 1, t: 1, p: 90 }, { e: '🍅', n: 'Domates', w: 3, t: 3, p: 130 }, { e: '🌽', n: 'Mısır', w: 2, t: 3, p: 110 },
  { e: '🫘', n: 'Nohut', w: 1, t: 2, p: 100 }, { e: '🥔', n: 'Patates', w: 2, t: 1, p: 95 }, { e: '🍉', n: 'Karpuz', w: 2, t: 3, p: 120 },
];
const SOILS = [['Killi', 1, '🟤'], ['Tınlı', 0, '🟫'], ['Kumlu', -1, '🏜️']];
register({
  id: 'ekim', name: 'Ekim Planı', icon: '🌱',
  how: ['Her tarlaya mevsime ve toprağa en uygun ürünü ek.', 'Killi toprak suyu tutar (+1 su), kumlu toprak kaçırır (−1). Sulama +1 su.', 'Hava tahminine göre sıcaklığı ve yağışı düşün. Tahmin şaşabilir!', 'Pazar fiyatı yüksek ürünler daha çok kazandırır.'],
  play(stage, api) {
    return new Promise(async resolve => {
      api.hideTimer();
      let earned = 0, best = 0;
      const lv = ['Az', 'Orta', 'Çok'];
      const tl = ['Serin', 'Ilık', 'Sıcak'];
      for (const season of ['🌸 İlkbahar–Yaz', '🍂 Sonbahar–Kış']) {
        const warm = season.startsWith('🌸');
        const actual = { t: warm ? api.rng.int(2, 3) : api.rng.int(1, 2), r: api.rng.int(1, 3) };
        const miss = api.rng.chance(api.diff * 0.5 - api.ease * 0.15);
        const fc = { t: actual.t, r: miss ? clamp(actual.r + api.rng.pick([-1, 1]), 1, 3) : actual.r };
        const hot = api.rng.pick(CROPS);
        const fields = Array.from({ length: 4 }, () => { const s = api.rng.pick(SOILS); return { soil: s, irr: api.rng.chance(0.4), crop: null }; });
        const yieldOf = (f, c, wx) => { const w = clamp(wx.r + f.soil[1] + (f.irr ? 1 : 0), 1, 3); return Math.max(10, 100 - 32 * Math.abs(w - c.w) - 32 * Math.abs(wx.t - c.t)); };
        const price = c => c.p * (c === hot ? 1.4 : 1);
        await new Promise(res => {
          let sel = 0;
          const render = () => {
            stage.replaceChildren(h('div.col', { style: { gap: '8px' } },
              h('div.row', {}, h('h3', {}, season), h('span.grow'), h('span.chip', {}, '💰 ', Math.round(earned))),
              h('div.tile', {}, h('div.small', {}, `🌡️ Tahmin: ${tl[fc.t - 1]} · 🌧️ Yağış: ${lv[fc.r - 1]}`), h('div.small', { style: { color: '#ffd28a' } }, `📈 Pazarda ${hot.e} ${hot.n} fiyatı yüksek (+%40)`)),
              h('div.grid-board', { style: { gridTemplateColumns: '1fr 1fr', gap: '8px' } }, fields.map((f, i) => h('button.tile' + (i === sel ? '.sel' : ''), { style: { textAlign: 'left' }, onclick: () => { sel = i; render(); } },
                h('div.row', {}, h('b', {}, `Tarla ${i + 1}`), h('span.grow'), h('span', { style: { fontSize: '26px' } }, f.crop ? f.crop.e : '➕')),
                h('div.tiny.muted', {}, `${f.soil[2]} ${f.soil[0]} ${f.irr ? '· 💧 Sulama' : ''}`)))),
              h('div.small.muted', {}, `Tarla ${sel + 1} için ürün seç:`),
              h('div.picks', {}, CROPS.map(c => h('button.pick' + (fields[sel].crop === c ? '.sel' : ''), { onclick: () => { fields[sel].crop = c; api.sfx.tap(); sel = Math.min(3, sel + 1); render(); } },
                h('span.e', {}, c.e), c.n, h('div.tiny.muted', {}, `Su ${lv[c.w - 1]} · ${tl[c.t - 1]}`)))),
              btn('Sezonu başlat ▶', () => { if (fields.every(f => f.crop)) res(); }, 'primary block' + (fields.every(f => f.crop) ? '' : ' disabled'))));
          };
          render();
        });
        let sEarn = 0, sBest = 0;
        const lines = fields.map((f, i) => {
          const y = yieldOf(f, f.crop, actual);
          const bestC = Math.max(...CROPS.map(c => yieldOf(f, c, actual) * price(c)));
          sEarn += y * price(f.crop); sBest += bestC;
          return h('div.row.small', {}, `Tarla ${i + 1}: ${f.crop.e} verim %${Math.round(y)}`, h('span.grow'), h('b', {}, Math.round(y * price(f.crop))));
        });
        earned += sEarn; best += sBest;
        stage.replaceChildren(h('div.col', {}, h('div.tile', {}, h('b', {}, `Gerçekleşen: ${tl[actual.t - 1]}, yağış ${lv[actual.r - 1]}`), miss ? h('div.small', { style: { color: '#ffb547' } }, 'Tahmin şaştı!') : null), h('div.tile', {}, ...lines)));
        sEarn / sBest > 0.85 ? api.good('Bereketli sezon!') : api.feedback('Verim orta', '#ffb547');
        api.setScore(Math.round(earned / best * 100) + '%');
        await sleep(2000);
      }
      resolve(clamp(Math.pow(earned / best, 1.6) * 100, 0, 100));
    });
  },
});
