'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Charge les données de demande avec support sessionId et userId
 */
const loadDraftData = (dataKey: string): any => {
  if (typeof window === 'undefined') return null;

  try {
    // Essayer de charger avec userId (utilisateur connecté)
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      const user = JSON.parse(kyndexUser);
      const userId = user.id?.toString() || user.email;
      
      // Chercher avec le nouveau format `user_[userId]_[dataKey]`
      const storageKey = `user_${userId}_${dataKey}`;
      const data = localStorage.getItem(storageKey);
      if (data) {
        console.log(`✓ Loaded draft data with userId: ${userId}`);
        return JSON.parse(data);
      }
    }

    // Fallback: charger depuis sessionId
    const sessionId = sessionStorage.getItem('kyndex_sessionId');
    if (sessionId) {
      const storageKey = `session_${sessionId}_${dataKey}`;
      const data = sessionStorage.getItem(storageKey);
      if (data) {
        console.log(`✓ Loaded draft data with sessionId: ${sessionId}`);
        return JSON.parse(data);
      }
    }

    return null;
  } catch (e) {
    console.error('Failed to load draft data', e);
    return null;
  }
};

interface Provider {
  id: string;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  reviews: number;
  rate: string;
  avatar: string;
  bio: string;
}

const DEMO_PROVIDERS: Provider[] = [
  // Plomberie
  { id: '1', name: 'Michel Dupont', specialty: 'Plombier Senior', category: 'Plomberie', rating: 4.9, reviews: 234, rate: '65€/h', avatar: '🔧', bio: 'Tous types de travaux' },
  { id: '2', name: 'Jean Lefebvre', specialty: 'Plomberie Urgence', category: 'Plomberie', rating: 4.8, reviews: 156, rate: '70€/h', avatar: '🚰', bio: 'Urgences 24/24' },

  // Électricité
  { id: '3', name: 'Pierre Martin', specialty: 'Électricien Diplômé', category: 'Électricité', rating: 4.9, reviews: 189, rate: '60€/h', avatar: '⚡', bio: 'Normes CE' },
  { id: '4', name: 'Sophie Bernard', specialty: 'Installation Électrique', category: 'Électricité', rating: 4.7, reviews: 124, rate: '55€/h', avatar: '💡', bio: 'Domotique spécialisée' },

  // Peinture
  { id: '5', name: 'Thomas Moreau', specialty: 'Peintre Professionnel', category: 'Peinture', rating: 4.8, reviews: 201, rate: '40€/h', avatar: '🎨', bio: 'Finitions haut de gamme' },
  { id: '6', name: 'Isabelle Rousseau', specialty: 'Décoration Intérieure', category: 'Peinture', rating: 4.9, reviews: 178, rate: '45€/h', avatar: '🖌️', bio: 'Conseils couleur gratuits' },

  // Menuiserie
  { id: '7', name: 'Claude Renard', specialty: 'Menuisier Bois', category: 'Menuiserie', rating: 4.9, reviews: 145, rate: '70€/h', avatar: '🪵', bio: 'Meubles sur mesure' },
  { id: '8', name: 'Marc Petit', specialty: 'Charpente Menuiserie', category: 'Menuiserie', rating: 4.7, reviews: 98, rate: '65€/h', avatar: '🪜', bio: 'Restauration anciens' },

  // Jardinage
  { id: '9', name: 'Luc Gautier', specialty: 'Paysagiste', category: 'Jardinage', rating: 4.8, reviews: 167, rate: '35€/h', avatar: '🌿', bio: 'Création jardins' },
  { id: '10', name: 'Nathalie Duret', specialty: 'Jardinier Paysagiste', category: 'Jardinage', rating: 4.9, reviews: 203, rate: '40€/h', avatar: '🌱', bio: 'Entretien régulier' },

  // Isolation
  { id: '11', name: 'David Chevalier', specialty: 'Expert Isolation', category: 'Isolation', rating: 4.9, reviews: 112, rate: '80€/h', avatar: '🧊', bio: 'Thermique & Acoustique' },
  { id: '12', name: 'Sylvain Mercier', specialty: 'Isolation Toiture', category: 'Isolation', rating: 4.8, reviews: 89, rate: '75€/h', avatar: '🏠', bio: 'Économies d\'énergie' },
];

const CATEGORIES = [
  'Plomberie',
  'Électricité',
  'Peinture',
  'Menuiserie',
  'Jardinage',
  'Isolation',
];

export default function ResultsPage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userNeed, setUserNeed] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // Charger les données sauvegardées avec la nouvelle fonction
    const services = loadDraftData('draft_selectedServices');
    const need = loadDraftData('draft_userNeed');

    if (services && need) {
      setSelectedServices(services);
      setUserNeed(need);
      setActiveCategory(services[0] || CATEGORIES[0]);
      console.log(`✓ Loaded draft with ${services.length} services`);
    } else {
      console.warn('⚠️ No draft data found, redirecting to home');
      // Rediriger vers l'accueil si pas de données
      router.push('/');
    }
  }, [router]);

  // Filtrer les prestataires par catégorie sélectionnée
  useEffect(() => {
    if (activeCategory) {
      setFilteredProviders(
        DEMO_PROVIDERS.filter((p) => p.category === activeCategory)
      );
    }
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/20 to-purple-900/40 opacity-60" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-20 backdrop-blur-md bg-black/50 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl" />
              <span className="text-white font-bold text-xl">Kyndex</span>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white px-6 py-2 rounded-lg font-bold transition"
            >
              ← Retour
            </button>
          </div>
        </nav>

        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              {userNeed}
            </h1>
            <p className="text-gray-300 text-lg">
              Nous avons trouvé <span className="text-cyan-400 font-bold">{selectedServices.length}</span> catégories de services pour vous
            </p>
          </div>

          {/* Tags Services */}
          <div className="flex flex-wrap gap-3 mb-8">
            {selectedServices.map((service) => (
              <div
                key={service}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-medium flex items-center gap-2"
              >
                <span>✓</span>
                {service}
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3">
              <h3 className="text-white font-bold text-lg mb-4">Catégories</h3>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Providers Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-cyan-400 hover:bg-white/10 transition overflow-hidden"
                >
                  {/* Gradient Background au hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition" />

                  <div className="relative space-y-4">
                    {/* Avatar */}
                    <div className="text-5xl group-hover:scale-110 transition transform">
                      {provider.avatar}
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
                        {provider.specialty}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{provider.bio}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm font-bold text-white">
                        {provider.rating}
                      </span>
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-xs text-gray-500">
                        ({provider.reviews} avis)
                      </span>
                    </div>

                    {/* Rate */}
                    <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                      {provider.rate}
                    </p>

                    {/* Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2">
                      <span>Contacter</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Aucun prestataire trouvé dans cette catégorie
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Footer */}
        <section className="max-w-7xl mx-auto px-6 py-12 mt-12 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-cyan-400">
                {filteredProviders.length}
              </p>
              <p className="text-gray-400 mt-2">Prestataires actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">4.8</p>
              <p className="text-gray-400 mt-2">Note moyenne</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">
                {selectedServices.length}
              </p>
              <p className="text-gray-400 mt-2">Services trouvés</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Kyndex. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
