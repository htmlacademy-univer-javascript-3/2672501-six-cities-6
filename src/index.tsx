import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { store, AppDispatch } from './store';
import { setCity } from './app/action';
import { fetchOffersAction, checkAuthAction, fetchFavoritesAction } from './services/api-actions';
import 'leaflet/dist/leaflet.css';

const dispatch: AppDispatch = store.dispatch;
dispatch(setCity('Paris'));
dispatch(checkAuthAction()).then((result) => {
  if (checkAuthAction.fulfilled.match(result)) {
    void dispatch(fetchFavoritesAction());
  }
});
dispatch(fetchOffersAction());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
