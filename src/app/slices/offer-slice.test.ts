import { describe, expect, it } from 'vitest';
import { offerReducer, OfferState } from './offer-slice';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, toggleFavoriteAction } from '../../services/api-actions';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';

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

const makeReview = (overrides: Partial<Review> = {}): Review => ({
  id: '1',
  comment: 'Great place!',
  date: '2024-01-01',
  rating: 5,
  user: {
    name: 'John Doe',
    avatarUrl: 'img/avatar.jpg'
  },
  ...overrides
});

describe('offerReducer', () => {
  it('should return initial state', () => {
    const state = offerReducer(undefined, { type: 'UNKNOWN' });
    expect(state.currentOffer).toBeNull();
    expect(state.nearbyOffers).toEqual([]);
    expect(state.reviews).toEqual([]);
    expect(state.isLoadingOffer).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOfferAction.pending', () => {
    const state = offerReducer(undefined, { type: fetchOfferAction.pending.type });
    expect(state.isLoadingOffer).toBe(true);
    expect(state.error).toBeNull();
  });

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

  it('should handle fetchNearbyOffersAction.rejected', () => {
    const initial: OfferState = {
      currentOffer: null,
      nearbyOffers: [makeOffer({ id: '2' })],
      reviews: [],
      isLoadingOffer: false,
      error: null
    };
    const state = offerReducer(initial, { type: fetchNearbyOffersAction.rejected.type });
    expect(state.nearbyOffers).toEqual([]);
  });

  it('should handle fetchReviewsAction.fulfilled', () => {
    const reviews = [makeReview({ id: '1' }), makeReview({ id: '2' })];
    const state = offerReducer(undefined, { type: fetchReviewsAction.fulfilled.type, payload: reviews });
    expect(state.reviews).toEqual(reviews);
  });

  it('should handle fetchReviewsAction.rejected', () => {
    const initial: OfferState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [makeReview({ id: '1' })],
      isLoadingOffer: false,
      error: null
    };
    const state = offerReducer(initial, { type: fetchReviewsAction.rejected.type });
    expect(state.reviews).toEqual([]);
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

  it('should update currentOffer on toggleFavoriteAction.fulfilled when id matches', () => {
    const initial: OfferState = {
      currentOffer: makeOffer({ id: '1', isFavorite: false }),
      nearbyOffers: [],
      reviews: [],
      isLoadingOffer: false,
      error: null
    };

    const updated = makeOffer({ id: '1', isFavorite: true });
    const state = offerReducer(initial, { type: toggleFavoriteAction.fulfilled.type, payload: updated });
    expect(state.currentOffer?.isFavorite).toBe(true);
  });
});


