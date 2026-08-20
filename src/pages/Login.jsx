import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { isTelegram, haptic } from '../telegram';

export default function Login() {
  const navigate = useNavigate();
  const { login, tgLogin, tgLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inTg = isTelegram();

  const handleTgLogin = async () => {
    haptic('medium');
    setError('');
    const result = await tgLogin();
    if (result.success) navigate('/', { replace: true });
    else setError(result.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    haptic('medium');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/', { replace: true });
    else setError(result.error);
  };

  return (
    <div className="px-4 pt-6 pb-6">
      {/* Telegram kirish — faqat Telegram ichida */}
      {inTg && (
        <div className="mb-5">
          <button
            type="button"
            onClick={handleTgLogin}
            disabled={tgLoading}
            className="w-full bg-[#0088cc] text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:opacity-90 transition-opacity disabled:opacity-60"
          >
            {tgLoading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-xl">✈️</span>
            )}
            {tgLoading ? 'Kirilmoqda...' : 'Telegram orqali kirish'}
          </button>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">yoki email bilan</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
      )}

      {/* Xato xabari */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              inputMode="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parol</label>
          <div className="relative">
            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 p-1">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          onClick={() => !loading && haptic('medium')}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors
            ${loading ? 'bg-gray-300 text-gray-500' : 'bg-amber-500 text-white active:bg-amber-600'}`}>
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>

      <div className="text-center mt-5">
        <span className="text-gray-500 text-sm">Hisobingiz yo'qmi? </span>
        <Link to="/register" className="text-amber-600 font-semibold text-sm" onClick={() => haptic('light')}>
          Ro'yxatdan o'ting
        </Link>
      </div>

      {/* Demo */}
      <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs font-semibold text-amber-700 mb-1.5">Demo kirish:</p>
        <button
          type="button"
          onClick={() => {
            haptic('light');
            setForm({ email: 'alisher@mail.com', password: '123456' });
          }}
          className="text-xs text-amber-700 font-medium bg-amber-100 px-3 py-1.5 rounded-lg active:bg-amber-200"
        >
          alisher@mail.com / 123456 — Bosing
        </button>
      </div>
    </div>
  );
}
