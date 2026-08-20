import { Telegraf, Markup, session } from 'telegraf';
import {
  cities,
  getHouses,
  addUser,
  findUserByEmail,
  addHouse
} from './store.js';
import { APP_URL, BOT_TOKEN } from './config.js';

const TOKEN = BOT_TOKEN;
const bot = new Telegraf(TOKEN);

bot.use(session());

const ROLES = { talaba: 'Talaba', sotuvchi: 'Sotuvchi', boshqa: 'Oddiy foydalanuvchi' };

const mainMenu = (ctx) => {
  const user = ctx.session.user;
  return Markup.inlineKeyboard([
    [Markup.button.webApp('🏠 Kvartira.uz — ochish', APP_URL)],
    [
      Markup.button.callback('📋 E\'lonlar', 'list'),
      Markup.button.callback('🔍 Qidirish', 'search'),
    ],
    [
      Markup.button.callback('🎓 Talabalar', 'student'),
      user
        ? Markup.button.callback('👤 Profil', 'profile')
        : Markup.button.callback('🔑 Kirish', 'login'),
    ],
  ]);
};

const welcomeText = (ctx) => {
  const user = ctx.session.user;
  if (user) {
    return `Salom, ${user.name}! 👋\nKvartira.uz ga xush kelibsiz.`;
  }
  return `Kvartira.uz — uy topish oson! 🏠\n\nSotish va ijara e'lonlari, talabalar uchun maxsus takliflar.`;
};

bot.start(async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.user = null;
  ctx.session.stage = null;
  await ctx.reply(welcomeText(ctx), mainMenu(ctx));
});

bot.help(async (ctx) => {
  await ctx.reply(
    `📋 Bot buyruqlari:\n\n` +
    `/start - Asosiy menyu\n` +
    `/register - Ro'yxatdan o'tish\n` +
    `/login - Tizimga kirish\n` +
    `/houses - Barcha e'lonlar\n` +
    `/student - Talabalar uchun ijara\n` +
    `/logout - Chiqish\n` +
    `/help - Yordam`
  );
});

// ---------- REGISTRATION ----------

bot.command('register', async (ctx) => {
  ctx.session = ctx.session || {};
  if (ctx.session.user) {
    return ctx.reply('Siz allaqachon ro\'yxatdan o\'tgansiz. /logout buyrug\'i bilan chiqishingiz mumkin.');
  }
  ctx.session.stage = 'reg_name';
  await ctx.reply('Ro\'yxatdan o\'tish boshlanadi 📝\n\nIsmingizni kiriting:');
});

bot.command('login', async (ctx) => {
  ctx.session = ctx.session || {};
  if (ctx.session.user) {
    return ctx.reply('Siz allaqachon tizimga kirgansiz.');
  }
  ctx.session.stage = 'login_email';
  await ctx.reply('🔑 Tizimga kirish\n\nEmailingizni kiriting:');
});

bot.command('logout', async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.user = null;
  ctx.session.stage = null;
  await ctx.reply('Chiqdingiz. Xayr! 👋', mainMenu(ctx));
});

// ---------- REGISTRATION FLOW ----------

const askRole = async (ctx) => {
  ctx.session.stage = 'reg_role';
  await ctx.reply(
    'Kim sifatida ro\'yxatdan o\'tmoqchisiz?',
    Markup.inlineKeyboard([
      [Markup.button.callback('🎓 Talaba', 'role_talaba')],
      [Markup.button.callback('🏠 Sotuvchi', 'role_sotuvchi')],
      [Markup.button.callback('👤 Oddiy foydalanuvchi', 'role_boshqa')]
    ])
  );
};

