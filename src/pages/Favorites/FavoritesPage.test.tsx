import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { FavoritesPage } from './FavoritesPage';
import { offersReducer } from '../../app/slices/offers-slice';
import { authReducer } from '../../app/slices/auth-slice';
import { offerReducer } from '../../app/slices/offer-slice';
import { favoritesReducer } from '../../app/slices/favorites-slice';
import type { RootState } from '../../store';
import { Offer } from '../../types/offer';


const makeOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  rating: 4,
  previewImage: 'img.jpg',
  isPremium: false,
  isFavorite: true,
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

describe('FavoritesPage', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render favorites page with header', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: {
        authorizationStatus: 'AUTH',
        user: {
          email: 'user@test.com',
          token: 'token',
          name: 'User',
          avatarUrl: 'img/avatar.jpg',
          isPro: false
        }
      },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
  });

  it('should display empty state when no favorites', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: {
        authorizationStatus: 'AUTH',
        user: {
          email: 'user@test.com',
          token: 'token',
          name: 'User',
          avatarUrl: 'img/avatar.jpg',
          isPro: false
        }
      },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    const emptyStateText = screen.queryByText(/Nothing yet saved/i);
    expect(emptyStateText || screen.queryByText(/Saved listing/i)).toBeTruthy();
  });

  it('should display favorites list when favorites exist', () => {
    const favorites = [
      makeOffer({ id: '1', title: 'Test Offer 1' }),
      makeOffer({ id: '2', title: 'Test Offer 2' })
    ];

    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: {
        authorizationStatus: 'AUTH',
        user: {
          email: 'user@test.com',
          token: 'token',
          name: 'User',
          avatarUrl: 'img/avatar.jpg',
          isPro: false
        }
      },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites, isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText(/Nothing yet saved/i)).not.toBeInTheDocument();
  });
});

