'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StarRating from '@/components/StarRating';
import { Review, ReviewStats } from '@/lib/types';

interface SellerReviewsResponse {
  reviews: {
    data: Review[];
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: ReviewStats;
}

export default function SellerReviewsPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  const [data, setData] = useState<SellerReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [sellerId, filterRating, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(filterRating && { rating: filterRating.toString() }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sellers/${sellerId}/reviews?${params}`
      );

      if (!response.ok) {
        throw new Error('فشل في تحميل التقييمات');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { reviews, stats } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">تقييمات البائع</h1>
          
          {/* Overall Rating */}
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{stats.average_rating}</div>
              <StarRating rating={stats.average_rating} readonly size="lg" />
              <div className="text-gray-600 mt-2">{stats.total_reviews} تقييم</div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.rating_distribution[star as keyof typeof stats.rating_distribution];
                const percentage = calculatePercentage(count, stats.total_reviews);
                
                return (
                  <div key={star} className="flex items-center gap-2 mb-2">
                    <span className="text-sm w-12">{star} نجوم</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-4 py-2 rounded-lg ${
                filterRating === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الكل
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                  filterRating === star
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {star} ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.data.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              لا توجد تقييمات {filterRating && `بـ ${filterRating} نجوم`}
            </div>
          ) : (
            reviews.data.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{review.reviewer?.name || 'مستخدم'}</div>
                    <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} readonly size="sm" />
                    {review.is_verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ✓ موثق
                      </span>
                    )}
                  </div>
                </div>

                {review.product && (
                  <div className="text-sm text-gray-600 mb-2">
                    المنتج: <span className="font-medium">{review.product.title}</span>
                  </div>
                )}

                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {reviews.last_page > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              السابق
            </button>
            
            <div className="px-4 py-2 bg-white rounded-lg shadow">
              صفحة {currentPage} من {reviews.last_page}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(reviews.last_page, p + 1))}
              disabled={currentPage === reviews.last_page}
              className="px-4 py-2 bg-white rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
