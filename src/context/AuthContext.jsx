import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const tgLoginAttempted = useRef(false);

  // Foydalanuvchini localStorage ga saqlash
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Telegram Mini App ichida avtomatik login
  useEffect(() => {
    if (!isTelegram()) return;
    if (user) return;
    if (tgLoginAttempted.current) return;
    tgLoginAttempted.current = true;

    const app = tg();
    if (!app?.initData) return;
    app.ready();
    app.expand();

    fetch(`${API}/telegram-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: app.initData }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.user);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Qo'lda Telegram orqali kirish (Login sahifasidan) */
  const tgLogin = async () => {
    const app = tg();
    if (!app?.initData) {
      return { success: false, error: 'Telegram ichida ochilmagan' };
    }
    setTgLoading(true);
    try {
      const res = await fetch(`${API}/telegram-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: app.initData }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
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

  const getTelegramInitData = () => tg()?.initData ?? null;

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setUser(data.user); return { success: true }; }
      return { success: false, error: data.error || "Email yoki parol noto'g'ri" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi" };
    }
  };

  const register = async (name, email, phone, password, role = 'boshqa') => {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setUser(data.user); return { success: true }; }
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
      tgLogin, getTelegramInitData,
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
