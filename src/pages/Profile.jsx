import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHouses } from '../context/HouseContext';
import { User, Mail, Phone, Edit, Save, Home, Eye, Trash2, LogOut, Plus } from 'lucide-react';
import { haptic, isTelegram, tgConfirm, getTelegramUser } from '../telegram';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { houses, deleteHouse } = useHouses();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const inTg = isTelegram();
  const tgUser = getTelegramUser();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const myHouses = houses.filter(h => h.userId === user.id || h.ownerId === user.id);

  const handleSave = () => {
    haptic('medium');
    updateProfile(form);
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

  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    return type === 'ijara' ? `${p.toLocaleString()} so'm/oy` : `${p.toLocaleString()} so'm`;
  };

  const infoFields = [
    { icon: User, label: 'To\'liq ism', value: user.name },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Telefon', value: user.phone || '—' },
  ];

  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      {/* Avatar + ism */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {inTg && tgUser?.photo_url ? (
              <img src={tgUser.photo_url} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{user.name}</div>
            <div className="text-amber-200 text-sm truncate">{user.email}</div>
            {inTg && (
              <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                ✈️ Telegram
              </span>
            )}
          </div>
        </div>
        {/* Stats */}
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
            {[
              { key: 'name', label: 'Ism', type: 'text', icon: User },
              { key: 'email', label: 'Email', type: 'email', icon: Mail },
              { key: 'phone', label: 'Telefon', type: 'tel', icon: Phone },
            ].map(({ key, label, type, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={type} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                </div>
              </div>
            ))}
            <button onClick={handleSave}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:bg-amber-600">
              <Save size={16} /> Saqlash
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {infoFields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <Icon size={16} className="text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                </div>
              </div>
            ))}
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
                  <div className="text-xs text-amber-600 font-bold">{formatPrice(house.price, house.type)}</div>
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
