import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Offer } from '../../../types/offer';
import { toggleFavoriteAction, fetchFavoritesAction } from '../../../services/api-actions';
import { getAuthorizationStatus } from '../../../app/selectors';
import { AppDispatch } from '../../../store';

interface FavoriteCardProps {
  offer: Offer;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ offer }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector(getAuthorizationStatus);

  const handleBookmarkClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }

    void dispatch(toggleFavoriteAction({
      offerId: offer.id,
      isFavorite: false
    })).then(() => {
      void dispatch(fetchFavoritesAction());
    });
  }, [dispatch, navigate, authorizationStatus, offer.id]);

  return (
    <article className="favorites__card place-card">
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width="150"
            height="110"
            alt="Place image"
          />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''} button`}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${(offer.rating / 5) * 100}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>
  );
};

