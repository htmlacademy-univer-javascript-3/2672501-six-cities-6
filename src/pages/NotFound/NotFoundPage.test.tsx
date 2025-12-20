import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { NotFoundPage } from './NotFoundPage';
import { offersReducer } from '../../app/slices/offers-slice';
import { authReducer } from '../../app/slices/auth-slice';
import { offerReducer } from '../../app/slices/offer-slice';
import { favoritesReducer } from '../../app/slices/favorites-slice';
import type { RootState } from '../../store';

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

describe('NotFoundPage', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render 404 page with header', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    const notFoundText = screen.getAllByText(/404 Not Found/i);
    expect(notFoundText.length).toBeGreaterThan(0);
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
          <NotFoundPage />
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
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('should display link to main page', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Go to main page/i)).toBeInTheDocument();
  });
});

