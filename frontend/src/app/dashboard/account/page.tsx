'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gérer mon compte</h1>
          <p className="text-gray-600 mt-2">{user?.email}</p>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-semibold text-gray-900">Informations personnelles</h3>
          <p className="text-sm text-gray-600 mt-2">Complétez et mettez à jour votre identité</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl mb-2">💰</div>
          <h3 className="font-semibold text-gray-900">Mon solde</h3>
          <p className="text-sm text-gray-600 mt-2">($0.00)</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="text-2xl mb-2">🎟️</div>
          <h3 className="font-semibold text-gray-900">Mes tickets CESU</h3>
          <p className="text-sm text-gray-600 mt-2">Aucun ticket disponible</p>
        </div>
      </div>

      {/* Account Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👤</span>
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complétez et mettez à jour votre identité pour faciliter les échanges
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Modifier →
            </button>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💳</span>
              <h3 className="text-lg font-semibold text-gray-900">Moyens de paiement</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Gérez vos moyens de paiement
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Ajouter un moyen →
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔔</span>
              <h3 className="text-lg font-semibold text-gray-900">Gérer mes notifications</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez la façon dont vous souhaite être contacté
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Paramétrer →
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Balance */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💰</span>
              <h3 className="text-lg font-semibold text-gray-900">Mon solde ($0.00)</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Consultez les paiements et remboursements effectués
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Consulter →
            </button>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📄</span>
              <h3 className="text-lg font-semibold text-gray-900">Documents et factures</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez tous les documents disponibles
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Accéder →
            </button>
          </div>

          {/* Security */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-semibold text-gray-900">Confiance et sécurité</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sécurité, qualité, fiabilité, tout a été pensé pour vous
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              En savoir plus →
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t-2 border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Compte</h3>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-semibold"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
