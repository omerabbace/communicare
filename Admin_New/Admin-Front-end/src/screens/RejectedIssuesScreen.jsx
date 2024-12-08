import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Sidebar from '../components/Sidebar';
import IssueTable from '../components/IssueTable';
import IssueDetailsModal from '../components/IssueDetailsModal'; // Modal for issue details
import { Modal } from '@mui/material'; // For modal
import '../styles/IssuesScreen.css';

const RejectedIssuesScreen = () => {
  const [rejectedIssues, setRejectedIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedIssue, setSelectedIssue] = useState(null); // Track the selected issue for the modal
  const [reloadData, setReloadData] = useState(false); // Trigger to reload the issues when updated

  const fetchRejectedIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/rejected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedIssues = response.data.issues.map(item => {
        const formattedDate = new Date(item.createdAt).toLocaleString('en-GB');
        const name = item.reportedBy.name;
        const media = item.media.uri;
        return {
          date: formattedDate,
          name: name,
          media: media,
          ...item,
        };
      });
      setRejectedIssues(fetchedIssues);
    } catch (error) {
      console.error('Error fetching rejected issues:', error);
    }
  };

  useEffect(() => {
    fetchRejectedIssues();
  }, [reloadData]);

  const handleViewDetails = (id) => {
    const issueToView = rejectedIssues.find(issue => issue._id === id);
    setSelectedIssue(issueToView);
    setIsModalOpen(true);
  };

  // Handle closing the modal and trigger reload data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRejectedIssues(null);
    setReloadData(prev => !prev); // Toggle reloadData to refetch issues after modal closes
  };
  return (
    <div className="issues-screen-container">
      <Sidebar />
      <div className="content">
        <div className="header-container">
          <h2>Rejected Issues</h2>
        </div>
        <IssueTable rows={rejectedIssues} onView={handleViewDetails} showReject={false} showApprove={false} />

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

export default RejectedIssuesScreen;
