import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import '../styles/IssueDetailsModal.css'; // Custom CSS for IssueDetailsModal

// IssueDetailsModal Component to display issue details in a modal
const IssueDetailsModal = ({ open, onClose, issue }) => {
  if (!issue) return null; // Return null if no issue is passed

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Issue Details
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Issue: {issue.issueType}
        </Typography>
        <Typography gutterBottom>
          <strong>Reported By:</strong> {issue.reportedBy}
        </Typography>
        <Typography gutterBottom>
          <strong>Reported Date:</strong> {issue.reportedAt}
        </Typography>
        <Typography gutterBottom>
          <strong>Description:</strong> {issue.description}
        </Typography>
        {issue.media && (
          <Box>
            <Typography gutterBottom><strong>Media:</strong></Typography>
            {issue.media.map((mediaItem, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <img src={mediaItem} alt={`Media ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
              </Box>
            ))}
          </Box>
        )}
        <Typography gutterBottom>
          <strong>Location:</strong> {issue.location?.latitude}, {issue.location?.longitude}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailsModal;
