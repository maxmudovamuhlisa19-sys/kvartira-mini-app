import { Link } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import HouseCard from '../components/HouseCard';
import { Search, Home as HomeIcon, Building2 } from 'lucide-react';
import { haptic } from '../telegram';

export default function Home() {
  const { houses } = useHouses();
  const { user } = useAuth();
  const featuredHouses = houses.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 px-4 pt-5 pb-6">
        <div className="mb-4">
          <h1 className="text-white text-xl font-extrabold">Hamroh</h1>
          <p className="text-amber-100 text-sm mt-0.5">Navoiy shahrida uy topish endi oson</p>
        </div>

        {/* Search + E'lon berish */}
        <div className="flex gap-2">
          <Link
            to="/houses"
            onClick={() => haptic('medium')}
            className="flex-[2] flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2.5 shadow-lg"
          >
            <Search size={16} className="text-amber-500 flex-shrink-0" />
            <span className="text-gray-400 text-xs font-medium truncate">Qidirish...</span>
          </Link>
          <Link
            to={user ? '/add-house' : '/login'}
            onClick={() => haptic('medium')}
            className="flex-[1] flex items-center justify-center gap-1 bg-white/20 border border-white/30 text-white py-2.5 rounded-xl font-bold text-xs"
          >
            + E'lon
          </Link>
        </div>
      </div>

      {/* Kategoriyalar */}
      <div className="px-4 -mt-3">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/houses?type=ijara" onClick={() => haptic('light')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <HomeIcon size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">Ijara</div>
              <div className="text-[11px] text-gray-400">{houses.filter(h => h.type === 'ijara').length} ta</div>
            </div>
          </Link>
          <Link to="/houses?type=sotish" onClick={() => haptic('light')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">Sotish</div>
              <div className="text-[11px] text-gray-400">{houses.filter(h => h.type === 'sotish').length} ta</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Tavsiya */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Tavsiya etilgan</h2>
          <Link to="/houses" onClick={() => haptic('light')} className="text-amber-600 text-xs font-semibold">
            Barchasi →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {featuredHouses.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </div>
    </div>
  );
}
