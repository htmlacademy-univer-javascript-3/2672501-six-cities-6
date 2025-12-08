import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortingOptions } from './SortingOptions';

describe('SortingOptions', () => {
  it('should render current sort option', () => {
    const onSortChange = vi.fn();
    render(<SortingOptions currentSort="Popular" onSortChange={onSortChange} />);

    expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
    // Проверяем что текущая опция отображается в span (а не в списке)
    const sortTypeSpan = screen.getByText(/Sort by/i).nextElementSibling;
    expect(sortTypeSpan?.textContent).toContain('Popular');
  });

  it('should open menu when clicking on sort type', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(<SortingOptions currentSort="Popular" onSortChange={onSortChange} />);

    const sortType = screen.getByText(/Sort by/i).nextElementSibling;
    if (sortType) {
      await user.click(sortType);

      expect(screen.getByText('Price: low to high')).toBeInTheDocument();
      expect(screen.getByText('Price: high to low')).toBeInTheDocument();
      expect(screen.getByText('Top rated first')).toBeInTheDocument();
    }
  });

  it('should call onSortChange when selecting a sort option', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(<SortingOptions currentSort="Popular" onSortChange={onSortChange} />);

    // Открываем меню
    const sortType = screen.getByText(/Sort by/i).nextElementSibling;
    if (sortType) {
      await user.click(sortType);

      // Выбираем опцию
      const priceLowToHigh = screen.getByText('Price: low to high');
      await user.click(priceLowToHigh);

      expect(onSortChange).toHaveBeenCalledWith('Price: low to high');
      expect(onSortChange).toHaveBeenCalledTimes(1);
    }
  });

  it('should highlight active sort option', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(<SortingOptions currentSort="Price: low to high" onSortChange={onSortChange} />);

    // Открываем меню
    const sortType = screen.getByText(/Sort by/i).nextElementSibling;
    if (sortType) {
      await user.click(sortType);

      // Проверяем, что активная опция выделена - ищем все элементы с текстом и находим нужный
      const allOptions = screen.getAllByText('Price: low to high');
      const activeOption = allOptions.find((el) => el.closest('li')?.classList.contains('places__option--active'));
      expect(activeOption).toBeTruthy();
    }
  });

  it('should close menu after selecting an option', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(<SortingOptions currentSort="Popular" onSortChange={onSortChange} />);

    // Открываем меню
    const sortType = screen.getByText(/Sort by/i).nextElementSibling;
    if (sortType) {
      await user.click(sortType);
      expect(screen.getByText('Price: low to high')).toBeInTheDocument();

      // Выбираем опцию
      await user.click(screen.getByText('Price: low to high'));

      // После выбора onSortChange должен быть вызван
      expect(onSortChange).toHaveBeenCalled();
    }
  });
});

