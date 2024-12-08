import React from 'react';
import '../styles/b.css';
import { BASE_URL } from '../config';

const CompletedModal = ({ issue, onClose }) => {
  if (!issue) return null;

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
            <input type="text" value={issue.issueType || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Reported By:</label>
            <input type="text" value={issue.reportedBy || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={issue.reportedByEmail || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Reported Date:</label>
            <input type="text" value={issue.createdAt ? new Date(issue.createdAt).toLocaleString('en-GB') : 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea value={issue.description || 'N/A'} readOnly></textarea>
          </div>

          <div className="form-group">
            <label>Team Leader:</label>
            <input type="text" value={issue.leader || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Completion Report:</label>
            <textarea value={issue.completionReport || 'No Report'} readOnly></textarea>
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input type="text" value={`${issue.location?.latitude || 'N/A'}, ${issue.location?.longitude || 'N/A'}`} readOnly />
          </div>

          {issue.media?.length > 0 && (
            <div className="form-group">
              <label>Media Files:</label>
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

          <div className="form-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompletedModal;
