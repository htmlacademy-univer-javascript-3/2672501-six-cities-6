import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
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
    } catch (error: any) {
      console.error('Error loading offers:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response) {
        // Сервер ответил с ошибкой
        const message = error.response.data?.message || `Server error: ${error.response.status}`;
        return rejectWithValue(message);
      } else if (error.request) {
        // Запрос был отправлен, но ответа не получено
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        // Ошибка при настройке запроса
        return rejectWithValue(error.message || 'Failed to load offers');
      }
    }
  }
);

