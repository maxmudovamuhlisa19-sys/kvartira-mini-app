import { Link } from 'react-router-dom';
import { haptic } from '../telegram';
import { MapPin } from 'lucide-react';

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
      className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <img
        src={images[0]}
        alt={house.title}
        className="w-24 h-24 object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 p-3 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">{house.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={11} className="text-amber-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-400 truncate">{house.address}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-amber-600">{priceText}</span>
          <span className="text-[10px] text-gray-400">{house.rooms} xona</span>
        </div>
      </div>
    </Link>
  );
}
