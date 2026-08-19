import { Link } from 'react-router-dom';
import { MapPin, Bed, Maximize, Building, Tag } from 'lucide-react';
import { haptic } from '../telegram';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';

export default function HouseCard({ house }) {
  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    return type === 'ijara'
      ? `${p.toLocaleString()} so'm/oy`
      : `${p.toLocaleString()} so'm`;
  };

  const statusColors = {
    yangi: 'bg-green-100 text-green-700',
    foydalanilgan: 'bg-yellow-100 text-yellow-700',
    qurilayotgan: 'bg-blue-100 text-blue-700',
  };
  const statusLabels = {
    yangi: 'Yangi',
    foydalanilgan: 'Foydalanilgan',
    qurilayotgan: 'Qurilayotgan',
  };

  const images = house.images?.length ? house.images : [FALLBACK_IMG];

  return (
    <Link
      to={`/house/${house.id}`}
      className="block active:scale-[0.98] transition-transform duration-100"
      onClick={() => haptic('light')}
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Rasm */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={images[0]}
            alt={house.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Type badge */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full
              ${house.type === 'sotish' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
            </span>
            {house.status && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[house.status] || 'bg-gray-100 text-gray-700'}`}>
                {statusLabels[house.status] || house.status}
              </span>
            )}
          </div>
          {/* Talaba badge */}
          {house.studentFriendly && (
            <div className="absolute bottom-2.5 left-2.5 bg-purple-600/90 text-white px-2.5 py-0.5 rounded-lg text-xs font-semibold backdrop-blur-sm">
              🎓 Talaba uchun
            </div>
          )}
          {/* Maydon */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/50 text-white px-2.5 py-0.5 rounded-lg text-xs font-semibold backdrop-blur-sm">
            {house.area} m²
          </div>
        </div>

        {/* Matn */}
        <div className="p-4">
          <h3 className="font-bold text-base text-gray-900 line-clamp-1 mb-1">
            {house.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
            <MapPin size={12} />
            <span className="line-clamp-1">{house.city}{house.address ? `, ${house.address}` : ''}</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Bed size={13} className="text-gray-400" />
              <span>{house.rooms} xona</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize size={13} className="text-gray-400" />
              <span>{house.area} m²</span>
            </div>
            {house.floor ? (
              <div className="flex items-center gap-1">
                <Building size={13} className="text-gray-400" />
                <span>{house.floor}/{house.totalFloors || '?'}-qavat</span>
              </div>
            ) : null}
          </div>

          {/* Narx */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <Tag size={14} className="text-blue-600" />
              <span className="text-lg font-extrabold text-blue-600">
                {formatPrice(house.price, house.type)}
              </span>
            </div>
            {house.dateAdded && (
              <span className="text-[10px] text-gray-400">{house.dateAdded}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
