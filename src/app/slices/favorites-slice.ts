import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { fetchFavoritesAction, toggleFavoriteAction } from '../../services/api-actions';

export interface FavoritesState {
  favorites: Offer[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null
};

export const favoritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchFavoritesAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.favorites = action.payload;
      state.error = null;
    })
    .addCase(fetchFavoritesAction.rejected, (state, action) => {
      state.isLoading = false;
      const actionObj = action as { payload?: unknown; error?: { message?: string } };
      if (typeof actionObj.payload === 'string') {
        state.error = actionObj.payload;
      } else if (actionObj.error && typeof actionObj.error === 'object' && typeof actionObj.error.message === 'string') {
        state.error = actionObj.error.message;
      } else {
        state.error = 'Failed to load favorites';
      }
    })
    .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      if (action.payload.isFavorite) {
        // Добавляем в избранное, если его там еще нет
        const exists = state.favorites.some((offer) => offer.id === action.payload.id);
        if (!exists) {
          state.favorites.push(action.payload);
        } else {
          state.favorites = state.favorites.map((offer) =>
            offer.id === action.payload.id ? action.payload : offer
          );
        }
      } else {
        // Удаляем из избранного
        state.favorites = state.favorites.filter((offer) => offer.id !== action.payload.id);
      }
    });
});

