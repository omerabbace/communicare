import React, { useState } from 'react';
import '../styles/b.css';
import { BASE_URL } from '../config';

const AdminReportModal = ({ open, onClose, issue, onSubmit }) => {
  const [reportDescription, setReportDescription] = useState('');
  console.log(issue.media);
  if (!issue) return null;

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(reportDescription);
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className={`modal-container ${open ? 'open' : ''}`}>
      <div className="issue-details-modal">
        <div className="modal-header">
          <h2>Send Report to User</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="modal-content scrollable">
          <form onSubmit={handleReportSubmit}>
            <div className="form-group">
              <label>Issue Description:</label>
              <textarea value={issue.description || 'N/A'} readOnly></textarea>
            </div>

            {issue.media?.length > 0 && (
              <div className="form-group">
                <label>Completion Report Media Files:</label>
                {issue.media.map((mediaItem, index) => (
                  <div key={index} className="media-item">
                    {mediaItem.type === 'image' ? (
                      <img
                        src={`${BASE_URL}/${mediaItem.uri}`}
                        alt={`Media ${index + 1}`}
                        style={{ width: '50%', height: 'auto' }}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/500?text=Image+not+available')}
                      />
                    ) : mediaItem.type === 'video' ? (
                      <video controls style={{ width: '50%', height: 'auto' }}>
                        <source src={`${BASE_URL}/${mediaItem.uri}`} type="video/mp4" />
                        <p>Your browser does not support this video format.</p>
                      </video>
                    ) : (
                      <p>Unsupported media type</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="form-group">
              <label>Admin Report Description:</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Enter your report here"
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button id='assignTask' type="submit">Submit </button>
              <button id='cancel' type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminReportModal;
