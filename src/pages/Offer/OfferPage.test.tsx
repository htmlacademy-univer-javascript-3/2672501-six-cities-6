import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { OfferPage } from './OfferPage';
import { offersReducer } from '../../app/slices/offers-slice';
import { authReducer } from '../../app/slices/auth-slice';
import { offerReducer } from '../../app/slices/offer-slice';
import { favoritesReducer } from '../../app/slices/favorites-slice';
import type { RootState } from '../../store';
import { Offer } from '../../types/offer';

vi.mock('../../shared/components/Map', () => ({
  Map: () => <div data-testid="map-mock" />
}));

vi.mock('../../services/api-actions', async () => {
  const actual = await vi.importActual<typeof import('../../services/api-actions')>('../../services/api-actions');
  return {
    ...actual,
    fetchOfferAction: {
      ...actual.fetchOfferAction,
      pending: { type: 'offer/fetchOffer/pending' },
      fulfilled: { type: 'offer/fetchOffer/fulfilled' },
      rejected: { type: 'offer/fetchOffer/rejected' }
    },
    fetchNearbyOffersAction: {
      ...actual.fetchNearbyOffersAction,
      fulfilled: { type: 'offer/fetchNearbyOffers/fulfilled' },
      rejected: { type: 'offer/fetchNearbyOffers/rejected' }
    },
    fetchReviewsAction: {
      ...actual.fetchReviewsAction,
      fulfilled: { type: 'offer/fetchReviews/fulfilled' },
      rejected: { type: 'offer/fetchReviews/rejected' }
    },
    toggleFavoriteAction: {
      ...actual.toggleFavoriteAction,
      fulfilled: { type: 'offer/toggleFavorite/fulfilled' },
      rejected: { type: 'offer/toggleFavorite/rejected' }
    },
    fetchFavoritesAction: {
      ...actual.fetchFavoritesAction,
      fulfilled: { type: 'favorites/fetchFavorites/fulfilled' },
      rejected: { type: 'favorites/fetchFavorites/rejected' }
    }
  };
});

const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test Offer',
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

const rootReducer = {
  offers: offersReducer,
  auth: authReducer,
  offer: offerReducer,
  favorites: favoritesReducer
};

const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as Partial<RootState>
  });

describe('OfferPage', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render loading state', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: true, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByAltText(/6 cities logo/i)).toBeInTheDocument();
  });

  it('should render offer details', () => {
    const offer = makeOffer({ id: '1', title: 'Test Offer', description: 'Test description' });
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: offer, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
  });

  it('should display error when offer fails to load', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: 'Error loading offer' },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );

    const errorTexts = screen.getAllByText(/Error loading offer/i);
    expect(errorTexts.length).toBeGreaterThan(0);
  });
});

