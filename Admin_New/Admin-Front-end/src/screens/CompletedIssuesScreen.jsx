// import React, { useEffect, useState } from 'react';
// import '../styles/IssuesScreen.css';
// import CompletedIssueTable from '../components/CompletedIssueTable';
// import Sidebar from '../components/Sidebar';
// import CompletedModal from '../components/CompletedModal';
// import AdminReportModal from '../components/AdminReportModal'; // Import AdminReportModal
// import { Modal } from '@mui/material';
// import axios from 'axios';
// import { BASE_URL } from '../config';

// const CompletedIssuesScreen = () => {
//   const [completedIssues, setCompletedIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [openModal, setOpenModal] = useState(false); // For CompletedModal
//   const [openReportModal, setOpenReportModal] = useState(false); // For AdminReportModal

//   const handleOpenModal = (issue) => {
//     setSelectedIssue(issue);
//     setOpenModal(true);
//   };

//   const handleOpenReportModal = (issue) => {
//     setSelectedIssue(issue);
//     setOpenReportModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedIssue(null);
//     setOpenModal(false);
//   };

//   const handleCloseReportModal = () => {
//     setSelectedIssue(null);
//     setOpenReportModal(false);
//   };

//   const handleSubmitReport = async (reportDescription) => {
//     if (!selectedIssue) return;
//     const token = localStorage.getItem('token');
  
//     try {
//       await axios.post(
//         `${BASE_URL}/api/issueReporting/task-status/${selectedIssue.id}`,
//         { description: reportDescription },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert('Report submitted successfully.');
//       handleCloseReportModal(); // Close the AdminReportModal after successful submission
//     } catch (error) {
//       console.error('Error submitting report:', error);
//       alert('Failed to submit report.');
//     }
//   };

//   useEffect(() => {
//     const fetchCompletedIssues = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/completed-issues`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const issuesWithId = response.data.completedIssues.map(issue => ({
//           id: issue._id,
//           description: issue.description,
//           leader: issue.leader?.name || 'N/A',
//           completionReport: issue.completionReport?.description || 'No Report',
//           completionDate: issue.completionReport?.date || 'No Date',
//           completedBy: issue.completionReport?.completedBy || 'N/A',
//           reportedBy: issue.reportedBy?.name || 'N/A',
//           reportedByEmail: issue.reportedBy?.email || 'N/A',
//           status: issue.status,
//           issueType: issue.issueType,
//           location: issue.location,
//           media: issue.completionReport.media,
//           createdAt: issue.createdAt,
//         }));

//         setCompletedIssues(issuesWithId);
//       } catch (error) {
//         console.error('Error fetching completed issues:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompletedIssues();
//   }, []);

//   if (loading) {
//     return <div className="loading-spinner"></div>;
//   }

//   return (
//     <div className="issues-screen-container">
//       <Sidebar />
//       <div className="content">
//         <h2>Completed Issues</h2>
//         {completedIssues.length > 0 ? (
//           <CompletedIssueTable
//             rows={completedIssues}
//             onViewDetails={handleOpenModal} // Opens CompletedModal
//             onReport={handleOpenReportModal} // Opens AdminReportModal for reporting action
//             isCompleted={true} 
//             isCompletedScreen={true} 

//           />
//         ) : (
//           <div className="no-issues-message">There are no completed issues right now.</div>
//         )}

//         {/* CompletedModal for viewing issue details */}
//         <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="issue-details-modal">
//           <div>
//             {selectedIssue && (
//               <CompletedModal
//                 issue={selectedIssue}
//                 onClose={handleCloseModal}
//                 onSubmitReport={handleSubmitReport}
//               />
//             )}
//           </div>
//         </Modal>

//         {/* AdminReportModal for submitting a report to the user */}
//         <Modal open={openReportModal} onClose={handleCloseReportModal} aria-labelledby="admin-report-modal">
//           <div>
//             {selectedIssue && (
//               <AdminReportModal
//                 open={openReportModal}
//                 issue={selectedIssue}
//                 onClose={handleCloseReportModal}
//                 onSubmit={handleSubmitReport}

//               />
//             )}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CompletedIssuesScreen;

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Modal } from '@mui/material';
import axios from 'axios';
import CompletedIssueTable from '../components/CompletedIssueTable';
import CompletedModal from '../components/CompletedModal';
import AdminReportModal from '../components/AdminReportModal';
import { BASE_URL } from '../config';
import '../styles/CompletedIssuesScreen.css';

const CompletedIssuesScreen = () => {
  const [completedIssues, setCompletedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);

  useEffect(() => {
    const fetchCompletedIssues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/issueReporting/completed-issues`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const issuesWithId = response.data.completedIssues.map((issue) => ({
          id: issue._id,
          description: issue.description,
          leader: issue.leader?.name || 'N/A',
          completionReport: issue.completionReport?.description || 'No Report',
          completionDate: issue.completionReport?.date || 'No Date',
          completedBy: issue.completionReport?.completedBy || 'N/A',
          reportedBy: issue.reportedBy?.name || 'N/A',
          reportedByEmail: issue.reportedBy?.email || 'N/A',
          status: issue.status,
          issueType: issue.issueType,
          location: issue.location,
          media: issue.completionReport.media,
          createdAt: issue.createdAt,
        }));

        setCompletedIssues(issuesWithId);
      } catch (error) {
        console.error('Error fetching completed issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedIssues();
  }, []);

  const handleOpenModal = (issue) => {
    setSelectedIssue(issue);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
    setOpenModal(false);
  };

  const handleOpenReportModal = (issue) => {
    setSelectedIssue(issue);
    setOpenReportModal(true);
  };

  const handleCloseReportModal = () => {
    setSelectedIssue(null);
    setOpenReportModal(false);
  };

  const handleSubmitReport = async (reportDescription) => {
    if (!selectedIssue) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/issueReporting/task-status/${selectedIssue.id}`,
        { description: reportDescription },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Report submitted successfully.');
      handleCloseReportModal();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="completed-issues-container">
      <Sidebar />
      <div className="content">
        <header className="Header">
          <h1>Completed Issues</h1>
        </header>

        {completedIssues.length > 0 ? (
          <CompletedIssueTable
            rows={completedIssues}
            onViewDetails={handleOpenModal}
            onReport={handleOpenReportModal}
            isCompleted={true} 
            isCompletedScreen={true} 
          />
        ) : (
          <div className="no-issues-message">No completed issues at the moment.</div>
        )}

        <Modal open={openModal} onClose={handleCloseModal}>
          <div className="modal-content">
            {selectedIssue && <CompletedModal issue={selectedIssue} onClose={handleCloseModal} />}
          </div>
        </Modal>

        <Modal open={openReportModal} onClose={handleCloseReportModal}>
          <div className="modal-content">
            {selectedIssue && (
              <AdminReportModal
                issue={selectedIssue}
                onClose={handleCloseReportModal}
                onSubmit={handleSubmitReport}
    
              />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CompletedIssuesScreen;
