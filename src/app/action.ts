import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from './slices/auth-slice';

export const setCity = createAction<string>('offers/setCity');

export const setAuthorizationStatus = createAction<AuthorizationStatus>('auth/setAuthorizationStatus');

