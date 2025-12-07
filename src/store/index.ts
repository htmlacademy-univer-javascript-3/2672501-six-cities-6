import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from '../app/slices/offers-slice';
import { authReducer } from '../app/slices/auth-slice';
import { offerReducer } from '../app/slices/offer-slice';
import { createAPI } from '../services/api';

const api = createAPI();

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    auth: authReducer,
    offer: offerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

