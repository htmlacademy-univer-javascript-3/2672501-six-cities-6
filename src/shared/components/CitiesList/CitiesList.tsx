import React, { useCallback } from 'react';

interface CitiesListProps {
  cities: string[];
  activeCity: string;
  onCityClick?: (city: string) => void;
}

const CitiesListComponent: React.FC<CitiesListProps> = ({ cities, activeCity, onCityClick }) => {
  const handleCityClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, city: string) => {
    e.preventDefault();
    onCityClick?.(city);
  }, [onCityClick]);

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li key={city} className="locations__item">
              <a
                className={`locations__item-link tabs__item ${activeCity === city ? 'tabs__item--active' : ''}`}
                href="#"
                onClick={(e) => handleCityClick(e, city)}
              >
                <span>{city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const CitiesList = React.memo(CitiesListComponent);
CitiesList.displayName = 'CitiesList';

