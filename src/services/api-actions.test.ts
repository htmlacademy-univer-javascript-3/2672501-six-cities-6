import { describe, expect, it, vi, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { createAPI } from './api';
import {
  fetchOffersAction,
  fetchFavoritesAction,
  toggleFavoriteAction,
  checkAuthAction
} from './api-actions';
import { Offer } from '../types/offer';

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Offer',
  type: 'apartment',
  price: 100,
  rating: 4,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: false,
  city: { name: 'Paris', location: { latitude: 1, longitude: 1, zoom: 10 } },
  location: { latitude: 1, longitude: 1, zoom: 10 },
  ...overrides
});

describe('api-actions', () => {
  const api = createAPI();
  const mockApi = new MockAdapter(api);
  const dispatch = vi.fn();
  const getState = vi.fn();

  beforeEach(() => {
    mockApi.reset();
    dispatch.mockClear();
    getState.mockClear();
  });

  it('fetchOffersAction should dispatch fulfilled on success', async () => {
    const offers = [makeOffer({ id: '1' })];
    mockApi.onGet('/offers').reply(200, offers);

    const action = fetchOffersAction();
    await action(dispatch, getState, api);

    const types = dispatch.mock.calls.map((call) => call[0].type);
    expect(types).toContain(fetchOffersAction.pending.type);
    expect(types).toContain(fetchOffersAction.fulfilled.type);
  });

  it('fetchOffersAction should dispatch rejected on error', async () => {
    mockApi.onGet('/offers').reply(500);

    const action = fetchOffersAction();
    await action(dispatch, getState, api);
    const types = dispatch.mock.calls.map((call) => call[0].type);
    expect(types).toContain(fetchOffersAction.rejected.type);
  });

  it('toggleFavoriteAction should post and fulfill', async () => {
    const updated = makeOffer({ id: '2', isFavorite: true });
    mockApi.onPost('/favorite/2/1').reply(200, updated);

    const action = toggleFavoriteAction({ offerId: '2', isFavorite: true });
    await action(dispatch, getState, api);
    const types = dispatch.mock.calls.map((call) => call[0].type);
    expect(types).toContain(toggleFavoriteAction.fulfilled.type);
  });

  it('fetchFavoritesAction should dispatch fulfilled on success', async () => {
    const favorites = [makeOffer({ id: '3', isFavorite: true })];
    mockApi.onGet('/favorite').reply(200, favorites);

    const action = fetchFavoritesAction();
    await action(dispatch, getState, api);
    const types = dispatch.mock.calls.map((call) => call[0].type);
    expect(types).toContain(fetchFavoritesAction.fulfilled.type);
  });

  it('checkAuthAction should dispatch rejected on 401', async () => {
    mockApi.onGet('/login').reply(401);
    const action = checkAuthAction();
    await action(dispatch, getState, api);
    const types = dispatch.mock.calls.map((call) => call[0].type);
    expect(types).toContain(checkAuthAction.rejected.type);
  });
});


