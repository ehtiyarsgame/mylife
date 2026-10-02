// Bilgi bankası: mini oyunların soru ve eşleşme havuzlarını büyütmek için iki dilli veri.
// Her kayıt [tr, en] biçiminde ya da açıkça adlandırılmış alanlarla. Oyunlar dile göre seçer.
// i18n-skip-start

// ——— Ülkeler: [bayrak, tr, en, başkent tr, başkent en, kıta] · kıta: 0 Avrupa, 1 Asya, 2 Afrika, 3 Amerika, 4 Okyanusya, null: iki kıtada
export const COUNTRIES = [
  ['🇹🇷', 'Türkiye', 'Turkey', 'Ankara', 'Ankara', null], ['🇫🇷', 'Fransa', 'France', 'Paris', 'Paris', 0], ['🇩🇪', 'Almanya', 'Germany', 'Berlin', 'Berlin', 0],
  ['🇮🇹', 'İtalya', 'Italy', 'Roma', 'Rome', 0], ['🇪🇸', 'İspanya', 'Spain', 'Madrid', 'Madrid', 0], ['🇵🇹', 'Portekiz', 'Portugal', 'Lizbon', 'Lisbon', 0],
  ['🇬🇧', 'Birleşik Krallık', 'United Kingdom', 'Londra', 'London', 0], ['🇮🇪', 'İrlanda', 'Ireland', 'Dublin', 'Dublin', 0], ['🇳🇱', 'Hollanda', 'Netherlands', 'Amsterdam', 'Amsterdam', 0],
  ['🇧🇪', 'Belçika', 'Belgium', 'Brüksel', 'Brussels', 0], ['🇨🇭', 'İsviçre', 'Switzerland', 'Bern', 'Bern', 0], ['🇦🇹', 'Avusturya', 'Austria', 'Viyana', 'Vienna', 0],
  ['🇵🇱', 'Polonya', 'Poland', 'Varşova', 'Warsaw', 0], ['🇨🇿', 'Çekya', 'Czechia', 'Prag', 'Prague', 0], ['🇭🇺', 'Macaristan', 'Hungary', 'Budapeşte', 'Budapest', 0],
  ['🇷🇴', 'Romanya', 'Romania', 'Bükreş', 'Bucharest', 0], ['🇧🇬', 'Bulgaristan', 'Bulgaria', 'Sofya', 'Sofia', 0], ['🇬🇷', 'Yunanistan', 'Greece', 'Atina', 'Athens', 0],
  ['🇷🇸', 'Sırbistan', 'Serbia', 'Belgrad', 'Belgrade', 0], ['🇭🇷', 'Hırvatistan', 'Croatia', 'Zagreb', 'Zagreb', 0], ['🇺🇦', 'Ukrayna', 'Ukraine', 'Kiev', 'Kyiv', 0],
  ['🇳🇴', 'Norveç', 'Norway', 'Oslo', 'Oslo', 0], ['🇸🇪', 'İsveç', 'Sweden', 'Stockholm', 'Stockholm', 0], ['🇫🇮', 'Finlandiya', 'Finland', 'Helsinki', 'Helsinki', 0],
  ['🇩🇰', 'Danimarka', 'Denmark', 'Kopenhag', 'Copenhagen', 0], ['🇮🇸', 'İzlanda', 'Iceland', 'Reykjavik', 'Reykjavik', 0], ['🇷🇺', 'Rusya', 'Russia', 'Moskova', 'Moscow', null],
  ['🇦🇱', 'Arnavutluk', 'Albania', 'Tiran', 'Tirana', 0], ['🇧🇦', 'Bosna-Hersek', 'Bosnia and Herzegovina', 'Saraybosna', 'Sarajevo', 0], ['🇸🇮', 'Slovenya', 'Slovenia', 'Ljubljana', 'Ljubljana', 0],
  ['🇸🇰', 'Slovakya', 'Slovakia', 'Bratislava', 'Bratislava', 0], ['🇱🇹', 'Litvanya', 'Lithuania', 'Vilnius', 'Vilnius', 0], ['🇱🇻', 'Letonya', 'Latvia', 'Riga', 'Riga', 0],
  ['🇪🇪', 'Estonya', 'Estonia', 'Tallinn', 'Tallinn', 0], ['🇬🇪', 'Gürcistan', 'Georgia', 'Tiflis', 'Tbilisi', null], ['🇦🇿', 'Azerbaycan', 'Azerbaijan', 'Bakü', 'Baku', null],
  ['🇯🇵', 'Japonya', 'Japan', 'Tokyo', 'Tokyo', 1], ['🇨🇳', 'Çin', 'China', 'Pekin', 'Beijing', 1], ['🇮🇳', 'Hindistan', 'India', 'Yeni Delhi', 'New Delhi', 1],
  ['🇰🇷', 'Güney Kore', 'South Korea', 'Seul', 'Seoul', 1], ['🇮🇩', 'Endonezya', 'Indonesia', 'Cakarta', 'Jakarta', 1], ['🇹🇭', 'Tayland', 'Thailand', 'Bangkok', 'Bangkok', 1],
  ['🇻🇳', 'Vietnam', 'Vietnam', 'Hanoi', 'Hanoi', 1], ['🇵🇰', 'Pakistan', 'Pakistan', 'İslamabad', 'Islamabad', 1], ['🇮🇷', 'İran', 'Iran', 'Tahran', 'Tehran', 1],
  ['🇮🇶', 'Irak', 'Iraq', 'Bağdat', 'Baghdad', 1], ['🇸🇦', 'Suudi Arabistan', 'Saudi Arabia', 'Riyad', 'Riyadh', 1], ['🇶🇦', 'Katar', 'Qatar', 'Doha', 'Doha', 1],
  ['🇰🇿', 'Kazakistan', 'Kazakhstan', 'Astana', 'Astana', 1], ['🇺🇿', 'Özbekistan', 'Uzbekistan', 'Taşkent', 'Tashkent', 1], ['🇰🇬', 'Kırgızistan', 'Kyrgyzstan', 'Bişkek', 'Bishkek', 1],
  ['🇹🇲', 'Türkmenistan', 'Turkmenistan', 'Aşkabat', 'Ashgabat', 1], ['🇦🇫', 'Afganistan', 'Afghanistan', 'Kabil', 'Kabul', 1], ['🇲🇾', 'Malezya', 'Malaysia', 'Kuala Lumpur', 'Kuala Lumpur', 1],
  ['🇵🇭', 'Filipinler', 'Philippines', 'Manila', 'Manila', 1], ['🇲🇳', 'Moğolistan', 'Mongolia', 'Ulan Batur', 'Ulaanbaatar', 1], ['🇧🇩', 'Bangladeş', 'Bangladesh', 'Dakka', 'Dhaka', 1],
  ['🇳🇵', 'Nepal', 'Nepal', 'Katmandu', 'Kathmandu', 1], ['🇯🇴', 'Ürdün', 'Jordan', 'Amman', 'Amman', 1], ['🇱🇧', 'Lübnan', 'Lebanon', 'Beyrut', 'Beirut', 1],
  ['🇸🇾', 'Suriye', 'Syria', 'Şam', 'Damascus', 1], ['🇪🇬', 'Mısır', 'Egypt', 'Kahire', 'Cairo', 2], ['🇲🇦', 'Fas', 'Morocco', 'Rabat', 'Rabat', 2],
  ['🇩🇿', 'Cezayir', 'Algeria', 'Cezayir', 'Algiers', 2], ['🇹🇳', 'Tunus', 'Tunisia', 'Tunus', 'Tunis', 2], ['🇱🇾', 'Libya', 'Libya', 'Trablus', 'Tripoli', 2],
  ['🇳🇬', 'Nijerya', 'Nigeria', 'Abuja', 'Abuja', 2], ['🇰🇪', 'Kenya', 'Kenya', 'Nairobi', 'Nairobi', 2], ['🇪🇹', 'Etiyopya', 'Ethiopia', 'Addis Ababa', 'Addis Ababa', 2],
  ['🇬🇭', 'Gana', 'Ghana', 'Akra', 'Accra', 2], ['🇸🇳', 'Senegal', 'Senegal', 'Dakar', 'Dakar', 2], ['🇸🇩', 'Sudan', 'Sudan', 'Hartum', 'Khartoum', 2],
  ['🇺🇬', 'Uganda', 'Uganda', 'Kampala', 'Kampala', 2], ['🇸🇴', 'Somali', 'Somalia', 'Mogadişu', 'Mogadishu', 2], ['🇹🇿', 'Tanzanya', 'Tanzania', 'Dodoma', 'Dodoma', 2],
  ['🇺🇸', 'ABD', 'USA', 'Washington', 'Washington, D.C.', 3], ['🇨🇦', 'Kanada', 'Canada', 'Ottawa', 'Ottawa', 3], ['🇲🇽', 'Meksika', 'Mexico', 'Meksiko', 'Mexico City', 3],
  ['🇧🇷', 'Brezilya', 'Brazil', 'Brasilia', 'Brasília', 3], ['🇦🇷', 'Arjantin', 'Argentina', 'Buenos Aires', 'Buenos Aires', 3], ['🇨🇱', 'Şili', 'Chile', 'Santiago', 'Santiago', 3],
  ['🇵🇪', 'Peru', 'Peru', 'Lima', 'Lima', 3], ['🇨🇴', 'Kolombiya', 'Colombia', 'Bogota', 'Bogotá', 3], ['🇻🇪', 'Venezuela', 'Venezuela', 'Karakas', 'Caracas', 3],
  ['🇨🇺', 'Küba', 'Cuba', 'Havana', 'Havana', 3], ['🇺🇾', 'Uruguay', 'Uruguay', 'Montevideo', 'Montevideo', 3], ['🇪🇨', 'Ekvador', 'Ecuador', 'Kito', 'Quito', 3],
  ['🇵🇾', 'Paraguay', 'Paraguay', 'Asunción', 'Asunción', 3], ['🇯🇲', 'Jamaika', 'Jamaica', 'Kingston', 'Kingston', 3],
  ['🇦🇺', 'Avustralya', 'Australia', 'Kanberra', 'Canberra', 4], ['🇳🇿', 'Yeni Zelanda', 'New Zealand', 'Wellington', 'Wellington', 4],
];

