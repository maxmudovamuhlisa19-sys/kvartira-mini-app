import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/houses';
import { Upload, X } from 'lucide-react';
import { haptic, tgAlert } from '../telegram';

export default function EditHouse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getHouse, updateHouse, loading } = useHouses();
  const { user } = useAuth();
  const house = getHouse(id);

  const [form, setForm] = useState({
    title: '', address: '', city: '', district: '', price: '',
    rooms: '', area: '', floor: '', totalFloors: '', type: 'sotish',
    status: 'yangi', description: '', phone: '', owner: '',
    features: [], images: [],
  });
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const allFeatures = [
    'Balkon', 'Lift', 'Parkovka', 'Konditsioner', 'Internet',
    'Mebel', 'Smart uy', 'Garaj', 'Hovli', 'Issiqxona', 'Suv',
  ];

  useEffect(() => {
    if (!house) return;
    // Egasini tekshirish
    if (user && user.id !== house.userId && user.id !== house.ownerId) {
      navigate('/', { replace: true });
      return;
    }
    setForm({
      title: house.title || '',
      address: house.address || '',
      city: house.city || '',
      district: house.district || '',
      price: house.price || '',
      rooms: house.rooms || '',
      area: house.area || '',
      floor: house.floor || '',
      totalFloors: house.totalFloors || '',
      type: house.type || 'sotish',
      status: house.status || 'yangi',
      description: house.description || '',
      phone: house.phone || '',
      owner: house.owner || '',
      features: house.features || [],
      images: house.images || [],
    });
  }, [house]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));

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
    setSubmitting(true);
    haptic('medium');
    await updateHouse(house.id, {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      area: Number(form.area),
      floor: Number(form.floor) || 1,
      totalFloors: Number(form.totalFloors) || 1,
    });
    setSubmitting(false);
    navigate(`/house/${house.id}`, { replace: true });
  };

  const inp = 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none';

  return (
    <div className="px-4 pt-4 pb-6">
      <form onSubmit={handleSubmit} className="space-y-4">

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
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tuman</label>
            <input type="text" value={form.district} onChange={e => handleChange('district', e.target.value)} className={inp} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Manzil</label>
          <input type="text" value={form.address} onChange={e => handleChange('address', e.target.value)} className={inp} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Narx</label>
            <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Xona</label>
            <input type="number" value={form.rooms} onChange={e => handleChange('rooms', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Maydon m²</label>
            <input type="number" value={form.area} onChange={e => handleChange('area', e.target.value)} className={inp} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Qavat (joriy/jami)</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={form.floor} onChange={e => handleChange('floor', e.target.value)} placeholder="1"
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <span className="text-gray-400 text-sm">/</span>
              <input type="number" value={form.totalFloors} onChange={e => handleChange('totalFloors', e.target.value)} placeholder="9"
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

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tavsif</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={inp} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Imkoniyatlar</label>
          <div className="flex flex-wrap gap-2">
            {allFeatures.map(feat => (
              <button key={feat} type="button" onClick={() => toggleFeature(feat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${form.features.includes(feat) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {feat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rasm URL</label>
          <div className="flex gap-2">
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..." className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="button" onClick={() => { haptic('light'); if (imageUrl.trim()) { setForm(f => ({ ...f, images: [...f.images, imageUrl.trim()] })); setImageUrl(''); } }}
              className="px-4 py-3 bg-gray-100 rounded-xl">
              <Upload size={17} />
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-16 object-cover rounded-xl" />
                  <button type="button"
                    onClick={() => { haptic('light'); setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) })); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon</label>
            <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Egasi</label>
            <input type="text" value={form.owner} onChange={e => handleChange('owner', e.target.value)} className={inp} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => { haptic('light'); navigate(-1); }}
            className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 bg-white active:bg-gray-50">
            Bekor qilish
          </button>
          <button type="submit" disabled={submitting}
            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors
              ${submitting ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white active:bg-blue-700'}`}>
            {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}
