import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Bed, Maximize, Phone, User,
  Edit, Trash2, Heart, Navigation
} from 'lucide-react';
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
  const inTg = isTelegram();

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-3">
        <div className="bg-gray-200 rounded-2xl h-56 animate-pulse" />
        <div className="bg-gray-200 rounded-xl h-40 animate-pulse" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-4xl mb-4">🏠</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Uy topilmadi</h2>
        <Link to="/houses" className="text-amber-600 text-sm font-medium">Uylar ro'yxatiga qaytish</Link>
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
    if (inTg) {
      tgConfirm("O'chirmoqchimisiz?", (ok) => { if (ok) doDelete(); });
    } else {
      setShowDeleteModal(true);
    }
  };

  return (
    <div className="pb-20">
      {/* RASM */}
      <div className="relative bg-gray-100">
        <div className="h-64 overflow-hidden">
          <img src={images[currentImage]} alt={house.title} className="w-full h-full object-cover" />
        </div>
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-white text-xs font-bold px-3 py-1 rounded-full
            ${house.type === 'sotish' ? 'bg-amber-500' : 'bg-orange-500'}`}>
            {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
          </span>
        </div>
        {/* Like */}
        <button
          onClick={() => { haptic('light'); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'}`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
        {/* Rasmlar soni */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
            {currentImage + 1}/{images.length}
          </div>
        )}
        {/* Thumbnail */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all
                  ${currentImage === i ? 'border-white' : 'border-transparent opacity-60'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ASOSIY MA'LUMOT */}
      <div className="px-4 pt-4 space-y-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{house.title}</h1>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{priceText}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
            <Bed size={18} className="text-amber-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-gray-900">{house.rooms}</div>
            <div className="text-[10px] text-gray-400">Xona</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
            <Maximize size={18} className="text-amber-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-gray-900">{house.area} m²</div>
            <div className="text-[10px] text-gray-400">Maydon</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
            <MapPin size={18} className="text-amber-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-gray-900 truncate">{house.city}</div>
            <div className="text-[10px] text-gray-400">Shahar</div>
          </div>
        </div>

        {/* Tavsif */}
        {house.description && (
          <div className="bg-white rounded-xl p-4 border border-amber-100">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Tavsif</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{house.description}</p>
          </div>
        )}

        {/* Owner */}
        <div className="bg-white rounded-xl p-4 border border-amber-100 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400">Egasi</div>
              <div className="text-sm font-semibold text-gray-900">{house.owner}</div>
            </div>
          </div>
        </div>

        {/* Owner tugmalari */}
        {isOwner && (
          <div className="flex gap-3">
            <Link to={`/edit-house/${house.id}`} onClick={() => haptic('light')}
              className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-semibold text-sm text-center active:bg-amber-600">
              <Edit size={16} className="inline mr-1" />Tahrirlash
            </Link>
            <button onClick={handleDelete}
              className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm border border-red-200 active:bg-red-100">
              <Trash2 size={16} className="inline mr-1" />O'chirish
            </button>
          </div>
        )}
      </div>

      {/* PASTKI MENU BAR — DOIM KO'RINADI */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-amber-200 shadow-lg">
        <div className="flex items-stretch">
          {/* Manzil */}
          <div className="flex-1 px-3 py-3 border-r border-gray-100 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin size={12} className="text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-400">Manzil</span>
            </div>
            <p className="text-xs font-semibold text-gray-900 truncate">
              {house.address || house.city}
            </p>
          </div>

          {/* Telefon */}
          <a href={`tel:${house.phone}`} onClick={() => haptic('medium')}
            className="flex-1 px-3 py-3 border-r border-gray-100 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Phone size={12} className="text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-400">Telefon</span>
            </div>
            <p className="text-xs font-semibold text-amber-600 truncate">{house.phone}</p>
          </a>

          {/* Xarita */}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => haptic('medium')}
            className="flex-1 px-3 py-3 flex flex-col justify-center items-center bg-amber-500 text-white">
            <Navigation size={20} />
            <span className="text-[10px] font-bold mt-0.5">Xarita</span>
          </a>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Uyni o'chirish</h3>
            <p className="text-gray-500 text-sm mb-5">Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-sm">
                Bekor qilish
              </button>
              <button
                onClick={async () => { setShowDeleteModal(false); await deleteHouse(house.id); navigate('/houses', { replace: true }); }}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm active:bg-red-700">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
