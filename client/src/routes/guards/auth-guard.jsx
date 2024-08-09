import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default AuthGuard;
