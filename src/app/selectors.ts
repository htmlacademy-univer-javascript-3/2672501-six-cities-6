import { RootState } from '../store';
import { Offer } from '../mocks/offers';

export const getOffers = (state: RootState): Offer[] => state.offers.offers;

export const getCity = (state: RootState): string => state.offers.city;

export const getCityOffers = (state: RootState): Offer[] => {
  const city = getCity(state);
  const offers = getOffers(state);

  if (!city) {
    return offers;
  }

  return offers.filter((offer) => offer.city === city);
};
