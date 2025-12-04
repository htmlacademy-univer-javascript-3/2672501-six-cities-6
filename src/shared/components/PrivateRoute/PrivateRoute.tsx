import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthorizationStatus } from '../../../app/selectors';

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authorizationStatus = useSelector(getAuthorizationStatus);

  return authorizationStatus === 'AUTH' ? children : <Navigate to="/login" />;
};
