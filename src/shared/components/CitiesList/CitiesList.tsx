import React from 'react';

interface CitiesListProps {
  cities: string[];
  activeCity: string;
  onCityClick?: (city: string) => void;
}

export const CitiesList: React.FC<CitiesListProps> = ({ cities, activeCity, onCityClick }) => {
  const handleCityClick = (e: React.MouseEvent<HTMLAnchorElement>, city: string) => {
    e.preventDefault();
    if (onCityClick) {
      onCityClick(city);
    }
  };

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


