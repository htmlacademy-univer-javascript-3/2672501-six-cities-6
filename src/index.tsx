import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/Main';
import { LoginPage } from './pages/Login';
import { FavoritesPage } from './pages/Favorites';
import { OfferPage } from './pages/Offer';
import { NotFoundPage } from './pages/NotFound';
import { PrivateRoute } from './shared/components/PrivateRoute';

const appData = {
  placesCount: 312
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage placesCount={appData.placesCount} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/favorites"
          element={
            <PrivateRoute isAuthenticated={false}>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
