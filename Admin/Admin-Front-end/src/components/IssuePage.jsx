import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../styles/ManageProfile.css'; // Use ManageProfile.css for consistent styling

const IssuePage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCategories, setShowCategories] = useState(false); // Toggle state for categories visibility

  // Fetch categories from Firebase
  useEffect(() => {
    axios.get(`${BASE_URL}/api/issues/categories`)
      .then((response) => {
        setCategories(Object.values(response.data.categories || {}));
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Add new category to Firebase
  const handleAddCategory = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!categoryName.trim()) {
      setErrorMessage('Category name cannot be empty.');
      return;
    }

    axios.post(`${BASE_URL}/api/issues/addCategory`, { categoryName })
      .then((response) => {
        console.log('Category added:', response.data);
        setSuccessMessage('Category added successfully!');
        setCategoryName('');
        // Refetch categories after adding new one
        axios.get(`${BASE_URL}/api/issues/categories`)
          .then((response) => {
            setCategories(Object.values(response.data.categories || {}));
          });
      })
      .catch((error) => {
        console.error('Error adding category:', error);
        setErrorMessage('Failed to add category. Please try again.');
      });
  };

  // Toggle category visibility
  const toggleCategories = () => {
    setShowCategories((prev) => !prev);
  };

  return (
    <div className="manage-profile-container"> {/* Main container for sidebar and content */}
      <Sidebar /> {/* Sidebar component */}
      <div className="main-content">
        <header className="header">
          <h1>Issue Categories</h1>
        </header>
        <div className="profile-form-container">
          <form onSubmit={handleAddCategory} className="profile-form">
            <div className="form-group">
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category" // Added placeholder
                required
              />
            </div>
            
            <button type="submit" className="custom-button form-button">Add Category</button>
            
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>

          {/* Button to show/hide categories */}
          <button onClick={toggleCategories} className="custom-button form-button">
            {showCategories ? 'Hide Categories' : 'Show Categories'}
          </button>

          {showCategories && (
            <>
              <h2 className="issue-subtitle">Categories:</h2>
              {/* Scrollable list of categories */}
              <div className="scrollable-list">
                <ul className="issue-list">
                  {categories.map((category, index) => (
                    <li key={index} className="issue-item">
                      {category.label}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
