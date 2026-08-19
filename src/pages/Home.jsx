import { Link } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import HouseCard from '../components/HouseCard';
import {
  Search, MapPin, Home as HomeIcon, TrendingUp,
  Users, ArrowRight, Shield, Clock, Star, Building2
} from 'lucide-react';
import { isTelegram, haptic } from '../telegram';

export default function Home() {
  const { houses } = useHouses();
  const { user } = useAuth();
  const inTg = isTelegram();
  const featuredHouses = houses.slice(0, 4);

  const stats = [
    { icon: HomeIcon, label: "E'lonlar", value: `${houses.length}+`, color: 'bg-blue-500' },
    { icon: Users, label: 'Foydalanuvchi', value: '1200+', color: 'bg-green-500' },
    { icon: MapPin, label: 'Shaharlar', value: '10+', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Muvaffaqiyat', value: '95%', color: 'bg-orange-500' },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 left-6 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-4 right-4 w-56 h-56 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative px-4 pt-6 pb-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={26} className="text-white/90" />
            <span className="text-white font-bold text-lg tracking-tight">Kvartira.uz</span>
          </div>

          {/* Sarlavha */}
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            O'zingizga mos <span className="text-yellow-300">uy</span>ni toping
          </h1>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            O'zbekistondagi eng yirik uy-joy portalida minglab e'lonlar
          </p>

          {/* CTA tugmalar */}
          <div className="flex gap-3">
            <Link
              to="/houses"
              onClick={() => haptic('medium')}
              className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Search size={16} /> Qidirish
            </Link>
            <Link
              to={user ? '/add-house' : '/login'}
              onClick={() => haptic('medium')}
              className="flex-1 border-2 border-white/40 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              E'lon berish <ArrowRight size={16} />
            </Link>
          </div>

          {inTg && (
            <p className="text-blue-200 text-xs text-center mt-3 opacity-75">
              Telegram orqali kirgan 👋
            </p>
          )}
        </div>
      </section>

      {/* ===== STATISTIKA ===== */}
      <section className="px-4 -mt-4 relative z-10 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-3 text-center">
              <div className={`${stat.color} w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1`}>
                <stat.icon size={14} className="text-white" />
              </div>
              <div className="text-sm font-bold text-gray-900">{stat.value}</div>
              <div className="text-[10px] text-gray-400 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SHAHAR FILTRLARI ===== */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">Shahar bo'yicha</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona', 'Qarshi'].map(city => (
            <Link
              key={city}
              to={`/houses?city=${city}`}
              onClick={() => haptic('light')}
              className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3.5 py-2 rounded-full shadow-sm active:bg-blue-50 active:border-blue-300 active:text-blue-700 transition-colors"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== TUR FILTRLARI ===== */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/houses?type=sotish"
            onClick={() => haptic('light')}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-1 active:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">🏢</span>
            <span className="font-bold text-blue-700 text-sm">Sotish</span>
            <span className="text-gray-400 text-xs">Sotilayotgan uylar</span>
          </Link>
          <Link
            to="/houses?type=ijara"
            onClick={() => haptic('light')}
            className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex flex-col gap-1 active:bg-purple-100 transition-colors"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-bold text-purple-700 text-sm">Ijara</span>
            <span className="text-gray-400 text-xs">Ijaraga beriladigan</span>
          </Link>
        </div>
      </section>

      {/* ===== TAVSIYA ETILGAN ===== */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Tavsiya etilgan</h2>
          <Link
            to="/houses"
            onClick={() => haptic('light')}
            className="text-blue-600 text-xs font-semibold flex items-center gap-0.5"
          >
            Barchasi <ArrowRight size={13} />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {featuredHouses.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
        <Link
          to="/houses"
          onClick={() => haptic('medium')}
          className="mt-4 w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-blue-700 transition-colors"
        >
          Barcha e'lonlarni ko'rish <ArrowRight size={16} />
        </Link>
      </section>

      {/* ===== NIMA UCHUN ===== */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">Nima uchun Kvartira.uz?</h2>
        <div className="flex flex-col gap-3">
          {[
            { icon: Shield, title: 'Ishonchli', desc: 'Barcha e\'lonlar tekshirilgan', color: 'bg-blue-100 text-blue-600' },
            { icon: Clock, title: 'Tez va qulay', desc: 'Bir necha daqiqada uy toping', color: 'bg-green-100 text-green-600' },
            { icon: Star, title: 'Sifatli xizmat', desc: '24/7 qo\'llab-quvvatlash', color: 'bg-yellow-100 text-yellow-600' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-gray-50">
              <div className={`${f.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <f.icon size={20} />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{f.title}</div>
                <div className="text-gray-400 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
