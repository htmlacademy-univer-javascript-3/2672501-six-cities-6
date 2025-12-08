import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { fetchOffersAction, toggleFavoriteAction } from '../../services/api-actions';
import { setCity } from '../action';

export interface OffersState {
  offers: Offer[];
  city: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  city: '',
  isLoading: false,
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
  return 'Failed to load offers';
};

const updateOfferInList = (offers: Offer[], updatedOffer: Offer): Offer[] =>
  offers.map((offer) => offer.id === updatedOffer.id ? updatedOffer : offer);

export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fetchOffersAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchOffersAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.offers = action.payload;
      state.error = null;
    })
    .addCase(fetchOffersAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = getErrorMessage(action);
    })
    .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      state.offers = updateOfferInList(state.offers, action.payload);
    });
});

