import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHouses } from '../context/HouseContext';
import { User, Mail, Phone, Lock, Edit, Save, Home, Eye, Trash2 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { houses, deleteHouse } = useHouses();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const myHouses = houses.filter(h => h.userId === user.id || h.ownerId === user.id);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  const handleDeleteHouse = async (id) => {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      await deleteHouse(id);
    }
  };

  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    if (type === 'ijara') return `${p.toLocaleString()} so'm/oy`;
    return `${p.toLocaleString()} so'm`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              editing ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Edit size={18} /> {editing ? 'Bekor' : 'Tahrirlash'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Save size={18} /> Saqlash
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <User size={20} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">To'liq ism</div>
                <div className="font-semibold text-gray-900">{user.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail size={20} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-semibold text-gray-900">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone size={20} className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Telefon</div>
                <div className="font-semibold text-gray-900">{user.phone}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mening e'lonlarim ({myHouses.length})</h2>
          <Link
            to="/add-house"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            + Yangi e'lon
          </Link>
        </div>

        {myHouses.length > 0 ? (
          <div className="space-y-4">
            {myHouses.map(house => (
              <div key={house.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <img
                  src={house.images && house.images[0] ? house.images[0] : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'}
                  alt={house.title}
                  className="w-20 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{house.title}</h3>
                  <p className="text-sm text-gray-500">{house.address}</p>
                  <p className="text-blue-600 font-bold">{formatPrice(house.price, house.type)}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/house/${house.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/edit-house/${house.id}`}
                    className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDeleteHouse(house.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Siz hali hech qanday e'lon bermagansiz</p>
            <Link
              to="/add-house"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              + Birinchi e'lonni bering
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
