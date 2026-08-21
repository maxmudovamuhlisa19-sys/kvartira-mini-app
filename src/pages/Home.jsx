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
          <p className="text-amber-100 text-sm mt-1 font-medium">Navoiy shahrida uy topish endi oson</p>
        </div>

        {/* Search */}
        <Link
          to="/houses"
          onClick={() => haptic('medium')}
          className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3.5 shadow-lg"
        >
          <Search size={20} className="text-amber-500 flex-shrink-0" />
          <span className="text-gray-400 text-sm font-medium">Manzil, xonalar soni bo'yicha qidirish...</span>
        </Link>

        {/* E'lon berish */}
        <Link
          to={user ? '/add-house' : '/login'}
          onClick={() => haptic('medium')}
          className="mt-3 flex items-center justify-center gap-2 w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3 rounded-2xl font-bold text-sm"
        >
          + E'lon berish
        </Link>
      </div>

      {/* Kategoriyalar */}
      <div className="px-5 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/houses?type=ijara" onClick={() => haptic('light')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <HomeIcon size={24} className="text-amber-600" />
            </div>
            <div className="text-sm font-bold text-gray-800">Ijara</div>
            <div className="text-xs text-gray-400">{houses.filter(h => h.type === 'ijara').length} ta e'lon</div>
          </Link>
          <Link to="/houses?type=sotish" onClick={() => haptic('light')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Building2 size={24} className="text-orange-600" />
            </div>
            <div className="text-sm font-bold text-gray-800">Sotish</div>
            <div className="text-xs text-gray-400">{houses.filter(h => h.type === 'sotish').length} ta e'lon</div>
          </Link>
        </div>
      </div>

      {/* Tavsiya */}
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Tavsiya etilgan</h2>
          <Link to="/houses" onClick={() => haptic('light')} className="text-amber-600 text-sm font-semibold">
            Barchasi →
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          {featuredHouses.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </div>
    </div>
  );
}