// ——— Hayvanlar: [emoji, tr, en, sınıf, yaşam yeri, beslenme]
// sınıf: 0 memeli, 1 kuş, 2 sürüngen, 3 balık, 4 böcek, 5 amfibi, 6 diğer · yer: ç çiftlik, o orman, d deniz, s savan, k kutup, c çöl, e ev, t tatlı su, y yağmur ormanı
// beslenme: o otçul, e etçil, h hepçil
export const ANIMALS = [
  ['🐶', 'Köpek', 'Dog', 0, 'e', 'h'], ['🐱', 'Kedi', 'Cat', 0, 'e', 'e'], ['🐄', 'İnek', 'Cow', 0, 'ç', 'o'], ['🐴', 'At', 'Horse', 0, 'ç', 'o'],
  ['🐑', 'Koyun', 'Sheep', 0, 'ç', 'o'], ['🐐', 'Keçi', 'Goat', 0, 'ç', 'o'], ['🐷', 'Domuz', 'Pig', 0, 'ç', 'h'], ['🐰', 'Tavşan', 'Rabbit', 0, 'ç', 'o'],
  ['🐭', 'Fare', 'Mouse', 0, 'e', 'h'], ['🐿️', 'Sincap', 'Squirrel', 0, 'o', 'h'], ['🐻', 'Ayı', 'Bear', 0, 'o', 'h'], ['🐺', 'Kurt', 'Wolf', 0, 'o', 'e'],
  ['🦊', 'Tilki', 'Fox', 0, 'o', 'h'], ['🦁', 'Aslan', 'Lion', 0, 's', 'e'], ['🐯', 'Kaplan', 'Tiger', 0, 'y', 'e'], ['🐆', 'Leopar', 'Leopard', 0, 's', 'e'],
  ['🐘', 'Fil', 'Elephant', 0, 's', 'o'], ['🦒', 'Zürafa', 'Giraffe', 0, 's', 'o'], ['🦓', 'Zebra', 'Zebra', 0, 's', 'o'], ['🦏', 'Gergedan', 'Rhinoceros', 0, 's', 'o'],
  ['🦛', 'Su aygırı', 'Hippopotamus', 0, 't', 'o'], ['🐪', 'Deve', 'Camel', 0, 'c', 'o'], ['🐒', 'Maymun', 'Monkey', 0, 'y', 'h'], ['🦍', 'Goril', 'Gorilla', 0, 'y', 'o'],
  ['🦘', 'Kanguru', 'Kangaroo', 0, 's', 'o'], ['🐨', 'Koala', 'Koala', 0, 'o', 'o'], ['🐼', 'Panda', 'Panda', 0, 'o', 'o'], ['🐬', 'Yunus', 'Dolphin', 0, 'd', 'e'],
  ['🐋', 'Balina', 'Whale', 0, 'd', 'e'], ['🦭', 'Fok', 'Seal', 0, 'k', 'e'], ['🐻‍❄️', 'Kutup ayısı', 'Polar bear', 0, 'k', 'e'], ['🦇', 'Yarasa', 'Bat', 0, 'o', 'h'],
  ['🦔', 'Kirpi', 'Hedgehog', 0, 'o', 'e'], ['🦌', 'Geyik', 'Deer', 0, 'o', 'o'], ['🦙', 'Lama', 'Llama', 0, 'ç', 'o'], ['🦫', 'Kunduz', 'Beaver', 0, 't', 'o'],
  ['🦦', 'Su samuru', 'Otter', 0, 't', 'e'], ['🦥', 'Tembel hayvan', 'Sloth', 0, 'y', 'o'], ['🦬', 'Bizon', 'Bison', 0, 's', 'o'], ['🐃', 'Manda', 'Water buffalo', 0, 'ç', 'o'],
  ['🦡', 'Porsuk', 'Badger', 0, 'o', 'h'], ['🐹', 'Hamster', 'Hamster', 0, 'e', 'h'],
  ['🐔', 'Tavuk', 'Chicken', 1, 'ç', 'h'], ['🦆', 'Ördek', 'Duck', 1, 't', 'h'], ['🦢', 'Kuğu', 'Swan', 1, 't', 'o'], ['🦉', 'Baykuş', 'Owl', 1, 'o', 'e'],
  ['🦅', 'Kartal', 'Eagle', 1, 'o', 'e'], ['🦜', 'Papağan', 'Parrot', 1, 'y', 'o'], ['🐧', 'Penguen', 'Penguin', 1, 'k', 'e'], ['🦩', 'Flamingo', 'Flamingo', 1, 't', 'h'],
  ['🦚', 'Tavus kuşu', 'Peacock', 1, 'o', 'h'], ['🦃', 'Hindi', 'Turkey (bird)', 1, 'ç', 'h'], ['🕊️', 'Güvercin', 'Dove', 1, 'e', 'o'], ['🐦‍⬛', 'Karga', 'Crow', 1, 'o', 'h'],
  ['🐍', 'Yılan', 'Snake', 2, 'c', 'e'], ['🦎', 'Kertenkele', 'Lizard', 2, 'c', 'e'], ['🐊', 'Timsah', 'Crocodile', 2, 't', 'e'], ['🐢', 'Kaplumbağa', 'Turtle', 2, 'd', 'h'],
  ['🦈', 'Köpekbalığı', 'Shark', 3, 'd', 'e'], ['🐡', 'Balon balığı', 'Pufferfish', 3, 'd', 'h'], ['🐠', 'Palyaço balığı', 'Clownfish', 3, 'd', 'h'], ['🐟', 'Hamsi', 'Anchovy', 3, 'd', 'h'],
  ['🐝', 'Arı', 'Bee', 4, 'ç', 'o'], ['🐜', 'Karınca', 'Ant', 4, 'o', 'h'], ['🦋', 'Kelebek', 'Butterfly', 4, 'o', 'o'], ['🐞', 'Uğur böceği', 'Ladybird', 4, 'o', 'e'],
  ['🦟', 'Sivrisinek', 'Mosquito', 4, 't', 'h'], ['🦗', 'Çekirge', 'Grasshopper', 4, 'ç', 'o'], ['🪰', 'Karasinek', 'Housefly', 4, 'e', 'h'], ['🪲', 'Bok böceği', 'Dung beetle', 4, 'ç', 'o'],
  ['🐸', 'Kurbağa', 'Frog', 5, 't', 'e'], ['🐙', 'Ahtapot', 'Octopus', 6, 'd', 'e'], ['🦀', 'Yengeç', 'Crab', 6, 'd', 'h'], ['🐌', 'Salyangoz', 'Snail', 6, 'ç', 'o'],
  ['🕷️', 'Örümcek', 'Spider', 6, 'e', 'e'], ['🦑', 'Kalamar', 'Squid', 6, 'd', 'e'], ['🦞', 'Istakoz', 'Lobster', 6, 'd', 'h'],
];
export const CLASSES = [['Memeli', 'Mammal'], ['Kuş', 'Bird'], ['Sürüngen', 'Reptile'], ['Balık', 'Fish'], ['Böcek', 'Insect'], ['Amfibi', 'Amphibian'], ['Diğer', 'Other']];
export const HABITATS = { ç: ['Çiftlik', 'Farm', '🌾'], o: ['Orman', 'Forest', '🌲'], d: ['Deniz', 'Sea', '🌊'], s: ['Savan', 'Savanna', '🌍'], k: ['Kutup', 'Polar', '🧊'], c: ['Çöl', 'Desert', '🏜️'], e: ['Ev / şehir', 'Home / town', '🏠'], t: ['Göl / nehir', 'Lake / river', '🏞️'], y: ['Yağmur ormanı', 'Rainforest', '🌴'] };
// Uçabilenler (oyunda "hangisi uçar?" için)
export const FLIERS = ['🦉', '🦅', '🦜', '🕊️', '🐦‍⬛', '🦢', '🦆', '🦇', '🐝', '🦋', '🐞', '🦟', '🪰', '🦗', '🦩', '🦚'];

