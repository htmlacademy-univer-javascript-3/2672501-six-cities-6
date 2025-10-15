import React from 'react';
import { MainPage } from './pages/Main';

interface AppProps {
  placesCount: number;
}

export const App: React.FC<AppProps> = ({ placesCount }) => <MainPage placesCount={placesCount} />;
