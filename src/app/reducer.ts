import { Offer } from '../types/offer';
import { Action } from './action';
import { fetchOffersAction, checkAuthAction, loginAction } from '../services/api-actions';
import { AuthInfo } from '../types/auth';

export type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export interface State {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
}

const initialState: State = {
  city: '',
  offers: [],
  isLoading: false,
  error: null,
  authorizationStatus: 'UNKNOWN',
  user: null
};

type OffersAction =
  | Action
  | ReturnType<typeof fetchOffersAction.pending>
  | ReturnType<typeof fetchOffersAction.fulfilled>
  | ReturnType<typeof fetchOffersAction.rejected>
  | ReturnType<typeof checkAuthAction.fulfilled>
  | ReturnType<typeof checkAuthAction.rejected>
  | ReturnType<typeof loginAction.fulfilled>
  | ReturnType<typeof loginAction.rejected>;

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
    case 'SET_AUTHORIZATION_STATUS':
      if ('payload' in action && typeof action.payload === 'string') {
        return { ...state, authorizationStatus: action.payload as AuthorizationStatus };
      }
      return state;
    case checkAuthAction.fulfilled.type:
      if ('payload' in action && typeof action.payload === 'object' && action.payload !== null) {
        return { ...state, authorizationStatus: 'AUTH', user: action.payload as AuthInfo };
      }
      return state;
    case checkAuthAction.rejected.type:
      return { ...state, authorizationStatus: 'NO_AUTH', user: null };
    case loginAction.fulfilled.type:
      if ('payload' in action && typeof action.payload === 'object' && action.payload !== null) {
        return { ...state, authorizationStatus: 'AUTH', user: action.payload as AuthInfo };
      }
      return { ...state, authorizationStatus: 'AUTH' };
    case loginAction.rejected.type:
      return { ...state, authorizationStatus: 'NO_AUTH' };
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

