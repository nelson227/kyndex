import { FC } from 'react';
import Link from 'next/link';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: FC<RatingStarsProps> = ({ rating, count, size = 'md' }) => {
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center gap-1 ${sizeClass}`}>
      <span>⭐</span>
      <span className="font-bold text-gray-900">{rounded.toFixed(1)}</span>
      {count !== undefined && <span className="text-gray-600">({count})</span>}
    </div>
  );
};

interface CategoryBadgeProps {
  icon: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge: FC<CategoryBadgeProps> = ({ icon, name, color, size = 'md' }) => {
  const sizeClass = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  }[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClass} rounded-lg flex items-center justify-center text-white shadow-md`}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-900 text-center">{name}</p>
    </div>
  );
};

interface ProviderAvatarProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const ProviderAvatar: FC<ProviderAvatarProps> = ({
  firstName,
  lastName,
  avatarUrl,
  size = 'md',
  href,
}) => {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-24 h-24 text-2xl',
  }[size];

  const content = avatarUrl ? (
    <img
      src={`http://localhost:3001${avatarUrl}`}
      alt={`${firstName} ${lastName}`}
      className={`${sizeClass} rounded-full object-cover`}
    />
  ) : (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white`}>
      {firstName[0]}
      {lastName[0]}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

interface PriceDisplayProps {
  price: number;
  priceType: string;
  size?: 'sm' | 'md' | 'lg';
}

const PriceDisplay: FC<PriceDisplayProps> = ({ price, priceType, size = 'md' }) => {
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }[size];

  return (
    <div className="text-right">
      <p className={`${sizeClass} font-bold text-blue-600`}>{price}€</p>
      <p className="text-xs text-gray-500">{priceType === 'HOURLY' ? 'par heure' : 'forfait'}</p>
    </div>
  );
};

interface BadgeProps {
  icon: string;
  label: string;
  color: string;
  description?: string;
}

const Badge: FC<BadgeProps> = ({ icon, label, color, description }) => {
  return (
    <div className="text-center p-3 rounded-lg border-2" style={{ borderColor: color }}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="font-bold text-sm text-gray-900">{label}</p>
      {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
    </div>
  );
};

export { RatingStars, CategoryBadge, ProviderAvatar, PriceDisplay, Badge };
