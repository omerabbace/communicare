import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const UserTable = ({ rows, onEdit, onDelete }) => {
  // Determine the user role based on the first row (assuming all rows have the same role type)
  const userType = rows[0]?.role || 'normal'; // Default to 'normal' if role is undefined

  // Define column configurations based on user type
  let columnWidths = {};
  
  if (userType === 'normal') {
    // Normal User column widths
    columnWidths = {
      name: 230,
      email: 230,
      phone: 230,
      role: 240,
      isAccepted: 0, // Not needed for normal users
      isActive: 120,
      actions: 150
    };
  } else if (userType === 'volunteer') {
    // Volunteer column widths
    columnWidths = {
        name: 180,
        email: 170,
        phone: 170,
        role: 180,
        isAccepted: 170,
        isActive: 170,
        actions: 160
    };
  } else if (userType === 'serviceProvider') {
    // Service Provider column widths
    columnWidths = {
      name: 180,
      email: 170,
      phone: 170,
      role: 180,
      isAccepted: 170,
      isActive: 170,
      actions: 160
    };
  }

  // Define columns based on the role
  const columns = [
    { field: 'name', headerName: 'Name', width: columnWidths.name },
    { field: 'email', headerName: 'Email', width: columnWidths.email },
    { field: 'phone', headerName: 'Contact', width: columnWidths.phone },
    { field: 'role', headerName: 'Role', width: columnWidths.role, headerAlign: 'center', align: 'center' },
    // Conditionally add `isAccepted` column only if user is not a normal user
    ...(userType !== 'normal' ? [{
      field: 'isAccepted',
      headerName: 'Verified',
      width: columnWidths.isAccepted,
       headerAlign: 'center', align: 'center',
      renderCell: (params) =>
        params.value ? <Chip label="Verified" color="success" /> : <Chip label="Pending" color="default" />
    }] : []),
    { field: 'isActive', headerName: 'Status', width: columnWidths.isActive, headerAlign: 'center', align: 'center', renderCell: (params) => (
      params.value ? <Chip label="Active" color="success" /> : <Chip label="Banned" color="error" />
    )},
    {
      field: 'actions',
      headerName: 'Actions',
      width: columnWidths.actions,
      headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <ActionMenu id={params.row._id}  isActive={params.row.isActive} onEdit={onEdit} onDelete={onDelete} />
      )
    }
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
        disableExtendRowFullWidth={true}
        
      />
    </Box>
  );
};

const ActionMenu = ({ id,isActive, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    // <>
    //   <IconButton onClick={handleClick}>
    //     <MoreVertIcon />
    //   </IconButton>
    //   <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
    //     <MenuItem onClick={() => { onEdit(id); handleClose(); }}>Edit</MenuItem>
    //     <MenuItem onClick={() => { onDelete(id); handleClose(); }}>Delete</MenuItem>
    //   </Menu>
    // </>
    <>
    {isActive ? (
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
    ) : null}
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      {isActive ? (
        <>
          <MenuItem onClick={() => { onEdit(id); handleClose(); }}>Edit</MenuItem>
          <MenuItem onClick={() => { onDelete(id); handleClose(); }}>Delete</MenuItem>
        </>
      ) : null}
    </Menu>
  </>
  );
};

export default UserTable;
