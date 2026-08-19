import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Bed, Maximize, Building, Tag,
  Phone, User, Calendar, Edit, Trash2,
  Heart, Share2, CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { isTelegram, haptic, tgConfirm, tg } from '../telegram';

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

  // Telegram da "Qo'ng'iroq qilish" uchun MainButton
  useEffect(() => {
    if (!inTg || !house) return;
    const app = tg();
    if (!app?.MainButton) return;

    const handleCall = () => {
      haptic('medium');
      window.open(`tel:${house.phone}`, '_self');
    };

    app.MainButton.setText(`📞 ${house.phone}`);
    app.MainButton.color = '#16a34a';
    app.MainButton.textColor = '#ffffff';
    app.MainButton.show();
    app.MainButton.onClick(handleCall);

    return () => {
      app.MainButton.offClick(handleCall);
      app.MainButton.hide();
    };
  }, [house, inTg]);

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-3">
        <div className="bg-gray-200 rounded-2xl h-56 animate-pulse" />
        <div className="bg-white rounded-2xl h-32 animate-pulse" />
        <div className="bg-white rounded-2xl h-48 animate-pulse" />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="text-4xl mb-4">🏠</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Uy topilmadi</h2>
        <Link to="/houses" className="text-blue-600 text-sm font-medium">Uylar ro'yxatiga qaytish</Link>
      </div>
    );
  }

  const images = house.images?.length ? house.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];
  const isOwner = user && (user.id === house.userId || user.id === house.ownerId);

  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    return type === 'ijara' ? `${p.toLocaleString()} so'm/oy` : `${p.toLocaleString()} so'm`;
  };

  const statusColors = {
    yangi: 'bg-green-100 text-green-700',
    foydalanilgan: 'bg-yellow-100 text-yellow-700',
    qurilayotgan: 'bg-blue-100 text-blue-700',
  };
  const statusLabels = { yangi: 'Yangi', foydalanilgan: 'Foydalanilgan', qurilayotgan: 'Qurilayotgan' };

  const handleDelete = () => {
    haptic('warning');
    const doDelete = async () => {
      await deleteHouse(house.id);
      navigate('/houses', { replace: true });
    };
    if (inTg) {
      tgConfirm("Haqiqatan ham bu uyni o'chirmoqchimisiz?", (ok) => { if (ok) doDelete(); });
    } else {
      setShowDeleteModal(true);
    }
  };

  const handleShare = () => {
    haptic('light');
    const url = `https://by-hamroh.uz/house/${house.id}`;
    if (navigator.share) {
      navigator.share({ title: house.title, url });
    } else if (inTg) {
      tg()?.openTelegramLink?.(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(house.title)}`);
    }
  };

  return (
    <div>
      {/* ===== RASM ===== */}
      <div className="relative bg-gray-100">
        <div className="h-64 overflow-hidden">
          <img
            src={images[currentImage]}
            alt={house.title}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Badgelar */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-white text-xs font-bold px-3 py-1 rounded-full
            ${house.type === 'sotish' ? 'bg-blue-600' : 'bg-purple-600'}`}>
            {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
          </span>
          {house.status && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[house.status]}`}>
              {statusLabels[house.status]}
            </span>
          )}
        </div>
        {/* Like / Share */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => { haptic('light'); setLiked(!liked); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors
              ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'}`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700"
          >
            <Share2 size={18} />
          </button>
        </div>
        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`flex-shrink-0 w-12 h-10 rounded-lg overflow-hidden border-2 transition-all
                  ${currentImage === i ? 'border-white' : 'border-transparent opacity-60'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== ASOSIY MA'LUMOT ===== */}
      <div className="px-4 pt-4 space-y-4">
        {/* Sarlavha + narx */}
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">{house.title}</h1>
          <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
            <MapPin size={14} />
            <span>{house.city}{house.address ? `, ${house.address}` : ''}</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-600">
            {formatPrice(house.price, house.type)}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Bed, label: 'Xona', value: house.rooms },
            { icon: Maximize, label: 'Maydon', value: `${house.area}m²` },
            { icon: Building, label: 'Qavat', value: house.floor ? `${house.floor}/${house.totalFloors || '?'}` : '—' },
            { icon: Tag, label: house.type === 'ijara' ? 'Oylik' : 'Narx', value: house.type === 'ijara' ? 'Ijara' : 'Sotish' },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <Icon size={18} className="text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
              <div className="text-[10px] text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Tavsif */}
        {house.description && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Tavsif</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{house.description}</p>
          </div>
        )}

        {/* Imkoniyatlar */}
        {house.features?.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Imkoniyatlar</h2>
            <div className="flex flex-wrap gap-2">
              {house.features.map((f, i) => (
                <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  <CheckCircle size={11} /> {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Egasi ma'lumoti */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 space-y-3">
          <h2 className="text-sm font-bold text-gray-900">Egalik ma'lumoti</h2>
          {[
            { icon: User, label: 'Egasi', value: house.owner, color: 'bg-blue-100 text-blue-600' },
            { icon: Calendar, label: 'Sana', value: house.dateAdded || '—', color: 'bg-purple-100 text-purple-600' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} />
              </div>
              <div>
                <div className="text-[10px] text-gray-400">{label}</div>
                <div className="text-sm font-semibold text-gray-900">{value}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone size={16} />
            </div>
            <div>
              <div className="text-[10px] text-gray-400">Telefon</div>
              <a href={`tel:${house.phone}`} className="text-sm font-semibold text-green-600" onClick={() => haptic('medium')}>
                {house.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Call tugmasi (Telegram bo'lmagan holatda) */}
        {!inTg && (
          <a
            href={`tel:${house.phone}`}
            onClick={() => haptic('medium')}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-green-700 transition-colors"
          >
            <Phone size={20} /> Qo'ng'iroq qilish
          </a>
        )}

        {/* Owner tugmalari */}
        {isOwner && (
          <div className="flex gap-3">
            <Link
              to={`/edit-house/${house.id}`}
              onClick={() => haptic('light')}
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-blue-700 transition-colors"
            >
              <Edit size={17} /> Tahrirlash
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-50 text-red-600 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
            >
              <Trash2 size={17} /> O'chirish
            </button>
          </div>
        )}

        {/* Pastki boʻshliq (bottom nav uchun) */}
        <div className="h-2" />
      </div>

      {/* Web uchun delete modal (Telegram holatda tgConfirm ishlatiladi) */}
      {showDeleteModal && !inTg && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Uyni o'chirish</h3>
            <p className="text-gray-500 text-sm mb-5">Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-sm"
              >
                Bekor qilish
              </button>
              <button
                onClick={async () => { setShowDeleteModal(false); await deleteHouse(house.id); navigate('/houses', { replace: true }); }}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm active:bg-red-700"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
