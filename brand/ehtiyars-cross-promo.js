/* Ehtiyars Game — "diğer oyunlarımız". Her oyunun ana menüsünde aynı satır durur
   ve stüdyonun diğer iki oyununa gider. Telefonda play.google.com bağlantısını
   Play uygulaması yakalar; tarayıcıda mağaza sayfası açılır.
   Kaynak: ehtiyarsgame.github.io/brand/intro — oyunlara kopyalanır, elle düzenlenmez. */
(function (root) {
  'use strict';

  var GAMES = [
    {
      id: 'galaxypaws', name: 'Galaxy Paws', pkg: 'com.ehtiyarsgame.galaxypaws',
      icon: 'galaxypaws.png',
      tr: 'Pofuduk pilotlar, şeker canavarlar', en: 'Fluffy pilots, candy monsters'
    },
    {
      id: 'lifetide', name: 'Lifetide', pkg: 'com.ehtiyarsgame.lifetide',
      icon: 'lifetide.png',
      tr: 'Bir ömür, binlerce karar', en: 'One life, a thousand choices'
    },
    {
      id: 'dunefall', name: 'Dunefall', pkg: 'com.ehtiyarsgame.dunefall',
      icon: 'dunefall.svg',
      tr: 'Kumu elinle dök, duvardan duvara', en: 'Pour sand by hand, wall to wall'
    }
  ];

  /**
   * @param {object} o
   * @param {string} o.self bu oyunun id'si — listede kendisi görünmez
   * @param {string} [o.lang] 'tr' | 'en'
   * @param {string} [o.base='brand/games/'] simgelerin bulunduğu klasör
   * @returns {HTMLElement} menüye eklenmeye hazır satır
   */
  function row(o) {
    o = o || {};
    var en = (o.lang || document.documentElement.lang || 'tr').slice(0, 2).toLowerCase() !== 'tr';
    var base = o.base == null ? 'brand/games/' : o.base;

    var wrap = document.createElement('div');
    wrap.className = 'eg-more';
    var head = document.createElement('div');
    head.className = 'eg-more-head';
    head.textContent = en ? 'More from Ehtiyars Game' : 'Diğer oyunlarımız';
    wrap.appendChild(head);
    var list = document.createElement('div');
    list.className = 'eg-more-row';
    wrap.appendChild(list);

    GAMES.forEach(function (g) {
      if (g.id === o.self) return;
      var a = document.createElement('a');
      a.href = 'https://play.google.com/store/apps/details?id=' + g.pkg;
      a.target = '_blank';
      a.rel = 'noopener';
      var img = document.createElement('img');
      img.src = base + g.icon;
      img.alt = '';
      a.appendChild(img);
      var txt = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = g.name;
      var s = document.createElement('span');
      s.textContent = en ? g.en : g.tr;
      txt.appendChild(b);
      txt.appendChild(s);
      a.appendChild(txt);
      list.appendChild(a);
    });
    return wrap;
  }

  /** Satırı bir kapsayıcıya ekler; aynı kapsayıcıda iki kez çoğalmaz. */
  function mount(parent, o) {
    if (!parent) return null;
    var old = parent.querySelector(':scope > .eg-more');
    if (old) old.remove();
    var el = row(o);
    parent.appendChild(el);
    return el;
  }

  root.EhtiyarsGames = { GAMES: GAMES, row: row, mount: mount };
}(typeof window !== 'undefined' ? window : this));
