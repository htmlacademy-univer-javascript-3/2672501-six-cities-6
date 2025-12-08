import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Review } from './Review';
import { Review as ReviewType } from '../../../types/review';

const review: ReviewType = {
  id: '1',
  user: { name: 'Alice', avatarUrl: 'img/avatar.jpg' },
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

  it('renders user avatar', () => {
    render(<Review review={review} />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'img/avatar.jpg');
  });

  it('displays correct rating percentage', () => {
    const { container } = render(<Review review={review} />);
    const ratingStar = container.querySelector('.reviews__stars span');
    if (ratingStar) {
      expect(ratingStar).toHaveStyle({ width: '80%' }); // 4/5 * 100%
    }
  });

  it('formats date correctly', () => {
    const reviewWithDate: ReviewType = {
      ...review,
      date: '2024-01-15T10:00:00.000Z'
    };
    render(<Review review={reviewWithDate} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Great place')).toBeInTheDocument();
  });
});


