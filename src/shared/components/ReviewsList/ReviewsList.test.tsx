import { render, screen } from '@testing-library/react';
import { ReviewsList } from './ReviewsList';
import { Review as ReviewType } from '../../../types/review';

const mockReviews: ReviewType[] = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar1.jpg'
    },
    rating: 4,
    comment: 'Great place!',
    date: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      avatarUrl: 'https://example.com/avatar2.jpg'
    },
    rating: 5,
    comment: 'Amazing experience!',
    date: '2024-01-20T10:00:00.000Z'
  }
];

describe('ReviewsList', () => {
  it('should render correctly with reviews', () => {
    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Amazing experience!')).toBeInTheDocument();
  });

  it('should render correctly with empty reviews', () => {
    render(<ReviewsList reviews={[]} />);

    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

