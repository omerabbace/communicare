import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Sidebar from '../components/Sidebar';
import IssueTable from '../components/IssueTable';
import { Modal } from '@mui/material';
import IssueDetailsModal from '../components/IssueDetailsModal';
import ApproveModal from '../components/IssueApprovalModal';
import { useNavigate } from 'react-router-dom';
import '../styles/IssuesScreen.css';
const IssuesScreen = () => {
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); // New state for ApproveModal
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [reloadData, setReloadData] = useState(false);
  const navigate = useNavigate();

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/issueReporting/admin/issues`, {
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

      setIssues(fetchedIssues);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [reloadData]);

  const handleViewDetails = (id) => {
    const issueToView = issues.find(issue => issue._id === id);
    setSelectedIssue(issueToView);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
    setReloadData(prev => !prev);
  };

  const handleReject = async (issueId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BASE_URL}/api/issueReporting/issues/${issueId}/reject`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/rejectedissues');
    } catch (error) {
      console.error('Error rejecting issue:', error);
    }
  };

  const handleApprove = (id) => {
    const issueToApprove = issues.find(issue => issue._id === id);
    setSelectedIssue(issueToApprove);
    setIsApproveModalOpen(true); // Open Approve Modal
  };

  const handleAssignTask = async (issueId, volunteers) => {
    try {
      const token = localStorage.getItem('token');
      
      // Send request to set required volunteers for the issue
      await axios.put(`${BASE_URL}/api/issueReporting/set-required-volunteers`, {
        issueId,
        requiredVolunteers: volunteers,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setIsApproveModalOpen(false);
      navigate('/assignedtasks');
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task. Please try again.');
    }
  };
  

  return (
    <div className="issues-screen-container">
      <Sidebar />
      <div className="content">
        <div className="header-container">
          <h2>Reported Issues</h2>
        </div>

        <IssueTable
          rows={issues}
          onView={handleViewDetails}
          onReject={handleReject}
          onApprove={handleApprove}
          showReject={true}
          showApprove={true}
        />

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div>
            {selectedIssue && (
              <IssueDetailsModal issue={selectedIssue} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>

        <Modal open={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
          <div>
            {selectedIssue && (
              <ApproveModal
                issue={selectedIssue}
                onClose={() => setIsApproveModalOpen(false)}
                onAssignTask={handleAssignTask}
              />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default IssuesScreen;
