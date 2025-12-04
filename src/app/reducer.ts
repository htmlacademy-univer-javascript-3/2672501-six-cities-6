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

type OffersAction =
  | Action
  | ReturnType<typeof fetchOffersAction.pending>
  | ReturnType<typeof fetchOffersAction.fulfilled>
  | ReturnType<typeof fetchOffersAction.rejected>;

export const offersReducer = (state: State = initialState, action: OffersAction | { type: string }): State => {
  switch (action.type) {
    case 'SET_CITY':
      if ('payload' in action && typeof action.payload === 'string') {
        return { ...state, city: action.payload };
      }
      return state;
    case 'SET_OFFERS':
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, offers: action.payload };
      }
      return state;
    case fetchOffersAction.pending.type:
      return { ...state, isLoading: true, error: null };
    case fetchOffersAction.fulfilled.type:
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, isLoading: false, offers: action.payload };
      }
      return { ...state, isLoading: false };
    case fetchOffersAction.rejected.type: {
      let errorMessage = 'Failed to load offers';
      if ('payload' in action && typeof action.payload === 'string') {
        errorMessage = action.payload;
      } else if ('error' in action && action.error && typeof action.error === 'object' && 'message' in action.error) {
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
