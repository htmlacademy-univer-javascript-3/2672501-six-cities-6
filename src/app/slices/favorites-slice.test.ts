import { describe, expect, it } from 'vitest';
import { favoritesReducer, FavoritesState } from './favorites-slice';
import { fetchFavoritesAction, toggleFavoriteAction } from '../../services/api-actions';
import { Offer } from '../../types/offer';

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Fav',
  type: 'room',
  price: 90,
  rating: 3,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: true,
  city: { name: 'Paris', location: { latitude: 1, longitude: 1, zoom: 10 } },
  location: { latitude: 1, longitude: 1, zoom: 10 },
  ...overrides
});

describe('favoritesReducer', () => {
  it('should handle fetchFavoritesAction.pending', () => {
    const state = favoritesReducer(undefined, { type: fetchFavoritesAction.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFavoritesAction.fulfilled', () => {
    const favorites = [makeOffer({ id: '5' })];
    const state = favoritesReducer(undefined, { type: fetchFavoritesAction.fulfilled.type, payload: favorites });
    expect(state.favorites).toEqual(favorites);
    expect(state.isLoading).toBe(false);
  });

  it('should add to favorites on toggleFavoriteAction.fulfilled', () => {
    const updated = makeOffer({ id: '3', isFavorite: true });
    const state = favoritesReducer(undefined, { type: toggleFavoriteAction.fulfilled.type, payload: updated });
    expect(state.favorites.some((o) => o.id === '3')).toBe(true);
  });

  it('should remove from favorites when isFavorite false', () => {
    const initial: FavoritesState = {
      favorites: [makeOffer({ id: '1', isFavorite: true }), makeOffer({ id: '2', isFavorite: true })],
      isLoading: false,
      error: null
    };
    const updated = makeOffer({ id: '1', isFavorite: false });
    const state = favoritesReducer(initial, { type: toggleFavoriteAction.fulfilled.type, payload: updated });
    expect(state.favorites.some((o) => o.id === '1')).toBe(false);
    expect(state.favorites.some((o) => o.id === '2')).toBe(true);
  });
});


