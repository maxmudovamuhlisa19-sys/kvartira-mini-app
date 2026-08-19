import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const HouseContext = createContext(null);

const API = '/api';

export function HouseProvider({ children }) {
  const { user } = useAuth();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/houses`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setHouses(data);
      }
    } catch {
      console.error('Houses fetch error:');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchHouses(), 0);
  }, [fetchHouses]);

  const addHouse = async (house) => {
    try {
      const res = await fetch(`${API}/houses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...house, userId: user?.id })
      });
      const data = await res.json();
      if (data.success) {
        setHouses([data.house, ...houses]);
        return { success: true, house: data.house };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: "Server bilan bog'lanib bo'lmadi." };
    }
  };

  const updateHouse = async (id, updates) => {
    try {
      await fetch(`${API}/houses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setHouses(houses.map(h => h.id === Number(id) ? { ...h, ...updates } : h));
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const deleteHouse = async (id) => {
    try {
      await fetch(`${API}/houses/${id}`, { method: 'DELETE' });
      setHouses(houses.filter(h => h.id !== Number(id)));
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const getHouse = (id) => {
    return houses.find(h => h.id === Number(id));
  };

  const searchHouses = (filters) => {
    return houses.filter(house => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!house.title.toLowerCase().includes(searchLower) &&
            !house.address?.toLowerCase().includes(searchLower) &&
            !house.city.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.city && house.city !== filters.city) return false;
      if (filters.type && house.type !== filters.type) return false;
      if (filters.rooms && house.rooms !== Number(filters.rooms)) return false;
      if (filters.minPrice && house.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && house.price > Number(filters.maxPrice)) return false;
      if (filters.minArea && house.area < Number(filters.minArea)) return false;
      if (filters.maxArea && house.area > Number(filters.maxArea)) return false;
      return true;
    });
  };

  return (
    <HouseContext.Provider value={{ houses, loading, addHouse, updateHouse, deleteHouse, getHouse, searchHouses, fetchHouses }}>
      {children}
    </HouseContext.Provider>
  );
}

export function useHouses() {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouses must be used within HouseProvider');
  }
  return context;
}