import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import Sidebar from "./Sidebar"; // Import the Sidebar component
import "../styles/ManageProfile.css"; // Use ManageProfile.css for consistent styling

const IssuePage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories from Firebase
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${BASE_URL}/api/issues/categories`)
      .then((response) => {
        setCategories(Object.values(response.data.categories || {}));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Add new category to Firebase
  const handleAddCategory = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!categoryName.trim()) {
      setErrorMessage("Category name cannot be empty.");
      return;
    }

    axios
      .post(`${BASE_URL}/api/issues/addCategory`, { categoryName })
      .then((response) => {
        console.log("Category added:", response.data);
        setSuccessMessage("Category added successfully!");
        setCategoryName("");
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error adding category:", error);
        setErrorMessage("Failed to add category. Please try again.");
      });
  };

  // Delete category from Firebase
  const handleDeleteCategory = (categoryLabel) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryLabel}"?`))
      return;

    axios
      .delete(`${BASE_URL}/api/issues/deleteCategory`, {
        data: { categoryLabel },
      })
      .then(() => {
        setSuccessMessage(`Category "${categoryLabel}" deleted successfully.`);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        setErrorMessage(
          `Failed to delete category "${categoryLabel}". Please try again.`
        );
      });
  };

  return (
    <div className="manage-profile-container">
      {" "}
      {/* Main container for sidebar and content */}
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
            <div className="button-container">
              <button type="submit" className="custom-button-mp form-button">
                Add Category
              </button>
            </div>

            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>

          {/* Categories are displayed by default */}
          <h2 className="issue-subtitle">Categories:</h2>
          <div className="scrollable-list">
            <ul className="issue-list">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <li key={index} className="issue-item">
                    {category.label}
                    <button
                      onClick={() => handleDeleteCategory(category.label)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
