import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const InterviewGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.Auth);
  const sessionid = useSelector((state) => state.Interview?.sessionid);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  if (!sessionid) {
    return <Navigate to="/Details" replace />;
  }

  return children;
};

export default InterviewGuard;
