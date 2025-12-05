import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Offer } from '../types/offer';
import { AuthorizationStatus } from './reducer';
import { AuthInfo } from '../types/auth';
import { Review } from '../types/review';

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

export const getAuthorizationStatus = (state: RootState): AuthorizationStatus => state.offers.authorizationStatus;

export const getUser = (state: RootState): AuthInfo | null => state.offers.user;

export const getCurrentOffer = (state: RootState): Offer | null => state.offers.currentOffer;

export const getNearbyOffers = (state: RootState): Offer[] => state.offers.nearbyOffers;

export const getReviews = (state: RootState): Review[] => state.offers.reviews;

export const getIsLoadingOffer = (state: RootState): boolean => state.offers.isLoadingOffer;

