import React, { useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { Spinner } from '../../shared/components/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { ReviewForm } from '../../shared/components/ReviewForm';
import { ReviewsList } from '../../shared/components/ReviewsList';
import { Map } from '../../shared/components/Map';
import { OffersList } from '../../shared/components/OffersList';
import {
  getCurrentOffer,
  getNearbyOffers,
  getReviews,
  getSortedAndLimitedReviews,
  getIsLoadingOffer,
  getOfferError,
  getFavoriteCount,
  getAuthorizationStatus,
  getUser
} from '../../app/selectors';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, toggleFavoriteAction, fetchFavoritesAction } from '../../services/api-actions';
import { setAuthorizationStatus } from '../../app/action';
import { TOKEN_KEY } from '../../services/api';
import { AppDispatch } from '../../store';

export const OfferPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const offer = useSelector(getCurrentOffer);
  const nearbyOffers = useSelector(getNearbyOffers);
  const allReviews = useSelector(getReviews);
  const displayedReviews = useSelector(getSortedAndLimitedReviews);
  const isLoadingOffer = useSelector(getIsLoadingOffer);
  const error = useSelector(getOfferError);
  const favoriteCount = useSelector(getFavoriteCount);
  const authorizationStatus = useSelector(getAuthorizationStatus);
  const user = useSelector(getUser);

  useEffect(() => {
    if (id) {
      void dispatch(fetchOfferAction(id));
      void dispatch(fetchNearbyOffersAction(id));
      void dispatch(fetchReviewsAction(id));
    }
  }, [id, dispatch]);

  const mapCenter: [number, number] = useMemo(() => {
    if (!offer) {
      return [0, 0];
    }
    return [
      offer.location.latitude,
      offer.location.longitude
    ];
  }, [offer]);

  const displayedNearbyOffers = useMemo(() => nearbyOffers.slice(0, 3), [nearbyOffers]);

  const mapOffers = useMemo(() => {
    if (!offer) {
      return displayedNearbyOffers;
    }
    return [offer, ...displayedNearbyOffers];
  }, [offer, displayedNearbyOffers]);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(setAuthorizationStatus('NO_AUTH'));
  }, [dispatch]);

  const handleBookmarkClick = useCallback(() => {
    if (!offer) {
      return;
    }

    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }

    void dispatch(toggleFavoriteAction({
      offerId: offer.id,
      isFavorite: !offer.isFavorite
    })).then(() => {
      void dispatch(fetchFavoritesAction());
    });
  }, [dispatch, navigate, authorizationStatus, offer]);

  if (isLoadingOffer) {
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
                            <img className="user__avatar" src={user.avatarUrl} width="54" height="54" alt="User avatar" />
                          </div>
                          <span className="header__user-name user__name">{user.email}</span>
                          <span className="header__favorite-count">{favoriteCount}</span>
                        </Link>
                      </li>
                      <li className="header__nav-item">
                        <Link className="header__nav-link" to="/" onClick={handleSignOut}>
                          <span className="header__signout">Sign out</span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/login">
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__login">Sign in</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="page__main page__main--offer">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 180px)' }}>
            <Spinner />
          </div>
        </main>
      </div>
    );
  }

  if (error && !offer) {
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
                            <img className="user__avatar" src={user.avatarUrl} width="54" height="54" alt="User avatar" />
                          </div>
                          <span className="header__user-name user__name">{user.email}</span>
                          <span className="header__favorite-count">{favoriteCount}</span>
                        </Link>
                      </li>
                      <li className="header__nav-item">
                        <Link className="header__nav-link" to="/" onClick={handleSignOut}>
                          <span className="header__signout">Sign out</span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/login">
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                        <span className="header__login">Sign in</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="page__main page__main--offer">
          <div className="offer__container container">
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <b style={{ fontSize: '24px', color: 'red', display: 'block', marginBottom: '10px' }}>Error loading offer</b>
              <p style={{ fontSize: '16px', color: '#666' }}>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!offer) {
    return <Navigate to="/404" replace />;
  }

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
                          <img className="user__avatar" src={user.avatarUrl} width="54" height="54" alt="User avatar" />
                        </div>
                        <span className="header__user-name user__name">{user.email}</span>
                        <span className="header__favorite-count">{favoriteCount}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to="/" onClick={handleSignOut}>
                        <span className="header__signout">Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to="/login">
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images?.slice(0, 6).map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img className="offer__image" src={image} alt="Place photo" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button
                  className={`offer__bookmark-button button ${offer.isFavorite ? 'offer__bookmark-button--active' : ''}`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${(Math.round(offer.rating) / 5) * 100}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.ratingValue || offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                {offer.bedrooms !== undefined && (
                  <li className="offer__feature offer__feature--bedrooms">
                    {offer.bedrooms} Bedroom{offer.bedrooms > 1 ? 's' : ''}
                  </li>
                )}
                {offer.maxAdults !== undefined && (
                  <li className="offer__feature offer__feature--adults">
                    Max {offer.maxAdults} adult{offer.maxAdults > 1 ? 's' : ''}
                  </li>
                )}
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              {offer.goods && offer.goods.length > 0 && (
                <div className="offer__inside">
                  <h2 className="offer__inside-title">What&apos;s inside</h2>
                  <ul className="offer__inside-list">
                    {offer.goods.map((good) => (
                      <li key={good} className="offer__inside-item">{good}</li>
                    ))}
                  </ul>
                </div>
              )}
              {offer.host && (
                <div className="offer__host">
                  <h2 className="offer__host-title">Meet the host</h2>
                  <div className="offer__host-user user">
                    <div className={`offer__avatar-wrapper user__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''}`}>
                      <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                    </div>
                    <span className="offer__user-name">{offer.host.name}</span>
                    {offer.host.isPro && (
                      <span className="offer__user-status">Pro</span>
                    )}
                  </div>
                  {offer.description && (
                    <div className="offer__description">
                      {offer.description.split('\n').filter((paragraph) => paragraph.trim()).map((paragraph) => (
                        <p key={paragraph.trim()} className="offer__text">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <section className="offer__reviews reviews">
                <ReviewsList reviews={displayedReviews} totalCount={allReviews.length} />
                {authorizationStatus === 'AUTH' && user && offer && (
                  <ReviewForm offerId={offer.id} />
                )}
              </section>
            </div>
          </div>
          <section className="offer__map map">
            <Map offers={mapOffers} center={mapCenter} activeOfferId={offer.id} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OffersList
              offers={displayedNearbyOffers}
              containerClassName="near-places__list places__list"
              cardClassName="near-places__card place-card"
              imageWrapperClassName="near-places__image-wrapper place-card__image-wrapper"
            />
          </section>
        </div>
      </main>
    </div>
  );
};
