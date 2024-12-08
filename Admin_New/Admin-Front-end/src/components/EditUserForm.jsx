    import React, { useState, useEffect } from 'react';
    import '../styles/userForm.css';

    const EditUserForm = ({ user, onClose }) => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            role : 'normal'
        });
        const [errors, setErrors] = useState({});

        // Initialize form data with user prop on mount or when user changes
        useEffect(() => {
            if (user) {
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '', 
                    confirmPassword: '' ,
                    role : 'normal',
                });
            }
        }, [user]);

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
            if (formData.password.length > 0 && formData.password.length < 6) {
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
                    <h2>Edit User</h2>
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
                                    <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>
                                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
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
                        
                        <div className="form-row button-container-edit">
                            <button type="submit" className="save-button-edit">
                                Save
                            </button>
                            <button type="button" className="cancel-button-edit" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    export default EditUserForm;