const finishRegister = async (ctx) => {
  const reg = ctx.session.reg;
  const exists = findUserByEmail(reg.email);
  if (exists) {
    ctx.session.stage = null;
    return ctx.reply('Bu email allaqachon ro\'yxatdan o\'tgan. /login buyrug\'i bilan kiring.');
  }
  const newUser = {
    id: Date.now(),
    name: reg.name,
    phone: reg.phone,
    email: reg.email,
    password: reg.password,
    role: reg.role
  };
  addUser(newUser);
  ctx.session.user = newUser;
  ctx.session.stage = null;
  ctx.session.reg = null;
  await ctx.reply(
    `✅ Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!\n\n` +
    `Ism: ${newUser.name}\n` +
    `Telefon: ${newUser.phone}\n` +
    `Email: ${newUser.email}\n` +
    `Rol: ${ROLES[newUser.role]}\n\n` +
    `Endi asosiy menyudan foydalanishingiz mumkin:`,
    mainMenu(ctx)
  );
};

bot.action('role_talaba', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.reg) return;
  ctx.session.reg.role = 'talaba';
  await finishRegister(ctx);
});

bot.action('role_sotuvchi', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.reg) return;
  ctx.session.reg.role = 'sotuvchi';
  await finishRegister(ctx);
});

bot.action('role_boshqa', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.reg) return;
  ctx.session.reg.role = 'boshqa';
  await finishRegister(ctx);
});

// ---------- MAIN MENU ACTIONS ----------

bot.action('list', async (ctx) => {
  await ctx.answerCbQuery();
  const list = getHouses();
  if (list.length === 0) return ctx.reply('Hozircha e\'lonlar yo\'q.');
  const rows = list.slice(0, 10).map((h) =>
    Markup.button.callback(
      `${h.type === 'ijara' ? '🏠' : '🏢'} ${h.title.slice(0, 30)} - ${h.price.toLocaleString()} so'm`,
      `house_${h.id}`
    )
  );
  await ctx.reply(`📋 Barcha e'lonlar (${list.length} ta):`, Markup.inlineKeyboard([...rows.map(r => [r]), [{ text: '🔙 Orqaga', callback_data: 'menu' }]]));
});

bot.action('student', async (ctx) => {
  await ctx.answerCbQuery();
  const student = getHouses().filter(h => h.type === 'ijara' && h.studentFriendly);
  if (student.length === 0) return ctx.reply('Hozircha talabalar uchun e\'lonlar yo\'q.');
  const rows = student.map((h) =>
    Markup.button.callback(
      `🎓 ${h.title.slice(0, 30)} - ${h.price.toLocaleString()} so'm/oy`,
      `house_${h.id}`
    )
  );
  await ctx.reply(
    `🎓 Talabalar uchun maxsus ijara e'lonlari (${student.length} ta):\n\n` +
    `Bu e'lonlar talabalar uchun arzon narxlarda!`,
    Markup.inlineKeyboard([...rows.map(r => [r]), [{ text: '🔙 Orqaga', callback_data: 'menu' }]])
  );
});

bot.action('search', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.session.stage = 'search_city';
  await ctx.reply(
    '🔍 Qaysi shahar bo\'yicha qidirmoqchisiz?',
    Markup.inlineKeyboard([
      ...cities.slice(0, 5).map(c => [Markup.button.callback(c, `city_${c}`)]),
      [{ text: '🔙 Orqaga', callback_data: 'menu' }]
    ])
  );
});

bot.action('add', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.user) {
    ctx.session.stage = null;
    return ctx.reply('E\'lon qo\'shish uchun avval ro\'yxatdan o\'ting: /register', mainMenu(ctx));
  }
  ctx.session.stage = 'add_title';
  ctx.session.newHouse = {};
  await ctx.reply('➕ Yangi e\'lon qo\'shish\n\nKvartira nomini kiriting:');
});

bot.action('profile', async (ctx) => {
  await ctx.answerCbQuery();
  const user = ctx.session.user;
  if (!user) {
    return ctx.reply('Profilni ko\'rish uchun avval kiring: /login', mainMenu(ctx));
  }
  const myHouses = getHouses().filter(h => h.ownerId === user.id);
  await ctx.reply(
    `👤 Profilim\n\n` +
    `Ism: ${user.name}\n` +
    `Email: ${user.email}\n` +
    `Telefon: ${user.phone}\n` +
    `Rol: ${ROLES[user.role] || user.role}\n` +
    `Mening e'lonlarim: ${myHouses.length} ta`,
    Markup.inlineKeyboard([
      [Markup.button.callback('🔙 Orqaga', 'menu')]
    ])
  );
});

