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

export const cities = ["Navoiy"];

export const seedHouses = [
  {
    id: 1,
    title: "Markazdagi zamonaviy kvartira",
    city: "Navoiy",
    address: "Amir Temur ko'chasi 15",
    price: 45000000,
    rooms: 3,
    area: 85,
    floor: 3,
    totalFloors: 5,
    type: "sotish",
    status: "yangi",
    description: "Navoiy shahar markazida joylashgan, yangidan ta'mirlangan kvartira. Barcha qulayliklar mavjud.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    features: ["Balkon", "Internet", "Mebel"],
    phone: "+998 90 123 45 67",
    owner: "Alisher Karimov",
    dateAdded: "2026-06-01",
    userId: 1
  },
  {
    id: 2,
    title: "Oilaviy kvartira - Yangi mahalla",
    city: "Navoiy",
    address: "Yangi mahalla ko'chasi 42",
    price: 32000000,
    rooms: 2,
    area: 58,
    floor: 2,
    totalFloors: 4,
    type: "sotish",
    status: "foydalanilgan",
    description: "Yangi mahallada shinam kvartira. Bog'cha va maktabga yaqin.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800"
    ],
    features: ["Internet", "Mebel"],
    phone: "+998 91 234 56 78",
    owner: "Nodir Raximov",
    dateAdded: "2026-05-28",
    userId: 2
  },
  {
    id: 3,
    title: "Ijara uchun kvartira",
    city: "Navoiy",
    address: "Mustaqillik ko'chasi 8",
    price: 2500000,
    rooms: 2,
    area: 52,
    floor: 1,
    totalFloors: 3,
    type: "ijara",
    status: "foydalanilgan",
    description: "Oylik ijara uchun qulay kvartira. Markazga yaqin.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
    ],
    features: ["Internet", "Konditsioner"],
    phone: "+998 94 456 78 90",
    owner: "Jamshid Alimov",
    dateAdded: "2026-06-08",
    userId: 4
  },
  {
    id: 4,
    title: "Katta kvartira - Buyuk Ipak Yo'li",
    city: "Navoiy",
    address: "Buyuk Ipak Yo'li ko'chasi 25",
    price: 55000000,
    rooms: 4,
    area: 110,
    floor: 4,
    totalFloors: 5,
    type: "sotish",
    status: "yangi",
    description: "Katta kvartira, yuqori qavat. Panoramik ko'rinish, zamonaviy ta'mir.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    features: ["Lift", "Parkovka", "Balkon", "Internet"],
    phone: "+998 93 345 67 89",
    owner: "Sardor Mirzayev",
    dateAdded: "2026-06-05",
    userId: 3
  },
  {
    id: 5,
    title: "Ijara - talabalar uchun",
    city: "Navoiy",
    address: "Talabalar shaharchasi 10",
    price: 1800000,
    rooms: 1,
    area: 35,
    floor: 1,
    totalFloors: 2,
    type: "ijara",
    status: "yangi",
    description: "Talabalar uchun qulay kvartira. Universitetga yaqin. Mebel bor.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    features: ["Internet", "Mebel"],
    phone: "+998 95 567 89 01",
    owner: "Baxtiyor Nazarov",
    dateAdded: "2026-06-10",
    userId: 5
  },
  {
    id: 6,
    title: "Hovli uy - Navoiy shahri",
    city: "Navoiy",
    address: "Ko'kcha mahalla ko'chasi 18",
    price: 85000000,
    rooms: 4,
    area: 180,
    floor: 1,
    totalFloors: 1,
    type: "sotish",
    status: "foydalanilgan",
    description: "Hovli uy. Katta hovli, garaj, issiqxona.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    features: ["Garaj", "Hovli", "Issiqxona"],
    phone: "+998 97 678 90 12",
    owner: "Otabek Shodiyev",
    dateAdded: "2026-05-25",
    userId: 6
  }
];

export const seedUsers = [
  { id: 1, name: "Alisher Karimov", email: "alisher@mail.com", phone: "+998 90 123 45 67", password: "123456", role: "sotuvchi" },
  { id: 2, name: "Nodir Raximov", email: "nodir@mail.com", phone: "+998 91 234 56 78", password: "123456", role: "sotuvchi" }
];

let houses = seedHouses;
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
