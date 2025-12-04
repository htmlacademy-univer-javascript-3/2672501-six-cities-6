import { Offer } from '../types/offer';
import { AuthorizationStatus } from './reducer';

export type ActionType = 'SET_CITY' | 'SET_OFFERS' | 'SET_AUTHORIZATION_STATUS';

export interface SetCityAction {
  type: 'SET_CITY';
  payload: string;
}

export interface SetOffersAction {
  type: 'SET_OFFERS';
  payload: Offer[];
}

export interface SetAuthorizationStatusAction {
  type: 'SET_AUTHORIZATION_STATUS';
  payload: AuthorizationStatus;
}

export type Action = SetCityAction | SetOffersAction | SetAuthorizationStatusAction;

export const setCity = (city: string): SetCityAction => ({
  type: 'SET_CITY',
  payload: city
});

export const setOffers = (offersList: Offer[]): SetOffersAction => ({
  type: 'SET_OFFERS',
  payload: offersList
});

export const setAuthorizationStatus = (status: AuthorizationStatus): SetAuthorizationStatusAction => ({
  type: 'SET_AUTHORIZATION_STATUS',
  payload: status
});

