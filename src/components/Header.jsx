import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Plus, User, LogOut, Menu, X, Building2 } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-amber-600 font-bold text-xl hover:text-amber-700 transition-colors">
            <Building2 size={28} />
            <span>Hamroh</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors font-medium">
              <Home size={18} /> Bosh sahifa
            </Link>
            <Link to="/houses" className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors font-medium">
              <Search size={18} /> Uylar
            </Link>
            {user && (
              <Link to="/add-house" className="flex items-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                <Plus size={18} /> Qo'shish
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors font-medium">
                  <User size={18} /> {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors font-medium">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-amber-600 transition-colors font-medium">
                  Kirish
                </Link>
                <Link to="/register" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t">
            <nav className="flex flex-col gap-2 pt-4">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Home size={18} /> Bosh sahifa
              </Link>
              <Link to="/houses" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Search size={18} /> Uylar
              </Link>
              {user && (
                <Link to="/add-house" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg font-medium">
                  <Plus size={18} /> Uy qo'shish
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <User size={18} /> Profil
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut size={18} /> Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <User size={18} /> Kirish
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg font-medium">
                    Ro'yxatdan o'tish
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
