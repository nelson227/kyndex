'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  { id: 'home', label: 'Accueil', icon: '🏠', href: '/dashboard' },
  { id: 'requests', label: 'Mes demandes', icon: '📋', href: '/dashboard/requests' },
  { id: 'messages', label: 'Messagerie', icon: '💬', href: '/dashboard/messages' },
  { id: 'account', label: 'Compte', icon: '👤', href: '/dashboard/account' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isInitialized, logout } = useAuth();

  // Redirection si non authentifié
  if (isInitialized && !user) {
    router.push('/auth/login');
    return null;
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Chargement...</h1>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Kyndex
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Section Inviter des amis */}
        <div className="p-4 mx-4 border-t border-gray-200 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">Inviter des amis</p>
            <p className="text-xs text-gray-600 mb-3">
              Gagnez 5% du montant dépensé par vos amis
            </p>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">
              En savoir plus →
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition text-sm border border-gray-200"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <div></div>
            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition flex items-center gap-2">
              <span>+</span> Demander un service
            </button>
            <div className="flex items-center gap-4">
              <button className="relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
