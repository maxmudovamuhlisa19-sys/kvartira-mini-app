import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { haptic } from '../telegram';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    if (form.password.length < 6) {
      setError("Parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Parollar mos kelmaydi");
      return;
    }

    setLoading(true);
    haptic('medium');
    const result = await register(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (result.success) navigate('/', { replace: true });
    else setError(result.error);
  };

  const inp = 'w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none';

  const fields = [
    { key: 'name', type: 'text', label: "To'liq ism", icon: User, placeholder: 'Ismingiz', inputMode: 'text' },
    { key: 'email', type: 'email', label: 'Email', icon: Mail, placeholder: 'email@example.com', inputMode: 'email' },
    { key: 'phone', type: 'tel', label: 'Telefon', icon: Phone, placeholder: '+998 90 123 45 67', inputMode: 'tel' },
  ];

  return (
    <div className="px-4 pt-6 pb-6">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, type, label, icon: Icon, placeholder, inputMode }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            <div className="relative">
              <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={type}
                inputMode={inputMode}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className={inp}
              />
            </div>
          </div>
        ))}

        {/* Parol */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parol</label>
          <div className="relative">
            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Kamida 6 ta belgi"
              className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 p-1">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Parol tasdiqlash */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Parolni tasdiqlash</label>
          <div className="relative">
            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Parolni qaytadan kiriting"
              className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <button type="submit" disabled={loading}
          onClick={() => !loading && haptic('medium')}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors
            ${loading ? 'bg-gray-300 text-gray-500' : 'bg-amber-500 text-white active:bg-amber-600'}`}>
          {loading ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
        </button>
      </form>

      <div className="text-center mt-5">
        <span className="text-gray-500 text-sm">Hisobingiz bormi? </span>
        <Link to="/login" className="text-amber-600 font-semibold text-sm" onClick={() => haptic('light')}>
          Kiring
        </Link>
      </div>
    </div>
  );
}
