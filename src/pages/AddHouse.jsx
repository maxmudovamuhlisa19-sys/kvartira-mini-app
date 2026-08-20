import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/houses';
import { Camera, X } from 'lucide-react';
import { haptic, tgAlert } from '../telegram';

const MAX_IMAGES = 10;

export default function AddHouse() {
  const navigate = useNavigate();
  const { addHouse } = useHouses();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    address: '',
    city: '',
    price: '',
    rooms: '',
    area: '',
    type: 'sotish',
    description: '',
    phone: user?.phone || '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Sarlavha kiritilishi shart';
    if (!form.city) e.city = 'Shahar tanlang';
    if (!form.price || form.price <= 0) e.price = "Narx noto'g'ri";
    if (!form.rooms || form.rooms <= 0) e.rooms = "Xonalar soni noto'g'ri";
    if (!form.area || form.area <= 0) e.area = "Maydon noto'g'ri";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      tgAlert(`Faqat ${MAX_IMAGES} ta rasm yuklash mumkin!`);
      return;
    }
    const toUpload = files.slice(0, remaining);

    if (files.length > remaining) {
      tgAlert(`Faqat ${remaining} ta rasm qo'shish mumkin. ${files.length - remaining} tasi tashlab yuborildi.`);
    }

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
    if (!validate()) {
      haptic('error');
      return;
    }
    setSubmitting(true);
    haptic('medium');

    const result = await addHouse({
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      area: Number(form.area),
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      userId: user?.id,
    });

    setSubmitting(false);
    if (result?.success) {
      navigate(`/house/${result.house?.id || ''}`, { replace: true });
    } else {
      tgAlert(result?.error || "Xatolik yuz berdi");
    }
  };

  const inp = (key) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all
    ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="px-4 pt-4 pb-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Rasmlar */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Rasmlar ({images.length}/{MAX_IMAGES})
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= MAX_IMAGES}
            className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors
              ${images.length >= MAX_IMAGES
                ? 'border-gray-200 bg-gray-50 text-gray-400'
                : 'border-amber-300 bg-amber-50 text-amber-600 active:bg-amber-100'
              }`}
          >
            {uploading ? (
              <span className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={28} />
            )}
            <span className="text-sm font-medium">
              {uploading ? 'Yuklanmoqda...' : images.length >= MAX_IMAGES ? 'Limit tugadi' : 'Rasm yuklash'}
            </span>
            {!uploading && images.length < MAX_IMAGES && (
              <span className="text-xs text-gray-400">JPG, PNG, WebP — maks. 5 MB</span>
            )}
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

        {/* Sarlavha */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sarlavha *</label>
          <input type="text" value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Zamonaviy kvartira..."
            className={inp('title')} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Shahar */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shahar *</label>
          <select value={form.city} onChange={e => handleChange('city', e.target.value)} className={inp('city')}>
            <option value="">Tanlang</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        {/* Manzil */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Manzil</label>
          <input type="text" value={form.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="Ko'cha, uy raqami"
            className={inp('address')} />
        </div>

        {/* Narx, Xona, Maydon */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Narx *</label>
            <input type="number" value={form.price}
              onChange={e => handleChange('price', e.target.value)}
              placeholder="0" className={inp('price')} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Xona *</label>
            <input type="number" value={form.rooms}
              onChange={e => handleChange('rooms', e.target.value)}
              placeholder="1" className={inp('rooms')} />
            {errors.rooms && <p className="text-red-500 text-xs mt-1">{errors.rooms}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">m² *</label>
            <input type="number" value={form.area}
              onChange={e => handleChange('area', e.target.value)}
              placeholder="0" className={inp('area')} />
            {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
          </div>
        </div>

        {/* Tur */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Turi</label>
            <select value={form.type} onChange={e => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none">
              <option value="sotish">Sotish</option>
              <option value="ijara">Ijara</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon</label>
            <input type="tel" value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
          </div>
        </div>

        {/* Tavsif */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tavsif</label>
          <textarea value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            placeholder="Uy haqida batafsil..."
            className={inp('description')} />
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting || uploading}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors
            ${submitting ? 'bg-gray-300 text-gray-500' : 'bg-amber-500 text-white active:bg-amber-600'}`}>
          {submitting ? 'Saqlanmoqda...' : "E'lonni joylashtirish"}
        </button>
      </form>
    </div>
  );
}
