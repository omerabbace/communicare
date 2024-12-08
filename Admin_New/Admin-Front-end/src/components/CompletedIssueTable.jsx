import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const CompletedIssueTable = ({ rows, onViewDetails, onReport, isCompletedScreen }) => {
  // Define columns conditionally based on the issue status
  const columns = [
    { field: 'description', headerName: 'Issue', width: 220, headerAlign: 'center' , align: 'center' },
    { field: 'leader', headerName: 'Team Lead', width: 200, headerAlign: 'center', align: 'center' },
    isCompletedScreen
      ? { field: 'completionReport', headerName: 'Completion Description', width: 200, align: 'center', headerAlign: 'center' }
      : { field: 'updatedBy', headerName: 'Updated By', width: 200, align: 'center', headerAlign: 'center' },
    { field: 'status', headerName: 'Status', width: 150, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <ActionMenu
          onViewDetails={() => onViewDetails(params.row)}
          onReport={isCompletedScreen ? () => onReport(params.row) : null} // Report action only if it's the completed screen
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%', backgroundColor: '#ffffff' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
      />
    </Box>
  );
};

const ActionMenu = ({ onViewDetails, onReport }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { onViewDetails(); handleClose(); }}>View Details</MenuItem>
        {onReport && (
          <MenuItem onClick={() => { onReport(); handleClose(); }}>Report to Normal User</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default CompletedIssueTable;
