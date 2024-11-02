import React, { useState, useEffect } from 'react';
import VerificationTable from '../components/VerificationTable'; // Reuse the table component with the approval/rejection feature
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import { BASE_URL } from '../config';
import axios from 'axios';
import '../styles/Approvals.css'; // Import CSS for layout styling

const ServiceProviderApprovalScreen = () => {
  const [serviceProviders, setServiceProviders] = useState([]);

  useEffect(() => {
    const fetchServiceProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/user/getAllServiceProviders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServiceProviders(response.data.data);
      } catch (error) {
        console.error('Error fetching service providers:', error);
      }
    };
    fetchServiceProviders();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/api/users/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setServiceProviders((prev) =>
          prev.map((provider) =>
            provider._id === id ? { ...provider, isAccepted: true } : provider
          )
        );
      } else {
        console.error('Failed to approve service provider');
      }
    } catch (err) {
      console.error('Error approving service provider:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/api/users/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setServiceProviders((prev) =>
          prev.map((provider) =>
            provider._id === id ? { ...provider, isAccepted: false } : provider
          )
        );
      } else {
        console.error('Failed to reject service provider');
      }
    } catch (err) {
      console.error('Error rejecting service provider:', err);
    }
  };

  return (
    <div className="approval-container">
      <Sidebar />

      <div className="content">
        <div className="header-container">
          <h2>Service Provider Approvals</h2>
        </div>

        {/* Verification Table */}
        <VerificationTable
          rows={serviceProviders}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default ServiceProviderApprovalScreen;
