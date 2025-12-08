import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { AuthInfo } from '../types/auth';
import type { AuthorizationStatus } from './slices/auth-slice';
import type { AuthState } from './slices/auth-slice';
import type { OfferState } from './slices/offer-slice';

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

// Favorites selectors
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

// Auth selectors
export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => {
  const authState = state.auth as AuthState;
  return authState.authorizationStatus;
};

export const getUser = (state: RootState): AuthInfo | null => {
  const authState = state.auth as AuthState;
  return authState.user;
};

// Offer selectors
export const getCurrentOffer = (state: RootState): Offer | null => {
  const offerState = state.offer as OfferState;
  return offerState.currentOffer;
};

export const getNearbyOffers = (state: RootState): Offer[] => {
  const offerState = state.offer as OfferState;
  return offerState.nearbyOffers;
};

export const getReviews = (state: RootState): Review[] => {
  const offerState = state.offer as OfferState;
  return offerState.reviews;
};

export const getIsLoadingOffer = (state: RootState): boolean => {
  const offerState = state.offer as OfferState;
  return offerState.isLoadingOffer;
};

