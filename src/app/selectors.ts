import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { AuthInfo } from '../types/auth';
import type { AuthorizationStatus } from './slices/auth-slice';

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

export const getIsLoading = (state: RootState): boolean => state.offers.isLoading;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getOffersError = (state: RootState): string | null => state.offers.error;

export const getFavorites = (state: RootState): Offer[] => {
  const favoritesState = state.favorites as { favorites: Offer[] };
  return favoritesState.favorites;
};

export const getIsLoadingFavorites = (state: RootState): boolean => {
  const favoritesState = state.favorites as { isLoading: boolean };
  return favoritesState.isLoading;
};

export const getFavoriteCount = createSelector(
  [getFavorites],
  (favorites: Offer[]): number => favorites.length
);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.auth.authorizationStatus;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getUser = (state: RootState): AuthInfo | null => state.auth.user;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getCurrentOffer = (state: RootState): Offer | null => state.offer.currentOffer;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getNearbyOffers = (state: RootState): Offer[] => state.offer.nearbyOffers;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getReviews = (state: RootState): Review[] => state.offer.reviews;

export const getSortedAndLimitedReviews = createSelector(
  [getReviews],
  (reviews: Review[]): Review[] => {
    const sorted = [...reviews].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, 10);
  }
);

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getIsLoadingOffer = (state: RootState): boolean => state.offer.isLoadingOffer;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getOfferError = (state: RootState): string | null => state.offer.error;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
export const getFavoritesError = (state: RootState): string | null => state.favorites.error;

