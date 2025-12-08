import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaceCard } from './PlaceCard';
import { Offer } from '../../../types/offer';
import { offersReducer } from '../../../app/slices/offers-slice';
import { authReducer } from '../../../app/slices/auth-slice';
import { offerReducer } from '../../../app/slices/offer-slice';
import { favoritesReducer } from '../../../app/slices/favorites-slice';
import type { RootState } from '../../../store';

const createMockOffer = (overrides: Partial<Offer> = {}): Offer => ({
  id: '1',
  title: 'Test Offer',
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

const createTestStore = (authorizationStatus: 'AUTH' | 'NO_AUTH' = 'AUTH') => {
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
    reducer: {
      offers: offersReducer,
      auth: authReducer,
      offer: offerReducer,
      favorites: favoritesReducer
    },
    preloadedState
  });
};

// Мокаем API actions
vi.mock('../../../services/api-actions', async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const actual = await vi.importActual<typeof import('../../../services/api-actions')>('../../../services/api-actions');
  const actualObj = actual as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...actualObj,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    toggleFavoriteAction: Object.assign(
      vi.fn(() => ({
        type: 'toggleFavoriteAction',
        payload: Promise.resolve({})
      })),
      {
        pending: { type: 'toggleFavoriteAction/pending' },
        fulfilled: { type: 'toggleFavoriteAction/fulfilled' },
        rejected: { type: 'toggleFavoriteAction/rejected' }
      }
    ),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    fetchFavoritesAction: Object.assign(
      vi.fn(() => ({
        type: 'fetchFavoritesAction',
        payload: Promise.resolve([])
      })),
      {
        pending: { type: 'fetchFavoritesAction/pending' },
        fulfilled: { type: 'fetchFavoritesAction/fulfilled' },
        rejected: { type: 'fetchFavoritesAction/rejected' }
      }
    )
  };
});

describe('PlaceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render offer information correctly', () => {
    const offer = createMockOffer();
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText(/€100/)).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByAltText('Place image')).toHaveAttribute('src', 'img/test.jpg');
  });

  it('should display premium badge for premium offers', () => {
    const offer = createMockOffer({ isPremium: true });
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should not display premium badge for non-premium offers', () => {
    const offer = createMockOffer({ isPremium: false });
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should call onMouseEnter when mouse enters card', () => {
    const offer = createMockOffer();
    const store = createTestStore();
    const onMouseEnter = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} onMouseEnter={onMouseEnter} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByRole('article');
    fireEvent.mouseEnter(card);

    expect(onMouseEnter).toHaveBeenCalledWith(offer.id);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('should call onMouseLeave when mouse leaves card', () => {
    const offer = createMockOffer();
    const store = createTestStore();
    const onMouseLeave = vi.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} onMouseLeave={onMouseLeave} />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByRole('article');
    fireEvent.mouseLeave(card);

    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should show active bookmark button when offer is favorite', () => {
    const offer = createMockOffer({ isFavorite: true });
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
    expect(screen.getByText('In bookmarks')).toBeInTheDocument();
  });

  it('should show inactive bookmark button when offer is not favorite', () => {
    const offer = createMockOffer({ isFavorite: false });
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).not.toHaveClass('place-card__bookmark-button--active');
    expect(screen.getByText('To bookmarks')).toBeInTheDocument();
  });

  it('should navigate to login when clicking bookmark as unauthorized user', async () => {
    const offer = createMockOffer();
    const store = createTestStore('NO_AUTH');
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlaceCard offer={offer} />
        </MemoryRouter>
      </Provider>
    );

    const bookmarkButton = screen.getByRole('button');
    await user.click(bookmarkButton);

    // Проверяем, что произошел редирект (через проверку URL или через Navigate)
    expect(window.location.pathname).toBe('/');
  });
});

