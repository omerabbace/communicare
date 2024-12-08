import React, { useState, useEffect } from 'react';
import '../styles/userForm.css';

const EditServiceProviderForm = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        cnic: '',
        serviceType: '',
    });
    const [errors, setErrors] = useState({});

    // Initialize form data with user prop on mount or when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || '',
                email: user.email || '',
                phoneNumber: user.phone || '',
                cnic: user.cnic || '',
                serviceType: user.serviceType || '',
                password: '', // Leave password empty for security reasons
                confirmPassword: ''
            });
        }
    }, [user]);

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format CNIC field to XXXXX-XXXXXX-X format
        if (name === 'cnic') {
            let formattedValue = value.replace(/\D/g, ''); // Remove non-digit characters
            if (formattedValue.length > 5) {
                formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
            }
            if (formattedValue.length > 12) {
                formattedValue = formattedValue.slice(0, 12) + '-' + formattedValue.slice(12, 13);
            }
            setFormData({
                ...formData,
                [name]: formattedValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Function to validate the form
    const validate = () => {
        const newErrors = {};

        // Validate full name (only letters and max length 50)
        if (!/^[A-Za-z\s]{1,50}$/.test(formData.fullName)) {
            newErrors.fullName = 'Full Name should contain only letters.';
        }

        // Validate email
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Validate phone number (11 digits)
        if (!/^\d{11}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone Number should contain 11 digits.';
        }

        // Validate password (minimum 6 characters)
        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        // Validate confirm password (must match password)
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        // Validate CNIC (XXXXX-XXXXXX-X format)
        if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
            newErrors.cnic = 'CNIC should be in the format XXXXX-XXXXXXX-X.';
        }

        // Validate service type selection
        if (!formData.serviceType) {
            newErrors.serviceType = 'Please select a service type.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formData);
            // Submit form or perform desired action
        }
    };

    return (
        <div className='userForm-container'>
            <div className="main-content">
                <h2>Edit Service Provider</h2>
                <form className="user-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                        </div>
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="email">Email Address <span className="required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email Address"
                                    value={formData.email}
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
                                <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                            </div>
                            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                        </div>
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="password">Password</label>
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
                                <label htmlFor="confirmPassword">Confirm Password</label>
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
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="cnic">CNIC <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="cnic"
                                    id="cnic"
                                    placeholder="CNIC (XXXXX-XXXXXX-X)"
                                    value={formData.cnic}
                                    onChange={handleChange}
                                    className="form-input"
                                    maxLength="15" // Max length for CNIC format
                                />
                            </div>
                            {errors.cnic && <span className="error-text">{errors.cnic}</span>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-label-input">
                                <label htmlFor="serviceType">Service Type <span className="required">*</span></label>
                                <select
                                    name="serviceType"
                                    id="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="">Select Service Type</option>
                                    <option value="Accident Management">Accident Management</option>
                                    <option value="Vehicle Assistance">Vehicle Assistance</option>
                                </select>
                            </div>
                            {errors.serviceType && <span className="error-text">{errors.serviceType}</span>}
                        </div>
                    </div>
                    <div className="form-row button-container-edit">
                        <button type="submit" className="save-button">
                            Save
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditServiceProviderForm;