// ——— Meyve, sebze, yiyecek: [emoji, tr, en, tür, renk] · tür: m meyve, s sebze, y diğer yiyecek · renk: k kırmızı, s sarı, y yeşil, t turuncu, m mor, b beyaz/kahve
export const FOODS = [
  ['🍎', 'Elma', 'Apple', 'm', 'k'], ['🍏', 'Yeşil elma', 'Green apple', 'm', 'y'], ['🍐', 'Armut', 'Pear', 'm', 'y'], ['🍊', 'Mandalina', 'Tangerine', 'm', 't'],
  ['🍋', 'Limon', 'Lemon', 'm', 's'], ['🍌', 'Muz', 'Banana', 'm', 's'], ['🍉', 'Karpuz', 'Watermelon', 'm', 'k'], ['🍇', 'Üzüm', 'Grapes', 'm', 'm'],
  ['🍓', 'Çilek', 'Strawberry', 'm', 'k'], ['🫐', 'Yaban mersini', 'Blueberries', 'm', 'm'], ['🍈', 'Kavun', 'Melon', 'm', 's'], ['🍒', 'Kiraz', 'Cherries', 'm', 'k'],
  ['🍑', 'Şeftali', 'Peach', 'm', 't'], ['🥭', 'Mango', 'Mango', 'm', 't'], ['🍍', 'Ananas', 'Pineapple', 'm', 's'], ['🥥', 'Hindistan cevizi', 'Coconut', 'm', 'b'],
  ['🥝', 'Kivi', 'Kiwi', 'm', 'y'], ['🍅', 'Domates', 'Tomato', 's', 'k'], ['🍆', 'Patlıcan', 'Aubergine', 's', 'm'], ['🥑', 'Avokado', 'Avocado', 'm', 'y'],
  ['🥦', 'Brokoli', 'Broccoli', 's', 'y'], ['🥬', 'Marul', 'Lettuce', 's', 'y'], ['🥒', 'Salatalık', 'Cucumber', 's', 'y'], ['🌶️', 'Acı biber', 'Chilli', 's', 'k'],
  ['🫑', 'Dolmalık biber', 'Bell pepper', 's', 'y'], ['🌽', 'Mısır', 'Corn', 's', 's'], ['🥕', 'Havuç', 'Carrot', 's', 't'], ['🧄', 'Sarımsak', 'Garlic', 's', 'b'],
  ['🧅', 'Soğan', 'Onion', 's', 'b'], ['🥔', 'Patates', 'Potato', 's', 'b'], ['🍠', 'Tatlı patates', 'Sweet potato', 's', 't'], ['🫛', 'Bezelye', 'Peas', 's', 'y'],
  ['🍄', 'Mantar', 'Mushroom', 's', 'b'], ['🥜', 'Yer fıstığı', 'Peanuts', 'y', 'b'], ['🌰', 'Kestane', 'Chestnut', 'y', 'b'], ['🍞', 'Ekmek', 'Bread', 'y', 'b'],
  ['🥐', 'Kruvasan', 'Croissant', 'y', 'b'], ['🥖', 'Baget', 'Baguette', 'y', 'b'], ['🥨', 'Pretzel', 'Pretzel', 'y', 'b'], ['🧀', 'Peynir', 'Cheese', 'y', 's'],
  ['🥚', 'Yumurta', 'Egg', 'y', 'b'], ['🥞', 'Pankek', 'Pancakes', 'y', 'b'], ['🍕', 'Pizza', 'Pizza', 'y', 'k'], ['🍔', 'Hamburger', 'Burger', 'y', 'b'],
  ['🍟', 'Patates kızartması', 'Chips', 'y', 's'], ['🌭', 'Sosisli', 'Hot dog', 'y', 'k'], ['🥗', 'Salata', 'Salad', 'y', 'y'], ['🍝', 'Makarna', 'Spaghetti', 'y', 's'],
  ['🍜', 'Çorba', 'Noodle soup', 'y', 's'], ['🍚', 'Pilav', 'Rice', 'y', 'b'], ['🍦', 'Dondurma', 'Ice cream', 'y', 'b'], ['🍩', 'Halka tatlı', 'Doughnut', 'y', 'b'],
  ['🍪', 'Kurabiye', 'Cookie', 'y', 'b'], ['🎂', 'Pasta', 'Birthday cake', 'y', 'b'], ['🍫', 'Çikolata', 'Chocolate', 'y', 'b'], ['🍬', 'Şeker', 'Sweet', 'y', 'k'],
  ['🍯', 'Bal', 'Honey', 'y', 's'], ['🥛', 'Süt', 'Milk', 'y', 'b'], ['🧃', 'Meyve suyu', 'Juice', 'y', 't'],
];

