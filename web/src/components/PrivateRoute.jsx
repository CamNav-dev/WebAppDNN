import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  // Redirect to /signin if not authenticated
  return currentUser ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
