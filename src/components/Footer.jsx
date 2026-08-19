import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={24} className="text-blue-400" />
              <span className="text-xl font-bold">Kvartira.uz</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              O'zbekistondagi eng yirik uy-joy portal. Sizning uy topish jarayonini osonlashtiramiz.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Sahifalar</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Bosh sahifa</a></li>
              <li><a href="/houses" className="hover:text-white transition-colors">Uylar ro'yxati</a></li>
              <li><a href="/add-house" className="hover:text-white transition-colors">Uy qo'shish</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Shaharlar</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/houses?city=Toshkent" className="hover:text-white transition-colors">Toshkent</a></li>
              <li><a href="/houses?city=Samarqand" className="hover:text-white transition-colors">Samarqand</a></li>
              <li><a href="/houses?city=Buxoro" className="hover:text-white transition-colors">Buxoro</a></li>
              <li><a href="/houses?city=Qarshi" className="hover:text-white transition-colors">Qarshi</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Aloqa</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                +998 90 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                info@kvartira.uz
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400" />
                Toshkent shahri
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2026 Kvartira.uz. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
