import { Link } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import HouseCard from '../components/HouseCard';
import { Search, MapPin, Home as HomeIcon, TrendingUp, Users, ArrowRight, Shield, Clock, Star } from 'lucide-react';

export default function Home() {
  const { houses } = useHouses();
  const featuredHouses = houses.slice(0, 3);

  const stats = [
    { icon: HomeIcon, label: "E'lonlar", value: houses.length + "+", color: "bg-blue-500" },
    { icon: Users, label: "Foydalanuvchilar", value: "1,200+", color: "bg-green-500" },
    { icon: MapPin, label: "Shaharlar", value: "10+", color: "bg-purple-500" },
    { icon: TrendingUp, label: "Muvaffaqiyat", value: "95%", color: "bg-orange-500" },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              O'zingizga mos <span className="text-yellow-300">uy</span>ni toping
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              O'zbekistondagi eng yirik uy-joy portalida minglab variantlar orasidan o'zingizga mosini tanlang
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/houses"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Search size={20} /> Uylarni ko'rish
              </Link>
              <Link
                to="/add-house"
                className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                E'lon berish <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tavsiya etilgan uylar</h2>
            <p className="text-gray-500 mt-1">Eng mashhur va sifatli e'lonlar</p>
          </div>
          <Link to="/houses" className="hidden sm:flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Barchasini ko'rish <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHouses.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/houses" className="inline-flex items-center gap-1 text-blue-600 font-semibold">
            Barchasini ko'rish <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Nima uchun Kvartira.uz?</h2>
            <p className="text-gray-500 mt-2">Biz sizga eng yaxshi xizmatni taqdim etamiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Ishonchli",
                desc: "Barcha e'lonlar tekshirilgan va haqiqiy ma'lumotlar asosida joylashtirilgan",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Clock,
                title: "Tez va qulay",
                desc: "Bir necha daqiqada o'zingizga mos uy toping yoki e'lon bering",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Star,
                title: "Sifatli xizmat",
                desc: "24/7 qo'llab-quvvatlash va professional maslahatlar",
                color: "bg-yellow-100 text-yellow-600"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow text-center">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
