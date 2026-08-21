import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, Send } from 'lucide-react';
import { haptic, isTelegram, tgAlert } from '../telegram';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1); // 1 = form, 2 = verify code
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verification state
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [codeSent, setCodeSent] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const inTg = isTelegram();

  // Get Telegram user ID from WebApp
  const getTgUserId = () => {
    try {
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return String(window.Telegram.WebApp.initDataUnsafe.user.id);
      }
    } catch {}
    return null;
  };

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendCode = async () => {
    const tgId = getTgUserId();
    if (!tgId) {
      setError("Telegram aniqlanmadi. Iltimos, Telegram orqali kirib qayta urinib ko'ring.");
      return;
    }
    setCodeLoading(true);
    setError('');
    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: tgId }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setStep(2);
        setResendTimer(60);
        haptic('success');
        setTimeout(() => codeRefs[0].current?.focus(), 100);
      } else {
        setError(data.error || "Kod yuborib bo'lmadi");
      }
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setCodeLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      codeRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs[index - 1].current?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newCode = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
      setCode(newCode);
      const nextEmpty = newCode.findIndex(c => !c);
      codeRefs[nextEmpty >= 0 ? nextEmpty : 5].current?.focus();
      if (pasted.length === 6) verifyCode(pasted);
    }
  };

  const verifyCode = async (codeStr) => {
    const tgId = getTgUserId();
    if (!tgId) return;

    setVerifying(true);
    setError('');
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: tgId, code: codeStr }),
      });
      const data = await res.json();
      if (data.verified) {
        haptic('success');
        doRegister();
      } else {
        setError(data.error || "Kod noto'g'ri");
        setCode(['', '', '', '', '', '']);
        codeRefs[0].current?.focus();
      }
    } catch {
      setError("Server bilan bog'lanib bo'lmadi");
    } finally {
      setVerifying(false);
    }
  };

  const doRegister = async () => {
    setLoading(true);
    haptic('medium');
    const result = await register(form.name, form.email, form.phone, form.password);
    setLoading(false);
    if (result.success) navigate('/', { replace: true });
    else setError(result.error);
  };

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

    // If in Telegram, go to verification step
    if (inTg) {
      setStep(2);
      handleSendCode();
    } else {
      // Outside Telegram, register directly
      setLoading(true);
      haptic('medium');
      const result = await register(form.name, form.email, form.phone, form.password);
      setLoading(false);
      if (result.success) navigate('/', { replace: true });
      else setError(result.error);
    }
  };

  const inp = 'w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none';

  const fields = [
    { key: 'name', type: 'text', label: "To'liq ism", icon: User, placeholder: 'Ismingiz', inputMode: 'text' },
    { key: 'email', type: 'email', label: 'Email', icon: Mail, placeholder: 'email@example.com', inputMode: 'email' },
    { key: 'phone', type: 'tel', label: 'Telefon', icon: Phone, placeholder: '+998 90 123 45 67', inputMode: 'tel' },
  ];

  // Step 2: Verification code
  if (step === 2) {
    return (
      <div className="px-4 pt-6 pb-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={28} className="text-amber-600" />
          </div>
          <h2 className="text-base font-bold text-gray-900">Tasdiqlash kodi</h2>
          <p className="text-xs text-gray-500 mt-1">
            Telegramga yuborilgan 6 xonali kodni kiriting
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Code inputs */}
        <div className="flex justify-center gap-2 mb-4" onPaste={handleCodePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={codeRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(i, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(i, e)}
              className={`w-11 h-12 text-center text-lg font-bold bg-gray-50 border-2 rounded-xl outline-none transition-all
                focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                ${digit ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
            />
          ))}
        </div>

        {verifying && (
          <div className="text-center text-xs text-amber-600 font-medium mb-3">
            Tekshirilmoqda...
          </div>
        )}

        <button
          onClick={() => { setCode(['', '', '', '', '', '']); codeRefs[0].current?.focus(); }}
          disabled={resendTimer > 0 || codeLoading}
          className="w-full text-center text-xs text-amber-600 font-medium py-2 disabled:text-gray-400"
        >
          {resendTimer > 0
            ? `Qayta yuborish: ${resendTimer}s`
            : codeSent
            ? 'Kodni qayta yuborish'
            : 'Kod olish'
          }
        </button>

        <button onClick={() => { setStep(1); setError(''); setCode(['', '', '', '', '', '']); }}
          className="w-full text-center text-xs text-gray-500 font-medium py-2 mt-2">
          ← Orqaga qaytish
        </button>
      </div>
    );
  }

  // Step 1: Registration form
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

        {inTg && (
          <p className="text-[10px] text-gray-400 text-center">
            Ro'yxatdan o'tish uchun Telegram kod tasdiqlash kerak
          </p>
        )}

        <button type="submit" disabled={loading || codeLoading}
          onClick={() => !loading && !codeLoading && haptic('medium')}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2
            ${loading || codeLoading ? 'bg-gray-300 text-gray-500' : 'bg-amber-500 text-white active:bg-amber-600'}`}>
          {loading ? (
            "Yaratilmoqda..."
          ) : codeLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Kod yuborilmoqda...
            </span>
          ) : inTg ? (
            <>
              <Send size={16} /> Kod olish va ro'yxatdan o'tish
            </>
          ) : (
            "Ro'yxatdan o'tish"
          )}
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
