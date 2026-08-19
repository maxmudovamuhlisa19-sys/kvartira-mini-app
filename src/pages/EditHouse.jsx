import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/houses';
import { Upload, X, Edit } from 'lucide-react';

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
    features: [], images: []
  });

  const [imageUrl, setImageUrl] = useState('');

  const allFeatures = [
    'Balkon', 'Lift', 'Parkovka', 'Konditsioner', 'Internet',
    'Mebel', 'Smart uy', 'Garaj', 'Hovli', 'Issiqxona', 'Suv'
  ];

  useEffect(() => {
    if (house) {
      if (user && user.id !== house.userId) {
        navigate('/');
        return;
      }
      setForm({
        title: house.title,
        address: house.address,
        city: house.city,
        district: house.district || '',
        price: house.price,
        rooms: house.rooms,
        area: house.area,
        floor: house.floor,
        totalFloors: house.totalFloors,
        type: house.type,
        status: house.status,
        description: house.description,
        phone: house.phone,
        owner: house.owner,
        features: house.features || [],
        images: house.images || []
      });
    }
  }, [house]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Yuklanmoqda...</div>;
  }

  if (!house) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uy topilmadi</h2>
      </div>
    );
  }

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setForm({ ...form, images: [...form.images, imageUrl.trim()] });
      setImageUrl('');
    }
  };

  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const toggleFeature = (feature) => {
    const features = form.features.includes(feature)
      ? form.features.filter(f => f !== feature)
      : [...form.features, feature];
    setForm({ ...form, features });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateHouse(house.id, {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      area: Number(form.area),
      floor: Number(form.floor) || 1,
      totalFloors: Number(form.totalFloors) || 1,
    });
    navigate(`/house/${house.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Edit size={24} className="text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Uyni tahrirlash</h1>
            <p className="text-gray-500 text-sm">E'lon ma'lumotlarini yangilang</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sarlavha</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shahar</label>
              <select value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Shahar tanlang</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tuman</label>
              <input type="text" value={form.district} onChange={(e) => handleChange('district', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manzil</label>
            <input type="text" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narx (so'm)</label>
              <input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xonalar</label>
              <input type="number" value={form.rooms} onChange={(e) => handleChange('rooms', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maydon (m²)</label>
              <input type="number" value={form.area} onChange={(e) => handleChange('area', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qavat</label>
              <div className="flex gap-2">
                <input type="number" value={form.floor} onChange={(e) => handleChange('floor', e.target.value)} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                <span className="self-center text-gray-400">/</span>
                <input type="number" value={form.totalFloors} onChange={(e) => handleChange('totalFloors', e.target.value)} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tur</label>
              <select value={form.type} onChange={(e) => handleChange('type', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="sotish">Sotish</option>
                <option value="ijara">Ijara</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Holat</label>
              <select value={form.status} onChange={(e) => handleChange('status', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="yangi">Yangi</option>
                <option value="foydalanilgan">Foydalanilgan</option>
                <option value="qurilayotgan">Qurilayotgan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Imkoniyatlar</label>
            <div className="flex flex-wrap gap-2">
              {allFeatures.map(feature => (
                <button key={feature} type="button" onClick={() => toggleFeature(feature)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    form.features.includes(feature) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {feature}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rasmlar (URL)</label>
            <div className="flex gap-2 mb-3">
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="button" onClick={addImageUrl} className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Upload size={20} />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-24 h-20 object-cover rounded-xl" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Egasi</label>
              <input type="text" value={form.owner} onChange={(e) => handleChange('owner', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-4 rounded-xl border border-gray-200 font-bold text-lg hover:bg-gray-50 transition-colors">
              Bekor qilish
            </button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
