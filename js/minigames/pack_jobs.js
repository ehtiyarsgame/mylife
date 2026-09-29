// Mesleklere özel ek oyunlar (her meslek için ~5 yeni oyun). "job:<meslek>" ile mesai havuzuna girer.
import { B } from '../core/i18n.js';
import { sortGame, catchGame, whackGame, timingGame, quickGame } from './engines.js';
import { swipeGame, fillGame } from './engines2.js';
import { memoryGame, flappyGame, jumpGame, snakeGame, breakoutGame, reactGame, orderGame, compareGame, mazeGame, codeGame, slideGame, lightsGame, rhythmGame, dodgeGame, guessGame } from './engines3.js';
import { mashGame, throwGame, spotGame, schulteGame, sudokuGame, shellGame, stroopGame, patternGame, wordGame, packGame, sumGame, popGame, cleanGame, sliceGame, traceGame } from './engines4.js';

const P = pairs => pairs.map(([a, b]) => B(a, b));
const S = (title, steps) => [B(title[0], title[1]), P(steps)];
const K = (task, need, extra) => [B(task[0], task[1]), P(need), P(extra)];
const J = (...ids) => ids.map(x => 'job:' + x);

// ———————————————— GARSON ————————————————
memoryGame({ id: 'siparis_hafiza', name: B('Sipariş Hafızası', 'Order Memory'), icon: '🍽️', at: J('garson'), tags: ['is'], back: '🧾', bg: '#4a2f22', items: ['🍔', '🍕', '🥗', '🍝', '🍲', '🥩', '🍰', '☕', '🥤'] });
orderGame({ id: 'servis_adim', name: B('Servis Adımları', 'Service Steps'), icon: '🤵', at: J('garson'), tags: ['is'], sets: [
  S(['Masaya servis', 'Serving a table'], [['Müşteriyi karşıla', 'Greet the guests'], ['Menüyü ver', 'Hand out menus'], ['Siparişi al', 'Take the order'], ['Yemeği servis et', 'Serve the food'], ['Hesabı getir', 'Bring the bill']]),
  S(['Masa hazırlığı', 'Preparing a table'], [['Masayı sil', 'Wipe the table'], ['Örtüyü ser', 'Lay the cloth'], ['Tabakları koy', 'Set the plates'], ['Çatal-bıçağı diz', 'Lay the cutlery'], ['Bardakları yerleştir', 'Place the glasses']]),
  S(['Çay servisi', 'Tea service'], [['Bardakları ısıt', 'Warm the glasses'], ['Demi koy', 'Pour the brew'], ['Sıcak su ekle', 'Top up with hot water'], ['Tabağa şeker koy', 'Add sugar to the saucer'], ['Tepsiyle götür', 'Carry it on a tray']]),
] });
dodgeGame({ id: 'tepsi_kalabalik', name: B('Kalabalık Salon', 'Busy Dining Room'), icon: '🍽️', at: J('garson'), tags: ['is'], player: '🍽️', bad: ['🧍', '🧒', '🐕'], good: ['💵'], bg: '#3a2a22', hitText: B('Tepsi devrildi!', 'Tray dropped!') });
sumGame({ id: 'hesap_kasa', name: B('Hesap Kapat', 'Close the Bill'), icon: '💳', at: J('garson', 'memur'), tags: ['is'], ask: B('Müşteriye tam bu kadar para üstü ver:', 'Give the customer exactly this much change:'), unit: '🪙', values: [5, 10, 20, 50, 100, 200] });
throwGame({ id: 'pizza_firin', name: B('Pizzayı Fırına At', 'Pizza Toss'), icon: '🍕', at: J('garson'), tags: ['is'], thrower: '🧑‍🍳', target: '🔥', ball: '🍕', bg: '#3a2418', ground: '#6b3a22' });

// ———————————————— İŞÇİ ————————————————
packGame({ id: 'is_guvenligi', name: B('İş Güvenliği', 'Safety Gear'), icon: '🦺', at: J('isci', 'cirak', 'muhendis'), tags: ['is'], sets: [
  K(['🏗️ Şantiyeye gir', '🏗️ Enter the building site'], [['⛑️ Baret', '⛑️ Hard hat'], ['🦺 Yelek', '🦺 Hi-vis vest'], ['🥾 Çelik burunlu bot', '🥾 Steel-toe boots'], ['🧤 Eldiven', '🧤 Gloves']], [['🩴 Terlik', '🩴 Flip-flops'], ['👔 Kravat', '👔 Tie'], ['🕶️ Güneş gözlüğü', '🕶️ Sunglasses'], ['🎧 Kulaklıkla müzik', '🎧 Music headphones'], ['💍 Yüzük', '💍 Ring']]),
  K(['⚙️ Torna makinesinde çalış', '⚙️ Work on the lathe'], [['🥽 Koruyucu gözlük', '🥽 Safety goggles'], ['🎧 Kulak koruyucu', '🎧 Ear defenders'], ['🥾 İş ayakkabısı', '🥾 Work boots']], [['🧣 Uzun atkı', '🧣 Long scarf'], ['⌚ Bol bilezik', '⌚ Loose bracelet'], ['🩴 Terlik', '🩴 Slippers'], ['👗 Etek', '👗 Skirt']]),
  K(['🧪 Kimyasal depoda çalış', '🧪 Work in the chemical store'], [['🧤 Kimyasal eldiven', '🧤 Chemical gloves'], ['😷 Maske', '😷 Respirator'], ['🥽 Gözlük', '🥽 Goggles']], [['🍔 Hamburger', '🍔 Burger'], ['🚬 Sigara', '🚬 Cigarette'], ['🩳 Şort', '🩳 Shorts'], ['🔥 Çakmak', '🔥 Lighter']]),
] });
orderGame({ id: 'montaj_hatti', name: B('Montaj Hattı', 'Assembly Line'), icon: '🏭', at: J('isci'), tags: ['is'], sets: [
  S(['🚲 Bisiklet montajı', '🚲 Bike assembly'], [['Kadroyu yerleştir', 'Mount the frame'], ['Tekerlekleri tak', 'Fit the wheels'], ['Zinciri geçir', 'Fit the chain'], ['Freni ayarla', 'Adjust the brakes'], ['Test sürüşü yap', 'Test ride']]),
  S(['📦 Koli hazırlama', '📦 Packing a box'], [['Koliyi kur', 'Fold the box'], ['Ürünü yerleştir', 'Put the product in'], ['Boşlukları doldur', 'Fill the gaps'], ['Bantla kapat', 'Tape it shut'], ['Etiketi yapıştır', 'Stick on the label']]),
  S(['🪑 Sandalye üretimi', '🪑 Making a chair'], [['Tahtayı kes', 'Cut the wood'], ['Zımparala', 'Sand it'], ['Parçaları birleştir', 'Join the pieces'], ['Vidala', 'Screw it together'], ['Cilala', 'Varnish it']]),
] });
spotGame({ id: 'kayip_vida', name: B('Kayıp Parça', 'The Missing Part'), icon: '🔩', at: J('isci', 'cirak'), tags: ['is'], bg: '#2c2f38', targets: ['🔩', '🪛', '🔧'], noise: ['⚙️', '🔗', '⛓️', '🪝', '📎', '🧷', '🪙', '🔘', '🗜️'] });
mashGame({ id: 'forklift_kaldir', name: B('Forklift', 'Forklift'), icon: '🚜', at: J('isci', 'kurye'), tags: ['is'], color: '#ffb547', tapText: B('Yükü dengede kaldır!', 'Keep the load steady!') });
breakoutGame({ id: 'yikim_ekibi', name: B('Yıkım Ekibi', 'Demolition Crew'), icon: '🏚️', at: J('isci', 'muhendis'), tags: ['is'], bricks: ['🧱', '🪨'], ball: '⚫', paddle: '#ffb547', bg: '#3a3030' });

// ———————————————— KURYE ————————————————
mazeGame({ id: 'kurye_labirent', name: B('Ara Sokaklar', 'Back Streets'), icon: '🛵', at: J('kurye'), tags: ['is'], player: '🛵', goal: '🏠', items: ['📦'], wall: '#ffd166', bg: '#27303f' });
snakeGame({ id: 'paket_topla', name: B('Paket Toplama', 'Parcel Run'), icon: '📦', at: J('kurye'), tags: ['is'], head: '🛵', food: ['📦', '✉️', '🍕'], bad: ['🚧'], body: '#ffb547', bg: '#2a3240' });
dodgeGame({ id: 'trafik_kac', name: B('Trafikte Slalom', 'Traffic Slalom'), icon: '🚕', at: J('kurye', 'polis'), tags: ['is'], player: '🛵', bad: ['🚗', '🚕', '🚌', '🚙'], good: ['⭐'], bg: '#3a3f4a' });
guessGame({ id: 'kapi_numarasi', name: B('Kapı Numarası', 'House Number'), icon: '🚪', at: J('kurye'), tags: ['is'], ask: B('Sokak çok uzun! Teslimat adresi kaç numara?', 'Long street! Which house number is the delivery?'), min: 1, max: 120, up: B('⬆️ Daha ileride', '⬆️ Further on'), down: B('⬇️ Geride kaldı', '⬇️ You passed it') });
jumpGame({ id: 'kaldirim_atla', name: B('Kaldırım Engelleri', 'Pavement Obstacles'), icon: '🚲', at: J('kurye'), tags: ['is'], player: '🚴', obstacles: ['🕳️', '🚧', '🪨'], bonus: '📦', bg: '#2e3a4e', ground: '#555' });

