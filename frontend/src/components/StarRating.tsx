'use client';

import React, { useState } from 'react';

interface StarRatingProps {
  rating: number; // التقييم الحالي (0-5)
  maxStars?: number; // عدد النجوم الأقصى (افتراضي 5)
  size?: 'sm' | 'md' | 'lg'; // حجم النجوم
  onRatingChange?: (rating: number) => void; // دالة عند تغيير التقييم
  readonly?: boolean; // للعرض فقط (لا يمكن التعديل)
  showCount?: boolean; // عرض عدد النجوم بجانب التقييم
  count?: number; // عدد التقييمات
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  onRatingChange,
  readonly = false,
  showCount = false,
  count,
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (selectedRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const displayRating = hoverRating || rating;
    const isFilled = starValue <= displayRating;
    const isPartialFill = !Number.isInteger(displayRating) && starValue === Math.ceil(displayRating);
    const fillPercentage = isPartialFill ? ((displayRating % 1) * 100) : 100;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        className={`relative ${sizeClasses[size]} ${
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
        }`}
        aria-label={`${starValue} نجوم`}
      >
        {/* Star background (empty) */}
        <svg
          className="absolute inset-0 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Star foreground (filled) */}
        {isFilled && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: isPartialFill ? `${fillPercentage}%` : '100%' }}
          >
            <svg
              className="text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
      </div>
      
      {showCount && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          {count !== undefined && (
            <span className="text-gray-500"> ({count} {count === 1 ? 'تقييم' : 'تقييم'})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
