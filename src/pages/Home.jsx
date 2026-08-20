import { Link } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import HouseCard from '../components/HouseCard';
import { Search } from 'lucide-react';
import { haptic } from '../telegram';

export default function Home() {
  const { houses } = useHouses();
  const { user } = useAuth();
  const featuredHouses = houses.slice(0, 4);

  return (
    <div className="bg-amber-50">
      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 px-4 pt-5 pb-5">
        <h1 className="text-white text-lg font-bold mb-1">Hamroh</h1>
        <p className="text-amber-100 text-sm mb-4">Uy topish endi oson</p>
        <div className="flex gap-3">
          <Link to="/houses" onClick={() => haptic('medium')}
            className="flex-1 bg-white text-amber-600 py-3 rounded-xl font-bold text-sm text-center">
            <Search size={16} className="inline mr-1" />Qidirish
          </Link>
          <Link to={user ? '/add-house' : '/login'} onClick={() => haptic('medium')}
            className="flex-1 border border-white/50 text-white py-3 rounded-xl font-bold text-sm text-center">
            E'lon berish
          </Link>
        </div>
      </div>

      {/* Shaharlar */}
      <div className="px-4 py-3">
        <h2 className="text-sm font-bold text-gray-800 mb-2">Shaharlar</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Qarshi'].map(city => (
            <Link key={city} to={`/houses?city=${city}`} onClick={() => haptic('light')}
              className="flex-shrink-0 bg-white border border-amber-200 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg">
              {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Sotish / Ijara */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/houses?type=sotish" onClick={() => haptic('light')}
            className="bg-white border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🏢</div>
            <div className="text-sm font-bold text-amber-700">Sotish</div>
          </Link>
          <Link to="/houses?type=ijara" onClick={() => haptic('light')}
            className="bg-white border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-lg mb-1">🏠</div>
            <div className="text-sm font-bold text-amber-700">Ijara</div>
          </Link>
        </div>
      </div>

      {/* Tavsiya */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">Tavsiya etilgan</h2>
          <Link to="/houses" onClick={() => haptic('light')} className="text-amber-600 text-xs font-semibold">
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
