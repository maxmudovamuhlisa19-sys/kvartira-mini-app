import { Link } from 'react-router-dom';
import { haptic } from '../telegram';
import { MapPin, BedDouble, Maximize } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800';

export default function HouseCard({ house }) {
  const p = Number(house.price) || 0;
  const priceText = house.type === 'ijara'
    ? `${p.toLocaleString()} so'm/oy`
    : `${p.toLocaleString()} so'm`;

  const images = house.images?.length ? house.images : [FALLBACK_IMG];

  return (
    <Link
      to={`/house/${house.id}`}
      onClick={() => haptic('light')}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={images[0]}
          alt={house.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        {/* Type badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold
          ${house.type === 'sotish' ? 'bg-amber-500 text-white' : 'bg-orange-500 text-white'}`}>
          {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 leading-tight">{house.title}</h3>
        <div className="flex items-center gap-1.5 mt-2 text-gray-500">
          <MapPin size={14} className="text-amber-500 flex-shrink-0" />
          <span className="text-sm truncate">{house.address}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{house.rooms} xona</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{house.area} m²</span>
          </div>
          {house.floor && (
            <span className="text-sm text-gray-400">{house.floor}/{house.totalFloors}-qavat</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3">
          <span className="text-lg font-extrabold text-amber-600">{priceText}</span>
        </div>
      </div>
    </Link>
  );
}
