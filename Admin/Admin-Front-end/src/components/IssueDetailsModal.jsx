import React from 'react';
import '../styles/b.css';
import { BASE_URL } from '../config';

// IssueDetailsForm Component to display issue details in a scrollable form
const IssueDetailsForm = ({ issue, onClose }) => {
  if (!issue) return null; // Return null if no issue is passed

  return (
    <div className="issue-details-modal">
      <div className="modal-header">
        <h2>Issue Details</h2>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="modal-content scrollable">
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
            <label>Email:</label>
            <input type="email" value={issue.reportedBy.email} readOnly />
          </div>

          <div className="form-group">
            <label>Reported Date:</label>
            <input type="text" value={new Date(issue.createdAt).toLocaleString('en-GB')} readOnly />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea value={issue.description} readOnly></textarea>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input type="text" value={`${issue.location?.latitude}, ${issue.location?.longitude}`} readOnly />
          </div>

          {issue.media.length > 0 && (
            <div className="form-group">
              <label>Media Files:</label>
              {issue.media.map((mediaItem, index) => (
                <div key={index} className="media-item">
                  {console.log("Image URI:", mediaItem.uri)} {/* Log the URI to check */}
                  {mediaItem.type === 'image' ? (
                    <img
                      src={`${BASE_URL}/${mediaItem.uri}`}  // Dynamically load image from backend
                      alt={`Media ${index + 1}`}
                      style={{ width: '50%', height: 'auto' }}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/500?text=Image+not+available')}
                    />
                  ) : mediaItem.type === 'video' ? (
                    <video controls style={{ width: '100%', height: 'auto' }}>
                      <source src={`${BASE_URL}/${mediaItem.uri}`} type="video/mp4" />
                      <p>Your browser does not support this video format. Please try a different browser or convert the video to a supported format like MP4.</p>
                    </video>
                  ) : (
                    <p>Unsupported media type</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueDetailsForm;
