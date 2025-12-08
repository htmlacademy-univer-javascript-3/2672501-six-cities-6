import { describe, expect, it } from 'vitest';
import { offersReducer, OffersState } from './offers-slice';
import { setCity } from '../action';
import { fetchOffersAction, toggleFavoriteAction } from '../../services/api-actions';
import { Offer } from '../../types/offer';

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test offer',
  type: 'apartment',
  price: 100,
  rating: 4,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: false,
  city: {
    name: 'Paris',
    location: { latitude: 1, longitude: 1, zoom: 10 }
  },
  location: { latitude: 1, longitude: 1, zoom: 10 },
  ...overrides
});

describe('offersReducer', () => {
  it('should return initial state', () => {
    const state = offersReducer(undefined, { type: 'UNKNOWN' });
    expect(state.city).toBe('');
    expect(state.offers).toEqual([]);
  });

  it('should set city on setCity action', () => {
    const state = offersReducer(undefined, setCity('Amsterdam'));
    expect(state.city).toBe('Amsterdam');
  });

  it('should set loading on fetchOffersAction.pending', () => {
    const state = offersReducer(undefined, { type: fetchOffersAction.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set offers on fetchOffersAction.fulfilled', () => {
    const offers = [makeOffer({ id: '1' }), makeOffer({ id: '2' })];
    const state = offersReducer(undefined, { type: fetchOffersAction.fulfilled.type, payload: offers });
    expect(state.offers).toEqual(offers);
    expect(state.isLoading).toBe(false);
  });

  it('should update offer on toggleFavoriteAction.fulfilled', () => {
    const initial: OffersState = {
      offers: [makeOffer({ id: '1', isFavorite: false }), makeOffer({ id: '2', isFavorite: false })],
      city: 'Paris',
      isLoading: false,
      error: null
    };

    const updated = makeOffer({ id: '2', isFavorite: true });
    const state = offersReducer(initial, { type: toggleFavoriteAction.fulfilled.type, payload: updated });
    expect(state.offers.find((o) => o.id === '2')?.isFavorite).toBe(true);
    expect(state.offers.find((o) => o.id === '1')?.isFavorite).toBe(false);
  });
});