// ——— Eşyalar: [emoji, tr, en, grup] · grup: o oyuncak, m mutfak, k okul, g giysi(kış), y giysi(yaz), t taşıt-kara, h taşıt-hava, d taşıt-deniz, z müzik, s spor, a alet, b banyo
export const THINGS = [
  ['🧸', 'Oyuncak ayı', 'Teddy bear', 'o'], ['🪀', 'Yoyo', 'Yo-yo', 'o'], ['🪁', 'Uçurtma', 'Kite', 'o'], ['🎈', 'Balon', 'Balloon', 'o'], ['🧩', 'Yapboz', 'Puzzle', 'o'], ['🪆', 'Matruşka', 'Nesting doll', 'o'], ['🎲', 'Zar', 'Dice', 'o'], ['🪃', 'Bumerang', 'Boomerang', 'o'],
  ['🍳', 'Tava', 'Frying pan', 'm'], ['🥄', 'Kaşık', 'Spoon', 'm'], ['🍴', 'Çatal bıçak', 'Cutlery', 'm'], ['🔪', 'Bıçak', 'Knife', 'm'], ['🫖', 'Çaydanlık', 'Teapot', 'm'], ['🥣', 'Kâse', 'Bowl', 'm'], ['🍽️', 'Tabak', 'Plate', 'm'], ['🫙', 'Kavanoz', 'Jar', 'm'],
  ['✏️', 'Kurşun kalem', 'Pencil', 'k'], ['🖍️', 'Pastel boya', 'Crayon', 'k'], ['📏', 'Cetvel', 'Ruler', 'k'], ['📐', 'Gönye', 'Set square', 'k'], ['📓', 'Defter', 'Notebook', 'k'], ['🎒', 'Okul çantası', 'School bag', 'k'], ['✂️', 'Makas', 'Scissors', 'k'], ['📚', 'Kitaplar', 'Books', 'k'],
  ['🧥', 'Mont', 'Coat', 'g'], ['🧣', 'Atkı', 'Scarf', 'g'], ['🧤', 'Eldiven', 'Gloves', 'g'], ['🥾', 'Bot', 'Boots', 'g'], ['🧦', 'Yün çorap', 'Wool socks', 'g'],
  ['🩳', 'Şort', 'Shorts', 'y'], ['🩴', 'Terlik', 'Flip-flops', 'y'], ['🕶️', 'Güneş gözlüğü', 'Sunglasses', 'y'], ['👒', 'Hasır şapka', 'Sun hat', 'y'], ['🩱', 'Mayo', 'Swimsuit', 'y'],
  ['🚗', 'Araba', 'Car', 't'], ['🚌', 'Otobüs', 'Bus', 't'], ['🚲', 'Bisiklet', 'Bicycle', 't'], ['🏍️', 'Motosiklet', 'Motorbike', 't'], ['🚜', 'Traktör', 'Tractor', 't'], ['🚂', 'Tren', 'Train', 't'], ['🚑', 'Ambulans', 'Ambulance', 't'], ['🚒', 'İtfaiye', 'Fire engine', 't'],
  ['✈️', 'Uçak', 'Aeroplane', 'h'], ['🚁', 'Helikopter', 'Helicopter', 'h'], ['🚀', 'Roket', 'Rocket', 'h'], ['🛩️', 'Küçük uçak', 'Light aircraft', 'h'], ['🪂', 'Paraşüt', 'Parachute', 'h'],
  ['🚢', 'Gemi', 'Ship', 'd'], ['⛵', 'Yelkenli', 'Sailing boat', 'd'], ['🚤', 'Sürat teknesi', 'Speedboat', 'd'], ['🛶', 'Kano', 'Canoe', 'd'], ['⛴️', 'Vapur', 'Ferry', 'd'], ['🚣', 'Kayık', 'Rowing boat', 'd'],
  ['🎸', 'Gitar', 'Guitar', 'z'], ['🎹', 'Piyano', 'Piano', 'z'], ['🥁', 'Davul', 'Drum', 'z'], ['🎺', 'Trompet', 'Trumpet', 'z'], ['🎻', 'Keman', 'Violin', 'z'], ['🪕', 'Banjo', 'Banjo', 'z'], ['🎷', 'Saksafon', 'Saxophone', 'z'], ['🪗', 'Akordeon', 'Accordion', 'z'],
  ['⚽', 'Futbol topu', 'Football', 's'], ['🏀', 'Basketbol topu', 'Basketball', 's'], ['🏐', 'Voleybol topu', 'Volleyball', 's'], ['🎾', 'Tenis topu', 'Tennis ball', 's'], ['🏓', 'Masa tenisi raketi', 'Table-tennis bat', 's'], ['🥊', 'Boks eldiveni', 'Boxing glove', 's'], ['⛸️', 'Paten', 'Ice skate', 's'], ['🏈', 'Amerikan futbolu topu', 'American football', 's'],
  ['🔨', 'Çekiç', 'Hammer', 'a'], ['🔧', 'İngiliz anahtarı', 'Spanner', 'a'], ['🪛', 'Tornavida', 'Screwdriver', 'a'], ['🪚', 'Testere', 'Saw', 'a'], ['🪜', 'Merdiven', 'Ladder', 'a'], ['🧲', 'Mıknatıs', 'Magnet', 'a'],
  ['🪥', 'Diş fırçası', 'Toothbrush', 'b'], ['🧼', 'Sabun', 'Soap', 'b'], ['🧴', 'Şampuan', 'Shampoo', 'b'], ['🛁', 'Küvet', 'Bathtub', 'b'], ['🧽', 'Sünger', 'Sponge', 'b'], ['🪒', 'Tıraş bıçağı', 'Razor', 'b'],
];
export const THING_GROUPS = {
  o: ['Hangisi OYUNCAK?', 'Which one is a TOY?'], m: ['Hangisi MUTFAKTA kullanılır?', 'Which one is used in the KITCHEN?'], k: ['Hangisi OKULDA kullanılır?', 'Which one is used at SCHOOL?'],
  g: ['Hangisi KIŞIN giyilir?', 'Which do you wear in WINTER?'], y: ['Hangisi YAZIN giyilir?', 'Which do you wear in SUMMER?'], t: ['Hangisi KARADA gider?', 'Which travels on LAND?'],
  h: ['Hangisi HAVADA gider?', 'Which travels in the AIR?'], d: ['Hangisi SUDA gider?', 'Which travels on WATER?'], z: ['Hangisi MÜZİK ALETİ?', 'Which is a MUSICAL INSTRUMENT?'],
  s: ['Hangisi SPOR malzemesi?', 'Which is SPORTS gear?'], a: ['Hangisi bir ALET?', 'Which is a TOOL?'], b: ['Hangisi BANYODA kullanılır?', 'Which is used in the BATHROOM?'],
};

