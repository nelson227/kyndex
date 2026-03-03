'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Clock, DollarSign, MessageSquare, AlertCircle, Mail, MapPinIcon } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/endpoints';

interface ServiceRequest {
  id: string;
  title: string;
  description?: string;
  budget?: number;
  currency: string;
  location?: string;
  dueDate?: string;
  requiredSkills?: string;
  createdAt: string;
  customer: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      city?: string;
      bio?: string;
    };
  };
  statusForProvider: 'NOUVEAU' | 'A_VALIDER' | 'EN_ATTENTE';
}

interface ServiceRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest;
  onSuccess?: () => void;
}

const ServiceRequestDetailsModal: React.FC<ServiceRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const canContact =
    request.statusForProvider === 'NOUVEAU' || request.statusForProvider === 'A_VALIDER';

  const handleContact = async () => {
    setLoading(true);
    setError('');
    try {
      // Create or get existing conversation
      const createConvResponse = await apiClient.post(API_ENDPOINTS.CREATE_CONVERSATION, {
        otherUserId: request.customer.id,
      });
      const conversationId = createConvResponse.data.id;

      // Send initial message with request details
      await apiClient.post(API_ENDPOINTS.SEND_MESSAGE(conversationId), {
        content: `Bonjour, je suis intéressé par votre demande: "${request.title}". Pouvons-nous en discuter?`,
      });

      // Redirect to messages
      router.push(`/messages/${conversationId}`);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de la conversation');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCustomerName = (customer: any) => {
    if (customer.profile?.firstName || customer.profile?.lastName) {
      return `${customer.profile.firstName || ''} ${customer.profile.lastName || ''}`.trim();
    }
    return customer.email.split('@')[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOUVEAU':
        return 'bg-red-500/20 text-red-400 border border-red-500/50';
      case 'A_VALIDER':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
      case 'EN_ATTENTE':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NOUVEAU':
        return 'Nouveau';
      case 'A_VALIDER':
        return 'À valider';
      case 'EN_ATTENTE':
        return 'En attente';
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30">
          {/* Header */}
          <div className="sticky top-0 bg-slate-900 flex items-center justify-between p-6 border-b border-cyan-500/20">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{request.title}</h2>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                  request.statusForProvider
                )}`}
              >
                {getStatusLabel(request.statusForProvider)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            {request.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{request.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {request.budget && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-cyan-400" />
                    <h4 className="font-semibold text-gray-300">Budget</h4>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {request.budget} {request.currency}
                  </p>
                </div>
              )}

              {request.dueDate && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-cyan-400" />
                    <h4 className="font-semibold text-gray-300">Date limite</h4>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(request.dueDate)}
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            {request.location && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-cyan-400" />
                  <h4 className="font-semibold text-gray-300">Localisation</h4>
                </div>
                <p className="text-gray-300">{request.location}</p>
              </div>
            )}

            {/* Required Skills */}
            {request.requiredSkills && (
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                  {request.requiredSkills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/50"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-gray-300 mb-3">Demandeur</h4>
              <div className="flex items-start gap-4">
                {request.customer.profile?.avatarUrl ? (
                  <img
                    src={request.customer.profile.avatarUrl}
                    alt={getCustomerName(request.customer)}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {getCustomerName(request.customer)[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{getCustomerName(request.customer)}</p>
                  {request.customer.profile?.city && (
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPinIcon size={14} />
                      {request.customer.profile.city}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <Mail size={14} />
                    {request.customer.email}
                  </p>
                </div>
              </div>

              {request.customer.profile?.bio && (
                <p className="text-gray-300 mt-3 text-sm">{request.customer.profile.bio}</p>
              )}
            </div>

            {/* Status Warning */}
            {request.statusForProvider === 'EN_ATTENTE' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-yellow-400 font-semibold mb-1">Demande déjà en traitement</p>
                  <p className="text-yellow-400/80 text-sm">
                    Un autre prestataire discute déjà avec le demandeur. Il n'est pas conseillé de
                    les contacter.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Contact Button */}
            <button
              onClick={handleContact}
              disabled={!canContact || loading}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                canContact
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <MessageSquare size={18} />
              {loading ? 'Création de la conversation...' : 'Contacter le demandeur'}
            </button>

            {!canContact && (
              <p className="text-center text-sm text-gray-400">
                Cette demande n'accepte des demandes que si elle a le statut "Nouveau" ou "À
                valider"
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceRequestDetailsModal;
