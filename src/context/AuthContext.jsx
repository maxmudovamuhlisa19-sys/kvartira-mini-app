import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kvartira_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('kvartira_user', JSON.stringify(user));
  }, [user]);

  const getTelegramInitData = () => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg) return null;
      tg.ready();
      return tg.initData || null;
    } catch {
      return null;
    }
  };

  const tgLogin = async () => {
    const initData = getTelegramInitData();
    if (!initData) return { success: false, error: "Telegram orqali kirish faqat Telegram ichida ishlaydi" };
    try {
      const res = await fetch(`${API}/telegram-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Kirish amalga oshmadi" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi." };
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      tg.ready();
      tg.expand();
      if (!localStorage.getItem('kvartira_user')) {
        setTimeout(() => tgLogin(), 0);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Email yoki parol noto'g'ri" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi. Server ishlayotganini tekshiring." };
    }
  };

  const register = async (name, email, phone, password, role = 'boshqa') => {
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Ro'yxatdan o'tib bo'lmadi" };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi." };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, tgLogin, getTelegramInitData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}