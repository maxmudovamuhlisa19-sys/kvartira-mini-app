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
      className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-sm border border-gray-100"
    >
      <img
        src={images[0]}
        alt={house.title}
        className="w-[72px] h-[72px] rounded-lg object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-[13px] font-semibold text-gray-900 truncate">{house.title}</h3>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{house.rooms} xona · {priceText}</p>
      </div>
    </Link>
  );
}
