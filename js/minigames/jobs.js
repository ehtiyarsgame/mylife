// Mesleklere özgü mini oyunlar: her meslek kendi işini oynar (hazır motorlardan türetilir).
import { catchGame, sortGame, pairGame, oddGame, stackGame, runGame, whackGame, dialGame, quickGame } from './engines.js';
import { fmtTL } from '../core/util.js';
import { lang } from '../core/i18n.js';

const tl = n => fmtTL(n);
// Yanlış şık üretici (benzersiz, pozitif)
function near(a, rng, steps, fmt = String) {
  const w = new Set();
  let g = 0;
  while (w.size < 3 && g++ < 60) { const v = a + rng.pick(steps); if (v !== a && v > 0) w.add(fmt(v)); }
  while (w.size < 3) w.add(fmt(a + (w.size + 2) * (steps[steps.length - 1] || 1)));
  return { a: fmt(a), w: [...w] };
}

// ——— Garson ———
sortGame({ id: 'servis_sirasi', name: 'Servis Sırası', icon: '🍽️', bins: ['Başlangıç', 'Ana yemek', 'Tatlı', 'İçecek'], tags: ['is'],
  items: [['🥗 Salata', 0], ['🍲 Çorba', 0], ['🥖 Sarımsaklı ekmek', 0], ['🍝 Makarna', 1], ['🥩 Izgara et', 1], ['🐟 Fırın balık', 1], ['🍛 Tavuk sote', 1], ['🍰 Pasta', 2], ['🍨 Dondurma', 2], ['🍮 Puding', 2], ['☕ Kahve', 3], ['🍋 Limonata', 3], ['🫖 Çay', 3], ['🥤 Soda', 3]] });
// ——— Fabrika işçisi ———
whackGame({ id: 'uretim_bandi', name: 'Üretim Bandı', icon: '🏭', good: '⚠️', bad: '✅', hole: '⚙️', holeBg: '#2a2f3a',
  how: ['Bantta hatalı ürün ⚠️ belirince hemen ayıkla.', 'Sağlam ürüne ✅ dokunma, bant durur!', '25 saniye.'], tags: ['is'] });
// ——— Kargo şoförü ———
quickGame({ id: 'teslimat_suresi', name: 'Teslimat Süresi', icon: '🚚', target: 9, tags: ['is'], gen: r => {
  const v = r.pick([40, 50, 60, 80, 90, 100, 120]), t = r.pick([15, 20, 30, 45, 60, 90, 120]);
  const km = v * t / 60;
  return { q: `${km} km yolu ${v} km/sa hızla kaç dakikada gidersin?`, ...near(t, r, [-15, -10, 10, 15, 30, -30]) };
} });
// ——— Memur ———
sortGame({ id: 'evrak_ayikla', name: 'Evrak Masası', icon: '🗂️', bins: ['Nüfus', 'Tapu', 'Vergi', 'Sosyal güvenlik'], tags: ['is'],
  items: [['Kimlik kartı yenileme', 0], ['Doğum kaydı', 0], ['Adres değişikliği', 0], ['Pasaport başvurusu', 0], ['Ev satışı', 1], ['Arsa ölçümü', 1], ['İpotek kaydı', 1], ['Miras payı devri', 1], ['Beyanname', 2], ['Vergi borcu yapılandırma', 2], ['Şirket açılışı vergi kaydı', 2], ['Emeklilik başvurusu', 3], ['Sağlık sigortası', 3], ['İşsizlik ödeneği', 3], ['Hizmet dökümü', 3]] });
// ——— Polis ———
oddGame({ id: 'supheli_teshis', name: 'Şüpheli Teşhisi', icon: '🕵️', ask: 'Tanığın tarif ettiği kişiyi bul', tags: ['is'], pairs: [['🧑', '🧔'], ['👱', '👨‍🦰'], ['👩', '👩‍🦱'], ['🧓', '👴'], ['👨', '🧑‍🦲']] });
runGame({ id: 'devriye', name: 'Devriye', icon: '🚓', player: '🚓', obstacles: ['🚗', '🚕', '🚧', '🛻'], bonus: '📻', bg: '#2d3444', tags: ['is'] });
// ——— Öğretmen ———
quickGame({ id: 'sinif_ortalama', name: 'Karne Notu', icon: '📊', target: 9, tags: ['is'], gen: r => {
  const n = r.pick([3, 4]); const g = Array.from({ length: n }, () => r.int(8, 20) * 5);
  const avg = Math.round(g.reduce((a, b) => a + b, 0) / n);
  return { q: `Sınav notları: ${g.join(', ')}. Ortalama (yuvarla)?`, ...near(avg, r, [-5, -3, 3, 5, 10, -10]) };
} });
sortGame({ id: 'odev_okuma', name: 'Ödev Okuma', icon: '✏️', bins: ['Doğru', 'Yanlış'], tags: ['is'],
  items: [['7 × 8 = 56', 0], ['9 × 6 = 56', 1], ['144 ÷ 12 = 12', 0], ['15 + 27 = 41', 1], ['Başkent: Kanada → Ottawa', 0], ['Su 50 °C\'de kaynar', 1], ['Üçgenin iç açıları 180°', 0], ['Dünya Güneş\'in çevresinde döner', 0], ['0,5 = %50', 0], ['√81 = 8', 1], ['Balinalar balıktır', 1], ['1 km = 1000 m', 0], ['3² = 6', 1], ['Ay bir gezegendir', 1]] });
