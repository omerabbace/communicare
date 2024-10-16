import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  // Check if the token exists in localStorage (indicating user is authenticated)
  const token = localStorage.getItem('token');

  // If the token does not exist, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the token exists, render the component
  return <Component />;
};

export default ProtectedRoute;
