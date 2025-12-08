import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CitiesList } from './CitiesList';

describe('CitiesList', () => {
  it('renders provided cities and highlights active', () => {
    const cities = ['Paris', 'Cologne', 'Amsterdam'];
    render(<CitiesList cities={cities} activeCity="Amsterdam" />);
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam').closest('a')).toHaveClass('tabs__item--active');
  });
});


