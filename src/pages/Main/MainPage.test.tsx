import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { MainPage } from './MainPage';
import { offersReducer } from '../../app/slices/offers-slice';
import { authReducer } from '../../app/slices/auth-slice';
import { offerReducer } from '../../app/slices/offer-slice';
import { favoritesReducer } from '../../app/slices/favorites-slice';
import type { RootState } from '../../store';

vi.mock('../../shared/components/Map', () => ({
  Map: () => <div data-testid="map-mock" />
}));

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

describe('MainPage', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render main page with header', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByAltText(/6 cities logo/i)).toBeInTheDocument();
  });

  it('should display sign in link when not authorized', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('should display user info when authorized', () => {
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
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });
});


