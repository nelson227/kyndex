import { FC } from 'react';

interface ReviewItemProps {
  authorName: string;
  authorAvatar?: string;
  rating: number;
  quality?: number;
  professionalism?: number;
  punctuality?: number;
  communication?: number;
  comment: string;
  date: string;
}

const ReviewItem: FC<ReviewItemProps> = ({
  authorName,
  authorAvatar,
  rating,
  quality,
  professionalism,
  punctuality,
  communication,
  comment,
  date,
}) => {
  const getDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 30) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img
              src={`http://localhost:3001${authorAvatar}`}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
              {authorName[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">{getDateString(date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-gray-900">{rating}/5</span>
        </div>
      </div>

      {/* Detailed Ratings */}
      {(quality || professionalism || punctuality || communication) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          {quality && (
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{quality}/5</div>
              <div className="text-xs text-gray-600">Qualité</div>
            </div>
          )}
          {professionalism && (
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{professionalism}/5</div>
              <div className="text-xs text-gray-600">Professionnalisme</div>
            </div>
          )}
          {punctuality && (
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{punctuality}/5</div>
              <div className="text-xs text-gray-600">Ponctualité</div>
            </div>
          )}
          {communication && (
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-900">{communication}/5</div>
              <div className="text-xs text-gray-600">Communication</div>
            </div>
          )}
        </div>
      )}

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed">{comment}</p>
    </div>
  );
};

interface ReviewSectionProps {
  reviews: Array<{
    id: string;
    overallRating: number;
    quality?: number;
    professionalism?: number;
    punctuality?: number;
    communication?: number;
    comment: string;
    createdAt: string;
    fromUser: {
      profile: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
      };
    };
  }>;
  averageRating: number;
  totalReviews: number;
  showAll?: boolean;
}

const ReviewSection: FC<ReviewSectionProps> = ({ reviews, averageRating, totalReviews, showAll = false }) => {
  const displayReviews = showAll ? reviews : reviews.slice(0, 5);

  // Calculate rating distribution
  const ratingCounts: Record<number, number> = {
    5: reviews.filter((r) => r.overallRating === 5).length,
    4: reviews.filter((r) => r.overallRating === 4).length,
    3: reviews.filter((r) => r.overallRating === 3).length,
    2: reviews.filter((r) => r.overallRating === 2).length,
    1: reviews.filter((r) => r.overallRating === 1).length,
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients ({totalReviews})</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(averageRating) ? 'text-xl' : 'text-gray-300 text-xl'}>
                ⭐
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Sur {totalReviews} avis</p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3 mb-3">
              <span className="text-sm font-semibold text-gray-700 w-12">{rating}⭐</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${totalReviews > 0 ? (ratingCounts[rating] / totalReviews) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-12">{ratingCounts[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {displayReviews.length > 0 ? (
        <div>
          {displayReviews.map((review) => (
            <ReviewItem
              key={review.id}
              authorName={`${review.fromUser.profile.firstName} ${review.fromUser.profile.lastName}`}
              authorAvatar={review.fromUser.profile.avatarUrl}
              rating={review.overallRating}
              quality={review.quality}
              professionalism={review.professionalism}
              punctuality={review.punctuality}
              communication={review.communication}
              comment={review.comment}
              date={review.createdAt}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">Aucun avis pour le moment</p>
      )}

      {!showAll && reviews.length > 5 && (
        <button className="w-full mt-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
          Voir tous les avis ({reviews.length})
        </button>
      )}
    </div>
  );
};

export { ReviewSection, ReviewItem };
