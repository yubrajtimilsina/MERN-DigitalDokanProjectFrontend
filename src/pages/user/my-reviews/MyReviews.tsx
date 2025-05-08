import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { IReview, submitReview, fetchProductReviews, deleteReview } from '../../../store/reviewSlice';
import StarRating from '../../../globals/components/StarRating';
import { Status } from '../../../globals/types/type';

interface ReviewsProps {
  productId: string;
}

const MyReviews: React.FC<ReviewsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { reviews, status, avgRating } = useAppSelector((store) => store.reviews);

  // ✅ Fixed: use 'store.auth' instead of 'store.user'
  const { user } = useAppSelector((store) => store.auth);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [formVisible, setFormVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
  }, [dispatch, productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const reviewData = {
      rating,
      comment,
      productId,
    };

    const success = await dispatch(submitReview(reviewData));

    if (success) {
      setRating(0);
      setComment('');
      setFormVisible(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await dispatch(deleteReview(reviewId));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (status === Status.LOADING && reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Customer Reviews</h2>
        <div className="flex justify-center">
          <div className="animate-pulse bg-gray-200 h-6 w-full max-w-md rounded"></div>
        </div>
      </div>
    );
  }

  if (status === Status.ERROR && reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Customer Reviews</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Unable to load reviews. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Customer Reviews
          {reviews.length > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-500">
              ({reviews.length})
            </span>
          )}
        </h2>

        {avgRating > 0 && (
          <div className="flex items-center">
            <StarRating rating={avgRating} size="sm" />
            <span className="ml-2 text-sm font-medium text-gray-500">
              {avgRating.toFixed(1)} out of 5
            </span>
          </div>
        )}
      </div>

      {!formVisible ? (
        <button
          onClick={() => setFormVisible(true)}
          className="mb-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <StarRating rating={rating} editable={true} onRatingChange={setRating} size="lg" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={status === Status.LOADING}
            >
              {status === Status.LOADING ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setFormVisible(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: IReview) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{review.user.username}</p>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                {user && user.id === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete review"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default MyReviews;
