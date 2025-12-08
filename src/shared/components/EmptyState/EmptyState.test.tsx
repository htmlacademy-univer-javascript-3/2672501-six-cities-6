import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render correctly with city name', () => {
    render(<EmptyState cityName="Paris" />);

    expect(screen.getByText(/No places to stay available/i)).toBeInTheDocument();
    expect(screen.getByText(/We could not find any property available at the moment in Paris/i)).toBeInTheDocument();
  });

  it('should render with different city name', () => {
    render(<EmptyState cityName="Amsterdam" />);

    expect(screen.getByText(/We could not find any property available at the moment in Amsterdam/i)).toBeInTheDocument();
  });
});

