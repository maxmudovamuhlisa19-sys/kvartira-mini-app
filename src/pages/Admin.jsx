import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHouses } from '../context/HouseContext';
import { Users, Home, Trash2, Eye, RefreshCw } from 'lucide-react';
import { haptic } from '../telegram';

export default function Admin() {
  const { user } = useAuth();
  const { houses, deleteHouse } = useHouses();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('houses');
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin' || user?.email === 'alisher@mail.com';

  useEffect(() => {
    if (!isAdmin) { navigate('/', { replace: true }); return; }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch {}
    setLoading(false);
  };

  const handleDeleteHouse = (id) => {
    haptic('warning');
    if (window.confirm("O'chirishni xohlaysizmi?")) deleteHouse(id);
  };

  if (!isAdmin) return null;

  return (
    <div className="px-3 pt-2 pb-4">
      <div className="flex gap-1 mb-3">
        {[
          { key: 'houses', label: "E'lonlar", icon: Home },
          { key: 'users', label: 'Foydalanuvchilar', icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => { haptic('light'); setTab(key); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors
              ${tab === key ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <RefreshCw size={20} className="text-gray-400 animate-spin" />
        </div>
      ) : tab === 'houses' ? (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-gray-400">Jami: {houses.length} ta e'lon</p>
          {houses.map(h => (
            <div key={h.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
              <img src={h.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100'}
                alt="" className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{h.title}</p>
                <p className="text-[10px] text-amber-600 font-bold">{h.price?.toLocaleString()} so'm</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Link to={`/house/${h.id}`} onClick={() => haptic('light')}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-50 text-gray-500">
                  <Eye size={13} />
                </Link>
                <button onClick={() => handleDeleteHouse(h.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-red-50 text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-gray-400">Jami: {users.length} ta foydalanuvchi</p>
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-100">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                {u.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{u.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
              </div>
              <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{u.role || 'foydalanuvchi'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
