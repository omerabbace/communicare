import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// AssignedTaskTable Component to display the list of assigned tasks
const AssignedTaskTable = ({ rows, onView }) => {
  const columns = [
    { field: 'issueType', headerName: 'Issue Type', headerAlign: 'center', align: 'center', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'requiredVolunteers', headerName: 'Required Volunteers', headerAlign: 'center', align: 'center', width: 200 },
    { field: 'assignedVolunteers', headerName: 'Accepted Volunteers', headerAlign: 'center', align: 'center', width: 200,  },
    { field: 'status', headerName: 'Status', headerAlign: 'center', align: 'center', width: 150 },
    { field: 'actions', headerName: 'Actions', headerAlign: 'center', align: 'center', width: 150, renderCell: (params) => (
      <ActionMenu id={params.row._id} onView={onView} />
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

// ActionMenu Component for "See Full Details"
const ActionMenu = ({ id, onView }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
        <MenuItem onClick={() => { onView(id); handleClose(); }}>See Full Details</MenuItem>
      </Menu>
    </>
  );
};

export default AssignedTaskTable;
