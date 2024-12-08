import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DefaultPage.css';

const DefaultPage = () => {
  return (
    <div className="default-page">
      <div className="content-wrapper"> {/* Wraps content for vertical centering */}
        {/* Top Image */}
        <div className="image-container">
          <img src="/img/home.jpg" alt="Communi Care" className="center-image" />
        </div>

        {/* Content Section */}
        <div className="welcome-box">
          <h1>Welcome to Communi Care</h1>
        </div>

        {/* Bottom Buttons */}
        <div className="button-container">
          <Link to="/login">
            <button className="custom-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="custom-button">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;