import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Offer } from '../types/offer';

export const getOffers = (state: RootState): Offer[] => state.offers.offers;

export const getCity = (state: RootState): string => state.offers.city;

export const getCityOffers = createSelector(
  [getOffers, getCity],
  (offers: Offer[], city: string): Offer[] => {
    if (!city) {
      return offers;
    }

    return offers.filter((offer) => offer.city.name === city);
  }
);

  return offers.filter((offer) => offer.city === city);
};

