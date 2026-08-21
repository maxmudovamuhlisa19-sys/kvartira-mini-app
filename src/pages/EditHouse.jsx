import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/houses';
import { Camera, X } from 'lucide-react';
import { haptic, tgAlert } from '../telegram';

const MAX_IMAGES = 10;

function getFormFromHouse(house) {
  return {
    title: house?.title || '',
    address: house?.address || '',
    city: house?.city || '',
    price: house?.price || '',
    rooms: house?.rooms || '',
    type: house?.type || 'sotish',
    description: house?.description || '',
    phone: house?.phone || '',
    owner: house?.owner || '',
  };
}

export default function EditHouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHouse, updateHouse, loading } = useHouses();
  const { user } = useAuth();
  const house = getHouse(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => getFormFromHouse(house));
  const [images, setImages] = useState(() => house?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="bg-gray-200 rounded-xl h-14 animate-pulse" />)}
      </div>
    );
  }

  if (!house) {
    return (
      <div className="flex flex-col items-center py-20 px-4 text-center">
        <p className="text-gray-400">Uy topilmadi</p>
      </div>
    );
  }

  if (user && user.id !== house.userId && user.id !== house.ownerId) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      tgAlert(`Faqat ${MAX_IMAGES} ta rasm yuklash mumkin!`);
      return;
    }
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    haptic('medium');

    const formData = new FormData();
    toUpload.forEach(f => formData.append('images', f));

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.urls) {
        setImages(prev => [...prev, ...data.urls].slice(0, MAX_IMAGES));
      } else {
        tgAlert(data.error || 'Rasm yuklashda xatolik');
      }
    } catch {
      tgAlert("Server bilan bog'lanib bo'lmadi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    haptic('light');
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    haptic('medium');
    await updateHouse(house.id, {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      images,
    });
    setSubmitting(false);
    navigate(`/house/${house.id}`, { replace: true });
  };

  const inp = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none';

  return (
    <div className="px-4 pt-4 pb-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Rasmlar */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Rasmlar ({images.length}/{MAX_IMAGES})
          </label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= MAX_IMAGES}
            className={`w-full py-6 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-colors
              ${images.length >= MAX_IMAGES
                ? 'border-gray-200 bg-gray-50 text-gray-400'
                : 'border-amber-300 bg-amber-50 text-amber-600 active:bg-amber-100'}`}>
            {uploading ? (
              <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={22} />
            )}
            <span className="text-sm font-medium">{uploading ? 'Yuklanmoqda...' : 'Rasm qo\'shish'}</span>
          </button>
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-full h-16 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sarlavha</label>
          <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} className={inp} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shahar</label>
            <select value={form.city} onChange={e => handleChange('city', e.target.value)} className={inp}>
              <option value="">Tanlang</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Turi</label>
            <select value={form.type} onChange={e => handleChange('type', e.target.value)} className={inp}>
              <option value="sotish">Sotish</option>
              <option value="ijara">Ijara</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Manzil</label>
          <input type="text" value={form.address} onChange={e => handleChange('address', e.target.value)} className={inp} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Narx</label>
            <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Xona</label>
            <input type="number" value={form.rooms} onChange={e => handleChange('rooms', e.target.value)} className={inp} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon</label>
          <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className={inp} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Egasi</label>
          <input type="text" value={form.owner} onChange={e => handleChange('owner', e.target.value)} className={inp} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tavsif</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={inp} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 bg-white active:bg-gray-50">
            Bekor qilish
          </button>
          <button type="submit" disabled={submitting || uploading}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors
              ${submitting ? 'bg-gray-300 text-gray-500' : 'bg-amber-500 text-white active:bg-amber-600'}`}>
            {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}
