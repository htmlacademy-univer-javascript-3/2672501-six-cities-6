import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { OffersList } from '../../shared/components/OffersList';
import { Map } from '../../shared/components/Map';
import { CitiesList } from '../../shared/components/CitiesList';
import { SortingOptions } from '../../shared/components/SortingOptions';
import { getCityOffers, getCity } from '../../app/selectors';
import { setCity } from '../../app/action';

const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const cityOffers = useSelector(getCityOffers);
  const activeCity = useSelector(getCity);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState('Popular');

  const handleCardMouseEnter = (id: string) => {
    setActiveCardId(id);
  };

  const handleCardMouseLeave = () => {
    setActiveCardId(null);
  };

  const handleCityClick = (city: string) => {
    dispatch(setCity(city));
  };

  const sortedOffers = useMemo(() => {
    const offersCopy = [...cityOffers];

    switch (currentSort) {
      case 'Price: low to high':
        return offersCopy.sort((a, b) => a.price - b.price);
      case 'Price: high to low':
        return offersCopy.sort((a, b) => b.price - a.price);
      case 'Top rated first':
        return offersCopy.sort((a, b) => b.rating - a.rating);
      case 'Popular':
      default:
        return offersCopy;
    }
  }, [cityOffers, currentSort]);

  const cityCenter: [number, number] = sortedOffers.length > 0
    ? [sortedOffers[0].location.latitude, sortedOffers[0].location.longitude]
    : [52.370216, 4.895168];

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link className="header__nav-link" to="/login">
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList cities={CITIES} activeCity={activeCity} onCityClick={handleCityClick} />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{sortedOffers.length} places to stay in {activeCity}</b>
              <SortingOptions currentSort={currentSort} onSortChange={setCurrentSort} />
              <OffersList
                offers={sortedOffers}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              />
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map offers={sortedOffers} center={cityCenter} activeOfferId={activeCardId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