// ——— Hemşire ———
dialGame({ id: 'serum_hizi', name: 'Serum Hızı', icon: '💧', min: 0, max: 60, dec: 0, unit: 'damla/dk', ask: 'Doktorun istediği hız', gen: r => r.pick([12, 15, 20, 24, 28, 30, 35, 40, 45]), tags: ['saglik'] });
// ——— Doktor ———
sortGame({ id: 'belirti_bolum', name: 'Hangi Bölüm?', icon: '🏥', bins: ['Kardiyoloji', 'Nöroloji', 'Ortopedi', 'Dermatoloji'], tags: ['saglik'],
  items: [['Göğüs ağrısı, çarpıntı', 0], ['Yüksek tansiyon', 0], ['Nefes darlığı, bacakta şişlik', 0], ['Şiddetli baş ağrısı', 1], ['El titremesi', 1], ['Bayılma nöbeti', 1], ['Yüzde uyuşma', 1], ['Bilek kırığı', 2], ['Diz ağrısı', 2], ['Bel fıtığı', 2], ['Omuz çıkığı', 2], ['Kaşıntılı döküntü', 3], ['Sivilce', 3], ['Değişen ben', 3], ['Güneş yanığı', 3]] });
// ——— Eczacı ———
pairGame({ id: 'recete_eslestir', name: 'Reçete Eşleştir', icon: '💊', hint: 'Şikâyet → ilaç türü', tags: ['saglik'],
  pairs: [['Ateş', 'Ateş düşürücü'], ['Bakteriyel enfeksiyon', 'Antibiyotik'], ['Saman nezlesi', 'Antihistaminik'], ['Mide yanması', 'Mide koruyucu'], ['Öksürük', 'Öksürük şurubu'], ['Kas ağrısı', 'Ağrı kesici krem'], ['Uykusuzluk', 'Bitkisel uyku desteği'], ['Göz kuruluğu', 'Suni gözyaşı'], ['Mantar', 'Antifungal krem'], ['Yüksek tansiyon', 'Tansiyon ilacı'], ['Kabızlık', 'Lif takviyesi'], ['Vitamin eksikliği', 'Multivitamin']] });
// ——— Diş hekimi ———
whackGame({ id: 'curuk_temizle', name: 'Çürük Temizliği', icon: '🦷', good: '🟤', bad: '🦷', hole: '', holeBg: '#3a2b35',
  how: ['Çürük 🟤 görünen dişi hemen temizle.', 'Sağlam dişe 🦷 dokunma!', '25 saniye.'], tags: ['saglik'] });
// ——— Mühendis ———
stackGame({ id: 'kopru_kur', name: 'Köprü Kirişi', icon: '🌉', colors: ['#7f8fa6', '#6c7a91', '#95a5bd'], bg: '#1b2638', tags: ['teknik'] });
quickGame({ id: 'yuk_hesabi', name: 'Yük Hesabı', icon: '🏗️', target: 9, tags: ['teknik'], gen: r => {
  const t = r.int(0, 1);
  if (t === 0) { const n = r.int(3, 12), kg = r.pick([250, 400, 500, 750, 800, 1200]); return { q: `Köprüye ${n} araç çıkıyor, her biri ${kg} kg. Toplam yük (kg)?`, ...near(n * kg, r, [-kg, kg, -100, 100, 500]) }; }
  const a = r.int(4, 20), b = r.int(3, 15), h = r.int(2, 6); return { q: `${a} m × ${b} m × ${h} m beton kalıp. Kaç m³ beton?`, ...near(a * b * h, r, [-a * b, a * b, -10, 10, 20]) };
} });
// ——— Yazılımcı ———
sortGame({ id: 'hata_turu', name: 'Hata Sınıflandırma', icon: '🐞', bins: ['Sözdizimi', 'Mantık', 'Performans', 'Güvenlik'], tags: ['teknik'],
  items: [['Kapanmamış parantez', 0], ['Eksik noktalı virgül', 0], ['Yanlış yazılmış anahtar kelime', 0], ['İndirim iki kez uygulanıyor', 1], ['Döngü bir eksik dönüyor', 1], ['Yaş kontrolü ters', 1], ['Sayfa 12 saniyede açılıyor', 2], ['Her tıkta tüm veritabanı okunuyor', 2], ['Bellek sürekli artıyor', 2], ['Şifre düz metin saklanıyor', 3], ['Girdi temizlenmeden sorguya ekleniyor', 3], ['Herkes admin paneline girebiliyor', 3]] });
