// Askerlik oyunları: acemi birliğinde parkurlar, atış, nöbet, içtima, marş. Askerlik akışı parkurla başlar,
// ardından havuzdan iki farklı görev gelir (flows.askerlikSheet). 'asker' anahtarı o havuzdur.
import { B } from '../core/i18n.js';
import { aimGame, fillGame } from './engines2.js';
import { jumpGame, dodgeGame, mazeGame, reactGame, orderGame, rhythmGame, flappyGame } from './engines3.js';
import { throwGame, packGame, cleanGame, mashGame, patternGame } from './engines4.js';

const P = pairs => pairs.map(([a, b]) => B(a, b));
const S = (title, steps) => [B(title[0], title[1]), P(steps)];
const K = (task, need, extra) => [B(task[0], task[1]), P(need), P(extra)];
const AT = ['asker'];

// ——— Parkurlar (akışın ilk oyunu bunlardan biri) ———
export const PARKUR = ['engel_parkuru', 'tel_orgu', 'duvar_tirmanisi'];
jumpGame({ id: 'engel_parkuru', name: B('Engel Parkuru', 'Obstacle Course'), icon: '🪖', at: AT, tags: ['asker'], player: '🏃', obstacles: ['🧱', '🪵', '🚧', '🛢️'], bonus: '⭐', bg: '#3a4a2a', ground: '#6b5a3a',
  how: [B('Komutan düdüğü çaldı: parkur başladı!', 'The commander blows the whistle: the course begins!'), B('Dokununca zıplarsın; duvarların, kütüklerin, varillerin üstünden atla.', 'Tap to jump over walls, logs and barrels.'), B('3 can, 30 saniye. Gittikçe hızlanır!', '3 lives, 30 seconds. It keeps getting faster!')] });
flappyGame({ id: 'tel_orgu', name: B('Tel Örgü Altı', 'Under the Barbed Wire'), icon: '🪖', at: AT, tags: ['asker'], player: '🪖', wall: '#5a5a4a', cap: '〰️', bonus: '⭐', bg: '#4a3a24', hitText: B('Tele takıldın!', 'Caught on the wire!'),
  how: [B('Tel örgülerin arasından geçiyorsun.', "You're crawling through the barbed wire."), B('Dokundukça yükselirsin; tellere değmeden boşluklardan geç.', 'Tap to rise; slip through the gaps without touching the wire.'), B('3 can, 30 saniye.', '3 lives, 30 seconds.')] });
mashGame({ id: 'duvar_tirmanisi', name: B('İp Tırmanışı', 'Rope Climb'), icon: '🧗', at: AT, tags: ['asker'], color: '#8a6a3a', tapText: B('Ritmi koru: çok hızlı çekersen kayarsın!', 'Keep the rhythm — pull too fast and you slip!') });

// ——— Diğer görevler ———
aimGame({ id: 'atis_poligonu', name: B('Atış Poligonu', 'Firing Range'), icon: '🎯', at: AT, tags: ['asker'], target: '🎯', verb: '🎯', shots: 6, bg: '#2f3a24',
  how: [B('Hedef tahtası sağa sola kayıyor.', 'The target board slides around.'), B('Tam nişangâhın içindeyken dokun!', "Tap when it's right inside the sight!"), B('6 atış.', '6 shots.')] });
reactGame({ id: 'nobet', name: B('Gece Nöbeti', 'Night Watch'), icon: '🔦', at: AT, tags: ['asker'], wait: '🌙', go: '🔦', fake: '🐈', bg: '#0e1426',
  waitText: B('Her şey sessiz…', 'All quiet…'), goText: B('"Dur! Kimdir o?"', '"Halt! Who goes there?"'),
  how: [B('Gece nöbetindesin, gözünü dört aç.', "You're on night watch — stay sharp."), B('Biri yaklaşınca 🔦 hemen dokun ve "Dur!" de.', 'When someone approaches 🔦, tap at once and call "Halt!"'), B('Sokak kedisi 🐈 için alarm verme!', "Don't raise the alarm for a stray cat 🐈!")] });
