'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/app/app-layout';
import { createApiClient } from '@/lib/api-client';
import Image from 'next/image';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  avatarUrl: string;
  reputationScore: number;
  portfolioImages: Array<{ id: string; imageUrl: string }>;
  user: { id: string; email: string };
}

const CATEGORIES = [
  { id: 1, name: 'Tous', icon: '🌐' },
  { id: 2, name: 'Design', icon: '🎨' },
  { id: 3, name: 'Développement', icon: '💻' },
  { id: 4, name: 'Marketing', icon: '📱' },
  { id: 5, name: 'Rédaction', icon: '✍️' },
  { id: 6, name: 'Formation', icon: '🎓' },
  { id: 7, name: 'Consultation', icon: '💼' },
  { id: 8, name: 'Coaching', icon: '⭐' },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadProfiles();
  }, [searchQuery]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);

      const response = await apiClient.get(`/profile/search?${params}`);
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async (profile: UserProfile) => {
    try {
      setActionLoading(profile.user.id);
      const response = await apiClient.post('/messages/conversations', {
        otherUserId: profile.user.id,
      });
      router.push(`/messages?conversationId=${response.data.id}`);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      alert('Erreur lors de la création de la conversation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMatch = async (profile: UserProfile, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setActionLoading(profile.user.id);
      const response = await apiClient.post('/match/like', {
        targetUserId: profile.user.id,
      });

      if (response.data.status === 'MATCHED') {
        alert('🎉 Match mutuel! Vous pouvez maintenant discuter!');
      }
    } catch (error: any) {
      console.error('Error liking user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = (profile: UserProfile) => {
    router.push(`/profile/${profile.id}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header Section */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title & Subtitle */}
            <div className="py-6">
              <h1 className="text-4xl font-bold text-gray-900">Découvrir</h1>
              <p className="text-gray-600 mt-1">
                Trouvez les talents et les compétences qui correspondent à vos besoins
              </p>
            </div>

            {/* Search Bar */}
            <div className="pb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par compétence, nom, ou service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm text-gray-900 placeholder-gray-500"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="pb-6 -mx-4 sm:mx-0 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 px-4 sm:px-0 min-w-max">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === cat.name
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Chargement des profils...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun profil trouvé</h2>
              <p className="text-gray-600 text-center max-w-sm">
                Essayez de modifier votre recherche ou explorez d'autres catégories
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-8 font-medium">
                {profiles.length} profil{profiles.length > 1 ? 's' : ''} disponible{profiles.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleViewProfile(profile)}
                  >
                    {/* Image Container */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      {profile.avatarUrl ? (
                        <img
                          src={`http://localhost:3001${profile.avatarUrl}`}
                          alt={profile.firstName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-300">
                          👤
                        </div>
                      )}

                      {/* Reputation Badge */}
                      <div className="absolute top-3 right-3 bg-white shadow-lg px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-gray-900 text-sm">
                            {profile.reputationScore ? profile.reputationScore.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </div>

                      {/* Gradient Overlay at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Container */}
                    <div className="p-4">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {profile.firstName} {profile.lastName}
                      </h3>

                      {/* Location */}
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        📍 {profile.location}
                      </p>

                      {/* Bio Preview */}
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2 min-h-10">
                        {profile.bio || 'Pas de description'}
                      </p>

                      {/* Skills/Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          💼 Actif
                        </span>
                        {profile.reputationScore && profile.reputationScore >= 4 && (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            ✓ Vérifié
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessage(profile);
                          }}
                          disabled={actionLoading === profile.user.id}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === profile.user.id ? '⏳' : '💬'}
                        </button>
                        <button
                          onClick={(e) => handleMatch(profile, e)}
                          disabled={actionLoading === profile.user.id}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === profile.user.id ? '⏳' : '❤️'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
