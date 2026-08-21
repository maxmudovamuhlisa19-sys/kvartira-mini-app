import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Plus, User } from 'lucide-react';
import { haptic } from '../telegram';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname;

  const isActive = (href) => {
    if (href === '/') return path === '/';
    return path.startsWith(href);
  };

  const items = [
    { href: '/', icon: Home, label: 'Bosh sahifa' },
    { href: '/houses', icon: Search, label: 'Qidirish' },
    { href: user ? '/add-house' : '/login', icon: Plus, label: 'E\'lon', special: true },
    { href: user ? '/profile' : '/login', icon: User, label: user ? user.name.split(' ')[0] : 'Kirish' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {items.map(({ href, icon: Icon, label, special }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              onClick={() => haptic('light')}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5
                ${special ? 'relative' : active ? 'text-amber-600' : 'text-gray-400'}`}
            >
              {special ? (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md
                  ${active ? 'bg-amber-600 scale-95' : 'bg-amber-500'}`}>
                  <Icon size={20} className="text-white" />
                </div>
              ) : (
                <>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium truncate max-w-[50px]">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
