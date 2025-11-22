import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { offers } from './mocks/offers';
import { store } from './store';
import { fillOffers, setCity } from './app/action';
import 'leaflet/dist/leaflet.css';

store.dispatch(fillOffers());
store.dispatch(setCity('Paris'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App offers={offers} />
    </Provider>
  </React.StrictMode>
);
