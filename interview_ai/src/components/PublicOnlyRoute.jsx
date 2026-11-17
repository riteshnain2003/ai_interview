import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.Auth);

  if (isAuthenticated) {
    return <Navigate to="/Details" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
