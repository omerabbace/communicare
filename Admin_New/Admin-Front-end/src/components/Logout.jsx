import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const myNavigation = useNavigate();

  useEffect(() => {
    // Clear the token from localStorage (or any other storage)
    localStorage.removeItem('token');

    // Redirect the user to the login page
    myNavigation('/login');
  }, [myNavigation]);

  return (
    <div>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
