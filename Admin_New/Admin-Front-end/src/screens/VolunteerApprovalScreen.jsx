import React, { useState, useEffect } from 'react';
import VerificationTable from '../components/VerificationTable'; // Reuse the table component with the approval/rejection feature
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import { BASE_URL } from '../config';
import axios from 'axios';
import '../styles/Approvals.css'; 

const VolunteerApprovalScreen = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/user/getAllVolunteers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVolunteers(response.data.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };
    fetchVolunteers();
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
        setVolunteers((prev) =>
          prev.map((volunteer) =>
            volunteer._id === id ? { ...volunteer, isAccepted: true } : volunteer
          )
        );
      } else {
        console.error('Failed to approve volunteer');
      }
    } catch (err) {
      console.error('Error approving volunteer:', err);
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
        setVolunteers((prev) =>
          prev.map((volunteer) =>
            volunteer._id === id ? { ...volunteer, isAccepted: false } : volunteer
          )
        );
      } else {
        console.error('Failed to reject volunteer');
      }
    } catch (err) {
      console.error('Error rejecting volunteer:', err);
    }
  };

  return (
    <div className="approval-container">
      <Sidebar />

      <div className="content">
        <div className="header-container">
          <h2>Volunteer Approvals</h2>
        </div>

        {/* Verification Table */}
        <VerificationTable
          rows={volunteers}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
};

export default VolunteerApprovalScreen;
