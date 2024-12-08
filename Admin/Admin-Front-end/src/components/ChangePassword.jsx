import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/ManageProfile.css";
import axios from "axios";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For eye icon

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  // Handle form submission for password change
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Password length validation
    if (newPassword.length < 6) {
      setError("New password should be at least 6 characters long.");
      return;
    }

    // Password match validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("tokenn ", token);
      const response = await axios.put(
        `${BASE_URL}/api/user/profile/changePassword`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Current password is incorrect.");
      } else {
        setError("Failed to change password. Please try again.");
      }
    }
  };

  return (
    <div className="manage-profile-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1>Change Password</h1>
        </header>
        <div className="profile-form-container">
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Current Password */}
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="password-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="off" // Prevent auto-fill
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleCurrentPasswordVisibility}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="custom-button-mp">
                Change Password
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

export default ChangePassword;
