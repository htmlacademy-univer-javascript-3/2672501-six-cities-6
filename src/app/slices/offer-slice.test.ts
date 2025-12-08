import { describe, expect, it } from 'vitest';
import { offerReducer, OfferState } from './offer-slice';
import { fetchOfferAction, fetchNearbyOffersAction, toggleFavoriteAction } from '../../services/api-actions';
import { Offer } from '../../types/offer';

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Offer',
  type: 'apartment',
  price: 120,
  rating: 4,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: false,
  city: { name: 'Paris', location: { latitude: 1, longitude: 1, zoom: 10 } },
  location: { latitude: 1, longitude: 1, zoom: 10 },
  ...overrides
});

describe('offerReducer', () => {
  it('should handle fetchOfferAction.fulfilled', () => {
    const payload = makeOffer({ id: '42' });
    const state = offerReducer(undefined, { type: fetchOfferAction.fulfilled.type, payload });
    expect(state.currentOffer?.id).toBe('42');
    expect(state.isLoadingOffer).toBe(false);
  });

  it('should handle fetchOfferAction.rejected', () => {
    const state = offerReducer(undefined, { type: fetchOfferAction.rejected.type, payload: 'Error' });
    expect(state.currentOffer).toBeNull();
    expect(state.error).toBe('Error');
  });

  it('should handle fetchNearbyOffersAction.fulfilled', () => {
    const nearby = [makeOffer({ id: '2' }), makeOffer({ id: '3' })];
    const state = offerReducer(undefined, { type: fetchNearbyOffersAction.fulfilled.type, payload: nearby });
    expect(state.nearbyOffers).toEqual(nearby);
  });

  it('should handle toggleFavoriteAction.fulfilled for current and nearby', () => {
    const initial: OfferState = {
      currentOffer: makeOffer({ id: '1', isFavorite: false }),
      nearbyOffers: [makeOffer({ id: '2', isFavorite: false })],
      reviews: [],
      isLoadingOffer: false,
      error: null
    };

    const updated = makeOffer({ id: '2', isFavorite: true });
    const state = offerReducer(initial, { type: toggleFavoriteAction.fulfilled.type, payload: updated });
    expect(state.nearbyOffers.find((o) => o.id === '2')?.isFavorite).toBe(true);
    expect(state.currentOffer?.isFavorite).toBe(false);
  });
});


