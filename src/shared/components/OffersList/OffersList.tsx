import React from 'react';
import { PlaceCard } from '../PlaceCard';
import { Offer } from '../../../types/offer';

interface OffersListProps {
  offers: Offer[];
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
  containerClassName?: string;
  cardClassName?: string;
  imageWrapperClassName?: string;
}

export const OffersList: React.FC<OffersListProps> = ({
  offers,
  onMouseEnter,
  onMouseLeave,
  containerClassName = 'cities__places-list places__list tabs__content',
  cardClassName,
  imageWrapperClassName
}) => (
  <div className={containerClassName}>
    {offers.map((offer) => (
      <PlaceCard
        key={offer.id}
        offer={offer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        cardClassName={cardClassName}
        imageWrapperClassName={imageWrapperClassName}
      />
    ))}
  </div>
);

