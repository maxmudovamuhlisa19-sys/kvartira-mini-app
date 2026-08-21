import { Link } from 'react-router-dom';
import { haptic } from '../telegram';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400';

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
      className="block bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm"
    >
      <div className="flex">
        <img
          src={images[0]}
          alt={house.title}
          className="w-28 h-28 object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 p-3 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">{house.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{house.city}{house.address ? `, ${house.address}` : ''}</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
            <span>{house.rooms} xona</span>
            <span>·</span>
            <span>{house.area} m²</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-extrabold text-amber-600">{priceText}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded
              ${house.type === 'sotish' ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'}`}>
              {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
