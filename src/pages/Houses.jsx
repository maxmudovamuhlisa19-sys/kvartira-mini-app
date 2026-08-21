import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHouses } from '../context/HouseContext';
import HouseCard from '../components/HouseCard';
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
    const empty = { search: '', city: 'Navoiy', type: '', rooms: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '' };
    setFilters(empty);
    setSearchParams({ city: 'Navoiy' });
  };

  const hasActiveFilters = filters.type || filters.rooms || filters.minPrice || filters.maxPrice || filters.minArea || filters.maxArea;

  const typeButtons = [
    { value: '', label: 'Hammasi' },
    { value: 'sotish', label: 'Sotish' },
    { value: 'ijara', label: 'Ijara' },
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
      <div className="flex flex-col gap-5 px-5 pt-5">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-5 pt-5 pb-6">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5">E'lonlar</h1>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => { haptic('light'); setShowFilters(!showFilters); }}
            className={`relative flex items-center gap-1.5 px-5 py-3.5 rounded-xl font-medium text-sm transition-colors
              ${showFilters ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
          >
            <SlidersHorizontal size={18} />
            {hasActiveFilters && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Type filter */}
        <div className="flex gap-3 mb-5">
          {typeButtons.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { haptic('light'); handleChange('type', value); }}
              className={`flex-1 py-3 rounded-xl text-base font-semibold transition-colors
                ${filters.type === value
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 space-y-5">
            {/* Xonalar */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-3">Xonalar soni</label>
              <div className="flex gap-3">
                {roomButtons.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { haptic('light'); handleChange('rooms', value); }}
                    className={`flex-1 py-3 rounded-xl text-base font-medium transition-colors
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
              <label className="block text-sm font-semibold text-gray-500 mb-3">Narx (so'm)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Dan"
                  value={filters.minPrice}
                  onChange={(e) => handleChange('minPrice', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-400 outline-none"
                />
                <input
                  type="number"
                  placeholder="Gacha"
                  value={filters.maxPrice}
                  onChange={(e) => handleChange('maxPrice', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Maydon */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-3">Maydon (m²)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Dan"
                  value={filters.minArea}
                  onChange={(e) => handleChange('minArea', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-400 outline-none"
                />
                <input
                  type="number"
                  placeholder="Gacha"
                  value={filters.maxArea}
                  onChange={(e) => handleChange('maxArea', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-1.5 text-red-500 text-base font-medium py-2"
              >
                <X size={16} /> Filtrlarni tozalash
              </button>
            )}
          </div>
        )}

        {/* Natija soni */}
        <p className="text-base text-gray-500 mb-5 font-medium">{results.length} ta e'lon topildi</p>

        {/* Natijalar */}
        {results.length > 0 ? (
          <div className="flex flex-col gap-6">
            {results.map(house => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Home size={32} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">E'lon topilmadi</h3>
            <p className="text-gray-400 text-sm">Boshqa filtrlar bilan qidirib ko'ring</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 text-amber-600 text-base font-semibold">
                Filtrlarni tozalash
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
