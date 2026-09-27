// Tohumlu rastgele sayı üreteci (mulberry32). Durumu tek bir sayıdır, kayda yazılabilir.
// Aynı tohum + aynı kararlar = aynı hayat. Günlük meydan okuma bunun üstüne kurulur.

export function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class RNG {
  constructor(seed) {
    this.s = (typeof seed === 'string' ? hashString(seed) : seed) >>> 0;
  }
  next() {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  float(a = 0, b = 1) { return a + (b - a) * this.next(); }
  int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); }
  chance(p) { return this.next() < p; }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  // [[değer, ağırlık], ...]
  weighted(pairs) {
    const total = pairs.reduce((s, p) => s + p[1], 0);
    let r = this.next() * total;
    for (const [v, w] of pairs) { if ((r -= w) < 0) return v; }
    return pairs[pairs.length - 1][0];
  }
  normal(mean = 0, sd = 1) {
    const u = 1 - this.next(), v = this.next();
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// Mini oyunlar görsel rastgelelik için kendi üreteçlerini kullanır; hayat tohumunu bozmazlar.
export const fx = new RNG((Date.now() ^ (Math.random() * 1e9)) >>> 0);
