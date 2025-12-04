import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { OffersList } from '../../shared/components/OffersList';
import { Map } from '../../shared/components/Map';
import { CitiesList } from '../../shared/components/CitiesList';
import { Spinner } from '../../shared/components/Spinner';
import { getCityOffers, getCity, getIsLoading } from '../../app/selectors';
import { setCity } from '../../app/action';
const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const cityOffers = useSelector(getCityOffers);
  const activeCity = useSelector(getCity);
  const isLoading = useSelector(getIsLoading);
  const [, setActiveCardId] = useState<string | null>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
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

  const handleCityClick = (city: string) => {
    dispatch(setCity(city));
  };

  const cityCenter: [number, number] = cityOffers.length > 0
    ? [cityOffers[0].location.latitude, cityOffers[0].location.longitude]
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
            <section className="cities__places places" style={isLoading ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 180px)' } : undefined}>
              <h2 className="visually-hidden">Places</h2>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <b className="places__found">{cityOffers.length} places to stay in {activeCity}</b>
                  <form className="places__sorting" action="#" method="get">
                    <span className="places__sorting-caption" style={{ marginRight: '8px' }}>Sort by</span>
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
                      <li
                        className={`places__option ${currentSort === 'Popular' ? 'places__option--active' : ''}`}
                        tabIndex={0}
                        onClick={() => handleSortOptionClick('Popular')}
                      >
                        Popular
                      </li>
                      <li
                        className={`places__option ${currentSort === 'Price: low to high' ? 'places__option--active' : ''}`}
                        tabIndex={0}
                        onClick={() => handleSortOptionClick('Price: low to high')}
                      >
                        Price: low to high
                      </li>
                      <li
                        className={`places__option ${currentSort === 'Price: high to low' ? 'places__option--active' : ''}`}
                        tabIndex={0}
                        onClick={() => handleSortOptionClick('Price: high to low')}
                      >
                        Price: high to low
                      </li>
                      <li
                        className={`places__option ${currentSort === 'Top rated first' ? 'places__option--active' : ''}`}
                        tabIndex={0}
                        onClick={() => handleSortOptionClick('Top rated first')}
                      >
                        Top rated first
                      </li>
                    </ul>
                  </form>
                  <OffersList
                    offers={cityOffers}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  />
                </>
              )}
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map offers={cityOffers} center={cityCenter} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
