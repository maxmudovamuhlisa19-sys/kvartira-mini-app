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
          className="w-full h-52 object-cover"
          loading="lazy"
        />
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold
          ${house.type === 'sotish' ? 'bg-amber-500 text-white' : 'bg-orange-500 text-white'}`}>
          {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{house.title}</h3>

        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={15} className="text-amber-500 flex-shrink-0" />
          <span className="text-sm text-gray-500">{house.address}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{house.rooms} xona</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{house.area} m²</span>
          </div>
          {house.floor && (
            <span className="text-sm text-gray-400">{house.floor}/{house.totalFloors}-qavat</span>
          )}
        </div>

        {/* Price */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-xl font-extrabold text-amber-600">{priceText}</span>
        </div>
      </div>
    </Link>
  );
}
