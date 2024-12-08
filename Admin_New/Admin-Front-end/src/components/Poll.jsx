// import React, { useState } from 'react';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import '../styles/ManageProfile.css';
// import { BASE_URL } from '../config';
// const CreatePoll = () => {
//   const [name, setName] = useState('');
//   const [options, setOptions] = useState(['', '']);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const addOption = () => setOptions([...options, '']);
//   const removeOption = (index) => {
//     setOptions(options.filter((_, idx) => idx !== index));
//   };

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         `${BASE_URL}/api/polls`,
//         { name, options, startDate, endDate },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setMessage('Poll created successfully!');
//       setName('');
//       setOptions(['', '']);
//       setStartDate('');
//       setEndDate('');
//     } catch (err) {
//       setError('Failed to create poll. Please try again.');
//     }
//   };

//   return (
//     <div className="manage-profile-container">
//       <Sidebar />
//       <div className="main-content">
//         <header className="header">
//           <h1>Create Poll</h1>
//         </header>
//         <div className="profile-form-container">

//         <form onSubmit={handleSubmit} className="profile-form">
//           <div className="form-group">
//             <label>Poll Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Options</label>
//             {options.map((option, index) => (
//               <div key={index}>
//                 <input
//                   type="text"
//                   value={option}
//                   onChange={(e) => handleOptionChange(index, e.target.value)}
//                   required
//                 />
//                 {index > 1 && <button type="button" className='pollBtn' onClick={() => removeOption(index)}>Remove</button>}
//               </div>
//             ))}
//             <button type="button" className='pollBtn' onClick={addOption}>Add Option</button>
//           </div>

//           <div className="form-group">
//             <label>Start Date</label>
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>End Date</label>
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="custom-button">Create Poll</button>

//           {message && <p className="success-message">{message}</p>}
//           {error && <p className="error-message">{error}</p>}
//         </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePoll;

import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/CreatePoll.css"; // Separate CSS for CreatePoll
import { BASE_URL } from "../config";

const CreatePoll = () => {
  const [name, setName] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const addOption = () => setOptions([...options, ""]);
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
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/polls`,
        { name, options, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Poll created successfully!");
      setName("");
      setOptions(["", ""]);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError("Failed to create poll. Please try again.");
    }
  };

  return (
    <div className="create-poll-container">
      <Sidebar />
      <div className="content">
        <header className="header">
          <h2>Create Poll</h2>
        </header>
        <div className="poll-form-container">
          <form onSubmit={handleSubmit} className="poll-form">
            <div className="form-group">
              <label htmlFor="pollName">
                Poll Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="pollName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter poll name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Options</label>
              {options.map((option, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="form-input"
                  />
                  {index > 1 && (
                    <button
                      type="button"
                      className="remove-option-button"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="button-container-new">
                <button
                  type="button"
                  className="add-option-button"
                  onClick={addOption}
                >
                  Add Option
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">
                Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                End Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">
                Create Poll
              </button>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
