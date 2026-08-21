import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { initTelegram, isTelegram } from '../telegram';

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    initTelegram();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const inTg = isTelegram();

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={inTg ? { background: 'var(--tg-bg, #f8fafc)' } : {}}
    >
      <TopBar />
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
