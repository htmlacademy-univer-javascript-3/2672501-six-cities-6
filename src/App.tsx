import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/Main';
import { LoginPage } from './pages/Login';
import { FavoritesPage } from './pages/Favorites';
import { OfferPage } from './pages/Offer';
import { NotFoundPage } from './pages/NotFound';
import { PrivateRoute } from './shared/components/PrivateRoute';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
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
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
