import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import { BASE_URL } from '../config';
import axios from 'axios';
import '../styles/ServiceProviders.css'; // Import CSS for layout styling
import { useNavigate } from 'react-router-dom';
import { Modal, Box } from '@mui/material';
import EditServiceProviderForm from '../components/EditServiceProvider';
import ToggleSwitch from '../components/ToggleSwitch';

const ServiceProviders = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [showActiveUsers, setShowActiveUsers] = useState(true); // State to toggle active/inactive users

  const [selectedServiceProvider, setSelectedServiceProvider] = useState(null); // State for the user to edit
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Make API request to fetch service provider users
        const response = await axios.get(`${BASE_URL}/api/user/getAllServiceProviders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set service provider data if request is successful
        setServiceProviders(response.data.data);
      } catch (error) {
        console.error('Error fetching service providers:', error);
      }
    };

    // Call the function to fetch service providers
    fetchServiceProviders();
  }, []);

  const handleEdit = (id) => {
    // Find the service provider to be edited
    const providerToEdit = serviceProviders.find(provider => provider._id === id);
    setSelectedServiceProvider(providerToEdit); // Set the user for editing
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedServiceProvider(null); // Clear selected user
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/api/users/disable/${id}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.data.success) {
        // Update the state to reflect the change
        setServiceProviders(prevUsers => prevUsers.map(user => 
          user._id === id ? { ...user, isActive: false } : user
        ));
      } else {
        console.error('Failed to disable the user');
      }
    } catch (err) {
      console.error('Error disabling user:', err);
    }
  };

  // Handle adding a new service provider
  const handleAddServiceProvider = () => {
    navigate('/serviceproviderForm');
  };

  // Toggle between active and inactive service providers
  const handleToggle = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  // Filter service providers based on active/inactive state
  const filteredServiceProviders = serviceProviders.filter(provider => 
    showActiveUsers ? provider.isActive : !provider.isActive
  );

  return (
    <div className="service-providers-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="content">
        <div className="header-container">
          <h2>Service Providers</h2>
          <button className="add-service-provider-btn" onClick={handleAddServiceProvider}>
            + New Service Provider
          </button>
        </div>
        
        {/* Search and Filters (Optional) */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search service provider..."
          />
          {/* Toggle Switch for Active/Inactive */}
          <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
        </div>

        {/* Service Providers Table */}
        <UserTable rows={filteredServiceProviders} onEdit={handleEdit} onDelete={handleDelete} />

        {/* Modal for Editing Service Provider */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div>
            {selectedServiceProvider && (
              <EditServiceProviderForm user={selectedServiceProvider} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceProviders;
