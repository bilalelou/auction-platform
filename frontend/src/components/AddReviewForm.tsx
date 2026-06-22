'use client';

import React, { useState } from 'react';
import StarRating from '@/components/StarRating';
import { CreateReviewInput } from '@/lib/types';

interface AddReviewFormProps {
  sellerId: number;
  productId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddReviewForm({ 
  sellerId, 
  productId, 
  onSuccess,
  onCancel 
}: AddReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('يرجى اختيار تقييم');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('يجب تسجيل الدخول لإضافة تقييم');
      }

      const reviewData: CreateReviewInput = {
        seller_id: sellerId,
        rating,
        comment: comment.trim() || undefined,
        ...(productId && { product_id: productId }),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'فشل في إضافة التقييم');
      }

      setSuccess(true);
      setRating(0);
      setComment('');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-xl mb-2">✓</div>
        <div className="text-green-800 font-semibold">تم إضافة التقييم بنجاح!</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">إضافة تقييم</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            التقييم <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="lg"
          />
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 5 && 'ممتاز! 🌟'}
              {rating === 4 && 'جيد جداً 👍'}
              {rating === 3 && 'جيد ✓'}
              {rating === 2 && 'مقبول'}
              {rating === 1 && 'ضعيف'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
            التعليق (اختياري)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="شارك تجربتك مع هذا البائع..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 حرف
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة التقييم'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
