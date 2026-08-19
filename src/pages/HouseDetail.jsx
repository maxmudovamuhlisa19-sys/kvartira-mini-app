import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Bed, Maximize, Building, Tag, Phone, User, Calendar, ArrowLeft, Edit, Trash2, Heart, Share2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

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
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Yuklanmoqda...</div>;
  }

  if (!house) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uy topilmadi</h2>
        <Link to="/houses" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Uylar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  const images = house.images && house.images.length ? house.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'];

  const isOwner = user && user.id === house.userId;

  const handleDelete = async () => {
    await deleteHouse(house.id);
    navigate('/houses');
  };

  const formatPrice = (price, type) => {
    const p = Number(price) || 0;
    if (type === 'ijara') return `${p.toLocaleString()} so'm/oy`;
    return `${p.toLocaleString()} so'm`;
  };

  const statusColors = {
    yangi: 'bg-green-100 text-green-700',
    foydalanilgan: 'bg-yellow-100 text-yellow-700',
    qurilayotgan: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={20} /> Orqaga
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img
              src={images[currentImage]}
              alt={house.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`${house.type === 'sotish' ? 'bg-blue-600' : 'bg-purple-600'} text-white text-sm font-semibold px-4 py-1.5 rounded-full`}>
                {house.type === 'sotish' ? 'Sotish' : 'Ijara'}
              </span>
              {house.status && (
                <span className={`${statusColors[house.status] || 'bg-gray-100 text-gray-700'} text-sm font-semibold px-4 py-1.5 rounded-full`}>
                  {house.status === 'yangi' ? 'Yangi' : house.status === 'foydalanilgan' ? 'Foydalanilgan' : 'Qurilayotgan'}
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentImage === i ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{house.title}</h1>

            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <MapPin size={18} />
              <span className="text-lg">{house.address}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Bed size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{house.rooms}</div>
                <div className="text-sm text-gray-500">Xonalar</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Maximize size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{house.area} m²</div>
                <div className="text-sm text-gray-500">Maydon</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Building size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{house.floor}{house.totalFloors ? `/${house.totalFloors}` : ''}</div>
                <div className="text-sm text-gray-500">Qavat</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <Tag size={24} className="text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-gray-900">{formatPrice(house.price, house.type)}</div>
                <div className="text-sm text-gray-500">{house.type === 'ijara' ? 'Oylik' : 'Narx'}</div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Tavsif</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{house.description}</p>

            {house.features && house.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Imkoniyatlar</h2>
                <div className="flex flex-wrap gap-2">
                  {house.features.map((feature, i) => (
                    <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      <CheckCircle size={14} /> {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-3xl font-extrabold text-blue-600 mb-1">
                {formatPrice(house.price, house.type)}
              </div>
              <div className="text-gray-500 text-sm flex items-center justify-center gap-1">
                <MapPin size={14} /> {house.city}{house.district ? `, ${house.district}` : ''}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Egasi</div>
                  <div className="font-semibold text-gray-900">{house.owner}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Telefon</div>
                  <a href={`tel:${house.phone}`} className="font-semibold text-green-600 hover:text-green-700">
                    {house.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar size={18} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Qo'shilgan sana</div>
                  <div className="font-semibold text-gray-900">{house.dateAdded || '—'}</div>
                </div>
              </div>
            </div>

            <a
              href={`tel:${house.phone}`}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Phone size={20} /> Qo'ng'iroq qilish
            </a>

            {isOwner && (
              <div className="flex gap-3">
                <Link
                  to={`/edit-house/${house.id}`}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> Tahrirlash
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> O'chirish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Uyni o'chirish</h3>
            <p className="text-gray-500 mb-6">Haqiqatan ham bu uyeni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
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
