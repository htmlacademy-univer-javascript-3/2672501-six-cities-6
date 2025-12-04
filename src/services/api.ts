import axios, { AxiosError, AxiosInstance } from 'axios';

const BASE_URL = 'https://14.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;
export const TOKEN_KEY = 'six-cities-token';

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers['X-Token'] = token;
      }

      return config;
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError | Error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

