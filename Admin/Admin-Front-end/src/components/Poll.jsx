import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/ManageProfile.css';    
import { BASE_URL } from '../config';
const CreatePoll = () => {
  const [name, setName] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => {
    setOptions(options.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/polls`,
        { name, options, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Poll created successfully!');
      setName('');
      setOptions(['', '']);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      setError('Failed to create poll. Please try again.');
    }
  };

  return (
    <div className="manage-profile-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1>Create Poll</h1>
        </header>
        <div className="profile-form-container">

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Poll Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                {index > 1 && <button type="button" className='pollBtn' onClick={() => removeOption(index)}>Remove</button>}
              </div>
            ))}
            <button type="button" className='pollBtn' onClick={addOption}>Add Option</button>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="custom-button">Create Poll</button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
