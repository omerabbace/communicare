// import React, { useEffect, useState } from 'react';
// import '../styles/IssuesScreen.css';
// import CompletedIssueTable from '../components/CompletedIssueTable'; // Reuse this table component
// import Sidebar from '../components/Sidebar';
// import TaskProgressModal from '../components/TaskProgressModal'; // Import the new TaskProgressModal
// import { Modal } from '@mui/material';
// import axios from 'axios';
// import { BASE_URL } from '../config';

// const InProgressIssuesScreen = () => {
//   const [inProgressIssues, setInProgressIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [openModal, setOpenModal] = useState(false); // For TaskProgressModal

//   const handleOpenModal = (issue) => {
//     setSelectedIssue(issue);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedIssue(null);
//     setOpenModal(false);
//   };

//   useEffect(() => {
//     const fetchInProgressIssues = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/in-progress-issues-reports`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // console.log("hheheh",response.data);

//         const issuesWithId = response.data.issues.map(issue => ({
//           id: issue._id,
//           reportedBy : issue.reportedBy.name,
//           description: issue.description,
//           leader: issue.leader?.name || 'N/A',
//           updatedBy: issue.progressUpdates?.[0]?.updatedBy.name || 'N/A', // Get the latest 'updatedBy' name
//           status: issue.status,
//           issueType: issue.issueType,
//           location: issue.location,
//           createdAt: issue.createdAt,
//           progressUpdates: issue.progressUpdates || [], // Include progress updates for modal
//         }));
//         setInProgressIssues(issuesWithId);
//       } catch (error) {
//         console.error('Error fetching in-progress issues:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInProgressIssues();
//   }, []);

//   if (loading) {
//     return <div className="loading-spinner"></div>;
//   }

//   return (
//     <div className="issues-screen-container">
//       <Sidebar />
//       <div className="content">
//         <h2>In progress Issues Updates</h2>
//         {inProgressIssues.length > 0 ? (
//           <CompletedIssueTable
//             rows={inProgressIssues}
//             onViewDetails={handleOpenModal} // Opens TaskProgressModal
//             isCompleted={false} // Ensures "Updated By" column shows
//             isCompletedScreen={false} 
//           />
//         ) : (
//           <div className="no-issues-message">There are no in-progress issue reports right now.</div>
//         )}

//         {/* TaskProgressModal for viewing progress details */}
//         <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="task-progress-modal">
//           <div>
//             {selectedIssue && (
//               <TaskProgressModal
//                 issue={selectedIssue}
//                 onClose={handleCloseModal}
//               />
//             )}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default InProgressIssuesScreen;


import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Modal } from '@mui/material';
import axios from 'axios';
import CompletedIssueTable from '../components/CompletedIssueTable';
import TaskProgressModal from '../components/TaskProgressModal';
import { BASE_URL } from '../config';
import '../styles/InProgressIssuesScreen.css';

const InProgressIssuesScreen = () => {
  const [inProgressIssues, setInProgressIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchInProgressIssues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/issueReporting/in-progress-issues-reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const issuesWithId = response.data.issues.map((issue) => ({
          id: issue._id,
          reportedBy: issue.reportedBy.name,
          description: issue.description,
          leader: issue.leader?.name || 'N/A',
          updatedBy: issue.progressUpdates?.[0]?.updatedBy.name || 'N/A',
          status: issue.status,
          issueType: issue.issueType,
          location: issue.location,
          createdAt: issue.createdAt,
          progressUpdates: issue.progressUpdates || [],
        }));
        setInProgressIssues(issuesWithId);
      } catch (error) {
        console.error('Error fetching in-progress issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressIssues();
  }, []);

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
    setOpenModal(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="in-progress-issues-container">
      <Sidebar />
      <div className="content">
        <header className="Header">
          <h1>In Progress Issues Updates</h1>
        </header>

        {inProgressIssues.length > 0 ? (
          <CompletedIssueTable
            rows={inProgressIssues}
            onViewDetails={handleOpenModal}
            isCompleted={false}
            isCompletedScreen={false}
          />
        ) : (
          <div className="no-issues-message">There are no in-progress issue reports right now.</div>
        )}

        <Modal open={openModal} onClose={handleCloseModal}>
          <div className="modal-content">
            {selectedIssue && (
              <TaskProgressModal
                issue={selectedIssue}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default InProgressIssuesScreen;
