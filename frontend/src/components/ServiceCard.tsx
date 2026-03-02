import { FC } from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  provider: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  category: {
    name: string;
    icon: string;
    color: string;
  };
  basePrice: number;
  priceType: 'HOURLY' | 'FIXED' | 'NEGOTIABLE';
  averageRating: number;
  totalReviews: number;
  onsite: boolean;
  remote: boolean;
  location: string;
}

const ServiceCard: FC<ServiceCardProps> = ({
  id,
  title,
  description,
  provider,
  category,
  basePrice,
  priceType,
  averageRating,
  totalReviews,
  onsite,
  remote,
  location,
}) => {
  return (
    <Link href={`/services/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-400 border border-gray-200 cursor-pointer h-full flex flex-col">
        {/* Header with category badge */}
        <div
          className="h-24 flex items-center justify-center text-4xl relative overflow-hidden"
          style={{ backgroundColor: category.color }}
        >
          <span className="text-3xl drop-shadow-lg">{category.icon}</span>
          <span className="absolute top-2 right-2 bg-white/90 text-xs font-bold px-2 py-1 rounded text-gray-900">
            {category.name}
          </span>
        </div>

        {/* Provider Info */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          {provider.avatarUrl ? (
            <img
              src={`http://localhost:3001${provider.avatarUrl}`}
              alt={provider.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
              {provider.firstName[0]}{provider.lastName[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {provider.firstName} {provider.lastName}
            </p>
            <p className="text-xs text-gray-500">{location}</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base line-clamp-1">{title}</h3>
            <p className="text-gray-600 text-xs line-clamp-2 mt-1">{description}</p>
          </div>

          {/* Availability Tags */}
          <div className="flex flex-wrap gap-1">
            {onsite && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Sur place
              </span>
            )}
            {remote && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                À distance
              </span>
            )}
          </div>
        </div>

        {/* Footer: Rating & Price */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <div className="text-right">
              <p className="font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{totalReviews}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{basePrice}€</p>
            <p className="text-xs text-gray-500">
              {priceType === 'HOURLY' ? '/h' : 'forfait'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
