'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createApiClient } from '@/lib/api-client';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const apiClient = useMemo(() => createApiClient(), []);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    location: '',
    avatarFile: null as File | null,
    portfolioFiles: [] as File[],
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [portfolioPreview, setPortfolioPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatarFile: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({ ...prev, portfolioFiles: [...prev.portfolioFiles, ...files] }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPortfolioPreview(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePortfolioImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolioFiles: prev.portfolioFiles.filter((_, i) => i !== index),
    }));
    setPortfolioPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Step 1: Complete Profile Setup
      await apiClient.post(
        `/profile/complete-setup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          location: formData.location,
        },
      );

      // Step 2: Upload Avatar if provided
      if (formData.avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('file', formData.avatarFile);
        await apiClient.post(
          `/profile/avatar`,
          avatarFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );
      }

      // Step 3: Upload Portfolio Images if provided
      if (formData.portfolioFiles.length > 0) {
        const portfolioFormData = new FormData();
        formData.portfolioFiles.forEach((file) => {
          portfolioFormData.append('files', file);
        });
        await apiClient.post(
          `/profile/portfolio`,
          portfolioFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );
      }

      // Redirect to discover page
      router.push('/discover');
    } catch (error: any) {
      console.error('Error completing setup:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= currentStep
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-400 text-white'
                  }`}
                >
                  {step}
                </div>
                <p className="text-xs text-white mt-1">
                  {step === 1 ? 'Infos' : step === 2 ? 'Photo' : 'Portfolio'}
                </p>
              </div>
            ))}
          </div>
          <div className="w-full bg-blue-400 h-1 rounded">
            <div
              className="bg-white h-1 rounded transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 min-h-96">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Complétez votre profil
                </h2>
                <p className="text-gray-600">
                  Parlez-nous de vous pour que les autres utilisateurs vous connaissent mieux
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nelson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Lekem"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Douala, Cameroun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    À propos de vous
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Parlez de vos compétences, passions, services que vous offrez..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Avatar */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Votre photo de profil
                </h2>
                <p className="text-gray-600">
                  Ajoutez une belle photo pour que les autres vous identifient facilement
                </p>
              </div>

              <div className="flex flex-col items-center">
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      📷
                    </label>
                  </div>
                ) : (
                  <label className="w-40 h-40 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <p className="text-4xl mb-2">📷</p>
                      <p className="text-sm text-gray-600">Cliquez ici</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Portfolio */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Votre portfolio
                </h2>
                <p className="text-gray-600">
                  Montrez vos réalisations (travaux, projets, services rendus)
                </p>
              </div>

              <div className="space-y-4">
                <label className="block border-4 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePortfolioChange}
                    className="hidden"
                  />
                  <p className="text-4xl mb-2">🖼️</p>
                  <p className="text-gray-700 font-medium">Cliquez ou déposez des images</p>
                  <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5 images</p>
                </label>

                {portfolioPreview.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {portfolioPreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Portfolio ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePortfolioImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Retour
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sauvegarde...
                  </>
                ) : (
                  'Terminer'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
