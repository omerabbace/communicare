import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import "../styles/ManageProfile.css";
// import '../styles/ProfileManagement.css';
import axios from "axios"; // For making API requests
import { BASE_URL } from "../config"; // Assuming you have a BASE_URL in config.js

const ManageProfile = () => {
  // States for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token); // Log the token

        // Check if token is available
        if (!token) {
          setError("No token found, please login.");
          return;
        }

        // Make the API request to fetch user profile
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Profile Update Response:", response.data);

        console.log("API Response:", response); // Log the full response

        // Check if user data is in the response and set the state
        if (response.data && response.data.user) {
          const { name, email, phone } = response.data.user;
          setName(name);
          setEmail(email);
          setPhone(phone);
        } else {
          setError("Failed to load user details from the response.");
          console.log("Unexpected response structure:", response.data); // Log unexpected structure
        }
      } catch (err) {
        // Log the error response for detailed debugging
        if (err.response) {
          // The request was made and the server responded with a status code
          console.error("Error Response Data:", err.response.data);
          console.error("Error Response Status:", err.response.status);
          console.error("Error Response Headers:", err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          console.error("Error Request:", err.request);
        } else {
          // Something else happened in setting up the request
          console.error("Error Message:", err.message);
        }
        setError(
          "Failed to load user details. Please check your connection or login again."
        );
      }
    };

    fetchUserDetails();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/user/profile`,
        {
          name,
          email,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Profile updated successfully!");
      setIsEditing(false); // Exit editing mode after successful update
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
    setMessage("");
  };

  return (
    <div className="manage-profile-container">
      {/* Reusable Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Manage Profile</h1>
        </header>

        {/* Profile Form */}
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={!isEditing} // Disable input when not in edit mode
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isEditing} // Disable input when not in edit mode
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={!isEditing} // Disable input when not in edit mode
              />
            </div>

            <div className="button-container" >
              {/* Display either Edit or Save Changes buttons */}
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="custom-button-mp"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  className="custom-button-mp"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