// ——— Eş anlamlılar
export const SYN_TR = [
  ['siyah', 'kara'], ['kırmızı', 'al'], ['beyaz', 'ak'], ['okul', 'mektep'], ['cevap', 'yanıt'], ['soru', 'sual'], ['öğrenci', 'talebe'], ['doktor', 'hekim'], ['yaşlı', 'ihtiyar'],
  ['hediye', 'armağan'], ['misafir', 'konuk'], ['zengin', 'varlıklı'], ['yıl', 'sene'], ['akıl', 'us'], ['sınav', 'imtihan'], ['kelime', 'sözcük'], ['cümle', 'tümce'],
  ['örnek', 'misal'], ['millet', 'ulus'], ['ad', 'isim'], ['yüz', 'çehre'], ['ev', 'konut'], ['hızlı', 'süratli'], ['doğa', 'tabiat'], ['anı', 'hatıra'], ['ilgi', 'alaka'],
  ['neden', 'sebep'], ['amaç', 'gaye'], ['olanak', 'imkân'], ['ödev', 'vazife'], ['savaş', 'harp'], ['barış', 'sulh'], ['ihtiyaç', 'gereksinim'], ['hayal', 'düş'],
  ['kuvvet', 'güç'], ['zaman', 'vakit'], ['özgür', 'hür'], ['özgürlük', 'hürriyet'], ['yürek', 'kalp'], ['bilim', 'ilim'], ['dost', 'arkadaş'], ['fakir', 'yoksul'],
  ['cimri', 'pinti'], ['çaba', 'gayret'], ['uyarı', 'ikaz'], ['onur', 'şeref'], ['önem', 'ehemmiyet'], ['yetenek', 'kabiliyet'], ['güven', 'itimat'], ['öykü', 'hikâye'],
  ['deneyim', 'tecrübe'], ['bölge', 'yöre'], ['kural', 'kaide'], ['mutlu', 'bahtiyar'], ['düşünce', 'fikir'], ['duygu', 'his'], ['istek', 'arzu'], ['konut', 'mesken'],
  ['ödül', 'mükâfat'], ['sonuç', 'netice'], ['başarı', 'muvaffakiyet'], ['bayrak', 'sancak'], ['gök', 'sema'], ['yüce', 'ulu'], ['savunma', 'müdafaa'], ['kanıt', 'delil'],
  ['hata', 'yanlış'], ['şehir', 'kent'], ['ilaç', 'deva'], ['tarih', 'geçmiş'], ['yol', 'güzergâh'], ['beyin', 'dimağ'], ['eser', 'yapıt'], ['kitap', 'betik'],
];
export const SYN_EN = [
  ['big', 'large'], ['quick', 'fast'], ['begin', 'start'], ['happy', 'glad'], ['smart', 'clever'], ['angry', 'mad'], ['tiny', 'small'], ['finish', 'end'], ['shut', 'close'],
  ['gift', 'present'], ['brave', 'courageous'], ['rich', 'wealthy'], ['hard', 'difficult'], ['choose', 'pick'], ['help', 'assist'], ['silent', 'quiet'], ['sick', 'ill'], ['buy', 'purchase'],
  ['easy', 'simple'], ['correct', 'right'], ['error', 'mistake'], ['huge', 'enormous'], ['sad', 'unhappy'], ['scared', 'afraid'], ['speak', 'talk'], ['shout', 'yell'],
  ['jump', 'leap'], ['rock', 'stone'], ['tired', 'exhausted'], ['funny', 'humorous'], ['kind', 'nice'], ['story', 'tale'], ['trip', 'journey'], ['fix', 'repair'],
  ['pretty', 'beautiful'], ['answer', 'reply'], ['rapid', 'swift'], ['under', 'below'], ['above', 'over'], ['often', 'frequently'], ['maybe', 'perhaps'], ['nearly', 'almost'],
  ['strange', 'unusual'], ['cash', 'money'], ['sea', 'ocean'], ['street', 'road'], ['car', 'automobile'], ['kid', 'child'], ['friend', 'pal'], ['sofa', 'couch'],
  ['autumn', 'fall'], ['middle', 'centre'], ['shop', 'store'], ['sleep', 'slumber'], ['cheap', 'inexpensive'], ['wide', 'broad'], ['wet', 'damp'], ['hurry', 'rush'],
  ['throw', 'toss'], ['grab', 'seize'], ['idea', 'thought'], ['cold', 'chilly'], ['look', 'glance'], ['smell', 'scent'], ['ask', 'enquire'], ['fear', 'fright'],
  ['wise', 'sensible'], ['loud', 'noisy'], ['complete', 'whole'], ['job', 'occupation'], ['town', 'city'], ['film', 'movie'], ['photo', 'picture'], ['dad', 'father'],
];
// ——— Zıt anlamlılar
export const ANT_TR = [
  ['sıcak', 'soğuk'], ['büyük', 'küçük'], ['uzun', 'kısa'], ['hızlı', 'yavaş'], ['açık', 'kapalı'], ['dolu', 'boş'], ['yeni', 'eski'], ['ağır', 'hafif'], ['gece', 'gündüz'], ['iç', 'dış'],
  ['ileri', 'geri'], ['güçlü', 'zayıf'], ['mutlu', 'üzgün'], ['erken', 'geç'], ['kalın', 'ince'], ['yukarı', 'aşağı'], ['ıslak', 'kuru'], ['temiz', 'kirli'], ['sert', 'yumuşak'], ['cesur', 'korkak'],
  ['aç', 'tok'], ['acı', 'tatlı'], ['genç', 'yaşlı'], ['iyi', 'kötü'], ['doğru', 'yanlış'], ['ön', 'arka'], ['sağ', 'sol'], ['alt', 'üst'], ['uzak', 'yakın'], ['geniş', 'dar'],
  ['derin', 'sığ'], ['yüksek', 'alçak'], ['kolay', 'zor'], ['ucuz', 'pahalı'], ['tembel', 'çalışkan'], ['siyah', 'beyaz'], ['sevinç', 'üzüntü'], ['gelmek', 'gitmek'], ['almak', 'vermek'],
  ['girmek', 'çıkmak'], ['gülmek', 'ağlamak'], ['başlamak', 'bitirmek'], ['kazanmak', 'kaybetmek'], ['uyumak', 'uyanmak'], ['var', 'yok'], ['az', 'çok'], ['yaz', 'kış'],
  ['sabah', 'akşam'], ['dost', 'düşman'], ['savaş', 'barış'], ['zengin', 'fakir'], ['ilk', 'son'], ['giriş', 'çıkış'], ['neşeli', 'hüzünlü'], ['kalabalık', 'tenha'],
  ['sessiz', 'gürültülü'], ['aydınlık', 'karanlık'], ['hasta', 'sağlıklı'], ['canlı', 'cansız'], ['kuzey', 'güney'], ['doğu', 'batı'], ['artı', 'eksi'], ['sevmek', 'nefret etmek'],
  ['hatırlamak', 'unutmak'], ['itmek', 'çekmek'], ['yükselmek', 'alçalmak'], ['soru', 'cevap'], ['kibar', 'kaba'], ['güvenli', 'tehlikeli'], ['pürüzsüz', 'pürüzlü'], ['cömert', 'cimri'],
];
export const ANT_EN = [
  ['hot', 'cold'], ['big', 'small'], ['long', 'short'], ['fast', 'slow'], ['open', 'closed'], ['full', 'empty'], ['new', 'old'], ['heavy', 'light'], ['night', 'day'], ['inside', 'outside'],
  ['forward', 'backward'], ['strong', 'weak'], ['happy', 'sad'], ['early', 'late'], ['thick', 'thin'], ['up', 'down'], ['wet', 'dry'], ['clean', 'dirty'], ['hard', 'soft'], ['brave', 'scared'],
  ['good', 'bad'], ['right', 'wrong'], ['front', 'back'], ['near', 'far'], ['wide', 'narrow'], ['deep', 'shallow'], ['high', 'low'], ['easy', 'difficult'], ['cheap', 'expensive'],
  ['lazy', 'hardworking'], ['black', 'white'], ['joy', 'sorrow'], ['come', 'go'], ['give', 'take'], ['laugh', 'cry'], ['win', 'lose'], ['sleep', 'wake'], ['always', 'never'],
  ['many', 'few'], ['summer', 'winter'], ['morning', 'evening'], ['friend', 'enemy'], ['war', 'peace'], ['rich', 'poor'], ['first', 'last'], ['entrance', 'exit'], ['sweet', 'sour'],
  ['loud', 'quiet'], ['dark', 'bright'], ['sick', 'healthy'], ['alive', 'dead'], ['north', 'south'], ['east', 'west'], ['plus', 'minus'], ['love', 'hate'], ['remember', 'forget'],
  ['push', 'pull'], ['rise', 'fall'], ['buy', 'sell'], ['top', 'bottom'], ['question', 'answer'], ['start', 'stop'], ['polite', 'rude'], ['safe', 'dangerous'], ['smooth', 'rough'],
  ['tight', 'loose'], ['young', 'elderly'], ['generous', 'mean'], ['arrive', 'leave'], ['accept', 'refuse'],
];

