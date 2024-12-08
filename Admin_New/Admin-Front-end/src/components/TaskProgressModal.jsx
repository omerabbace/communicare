import React from 'react';
import '../styles/b.css';
import { BASE_URL } from '../config';

const TaskProgressModal = ({ issue, onClose }) => {
  if (!issue) return null;

  return (
    <div className="issue-details-modal">
      <div className="modal-header">
        <h2>Task Progress Details</h2>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="modal-content scrollable">
        <form>
          <div className="form-group">
            <label>Issue:</label>
            <input type="text" value={issue.description || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Reported By:</label>
            <input type="text" value={issue.reportedBy || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <input type="text" value={issue.status || 'N/A'} readOnly />
          </div>

          <div className="form-group">
            <label>Progress Updates:</label>
            <div className="progress-updates">
              {issue.progressUpdates?.length > 0 ? (
                issue.progressUpdates.map((update, index) => (
                  <div key={index} className="update-item">
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea value={update.description || 'N/A'} readOnly></textarea>
                    </div>

                    <div className="form-group">
                      <label>Updated By:</label>
                      <input type="text" value={update.updatedBy.name || 'N/A'} readOnly />
                    </div>

                    <div className="form-group">
                      <label>Date:</label>
                      <input type="text" value={update.date ? new Date(update.date).toLocaleString('en-GB') : 'N/A'} readOnly />
                    </div>

                    {update.media?.length > 0 && (
                      <div className="form-group">
                        <label>Media Files:</label>
                        {update.media.map((mediaItem, idx) => (
                          <div key={idx} className="media-item">
                            {mediaItem.type === 'image' ? (
                              <img
                                src={`${BASE_URL}/${mediaItem.uri}`}
                                alt={`Media ${idx + 1}`}
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
                  </div>
                ))
              ) : (
                <p>No progress updates available</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskProgressModal;
