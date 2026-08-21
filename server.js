import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import fetch from 'node-fetch';
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

// ---------- FILE UPLOAD ----------

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    cb(ok ? null : new Error('Faqat rasm fayllar yuklash mumkin'), ok);
  }
});

app.use('/uploads', express.static(UPLOADS_DIR));

app.post('/api/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Rasm tanlanmagan' });
  }
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ success: true, urls });
});

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
    if (!initData || !initData.includes('hash=')) return null;

    const dataCheckArray = [];
    let receivedHash = '';

    const pairs = initData.split('&');
    for (const pair of pairs) {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) continue;
      const key = pair.slice(0, eqIdx);
      const value = decodeURIComponent(pair.slice(eqIdx + 1));
      if (key === 'hash') {
        receivedHash = value;
      } else {
        dataCheckArray.push(`${key}=${value}`);
      }
    }

    if (!receivedHash) return null;

    dataCheckArray.sort();
    const dataCheckString = dataCheckArray.join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== receivedHash) {
      console.error('Telegram hash mismatch');
      return null;
    }

    const userStr = new URLSearchParams(initData).get('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Telegram verify error:', e.message);
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
  const { title, city, address, price, rooms, type, description, phone, userId } = req.body || {};
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

// ---------- TELEGRAM VERIFICATION CODE ----------

const pendingCodes = new Map(); // phone -> { code, userId, expires }

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendTelegramMessage(chatId, text) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    return res.ok;
  } catch (e) {
    console.error('Telegram send error:', e.message);
    return false;
  }
}

app.post('/api/send-code', async (req, res) => {
  const { telegramId } = req.body || {};
  if (!telegramId) return res.status(400).json({ error: 'Telegram ID topilmadi' });

  const code = generateCode();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  pendingCodes.set(String(telegramId), { code, expires });

  const sent = await sendTelegramMessage(telegramId,
    `🔐 <b>Hamroh tasdiqlash kodi</b>\n\nKodingiz: <code>${code}</code>\n\nBu kod 5 daqiqa amal qiladi. Hech kimga bermang!`
  );

  if (sent) {
    res.json({ success: true, message: 'Kod Telegramga yuborildi' });
  } else {
    pendingCodes.delete(String(telegramId));
    res.status(400).json({ error: 'Kod yuborib bo\'lmadi. Botni start bosganingizga ishonchigingiz kom qiling.' });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { telegramId, code } = req.body || {};
  if (!telegramId || !code) return res.status(400).json({ error: 'Ma\'lumotlar yetarli emas' });

  const key = String(telegramId);
  const pending = pendingCodes.get(key);
  if (!pending) return res.status(400).json({ error: 'Kod topilmadi. Qaytadan yuboring.' });
  if (Date.now() > pending.expires) {
    pendingCodes.delete(key);
    return res.status(400).json({ error: 'Kod muddati tugadi. Qaytadan yuboring.' });
  }
  if (pending.code !== String(code).trim()) {
    return res.status(400).json({ error: 'Noto\'g\'ri kod' });
  }

  pendingCodes.delete(key);
  res.json({ success: true, verified: true });
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
    message: "Hamroh API ishlayapti. Web sayt uchun 'npm run build' qiling.",
    endpoints: ['/api/houses', '/api/login', '/api/register']
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server ishlayapti: http://localhost:${PORT}`);
});