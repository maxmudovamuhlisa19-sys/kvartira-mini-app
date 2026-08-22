import { createContext, useContext, useState, useEffect } from 'react';
import { tg, isTelegram } from '../telegram';

const AuthContext = createContext(null);
const API = '/api';
const STORAGE_KEY = 'kvartira_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [tgLoading, setTgLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Telegram avtomatik kirish
  useEffect(() => {
    if (!isTelegram()) return;
    if (user) return;

    const tryAutoLogin = async () => {
      const app = tg();
      if (!app) return;

      try {
        app.ready();
        app.expand();
      } catch {}

      const initData = app?.initData;
      if (!initData) return;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API}/telegram-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch {}
    };

    tryAutoLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tgLogin = async () => {
    const app = tg();
    if (!app) {
      return { success: false, error: 'Telegram mavjud emas' };
    }

    setTgLoading(true);
    try {
      app.ready();

      const initData = app.initData;
      if (!initData) {
        setTgLoading(false);
        return { success: false, error: 'Telegram ma\'lumotlari topilmadi. Qayta oching.' };
      }

      const res = await fetch(`${API}/telegram-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Kirish amalga oshmadi' };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi" };
    } finally {
      setTgLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Email yoki parol noto'g'ri" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi" };
    }
  };

  const register = async (name, email, phone, password, role = 'boshqa') => {
    let telegramId = '';
    try {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        telegramId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
      }
    } catch {}
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role, telegramId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Ro'yxatdan o'tib bo'lmadi" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi" };
    }
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{
      user, tgLoading,
      login, register, logout, updateProfile,
      tgLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { // eslint-disable-line react-refresh/only-export-components
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