// ———————————————— MEMUR ————————————————
orderGame({ id: 'evrak_sureci', name: B('Evrak Süreci', 'Paperwork Process'), icon: '📑', at: J('memur'), tags: ['is'], sets: [
  S(['Pasaport başvurusu', 'Passport application'], [['Randevu al', 'Book an appointment'], ['Formu doldur', 'Fill in the form'], ['Harcı yatır', 'Pay the fee'], ['Parmak izi ver', 'Give fingerprints'], ['Pasaportu teslim al', 'Collect the passport']]),
  S(['Dilekçe işlemi', 'Handling a petition'], [['Dilekçeyi al', 'Receive the petition'], ['Evrak kaydına gir', 'Log it in the register'], ['Birime havale et', 'Forward to the department'], ['Cevabı yaz', 'Write the reply'], ['Vatandaşa bildir', 'Notify the citizen']]),
  S(['Yeni doğan kaydı', 'Registering a birth'], [['Doğum belgesini al', 'Receive the birth record'], ['Anne-baba kimliğini kontrol et', 'Check the parents\' IDs'], ['Nüfusa işle', 'Enter it in the registry'], ['Kimlik numarası ver', 'Issue an ID number']]),
] });
schulteGame({ id: 'sira_numarasi', name: B('Sıra Numaraları', 'Queue Tickets'), icon: '🎫', at: J('memur', 'bankaci'), tags: ['is'], hint: 'A101, A102…', labels: (rng, n) => Array.from({ length: n }, (_, i) => 'A' + (101 + i)) });
spotGame({ id: 'muhur_bul', name: B('Mühür Nerede?', 'Where Is the Stamp?'), icon: '🔖', at: J('memur'), tags: ['is'], bg: '#3a3222', targets: ['🔖', '🖋️'], noise: ['📄', '📃', '📑', '🗂️', '📁', '📎', '🖇️', '📋', '🗃️', '✏️'] });
memoryGame({ id: 'dosya_eslestir', name: B('Dosya Eşleştir', 'Match the Files'), icon: '🗂️', at: J('memur', 'muhasebeci', 'avukat'), tags: ['is'], back: '📁', bg: '#2d3a4a', items: ['🪪', '📜', '🏠', '🚗', '💍', '👶', '🎓', '🧾', '🏥'] });
swipeGame({ id: 'belge_tamam', name: B('Belge Tamam mı?', 'Is the Form Complete?'), icon: '📋', at: J('memur'), tags: ['is'], sides: [B('Eksik', 'Incomplete'), B('Tamam', 'Complete')],
  items: [[B('İmza yok', 'Missing signature'), 0], [B('Fotoğraf eksik', 'No photo attached'), 0], [B('Tarih boş bırakılmış', 'Date left blank'), 0], [B('Kimlik fotokopisi yok', 'No copy of the ID'), 0], [B('Başvuru sahibi yerine kedisinin adı yazılmış', "The applicant wrote their cat's name"), 0],
    [B('Tüm alanlar dolu, imzalı', 'Every field filled and signed'), 1], [B('Fotoğraf, imza ve harç dekontu var', 'Photo, signature and fee receipt attached'), 1], [B('Kimlik ve form eksiksiz', 'ID and form complete'), 1], [B('Islak imzalı, tarihli', 'Signed in ink and dated'), 1]] });

// ———————————————— POLİS ————————————————
spotGame({ id: 'supheli_bul', name: B('Şüpheliyi Bul', 'Spot the Suspect'), icon: '🕵️', at: J('polis'), tags: ['is'], bg: '#1e2a3a', ask: B('Tarif edilen kişi:', 'Described person:'), targets: ['🥷', '🦹', '🕵️'], noise: ['🧍', '🧍‍♀️', '🧑', '👩', '👨', '🧓', '👵', '🧑‍🦰', '👱', '🧔', '👩‍🦱'] });
mazeGame({ id: 'sokak_takibi', name: B('Sokak Takibi', 'Street Chase'), icon: '🚓', at: J('polis'), tags: ['is'], player: '🚓', goal: '🦹', wall: '#4d8dff', bg: '#141c2e' });
patternGame({ id: 'olay_yeri', name: B('Olay Yeri', 'Crime Scene'), icon: '🔍', at: J('polis', 'gazeteci'), tags: ['is'], mark: '🔍', bg: '#262233', markBg: '#4a3a6a' });
reactGame({ id: 'kirmizi_isik', name: B('Kırmızı Işık', 'Red Light'), icon: '🚦', at: J('polis'), tags: ['is'], wait: '🟢', go: '🔴', fake: '🟡', waitText: B('Trafik akıyor…', 'Traffic flowing…'), goText: B('DUR işareti ver!', 'Signal STOP!') });
memoryGame({ id: 'plaka_hafiza', name: B('Plaka Hafızası', 'Plate Memory'), icon: '🚗', at: J('polis'), tags: ['is'], back: '🚔', bg: '#1e2a4a', items: ['🚗', '🚕', '🚙', '🛻', '🚌', '🏍️', '🚐', '🚚', '🛵'] });

// ———————————————— ÖĞRETMEN ————————————————
popGame({ id: 'dogru_cevap_patlat', name: B('Doğru Cevabı Patlat', 'Pop the Right Answer'), icon: '🍎', at: J('ogretmen'), tags: ['is'], rules: [
  [B('Çift sayıları patlat', 'Pop the EVEN numbers'), ['2', '4', '8', '12', '16', '20'], ['1', '3', '7', '9', '15', '21']],
  [B('5\'in katlarını patlat', 'Pop multiples of 5'), ['5', '10', '15', '25', '40', '55'], ['6', '12', '22', '33', '41', '49']],
  [B('Sesli harfleri patlat', 'Pop the VOWELS'), ['A', 'E', 'I', 'O', 'U'], ['B', 'K', 'M', 'T', 'R', 'S']],
  [B('Asal sayıları patlat', 'Pop the PRIME numbers'), ['2', '3', '5', '7', '11', '13'], ['4', '6', '8', '9', '10', '15']],
] });
patternGame({ id: 'oturma_plani', name: B('Oturma Planı', 'Seating Plan'), icon: '🪑', at: J('ogretmen', 'antrenor'), tags: ['is'], mark: '🧑‍🎓', bg: '#2e2a22', markBg: '#4a3a22' });
orderGame({ id: 'ders_plani', name: B('Ders Planı', 'Lesson Plan'), icon: '📝', at: J('ogretmen'), tags: ['is'], sets: [
  S(['Bir dersin akışı', 'Flow of a lesson'], [['Yoklama al', 'Take the register'], ['Geçen dersi hatırlat', 'Recap last lesson'], ['Yeni konuyu anlat', 'Teach the new topic'], ['Örnek çözdür', 'Work through examples'], ['Ödev ver', 'Set homework']]),
  S(['Sınav hazırlığı', 'Preparing an exam'], [['Kazanımları belirle', 'List the learning goals'], ['Soruları yaz', 'Write the questions'], ['Cevap anahtarı hazırla', 'Make the answer key'], ['Sınavı uygula', 'Hold the exam'], ['Sonuçları paylaş', 'Share the results']]),
] });
schulteGame({ id: 'yoklama', name: B('Yoklama', 'Roll Call'), icon: '📋', at: J('ogretmen'), tags: ['is'], hint: 'A, B, C…', labels: (rng, n) => 'ABCDEFGHIJKLMNOPQRSTUVWXY'.slice(0, n).split('') });
throwGame({ id: 'tebesir_at', name: B('Tebeşir Kutusu', 'Chalk Toss'), icon: '🖍️', at: J('ogretmen'), tags: ['is'], thrower: '🧑‍🏫', target: '📦', ball: '🖍️', bg: '#23402e', ground: '#5a4633' });

