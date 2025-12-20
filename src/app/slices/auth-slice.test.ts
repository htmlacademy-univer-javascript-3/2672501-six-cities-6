import { describe, expect, it } from 'vitest';
import { authReducer, AuthState, AuthorizationStatus } from './auth-slice';
import { setAuthorizationStatus } from '../action';
import { checkAuthAction, loginAction } from '../../services/api-actions';
import { AuthInfo } from '../../types/auth';

const makeAuthInfo = (overrides: Partial<AuthInfo> = {}): AuthInfo => ({
  email: 'user@test.com',
  token: 'token',
  name: 'User',
  avatarUrl: 'img/avatar.jpg',
  isPro: false,
  ...overrides
});

describe('authReducer', () => {
  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN' });
    expect(state.authorizationStatus).toBe<AuthorizationStatus>('UNKNOWN');
    expect(state.user).toBeNull();
  });

  it('should set authorization status', () => {
    const state = authReducer(undefined, setAuthorizationStatus('AUTH'));
    expect(state.authorizationStatus).toBe('AUTH');
  });

  it('should set user on checkAuthAction.fulfilled', () => {
    const payload = makeAuthInfo();
    const state = authReducer(undefined, { type: checkAuthAction.fulfilled.type, payload });
    expect(state.authorizationStatus).toBe('AUTH');
    expect(state.user).toEqual(payload);
  });

  it('should reset user on checkAuthAction.rejected', () => {
    const initial: AuthState = { authorizationStatus: 'AUTH', user: makeAuthInfo() };
    const state = authReducer(initial, { type: checkAuthAction.rejected.type });
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
  });

  it('should set user on loginAction.fulfilled', () => {
    const payload = makeAuthInfo({ email: 'login@test.com' });
    const state = authReducer(undefined, { type: loginAction.fulfilled.type, payload });
    expect(state.authorizationStatus).toBe('AUTH');
    expect(state.user).toEqual(payload);
  });

  it('should reset user on loginAction.rejected', () => {
    const initial: AuthState = { authorizationStatus: 'AUTH', user: makeAuthInfo() };
    const state = authReducer(initial, { type: loginAction.rejected.type });
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
  });
});


