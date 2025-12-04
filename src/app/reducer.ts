import { Offer } from '../types/offer';
import { Action } from './action';
import { fetchOffersAction } from '../services/api-actions';

export interface State {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: State = {
  city: '',
  offers: [],
  isLoading: false,
  error: null
};

export const offersReducer = (state: State = initialState, action: Action | ReturnType<typeof fetchOffersAction.pending> | ReturnType<typeof fetchOffersAction.fulfilled> | ReturnType<typeof fetchOffersAction.rejected>): State => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_OFFERS':
      return { ...state, offers: action.payload };
    case fetchOffersAction.pending.type:
      return { ...state, isLoading: true, error: null };
    case fetchOffersAction.fulfilled.type:
      return { ...state, isLoading: false, offers: action.payload };
    case fetchOffersAction.rejected.type: {
      let errorMessage = 'Failed to load offers';
      if (action.payload) {
        errorMessage = action.payload;
      } else if (action.error && typeof action.error === 'object' && 'message' in action.error) {
        const errorObj = action.error as { message?: unknown };
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
      }
      return { ...state, isLoading: false, error: errorMessage };
    }
    default:
      return state;
  }
};

