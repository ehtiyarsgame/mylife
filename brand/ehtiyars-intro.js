/* Ehtiyars Game — ortak açılışın zamanlaması. Oyunun kendi kodu bir kez
   EhtiyarsIntro.run() çağırır; gerisi her oyunda aynıdır:
     · stüdyo amblemi + "EHTIYARS GAME" + sunar/presents  →  oyunun logosu
     · toplam 3,3 sn, sonra 0,5 sn ile solar ve DOM'dan silinir
     · ekrana dokunmak doğrudan solmaya geçirir
     · hareketi azaltılmış cihazda yarı süre ve ölçeksiz
   Kaynak: ehtiyarsgame.github.io/brand/intro — oyunlara kopyalanır, elle düzenlenmez. */
(function (root) {
  'use strict';

  var TOTAL = 3300;  // ms: amblem + oyun logosu birlikte ne kadar durur
  var FADE = 500;    // ms: CSS'teki .eg-intro geçiş süresiyle aynı olmalı
  var QUICK = 1400;  // ms: prefers-reduced-motion

  function reduced() {
    try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }

  /**
   * @param {object} [o]
   * @param {Element|string} [o.el='#eg-intro'] açılış katmanı
   * @param {string} [o.lang] 'tr' veya 'en' — alt yazıları çevirir
   * @param {string} [o.tagline] oyunun sloganı (verilmezse HTML'deki kalır)
   * @param {number} [o.since] performance.now() değeri: sayaç buradan başlar
   * @returns {Promise<void>} açılış kapandığında çözülür
   */
  function run(o) {
    o = o || {};
    var el = typeof o.el === 'string' ? document.querySelector(o.el)
      : (o.el || document.getElementById('eg-intro'));
    if (!el) return Promise.resolve();

    var quick = reduced();
    if (quick) el.classList.add('eg-quick');

    var en = (o.lang || document.documentElement.lang || 'tr').slice(0, 2).toLowerCase() !== 'tr';
    var sub = el.querySelector('[data-eg-sub]');
    if (sub) sub.textContent = en ? 'presents' : 'sunar';
    var tag = el.querySelector('[data-eg-tag]');
    if (tag && o.tagline) tag.textContent = o.tagline;

    return new Promise(function (done) {
      var closed = false;
      function end() {
        if (closed) return;
        closed = true;
        el.classList.add('eg-out');
        root.setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
          done();
        }, FADE);
      }
      el.addEventListener('pointerdown', end);
      el.addEventListener('click', end);
      var spent = typeof o.since === 'number' ? Math.max(0, performance.now() - o.since) : 0;
      root.setTimeout(end, Math.max(0, (quick ? QUICK : TOTAL) - spent));
    });
  }

  root.EhtiyarsIntro = { run: run, TOTAL: TOTAL, FADE: FADE, QUICK: QUICK };
}(typeof window !== 'undefined' ? window : this));
