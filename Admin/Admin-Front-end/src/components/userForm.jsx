import React, { useState } from 'react';
import '../styles/userForm.css';
import Sidebar from './Sidebar';
import axios from 'axios'; // Import axios
import { BASE_URL } from '../config'; // Assuming you have a config file for your base URL
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'normal',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // State to show success message
    
    // Function to handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Function to validate the form
    const validate = () => {
        const newErrors = {};

        // Validate full name (only letters and max length 50)
        if (!/^[A-Za-z\s]{1,50}$/.test(formData.name)) {
            newErrors.name = 'Full Name should contain only letters.';
        }

        // Validate email
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Validate phone number (11 digits)
        if (!/^\d{11}$/.test(formData.phone)) {
            newErrors.phone = 'Phone Number should contain 11 digits.';
        }

        // Validate password (minimum 6 characters)
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        // Validate confirm password (must match password)
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const token = localStorage.getItem('token');
                const { confirmPassword, ...requestData } = formData;
                const response = await axios.post(`${BASE_URL}/api/users/registerusers`, 
                    requestData, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                // Show success message if request is successful
                if (response.data.success) {
                    setSuccessMessage('User added successfully!');
                    navigate('/normaluser');
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: '',
                        role: 'normal'
                    });
                }
            } catch (error) {
                console.error('Error adding user:', error);
                // Display backend validation error or general error
                setErrors({ api: error.response?.data?.message || 'Failed to add user. Please try again later.' });
            }
        }
    };

    return (
        <div className='userForm-container'>
            <Sidebar />
            <div className="main-content">
                <h2>Create User</h2>
                {successMessage && <p className="success-text">{successMessage}</p>}
                {errors.api && <p className="error-text">{errors.api}</p>}
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="name">Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Full Name"
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="form-input"

                                />
                            </div>
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="email">Email Address <span className="required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email Address"
                                    value={formData.email} // Corrected value
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone} // Corrected value
                                    onChange={handleChange}
                                    className="form-input"
                                    maxLength= '11'
                                />
                            </div>
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="password">Password <span className="required">*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>
                    </div>
                    <div className="form-row button-container">
                        <button type="submit" className="submit-button">
                           + Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
