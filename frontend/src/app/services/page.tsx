'use client';

import { useState,useEffect, useMemo } from 'react';
import PublicLayout from '@/app/public-layout';
import { createApiClient } from '@/lib/api-client';
import Link from 'next/link';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  priceType: string;
  category: ServiceCategory;
  provider: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
      city: string;
      averageRating: number;
      totalReviews: number;
    };
  };
  averageRating: number;
  totalBookings: number;
  tags: string[];
  location: string;
  onsite: boolean;
  remote: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating'); // rating, price-low, price-high, reviews
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load categories
      const categoriesRes = await apiClient.get('/categories');
      setCategories(categoriesRes.data || []);

      // Load services
      const servicesRes = await apiClient.get('/services');
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category.slug === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query) ||
          s.provider.profile.firstName.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
      case 'rating':
      default:
        filtered.sort((a, b) => b.averageRating - a.averageRating);
    }

    return filtered;
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Trouvez le prestataire idéal</h1>
            <p className="text-xl text-blue-100">
              Accédez à des milliers de services professionnels près de chez vous
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un service, un prestataire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-lg font-semibold transition ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
              }`}
            >
              Tous les services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`p-4 rounded-lg font-semibold transition flex flex-col items-center gap-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm text-center">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="max-w-7xl mx-auto px-4 py-4 border-b border-gray-200">
          <div className="flex gap-4 justify-between items-center">
            <div className="text-gray-600">
              {filteredServices.length} prestataire{filteredServices.length > 1 ? 's' : ''}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Note (Plus haute d'abord)</option>
              <option value="reviews">Plus populaires</option>
              <option value="price-low">Prix (Plus bas d'abord)</option>
              <option value="price-high">Prix (Plus haut d'abord)</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-600">Chargement des services...</p>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun service trouvé</h2>
              <p className="text-gray-600">Essayez d'autres critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-blue-600"
                >
                  {/* Provider Info */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-3 items-center">
                      {service.provider.profile.avatarUrl ? (
                        <img
                          src={`http://localhost:3001${service.provider.profile.avatarUrl}`}
                          alt={service.provider.profile.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                          👤
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {service.provider.profile.firstName} {service.provider.profile.lastName}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {service.provider.profile.city || 'Localisation inconnu'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: service.category.color }}
                        >
                          {service.category.icon} {service.category.name}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900">{service.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {service.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">⭐</span>
                        <span className="font-semibold text-gray-900">
                          {service.provider.profile.averageRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        ({service.provider.profile.totalReviews} avis)
                      </span>
                    </div>

                    {/* Price & Availability */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {service.basePrice}€
                        </p>
                        <p className="text-xs text-gray-600">{service.priceType}</p>
                      </div>
                      <div className="text-right">
                        {service.onsite && (
                          <p className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Sur place
                          </p>
                        )}
                        {service.remote && (
                          <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1">
                            À distance
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
