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
    case fetchOffersAction.rejected.type:
      return { ...state, isLoading: false, error: action.error.message || 'Failed to load offers' };
    default:
      return state;
  }
};

