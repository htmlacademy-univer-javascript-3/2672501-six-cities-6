import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { PrivateRoute } from './PrivateRoute';
import { offersReducer } from '../../../app/slices/offers-slice';
import { authReducer } from '../../../app/slices/auth-slice';
import { offerReducer } from '../../../app/slices/offer-slice';
import { favoritesReducer } from '../../../app/slices/favorites-slice';
import type { RootState } from '../../../store';

const TestComponent = () => <div>Protected Content</div>;

const rootReducer = {
  offers: offersReducer,
  auth: authReducer,
  offer: offerReducer,
  favorites: favoritesReducer
};

const createTestStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' | 'UNKNOWN') => {
  const preloadedState: Partial<RootState> = {
    offers: { offers: [], city: 'Paris', isLoading: false, error: null },
    auth: {
      authorizationStatus,
      user: authorizationStatus === 'AUTH' ? {
        email: 'user@test.com',
        token: 'token',
        name: 'User',
        avatarUrl: 'img/avatar.jpg',
        isPro: false
      } : null
    },
    offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
    favorites: { favorites: [], isLoading: false, error: null }
  };

  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
};

describe('PrivateRoute', () => {
  it('should render children for authorized user', () => {
    const store = createTestStore('AUTH');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to /login for unauthorized user (NO_AUTH)', () => {
    const store = createTestStore('NO_AUTH');

    const LoginPage = () => <div>Login Page</div>;

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to /login for user with UNKNOWN status', () => {
    const store = createTestStore('UNKNOWN');

    const LoginPage = () => <div>Login Page</div>;

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <TestComponent />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});

