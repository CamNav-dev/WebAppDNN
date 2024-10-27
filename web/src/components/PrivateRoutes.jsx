import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirigir al usuario a la página de inicio de sesión si no hay token
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;