// ——— Resimli sözlük (Türkçe–İngilizce): [emoji, tr, en] · resim olarak gösterilebilen sözcükler
export const PICWORDS = [
  ...ANIMALS.map(a => [a[0], a[1], a[2]]), ...FOODS.map(f => [f[0], f[1], f[2]]), ...THINGS.map(t => [t[0], t[1], t[2]]),
  ['☀️', 'Güneş', 'Sun'], ['🌙', 'Ay', 'Moon'], ['⭐', 'Yıldız', 'Star'], ['☁️', 'Bulut', 'Cloud'], ['🌧️', 'Yağmur', 'Rain'], ['❄️', 'Kar tanesi', 'Snowflake'], ['🌈', 'Gökkuşağı', 'Rainbow'],
  ['⚡', 'Şimşek', 'Lightning'], ['🌊', 'Dalga', 'Wave'], ['🌳', 'Ağaç', 'Tree'], ['🌸', 'Çiçek', 'Flower'], ['🍂', 'Yaprak', 'Leaf'], ['🌵', 'Kaktüs', 'Cactus'], ['⛰️', 'Dağ', 'Mountain'],
  ['🏠', 'Ev', 'House'], ['🏫', 'Okul', 'School'], ['🏥', 'Hastane', 'Hospital'], ['🏰', 'Kale', 'Castle'], ['🌉', 'Köprü', 'Bridge'], ['⛺', 'Çadır', 'Tent'], ['🚪', 'Kapı', 'Door'],
  ['🪟', 'Pencere', 'Window'], ['🛏️', 'Yatak', 'Bed'], ['🪑', 'Sandalye', 'Chair'], ['🔑', 'Anahtar', 'Key'], ['⏰', 'Çalar saat', 'Alarm clock'], ['📱', 'Telefon', 'Phone'], ['💻', 'Bilgisayar', 'Computer'],
  ['📺', 'Televizyon', 'Television'], ['💡', 'Ampul', 'Light bulb'], ['🕯️', 'Mum', 'Candle'], ['🎁', 'Hediye', 'Present'], ['✉️', 'Mektup', 'Letter'], ['🗺️', 'Harita', 'Map'], ['🧭', 'Pusula', 'Compass'],
  ['👁️', 'Göz', 'Eye'], ['👂', 'Kulak', 'Ear'], ['👃', 'Burun', 'Nose'], ['👄', 'Ağız', 'Mouth'], ['🦷', 'Diş', 'Tooth'], ['✋', 'El', 'Hand'], ['🦶', 'Ayak', 'Foot'], ['🧠', 'Beyin', 'Brain'], ['❤️', 'Kalp', 'Heart'],
];

// ——— Sözcük türleri (ek): [sözcük, tür] · 0 isim, 1 sıfat, 2 fiil, 3 zarf
export const POS_TR = [
  ['pencere', 0], ['kalem', 0], ['deniz', 0], ['dağ', 0], ['öğretmen', 0], ['sevgi', 0], ['bulut', 0], ['köprü', 0], ['saat', 0], ['ağaç', 0], ['çiçek', 0], ['araba', 0], ['köy', 0], ['kapı', 0],
  ['mavi', 1], ['yaşlı', 1], ['tatlı', 1], ['soğuk', 1], ['cesur', 1], ['geniş', 1], ['temiz', 1], ['yorgun', 1], ['kocaman', 1], ['sessiz', 1], ['zeki', 1], ['eski', 1], ['dar', 1], ['parlak', 1],
  ['yüzmek', 2], ['okudu', 2], ['gülüyor', 2], ['yazacak', 2], ['koştu', 2], ['uyumak', 2], ['geliyor', 2], ['düşündü', 2], ['içmek', 2], ['oynuyor', 2], ['sordu', 2], ['bekleyecek', 2],
  ['bugün', 3], ['yarın', 3], ['hızla', 3], ['sessizce', 3], ['çok', 3], ['hemen', 3], ['şimdi', 3], ['dikkatlice', 3], ['sonra', 3], ['ağır ağır', 3], ['bazen', 3], ['asla', 3],
];
export const POS_EN = [
  ['window', 0], ['pencil', 0], ['sea', 0], ['mountain', 0], ['teacher', 0], ['love', 0], ['cloud', 0], ['bridge', 0], ['clock', 0], ['tree', 0], ['flower', 0], ['village', 0], ['door', 0],
  ['blue', 1], ['old', 1], ['sweet', 1], ['cold', 1], ['brave', 1], ['wide', 1], ['clean', 1], ['tired', 1], ['huge', 1], ['silent', 1], ['clever', 1], ['narrow', 1], ['shiny', 1],
  ['swim', 2], ['read', 2], ['laughs', 2], ['will write', 2], ['ran', 2], ['sleep', 2], ['is coming', 2], ['thought', 2], ['drink', 2], ['plays', 2], ['asked', 2], ['will wait', 2],
  ['today', 3], ['tomorrow', 3], ['fast', 3], ['silently', 3], ['very', 3], ['immediately', 3], ['now', 3], ['carefully', 3], ['later', 3], ['softly', 3], ['sometimes', 3], ['never', 3],
];

// ——— Deyimler: [deyim, anlamı]
export const IDIOM_TR = [
  ['Etekleri zil çalmak', 'Çok sevinmek'], ['Kulak misafiri olmak', 'İstemeden duymak'], ['Göz atmak', 'Kısaca bakmak'], ['Ağzı kulaklarına varmak', 'Çok sevinmek, gülmek'],
  ['Burnu havada olmak', 'Kibirli olmak'], ['Eli açık olmak', 'Cömert olmak'], ['Dili tutulmak', 'Şaşkınlıktan konuşamamak'], ['Pireyi deve yapmak', 'Abartmak'],
  ['Göz yummak', 'Görmezden gelmek'], ['Kafa yormak', 'Çok düşünmek'], ['Ayağını denk almak', 'Dikkatli davranmak'], ['Etekleri tutuşmak', 'Telaşlanmak'],
  ['Gözden düşmek', 'Değerini yitirmek'], ['Ağzı sıkı olmak', 'Sır tutmak'], ['Ateş pahası', 'Çok pahalı'], ['Sabrı taşmak', 'Dayanamaz hâle gelmek'],
  ['Kulak asmamak', 'Önemsememek'], ['Ele avuca sığmamak', 'Çok yaramaz olmak'], ['Eli kulağında', 'Olmak üzere'], ['Gözü tok', 'Kanaatkâr'],
  ['Kılı kırk yarmak', 'Çok titiz davranmak'], ['Nabzına göre şerbet vermek', 'Herkese hoşuna gideni söylemek'], ['Dört gözle beklemek', 'Sabırsızlıkla beklemek'], ['Ağzında bakla ıslanmamak', 'Sır tutamamak'],
  ['Tepesi atmak', 'Çok sinirlenmek'], ['İki yakası bir araya gelmemek', 'Hiç para biriktirememek'], ['Yüzü kızarmak', 'Utanmak'], ['Gözü arkada kalmak', 'Aklı geride kalmak'],
  ['Elini çabuk tutmak', 'Acele etmek'], ['Burnundan getirmek', 'Bir iyiliği çok pahalıya ödetmek'], ['Can kulağıyla dinlemek', 'Dikkatle dinlemek'], ['Dağarcığına katmak', 'Öğrenmek'],
];
export const IDIOM_EN = [
  ['Over the moon', 'Very happy'], ['Piece of cake', 'Very easy'], ['Break the ice', 'Start a friendly conversation'], ['Under the weather', 'Feeling a bit ill'],
  ['Hit the books', 'Study hard'], ['Spill the beans', 'Reveal a secret'], ['Cost an arm and a leg', 'Be very expensive'], ['Once in a blue moon', 'Very rarely'],
  ['Hit the sack', 'Go to bed'], ['Let the cat out of the bag', 'Accidentally tell a secret'], ['On cloud nine', 'Extremely happy'], ['A blessing in disguise', 'Something good that seemed bad'],
  ['Call it a day', 'Stop working'], ['Get cold feet', 'Become nervous and back out'], ['Keep an eye on', 'Watch carefully'], ['Pull someone\'s leg', 'Tease someone'],
  ['Cut corners', 'Do something badly to save time'], ['Face the music', 'Accept the consequences'], ['In hot water', 'In trouble'], ['Hold your horses', 'Wait a moment'],
  ['Time flies', 'Time passes quickly'], ['The ball is in your court', 'It is your decision now'], ['Bite the bullet', 'Do something difficult bravely'], ['Miss the boat', 'Miss an opportunity'],
  ['Make ends meet', 'Have just enough money'], ['Back to square one', 'Start again'], ['Beat around the bush', 'Avoid the main point'], ['Better late than never', 'Doing it late is better than not at all'],
];

