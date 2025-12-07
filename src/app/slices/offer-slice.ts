import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction } from '../../services/api-actions';

export interface OfferState {
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isLoadingOffer: boolean;
  error: string | null;
}

const initialState: OfferState = {
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isLoadingOffer: false,
  error: null
};

const getErrorMessage = (action: unknown): string => {
  if (typeof action === 'object' && action !== null) {
    const actionObj = action as { payload?: unknown; error?: { message?: string } };
    if (typeof actionObj.payload === 'string') {
      return actionObj.payload;
    }
    if (actionObj.error && typeof actionObj.error === 'object' && typeof actionObj.error.message === 'string') {
      return actionObj.error.message;
    }
  }
  return 'Failed to load offer';
};

export const offerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchOfferAction.pending, (state) => {
      state.isLoadingOffer = true;
      state.error = null;
    })
    .addCase(fetchOfferAction.fulfilled, (state, action) => {
      state.isLoadingOffer = false;
      state.currentOffer = action.payload;
      state.error = null;
    })
    .addCase(fetchOfferAction.rejected, (state, action) => {
      state.isLoadingOffer = false;
      state.currentOffer = null;
      state.error = getErrorMessage(action);
    })
    .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(fetchNearbyOffersAction.rejected, (state) => {
      state.nearbyOffers = [];
    })
    .addCase(fetchReviewsAction.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(fetchReviewsAction.rejected, (state) => {
      state.reviews = [];
    });
});

