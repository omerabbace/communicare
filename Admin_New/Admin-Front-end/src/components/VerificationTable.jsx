import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const VerificationTable = ({ rows, onApprove, onReject }) => {
  // Define column widths
  const columnWidths = {
    name: 200,
    email: 200,
    phone: 150,
    verification: 170,
    actions: 150,
  };

  // Define columns
  const columns = [
    { field: 'name', headerName: 'Name', width: columnWidths.name },
    { field: 'email', headerName: 'Email', width: columnWidths.email },
    { field: 'phone', headerName: 'Contact', width: columnWidths.phone },
    {
      field: 'isAccepted',
      headerName: 'Verification',
      width: columnWidths.verification,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (params.value === true) {
          return <Chip label="Approved" color="success" />;
        } else if (params.value === false) {
          return <Chip label="Rejected" color="error" />;
        } else {
          return <Chip label="Pending" color="default" />;
        }
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: columnWidths.actions,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <ActionMenu
          id={params.row._id}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },
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

const ActionMenu = ({ id, onApprove, onReject }) => {
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
        <MenuItem
          onClick={() => {
            onApprove(id);
            handleClose();
          }}
        >
          Approve
        </MenuItem>
        <MenuItem
          onClick={() => {
            onReject(id);
            handleClose();
          }}
        >
          Reject
        </MenuItem>
      </Menu>
    </>
  );
};

export default VerificationTable;
