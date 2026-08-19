import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { isTelegram, haptic } from '../telegram';

const PAGE_TITLES = {
  '/': null,               // Home da TopBar ko'rinmaydi (hero bor)
  '/houses': 'Uylar ro\'yxati',
  '/add-house': 'Uy qo\'shish',
  '/profile': 'Profilim',
  '/login': 'Kirish',
  '/register': 'Ro\'yxatdan o\'tish',
};

function getTitle(pathname) {
  if (PAGE_TITLES[pathname] !== undefined) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/house/')) return 'Uy haqida';
  if (pathname.startsWith('/edit-house/')) return 'Tahrirlash';
  return 'Kvartira.uz';
}

function needsBack(pathname) {
  return (
    pathname.startsWith('/house/') ||
    pathname.startsWith('/edit-house/') ||
    pathname === '/add-house' ||
    pathname === '/login' ||
    pathname === '/register'
  );
}

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitle(location.pathname);
  const showBack = needsBack(location.pathname);
  const inTg = isTelegram();

  // Home page — hero section o'zida sarlavha ko'rsatadi
  if (title === null) return null;

  const handleBack = () => {
    haptic('light');
    navigate(-1);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      style={{ paddingTop: inTg ? 'env(safe-area-inset-top, 0px)' : '0' }}
    >
      <div className="flex items-center h-14 px-4 gap-3">
        {showBack ? (
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Orqaga"
          >
            <ArrowLeft size={22} />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-blue-600">
            <Building2 size={24} />
          </div>
        )}

        <h1 className="flex-1 text-base font-bold text-gray-900 truncate">
          {showBack ? title : 'Kvartira.uz'}
        </h1>
      </div>
    </header>
  );
}
