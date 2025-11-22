import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  onRate, 
  size = 'md',
  interactive = false 
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex gap-1" onMouseLeave={() => interactive && setHoverRating(null)}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        
        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            className={`transition-transform ${interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} focus:outline-none`}
          >
            <svg 
              className={`${sizeClasses[size]} ${isFilled ? 'text-sol-500 drop-shadow-sm' : 'text-gray-300'}`}
              fill="currentColor" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={isFilled ? 1 : 2}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
               {/* Scrappy Hand-drawn star shape */}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="black" strokeWidth="2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};