import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isTelegram, haptic } from '../telegram';

const PAGE_TITLES = {
  '/houses': 'E\'lonlar',
  '/add-house': 'E\'lon berish',
  '/profile': 'Profil',
  '/login': 'Kirish',
  '/register': 'Ro\'yxatdan o\'tish',
};

function getTitle(pathname) {
  if (PAGE_TITLES[pathname] !== undefined) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/house/')) return 'E\'lon';
  if (pathname.startsWith('/edit-house/')) return 'Tahrirlash';
  return null;
}

function needsBack(pathname) {
  return (
    pathname.startsWith('/house/') ||
    pathname.startsWith('/edit-house/') ||
    pathname === '/add-house' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/profile'
  );
}

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitle(location.pathname);
  const showBack = needsBack(location.pathname);
  const inTg = isTelegram();

  const handleBack = () => {
    haptic('light');
    navigate(-1);
  };

  if (!showBack && !title) return null;

  return (
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100"
      style={{ paddingTop: inTg ? 'env(safe-area-inset-top, 0px)' : '0' }}
    >
      <div className="flex items-center h-11 px-3 gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 active:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {title && (
          <h1 className="flex-1 text-sm font-bold text-gray-900 truncate">
            {title}
          </h1>
        )}
      </div>
    </header>
  );
}