bot.action('logout', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.session.user = null;
  ctx.session.stage = null;
  await ctx.reply('Chiqdingiz. Xayr! 👋', mainMenu(ctx));
});

bot.action('login', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.session.stage = 'login_email';
  await ctx.reply('🔑 Tizimga kirish\n\nEmailingizni kiriting:');
});

bot.action('menu', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.session.stage = null;
  await ctx.reply('Asosiy menyu:', mainMenu(ctx));
});

// ---------- CITY SEARCH ----------

cities.forEach(city => {
  bot.action(`city_${city}`, async (ctx) => {
    await ctx.answerCbQuery();
    const result = getHouses().filter(h => h.city === city);
    if (result.length === 0) {
      return ctx.reply(`«${city}» bo'yicha e'lon topilmadi.`, Markup.inlineKeyboard([[{ text: '🔙 Orqaga', callback_data: 'menu' }]]));
    }
    const rows = result.slice(0, 10).map(h =>
      Markup.button.callback(`${h.type === 'ijara' ? '🏠' : '🏢'} ${h.title.slice(0, 30)} - ${h.price.toLocaleString()} so'm`, `house_${h.id}`)
    );
    await ctx.reply(`📍 «${city}» bo'yicha e'lonlar (${result.length} ta):`, Markup.inlineKeyboard([...rows.map(r => [r]), [{ text: '🔙 Orqaga', callback_data: 'menu' }]]));
  });
});

// ---------- HOUSE DETAIL ----------

bot.action(/house_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const id = Number(ctx.match[1]);
  const house = getHouses().find(h => h.id === id);
  if (!house) return ctx.reply('E\'lon topilmadi.');
  await ctx.reply(
    `🏠 ${house.title}\n\n` +
    `📍 Manzil: ${house.city}, ${house.address}\n` +
    `💰 Narx: ${house.price.toLocaleString()} ${house.type === 'ijara' ? "so'm/oy" : "so'm"}\n` +
    `🛏 Xonalar: ${house.rooms}\n` +
    `📐 Maydoni: ${house.area} m²\n` +
    `📝 Tavsif: ${house.description}\n` +
    (house.studentFriendly ? `🎓 Talabalar uchun qulay!\n` : '') +
    `📞 Telefon: ${house.phone}\n` +
    `👤 Egalik: ${house.owner}`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📞 Boglanish', `contact_${house.id}`)],
      [{ text: '🔙 Orqaga', callback_data: 'list' }]
    ])
  );
});

bot.action(/contact_(\d+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const id = Number(ctx.match[1]);
  const house = getHouses().find(h => h.id === id);
  if (!house) return ctx.reply('E\'lon topilmadi.');
  await ctx.reply(`📞 ${house.owner}: ${house.phone}`);
});

// ---------- ADD HOUSE FLOW ----------

const askHouseType = async (ctx) => {
  ctx.session.stage = 'add_type';
  await ctx.reply('E\'lon turini tanlang:', Markup.inlineKeyboard([
    [Markup.button.callback('🏠 Ijara', 'htype_ijara')],
    [Markup.button.callback('🏢 Sotish', 'htype_sotish')],
    [{ text: '❌ Bekor qilish', callback_data: 'cancel' }]
  ]));
};

bot.action('htype_ijara', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.newHouse) return;
  ctx.session.newHouse.type = 'ijara';
  ctx.session.stage = 'add_price';
  await ctx.reply('Narxni kiriting (so\'m):');
});

bot.action('htype_sotish', async (ctx) => {
  await ctx.answerCbQuery();
  if (!ctx.session.newHouse) return;
  ctx.session.newHouse.type = 'sotish';
  ctx.session.stage = 'add_price';
  await ctx.reply('Narxni kiriting (so\'m):');
});

bot.action('cancel', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.session.stage = null;
  ctx.session.newHouse = null;
  await ctx.reply('Bekor qilindi.', mainMenu(ctx));
});

// ---------- TEXT FLOW HANDLER ----------

bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  ctx.session = ctx.session || {};
  const stage = ctx.session.stage;

  // Registration
  if (stage === 'reg_name') {
    if (text.length < 2) return ctx.reply('Ism kamida 2 ta belgidan iborat bo\'lishi kerak. Qayta kiriting:');
    ctx.session.reg = { name: text };
    ctx.session.stage = 'reg_phone';
    return ctx.reply('Telefon raqamingizni kiriting (masalan: +998 90 123 45 67):');
  }

  if (stage === 'reg_phone') {
    if (!/^[+0-9\s-]{7,}$/.test(text)) return ctx.reply('Telefon raqam noto\'g\'ri. Qayta kiriting (masalan: +998 90 123 45 67):');
    ctx.session.reg.phone = text;
    ctx.session.stage = 'reg_email';
    return ctx.reply('Email manzilingizni kiriting:');
  }

  if (stage === 'reg_email') {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text)) return ctx.reply('Email noto\'g\'ri. Qayta kiriting (masalan: ism@mail.com):');
    ctx.session.reg.email = text;
    ctx.session.stage = 'reg_password';
    return ctx.reply('Parol kiriting (kamida 4 ta belgi):');
  }

  if (stage === 'reg_password') {
    if (text.length < 4) return ctx.reply('Parol kamida 4 ta belgidan iborat bo\'lishi kerak. Qayta kiriting:');
    ctx.session.reg.password = text;
    return askRole(ctx);
  }

  // Login
  if (stage === 'login_email') {
    const found = findUserByEmail(text);
    if (!found) {
      ctx.session.stage = null;
      return ctx.reply('Bu email tizimda topilmadi. Avval ro\'yxatdan o\'ting: /register', mainMenu(ctx));
    }
    ctx.session.loginCandidate = found;
    ctx.session.stage = 'login_password';
    return ctx.reply('Parolni kiriting:');
  }

  if (stage === 'login_password') {
    const found = ctx.session.loginCandidate;
    if (found.password !== text) {
      ctx.session.stage = null;
      ctx.session.loginCandidate = null;
      return ctx.reply('Parol noto\'g\'ri. Qayta urinib ko\'ring: /login', mainMenu(ctx));
    }
    ctx.session.user = found;
    ctx.session.stage = null;
    ctx.session.loginCandidate = null;
    return ctx.reply(`✅ Xush kelibsiz, ${found.name}! Siz muvaffaqiyatli kirdingiz.`, mainMenu(ctx));
  }

  // Add house flow
  if (stage === 'add_title') {
    ctx.session.newHouse.title = text;
    return ctx.reply('Shaharni tanlang:', Markup.inlineKeyboard([
      ...cities.slice(0, 5).map(c => [Markup.button.callback(c, `addcity_${c}`)]),
      [{ text: '❌ Bekor qilish', callback_data: 'cancel' }]
    ]));
  }

  if (stage === 'add_price') {
    const price = Number(text.replace(/[^\d]/g, ''));
    if (!price || price <= 0) return ctx.reply('Narx noto\'g\'ri. Faqat raqam kiriting:');
    ctx.session.newHouse.price = price;
    ctx.session.stage = 'add_rooms';
    return ctx.reply('Xonalar sonini kiriting:');
  }

  if (stage === 'add_rooms') {
    const rooms = Number(text);
    if (!rooms || rooms <= 0) return ctx.reply('Xonalar soni noto\'g\'ri. Raqam kiriting:');
    ctx.session.newHouse.rooms = rooms;
    ctx.session.stage = 'add_area';
    return ctx.reply('Maydonini kiriting (m²):');
  }

  if (stage === 'add_area') {
    const area = Number(text);
    if (!area || area <= 0) return ctx.reply('Maydon noto\'g\'ri. Raqam kiriting:');
    ctx.session.newHouse.area = area;
    ctx.session.stage = 'add_phone';
    return ctx.reply('Bog\'lanish uchun telefon raqamingizni kiriting:');
  }

  if (stage === 'add_phone') {
    if (!/^[+0-9\s-]{7,}$/.test(text)) return ctx.reply('Telefon noto\'g\'ri. Qayta kiriting:');
    const nh = ctx.session.newHouse;
    nh.phone = text;
    nh.id = Date.now();
    nh.owner = ctx.session.user.name;
    nh.ownerId = ctx.session.user.id;
    nh.description = `E'lon qo'shildi: ${nh.title}`;
    nh.studentFriendly = ctx.session.user.role === 'talaba';
    addHouse(nh);
    ctx.session.stage = null;
    ctx.session.newHouse = null;
    return ctx.reply(
      `✅ E'lon muvaffaqiyatli qo'shildi!\n\n` +
      `🏠 ${nh.title}\n` +
      `📍 ${nh.city}, ${nh.address || 'manzil ko\'rsatilmagan'}\n` +
      `💰 ${nh.price.toLocaleString()} so'm${nh.type === 'ijara' ? '/oy' : ''}\n` +
      `🛏 ${nh.rooms} xona, ${nh.area} m²\n\n` +
      `Endi boshqa bo'limlardan foydalanishingiz mumkin:`,
      mainMenu(ctx)
    );
  }

  // Search by city text fallback
  if (stage === 'search_city') {
    const found = cities.find(c => c.toLowerCase() === text.toLowerCase());
    if (found) {
      const result = getHouses().filter(h => h.city === found);
      if (result.length === 0) return ctx.reply(`«${found}» bo'yicha e'lon topilmadi.`);
      const rows = result.slice(0, 10).map(h =>
        Markup.button.callback(`${h.type === 'ijara' ? '🏠' : '🏢'} ${h.title.slice(0, 30)} - ${h.price.toLocaleString()} so'm`, `house_${h.id}`)
      );
      return ctx.reply(`📍 «${found}» bo'yicha e'lonlar:`, Markup.inlineKeyboard([...rows.map(r => [r]), [{ text: '🔙 Orqaga', callback_data: 'menu' }]]));
    }
    return ctx.reply('Bunday shahar topilmadi. Ro\'yxatdan tanlang:', Markup.inlineKeyboard([
      ...cities.slice(0, 5).map(c => [Markup.button.callback(c, `city_${c}`)]),
      [{ text: '🔙 Orqaga', callback_data: 'menu' }]
    ]));
  }

  // Add house city callback
  if (stage === 'add_title') {
    return ctx.reply('Shaharni tanlang:', Markup.inlineKeyboard([
      ...cities.slice(0, 5).map(c => [Markup.button.callback(c, `addcity_${c}`)]),
      [{ text: '❌ Bekor qilish', callback_data: 'cancel' }]
    ]));
  }

  // No active stage
  const lower = text.toLowerCase();
  if (lower === 'salom' || lower === 'hello' || lower === 'assalomu alaykum') {
    return ctx.reply('Assalomu alaykum! 👋', mainMenu(ctx));
  }
  if (lower === '🔑 kirish' || lower === 'kirish') {
    ctx.session.stage = 'login_email';
    return ctx.reply('🔑 Emailingizni kiriting:');
  }

  await ctx.reply('Tushunmadim 🤔. Asosiy menyudan foydalaning:', mainMenu(ctx));
});

// Add house city selections
cities.slice(0, 5).forEach(city => {
  bot.action(`addcity_${city}`, async (ctx) => {
    await ctx.answerCbQuery();
    if (!ctx.session.newHouse) return;
    ctx.session.newHouse.city = city;
    return askHouseType(ctx);
  });
});

// ---------- LAUNCH ----------

bot.catch((err, ctx) => {
  console.error(`Bot xatosi [${ctx.update?.update_id}]:`, err.message);
});

// Bot ishga tushgach menyu tugmasini Mini App ga yo'naltirish
async function setupMenuButton() {
  try {
    await bot.telegram.callApi('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '🏠 Kvartira',
        web_app: { url: APP_URL }
      }
    });
    console.log(`✅ Menu button sozlandi: ${APP_URL}`);
  } catch (e) {
    console.warn('Menu button sozlanmadi:', e.message);
  }
}

bot.launch().then(() => {
  console.log('✅ Kvartira Telegram bot ishga tushdi!');
  setupMenuButton();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));