// ———————————————— HEMŞİRE ————————————————
orderGame({ id: 'el_yikama', name: B('Doğru El Yıkama', 'Proper Handwashing'), icon: '🧼', at: J('hemsire', 'doktor', 'dishekimi'), tags: ['saglik'], sets: [
  S(['El yıkama', 'Handwashing'], [['Elleri ıslat', 'Wet your hands'], ['Sabunla', 'Apply soap'], ['En az 20 saniye ov', 'Rub for at least 20 seconds'], ['Durula', 'Rinse'], ['Kâğıt havluyla kurula', 'Dry with a paper towel']]),
  S(['Eldiven giyme', 'Putting on gloves'], [['Elleri yıka', 'Wash your hands'], ['Doğru bedeni seç', 'Pick the right size'], ['Eldiveni giy', 'Put the gloves on'], ['Yırtık var mı kontrol et', 'Check for tears']]),
] });
packGame({ id: 'pansuman_seti', name: B('Pansuman Arabası', 'Dressing Trolley'), icon: '🩹', at: J('hemsire', 'doktor'), tags: ['saglik'], sets: [
  K(['🩹 Küçük kesik pansumanı', '🩹 Dressing a small cut'], [['🧤 Steril eldiven', '🧤 Sterile gloves'], ['🧴 Antiseptik', '🧴 Antiseptic'], ['🩹 Gazlı bez', '🩹 Gauze'], ['🩹 Flaster', '🩹 Tape']], [['🔨 Çekiç', '🔨 Hammer'], ['🍫 Çikolata', '🍫 Chocolate'], ['🧂 Tuz', '🧂 Salt'], ['📱 Telefon', '📱 Phone']]),
  K(['💉 Kan alma', '💉 Taking blood'], [['🧤 Eldiven', '🧤 Gloves'], ['🪢 Turnike', '🪢 Tourniquet'], ['💉 Enjektör', '💉 Syringe'], ['🧪 Tüp', '🧪 Sample tube']], [['🧲 Mıknatıs', '🧲 Magnet'], ['🍴 Çatal', '🍴 Fork'], ['🎈 Balon', '🎈 Balloon'], ['🪛 Tornavida', '🪛 Screwdriver']]),
] });
mashGame({ id: 'tansiyon_pompa', name: B('Tansiyon Ölç', 'Blood Pressure'), icon: '🩺', at: J('hemsire', 'doktor'), tags: ['saglik'], color: '#ff6b8b', tapText: B('Manşeti pompala, ibreyi yeşilde tut', 'Pump the cuff, keep the needle in the green') });
reactGame({ id: 'monitor_alarm', name: B('Monitör Alarmı', 'Monitor Alarm'), icon: '📟', at: J('hemsire', 'doktor'), tags: ['saglik'], wait: '💚', go: '🚨', fake: '🟡', waitText: B('Hasta stabil…', 'Patient stable…'), goText: B('MÜDAHALE!', 'RESPOND!'), bg: '#13303a' });
memoryGame({ id: 'ilac_saatleri', name: B('İlaç Kartları', 'Medicine Cards'), icon: '💊', at: J('hemsire', 'eczaci'), tags: ['saglik'], back: '🏥', bg: '#1e3a4a', items: ['💊', '💉', '🩹', '🌡️', '🧴', '🩺', '🧪', '🫁', '🦷'] });

// ———————————————— DOKTOR ————————————————
orderGame({ id: 'muayene_sirasi', name: B('Muayene', 'Check-up'), icon: '🩺', at: J('doktor'), tags: ['saglik'], sets: [
  S(['Muayene akışı', 'Consultation flow'], [['Hastayı dinle', 'Listen to the patient'], ['Şikâyetleri sor', 'Ask about symptoms'], ['Muayene et', 'Examine'], ['Tahlil iste', 'Order tests'], ['Tanı koy ve tedavi planla', 'Diagnose and plan treatment']]),
  S(['Ameliyat öncesi', 'Before surgery'], [['Onam formunu imzalat', 'Get the consent form signed'], ['Elleri yıka', 'Scrub in'], ['Steril önlük giy', 'Put on a sterile gown'], ['Hastayı kontrol et', 'Check the patient'], ['"Başlayalım" de', 'Say "let\'s begin"']]),
] });
traceGame({ id: 'dikis_at', name: B('Dikiş At', 'Stitch It Up'), icon: '🪡', at: J('doktor', 'dishekimi'), tags: ['saglik'], shapes: ['zikzak', 'dalga', 'kare'], bg: '#f7e6e0', ink: '#1e6bd6', guide: 'rgba(160,60,60,.45)' });
spotGame({ id: 'mikrop_bul', name: B('Mikrobu Bul', 'Find the Germ'), icon: '🦠', at: J('doktor', 'eczaci'), tags: ['saglik'], bg: '#2a1a2a', targets: ['🦠'], noise: ['🔴', '⚪', '🟣', '🩸', '🫧', '🟤'] });
sortGame({ id: 'acil_mi', name: B('Acil mi, Poliklinik mi?', 'A&E or Clinic?'), icon: '🚑', at: J('doktor', 'hemsire'), tags: ['saglik'], bins: [B('🚑 Acil', '🚑 Emergency'), B('🏥 Poliklinik', '🏥 Clinic')], target: 12,
  items: [[B('Göğüs ağrısı, terleme', 'Chest pain and sweating'), 0], [B('Nefes alamıyor', "Can't breathe"), 0], [B('Trafik kazası', 'Car accident'), 0], [B('Bilinç kaybı', 'Unconscious'), 0], [B('Yoğun kanama', 'Heavy bleeding'), 0],
    [B('3 gündür hafif öksürük', 'Mild cough for 3 days'), 1], [B('Kontrol randevusu', 'Follow-up visit'), 1], [B('Rapor yazdırmak istiyor', 'Wants a sick note'), 1], [B('Hafif sivilce', 'Mild acne'), 1], [B('Aşı takvimi sorusu', 'Vaccine schedule question'), 1]] });
guessGame({ id: 'ates_tahmin', name: B('Termometre', 'Thermometer'), icon: '🌡️', at: J('doktor', 'hemsire'), tags: ['saglik'], ask: B('Hastanın ateşi kaç? (0,1 hassasiyetle)', "What's the patient's temperature? (to 0.1)"), min: 36, max: 41, step: 0.1, unit: '°C', tolerance: 1 });

// ———————————————— ECZACI ————————————————
packGame({ id: 'recete_hazirla', name: B('Reçete Hazırla', 'Fill the Prescription'), icon: '📝', at: J('eczaci'), tags: ['saglik'], sets: [
  K(['🤧 Soğuk algınlığı tavsiyesi', '🤧 Cold advice'], [['💧 Bol sıvı', '💧 Plenty of fluids'], ['🛌 Dinlenme', '🛌 Rest'], ['🍋 C vitamini', '🍋 Vitamin C']], [['🍔 Fast food', '🍔 Fast food'], ['🏋️ Ağır antrenman', '🏋️ Heavy workout'], ['🍺 Alkol', '🍺 Alcohol'], ['🌙 Uykusuzluk', '🌙 Skipping sleep']]),
  K(['☀️ Güneş yanığı', '☀️ Sunburn'], [['🧴 Nemlendirici', '🧴 Moisturiser'], ['💧 Su', '💧 Water'], ['🌳 Gölge', '🌳 Shade']], [['🔥 Isıtıcı', '🔥 Heater'], ['🧂 Tuz', '🧂 Salt'], ['🏖️ Öğlen güneşi', '🏖️ Midday sun'], ['🧣 Yün atkı', '🧣 Wool scarf']]),
] });
schulteGame({ id: 'raf_sirasi', name: B('Alfabetik Raf', 'Alphabetical Shelf'), icon: '💊', at: J('eczaci', 'memur'), tags: ['saglik'], hint: 'A, B, C…', labels: (rng, n) => 'ABCDEFGHIJKLMNOPQRSTUVWXY'.slice(0, n).split('') });
spotGame({ id: 'kutu_bul', name: B('İlacı Bul', 'Find the Medicine'), icon: '💊', at: J('eczaci'), tags: ['saglik'], bg: '#22384a', targets: ['💊', '🧴'], noise: ['📦', '🧻', '🩹', '🧪', '🪥', '🧼', '🍬', '🧃'] });
sumGame({ id: 'surup_olcu', name: B('Şurup Ölçüsü', 'Syrup Dose'), icon: '🥄', at: J('eczaci'), tags: ['saglik'], ask: B('Ölçü kaşıklarıyla tam bu kadar ml hazırla:', 'Measure exactly this many ml with the spoons:'), unit: 'ml', values: [10, 5, 2.5], label: v => `${v} ml`, gen: rng => rng.pick([7.5, 12.5, 15, 17.5, 20, 22.5, 25]) });
fillGame({ id: 'sise_doldur', name: B('Şişe Doldur', 'Fill the Bottle'), icon: '🧴', at: J('eczaci'), tags: ['saglik'] });

