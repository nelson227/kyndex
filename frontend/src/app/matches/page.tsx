'use client';

import { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/app/app-layout';
import { createApiClient } from '@/lib/api-client';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
}

interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

interface Match {
  id: string;
  userA: User;
  userB: User;
  status: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/match/mutual');
      setMatches(response.data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  const currentMatch = matches.find((m) => m.id === selectedMatchId);
  
  // Get the other user (not current user) from the match
  const getOtherUser = (match: Match) => {
    const currentUserId = localStorage.getItem('userId');
    if (!match.userA || !match.userB) {
      return null;
    }
    return match.userA.id === currentUserId ? match.userB : match.userA;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-40">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Mes Matches</h1>
            <p className="text-gray-600 text-sm">
              {matches.length} match{matches.length > 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-600">Chargement des matches...</p>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pas de matches encore
              </h2>
              <p className="text-gray-600">
                Découvrez des profils et trouvez vos matches!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Matches List */}
              <div className="md:col-span-1">
                <div className="space-y-2">
                  {matches.map((match) => {
                    const otherUser = getOtherUser(match);
                    return (
                      <button
                        key={match.id}
                        onClick={() => setSelectedMatchId(match.id)}
                        className={`w-full p-4 bg-white rounded-lg border-2 transition text-left ${
                          selectedMatchId === match.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-3 items-center">
                          {otherUser?.profile?.avatarUrl ? (
                            <img
                              src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                              alt={otherUser.profile.firstName}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg flex-shrink-0">
                              👤
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">
                              {otherUser?.profile?.bio || 'Sans bio'}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Match Details */}
              <div className="md:col-span-2">
                {!selectedMatchId || !currentMatch ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">👋</div>
                    <p className="text-gray-600">
                      Sélectionnez un match pour voir les détails
                    </p>
                  </div>
                ) : (() => {
                  const otherUser = getOtherUser(currentMatch);
                  return (
                    <div className="bg-white rounded-lg p-6 space-y-6">
                      {/* Profile Card */}
                      <div className="text-center">
                        {otherUser?.profile?.avatarUrl ? (
                          <img
                            src={`http://localhost:3001${otherUser.profile.avatarUrl}`}
                            alt={otherUser.profile.firstName}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-5xl mx-auto mb-4">
                            👤
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-900">
                          {otherUser?.profile?.firstName} {otherUser?.profile?.lastName}
                        </h2>
                        <p className="text-gray-600 text-sm mt-2">{otherUser?.email}</p>
                      </div>

                      {/* Bio */}
                      {otherUser?.profile?.bio && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            À propos:
                          </p>
                          <p className="text-gray-900">{otherUser.profile.bio}</p>
                        </div>
                      )}

                      {/* Status */}
                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                        <p className="text-sm font-semibold text-green-800">
                          ✅ Match Confirmation: {currentMatch.status}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            alert('Fonctionnalité à venir!');
                          }}
                          className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                        >
                          💬 Message
                        </button>
                        <button
                          onClick={() => {
                            setMatches(matches.filter((m) => m.id !== currentMatch.id));
                            setSelectedMatchId(null);
                          }}
                          className="flex-1 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
                        >
                          ❌ Retirer
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