// ——— Avukat ———
pairGame({ id: 'hukuk_dali', name: 'Dava Dosyası', icon: '⚖️', hint: 'Dava → hukuk dalı', tags: ['is'],
  pairs: [['Boşanma', 'Aile hukuku'], ['Haksız işten çıkarma', 'İş hukuku'], ['Ödenmeyen kira', 'Borçlar hukuku'], ['Miras paylaşımı', 'Miras hukuku'], ['Hırsızlık', 'Ceza hukuku'], ['Marka taklidi', 'Fikri mülkiyet'], ['Şirket ortaklık kavgası', 'Şirketler hukuku'], ['Trafik kazası tazminatı', 'Tazminat hukuku'], ['Vergi cezası itirazı', 'Vergi hukuku'], ['Bozuk ürün iadesi', 'Tüketici hukuku'], ['İnşaat ruhsatı', 'İdare hukuku']] });
// ——— Muhasebeci ———
sortGame({ id: 'gelir_gider', name: 'Defter Tut', icon: '📒', bins: ['Gelir', 'Gider', 'Varlık', 'Borç'], tags: ['ticaret'],
  items: [['Satış hasılatı', 0], ['Faiz geliri', 0], ['Kira geliri', 0], ['Personel maaşı', 1], ['Elektrik faturası', 1], ['Reklam harcaması', 1], ['Dükkân kirası', 1], ['Kasadaki nakit', 2], ['Depodaki stok', 2], ['Şirket aracı', 2], ['Banka kredisi', 3], ['Tedarikçiye borç', 3], ['Ödenecek vergi', 3]] });
// ——— Ziraat mühendisi ———
dialGame({ id: 'toprak_ph', name: 'Toprak pH', icon: '🧪', min: 4, max: 9, dec: 1, unit: 'pH', ask: 'Ürün için ideal pH', gen: r => r.pick([5.5, 6, 6.2, 6.5, 6.8, 7, 7.2, 7.5]), tags: ['tarim'] });
// ——— Çırak / usta ———
pairGame({ id: 'ariza_parca', name: 'Arıza Teşhisi', icon: '🔧', hint: 'Şikâyet → değişecek parça', tags: ['teknik'],
  pairs: [['Musluk damlatıyor', 'Conta'], ['Araba çalışmıyor, ses yok', 'Akü'], ['Fren gıcırdıyor', 'Balata'], ['Priz kıvılcım çıkarıyor', 'Priz yuvası'], ['Kombi su basmıyor', 'Genleşme tankı'], ['Lastik sürekli iniyor', 'Sibop'], ['Ampul hemen yanıyor', 'Duy'], ['Klozet sürekli su akıtıyor', 'Şamandıra'], ['Motor hararet yapıyor', 'Termostat'], ['Kapı gıcırdıyor', 'Menteşe'], ['Buzdolabı soğutmuyor', 'Kompresör'], ['Egzozdan mavi duman', 'Segman']] });
