import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  getHouses,
  addHouse,
  updateHouse,
  deleteHouse,
  addUser,
  findUserByEmail,
  findUserById,
  getUsers
} from './src/store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------- AUTH API ----------

app.post('/api/register', (req, res) => {
  const { name, phone, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Ism, email va parol kiritilishi shart" });
  }
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" });
  }
  const user = addUser({
    id: Date.now(),
    name,
    phone: phone || '',
    email,
    password,
    role: role || 'boshqa'
  });
  const safe = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role };
  res.json({ success: true, user: safe });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = findUserByEmail(email || '');
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Email yoki parol noto'g'ri" });
  }
  const safe = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role };
  res.json({ success: true, user: safe });
});

// ---------- TELEGRAM MINI APP AUTH ----------

import { BOT_TOKEN } from './src/config.js';

function verifyTelegramInitData(initData) {
  try {
    const pairs = initData
      .split('&')
      .map(p => {
        const i = p.indexOf('=');
        return [p.slice(0, i), p.slice(i + 1)];
      })
      .filter(([k]) => k !== 'hash');
    if (!initData.includes('hash=')) return null;

    const hash = new URLSearchParams(initData).get('hash');
    const dataCheckString = pairs
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(crypto.createHash('sha256').update(BOT_TOKEN).digest())
      .digest();
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    if (calculatedHash !== hash) return null;
    const user = JSON.parse(decodeURIComponent(pairs.find(([k]) => k === 'user')?.[1] || 'null'));
    return user;
  } catch {
    return null;
  }
}

app.post('/api/telegram-auth', (req, res) => {
  const { initData } = req.body || {};
  if (!initData) return res.status(400).json({ error: 'initData topilmadi' });

  const tgUser = verifyTelegramInitData(initData);
  if (!tgUser) return res.status(401).json({ error: "Telegram ma'lumotlarini tekshirib bo'lmadi" });

  const tgId = String(tgUser.id);
  let user = getUsers().find(u => u.telegramId === tgId);

  if (!user) {
    const tgName = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
    user = addUser({
      id: Date.now(),
      telegramId: tgId,
      name: tgName || tgUser.username || 'Telegram foydalanuvchi',
      email: `tg_${tgId}@telegram.local`,
      phone: '',
      password: 'tg_' + tgId,
      role: 'boshqa'
    });
  }

  const safe = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role };
  res.json({ success: true, user: safe });
});

// ---------- HOUSES API ----------

app.get('/api/houses', (req, res) => {
  res.json(getHouses());
});

app.post('/api/houses', (req, res) => {
  const { title, city, address, price, rooms, area, type, description, phone, userId } = req.body || {};
  if (!title || !city || !price || !rooms || !type) {
    return res.status(400).json({ error: "Kerakli maydonlar to'ldirilmagan" });
  }
  const house = addHouse({
    id: Date.now(),
    title: String(title).slice(0, 80),
    city,
    address: address || '',
    price: Number(price) || 0,
    rooms: Number(rooms) || 1,
    area: Number(area) || 0,
    type,
    description: description || '',
    phone: phone || '',
    ownerId: userId,
    owner: userId ? (findUserById(userId)?.name || 'Foydalanuvchi') : 'Foydalanuvchi'
  });
  res.status(201).json({ success: true, house });
});

app.put('/api/houses/:id', (req, res) => {
  const id = Number(req.params.id);
  updateHouse(id, req.body || {});
  res.json({ success: true });
});

app.delete('/api/houses/:id', (req, res) => {
  deleteHouse(Number(req.params.id));
  res.json({ success: true });
});

// ---------- USERS (admin) ----------

app.get('/api/users', (req, res) => {
  res.json(getUsers().map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role })));
});

// ---------- STATIC SITE ----------

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.json({
    message: "Kvartira API ishlayapti. Web sayt uchun 'npm run build' qiling.",
    endpoints: ['/api/houses', '/api/login', '/api/register']
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server ishlayapti: http://localhost:${PORT}`);
});