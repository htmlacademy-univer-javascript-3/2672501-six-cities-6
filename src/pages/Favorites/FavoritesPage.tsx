import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FavoriteCard } from '../../shared/components/FavoriteCard';
import { Spinner } from '../../shared/components/Spinner';
import { Offer } from '../../types/offer';
import { getFavoriteCount, getAuthorizationStatus, getUser, getFavorites, getIsLoadingFavorites } from '../../app/selectors';
import { fetchFavoritesAction } from '../../services/api-actions';
import { AppDispatch } from '../../store';

export const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favoriteOffers = useSelector(getFavorites);
  const isLoadingFavorites = useSelector(getIsLoadingFavorites);
  const favoriteCount = useSelector(getFavoriteCount);
  const authorizationStatus = useSelector(getAuthorizationStatus);
  const user = useSelector(getUser);

  useEffect(() => {
    if (authorizationStatus === 'AUTH') {
      void dispatch(fetchFavoritesAction());
    }
  }, [dispatch, authorizationStatus]);

  const favoriteOffersByCity = useMemo(() => {
    const groupedByCity: Record<string, Offer[]> = {};

    favoriteOffers.forEach((offer) => {
      const cityName = offer.city.name;
      if (!groupedByCity[cityName]) {
        groupedByCity[cityName] = [];
      }
      groupedByCity[cityName].push(offer);
    });

    return groupedByCity;
  }, [favoriteOffers]);

  const cities = Object.keys(favoriteOffersByCity);

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === 'AUTH' && user ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                          <img className="header__avatar user__avatar" src={user.avatarUrl} alt={user.name} />
                        </div>
                        <span className="header__user-name user__name">{user.email}</span>
                        <span className="header__favorite-count">{favoriteCount}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to="/login">
                        <span className="header__signout">Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item">
                    <Link className="header__nav-link" to="/login">
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {isLoadingFavorites ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spinner />
              </div>
            ) : cities.length > 0 ? (
              <ul className="favorites__list">
                {cities.map((city) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {favoriteOffersByCity[city].map((offer) => (
                        <FavoriteCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
};
