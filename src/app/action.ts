import { Offer, offers } from '../mocks/offers';

export type ActionType = 'SET_CITY' | 'SET_OFFERS';

export interface SetCityAction {
  type: 'SET_CITY';
  payload: string;
}

export interface SetOffersAction {
  type: 'SET_OFFERS';
  payload: Offer[];
}

export type Action = SetCityAction | SetOffersAction;

export const setCity = (city: string): SetCityAction => ({
  type: 'SET_CITY',
  payload: city
});

export const setOffers = (offersList: Offer[]): SetOffersAction => ({
  type: 'SET_OFFERS',
  payload: offersList
});

export const fillOffers = (): SetOffersAction => ({
  type: 'SET_OFFERS',
  payload: offers
});
