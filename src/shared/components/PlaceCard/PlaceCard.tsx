import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Offer } from '../../../types/offer';

interface PlaceCardProps {
  offer: Offer;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
  cardClassName?: string;
  imageWrapperClassName?: string;
}

const PlaceCardComponent: React.FC<PlaceCardProps> = ({
  offer,
  onMouseEnter,
  onMouseLeave,
  cardClassName = 'cities__card place-card',
  imageWrapperClassName = 'cities__image-wrapper place-card__image-wrapper'
}) => {
  const handleBookmarkClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  const handleMouseEnter = useCallback(() => {
    onMouseEnter?.(offer.id);
  }, [offer.id, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave?.();
  }, [onMouseLeave]);

  return (
    <article
      className={cardClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={imageWrapperClassName}>
        <Link to={`/offer/${offer.id}`}>
          <img
            className="place-card__image"
            src={offer.previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{offer.price}</b>
            <span className="place-card__price-text">/&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''}`}
            type="button"
            onClick={handleBookmarkClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
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

export const PlaceCard = React.memo(PlaceCardComponent);
PlaceCard.displayName = 'PlaceCard';
