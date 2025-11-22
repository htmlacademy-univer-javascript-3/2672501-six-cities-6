import React from 'react';
import { Review } from '../Review';
import type { ReviewType } from '../Review';

interface ReviewsListProps {
  reviews: ReviewType[];
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => (
  <>
    <h2 className="reviews__title">
      Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
    </h2>
    <ul className="reviews__list">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </ul>
  </>
);