// ———————————————— DİŞ HEKİMİ ————————————————
whackGame({ id: 'curuk_avla', name: B('Çürük Avı', 'Cavity Hunt'), icon: '🦷', at: J('dishekimi'), tags: ['saglik'], good: '🦠', bad: '🦷', hole: '⬜', holeBg: '#e8e6f0' });
cleanGame({ id: 'dis_parlat', name: B('Dişleri Parlat', 'Polish the Teeth'), icon: '✨', at: J('dishekimi'), tags: ['saglik'], dirt: '#c9b458', dirtName: 'plağı', dirtNameEn: 'plaque', spots: ['🦠'], under: '#ffffff', reveal: ['🦷', '😁', '😬'] });
orderGame({ id: 'dis_fircala', name: B('Diş Bakımı', 'Dental Care'), icon: '🪥', at: J('dishekimi'), tags: ['saglik'], sets: [
  S(['Doğru fırçalama', 'Proper brushing'], [['Fırçayı ıslat', 'Wet the brush'], ['Bezelye kadar macun sür', 'Pea-sized paste'], ['Dairesel fırçala', 'Brush in circles'], ['Dilini de fırçala', 'Brush your tongue too'], ['Tükür, çalkalama', 'Spit, don\'t rinse']]),
  S(['Dolgu işlemi', 'A filling'], [['Bölgeyi uyuştur', 'Numb the area'], ['Çürüğü temizle', 'Clean the cavity'], ['Dolguyu yerleştir', 'Place the filling'], ['Işıkla sertleştir', 'Cure with light'], ['Kapanışı kontrol et', 'Check the bite']]),
] });
memoryGame({ id: 'dis_kartlari', name: B('Diş Kartları', 'Tooth Cards'), icon: '🦷', at: J('dishekimi'), tags: ['saglik'], back: '🪥', bg: '#2a3a4a', items: ['🦷', '🪥', '🧵', '🍬', '🍎', '🥛', '😁', '🩺', '💉'] });

// ———————————————— MÜHENDİS ————————————————
slideGame({ id: 'devre_yapboz', name: B('Devre Kartı', 'Circuit Board'), icon: '🔌', at: J('muhendis', 'yazilimci'), tags: ['teknik'], tiles: ['🔋', '🔌', '💡', '🎛️', '📟', '🧲', '⚡', '🛰️'] });
lightsGame({ id: 'sehir_sebeke', name: B('Şehir Şebekesi', 'City Grid'), icon: '🏙️', at: J('muhendis'), tags: ['teknik'], on: '🏢', off: '🌃', onBg: '#5a4a1a', offBg: '#141a30', how: [B('Bölgeleri aynı anda kapatmalısın: bir kareye dokununca o ve komşuları değişir.', 'Switch districts off: tapping a square flips it and its neighbours.'), B('Tüm şehri 🌃 gece moduna al.', 'Put the whole city into 🌃 night mode.'), B('3 bulmaca.', '3 puzzles.')] });
codeGame({ id: 'kilit_mekanizma', name: B('Kilit Mekanizması', 'Lock Mechanism'), icon: '⚙️', at: J('muhendis'), tags: ['teknik'], symbols: ['⚙️', '🔩', '🔧', '🪛', '⛓️', '🧲'] });
compareGame({ id: 'yapi_yukseklik', name: B('Hangisi Daha Yüksek?', 'Which Is Taller?'), icon: '🏗️', at: J('muhendis', 'ogretmen'), tags: ['teknik'], ask: B('Hangisi daha yüksek?', 'Which is taller?'), unit: 'm',
  items: [[B('🏙️ Burj Halife', '🏙️ Burj Khalifa'), 828], [B('🗼 Eyfel Kulesi', '🗼 Eiffel Tower'), 330], [B('🏰 Galata Kulesi', '🏰 Galata Tower'), 67], [B('🗽 Özgürlük Heykeli', '🗽 Statue of Liberty'), 93],
    [B('🗼 Pisa Kulesi', '🗼 Leaning Tower of Pisa'), 56], [B('🕰️ Big Ben', '🕰️ Big Ben'), 96], [B('🏢 Empire State Binası', '🏢 Empire State Building'), 443], [B('📡 Çamlıca Kulesi', '📡 Çamlıca Tower'), 369], [B('🔺 Keops Piramidi', '🔺 Great Pyramid'), 139]] });
throwGame({ id: 'vinc_birak', name: B('Vinçle Bırak', 'Crane Drop'), icon: '🏗️', at: J('muhendis', 'isci'), tags: ['teknik'], thrower: '🏗️', target: '❎', ball: '📦', wind: true, bg: '#26364a', ground: '#6a6a6a' });

// ———————————————— YAZILIMCI ————————————————
spotGame({ id: 'noktali_virgul', name: B('Kayıp Noktalı Virgül', 'The Missing Semicolon'), icon: '⌨️', at: J('yazilimci'), tags: ['teknik'], bg: '#0f1d33', targets: [';'], noise: [':', ',', '.', 'i', 'j', '!', '|', "'"], how: [B('Kod ekranında noktalı virgül ( ; ) saklanıyor.', 'A semicolon ( ; ) is hiding in the code.'), B('Onu bul ve dokun — iki nokta ( : ) ile karıştırma!', "Find it and tap it — don't confuse it with a colon ( : )!"), B('6 tur.', '6 rounds.')] });
mazeGame({ id: 'algoritma_labirent', name: B('Yol Bulma Algoritması', 'Pathfinding'), icon: '🧭', at: J('yazilimci'), tags: ['teknik'], player: '🟢', goal: '🏁', items: ['🟦'], wall: '#5ce1e6', bg: '#0b1426' });
patternGame({ id: 'piksel_ezber', name: B('Piksel Ezber', 'Pixel Memory'), icon: '👾', at: J('yazilimci', 'tasarimci'), tags: ['teknik'], mark: '👾', bg: '#101a2e', markBg: '#2a3a6a' });
codeGame({ id: 'sifre_kir_hex', name: B('Şifreyi Kır', 'Crack the Password'), icon: '🔑', at: J('yazilimci', 'bankaci'), tags: ['teknik'], symbols: ['A', 'B', 'C', 'D', 'E', 'F'] });
orderGame({ id: 'deploy_adim', name: B('Yayına Alma', 'Deploy'), icon: '🚀', at: J('yazilimci'), tags: ['teknik'], sets: [
  S(['Yeni özellik yayınla', 'Ship a new feature'], [['Görevi anla', 'Understand the task'], ['Kodu yaz', 'Write the code'], ['Testleri çalıştır', 'Run the tests'], ['Kod incelemesi', 'Code review'], ['Yayına al', 'Deploy']]),
  S(['Hata düzeltme', 'Fixing a bug'], [['Hatayı tekrar üret', 'Reproduce the bug'], ['Kaynağını bul', 'Find the cause'], ['Düzelt', 'Fix it'], ['Test ekle', 'Add a test'], ['Kapat', 'Close the ticket']]),
] });

