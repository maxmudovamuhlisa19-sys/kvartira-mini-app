import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, tgLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleTgLogin = async () => {
    setError('');
    const result = await tgLogin();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }

    const result = await login(form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tizimga kirish</h1>
          <p className="text-gray-500 mt-2">Hisobingizga kiring</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parol</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Kirish
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">yoki</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleTgLogin}
              className="w-full bg-sky-100 text-sky-700 py-3.5 rounded-xl font-bold text-lg hover:bg-sky-200 transition-colors"
            >
              ⚡ Telegram orqali kirish
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-500">Hisobingiz yo'qmi? </span>
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
              Ro'yxatdan o'ting
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 font-medium mb-2">Demo uchun:</p>
            <p className="text-sm text-gray-600">Email: alisher@mail.com</p>
            <p className="text-sm text-gray-600">Parol: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
