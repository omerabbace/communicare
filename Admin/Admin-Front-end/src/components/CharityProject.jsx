import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/ManageProfile.css';
import { BASE_URL } from '../config';

const CreateCharityProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
    //   console.log(token);
    //   console.log('title', title);
    //   console.log('desc', description);
    //   console.log('progress', progress);

      // Make API request to create charity project
      const response = await axios.post(
        `${BASE_URL}/api/charityProjects/create`,
        { title, description, progress },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Charity project created successfully!');
      setTitle('');
      setDescription('');
      setProgress('');
    } catch (err) {
      setError('Failed to create charity project. Please try again.');
    }
  };

  return (
    <div className="manage-profile-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1>Create Charity Project</h1>
        </header>
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Progress (0-100%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="custom-button">Create Project</button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCharityProject;
