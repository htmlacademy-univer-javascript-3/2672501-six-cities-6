import React from 'react';
import { Review } from '../Review';
import type { ReviewType } from '../Review';

interface ReviewsListProps {
  reviews: ReviewType[];
  totalCount?: number;
}

const ReviewsListComponent: React.FC<ReviewsListProps> = ({ reviews, totalCount }) => (
  <>
    <h2 className="reviews__title">
      Reviews &middot; <span className="reviews__amount">{totalCount ?? reviews.length}</span>
    </h2>
    <ul className="reviews__list">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </ul>
  </>
);

export const ReviewsList = React.memo(ReviewsListComponent);
ReviewsList.displayName = 'ReviewsList';

