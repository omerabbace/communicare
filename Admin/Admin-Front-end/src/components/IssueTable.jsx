import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import '../styles/IssueTable.css'; // Custom CSS for the IssueTable

// IssueTable Component to display the list of reported issues
const IssueTable = ({ rows, onView }) => {
  const columns = [
    { field: 'issueType', headerName: 'Issue Type', headerAlign: 'center' , align: 'center',width: 200 },
    { field: 'description', headerName: 'Description', width: 300, renderCell: (params) => (
      <span>{params.value}</span>
    ) },
    { field: 'name', headerName: 'Reported By',headerAlign: 'center', align: 'center', width: 200 },
    { field: 'date', headerName: 'Reported Date',headerAlign: 'center', align: 'center', width: 180 },
    { field: 'actions', headerName: 'Actions', headerAlign: 'center', align: 'center',  width: 150, renderCell: (params) => (
      <ActionMenu id={params.row._id} onView={onView} />
    ) },
  ];

  return (
    <Box
    sx={{
        height: 500,
        width: '100%',
        overflowX: 'hidden',
        '& .MuiDataGrid-root': {
          backgroundColor: '#ffffff', // Table background color
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f5f5f5', // Header background color
        },
        '& .MuiDataGrid-cell': {
          backgroundColor: '#ffffff', // Cell background color
          
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid #e0e0e0',
          paddingRight: '16px',
          justifyContent: 'flex-end',
        },
        '& .MuiDataGrid-virtualScroller':{
            position: 'absolute',
            

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

export default IssueTable;
