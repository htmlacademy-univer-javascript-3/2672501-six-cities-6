import { Offer } from '../types/offer';
import { Action } from './action';
import { fetchOffersAction, checkAuthAction, loginAction, fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, submitReviewAction } from '../services/api-actions';
import { AuthInfo } from '../types/auth';
import { Review } from '../types/review';

export type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export interface State {
  city: string;
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isLoadingOffer: boolean;
}

const initialState: State = {
  city: '',
  offers: [],
  isLoading: false,
  error: null,
  authorizationStatus: 'UNKNOWN',
  user: null,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isLoadingOffer: false
};

type OffersAction =
  | Action
  | ReturnType<typeof fetchOffersAction.fulfilled>
  | ReturnType<typeof fetchOffersAction.rejected>
  | ReturnType<typeof checkAuthAction.fulfilled>
  | ReturnType<typeof checkAuthAction.rejected>
  | ReturnType<typeof loginAction.fulfilled>
  | ReturnType<typeof loginAction.rejected>
  | ReturnType<typeof fetchOfferAction.fulfilled>
  | ReturnType<typeof fetchOfferAction.rejected>
  | ReturnType<typeof fetchNearbyOffersAction.fulfilled>
  | ReturnType<typeof fetchNearbyOffersAction.rejected>
  | ReturnType<typeof fetchReviewsAction.fulfilled>
  | ReturnType<typeof fetchReviewsAction.rejected>
  | ReturnType<typeof submitReviewAction.fulfilled>
  | ReturnType<typeof submitReviewAction.rejected>
  | { type: string };

export const offersReducer = (state: State = initialState, action: OffersAction | { type: string }): State => {
  switch (action.type) {
    case 'SET_CITY':
      if ('payload' in action && typeof action.payload === 'string') {
        return { ...state, city: action.payload };
      }
      return state;
    case 'SET_OFFERS':
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, offers: action.payload as Offer[] };
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
    case fetchOfferAction.pending.type:
      return { ...state, isLoadingOffer: true, error: null };
    case fetchOffersAction.fulfilled.type:
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, isLoading: false, offers: action.payload as Offer[] };
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
    case fetchOfferAction.fulfilled.type:
      if ('payload' in action && typeof action.payload === 'object' && action.payload !== null) {
        return { ...state, isLoadingOffer: false, currentOffer: action.payload as Offer };
      }
      return { ...state, isLoadingOffer: false };
    case fetchOfferAction.rejected.type: {
      let errorMessage = 'Failed to load offer';
      if ('payload' in action && typeof action.payload === 'string') {
        errorMessage = action.payload;
      } else if ('error' in action && action.error && typeof action.error === 'object' && 'message' in action.error) {
        const errorObj = action.error as { message?: unknown };
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
      }
      return { ...state, isLoadingOffer: false, error: errorMessage, currentOffer: null };
    }
    case fetchNearbyOffersAction.pending.type:
      return { ...state };
    case fetchNearbyOffersAction.fulfilled.type:
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, nearbyOffers: action.payload as Offer[] };
      }
      return state;
    case fetchNearbyOffersAction.rejected.type:
      return { ...state, nearbyOffers: [] };
    case fetchReviewsAction.pending.type:
      return { ...state };
    case fetchReviewsAction.fulfilled.type:
      if ('payload' in action && Array.isArray(action.payload)) {
        return { ...state, reviews: action.payload as Review[] };
      }
      return state;
    case fetchReviewsAction.rejected.type:
      return { ...state, reviews: [] };
    case submitReviewAction.fulfilled.type:
      return state;
    case submitReviewAction.rejected.type:
      return state;
    default:
      return state;
  }
};

