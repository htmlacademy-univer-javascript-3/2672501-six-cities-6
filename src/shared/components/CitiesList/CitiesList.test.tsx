import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CitiesList } from './CitiesList';

describe('CitiesList', () => {
  it('renders provided cities and highlights active', () => {
    const cities = ['Paris', 'Cologne', 'Amsterdam'];
    render(<CitiesList cities={cities} activeCity="Amsterdam" />);
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam').closest('a')).toHaveClass('tabs__item--active');
  });

  it('should call onCityClick when clicking on a city', async () => {
    const cities = ['Paris', 'Cologne', 'Amsterdam'];
    const onCityClick = vi.fn();
    const user = userEvent.setup();
    render(<CitiesList cities={cities} activeCity="Paris" onCityClick={onCityClick} />);

    const cologneLink = screen.getByText('Cologne');
    await user.click(cologneLink);

    expect(onCityClick).toHaveBeenCalledWith('Cologne');
    expect(onCityClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onCityClick when handler is not provided', async () => {
    const cities = ['Paris', 'Cologne'];
    const user = userEvent.setup();
    render(<CitiesList cities={cities} activeCity="Paris" />);

    const cologneLink = screen.getByText('Cologne');
    await user.click(cologneLink);

    expect(cologneLink).toBeInTheDocument();
  });
});


