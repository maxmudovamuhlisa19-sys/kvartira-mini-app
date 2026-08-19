import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'bot_users.json');
const HOUSES_FILE = path.join(DATA_DIR, 'bot_houses.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const readJSON = (file, fallback) => {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Read error:', file, e.message);
  }
  return fallback;
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

export const cities = [
  "Toshkent", "Samarqand", "Buxoro", "Qarshi", "Namangan",
  "Andijon", "Farg'ona", "Nukus", "Marg'ilon", "Termiz"
];

export const seedHouses = [
  {
    id: 1,
    title: "Shahar markazidagi zamonaviy kvartira",
    city: "Toshkent",
    address: "Amir Temur ko'chasi 15",
    price: 85000,
    rooms: 3,
    type: "sotish",
    area: 95,
    description: "Shahar markazida joylashgan, yangidan ta'mirlangan kvartira. Metroga yaqin.",
    phone: "+998 90 123 45 67",
    owner: "Alisher Karimov"
  },
  {
    id: 2,
    title: "Olmazor tumanida oilaviy kvartira",
    city: "Toshkent",
    address: "Olmazor ko'chasi 42",
    price: 62000,
    rooms: 2,
    type: "sotish",
    area: 68,
    description: "Maktab va bog'chaga yaqin, yaxshi holatda ta'mirlangan.",
    phone: "+998 91 234 56 78",
    owner: "Nodir Raximov"
  },
  {
    id: 3,
    title: "Talabalar uchun arzon ijara",
    city: "Toshkent",
    address: "Universitet yonida, Yakkasaroy",
    price: 300,
    rooms: 1,
    type: "ijara",
    area: 30,
    studentFriendly: true,
    description: "Universitetga yaqin, 1 xonali kvartira. Talabalar uchun maxsus chegirma. Oylik to'lov.",
    phone: "+998 93 345 67 89",
    owner: "Sardor Mirzayev"
  },
  {
    id: 4,
    title: "Samarqand markazida ijara",
    city: "Samarqand",
    address: "Registon ko'chasi 12",
    price: 450,
    rooms: 2,
    type: "ijara",
    area: 55,
    studentFriendly: true,
    description: "Registonga yaqin, ijara uchun qulay kvartira. Oylik to'lov.",
    phone: "+998 94 456 78 90",
    owner: "Jamshid Alimov"
  },
  {
    id: 5,
    title: "Yangi qurilish - Buxoro",
    city: "Buxoro",
    address: "Al-Buxoriy ko'chasi 25",
    price: 45000,
    rooms: 3,
    type: "sotish",
    area: 82,
    description: "Yangi qurilayotgan uyda kvartira. Bron qilish mumkin.",
    phone: "+998 95 567 89 01",
    owner: "Baxtiyor Nazarov"
  },
  {
    id: 6,
    title: "Qarshi hovlida uy",
    city: "Qarshi",
    address: "Navoiy ko'chasi 18",
    price: 35000,
    rooms: 4,
    type: "sotish",
    area: 150,
    description: "Katta hovli, garaj, issiqxona. Shahardan uzoq emas.",
    phone: "+998 97 678 90 12",
    owner: "Otabek Shodiyev"
  },
  {
    id: 7,
    title: "Talabalar yotoqxonasi o'rniga",
    city: "Toshkent",
    address: "Beruniy metro yaqinida",
    price: 250,
    rooms: 1,
    type: "ijara",
    area: 25,
    studentFriendly: true,
    description: "Talabalar uchun mo'ljallangan shinam xona. Suv, internet, mebel hammasi bor.",
    phone: "+998 98 765 43 21",
    owner: "Dilnoza Yusupova"
  },
  {
    id: 8,
    title: "Namangan markazida ijara",
    city: "Namangan",
    address: "Boburshoh ko'chasi 3",
    price: 400,
    rooms: 2,
    type: "ijara",
    area: 48,
    description: "Shahar markazida, bozorga yaqin. Oilaviy ijara.",
    phone: "+998 99 111 22 33",
    owner: "Aziz Toshmatov"
  }
];

export const seedUsers = [
  { id: 1, name: "Alisher Karimov", email: "alisher@mail.com", phone: "+998 90 123 45 67", password: "123456", role: "sotuvchi" },
  { id: 2, name: "Nodir Raximov", email: "nodir@mail.com", phone: "+998 91 234 56 78", password: "123456", role: "sotuvchi" }
];

let houses = readJSON(HOUSES_FILE, seedHouses);
let users = readJSON(USERS_FILE, seedUsers);

export function getHouses() {
  return houses;
}

export function getUsers() {
  return users;
}

export function saveHouses() {
  writeJSON(HOUSES_FILE, houses);
}

export function saveUsers() {
  writeJSON(USERS_FILE, users);
}

export function addUser(user) {
  users.push(user);
  saveUsers();
  return user;
}

export function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return users.find(u => u.id === Number(id));
}

export function addHouse(house) {
  houses = [house, ...houses];
  saveHouses();
  return house;
}

export function updateHouse(id, updates) {
  houses = houses.map(h => h.id === id ? { ...h, ...updates } : h);
  saveHouses();
}

export function deleteHouse(id) {
  houses = houses.filter(h => h.id !== id);
  saveHouses();
}

export function resetStore() {
  houses = seedHouses;
  users = seedUsers;
  saveHouses();
  saveUsers();
}