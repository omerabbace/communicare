import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const IssueTable = ({ rows, onView, onReject, showReject, showApprove , onApprove = true }) => { // Default showReject to true
  const columns = [
    { field: 'issueType', headerName: 'Issue Type', headerAlign: 'center', align: 'center', width: 200 },
    { field: 'description', headerName: 'Description', width: 300, renderCell: (params) => <span>{params.value}</span> },
    { field: 'name', headerName: 'Reported By', headerAlign: 'center', align: 'center', width: 200 },
    { field: 'date', headerName: 'Reported Date', headerAlign: 'center', align: 'center', width: 180 },
    { field: 'actions', headerName: 'Actions', headerAlign: 'center', align: 'center', width: 150, renderCell: (params) => (
      <ActionMenu id={params.row._id} onView={onView} onReject={onReject} onApprove={onApprove} showApprove={showApprove}  showReject={showReject} /> // Pass showReject
    ) },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .MuiDataGrid-root': {
          backgroundColor: '#ffffff',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f5f5f5',
        },
        '& .MuiDataGrid-cell': {
          backgroundColor: '#ffffff',
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid #e0e0e0',
          paddingRight: '16px',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        disableColumnResize
      />
    </Box>
  );
};

// ActionMenu Component to handle actions for each issue
const ActionMenu = ({ id, onView, onReject, onApprove, showReject, showApprove }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReject = async () => {
    await onReject(id);
    handleClose();
  };

  const handleApprove = () => {
    onApprove(id); // Trigger the approval process
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { onView(id); handleClose(); }}>See Full Details</MenuItem>
        {showReject && <MenuItem onClick={handleReject}>Reject</MenuItem>}
        {showApprove && < MenuItem onClick={handleApprove}>Approve</MenuItem> }
      </Menu>
    </>
  );
};


export default IssueTable;