// ———————————————— AVUKAT ————————————————
orderGame({ id: 'dava_sureci', name: B('Dava Süreci', 'Court Case'), icon: '⚖️', at: J('avukat'), tags: ['is'], sets: [
  S(['Bir davanın yolu', 'Path of a lawsuit'], [['Müvekkili dinle', 'Hear the client'], ['Delilleri topla', 'Gather evidence'], ['Dava dilekçesi yaz', 'File the claim'], ['Duruşmaya çık', 'Attend the hearing'], ['Karar ve itiraz süresi', 'Verdict and appeal window']]),
  S(['Kira sözleşmesi', 'Tenancy agreement'], [['Tarafları belirle', 'Identify the parties'], ['Kira bedelini yaz', 'State the rent'], ['Süreyi belirle', 'Set the term'], ['Depozitoyu yaz', 'State the deposit'], ['İmzalat', 'Get signatures']]),
] });
packGame({ id: 'dava_dosyasi', name: B('Dava Dosyası', 'Case File'), icon: '📂', at: J('avukat'), tags: ['is'], sets: [
  K(['🚗 Trafik kazası davası', '🚗 Traffic accident case'], [['📸 Kaza fotoğrafları', '📸 Accident photos'], ['📝 Tutanak', '📝 Police report'], ['🧑‍⚖️ Tanık ifadesi', '🧑‍⚖️ Witness statement'], ['🏥 Doktor raporu', '🏥 Medical report']], [['🍕 Pizza menüsü', '🍕 Pizza menu'], ['🎟️ Konser bileti', '🎟️ Concert ticket'], ['🐱 Kedi fotoğrafı', '🐱 Cat photo'], ['📺 Dizi özeti', '📺 TV recap']]),
  K(['🏠 Kira anlaşmazlığı', '🏠 Rent dispute'], [['📄 Kira sözleşmesi', '📄 Tenancy agreement'], ['🧾 Ödeme dekontları', '🧾 Payment receipts'], ['✉️ İhtarname', '✉️ Formal notice']], [['🎂 Doğum günü kartı', '🎂 Birthday card'], ['🧸 Oyuncak', '🧸 Toy'], ['🗺️ Tatil haritası', '🗺️ Holiday map'], ['🎮 Oyun kolu', '🎮 Game pad']]),
] });
spotGame({ id: 'imza_bul', name: B('İmza Nerede?', 'Where Is the Signature?'), icon: '✍️', at: J('avukat', 'bankaci'), tags: ['is'], bg: '#3a3428', targets: ['✍️'], noise: ['📄', '📃', '📑', '📜', '🖊️', '🖋️', '📎', '📌', '📐'] });
swipeGame({ id: 'delil_mi', name: B('Delil mi, Söylenti mi?', 'Evidence or Hearsay?'), icon: '🔎', at: J('avukat', 'gazeteci', 'polis'), tags: ['is'], sides: [B('Söylenti', 'Hearsay'), B('Delil', 'Evidence')],
  items: [[B('Güvenlik kamerası kaydı', 'CCTV footage'), 1], [B('İmzalı sözleşme', 'Signed contract'), 1], [B('Banka dekontu', 'Bank receipt'), 1], [B('Parmak izi raporu', 'Fingerprint report'), 1], [B('Tarihli e-posta', 'Dated e-mail'), 1],
    [B('"Komşum demişti ki…"', '"My neighbour said…"'), 0], [B('Anonim sosyal medya yorumu', 'Anonymous social-media comment'), 0], [B('"Bana öyle geldi"', '"It just felt like it"'), 0], [B('Rüyada görülen olay', 'Something seen in a dream'), 0], [B('Kahvehane dedikodusu', 'Café gossip'), 0]] });
memoryGame({ id: 'kanun_kartlari', name: B('Hukuk Kartları', 'Law Cards'), icon: '⚖️', at: J('avukat'), tags: ['is'], back: '📕', bg: '#3a2a22', items: ['⚖️', '🧑‍⚖️', '📜', '🏛️', '🔨', '🤝', '🏠', '👪', '💼'] });

// ———————————————— BANKACI ————————————————
sumGame({ id: 'veznedar', name: B('Veznedar', 'Bank Teller'), icon: '💵', at: J('bankaci', 'muhasebeci'), tags: ['ticaret'], ask: B('Müşteriye tam bu tutarı banknotlarla öde:', 'Pay out exactly this amount in notes:'), unit: '🪙', values: [200, 100, 50, 20, 10, 5], gen: rng => rng.int(3, 90) * 5 });
codeGame({ id: 'kasa_kilidi', name: B('Kasa Dairesi', 'The Vault'), icon: '🏦', at: J('bankaci'), tags: ['ticaret'], symbols: ['1', '2', '3', '4', '5', '6', '7'] });
guessGame({ id: 'kasa_sayim', name: B('Kasa Sayımı', 'Cash Count'), icon: '💰', at: J('bankaci', 'muhasebeci'), tags: ['ticaret'], ask: B('Kasadaki deste sayısını bul (sayım makinesi ipucu verir).', 'Find the number of bundles in the safe (the counter gives hints).'), min: 10, max: 500, step: 10 });
swipeGame({ id: 'kredi_uygun', name: B('Kredi Verilir mi?', 'Approve the Loan?'), icon: '🏦', at: J('bankaci'), tags: ['ticaret'], sides: [B('Ret', 'Decline'), B('Onay', 'Approve')],
  items: [[B('Düzenli maaş, borcu yok, taksit gelirin %20\'si', 'Steady salary, no debt, instalment 20% of income'), 1], [B('10 yıllık esnaf, vergi kayıtları temiz', '10-year shop owner, clean tax records'), 1], [B('Kefili ve teminatı var, geçmişi temiz', 'Has a guarantor and collateral, clean history'), 1], [B('Ev kredisi, peşinat %30', 'Mortgage with a 30% down payment'), 1],
    [B('3 kredisi gecikmede', '3 loans already in arrears'), 0], [B('Gelir belgesi yok, "şansım var" diyor', 'No proof of income, says "I feel lucky"'), 0], [B('Taksit gelirinin %90\'ı', 'Instalment is 90% of income'), 0], [B('Kumar borcunu ödemek istiyor', 'Wants to pay off gambling debts'), 0]] });
memoryGame({ id: 'doviz_kartlari', name: B('Döviz Kartları', 'Currency Cards'), icon: '💱', at: J('bankaci', 'yatirimci'), tags: ['ticaret'], back: '🏦', bg: '#1f3a2e', items: ['💵', '💶', '💷', '💴', '🪙', '💳', '🏦', '📈', '💰'] });

// ———————————————— YATIRIMCI ————————————————
popGame({ id: 'yukselen_hisse', name: B('Yeşil Mumlar', 'Green Candles'), icon: '📈', at: J('yatirimci', 'bankaci'), tags: ['ticaret'], bg: '#0f1f1a', rules: [
  [B('Artıda kapananları patlat', 'Pop the ones that closed UP'), ['+2%', '+5%', '+1%', '+8%', '+3%'], ['−3%', '−1%', '−6%', '−2%', '0%']],
  [B('%5\'ten fazla düşenleri patlat', 'Pop drops of MORE than 5%'), ['−6%', '−8%', '−12%', '−7%'], ['−2%', '−4%', '+3%', '+6%', '−1%']],
  [B('F/K oranı 10\'dan düşükleri patlat', 'Pop P/E ratios BELOW 10'), [6, 8, 4, 9].map(n => B(`F/K ${n}`, `P/E ${n}`)), [15, 22, 31, 12].map(n => B(`F/K ${n}`, `P/E ${n}`))],
] });
flappyGame({ id: 'grafik_surfu', name: B('Grafik Sörfü', 'Chart Surfer'), icon: '🏄', at: J('yatirimci'), tags: ['ticaret'], player: '🏄', wall: '#2a8a5a', cap: '🕯️', bonus: '💰', bg: '#0f1f2a', hitText: B('Stop-loss!', 'Stop-loss!') });
reactGame({ id: 'al_sinyali', name: B('Al Sinyali', 'Buy Signal'), icon: '📊', at: J('yatirimci'), tags: ['ticaret'], wait: '📉', go: '📈', fake: '🎲', waitText: B('Piyasa düşüyor, bekle…', 'Market falling, wait…'), goText: B('AL!', 'BUY!'), bg: '#1a2230' });
sortGame({ id: 'risk_sepeti', name: B('Risk Sepeti', 'Risk Basket'), icon: '🧺', at: J('yatirimci', 'bankaci'), tags: ['ticaret'], bins: [B('🛡️ Düşük risk', '🛡️ Low risk'), B('🎢 Yüksek risk', '🎢 High risk')], target: 12,
  items: [[B('Devlet tahvili', 'Government bond'), 0], [B('Vadeli mevduat', 'Term deposit'), 0], [B('Altın', 'Gold'), 0], [B('Büyük şirket temettü hissesi', 'Blue-chip dividend stock'), 0],
    [B('Yeni kurulmuş şirket hissesi', 'Brand-new start-up stock'), 1], [B('Kaldıraçlı işlem', 'Leveraged trading'), 1], [B('Adı yeni duyulan kripto', 'Unheard-of crypto coin'), 1], [B('"Kesin kazandırır" denen hisse', 'A stock someone called a sure thing'), 1]] });
compareGame({ id: 'getiri_kiyas', name: B('Hangisi Daha Çok Kazandırır?', 'Which Pays More?'), icon: '💹', at: J('yatirimci', 'muhasebeci'), tags: ['ticaret'], ask: B('Hangi yatırım bir yılda daha çok kazandırır? (hesapla!)', 'Which investment earns more in a year? (do the maths!)'), unit: '🪙',
  items: [[B('10.000 × %30', '10,000 × 30%'), 3000], [B('20.000 × %12', '20,000 × 12%'), 2400], [B('5.000 × %50', '5,000 × 50%'), 2500], [B('50.000 × %4', '50,000 × 4%'), 2000], [B('8.000 × %40', '8,000 × 40%'), 3200], [B('40.000 × %9', '40,000 × 9%'), 3600], [B('100.000 × %2', '100,000 × 2%'), 2000], [B('15.000 × %15', '15,000 × 15%'), 2250]] });

