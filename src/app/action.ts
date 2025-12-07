import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from './slices/auth-slice';

export const setCity = createAction<string>('SET_CITY');

export const setAuthorizationStatus = createAction<AuthorizationStatus>('SET_AUTHORIZATION_STATUS');

