// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ element: Component }) => {
//   // Check if the token exists in localStorage (indicating user is authenticated)
//   const token = localStorage.getItem('token');

//   // If the token does not exist, redirect to login page
//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   // If the token exists, render the component
//   return <Component />;
// };

// export default ProtectedRoute;





import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ element: Component }) => {
  // Check if the token exists in localStorage (indicating user is authenticated)
  const token = localStorage.getItem('token');

  // If the token does not exist, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the token exists, render the component
  // return <Component />;
  return (
    <div className="container-fluid mx-5" >
      <Navbar /> {/* Navbar displayed on all protected routes */}
      <div className="container-fluid mt-50" style={{ marginTop: '50px' }}>
      <Component />
      </div>
    </div>
  )
};

export default ProtectedRoute;