// ———————————————— MUHASEBECİ ————————————————
schulteGame({ id: 'fatura_sira', name: B('Fatura Sırala', 'Sort the Invoices'), icon: '🧾', at: J('muhasebeci'), tags: ['ticaret'], hint: 'F-001, F-002…', labels: (rng, n) => Array.from({ length: n }, (_, i) => 'F-' + String(i + 1).padStart(3, '0')) });
orderGame({ id: 'ay_sonu', name: B('Ay Sonu Kapanışı', 'Month-End Close'), icon: '📒', at: J('muhasebeci'), tags: ['ticaret'], sets: [
  S(['Ay sonu', 'Month end'], [['Faturaları topla', 'Collect invoices'], ['Banka hesaplarını eşle', 'Reconcile the bank'], ['Giderleri kaydet', 'Record expenses'], ['Vergiyi hesapla', 'Compute tax'], ['Raporu gönder', 'Send the report']]),
  S(['Maaş bordrosu', 'Payroll'], [['Çalışma günlerini al', 'Collect working days'], ['Brüt maaşı hesapla', 'Compute gross pay'], ['Kesintileri düş', 'Deduct withholdings'], ['Net maaşı bul', 'Find net pay'], ['Ödemeyi yap', 'Make the payment']]),
] });
sudokuGame({ id: 'tablo_denklik', name: B('Tablo Denkliği', 'Balance Sheet Grid'), icon: '📊', at: J('muhasebeci'), tags: ['ticaret'], symbols: ['💵', '🧾', '🏦', '📈'] });
sumGame({ id: 'fis_topla', name: B('Fişleri Topla', 'Add Up the Receipts'), icon: '🧾', at: J('muhasebeci'), tags: ['ticaret'], ask: B('Bu toplamı tutan fişleri seç:', 'Pick receipts that add up to:'), unit: '🪙', values: [1250, 750, 400, 250, 120, 60], gen: rng => { let s = 0; for (let i = 0; i < rng.int(2, 4); i++) s += rng.pick([1250, 750, 400, 250, 120, 60]); return s; } });
swipeGame({ id: 'gider_mi', name: B('Şirket Gideri mi?', 'Business Expense?'), icon: '🧮', at: J('muhasebeci'), tags: ['ticaret'], sides: [B('Kişisel', 'Personal'), B('Şirket', 'Business')],
  items: [[B('Ofis kirası', 'Office rent'), 1], [B('Çalışan maaşı', 'Staff wages'), 1], [B('Müşteri toplantısı yemeği', 'Client lunch'), 1], [B('Yazıcı toneri', 'Printer toner'), 1], [B('İş seyahati bileti', 'Business trip ticket'), 1],
    [B('Patronun kedisinin maması', "The boss's cat food"), 0], [B('Aile tatili', 'Family holiday'), 0], [B('Kişisel spor salonu üyeliği', 'Personal gym membership'), 0], [B('Düğün hediyesi', 'Wedding present'), 0]] });

// ———————————————— ZİRAAT MÜHENDİSİ ————————————————
sliceGame({ id: 'budama', name: B('Budama', 'Pruning'), icon: '✂️', at: J('ziraatmuh', 'ciftci'), tags: ['doga'], good: ['🍂', '🪵', '🥀'], bad: ['🍎', '🍐', '🌸'], cutE: '🍃', bg: '#1f3322', how: [B('Kuru dalları ve ölü yaprakları kes.', 'Cut away dead branches and leaves.'), B('Meyveye ve çiçeğe dokunma!', "Don't touch the fruit or blossom!"), B('25 saniye.', '25 seconds.')] });
packGame({ id: 'ekim_hazirlik', name: B('Ekim Hazırlığı', 'Planting Prep'), icon: '🌱', at: J('ziraatmuh', 'ciftci'), tags: ['doga'], sets: [
  K(['🍅 Domates fidesi dikimi', '🍅 Planting tomato seedlings'], [['🌱 Fide', '🌱 Seedlings'], ['🪴 Gübreli toprak', '🪴 Fertilised soil'], ['💧 Can suyu', '💧 First watering'], ['🪵 Destek çubuğu', '🪵 Support stake']], [['🧊 Buz', '🧊 Ice'], ['🧂 Tuz', '🧂 Salt'], ['🛢️ Motor yağı', '🛢️ Engine oil'], ['🌑 Tam karanlık', '🌑 Total darkness']]),
  K(['🌾 Buğday ekimi', '🌾 Sowing wheat'], [['🚜 Traktör', '🚜 Tractor'], ['🌾 Tohum', '🌾 Seed'], ['🧪 Toprak analizi', '🧪 Soil test']], [['🏄 Sörf tahtası', '🏄 Surfboard'], ['🎻 Keman', '🎻 Violin'], ['🍫 Çikolata', '🍫 Chocolate'], ['🧥 Kürk', '🧥 Fur coat']]),
] });
compareGame({ id: 'hasat_suresi', name: B('Hangisi Önce Olgunlaşır?', 'Which Ripens First?'), icon: '🗓️', at: J('ziraatmuh', 'ciftci'), tags: ['doga'], ask: B('Ekimden hasada hangisi daha KISA sürer?', 'Which takes LESS time from sowing to harvest?'), unit: B('gün', 'days'), less: true,
  items: [[B('🥬 Roka', '🥬 Rocket'), 30], [B('🌱 Turp', '🌱 Radish'), 28], [B('🥒 Salatalık', '🥒 Cucumber'), 55], [B('🍅 Domates', '🍅 Tomato'), 75], [B('🎃 Balkabağı', '🎃 Pumpkin'), 110], [B('🧅 Soğan', '🧅 Onion'), 100], [B('🥕 Havuç', '🥕 Carrot'), 70], [B('🌽 Mısır', '🌽 Corn'), 90]] });
spotGame({ id: 'hastalikli_bitki', name: B('Hasta Bitki', 'Sick Plant'), icon: '🍂', at: J('ziraatmuh'), tags: ['doga'], bg: '#1f3a22', targets: ['🍂', '🥀'], noise: ['🌿', '🌱', '☘️', '🍀', '🌾', '🌳', '🪴'] });
mazeGame({ id: 'sulama_kanali', name: B('Sulama Kanalı', 'Irrigation Channel'), icon: '💧', at: J('ziraatmuh', 'ciftci'), tags: ['doga'], player: '💧', goal: '🌱', wall: '#8fd18a', bg: '#1b2a3a' });

// ———————————————— USTA / ÇIRAK ————————————————
slideGame({ id: 'boru_yapboz', name: B('Boru Hattı', 'Pipeline Puzzle'), icon: '🚰', at: J('cirak'), tags: ['el'], tiles: ['🚰', '🔧', '🪠', '🛁', '🚿', '🔩', '⚙️', '🪣'] });
orderGame({ id: 'musluk_degistir', name: B('Musluk Değiştir', 'Replace a Tap'), icon: '🔧', at: J('cirak'), tags: ['el'], sets: [
  S(['Musluk değişimi', 'Replacing a tap'], [['Ana vanayı kapat', 'Shut the main valve'], ['Eski musluğu sök', 'Remove the old tap'], ['Dişlere teflon sar', 'Wrap the threads with tape'], ['Yeni musluğu tak', 'Fit the new tap'], ['Vanayı aç, sızıntıyı kontrol et', 'Open the valve, check for leaks']]),
  S(['Priz değişimi', 'Replacing a socket'], [['Sigortayı kapat', 'Switch off the breaker'], ['Kontrol kalemiyle dene', 'Test with a voltage pen'], ['Eski prizi sök', 'Remove the old socket'], ['Kabloları bağla', 'Connect the wires'], ['Sigortayı aç', 'Switch the breaker back on']]),
] });
mashGame({ id: 'kriko', name: B('Kriko', 'Car Jack'), icon: '🚗', at: J('cirak'), tags: ['el'], color: '#9aa7b8', tapText: B('Arabayı dengeli kaldır!', 'Lift the car steadily!') });
lightsGame({ id: 'sigorta_panosu', name: B('Sigorta Panosu', 'Fuse Box'), icon: '⚡', at: J('cirak', 'muhendis'), tags: ['el'], on: '⚡', off: '✅', onBg: '#5a3a1a', offBg: '#1d3a2a', how: [B('Arızalı hatları söndür: bir sigortaya dokununca o ve komşuları değişir.', 'Clear the faults: tapping a fuse flips it and its neighbours.'), B('Hepsini ✅ yap.', 'Make them all ✅.'), B('3 bulmaca.', '3 puzzles.')] });
timingGame({ id: 'kaynak_yap', name: B('Kaynak Yap', 'Welding'), icon: '👨‍🏭', at: J('cirak', 'isci'), tags: ['el'], target: '🔥', verb: B('Kaynak', 'Weld'), perfect: B('Pürüzsüz dikiş!', 'Smooth seam!'), okText: B('İdare eder', 'Passable'), missText: B('Delik açıldı', 'Burned through') });

