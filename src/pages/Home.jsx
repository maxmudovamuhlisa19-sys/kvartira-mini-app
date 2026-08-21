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
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-500 px-5 pt-6 pb-8">
        <div className="mb-5">
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Hamroh</h1>
          <p className="text-amber-100 text-base mt-1 font-medium">Navoiy shahrida uy topish endi oson</p>
        </div>

        {/* Search + E'lon berish */}
        <div className="flex gap-3">
          <Link
            to="/houses"
            onClick={() => haptic('medium')}
            className="flex-[2] flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-lg"
          >
            <Search size={18} className="text-amber-500 flex-shrink-0" />
            <span className="text-gray-400 text-sm font-medium truncate">Qidirish...</span>
          </Link>
          <Link
            to={user ? '/add-house' : '/login'}
            onClick={() => haptic('medium')}
            className="flex-[1] flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm"
          >
            + E'lon
          </Link>
        </div>
      </div>

      {/* Kategoriyalar */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/houses?type=ijara" onClick={() => haptic('light')}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
              <HomeIcon size={28} className="text-amber-600" />
            </div>
            <div className="text-base font-bold text-gray-800">Ijara</div>
            <div className="text-sm text-gray-400">{houses.filter(h => h.type === 'ijara').length} ta e'lon</div>
          </Link>
          <Link to="/houses?type=sotish" onClick={() => haptic('light')}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <Building2 size={28} className="text-orange-600" />
            </div>
            <div className="text-base font-bold text-gray-800">Sotish</div>
            <div className="text-sm text-gray-400">{houses.filter(h => h.type === 'sotish').length} ta e'lon</div>
          </Link>
        </div>
      </div>

      {/* Tavsiya */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Tavsiya etilgan</h2>
          <Link to="/houses" onClick={() => haptic('light')} className="text-amber-600 text-sm font-semibold">
            Barchasi →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {featuredHouses.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </div>
    </div>
  );
}