orderGame({ id: 'ictima', name: B('Sabah İçtiması', 'Morning Roll Call'), icon: '📯', at: AT, tags: ['asker'], sets: [
  S(['Borazan çaldı!', 'Reveille!'], [['Yataktan kalk', 'Get out of bed'], ['Ranzanı topla', 'Make your bunk'], ['Tıraş ol', 'Shave'], ['Üniformanı giy', 'Put on your uniform'], ['İçtimaya çık', 'Fall in for roll call']]),
  S(['Çadır kurma', 'Pitching a tent'], [['Zemini temizle', 'Clear the ground'], ['Çadırı ser', 'Lay out the tent'], ['Direkleri dik', 'Raise the poles'], ['Kazıkları çak', 'Drive in the pegs'], ['İpleri ger', 'Tighten the lines']]),
  S(['Nöbet devir teslimi', 'Changing the guard'], [['Selam ver', 'Salute'], ['Parolayı söyle', 'Give the password'], ['Nöbet defterini imzala', 'Sign the logbook'], ['Mevziyi teslim et', 'Hand over the post']]),
] });
packGame({ id: 'techizat', name: B('Teçhizat Kontrolü', 'Kit Inspection'), icon: '🎒', at: AT, tags: ['asker'], sets: [
  K(['🏕️ Arazi tatbikatı', '🏕️ Field exercise'], [['🪖 Miğfer', '🪖 Helmet'], ['🥾 Postal', '🥾 Combat boots'], ['🧭 Pusula', '🧭 Compass'], ['💧 Matara', '💧 Canteen']], [['🩴 Terlik', '🩴 Flip-flops'], ['🎮 Oyun konsolu', '🎮 Games console'], ['🍕 Pizza kutusu', '🍕 Pizza box'], ['🧸 Oyuncak ayı', '🧸 Teddy bear']]),
  K(['🌙 Gece nöbeti', '🌙 Night watch'], [['🔦 El feneri', '🔦 Torch'], ['🧥 Mont', '🧥 Coat'], ['📻 Telsiz', '📻 Radio']], [['🕶️ Güneş gözlüğü', '🕶️ Sunglasses'], ['🎧 Müzik kulaklığı', '🎧 Music headphones'], ['🛏️ Yastık', '🛏️ Pillow'], ['🍿 Mısır', '🍿 Popcorn']]),
] });
cleanGame({ id: 'postal_boya', name: B('Postal Parlat', 'Polish the Boots'), icon: '🥾', at: AT, tags: ['asker'], dirt: '#7a6040', dirtName: 'çamuru', dirtNameEn: 'mud', spots: ['🟤'], under: '#1a1a1a', reveal: ['🥾', '✨', '🪖'] });
rhythmGame({ id: 'uygun_adim', name: B('Uygun Adım Marş', 'Quick March'), icon: '🥁', at: AT, tags: ['asker'], notes: ['👢'], keys: [B('Sol', 'Left'), B('Sağ', 'Right'), B('Sol', 'Left')], bg: '#2a3320',
  how: [B('Bölük marşa çıktı: adımlar üç şeritte iner.', 'The company is marching: steps fall down three lanes.'), B('Çizgiye gelince doğru ayağa bas, tempoyu bozma.', 'Step with the right foot at the line — keep the beat.'), B('30 saniye.', '30 seconds.')] });
mazeGame({ id: 'arazi_intikali', name: B('Arazi İntikali', 'Land Navigation'), icon: '🧭', at: AT, tags: ['asker'], player: '🪖', goal: '🚩', items: ['🧭'], wall: '#9ab87a', bg: '#26331c' });
throwGame({ id: 'bomba_atma', name: B('Tatbikat Bombası', 'Practice Grenade'), icon: '💣', at: AT, tags: ['asker'], thrower: '🪖', target: '⭕', ball: '🟢', wind: true, bg: '#34402a', ground: '#5a4a2a' });
dodgeGame({ id: 'boya_tatbikati', name: B('Paintball Tatbikatı', 'Paintball Drill'), icon: '🟠', at: AT, tags: ['asker'], player: '🪖', bad: ['🟠', '🟡', '🔵'], good: ['🚩'], angle: true, bg: '#2f3a24', hitText: B('Boyandın!', 'Tagged!') });
patternGame({ id: 'mayin_haritasi', name: B('Harita Ezberi', 'Map Memory'), icon: '🗺️', at: AT, tags: ['asker'], mark: '🚩', bg: '#26331c', markBg: '#4a5a2a',
  how: [B('Keşif haritasındaki bayrakları 🚩 ezberle.', 'Memorise the flags 🚩 on the recon map.'), B('Kaybolunca aynı kareleri işaretle.', 'When they vanish, tap the same squares.'), B('6 tur, her turda bir fazlası.', '6 rounds, one more each time.')] });
fillGame({ id: 'kazan_corba', name: B('Kazan Nöbeti', 'Mess Duty'), icon: '🍲', at: AT, tags: ['asker'] });
