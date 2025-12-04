import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from '../app/reducer';
import type { Action } from '../app/action';
import type { State } from '../app/reducer';

export const store = configureStore<{ offers: State }, Action>({
  reducer: {
    offers: offersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