// ——— Elementler: [tr, en, sembol]
export const ELEMENTS = [
  ['Hidrojen', 'Hydrogen', 'H'], ['Helyum', 'Helium', 'He'], ['Lityum', 'Lithium', 'Li'], ['Berilyum', 'Beryllium', 'Be'], ['Bor', 'Boron', 'B'], ['Karbon', 'Carbon', 'C'],
  ['Azot', 'Nitrogen', 'N'], ['Oksijen', 'Oxygen', 'O'], ['Flor', 'Fluorine', 'F'], ['Neon', 'Neon', 'Ne'], ['Sodyum', 'Sodium', 'Na'], ['Magnezyum', 'Magnesium', 'Mg'],
  ['Alüminyum', 'Aluminium', 'Al'], ['Silisyum', 'Silicon', 'Si'], ['Fosfor', 'Phosphorus', 'P'], ['Kükürt', 'Sulphur', 'S'], ['Klor', 'Chlorine', 'Cl'], ['Argon', 'Argon', 'Ar'],
  ['Potasyum', 'Potassium', 'K'], ['Kalsiyum', 'Calcium', 'Ca'], ['Titanyum', 'Titanium', 'Ti'], ['Krom', 'Chromium', 'Cr'], ['Mangan', 'Manganese', 'Mn'], ['Demir', 'Iron', 'Fe'],
  ['Kobalt', 'Cobalt', 'Co'], ['Nikel', 'Nickel', 'Ni'], ['Bakır', 'Copper', 'Cu'], ['Çinko', 'Zinc', 'Zn'], ['Arsenik', 'Arsenic', 'As'], ['Brom', 'Bromine', 'Br'],
  ['Kripton', 'Krypton', 'Kr'], ['Gümüş', 'Silver', 'Ag'], ['Kalay', 'Tin', 'Sn'], ['İyot', 'Iodine', 'I'], ['Ksenon', 'Xenon', 'Xe'], ['Baryum', 'Barium', 'Ba'],
  ['Tungsten', 'Tungsten', 'W'], ['Platin', 'Platinum', 'Pt'], ['Altın', 'Gold', 'Au'], ['Cıva', 'Mercury', 'Hg'], ['Kurşun', 'Lead', 'Pb'], ['Radon', 'Radon', 'Rn'], ['Uranyum', 'Uranium', 'U'],
];

// ——— Eserler: [eser tr, eser en, yazar]
export const BOOKS = [
  ['Kürk Mantolu Madonna', 'Madonna in a Fur Coat', 'Sabahattin Ali'], ['Kuyucaklı Yusuf', 'Yusuf of Kuyucak', 'Sabahattin Ali'], ['İnce Memed', 'Memed, My Hawk', 'Yaşar Kemal'],
  ['Çalıkuşu', 'The Wren', 'Reşat Nuri Güntekin'], ['Saatleri Ayarlama Enstitüsü', 'The Time Regulation Institute', 'Ahmet Hamdi Tanpınar'], ['Huzur', 'A Mind at Peace', 'Ahmet Hamdi Tanpınar'],
  ['Tutunamayanlar', 'The Disconnected', 'Oğuz Atay'], ['Benim Adım Kırmızı', 'My Name Is Red', 'Orhan Pamuk'], ['Sinekli Bakkal', 'The Clown and His Daughter', 'Halide Edib Adıvar'],
  ['Aşk-ı Memnu', 'Forbidden Love', 'Halit Ziya Uşaklıgil'], ['Mai ve Siyah', 'Blue and Black', 'Halit Ziya Uşaklıgil'], ['Yaban', 'The Stranger', 'Yakup Kadri Karaosmanoğlu'],
  ['Bereketli Topraklar Üzerinde', 'On Fertile Lands', 'Orhan Kemal'], ['Memleketimden İnsan Manzaraları', 'Human Landscapes from My Country', 'Nazım Hikmet'], ['Safahat', 'Safahat', 'Mehmet Akif Ersoy'],
  ['Kaşağı', 'The Curry-Comb', 'Ömer Seyfettin'], ['Romeo ve Juliet', 'Romeo and Juliet', 'William Shakespeare'], ['Macbeth', 'Macbeth', 'William Shakespeare'],
  ['Anna Karenina', 'Anna Karenina', 'Lev Tolstoy'], ['Karamazov Kardeşler', 'The Brothers Karamazov', 'Fyodor Dostoyevski'], ['Fareler ve İnsanlar', 'Of Mice and Men', 'John Steinbeck'],
  ['Gazap Üzümleri', 'The Grapes of Wrath', 'John Steinbeck'], ['Yaşlı Adam ve Deniz', 'The Old Man and the Sea', 'Ernest Hemingway'], ['Hayvan Çiftliği', 'Animal Farm', 'George Orwell'],
  ['Robinson Crusoe', 'Robinson Crusoe', 'Daniel Defoe'], ['Define Adası', 'Treasure Island', 'Robert Louis Stevenson'], ['Oliver Twist', 'Oliver Twist', 'Charles Dickens'],
  ['Alice Harikalar Diyarında', 'Alice\'s Adventures in Wonderland', 'Lewis Carroll'], ['Pinokyo', 'Pinocchio', 'Carlo Collodi'], ['Seksen Günde Devriâlem', 'Around the World in Eighty Days', 'Jules Verne'],
  ['Denizler Altında Yirmi Bin Fersah', 'Twenty Thousand Leagues Under the Seas', 'Jules Verne'], ['Frankenstein', 'Frankenstein', 'Mary Shelley'], ['İlahi Komedya', 'The Divine Comedy', 'Dante Alighieri'],
  ['Faust', 'Faust', 'Johann Wolfgang von Goethe'], ['Beyaz Diş', 'White Fang', 'Jack London'], ['Martin Eden', 'Martin Eden', 'Jack London'], ['Bülbülü Öldürmek', 'To Kill a Mockingbird', 'Harper Lee'],
  ['Simyacı', 'The Alchemist', 'Paulo Coelho'], ['Uğultulu Tepeler', 'Wuthering Heights', 'Emily Brontë'], ['Jane Eyre', 'Jane Eyre', 'Charlotte Brontë'], ['Tom Sawyer\'ın Maceraları', 'The Adventures of Tom Sawyer', 'Mark Twain'],
];

