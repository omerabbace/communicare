import React, { useState } from 'react';
import '../styles/b.css';
const ApproveModal = ({ issue, onClose, onAssignTask }) => {
    const [volunteers, setVolunteers] = useState(1); // Default value for volunteers
  
    const handleSubmit = () => {
      if (volunteers > 0) {
        onAssignTask(issue._id, volunteers); // Call onAssignTask when assigning task
      } else {
        alert("The number of volunteers must be greater than zero.");
      }
    };
  
    return (
      <div className="issue-details-modal">
        <div className="modal-header">
          <h2>Assign Task</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="modal-content">
          <form>
            <div className="form-group">
              <label>Issue Type:</label>
              <input type="text" value={issue.issueType} readOnly />
            </div>
  
            <div className="form-group">
              <label>Reported By:</label>
              <input type="text" value={issue.reportedBy.name} readOnly />
            </div>
  
            <div className="form-group">
              <label>Description:</label>
              <textarea value={issue.description} readOnly></textarea>
            </div>
  
            <div className="form-group">
              <label>Number of Volunteers Required:</label>
              <input
                type="number"
                min="1"
                value={volunteers}
                onChange={(e) => setVolunteers(e.target.value)}
              />
            </div>
  
            <div className="form-actions">
              <button id='assignTask' type="button" onClick={handleSubmit}>Assign Task</button>
              <button id='cancel' type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  

export default ApproveModal;
