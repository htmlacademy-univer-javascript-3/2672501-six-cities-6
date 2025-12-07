import { createReducer } from '@reduxjs/toolkit';
import { AuthInfo } from '../../types/auth';
import { checkAuthAction, loginAction } from '../../services/api-actions';
import { setAuthorizationStatus } from '../action';

export type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export interface AuthState {
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
}

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAuthorizationStatus, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(checkAuthAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = action.payload;
    })
    .addCase(checkAuthAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    })
    .addCase(loginAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = action.payload;
    })
    .addCase(loginAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    });
});

