import React from 'react';
import { PlaceCard } from '../PlaceCard';
import { Offer } from '../../../mocks/offers';

interface OffersListProps {
  offers: Offer[];
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
}

export const OffersList: React.FC<OffersListProps> = ({ offers, onMouseEnter, onMouseLeave }) => (
  <div className="cities__places-list places__list tabs__content">
    {offers.map((offer) => (
      <PlaceCard
        key={offer.id}
        offer={offer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    ))}
  </div>
);

