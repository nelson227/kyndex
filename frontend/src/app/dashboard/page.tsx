'use client';

import { useEffect, useState, useMemo } from 'react';
import { createApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  reputationScore: number;
  user: { id: string; email: string };
}

const CATEGORIES = [
  { name: 'Hiver', icon: '☃️' },
  { name: 'Bricolage', icon: '🔧' },
  { name: 'Jardinage', icon: '🌿' },
  { name: 'Déménagement', icon: '📦' },
  { name: 'Ménage', icon: '🧹' },
  { name: 'Enfants', icon: '👶' },
  { name: 'Animaux', icon: '🐾' },
  { name: 'Informatique', icon: '💻' },
];

const SUGGESTED_SERVICES = [
  {
    id: 1,
    title: 'Aide au déménagement',
    icon: '📦',
    color: 'from-teal-400 to-teal-200'
  },
  {
    id: 2,
    title: 'Pose de lampes et luminaires',
    icon: '💡',
    color: 'from-yellow-400 to-yellow-200'
  },
  {
    id: 3,
    title: 'Assemblage de meubles',
    icon: '🛋️',
    color: 'from-rose-400 to-rose-200'
  },
  {
    id: 4,
    title: 'Ménage à domicile',
    icon: '🧹',
    color: 'from-blue-400 to-blue-200'
  },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/profile/search');
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {user?.firstName}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.email}
          </p>
        </div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="text-2xl mb-2">👤</div>
          <h3 className="font-semibold text-gray-900 mb-1">Profil</h3>
          <p className="text-sm text-gray-600">Voir votre profil complèt</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="text-2xl mb-2">💰</div>
          <h3 className="font-semibold text-gray-900 mb-1">Mon solde</h3>
          <p className="text-sm text-gray-600">$0.00</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="text-2xl mb-2">⭐</div>
          <h3 className="font-semibold text-gray-900 mb-1">Notation</h3>
          <p className="text-sm text-gray-600">Pas encore d'évaluation</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories populaires</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition text-center"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Services */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Les plus demandés en ce moment
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUGGESTED_SERVICES.map((service) => (
            <div
              key={service.id}
              className={`bg-gradient-to-br ${service.color} p-12 rounded-xl text-white flex flex-col items-center justify-center min-h-48 cursor-pointer hover:shadow-xl transition`}
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h3 className="font-semibold text-center text-sm">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Available Professionals */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Prestataires verifiés</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            Voir tous →
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">Aucun prestataire disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.slice(0, 8).map((profile) => (
              <div
                key={profile.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl">
                  👤
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {profile.location}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3 mb-3">
                    <div className="flex text-yellow-400">
                      ⭐{profile.reputationScore ? profile.reputationScore.toFixed(1) : '0.0'}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {profile.bio || 'Pas de description'}
                  </p>

                  {/* Button */}
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                    Voir le profil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
