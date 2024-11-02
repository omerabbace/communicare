import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Sidebar from '../components/Sidebar';
import AssignedTaskTable from '../components/AssignedTaskTable';
import { Modal } from '@mui/material';
import IssueDetailsModal from '../components/IssueDetailsModal';
import '../styles/IssuesScreen.css';

const AssignedTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/in-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        const fetchedIssues = response.data.issues.map(item => {
        return {
          ...item,
          assignedVolunteers : item.assignedVolunteers.length,
        };
      });
    //   console.log("fetched issues",fetchedIssues);

      setTasks(fetchedIssues);
    } catch (error) {
      console.error('Error fetching assigned tasks:', error);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const handleViewDetails = (id) => {
    const taskToView = tasks.find(task => task._id === id);
    setSelectedTask(taskToView);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="assigned-tasks-screen-container">
      <Sidebar />
      <div className="content">
        <div className="header-container">
          <h2>Assigned Tasks</h2>
        </div>

        <AssignedTaskTable
          rows={tasks}
          onView={handleViewDetails}
        />

        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div>
            {selectedTask && (
              <IssueDetailsModal issue={selectedTask} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AssignedTasksScreen;
