import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';

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