// ——— Çiftçi ———
runGame({ id: 'traktor', name: 'Traktörle Çapa', icon: '🚜', player: '🚜', obstacles: ['🪨', '🪵', '🐄'], bonus: '🌾', bg: '#5a4a2a', tags: ['tarim'] });
catchGame({ id: 'hasat_sepeti', name: 'Meyve Hasadı', icon: '🍎', basket: '🧺', good: ['🍎', '🍐', '🍊'], bad: ['🐛', '🪱'], bg: '#2a4020', tags: ['tarim'] });
// ——— Antrenör ———
sortGame({ id: 'mevki_sec', name: 'Kadro Kur', icon: '📋', bins: ['Kaleci', 'Defans', 'Orta saha', 'Forvet'], tags: ['spor'],
  items: [['Uzun boylu, refleksleri çok iyi', 0], ['Elleri güvenli, iyi kurtarış yapar', 0], ['Güçlü, hava toplarında iyi', 1], ['Top kapmada usta, sakin', 1], ['Hızlı bek, geri dönüşü iyi', 1], ['Pas dağıtır, oyunu okur', 2], ['Kondisyonu yüksek, her yerde', 2], ['Uzaktan şutu iyi, yaratıcı', 2], ['Bitiriciliği yüksek', 3], ['Kafa golleri atar', 3], ['Hızlı, çalımı iyi, kanat', 3]] });
// ——— Psikolog ———
sortGame({ id: 'duygu_oku', name: 'Duyguyu Oku', icon: '🧠', bins: ['Kaygı', 'Üzüntü', 'Öfke', 'Sevinç'], tags: ['sosyal'],
  items: [['"Sınav yaklaştıkça uyuyamıyorum."', 0], ['"Ya bir şey ters giderse?"', 0], ['"Kalbim hızlı hızlı atıyor."', 0], ['"Hiçbir şeyden zevk almıyorum."', 1], ['"Onu çok özlüyorum."', 1], ['"Kendimi yalnız hissediyorum."', 1], ['"Bana haksızlık yaptılar!"', 2], ['"Beni hiç dinlemiyorlar!"', 2], ['"Kapıyı çarpıp çıktım."', 2], ['"Sonunda başardım!"', 3], ['"Bugün her şey yolunda."', 3], ['"Kız kardeşim evleniyor!"', 3]] });
// ——— Gazeteci ———
sortGame({ id: 'haber_masasi', name: 'Haber Masası', icon: '📰', bins: ['Ekonomi', 'Spor', 'Sağlık', 'Bilim'], tags: ['sosyal'],
  items: [['Faiz oranları değişti', 0], ['Enflasyon açıklandı', 0], ['Borsada rekor', 0], ['Derbi 2-2 bitti', 1], ['Maraton rekoru kırıldı', 1], ['Transfer dönemi açıldı', 1], ['Grip salgını uyarısı', 2], ['Yeni aşı onaylandı', 2], ['Uyku süresi araştırması', 2], ['Yeni gezegen keşfedildi', 3], ['Robot kol geliştirildi', 3], ['Dinozor fosili bulundu', 3]] });
// ——— Müzisyen ———
dialGame({ id: 'akort', name: 'Akort', icon: '🎸', min: 400, max: 480, dec: 0, unit: 'Hz', ask: 'Tel frekansı', gen: r => r.pick([415, 432, 440, 442, 446]), tags: ['sanat'] });
// ——— Grafik tasarımcı ———
oddGame({ id: 'renk_tonu', name: 'Renk Tonu', icon: '🎨', ask: 'Farklı tondaki kareyi bul', tags: ['sanat'], pairs: [['🟥', '🟧'], ['🟦', '🟪'], ['🟩', '🟨'], ['🟫', '🟧'], ['⬛', '🟫']] });
// ——— Bankacı ———
sortGame({ id: 'kredi_basvuru', name: 'Kredi Başvurusu', icon: '🏦', bins: ['Onayla', 'Kefil iste', 'Reddet'], tags: ['ticaret'],
  items: [['Düzenli maaş, borcu yok', 0], ['10 yıldır aynı işte, notu yüksek', 0], ['Ev sahibi, küçük kredi istiyor', 0], ['Yeni mezun, işe yeni başladı', 1], ['Serbest çalışan, geliri dalgalı', 1], ['Geliri yeterli ama kredi geçmişi yok', 1], ['Üç kredisi gecikmede', 2], ['Geliri yok, büyük kredi istiyor', 2], ['Sahte belge verdi', 2]] });
// ——— Portföy yöneticisi ———
quickGame({ id: 'getiri_hesap', name: 'Getiri Hesabı', icon: '💹', target: 9, tags: ['ticaret'], gen: r => {
  const buy = r.int(4, 40) * 10, pct = r.pick([-20, -10, 5, 10, 15, 20, 25, 50]);
  const sell = Math.round(buy * (1 + pct / 100));
  const P = v => lang === 'tr' ? `%${v}` : `${v}%`;
  return { q: `Hisseyi ${tl(buy)}'den alıp ${tl(sell)}'den sattın. Getiri yüzde kaç?`, a: P(pct), w: [P(pct + 5), P(pct - 5), P(-pct)] };
} });
