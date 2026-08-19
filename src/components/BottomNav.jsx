import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { haptic } from '../telegram';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const isActive = (href) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Bosh sahifa' },
    { href: '/houses', icon: Search, label: 'Qidirish' },
    { href: user ? '/add-house' : '/login', icon: Plus, label: 'E\'lon', special: true },
    { href: user ? '/profile' : '/login', icon: User, label: user ? user.name.split(' ')[0] : 'Kirish' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label, special }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              onClick={() => haptic('light')}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors
                ${special
                  ? 'relative'
                  : active
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {special ? (
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all
                  ${active ? 'bg-blue-700 scale-95' : 'bg-blue-600'}`}>
                  <Icon size={24} className="text-white" />
                </div>
              ) : (
                <>
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                  <span className={`text-[10px] font-medium truncate max-w-[60px] ${active ? 'text-blue-600' : ''}`}>
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
