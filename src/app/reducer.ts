import { Offer } from '../mocks/offers';
import { Action } from './action';

export interface State {
  city: string;
  offers: Offer[];
}

const initialState: State = {
  city: '',
  offers: []
};

export const offersReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_OFFERS':
      return { ...state, offers: action.payload };
    default:
      return state;
  }
};


