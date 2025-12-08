import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Review } from './Review';
import { Review as ReviewType } from '../../../types/review';

const review: ReviewType = {
  id: '1',
  user: { name: 'Alice', avatarUrl: 'img/avatar.jpg', isPro: false },
  rating: 4,
  comment: 'Great place',
  date: '2023-10-10'
};

describe('Review component', () => {
  it('renders review content', () => {
    render(<Review review={review} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Great place')).toBeInTheDocument();
  });
});


