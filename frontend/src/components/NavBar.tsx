import { FC } from 'react';
import Link from 'next/link';

interface NavBarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

const NavBar: FC<NavBarProps> = ({ isAuthenticated, userName }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span className="text-2xl">🎯</span>
          Kyndex
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 flex-1 ml-12">
          <Link href="/services" className="text-gray-700 font-medium hover:text-blue-600 transition">
            Services
          </Link>
          <Link href="/discover" className="text-gray-700 font-medium hover:text-blue-600 transition">
            Découvrir
          </Link>
          <Link href="/messages" className="text-gray-700 font-medium hover:text-blue-600 transition">
            Messages
          </Link>
        </div>

        {/* Auth/Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium text-gray-900">{userName || 'Profil'}</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-gray-700 font-medium hover:text-blue-600 transition">
                Connexion
              </Link>
              <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