// ———————————————— ÇİFTÇİ ————————————————
snakeGame({ id: 'coban_kopegi', name: B('Çoban Köpeği', 'Sheepdog'), icon: '🐕', at: J('ciftci'), tags: ['doga'], head: '🐕', food: ['🐑'], bad: ['🐺'], body: '#f0f0e8', bg: '#3a5a2a', how: [B('Kaçan koyunları topla; dokunduğun yöne dönersin.', 'Round up the stray sheep; tap where you want to turn.'), B('Kurda 🐺 ve çite çarpma!', "Don't run into the wolf 🐺 or the fence!"), B('3 can, 40 saniye.', '3 lives, 40 seconds.')] });
mashGame({ id: 'yayik_ayran', name: B('Yayık Yayma', 'Churning Butter'), icon: '🧈', at: J('ciftci'), tags: ['doga'], color: '#ffe8a3', tapText: B('Ritmi tut, tereyağı çıksın!', 'Keep the rhythm to make butter!') });
dodgeGame({ id: 'dolu_kac', name: B('Doludan Kaç', 'Hailstorm'), icon: '🌨️', at: J('ciftci', 'ziraatmuh'), tags: ['doga'], player: '🐑', bad: ['🧊', '⚪'], good: ['🌾'], bg: '#2a3a4a', hitText: B('Bee!', 'Baa!') });
mazeGame({ id: 'ciftlik_labirent', name: B('Ahıra Dönüş', 'Back to the Barn'), icon: '🐄', at: J('ciftci'), tags: ['doga'], player: '🐄', goal: '🛖', items: ['🌾'], wall: '#c9a45a', bg: '#2f4a24' });
catchGame({ id: 'elma_hasadi', name: B('Elma Hasadı', 'Apple Harvest'), icon: '🍎', at: J('ciftci', 'ziraatmuh'), tags: ['doga'], basket: '🧺', good: ['🍎', '🍏'], bad: ['🐛', '🍂'], bg: '#244a26', sway: true });

