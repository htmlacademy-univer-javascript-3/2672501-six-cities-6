import { describe, it, expect, beforeAll, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { offersReducer } from './app/slices/offers-slice';
import { authReducer } from './app/slices/auth-slice';
import { offerReducer } from './app/slices/offer-slice';
import { favoritesReducer } from './app/slices/favorites-slice';
import { MainPage } from './pages/Main';
import { FavoritesPage } from './pages/Favorites';
import { NotFoundPage } from './pages/NotFound';
import { LoginPage } from './pages/Login';
import { OfferPage } from './pages/Offer';
import { PrivateRoute } from './shared/components/PrivateRoute';
import type { RootState } from './store';

// Мокаем карту, чтобы исключить leaflet из тестов маршрутизации
vi.mock('./shared/components/Map', () => ({
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

describe('App routing', () => {
  beforeAll(() => {
    // silence console errors from React Router for unknown routes
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders main page on "/"', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByAltText(/6 cities logo/i)).toBeInTheDocument();
  });

  it('renders 404 page on unknown route', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown']}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByText(/404 Not Found/i)[0]).toBeInTheDocument();
  });

  it('renders favorites page for authorized user', () => {
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
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route path="/offer/:id" element={<OfferPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
  });
});


