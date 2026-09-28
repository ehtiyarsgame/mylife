// Borsa mini oyunu: fiyat grafiği akarken doğru anda al, doğru anda sat.
// Haberler büyük hareketlerden kısa süre önce gelir: dikkatli oyuncu önden davranır.
import { register } from './engine.js';
import { clamp } from '../core/util.js';

const NEWS_UP = ['📰 Rekor kâr beklentisi!', '📰 Büyük ihale kazanıldı', '📰 Faiz indirimi sinyali', '📰 Yeni ürün çok beğenildi'];
const NEWS_DOWN = ['📰 Skandal iddiası!', '📰 Satışlar beklentinin altında', '📰 Kriz endişesi büyüyor', '📰 Dava kaybedildi'];

register({
  id: 'borsa', name: 'Al-Sat', icon: '📈',
  how: ['Fiyat grafiği akıyor. Sol alttaki AL ile tüm paranla alırsın, sağdaki SAT ile satarsın.', 'Haberler büyük hareketlerden az önce çıkar: iyi haberde al, kötü haberde sat.', 'Her işlemde küçük bir komisyon ödersin; boşuna al-sat yapma.', 'Süre bitince portföyünün kârı puanını belirler.'],
  play(stage, api) {
    return new Promise(resolve => {
      const { ctx } = api.canvas();
      const r = api.rng;
      const noise = 0.006 + api.diff * 0.006 - api.ease * 0.002;
      const lead = 1.4 + api.ease * 0.8; // haberin hareketten kaç sn önce geldiği
      let W = stage.clientWidth, H = stage.clientHeight;
      let price = 100, cash = 10000, shares = 0, trades = 0;
      const hist = [price];
      let drift = 0, regimeT = 0, news = null, pending = null, flash = null, done = false, acc = 0;
      const value = () => cash + shares * price;
      const fee = 0.004;
      const buy = () => { if (shares || done) return; shares = cash * (1 - fee) / price; cash = 0; trades++; api.sfx.coin(); api.vibrate(10); flash = { t: 'AL', c: '#3ddc97', at: performance.now() }; };
      const sell = () => { if (!shares || done) return; cash = shares * price * (1 - fee); shares = 0; trades++; api.sfx.tap(); api.vibrate(10); flash = { t: 'SAT', c: '#ff5b7a', at: performance.now() }; };
      const tap = e => {
        const b = stage.getBoundingClientRect();
        const x = e.clientX - b.left, y = e.clientY - b.top;
        if (y < H * 0.78) return;
        x < W / 2 ? buy() : sell();
      };
      stage.addEventListener('pointerdown', tap);
      api.onCleanup(() => stage.removeEventListener('pointerdown', tap));

      const tm = api.timerLoop(30, () => {
        done = true;
        const gain = value() / 10000 - 1;
        resolve(clamp(45 + gain * 280, 0, 100));
      });
      api.onCleanup(() => tm.stop());

      api.loop((dt, now) => {
        W = stage.clientWidth; H = stage.clientHeight;
        if (!done) {
          acc += dt;
          // Rejim: fiyat bir süre bir yöne eğilimli gider
          regimeT -= dt;
          if (regimeT <= 0) { drift = r.normal(0, 0.004); regimeT = r.float(2, 4); }
          // Haber → birkaç saniye sonra sert hareket
          if (!pending && r.chance(dt * 0.22)) {
            const up = r.chance(0.5);
            pending = { up, at: now + lead * 1000, size: r.float(0.08, 0.16) };
            news = { t: r.pick(up ? NEWS_UP : NEWS_DOWN), up, at: now };
          }
          while (acc >= 0.1) {
            acc -= 0.1;
            let step = drift + r.normal(0, noise);
            if (pending && now >= pending.at) {
              const k = pending.size / 6;
              step += pending.up ? k : -k;
              pending.left = (pending.left ?? 6) - 1;
              if (pending.left <= 0) pending = null;
            }
            price = Math.max(5, price * (1 + step));
            hist.push(price); if (hist.length > 120) hist.shift();
          }
          const gain = value() / 10000 - 1;
          api.setScore(`${gain >= 0 ? '+' : ''}${(gain * 100).toFixed(1)}%`);
        }
        // ——— Çizim ———
        ctx.fillStyle = '#0f1530'; ctx.fillRect(0, 0, W, H);
        const top = H * 0.2, bot = H * 0.74;
        const mn = Math.min(...hist) * 0.98, mx = Math.max(...hist) * 1.02;
        const yOf = p => bot - (p - mn) / (mx - mn || 1) * (bot - top);
        ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const y = top + (bot - top) * i / 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        const up = hist[hist.length - 1] >= hist[0];
        ctx.beginPath();
        hist.forEach((p, i) => { const x = W * 0.04 + (W * 0.8) * i / 119; i ? ctx.lineTo(x, yOf(p)) : ctx.moveTo(x, yOf(p)); });
        ctx.strokeStyle = up ? '#3ddc97' : '#ff5b7a'; ctx.lineWidth = 2.5; ctx.stroke();
        const lx = W * 0.04 + (W * 0.8) * (hist.length - 1) / 119, ly = yOf(price);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lx, ly, 4, 0, 7); ctx.fill();
        // Fiyat etiketi (grafiğin sağında, ayrı sütun)
        ctx.font = '800 13px Nunito, system-ui, sans-serif'; ctx.textAlign = 'left';
        ctx.fillStyle = '#c9d1ff'; ctx.fillText(price.toFixed(1), W * 0.86, clamp(ly + 4, top + 10, bot));
        // Üst bilgi satırı: nakit / hisse
        ctx.font = '800 13px Nunito, system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.fillText(shares ? `📦 Hissedesin · değer ${Math.round(value())}` : `💵 Nakittesin · ${Math.round(cash)}`, 12, 22);
        ctx.textAlign = 'right'; ctx.fillText(`İşlem: ${trades}`, W - 12, 22);
        // Haber şeridi (kendi satırında)
        if (news && now - news.at < 3200) {
          ctx.textAlign = 'center'; ctx.font = '900 15px Nunito, system-ui, sans-serif';
          const tw = ctx.measureText(news.t).width + 24;
          ctx.fillStyle = news.up ? 'rgba(61,220,151,.18)' : 'rgba(255,91,122,.18)';
          ctx.fillRect(W / 2 - tw / 2, H * 0.07, tw, 26);
          ctx.fillStyle = news.up ? '#8ff0c4' : '#ff9db0';
          ctx.fillText(news.t, W / 2, H * 0.07 + 18);
        }
        // Düğmeler
        const by = H * 0.8, bh = H * 0.16;
        const btnD = (x, w, label, col, on) => {
          ctx.fillStyle = on ? col : 'rgba(255,255,255,.06)'; ctx.globalAlpha = on ? 0.95 : 1;
          ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, by, w, bh, 16) : ctx.rect(x, by, w, bh); ctx.fill(); ctx.globalAlpha = 1;
          ctx.fillStyle = on ? '#0b0f22' : 'rgba(255,255,255,.35)'; ctx.font = '900 22px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(label, x + w / 2, by + bh / 2 + 8);
        };
        btnD(W * 0.03, W * 0.45, 'AL', '#3ddc97', !shares);
        btnD(W * 0.52, W * 0.45, 'SAT', '#ff5b7a', !!shares);
        // İşlem onayı: noktanın hemen üstünde küçük etiket
        if (flash && now - flash.at < 700) {
          ctx.font = '900 14px Nunito, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = flash.c;
          ctx.fillText(flash.t, lx, Math.max(top - 4, ly - 14));
        }
        ctx.textAlign = 'left';
      });
    });
  },
});
