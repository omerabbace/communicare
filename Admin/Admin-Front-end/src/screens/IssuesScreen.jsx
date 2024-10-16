import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import { BASE_URL } from '../config'; // Base URL configuration
import Sidebar from '../components/Sidebar'; // Sidebar component
import IssueTable from '../components/IssueTable'; // The issue table component
import { Modal } from '@mui/material'; // For modal
import IssueDetailsModal from '../components/IssueDetailsModal'; // Modal for issue details
import '../styles/IssuesScreen.css'; // Custom CSS for this screen

const IssuesScreen = () => {
  const [issues, setIssues] = useState([]); // State to store the list of issues
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedIssue, setSelectedIssue] = useState(null); // Track the selected issue for the modal

  // Fetch issues when the component mounts
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Make API request to fetch issues
        const response = await axios.get(`${BASE_URL}/api/issueReporting/admin/issues`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedIssues = response.data.issues.map(item =>{
            const formattedDate = new Date(item.createdAt).toLocaleString('en-GB');
            const name = item.reportedBy.name;
            const media = item.media.uri;
            return{
                date : formattedDate,  
                name : name,
                media : media,
                ...item,
        };
        });
        // Set issues data if request is successful
        setIssues(fetchedIssues);
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  // Handle opening the modal and setting the selected issue
  const handleViewDetails = (id) => {
    const issueToView = issues.find(issue => issue._id === id);
    setSelectedIssue(issueToView); 
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  return (
    <div className="issues-screen-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="content">
        <div className="header-container">
          <h2>Reported Issues</h2>
        </div>

        {/* Issues Table */}
        <IssueTable rows={issues} onView={handleViewDetails} />

        {/* Modal for Viewing Issue Details */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div>
            {selectedIssue && (
              <IssueDetailsModal issue={selectedIssue} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default IssuesScreen;
