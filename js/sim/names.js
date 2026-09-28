import { lang } from '../core/i18n.js';
const TR_NAMES = {
  k: ['Elif', 'Zeynep', 'Defne', 'Ecrin', 'Azra', 'Nehir', 'Asel', 'Eylül', 'Duru', 'Ela', 'Mira', 'Lina', 'Ada', 'Selin', 'Yağmur', 'Ceren', 'Buse', 'İpek', 'Melis', 'Aylin', 'Nisa', 'Zehra', 'Hira', 'Beren'],
  e: ['Yusuf', 'Eymen', 'Ömer', 'Mustafa', 'Aras', 'Kerem', 'Emir', 'Ali', 'Mehmet', 'Alparslan', 'Göktuğ', 'Deniz', 'Efe', 'Can', 'Burak', 'Arda', 'Kaan', 'Berk', 'Mert', 'Tuna', 'Umut', 'Barış', 'Oğuz', 'Selim'],
};
const TR_SURNAMES = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Erdem', 'Güneş', 'Aksoy', 'Tekin', 'Bulut', 'Korkmaz', 'Uçar'];
const TR_CITIES = {
  koy: ['Konya\'nın bir köyü', 'Rize\'nin bir köyü', 'Kars\'ın bir köyü', 'Aydın\'ın bir köyü', 'Sivas\'ın bir köyü', 'Hatay\'ın bir köyü'],
  kasaba: ['Safranbolu', 'Bafra', 'Akşehir', 'Ödemiş', 'Ereğli', 'Turhal', 'Kozan', 'Bozüyük'],
  sehir: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Gaziantep', 'Eskişehir', 'Kayseri', 'Samsun'],
};
const TR_FRIENDS = ['Cem', 'Ayşe', 'Oğuz', 'Merve', 'Tolga', 'Gizem', 'Serkan', 'Derya', 'Onur', 'Pınar', 'Kübra', 'Emre', 'Hande', 'Sinan'];

// Uluslararası (İngilizce vb.) isimler ve kurgusal şehirler — belirli bir ülkeye bağlı değil
const EN_NAMES = {
  k: ['Emma', 'Olivia', 'Sofia', 'Mia', 'Amelia', 'Ava', 'Lina', 'Nora', 'Maya', 'Zoe', 'Leila', 'Hana', 'Clara', 'Isla', 'Aria', 'Elena', 'Yara', 'Chloe', 'Lucia', 'Ines', 'Naomi', 'Grace', 'Ruby', 'Alice'],
  e: ['Liam', 'Noah', 'Leo', 'Lucas', 'Adam', 'Omar', 'Mateo', 'Ethan', 'Oliver', 'Daniel', 'Samuel', 'Jonah', 'Kai', 'Elias', 'Hugo', 'Arjun', 'Theo', 'Felix', 'Ryan', 'Max', 'Ali', 'Marco', 'Jack', 'David'],
};
const EN_SURNAMES = ['Carter', 'Silva', 'Novak', 'Rossi', 'Kim', 'Weber', 'Moreau', 'Hassan', 'Kowalski', 'Tanaka', 'Garcia', 'Nielsen', 'Ivanov', 'Patel', 'Brooks', 'Costa', 'Meyer', 'Stone', 'Rivera', 'Walker', 'Fischer', 'Lindqvist', 'Okafor', 'Duarte'];
const EN_CITIES = {
  koy: ['a village near Oakridge', 'a village in the Green Valley', 'a hill village by Stonebrook', 'a farming village near Millbrook', 'a village by Lake Serin', 'a coastal village near Bayfield'],
  kasaba: ['Maplewood', 'Northfield', 'Riverbend', 'Ashford', 'Pinecrest', 'Harborview', 'Elmstead', 'Brookhaven'],
  sehir: ['Port Aurora', 'Silverbay', 'New Meridian', 'Kingsbridge', 'Lakeside City', 'Westmere', 'Highgate', 'Eastport', 'Summerton', 'Grand Harbor'],
};
const EN_FRIENDS = ['Sam', 'Mila', 'Jonas', 'Lea', 'Tariq', 'Nina', 'Oscar', 'Julia', 'Kofi', 'Sara', 'Ben', 'Aisha', 'Tom', 'Rosa'];

const tr = lang === 'tr';
export const NAMES = tr ? TR_NAMES : EN_NAMES;
export const SURNAMES = tr ? TR_SURNAMES : EN_SURNAMES;
export const CITIES = tr ? TR_CITIES : EN_CITIES;
export const FRIEND_NAMES = tr ? TR_FRIENDS : EN_FRIENDS;
