import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewForm } from './ReviewForm';
import { offersReducer } from '../../../app/slices/offers-slice';
import { authReducer } from '../../../app/slices/auth-slice';
import { offerReducer } from '../../../app/slices/offer-slice';
import { favoritesReducer } from '../../../app/slices/favorites-slice';
import { createAPI } from '../../../services/api';
import type { RootState } from '../../../store';

const api = createAPI();
const mockApi = new MockAdapter(api);

const createTestStore = () => {
  const preloadedState: Partial<RootState> = {
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
  };

  return configureStore({
    reducer: {
      offers: offersReducer,
      auth: authReducer,
      offer: offerReducer,
      favorites: favoritesReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: api
        }
      }),
    preloadedState
  });
};

describe('ReviewForm', () => {
  beforeEach(() => {
    mockApi.reset();
  });

  it('should render form elements', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const rating5Label = screen.getByTitle(/perfect/i);
    await user.click(rating5Label);

    const commentInput = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(commentInput, 'This is a test comment that is longer than 50 characters to pass validation.');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should update rating when clicking on star', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const rating4Label = screen.getByTitle(/good/i);
    await user.click(rating4Label);

    const rating4Input = document.getElementById('4-stars') as HTMLInputElement;
    expect(rating4Input).toBeChecked();
  });

  it('should update comment when typing in textarea', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const commentInput = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(commentInput, 'Great place!');

    expect(commentInput).toHaveValue('Great place!');
  });

  it('should submit form with valid data', async () => {
    const review = {
      id: '1',
      user: { name: 'Test User', avatarUrl: 'img/avatar.jpg' },
      rating: 5,
      comment: 'Great place!',
      date: '2024-01-01'
    };

    mockApi.onPost('/comments/1').reply(200, review);
    mockApi.onGet('/comments/1').reply(200, [review]);

    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const rating5Label = screen.getByTitle(/perfect/i);
    await user.click(rating5Label);

    const commentInput = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(commentInput, 'This is a test comment that is longer than 50 characters to pass validation.');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockApi.history.post.length).toBeGreaterThan(0);
    });
  });

  it('should show error message when comment is too short', async () => {
    const store = createTestStore();
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const rating5Label = screen.getByTitle(/perfect/i);
    await user.click(rating5Label);

    const commentInput = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(commentInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should disable form during submission', async () => {
    const review = {
      id: '1',
      user: { name: 'Test User', avatarUrl: 'img/avatar.jpg' },
      rating: 5,
      comment: 'Great place!',
      date: '2024-01-01'
    };

    mockApi.onPost('/comments/1').reply(200, review);
    mockApi.onGet('/comments/1').reply(200, [review]);

    const store = createTestStore();
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );

    const rating5Label = screen.getByTitle(/perfect/i);
    await user.click(rating5Label);

    const commentInput = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(commentInput, 'This is a test comment that is longer than 50 characters to pass validation.');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    }, { timeout: 500 });

    await waitFor(() => {
      expect(mockApi.history.post.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});

