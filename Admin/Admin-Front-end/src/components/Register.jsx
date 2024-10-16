import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css'; // Your CSS file path
import { BASE_URL } from '../config';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('admin'); // Default role set to admin
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Front-end Validation
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
    const phoneRegex = /^\d{11}$/; // Regex for exactly 11 digits
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      setError('Phone number must be exactly 11 digits.');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check validation before making the request
    if (!validateForm()) {
      return; // If validation fails, exit the function
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password,
        phone,
        role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess('Registration successful!');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="left-section">
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" className="login-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;