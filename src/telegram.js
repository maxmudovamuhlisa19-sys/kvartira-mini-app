/**
 * Telegram WebApp utility — Mini App ichida ishlash uchun
 */

/** Telegram WebApp ob'ektini qaytaradi (yoki null) */
export const tg = () => window?.Telegram?.WebApp ?? null;

/** Mini App ichida ishlayotganmizmi? */
export const isTelegram = () => Boolean(window?.Telegram?.WebApp?.initData);

/** Ilova tayyor deb belgilash va to'liq ochish */
export function initTelegram() {
  const app = tg();
  if (!app) return;
  app.ready();
  app.expand();
  // Telegram ranglarini CSS o'zgaruvchilariga o'tkazish
  applyTelegramTheme(app);
}

/** Telegram tema ranglarini CSS o'zgaruvchilari sifatida qo'llash */
export function applyTelegramTheme(app) {
  if (!app?.themeParams) return;
  const p = app.themeParams;
  const root = document.documentElement;
  if (p.bg_color)          root.style.setProperty('--tg-bg',        p.bg_color);
  if (p.text_color)        root.style.setProperty('--tg-text',      p.text_color);
  if (p.hint_color)        root.style.setProperty('--tg-hint',      p.hint_color);
  if (p.link_color)        root.style.setProperty('--tg-link',      p.link_color);
  if (p.button_color)      root.style.setProperty('--tg-btn',       p.button_color);
  if (p.button_text_color) root.style.setProperty('--tg-btn-text',  p.button_text_color);
  if (p.secondary_bg_color) root.style.setProperty('--tg-secondary-bg', p.secondary_bg_color);
}

/** Telegram BackButton — sahifada "Orqaga" tugmasi */
export function showBackButton(onBack) {
  const app = tg();
  if (!app?.BackButton) return;
  app.BackButton.show();
  app.BackButton.onClick(onBack);
  return () => {
    app.BackButton.offClick(onBack);
    app.BackButton.hide();
  };
}

/** Telegram MainButton — pastki yashil tugma */
export function setMainButton({ text, onClick, color = '#2563eb', textColor = '#ffffff' }) {
  const app = tg();
  if (!app?.MainButton) return () => {};
  app.MainButton.setText(text);
  app.MainButton.color = color;
  app.MainButton.textColor = textColor;
  app.MainButton.show();
  app.MainButton.onClick(onClick);
  return () => {
    app.MainButton.offClick(onClick);
    app.MainButton.hide();
  };
}

/** Telegram haptic feedback */
export function haptic(type = 'light') {
  tg()?.HapticFeedback?.impactOccurred(type);
}

/** Telegram native alert */
export function tgAlert(message) {
  const app = tg();
  if (app?.showAlert) {
    app.showAlert(message);
  } else {
    alert(message);
  }
}

/** Telegram native confirm */
export function tgConfirm(message, callback) {
  const app = tg();
  if (app?.showConfirm) {
    app.showConfirm(message, callback);
  } else {
    callback(window.confirm(message));
  }
}

/** Foydalanuvchi ma'lumotlarini Telegram WebApp dan olish */
export function getTelegramUser() {
  const app = tg();
  if (!app?.initDataUnsafe?.user) return null;
  return app.initDataUnsafe.user;
}

/** Sahifaga kirish animatsiyasi uchun viewport balandligi */
export function getViewportHeight() {
  const app = tg();
  return app?.viewportStableHeight || window.innerHeight;
}
