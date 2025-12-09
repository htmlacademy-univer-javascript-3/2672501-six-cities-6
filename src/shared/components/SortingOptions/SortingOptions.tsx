import React, { useState } from 'react';

interface SortingOptionsProps {
  currentSort: string;
  onSortChange: (sortType: string) => void;
}

const SORTING_OPTIONS = [
  'Popular',
  'Price: low to high',
  'Price: high to low',
  'Top rated first'
] as const;

export const SortingOptions: React.FC<SortingOptionsProps> = ({ currentSort, onSortChange }) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const handleSortMenuToggle = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  const handleSortOptionClick = (sortType: string) => {
    onSortChange(sortType);
    setIsSortMenuOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption" style={{ marginRight: '4px' }}>Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleSortMenuToggle}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom ${isSortMenuOpen ? 'places__options--opened' : ''}`}>
        {SORTING_OPTIONS.map((option) => (
          <li
            key={option}
            className={`places__option ${currentSort === option ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleSortOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
};


