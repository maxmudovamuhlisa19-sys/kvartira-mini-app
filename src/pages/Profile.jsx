import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHouses } from '../context/HouseContext';
import { User, Phone, Edit, Save, Home, Eye, Trash2, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { haptic, isTelegram, tgConfirm, getTelegramUser } from '../telegram';
import { BOT_TOKEN } from '../config';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { houses, deleteHouse } = useHouses();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '' });
  const inTg = isTelegram();
  const tgUser = getTelegramUser();
  const tgId = tgUser?.id || window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [verifyStep, setVerifyStep] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRef0 = useRef(null);
  const codeRef1 = useRef(null);
  const codeRef2 = useRef(null);
  const codeRef3 = useRef(null);
  const codeRef4 = useRef(null);
  const codeRef5 = useRef(null);
  const codeRefs = [codeRef0, codeRef1, codeRef2, codeRef3, codeRef4, codeRef5];
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);
  const pendingCode = useRef(null);
  const pendingExp = useRef(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const isTgUser = user.email?.includes('@telegram.local');
  const displayName = user.name || tgUser?.first_name || 'Foydalanuvchi';
  const displayUsername = tgUser?.username ? `@${tgUser.username}` : null;
  const isPhoneVerified = user.phoneVerified || verifySuccess;

  const myHouses = houses.filter(h => h.userId === user.id || h.ownerId === user.id);

  const handleSave = () => {
    haptic('medium');
    updateProfile({ name: form.name });
    setEditing(false);
  };

  const handleDeleteHouse = (id) => {
    haptic('warning');
    const doDelete = async () => { await deleteHouse(id); };
    if (inTg) {
      tgConfirm("Bu e'lonni o'chirmoqchimisiz?", ok => { if (ok) doDelete(); });
    } else {
      if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) doDelete();
    }
  };

  const handleLogout = () => {
    haptic('medium');
    logout();
    navigate('/', { replace: true });
  };

  const handleSendCode = async () => {
    if (!tgId) {
      setVerifyError("Telegram aniqlanmadi");
      return;
    }
    setCodeLoading(true);
    setVerifyError('');
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    pendingCode.current = generated;
    pendingExp.current = Date.now() + 300000;

    let sent = false;
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgId,
          text: `Hamroh tasdiqlash\n\nKodingiz: ${generated}\n5 daqiqa amal qiladi.`,
        }),
      });
      sent = res.ok;
    } catch {}

    setVerifyStep(2);
    setResendTimer(60);
    setCodeLoading(false);
    haptic('success');
    setTimeout(() => codeRefs[0].current?.focus(), 100);
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) codeRefs[index + 1].current?.focus();
    if (value && index === 5 && newCode.join('').length === 6) {
      verifyCode(newCode.join(''));
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs[index - 1].current?.focus();
    }
  };

  const verifyCode = (codeStr) => {
    setCodeLoading(true);
    setVerifyError('');

    try {
      const saved = pendingCode.current;
      const exp = pendingExp.current;

      if (!saved || Date.now() > exp) {
        setVerifyError('Kod muddati tugadi. Qaytadan yuboring.');
        setCodeLoading(false);
        setCode(['', '', '', '', '', '']);
        codeRefs[0].current?.focus();
        return;
      }

      if (saved !== codeStr) {
        setVerifyError('Noto\'g\'ri kod');
        setCodeLoading(false);
        setCode(['', '', '', '', '', '']);
        codeRefs[0].current?.focus();
        return;
      }

      haptic('success');
      updateProfile({ phoneVerified: true });
      setVerifySuccess(true);
      setVerifyStep(0);
      setCode(['', '', '', '', '', '']);
      pendingCode.current = null;
      pendingExp.current = 0;
    } catch {
      setVerifyError('Tekshirishda xatolik');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      {/* Avatar + ism */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {inTg && tgUser?.photo_url ? (
              <img src={tgUser.photo_url} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{displayName}</div>
            {displayUsername && (
              <div className="text-amber-200 text-sm truncate">{displayUsername}</div>
            )}
            {inTg && (
              <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                ✈️ Telegram
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: "E'lonlar", value: myHouses.length },
            { label: 'Sotish', value: myHouses.filter(h => h.type === 'sotish').length },
            { label: 'Ijara', value: myHouses.filter(h => h.type === 'ijara').length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-2.5 text-center">
              <div className="text-xl font-bold">{value}</div>
              <div className="text-amber-200 text-[10px]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Telefon tasdiqlash */}
      {inTg && !isPhoneVerified && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
            <ShieldCheck size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-gray-900">Telefonni tasdiqlash</span>
          </div>
          <div className="p-4">
            {verifyStep === 2 ? (
              <div>
                <p className="text-xs text-gray-500 mb-3">Telegramga yuborilgan 6 xonali kodni kiriting</p>
                {verifyError && <p className="text-red-500 text-xs mb-2 bg-red-50 px-3 py-2 rounded-lg">{verifyError}</p>}
                <div className="flex justify-center gap-1.5 mb-3">
                  {code.map((digit, i) => (
                    <input key={i} ref={codeRefs[i]} type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-10 h-11 text-center text-base font-bold bg-gray-50 border-2 rounded-lg outline-none transition-all
                        focus:border-amber-400 focus:ring-2 focus:ring-amber-100 border-gray-200"
                    />
                  ))}
                </div>
                {codeLoading && <p className="text-center text-xs text-amber-600">Tekshirilmoqda...</p>}
                <button onClick={() => { setCode(['','','','','','']); codeRefs[0].current?.focus(); }}
                  disabled={resendTimer > 0}
                  className="w-full text-center text-xs text-amber-600 font-medium py-1 disabled:text-gray-400">
                  {resendTimer > 0 ? `Qayta yuborish: ${resendTimer}s` : 'Kodni qayta yuborish'}
                </button>
                <button onClick={() => { setVerifyStep(0); setVerifyError(''); setCode(['','','','','','']); }}
                  className="w-full text-center text-xs text-gray-500 font-medium py-1">
                  ← Orqaga
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-3">Telegram raqamingizni tasdiqlang</p>
                {verifyError && <p className="text-red-500 text-xs mb-2 bg-red-50 px-3 py-2 rounded-lg">{verifyError}</p>}
                <button onClick={handleSendCode} disabled={codeLoading}
                  className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:bg-amber-600 disabled:bg-gray-300">
                  {codeLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  {codeLoading ? 'Yuborilmoqda...' : 'Telegramga kod olish'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isPhoneVerified && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Telefon tasdiqlangan</span>
        </div>
      )}

      {/* Ma'lumotlar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-sm font-bold text-gray-900">Shaxsiy ma'lumotlar</span>
          <button
            onClick={() => { haptic('light'); setEditing(!editing); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
              ${editing ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-600'}`}
          >
            <Edit size={13} /> {editing ? 'Bekor' : 'Tahrirlash'}
          </button>
        </div>

        {editing ? (
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Ism</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
              </div>
            </div>
            <button onClick={handleSave}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:bg-amber-600">
              <Save size={16} /> Saqlash
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="flex items-center gap-3 px-4 py-3">
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400">Ism</div>
                <div className="text-sm font-medium text-gray-900">{displayName}</div>
              </div>
            </div>
            {displayUsername && (
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-gray-400 flex-shrink-0 text-sm">@</span>
                <div>
                  <div className="text-[10px] text-gray-400">Telegram</div>
                  <div className="text-sm font-medium text-gray-900">{displayUsername}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-3">
              <Phone size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400">Telefon</div>
                <div className="text-sm font-medium text-gray-900">{tgUser?.phone_number || user.phone || '—'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mening e'lonlarim */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <span className="text-sm font-bold text-gray-900">E'lonlarim ({myHouses.length})</span>
          <Link to="/add-house" onClick={() => haptic('light')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-600">
            <Plus size={13} /> Yangi
          </Link>
        </div>

        {myHouses.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {myHouses.map(house => (
              <div key={house.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={house.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100'}
                  alt=""
                  className="w-14 h-12 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{house.title}</div>
                  <div className="text-xs text-amber-600 font-bold">
                    {Number(house.price || 0).toLocaleString()} so'm
                    {house.type === 'ijara' ? '/oy' : ''}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Link to={`/house/${house.id}`} onClick={() => haptic('light')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 active:bg-gray-100">
                    <Eye size={15} />
                  </Link>
                  <Link to={`/edit-house/${house.id}`} onClick={() => haptic('light')}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 active:bg-yellow-100">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDeleteHouse(house.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 active:bg-red-100">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center px-4">
            <Home size={36} className="text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm mb-3">Hali hech qanday e'lon yo'q</p>
            <Link to="/add-house" onClick={() => haptic('medium')}
              className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              Birinchi e'lonni bering
            </Link>
          </div>
        )}
      </div>

      {/* Chiqish */}
      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm bg-red-50 active:bg-red-100 transition-colors">
        <LogOut size={18} /> Hisobdan chiqish
      </button>
    </div>
  );
}
