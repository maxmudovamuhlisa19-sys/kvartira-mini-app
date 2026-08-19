import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/houses';
import { Upload, X } from 'lucide-react';
import { haptic, tgAlert } from '../telegram';

export default function AddHouse() {
  const navigate = useNavigate();
  const { addHouse } = useHouses();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    address: '',
    city: '',
    district: '',
    price: '',
    rooms: '',
    area: '',
    floor: '',
    totalFloors: '',
    type: 'sotish',
    status: 'yangi',
    description: '',
    phone: user?.phone || '',
    owner: user?.name || '',
    features: [],
    images: [],
  });

  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const allFeatures = [
    'Balkon', 'Lift', 'Parkovka', 'Konditsioner', 'Internet',
    'Mebel', 'Smart uy', 'Garaj', 'Hovli', 'Issiqxona', 'Suv',
  ];

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title = 'Sarlavha kiritilishi shart';
    if (!form.address.trim())     e.address = 'Manzil kiritilishi shart';
    if (!form.city)               e.city = 'Shahar tanlang';
    if (!form.price || form.price <= 0) e.price = "Narx noto'g'ri";
    if (!form.rooms || form.rooms <= 0) e.rooms = "Xonalar soni noto'g'ri";
    if (!form.area  || form.area  <= 0) e.area  = "Maydon noto'g'ri";
    if (!form.description.trim()) e.description = 'Tavsif kiritilishi shart';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setForm(f => ({ ...f, images: [...f.images, imageUrl.trim()] }));
      setImageUrl('');
    }
  };

  const toggleFeature = (feat) => {
    haptic('light');
    setForm(f => ({
      ...f,
      features: f.features.includes(feat)
        ? f.features.filter(x => x !== feat)
        : [...f.features, feat],
    }));
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
      floor: Number(form.floor) || 1,
      totalFloors: Number(form.totalFloors) || 1,
      images: form.images.length > 0 ? form.images : [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      userId: user?.id,
    });

    setSubmitting(false);
    if (result?.success) {
      navigate(`/house/${result.house?.id || ''}`, { replace: true });
    } else {
      tgAlert(result?.error || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  const inp = (key) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
    ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  const Err = ({ k }) => errors[k]
    ? <p className="text-red-500 text-xs mt-1">{errors[k]}</p>
    : null;

  return (
    <div className="px-4 pt-4 pb-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Sarlavha */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sarlavha *</label>
          <input type="text" value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="Zamonaviy kvartira..."
            className={inp('title')} />
          <Err k="title" />
        </div>

        {/* Shahar + Tuman */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shahar *</label>
            <select value={form.city} onChange={e => handleChange('city', e.target.value)} className={inp('city')}>
              <option value="">Tanlang</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Err k="city" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tuman</label>
            <input type="text" value={form.district}
              onChange={e => handleChange('district', e.target.value)}
              placeholder="Tuman nomi"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Manzil */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Manzil *</label>
          <input type="text" value={form.address}
            onChange={e => handleChange('address', e.target.value)}
            placeholder="Ko'cha, uy raqami"
            className={inp('address')} />
          <Err k="address" />
        </div>

        {/* Narx, Xona, Maydon */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Narx *</label>
            <input type="number" value={form.price}
              onChange={e => handleChange('price', e.target.value)}
              placeholder="0" className={inp('price')} />
            <Err k="price" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Xona *</label>
            <input type="number" value={form.rooms}
              onChange={e => handleChange('rooms', e.target.value)}
              placeholder="1" className={inp('rooms')} />
            <Err k="rooms" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Maydon m² *</label>
            <input type="number" value={form.area}
              onChange={e => handleChange('area', e.target.value)}
              placeholder="0" className={inp('area')} />
            <Err k="area" />
          </div>
        </div>

        {/* Qavat */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Qavat</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={form.floor}
                onChange={e => handleChange('floor', e.target.value)}
                placeholder="1"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <span className="text-gray-400 text-sm">/</span>
              <input type="number" value={form.totalFloors}
                onChange={e => handleChange('totalFloors', e.target.value)}
                placeholder="9"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tur</label>
              <select value={form.type} onChange={e => handleChange('type', e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="sotish">Sotish</option>
                <option value="ijara">Ijara</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Holat</label>
              <select value={form.status} onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="yangi">Yangi</option>
                <option value="foydalanilgan">Foydalanilgan</option>
                <option value="qurilayotgan">Qurilayotgan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tavsif */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tavsif *</label>
          <textarea value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
            placeholder="Uy haqida batafsil..."
            className={inp('description')} />
          <Err k="description" />
        </div>

        {/* Imkoniyatlar */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Imkoniyatlar</label>
          <div className="flex flex-wrap gap-2">
            {allFeatures.map(feat => (
              <button key={feat} type="button"
                onClick={() => toggleFeature(feat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${form.features.includes(feat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {feat}
              </button>
            ))}
          </div>
        </div>

        {/* Rasm URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rasm URL</label>
          <div className="flex gap-2">
            <input type="url" value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="button" onClick={() => { haptic('light'); addImageUrl(); }}
              className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <Upload size={18} />
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-16 object-cover rounded-xl" />
                  <button type="button" onClick={() => { haptic('light'); setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) })); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telefon + Egasi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon</label>
            <input type="tel" value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Egasi</label>
            <input type="text" value={form.owner}
              onChange={e => handleChange('owner', e.target.value)}
              placeholder="To'liq ism"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting}
          onClick={() => !submitting && haptic('medium')}
          className={`w-full py-4 rounded-xl font-bold text-base transition-colors
            ${submitting ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white active:bg-blue-700'}`}>
          {submitting ? 'Saqlanmoqda...' : "E'lonni joylashtirish"}
        </button>
      </form>
    </div>
  );
}