// ——— İcatlar ve buluşlar: [buluş tr, buluş en, kişi]
export const INVENTIONS = [
  ['Telefon', 'Telephone', 'Alexander Graham Bell'], ['Ampul (yaygınlaştıran)', 'Light bulb (made practical)', 'Thomas Edison'], ['Matbaa', 'Printing press', 'Johannes Gutenberg'],
  ['Penisilin', 'Penicillin', 'Alexander Fleming'], ['Radyo', 'Radio', 'Guglielmo Marconi'], ['Motorlu uçak', 'Powered aeroplane', 'Wright Kardeşler'],
  ['Dinamit', 'Dynamite', 'Alfred Nobel'], ['Görelilik kuramı', 'Theory of relativity', 'Albert Einstein'], ['Hareket ve yerçekimi yasaları', 'Laws of motion and gravity', 'Isaac Newton'],
  ['Evrim kuramı', 'Theory of evolution', 'Charles Darwin'], ['Radyoaktivite araştırmaları', 'Research on radioactivity', 'Marie Curie'], ['Çiçek aşısı', 'Smallpox vaccine', 'Edward Jenner'],
  ['Pastörizasyon', 'Pasteurisation', 'Louis Pasteur'], ['Geliştirilmiş buhar makinesi', 'Improved steam engine', 'James Watt'], ['World Wide Web', 'World Wide Web', 'Tim Berners-Lee'],
  ['Alternatif akım sistemi', 'Alternating-current system', 'Nikola Tesla'], ['Periyodik tablo', 'Periodic table', 'Dmitri Mendeleyev'], ['Mors alfabesi', 'Morse code', 'Samuel Morse'],
  ['Dizel motor', 'Diesel engine', 'Rudolf Diesel'], ['Barometre', 'Barometer', 'Evangelista Torricelli'], ['X ışınları', 'X-rays', 'Wilhelm Röntgen'],
  ['Analitik makine', 'Analytical engine', 'Charles Babbage'], ['İlk bilgisayar programı', 'First computer program', 'Ada Lovelace'], ['Teleskopla Jüpiter\'in uyduları', 'Jupiter\'s moons by telescope', 'Galileo Galilei'],
  ['Güneş merkezli evren modeli', 'Sun-centred model of the universe', 'Nikolaus Kopernik'], ['Fonograf', 'Phonograph', 'Thomas Edison'], ['Sıfırın ve cebirin yaygınlaşması', 'Spreading algebra', 'Harezmi'],
  ['Su saati ve otomatlar', 'Water clocks and automata', 'El-Cezeri'], ['Kanun (tıp kitabı)', 'The Canon of Medicine', 'İbn-i Sina'], ['Cep telefonu (ilk el tipi)', 'First handheld mobile phone', 'Martin Cooper'],
];

// ——— Doğru mu yanlış mı: [ifade tr, ifade en, doğru mu]
export const FACTS_BI = [
  ['Ahtapotun sekiz kolu vardır.', 'An octopus has eight arms.', true], ['Örümcekler böcektir.', 'Spiders are insects.', false], ['Yarasalar memelidir.', 'Bats are mammals.', true],
  ['Penguenler Kuzey Kutbu\'nda yaşar.', 'Penguins live at the North Pole.', false], ['Yunuslar akciğerle nefes alır.', 'Dolphins breathe with lungs.', true], ['Domates bir sebze değil, meyvedir (botanik olarak).', 'Botanically, a tomato is a fruit.', true],
  ['Bir gün 24 saattir.', 'A day has 24 hours.', true], ['Bir saat 100 dakikadır.', 'An hour has 100 minutes.', false], ['Artık yılda şubat 29 gündür.', 'In a leap year February has 29 days.', true],
  ['Güneş batıdan doğar.', 'The Sun rises in the west.', false], ['Jüpiter Güneş Sistemi\'nin en büyük gezegenidir.', 'Jupiter is the largest planet in the Solar System.', true], ['Ay kendi ışığını üretir.', 'The Moon makes its own light.', false],
  ['Su 0 °C\'de donar.', 'Water freezes at 0 °C.', true], ['Ses boşlukta yayılmaz.', 'Sound cannot travel through a vacuum.', true], ['Elmas en yumuşak maddedir.', 'Diamond is the softest material.', false],
  ['Kanımızı kalp pompalar.', 'The heart pumps our blood.', true], ['İnsan beyni karındadır.', 'The human brain is in the stomach.', false], ['Bitkiler fotosentezle besin üretir.', 'Plants make food by photosynthesis.', true],
  ['Bir üçgenin dört kenarı vardır.', 'A triangle has four sides.', false], ['Karenin bütün kenarları eşittir.', 'All sides of a square are equal.', true], ['7 bir çift sayıdır.', '7 is an even number.', false],
  ['100\'ün yarısı 50\'dir.', 'Half of 100 is 50.', true], ['Bir düzine 12 tanedir.', 'A dozen is 12.', true], ['Bir kilogram 100 gramdır.', 'A kilogram is 100 grams.', false],
  ['Nil Afrika\'dadır.', 'The Nile is in Africa.', true], ['Avustralya bir kıtadır.', 'Australia is a continent.', true], ['Japonya bir ada ülkesidir.', 'Japan is an island country.', true],
  ['Sahra bir okyanustur.', 'The Sahara is an ocean.', false], ['Ankara Türkiye\'nin başkentidir.', 'Ankara is the capital of Turkey.', true], ['Paris İtalya\'nın başkentidir.', 'Paris is the capital of Italy.', false],
  ['Gökkuşağında yedi renk sayılır.', 'A rainbow is said to have seven colours.', true], ['Kırmızı ve sarı karışınca turuncu olur.', 'Red and yellow make orange.', true], ['Mavi ve sarı karışınca mor olur.', 'Blue and yellow make purple.', false],
  ['Arılar bal yapar.', 'Bees make honey.', true], ['İnekler yumurtlar.', 'Cows lay eggs.', false], ['Kelebekler tırtıldan dönüşür.', 'Butterflies develop from caterpillars.', true],
  ['Futbol takımında sahada 11 oyuncu olur.', 'A football team has 11 players on the pitch.', true], ['Basketbolda bir sayı atışı her zaman 5 puandır.', 'Every basket in basketball is worth 5 points.', false], ['Olimpiyatlar dört yılda bir yapılır.', 'The Olympics are held every four years.', true],
  ['Kaplumbağalar sürüngendir.', 'Turtles are reptiles.', true], ['Köpekbalıkları memelidir.', 'Sharks are mammals.', false], ['Kurbağalar amfibidir.', 'Frogs are amphibians.', true],
  ['Mars, Güneş\'e Dünya\'dan daha yakındır.', 'Mars is closer to the Sun than Earth.', false], ['Merkür Güneş\'e en yakın gezegendir.', 'Mercury is the planet closest to the Sun.', true], ['Dünya Güneş\'in çevresinde döner.', 'The Earth orbits the Sun.', true],
  ['Bir yılda dört mevsim vardır.', 'There are four seasons in a year.', true], ['Kış en sıcak mevsimdir (Kuzey Yarımküre).', 'Winter is the hottest season (Northern Hemisphere).', false], ['Gökyüzü gece mavidir çünkü Güneş vardır.', 'The sky is blue at night because of the Sun.', false],
  ['Çiğ yumurtayı döndürmek haşlanmışa göre zordur.', 'A raw egg is harder to spin than a boiled one.', true], ['Zeytinyağı suyun dibine çöker.', 'Olive oil sinks below water.', false], ['Mıknatıs demiri çeker.', 'A magnet attracts iron.', true],
  ['İnsan vücudunun çoğu sudur.', 'Most of the human body is water.', true], ['Diş fırçalamak günde bir kez yeterlidir, iki kez gereksizdir.', 'Brushing once a day is enough; twice is pointless.', false], ['Düzenli uyku sağlığa iyi gelir.', 'Regular sleep is good for your health.', true],
  ['Üç tane 5, 15 eder.', 'Three fives make 15.', true], ['9 × 9 = 81\'dir.', '9 × 9 = 81.', true], ['12 ÷ 4 = 4\'tür.', '12 ÷ 4 = 4.', false],
  ['Bir asırda 100 yıl vardır.', 'A century has 100 years.', true], ['Bir hafta 10 gündür.', 'A week has 10 days.', false], ['Ağustos yılın sekizinci ayıdır.', 'August is the eighth month of the year.', true],
];
// i18n-skip-end
