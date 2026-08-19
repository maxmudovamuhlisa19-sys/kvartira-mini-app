import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import HouseCard from '../components/HouseCard';
import { cities } from '../data/houses';
import { Search, SlidersHorizontal, X, Home } from 'lucide-react';

export default function Houses() {
  const { searchHouses } = useHouses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    rooms: searchParams.get('rooms') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
  });

  const [results, setResults] = useState([]);

  useEffect(() => {
    const filtered = searchHouses(filters);
    setResults(filtered);
  }, [filters]);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '', city: '', type: '', rooms: '',
      minPrice: '', maxPrice: '', minArea: '', maxArea: ''
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Uylar ro'yxati</h1>
        <p className="text-gray-500">{results.length} ta uy topildi</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Manzil, shahar bo'yicha qidirish..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal size={18} /> Filtr
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shahar</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Barcha shaharlar</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turi</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Barcha turlar</option>
                  <option value="sotish">Sotish</option>
                  <option value="ijara">Ijara</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xonalar soni</label>
                <select
                  value={filters.rooms}
                  onChange={(e) => handleChange('rooms', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Barchasi</option>
                  <option value="1">1 xona</option>
                  <option value="2">2 xona</option>
                  <option value="3">3 xona</option>
                  <option value="4">4+ xona</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Narx (so'm)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maydon (m²)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minArea}
                    onChange={(e) => handleChange('minArea', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxArea}
                    onChange={(e) => handleChange('maxArea', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    <X size={16} /> Filtrlarni tozalash
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Uy topilmadi</h3>
          <p className="text-gray-500">Boshqa filtrlar bilan qidirib ko'ring</p>
        </div>
      )}
    </div>
  );
}
