import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { AuthInfo, LoginData } from '../types/auth';
import { TOKEN_KEY } from './api';

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'offers/fetchOffers',
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Offer[]>('/offers');

      if (!data) {
        return [];
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Сервер ответил с ошибкой
          const message = (error.response.data as { message?: string })?.message || `Server error: ${error.response.status}`;
          return rejectWithValue(message);
        } else if (error.request) {
          // Запрос был отправлен, но ответа не получено
          return rejectWithValue('No response from server. Please check your connection.');
        }
      }
      // Ошибка при настройке запроса
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load offers');
    }
  }
);

export const checkAuthAction = createAsyncThunk<
  AuthInfo,
  void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'user/checkAuth',
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<AuthInfo>('/login');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return rejectWithValue('NO_AUTH');
        }
        if (error.response) {
          const message = (error.response.data as { message?: string })?.message || `Server error: ${error.response.status}`;
          return rejectWithValue(message);
        } else if (error.request) {
          return rejectWithValue('No response from server. Please check your connection.');
        }
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to check auth');
    }
  }
);

export const loginAction = createAsyncThunk<
  AuthInfo,
  LoginData,
  { extra: AxiosInstance; rejectValue: string }
>(
  'user/login',
  async ({ email, password }, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthInfo>('/login', { email, password });

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          let message = 'Failed to login';
          const responseData: unknown = error.response.data;

          if (status === 400) {
            // Try to extract error message from various possible formats
            if (typeof responseData === 'string') {
              message = responseData;
            } else if (responseData && typeof responseData === 'object') {
              const dataObj = responseData as {
                message?: string;
                error?: string;
                details?: string;
                errors?: Array<{ message?: string; path?: string }>;
                [key: string]: unknown;
              };

              // Try different fields for error message
              if (dataObj.message) {
                message = dataObj.message;
              } else if (dataObj.error) {
                message = dataObj.error;
              } else if (dataObj.details) {
                message = dataObj.details;
              } else if (Array.isArray(dataObj.errors) && dataObj.errors.length > 0) {
                // Handle array of validation errors
                message = dataObj.errors
                  .map((err) => err.message || err.path || 'Validation error')
                  .join(', ');
              } else {
                // Try to find any string value in the response
                const stringValues = Object.values(dataObj).filter(
                  (val) => typeof val === 'string' && val.length > 0
                );
                if (stringValues.length > 0) {
                  message = stringValues[0] as string;
                } else {
                  message = 'Bad request. Please check your input data.';
                }
              }
            } else {
              message = 'Bad request. Please check your input data.';
            }
          } else {
            if (typeof responseData === 'string') {
              message = responseData;
            } else if (responseData && typeof responseData === 'object') {
              const dataObj = responseData as { message?: string; error?: string };
              message = dataObj.message || dataObj.error || `Server error: ${status}`;
            } else {
              message = `Server error: ${status}`;
            }
          }

          return rejectWithValue(message);
        } else if (error.request) {
          return rejectWithValue('No response from server. Please check your connection.');
        }
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login');
    }
  }
);

