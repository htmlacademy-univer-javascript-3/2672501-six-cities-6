import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { OffersList } from './OffersList';
import { Offer } from '../../../types/offer';
import { offersReducer } from '../../../app/slices/offers-slice';
import { authReducer } from '../../../app/slices/auth-slice';
import { offerReducer } from '../../../app/slices/offer-slice';
import { favoritesReducer } from '../../../app/slices/favorites-slice';
import type { RootState } from '../../../store';

const createMockOffer = (id: string, overrides: Partial<Offer> = {}): Offer => ({
  id,
  title: `Offer ${id}`,
  type: 'apartment',
  price: 100,
  rating: 4.5,
  previewImage: 'img/test.jpg',
  isPremium: false,
  isFavorite: false,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 }
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  bedrooms: 2,
  maxAdults: 4,
  goods: ['Wi-Fi', 'Kitchen'],
  host: {
    name: 'Host Name',
    avatarUrl: 'img/host.jpg',
    isPro: true
  },
  description: 'Test description',
  images: ['img/test.jpg'],
  ...overrides
});

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
    preloadedState
  });
};

vi.mock('../../../services/api-actions', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const actual = await vi.importActual<typeof import('../../../services/api-actions')>('../../../services/api-actions');
  const actualObj = actual as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...actualObj,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    toggleFavoriteAction: Object.assign(vi.fn(), {
      pending: { type: 'toggleFavoriteAction/pending' },
      fulfilled: { type: 'toggleFavoriteAction/fulfilled' },
      rejected: { type: 'toggleFavoriteAction/rejected' }
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    fetchFavoritesAction: Object.assign(vi.fn(), {
      pending: { type: 'fetchFavoritesAction/pending' },
      fulfilled: { type: 'fetchFavoritesAction/fulfilled' },
      rejected: { type: 'fetchFavoritesAction/rejected' }
    })
  };
});

describe('OffersList', () => {
  it('should render list of offers', () => {
    const offers = [
      createMockOffer('1', { title: 'Offer 1' }),
      createMockOffer('2', { title: 'Offer 2' }),
      createMockOffer('3', { title: 'Offer 3' })
    ];
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={offers} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 2')).toBeInTheDocument();
    expect(screen.getByText('Offer 3')).toBeInTheDocument();
  });

  it('should render empty list when no offers provided', () => {
    const store = createTestStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={[]} />
        </MemoryRouter>
      </Provider>
    );

    const listContainer = container.querySelector('.places__list');
    expect(listContainer).toBeInTheDocument();
  });

  it('should call onMouseEnter when hovering over an offer', () => {
    const offers = [createMockOffer('1')];
    const store = createTestStore();
    const onMouseEnter = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={offers} onMouseEnter={onMouseEnter} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByText('Offer 1').closest('article');
    if (card) {
      fireEvent.mouseEnter(card);
      expect(onMouseEnter).toHaveBeenCalledWith('1');
    }
  });

  it('should call onMouseLeave when mouse leaves an offer', () => {
    const offers = [createMockOffer('1')];
    const store = createTestStore();
    const onMouseLeave = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OffersList offers={offers} onMouseLeave={onMouseLeave} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByText('Offer 1').closest('article');
    if (card) {
      fireEvent.mouseLeave(card);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    }
  });
});

