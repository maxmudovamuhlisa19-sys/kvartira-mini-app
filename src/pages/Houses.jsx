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
    type: searchParams.get('type') || '',
    rooms: searchParams.get('rooms') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
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
    setFilters({ search: '', type: '', rooms: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.type || filters.rooms || filters.minPrice || filters.maxPrice;

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-3 pb-6">
        {/* Search */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>
          <button
            onClick={() => { haptic('light'); setShowFilters(!showFilters); }}
            className={`relative flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors
              ${showFilters ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
          >
            <SlidersHorizontal size={16} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Type + Natija */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5 flex-1">
            {[
              { value: '', label: 'Hammasi' },
              { value: 'sotish', label: 'Sotish' },
              { value: 'ijara', label: 'Ijara' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { haptic('light'); handleChange('type', value); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${filters.type === value ? 'bg-amber-500 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{results.length} ta</span>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-3">
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-400 flex-shrink-0">Xona:</span>
              <div className="flex gap-1.5 flex-1">
                {[
                  { value: '', label: 'Barchasi' },
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4+' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { haptic('light'); handleChange('rooms', value); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                      ${filters.rooms === value ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Dan</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleChange('minPrice', e.target.value)}
                  className="w-full pl-10 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">Gacha</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleChange('maxPrice', e.target.value)}
                  className="w-full pl-14 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center px-2 py-2 rounded-lg bg-red-50 text-red-500">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Natijalar */}
        {results.length > 0 ? (
          <div className="flex flex-col gap-2">
            {results.map(house => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Home size={28} className="text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Topilmadi</h3>
            <p className="text-gray-400 text-xs">Boshqa so'z bilan qidiring</p>
          </div>
        )}
      </div>
    </div>
  );
}
