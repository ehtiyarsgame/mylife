// Küçük DOM yardımcıları ve ortak bileşenler (modal, toast, onay).
import { sfx, vibrate } from '../core/audio.js';

export function h(tag, attrs = {}, ...kids) {
  const [t, ...cls] = tag.split('.');
  const el = document.createElement(t || 'div');
  if (cls.length) el.className = cls.join(' ');
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, kids);
  return el;
}
function append(el, kids) {
  for (const k of kids.flat(Infinity)) {
    if (k === null || k === undefined || k === false) continue;
    el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  }
}
export const $ = (sel, root = document) => root.querySelector(sel);

export function btn(label, onClick, cls = '') {
  return h('button.btn' + (cls ? '.' + cls.split(' ').join('.') : ''), { onclick: e => { sfx.tap(); onClick?.(e); } }, label);
}

let toastWrap;
export function toast(text, ms = 2200) {
  if (!toastWrap) { toastWrap = h('div.toast-wrap'); document.body.append(toastWrap); }
  const t = h('div.toast', {}, text);
  toastWrap.append(t);
  setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, ms);
}

export function floatNum(text, x, y, color = '#fff') {
  const el = h('div.float-num', { style: { left: x + 'px', top: y + 'px', color } }, text);
  document.body.append(el);
  setTimeout(() => el.remove(), 1000);
}

// Alt sayfa modal. content: Node | (close) => Node. Promise döner (close(value)).
export function sheet(content, { center = false, dismissable = true } = {}) {
  return new Promise(resolve => {
    const ov = h('div.overlay' + (center ? '.center' : ''));
    const sh = h('div.sheet');
    const close = v => { ov.remove(); resolve(v); };
    if (!center) sh.append(h('div.handle'));
    sh.append(typeof content === 'function' ? content(close) : content);
    ov.append(sh);
    if (dismissable) ov.addEventListener('click', e => { if (e.target === ov) close(undefined); });
    document.body.append(ov);
  });
}

export function confirmBox(title, text, yes = 'Evet', no = 'Vazgeç', cls = 'primary') {
  return sheet(close => h('div', {},
    h('h2', {}, title),
    h('p.muted', {}, text),
    h('div.btns', {}, btn(yes, () => close(true), cls), btn(no, () => close(false), 'ghost')),
  ), { center: true });
}

export function info(title, body, ok = 'Tamam') {
  return sheet(close => h('div', {}, h('h2', {}, title), h('div.sp'), body, h('div.btns', {}, btn(ok, () => close(true), 'primary'))), { center: true });
}

// Nadir kart açılış efekti
export function rarityReveal(rarity) {
  if (rarity !== 'legendary' && rarity !== 'epic') return Promise.resolve();
  return new Promise(res => {
    const leg = rarity === 'legendary';
    leg ? sfx.legend() : sfx.epic();
    vibrate(leg ? [60, 40, 60, 40, 160] : [40, 30, 40]);
    const el = h('div.reveal' + (leg ? '' : '.epic'), {},
      h('div', {}, h('div.burst.center', {}, leg ? '🌟' : '💜'), h('div.lbl', {}, leg ? 'EFSANEVİ AN' : 'EPİK OLAY')));
    document.body.append(el);
    const done = () => { el.remove(); res(); };
    el.addEventListener('click', done);
    setTimeout(done, leg ? 1900 : 1200);
  });
}

export const statColor = v => v >= 70 ? '#3ddc97' : v >= 40 ? '#7c9cff' : v >= 25 ? '#ffb547' : '#ff5b7a';

export function bar(pct, color, cls = '') {
  return h('div.bar' + (cls ? '.' + cls : ''), {}, h('i', { style: { width: Math.max(0, Math.min(100, pct)) + '%', background: color } }));
}
