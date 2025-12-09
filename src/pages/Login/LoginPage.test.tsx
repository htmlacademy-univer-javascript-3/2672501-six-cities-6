import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';
import { offersReducer } from '../../app/slices/offers-slice';
import { authReducer } from '../../app/slices/auth-slice';
import { offerReducer } from '../../app/slices/offer-slice';
import { favoritesReducer } from '../../app/slices/favorites-slice';
import type { RootState } from '../../store';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../../services/api';

const mockAxios = new MockAdapter(axios);
const api = createAPI();

const rootReducer = {
  offers: offersReducer,
  auth: authReducer,
  offer: offerReducer,
  favorites: favoritesReducer
};

const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as Partial<RootState>,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api
        }
      })
  });

describe('LoginPage', () => {

  it('should render login form', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should redirect to main page if already authorized', () => {
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
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument();
  });

  it('should validate email format on submit', async () => {
    mockAxios.reset();
    const user = userEvent.setup();
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password1');
    await user.click(submitButton);

    expect((emailInput as HTMLInputElement).validity.valid).toBe(false);
  });

  it('should display error for invalid password', async () => {
    mockAxios.reset();
    const user = userEvent.setup();
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'onlyletters');
    await user.click(submitButton);

    expect(await screen.findByText(/Password must contain at least one letter and one digit/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should display random city link', () => {
    const store = createTestStore({
      offers: { offers: [], city: 'Paris', isLoading: false, error: null },
      auth: { authorizationStatus: 'NO_AUTH', user: null },
      offer: { currentOffer: null, nearbyOffers: [], reviews: [], isLoadingOffer: false, error: null },
      favorites: { favorites: [], isLoading: false, error: null }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    const cityLinks = screen.getAllByRole('link');
    const cityLink = cityLinks.find((link) => {
      const text = link.textContent || '';
      return ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'].some((city) => text.includes(city));
    });
    expect(cityLink).toBeInTheDocument();
  });
});

