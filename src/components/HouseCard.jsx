import { Link } from 'react-router-dom';
import { MapPin, Bed, Maximize, Building, Tag } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';

export default function HouseCard({ house }) {
  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    if (type === 'ijara') {
      return `${p.toLocaleString()} so'm/oy`;
    }
    return `${p.toLocaleString()} so'm`;
  };

  const statusColors = {
    yangi: 'bg-green-100 text-green-700',
    foydalanilgan: 'bg-yellow-100 text-yellow-700',
    qurilayotgan: 'bg-blue-100 text-blue-700'
  };

  const typeColors = {
    sotish: 'bg-blue-600',
    ijara: 'bg-purple-600'
  };

  const images = house.images && house.images.length ? house.images : [FALLBACK_IMG];

  return (
    <Link to={`/house/${house.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="relative h-56 overflow-hidden">
          <img
            src={images[0]}
            alt={house.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`${typeColors[house.type]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
            </span>
            {house.status && (
              <span className={`${statusColors[house.status] || 'bg-gray-100 text-gray-700'} text-xs font-semibold px-3 py-1 rounded-full`}>
                {house.status === 'yangi' ? 'Yangi' : house.status === 'foydalanilgan' ? 'Foydalanilgan' : 'Qurilayotgan'}
              </span>
            )}
          </div>
          {house.studentFriendly && (
            <div className="absolute bottom-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
              🎓 Talaba uchun
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-semibold">
            {house.area} m²
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {house.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin size={14} />
            <span className="line-clamp-1">{house.city}, {house.address || ''}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Bed size={16} className="text-gray-400" />
              <span>{house.rooms} xona</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize size={16} className="text-gray-400" />
              <span>{house.area} m²</span>
            </div>
            {house.floor && (
              <div className="flex items-center gap-1">
                <Building size={16} className="text-gray-400" />
                <span>{house.floor}/{house.totalFloors || '?'}-qavat</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Tag size={16} className="text-blue-600" />
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(house.price, house.type)}
              </span>
            </div>
            <span className="text-xs text-gray-400">{house.dateAdded || ''}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}