// ———————————————— FUTBOLCU & ANTRENÖR ————————————————
dodgeGame({ id: 'defans_arasi', name: B('Defansı Geç', 'Beat the Defence'), icon: '⚽', at: J('futbolcu'), tags: ['futbol'], player: '⚽', bad: ['🦵', '🧍'], good: ['⭐'], angle: true, bg: '#1e5a2e', hitText: B('Top kaptırıldı!', 'Tackled!') });
throwGame({ id: 'uzun_pas', name: B('Uzun Pas', 'Long Pass'), icon: '🎯', at: J('futbolcu', 'antrenor'), tags: ['futbol'], thrower: '🦵', target: '🎽', ball: '⚽', wind: true, bg: '#1e4a2a', ground: '#2a6a36' });
jumpGame({ id: 'kayarak_mudahale', name: B('Kayarak Müdahale', 'Sliding Tackles'), icon: '🏃', at: J('futbolcu'), tags: ['futbol'], player: '⛹️', obstacles: ['🦵', '🥅'], bonus: '⚽', bg: '#1e4a2a', ground: '#2a6a36' });
rhythmGame({ id: 'top_sektirme', name: B('Top Sektirme', 'Keepy-Uppy'), icon: '⚽', at: J('futbolcu', 'antrenor'), tags: ['futbol'], notes: ['⚽'], keys: ['🦶', '🦵', '🧠'], bg: '#1e3a24', how: [B('Top üç yerden düşebilir: sol ayak, sağ ayak, kafa.', 'The ball can drop to left foot, right foot or head.'), B('Çizgiye gelince doğru tuşa dokun, top yere değmesin.', 'Tap the right button as it reaches the line — keep it off the ground.'), B('30 saniye.', '30 seconds.')] });
orderGame({ id: 'antrenman_plani', name: B('Antrenman Planı', 'Training Plan'), icon: '📋', at: J('antrenor', 'futbolcu'), tags: ['futbol'], sets: [
  S(['Bir antrenman', 'A training session'], [['Isınma koşusu', 'Warm-up jog'], ['Esneme', 'Stretching'], ['Pas çalışması', 'Passing drills'], ['Taktik maç', 'Tactical game'], ['Soğuma', 'Cool-down']]),
  S(['Maç günü', 'Match day'], [['Rakibi analiz et', 'Analyse the opponent'], ['Kadroyu açıkla', 'Announce the line-up'], ['Soyunma odası konuşması', 'Dressing-room talk'], ['Maç', 'The match'], ['Maç sonu değerlendirme', 'Post-match review']]),
] });
patternGame({ id: 'dizilis_ezber', name: B('Diziliş Ezberi', 'Formation Memory'), icon: '📐', at: J('antrenor'), tags: ['futbol'], mark: '👕', bg: '#1e4a2a', markBg: '#2a6a36' });
memoryGame({ id: 'forma_numara', name: B('Forma Numaraları', 'Shirt Numbers'), icon: '👕', at: J('antrenor', 'futbolcu'), tags: ['futbol'], back: '👕', bg: '#1e3a5a', items: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'] });

// ———————————————— PSİKOLOG ————————————————
popGame({ id: 'olumlu_dusunce', name: B('Olumlu Düşünce', 'Positive Thoughts'), icon: '🌤️', at: J('psikolog'), tags: ['sosyal'], rules: [
  [B('Yapıcı düşünceleri patlat', 'Pop the HELPFUL thoughts'), P([['Deneyeceğim', "I'll try"], ['Öğreniyorum', "I'm learning"], ['Yardım isteyebilirim', 'I can ask for help'], ['Bu geçecek', 'This will pass'], ['Adım adım', 'Step by step']]), P([['Asla yapamam', 'I can never do it'], ['Herkes benden iyi', 'Everyone is better'], ['Hep kötü olur', 'It always goes wrong'], ['İşe yaramam', "I'm useless"]])],
  [B('Duygu sözcüklerini patlat', 'Pop the FEELING words'), P([['Kaygı', 'Anxiety'], ['Sevinç', 'Joy'], ['Öfke', 'Anger'], ['Hüzün', 'Sadness'], ['Merak', 'Curiosity']]), P([['Masa', 'Table'], ['Otobüs', 'Bus'], ['Kalem', 'Pen'], ['Pencere', 'Window']])],
] });
memoryGame({ id: 'duygu_kartlari', name: B('Duygu Kartları', 'Emotion Cards'), icon: '🙂', at: J('psikolog', 'ogretmen'), tags: ['sosyal'], back: '💭', bg: '#3a2a4a', items: ['😀', '😢', '😠', '😨', '😲', '😴', '🥰', '😔', '🤔'] });
orderGame({ id: 'nefes_egzersizi', name: B('Sakinleşme Adımları', 'Calming Steps'), icon: '🫁', at: J('psikolog'), tags: ['sosyal'], sets: [
  S(['Kutu nefesi', 'Box breathing'], [['4 saniye nefes al', 'Breathe in for 4'], ['4 saniye tut', 'Hold for 4'], ['4 saniye ver', 'Breathe out for 4'], ['4 saniye bekle', 'Pause for 4']]),
  S(['5-4-3-2-1 tekniği', 'The 5-4-3-2-1 technique'], [['Gördüğün 5 şey', '5 things you see'], ['Dokunabildiğin 4 şey', '4 things you can touch'], ['Duyduğun 3 şey', '3 things you hear'], ['Kokladığın 2 şey', '2 things you smell'], ['Tadını aldığın 1 şey', '1 thing you taste']]),
] });
fillGame({ id: 'nefes_balonu', name: B('Nefes Balonu', 'Breathing Balloon'), icon: '🎈', at: J('psikolog'), tags: ['sosyal'] });
shellGame({ id: 'dikkat_bardagi', name: B('Dikkat Testi', 'Attention Test'), icon: '🧠', at: J('psikolog'), tags: ['sosyal'], cup: '🎩', item: '🐇' });

// ———————————————— GAZETECİ ————————————————
orderGame({ id: 'haber_yaz', name: B('Haber Yaz', 'Write the Story'), icon: '📰', at: J('gazeteci'), tags: ['dil'], sets: [
  S(['Bir haberin yapısı', 'Structure of a news story'], [['Başlık', 'Headline'], ['Spot (özet)', 'Standfirst'], ['Ne, kim, nerede, ne zaman', 'What, who, where, when'], ['Neden ve nasıl', 'Why and how'], ['Kaynak ve tanık sözleri', 'Sources and quotes']]),
  S(['Röportaj', 'An interview'], [['Konuğu araştır', 'Research the guest'], ['Soruları hazırla', 'Prepare the questions'], ['Kaydı başlat', 'Start recording'], ['Söyleşiyi yap', 'Do the interview'], ['Deşifre et ve yaz', 'Transcribe and write']]),
] });
reactGame({ id: 'son_dakika', name: B('Son Dakika', 'Breaking News'), icon: '🚨', at: J('gazeteci'), tags: ['dil'], wait: '📺', go: '🚨', fake: '📣', waitText: B('Haber akışı sakin…', 'Newsfeed quiet…'), goText: B('YAYINA GİR!', 'GO LIVE!'), bg: '#2a1a1a' });
memoryGame({ id: 'foto_arsiv', name: B('Fotoğraf Arşivi', 'Photo Archive'), icon: '📸', at: J('gazeteci', 'tasarimci'), tags: ['dil'], back: '📷', bg: '#2a2a2a', items: ['🏟️', '🏛️', '🌋', '🚀', '🗳️', '🎭', '🏆', '🌊', '🎤'] });
wordGame({ id: 'manset_kelime', name: B('Manşet Kelimesi', 'Headline Word'), icon: '🗞️', at: J('gazeteci', 'tercuman'), tags: ['dil'], target: 5,
  words: [['🗳️', 'SEÇİM', 'ELECTION'], ['🌧️', 'SAĞANAK', 'STORM'], ['🏆', 'ŞAMPİYON', 'CHAMPION'], ['📈', 'REKOR', 'RECORD'], ['🚀', 'UZAY', 'SPACE'], ['🏛️', 'MECLİS', 'SENATE'], ['🎤', 'RÖPORTAJ', 'INTERVIEW'], ['🌍', 'DÜNYA', 'WORLD'], ['⚽', 'DERBİ', 'DERBY'], ['🔬', 'KEŞİF', 'DISCOVERY']] });
spotGame({ id: 'kaynak_bul', name: B('Kaynağı Bul', 'Find the Source'), icon: '🎙️', at: J('gazeteci'), tags: ['dil'], bg: '#2a2230', ask: B('Mikrofonu uzat:', 'Find the interviewee:'), targets: ['🧑‍💼', '👩‍🔬', '🧑‍🚒'], noise: ['🧍', '🧍‍♀️', '🚶', '🚶‍♀️', '🧑', '👩', '👨', '🧓', '📷', '🎥'] });

// ———————————————— TERCÜMAN ————————————————
wordGame({ id: 'ceviri_kelime', name: B('Çeviri Kelimesi', 'Translate the Word'), icon: '🌐', at: J('tercuman'), tags: ['dil'], flip: true, target: 5,
  how: [B('Resme bak; kelimeyi İNGİLİZCE kur.', 'Look at the picture and build the word in TURKISH.'), B('Harflere sırayla dokun.', 'Tap the letters in order.'), B('45 saniye.', '45 seconds.')],
  words: [['🍎', 'ELMA', 'APPLE'], ['🐱', 'KEDİ', 'CAT'], ['🏠', 'EV', 'HOUSE'], ['📚', 'KİTAP', 'BOOK'], ['☀️', 'GÜNEŞ', 'SUN'], ['🌙', 'AY', 'MOON'], ['🐟', 'BALIK', 'FISH'], ['🌳', 'AĞAÇ', 'TREE'], ['🚗', 'ARABA', 'CAR'], ['💧', 'SU', 'WATER'], ['🍞', 'EKMEK', 'BREAD'], ['🐶', 'KÖPEK', 'DOG']] });
// i18n-skip-start
const GREET = [['Bonjour', B('Fransızca', 'French')], ['Hola', B('İspanyolca', 'Spanish')], ['Ciao', B('İtalyanca', 'Italian')], ['Hallo', B('Almanca', 'German')], ['Olá', B('Portekizce', 'Portuguese')], ['Привет', B('Rusça', 'Russian')], ['こんにちは', B('Japonca', 'Japanese')], ['Merhaba', B('Türkçe', 'Turkish')], ['Hello', B('İngilizce', 'English')], ['مرحبا', B('Arapça', 'Arabic')], ['你好', B('Çince', 'Chinese')], ['Γειά σου', B('Yunanca', 'Greek')]];
// i18n-skip-end
quickGame({ id: 'selam_dili', name: B('Hangi Dilde Selam?', 'Which Language Says Hi?'), icon: '👋', at: J('tercuman'), tags: ['dil'], target: 10,
  gen: rng => { const [w, l] = rng.pick(GREET); return { q: `"${w}"`, a: l, w: rng.shuffle(GREET.map(x => x[1]).filter(x => x !== l)).slice(0, 3) }; } });
memoryGame({ id: 'bayrak_kartlari', name: B('Bayrak Kartları', 'Flag Cards'), icon: '🏳️', at: J('tercuman'), tags: ['dil'], back: '🌐', bg: '#1e2a4a', items: ['🇹🇷', '🇬🇧', '🇫🇷', '🇩🇪', '🇪🇸', '🇮🇹', '🇯🇵', '🇧🇷', '🇺🇸'] });
schulteGame({ id: 'alfabe_avi', name: B('Alfabe Avı', 'Alphabet Hunt'), icon: '🔤', at: J('tercuman', 'ogretmen'), tags: ['dil'], hint: 'A, B, C…', labels: (rng, n) => 'ABCDEFGHIJKLMNOPQRSTUVWXY'.slice(0, n).split('') });

// ———————————————— MÜZİSYEN ————————————————
rhythmGame({ id: 'konser_sahnesi', name: B('Konser Sahnesi', 'Concert Stage'), icon: '🎤', at: J('muzisyen'), tags: ['muzik'], notes: ['🎵', '🎶', '🎸'], keys: ['🎸', '🎤', '🥁'], bg: '#2a1030' });
rhythmGame({ id: 'davul_solo', name: B('Davul Solosu', 'Drum Solo'), icon: '🥁', at: J('muzisyen'), tags: ['muzik'], notes: ['🥁'], keys: ['🥁', '🪘', '🔔'], bg: '#301a10' });
memoryGame({ id: 'nota_hafiza', name: B('Nota Hafızası', 'Note Memory'), icon: '🎼', at: J('muzisyen'), tags: ['muzik'], back: '🎵', bg: '#2a1f4a', items: ['🎸', '🎹', '🥁', '🎺', '🎻', '🪕', '🎷', '🪗', '🎤'] });
orderGame({ id: 'sarki_yapisi', name: B('Şarkı Yapısı', 'Song Structure'), icon: '🎶', at: J('muzisyen'), tags: ['muzik'], sets: [
  S(['Bir pop şarkısı', 'A pop song'], [['Giriş', 'Intro'], ['1. kıta', 'Verse 1'], ['Nakarat', 'Chorus'], ['2. kıta', 'Verse 2'], ['Köprü', 'Bridge'], ['Final nakarat', 'Final chorus']]),
  S(['Konser öncesi', 'Before the gig'], [['Enstrümanları kur', 'Set up the gear'], ['Akort et', 'Tune up'], ['Ses kontrolü', 'Sound check'], ['Sahneye çık', 'Go on stage']]),
] });
patternGame({ id: 'isik_sovu', name: B('Işık Şovu', 'Light Show'), icon: '💡', at: J('muzisyen'), tags: ['muzik'], mark: '💡', bg: '#1a1030', markBg: '#4a2a6a' });

// ———————————————— TASARIMCI ————————————————
traceGame({ id: 'logo_ciz', name: B('Logo Çiz', 'Draw the Logo'), icon: '✒️', at: J('tasarimci'), tags: ['sanat'], shapes: ['yildiz', 'kalp', 'sarmal', 'ucgen', 'daire'], ink: '#ff8a3d', bg: '#f5f5f5' });
slideGame({ id: 'poster_yapboz', name: B('Poster Düzeni', 'Poster Layout'), icon: '🖼️', at: J('tasarimci'), tags: ['sanat'], tiles: ['🎨', '🖌️', '✏️', '📐', '📏', '🖍️', '🧵', '✂️'] });
stroopGame({ id: 'renk_uzmani', name: B('Renk Uzmanı', 'Colour Expert'), icon: '🎨', at: J('tasarimci'), tags: ['sanat'] });
sudokuGame({ id: 'renk_sudoku', name: B('Renk Paleti', 'Colour Palette'), icon: '🟥', at: J('tasarimci'), tags: ['sanat'], symbols: ['🟥', '🟨', '🟦', '🟩'] });
patternGame({ id: 'mozaik_desen', name: B('Kilim Deseni', 'Rug Pattern'), icon: '🧶', at: J('tasarimci'), tags: ['sanat'], mark: '🔶', bg: '#3a1f1a', markBg: '#7a3a2a' });
