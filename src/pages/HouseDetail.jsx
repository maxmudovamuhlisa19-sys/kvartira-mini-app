import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, User, Edit, Trash2, Heart, Navigation } from 'lucide-react';
import { useState } from 'react';
import { isTelegram, haptic, tgConfirm } from '../telegram';

export default function HouseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHouse, deleteHouse, loading } = useHouses();
  const { user } = useAuth();
  const house = getHouse(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (loading) {
    return (
      <div className="px-3 pt-2 space-y-2">
        <div className="bg-gray-200 rounded-xl h-48 animate-pulse" />
        <div className="bg-gray-200 rounded-xl h-20 animate-pulse" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-3 text-center">
        <h2 className="text-sm font-bold text-gray-900 mb-2">Topilmadi</h2>
        <Link to="/houses" className="text-amber-600 text-xs font-medium">Qaytish</Link>
      </div>
    );
  }

  const images = house.images?.length ? house.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];
  const isOwner = user && (user.id === house.userId || user.id === house.ownerId);
  const p = Number(house.price) || 0;
  const priceText = house.type === 'ijara' ? `${p.toLocaleString()} so'm/oy` : `${p.toLocaleString()} so'm`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${house.address || ''}, ${house.city || ''}, Uzbekistan`
  )}`;

  const handleDelete = () => {
    haptic('warning');
    const doDelete = async () => {
      await deleteHouse(house.id);
      navigate('/houses', { replace: true });
    };
    if (isTelegram()) {
      tgConfirm("O'chirmoqchimisiz?", (ok) => { if (ok) doDelete(); });
    } else {
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="pb-4">
      {/* RASM */}
      <div className="relative bg-gray-100">
        <div className="h-52 overflow-hidden">
          <img src={images[currentImage]} alt={house.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 left-2">
          <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-md
            ${house.type === 'sotish' ? 'bg-amber-500' : 'bg-orange-500'}`}>
            {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
          </span>
        </div>
        <button
          onClick={() => { haptic('light'); setLiked(!liked); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
            ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'}`}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
            {currentImage + 1}/{images.length}
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`w-8 h-8 rounded-md overflow-hidden border transition-all
                  ${currentImage === i ? 'border-white' : 'border-transparent opacity-50'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MA'LUMOT */}
      <div className="px-3 pt-3 space-y-2.5">
        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">{house.title}</h1>
          <div className="text-lg font-extrabold text-amber-600 mt-0.5">{priceText}</div>
          <div className="flex items-center gap-1 mt-1 text-gray-400">
            <MapPin size={12} />
            <span className="text-xs">{house.address}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex gap-1.5">
          <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
            <div className="text-xs font-bold text-gray-900">{house.rooms}</div>
            <div className="text-[9px] text-gray-400">Xona</div>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
            <div className="text-xs font-bold text-gray-900">{house.area} m²</div>
            <div className="text-[9px] text-gray-400">Maydon</div>
          </div>
          {house.floor && (
            <div className="flex-1 bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
              <div className="text-xs font-bold text-gray-900">{house.floor}/{house.totalFloors}</div>
              <div className="text-[9px] text-gray-400">Qavat</div>
            </div>
          )}
        </div>

        {/* Tavsif */}
        {house.description && (
          <div className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-600 leading-relaxed">{house.description}</p>
          </div>
        )}

        {/* Telefon + Xarita */}
        <div className="flex gap-2">
          <a href={`tel:${house.phone}`} onClick={() => haptic('medium')}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-2.5 rounded-lg font-bold text-xs active:bg-amber-600">
            <Phone size={14} /> Qo'ng'iroq
          </a>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => haptic('medium')}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold text-xs active:bg-gray-200">
            <Navigation size={14} /> Xarita
          </a>
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-gray-100">
          <div className="w-7 h-7 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <User size={14} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400">Egasi</div>
            <div className="text-xs font-semibold text-gray-900">{house.owner}</div>
          </div>
        </div>

        {/* Owner tugmalari */}
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/edit-house/${house.id}`} onClick={() => haptic('light')}
              className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-semibold text-xs text-center active:bg-amber-600">
              <Edit size={14} className="inline mr-1" />Tahrirlash
            </Link>
            <button onClick={handleDelete}
              className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg font-semibold text-xs border border-red-200 active:bg-red-100">
              <Trash2 size={14} className="inline mr-1" />O'chirish
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-3">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">O'chirish</h3>
            <p className="text-gray-500 text-xs mb-4">Amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 font-semibold text-xs">
                Bekor
              </button>
              <button
                onClick={async () => { setShowDeleteModal(false); await deleteHouse(house.id); navigate('/houses', { replace: true }); }}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-xs active:bg-red-700">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
