'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import PublicLayout from '@/app/public-layout';
import { createApiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ReviewSection } from '@/components/ReviewSection';
import { RatingStars, PriceDisplay } from '@/components/UIElements';

interface Service {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currency: string;
  priceType: string;
  estimatedDuration?: number;
  tags: string[];
  location: string;
  maxDistance?: number;
  onsite: boolean;
  remote: boolean;
  averageRating: number;
  totalBookings: number;
  totalReviews: number;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  provider: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
      bio: string;
      city: string;
      hourlyRate?: number;
      responseTime: number;
      averageRating: number;
      totalReviews: number;
    };
  };
}

interface Review {
  id: string;
  overallRating: number;
  quality?: number;
  professionalism?: number;
  punctuality?: number;
  communication?: number;
  comment: string;
  tags: string;
  fromUser: {
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  };
  createdAt: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState('60');
  const apiClient = useMemo(() => createApiClient(), []);

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/services/${serviceId}`);
      setService(res.data);

      // Load reviews
      const reviewsRes = await apiClient.get(`/services/${serviceId}/reviews`);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!bookingDate) {
      alert('Veuillez sélectionner une date');
      return;
    }

    try {
      await apiClient.post('/bookings', {
        serviceId,
        scheduledDate: new Date(bookingDate),
        duration: parseInt(bookingDuration),
      });
      alert('Réservation créée! Un message sera envoyé au prestataire.');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Erreur lors de la réservation');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600">Chargement du service...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!service) {
    return (
      <PublicLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Service non trouvé</h1>
        </div>
      </PublicLayout>
    );
  }

  const finalPrice = service.basePrice + (service.priceType === 'HOURLY' ? (parseInt(bookingDuration) / 60) * service.basePrice : 0);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/services" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Retour aux services
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <span
                  className="text-4xl w-16 h-16 flex items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: service.category.color }}
                >
                  {service.category.icon}
                </span>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                  <p className="text-sm text-gray-600 mt-1">{service.category.name}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg">{service.description}</p>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos du prestataire</h2>
              <div className="flex gap-4">
                {service.provider.profile.avatarUrl ? (
                  <img
                    src={`http://localhost:3001${service.provider.profile.avatarUrl}`}
                    alt={service.provider.profile.firstName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {service.provider.profile.firstName} {service.provider.profile.lastName}
                  </h3>
                  <p className="text-gray-600">{service.provider.profile.city}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl">⭐</span>
                      <span className="font-bold text-lg text-gray-900">
                        {service.provider.profile.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {service.provider.profile.totalReviews} avis
                    </span>
                    <span className="text-gray-600">
                      {service.totalBookings} réservations
                    </span>
                  </div>

                  {/* Response Time */}
                  <p className="text-sm text-gray-600 mt-3">
                    ⏱️ Temps de réponse: {service.provider.profile.responseTime} heures
                  </p>

                  {/* Bio */}
                  {service.provider.profile.bio && (
                    <p className="text-gray-700 mt-3">{service.provider.profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails du service</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Localisation</p>
                  <p className="font-semibold text-gray-900">{service.location}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Type de service</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {service.onsite && (
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
                        Sur place ✓
                      </span>
                    )}
                    {service.remote && (
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
                        À distance ✓
                      </span>
                    )}
                  </div>
                </div>
                {service.maxDistance && (
                  <div>
                    <p className="text-gray-600 text-sm">Rayon d'action</p>
                    <p className="font-semibold text-gray-900">{service.maxDistance} km</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <ReviewSection
                reviews={reviews}
                averageRating={service.averageRating}
                totalReviews={reviews.length}
              />
            )}
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-4 space-y-4">
              {/* Price */}
              <div className="border-b border-gray-200 pb-4">
                <p className="text-gray-600 text-sm">Prix</p>
                <div className="mt-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {service.basePrice}€
                  </p>
                  <p className="text-sm text-gray-600">{service.priceType === 'HOURLY' ? 'par heure' : 'forfait'}</p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date de réservation
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {service.priceType === 'HOURLY' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Durée (minutes)
                    </label>
                    <select
                      value={bookingDuration}
                      onChange={(e) => setBookingDuration(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 heure</option>
                      <option value="90">1.5 heures</option>
                      <option value="120">2 heures</option>
                      <option value="240">4 heures</option>
                      <option value="480">8 heures</option>
                    </select>
                  </div>
                )}

                {/* Total Price */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-2">Prix total estimé</p>
                  <p className="text-3xl font-bold text-gray-900">{finalPrice.toFixed(2)}€</p>
                </div>

                {/* Booking Button */}
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Réserver maintenant
                </button>

                {/* Contact Provider */}
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                  💬 Contacter le prestataire
                </button>

                {/* Trust Badges */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-xs text-gray-600 mb-3">✓ Paiement sécurisé</p>
                  <p className="text-xs text-gray-600 mb-3">✓ Identité vérifiée</p>
                  <p className="text-xs text-gray-600">✓ Assurance incluse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
