import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => (
  isAuthenticated ? children : <Navigate to="/login" />
);
