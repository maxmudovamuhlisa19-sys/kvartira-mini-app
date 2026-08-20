import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import HouseCard from '../components/HouseCard';
import { cities } from '../data/houses';
import { Search, SlidersHorizontal, X, Home } from 'lucide-react';
import { haptic } from '../telegram';

export default function Houses() {
  const { searchHouses, loading } = useHouses();
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

  const results = useMemo(() => searchHouses(filters), [filters, searchHouses]);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params);
  };

  const clearFilters = () => {
    haptic('light');
    const empty = { search: '', city: '', type: '', rooms: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '' };
    setFilters(empty);
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const typeButtons = [
    { value: '', label: 'Hammasi' },
    { value: 'sotish', label: '🏢 Sotish' },
    { value: 'ijara', label: '🏠 Ijara' },
  ];

  const roomButtons = [
    { value: '', label: 'Barchasi' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      {/* Search + filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Shahar, manzil bo'yicha..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
          />
        </div>
        <button
          onClick={() => { haptic('light'); setShowFilters(!showFilters); }}
          className={`relative flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-sm transition-colors
            ${showFilters ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <SlidersHorizontal size={16} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Natija soni */}
      <p className="text-xs text-gray-400 mb-3">{results.length} ta e'lon topildi</p>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 space-y-4">
          {/* Tur */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Turi</label>
            <div className="flex gap-2 flex-wrap">
              {typeButtons.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { haptic('light'); handleChange('type', value); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${filters.type === value
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Shahar */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Shahar</label>
            <select
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            >
              <option value="">Barcha shaharlar</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          {/* Xonalar */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Xonalar soni</label>
            <div className="flex gap-2">
              {roomButtons.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { haptic('light'); handleChange('rooms', value); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors
                    ${filters.rooms === value
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Narx */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Narx (so'm)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min narx"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Max narx"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          {/* Maydon */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Maydon (m²)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minArea}
                onChange={(e) => handleChange('minArea', e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxArea}
                onChange={(e) => handleChange('maxArea', e.target.value)}
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-1.5 text-red-500 text-sm font-medium py-2"
            >
              <X size={15} /> Filtrlarni tozalash
            </button>
          )}
        </div>
      )}

      {/* Natijalar */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-4 pb-4">
          {results.map(house => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Home size={32} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Uy topilmadi</h3>
          <p className="text-gray-400 text-sm">Boshqa filtrlar bilan qidirib ko'ring</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 text-amber-600 text-sm font-medium">
              Filtrlarni tozalash
            </button>
          )}
        </div>
      )}
    </div>
  );
}
