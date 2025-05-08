import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { IReview } from '../../../store/reviewSlice';
import StarRating from '../../../globals/components/StarRating';
import { Status } from '../../../globals/types/type';
import { APIWITHTOKEN } from '../../../http';

const AdminReviews: React.FC = () => {
  const dispatch = useAppDispatch();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    fetchAllReviews();
  }, []);
  
  const fetchAllReviews = async () => {
    try {
      setStatus(Status.LOADING);
      const response = await APIWITHTOKEN.get('/review/admin/all');
      if (response.status === 200) {
        setReviews(response.data.data);
        setStatus(Status.SUCCESS);
      } else {
        setStatus(Status.ERROR);
      }
    } catch (error) {
      console.log(error);
      setStatus(Status.ERROR);
    }
  };
  
  const toggleReviewVisibility = async (reviewId: string, currentVisibility: boolean) => {
    try {
      const response = await APIWITHTOKEN.patch(`/review/admin/toggle/${reviewId}`);
      if (response.status === 200) {
        // Update the reviews list with the toggled visibility
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, isVisible: !currentVisibility } 
            : review
        ));
      }
    } catch (error) {
      console.log(error);
      alert('Failed to update review visibility.');
    }
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        const response = await APIWITHTOKEN.delete(`/review/admin/${reviewId}`);
        if (response.status === 200) {
          setReviews(reviews.filter(review => review.id !== reviewId));
        }
      } catch (error) {
        console.log(error);
        alert('Failed to delete review.');
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const filteredReviews = filter === 'all' 
    ? reviews 
    : filter === 'visible' 
      ? reviews.filter(review => review.isVisible) 
      : reviews.filter(review => !review.isVisible);
  
  if (status === Status.LOADING && reviews.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Review Management</h1>
        <div className="flex justify-center">
          <div className="animate-pulse bg-gray-200 h-6 w-full max-w-md rounded"></div>
        </div>
      </div>
    );
  }
  
  if (status === Status.ERROR && reviews.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Review Management</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Unable to load reviews. Please try again later.</p>
          <button 
            onClick={fetchAllReviews}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Review Management</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All Reviews
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'visible' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('visible')}
          >
            Visible
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'hidden' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('hidden')}
          >
            Hidden
          </button>
        </div>
      </div>
      
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`p-4 border rounded-lg ${review.isVisible ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-800">{review.user.username}</p>
                    <p className="ml-3 text-sm text-gray-500">Product ID: {review.productId}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleReviewVisibility(review.id, review.isVisible)}
                    className={`px-3 py-1 rounded text-xs ${
                      review.isVisible 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {review.isVisible ? 'Hide Review' : 'Show Review'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 rounded text-xs bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews match the selected filter.</p>
      )}
    </div>
  );
};

export default AdminReviews;