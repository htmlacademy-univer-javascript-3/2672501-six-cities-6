import React, { useMemo } from 'react';
import { Review as ReviewType } from '../../../types/review';

interface ReviewProps {
  review: ReviewType;
}

const ReviewComponent: React.FC<ReviewProps> = ({ review }) => {
  const ratingPercentage = useMemo(() => (review.rating / 5) * 100, [review.rating]);

  const formattedDate = useMemo(() => new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), [review.date]);

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={review.user.avatarUrl}
            width="54"
            height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{review.user.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: `${ratingPercentage}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{review.comment}</p>
        <time className="reviews__time" dateTime={review.date}>
          {formattedDate}
        </time>
      </div>
    </li>
  );
};

export const Review = React.memo(ReviewComponent);
Review.displayName = 'Review';

