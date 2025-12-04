import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from '../app/reducer';
import type { Action } from '../app/action';
import type { State } from '../app/reducer';
import { createAPI } from '../services/api';

const api = createAPI();

export const store = configureStore<{ offers: State }, Action>({
  reducer: {
    offers: offersReducer
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

