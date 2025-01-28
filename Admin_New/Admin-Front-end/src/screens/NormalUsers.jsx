// import React, { useState, useEffect } from 'react';
// import UserTable from '../components/UserTable';
// import Sidebar from '../components/Sidebar';
// import { BASE_URL } from '../config';
// import axios from 'axios';
// import '../styles/NormalUsers.css';
// import { useNavigate } from 'react-router-dom';
// import { Modal } from '@mui/material';
// import EditUserForm from '../components/EditUserForm';
// import ToggleSwitch from '../components/ToggleSwitch';

// const NormalUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
//   const [showActiveUsers, setShowActiveUsers] = useState(true); // Toggle for active/inactive users
//   const [selectedUser, setSelectedUser] = useState(null); // State to track user for editing
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     const fetchNormalUsers = async () => {
//       try {
//         // Get token from localStorage
//         const token = localStorage.getItem('token');

//         // Make API request to fetch normal users
//         const response = await axios.get(`${BASE_URL}/api/user/getAllNormalUsers`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // Set users data if request is successful
//         setUsers(response.data.data);
//       } catch (error) {
//         console.error('Error fetching normal users:', error);
//       }
//     };

//     fetchNormalUsers();
//   }, []);

//   const handleEdit = (id) => {
//     const userToEdit = users.find(user => user._id === id);
//     setSelectedUser(userToEdit); 
//     setIsModalOpen(true); 
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false); 
//     setSelectedUser(null); 
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.patch(
//         `${BASE_URL}/api/users/disable/${id}`, 
//         {}, 
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, 
//           },
//         }
//       );

//       if (response.data.success) {
//         // Update the state to reflect the change
//         setUsers(prevUsers => prevUsers.map(user => 
//           user._id === id ? { ...user, isActive: false } : user
//         ));
//       } else {
//         console.error('Failed to disable the user');
//       }
//     } catch (err) {
//       console.error('Error disabling user:', err);
//     }
//   };

//   const handleAddUser = () => {
//     navigate('/UserForm');
//   };
  
//   const handleToggle = () => {
//     setShowActiveUsers(!showActiveUsers);
//   };

//   // Filter users based on the toggle state
//   const filteredUsers = users.filter(user => showActiveUsers ? user.isActive : !user.isActive);

//   return (
//     <div className="normal-users-container">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="content">
//         <div className="header-container">
//           <h2>Users</h2>
//           <button className="add-user-btn" onClick={handleAddUser}>
//             + New User
//           </button>
//         </div>

//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search user..."
//           />

//           {/* Toggle for active/inactive users */}
//           <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
//         </div>

//         {/* User Table with filtered users */}
//         <UserTable rows={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />

//         {/* Modal for Editing User */}
//         <Modal open={isModalOpen} onClose={handleCloseModal}>
//           <div>
//             {selectedUser && (
//               <EditUserForm user={selectedUser} onClose={handleCloseModal} />
//             )}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default NormalUsers;

// import React, { useState, useEffect } from 'react';
// import UserTable from '../components/UserTable';
// import Sidebar from '../components/Sidebar';
// import { BASE_URL } from '../config';
// import axios from 'axios';
// import '../styles/NormalUsers.css';
// import { Modal } from '@mui/material';
// import EditUserForm from '../components/EditUserForm';
// import ToggleSwitch from '../components/ToggleSwitch';
// import { useNavigate } from 'react-router-dom';
// import { FaPlus } from 'react-icons/fa';

// const NormalUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
//   const [showActiveUsers, setShowActiveUsers] = useState(true); // Toggle for active/inactive users
//   const [selectedUser, setSelectedUser] = useState(null); // State to track user for editing
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNormalUsers = async () => {
//       try {
//         // Get token from localStorage
//         const token = localStorage.getItem('token');

//         // Make API request to fetch normal users
//         const response = await axios.get(`${BASE_URL}/api/user/getAllNormalUsers`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // Set users data if request is successful
//         setUsers(response.data.data);
//       } catch (error) {
//         console.error('Error fetching normal users:', error);
//       }
//     };

//     fetchNormalUsers();
//   }, []);

//   const handleEdit = (id) => {
//     const userToEdit = users.find((user) => user._id === id);
//     setSelectedUser(userToEdit);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.patch(`${BASE_URL}/api/users/disable/${id}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         // Update the state to reflect the change
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user._id === id ? { ...user, isActive: false } : user
//           )
//         );
//       } else {
//         console.error('Failed to disable the user');
//       }
//     } catch (err) {
//       console.error('Error disabling user:', err);
//     }
//   };

//   const handleAddUser = () => {
//     navigate('/UserForm');
//   };

//   const handleToggle = () => {
//     setShowActiveUsers(!showActiveUsers);
//   };

//   // Filter users based on the toggle state
//   const filteredUsers = users.filter((user) =>
//     showActiveUsers ? user.isActive : !user.isActive
//   );

//   return (
//     <div className="normal-users-container">
//       {/* Sidebar */}
//       <Sidebar />
  
//       {/* Main Content */}
//       <div className="content">
//         {/* Sticky Header */}
//         <div className="header">
//           <h2>Users</h2>
//           <button className="header-button" onClick={handleAddUser}>
//           <FaPlus style={{ marginRight: '3px' }} /> New User
//           </button>
//         </div>
  
//         {/* Search and Toggle */}
//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search user..."
//           />
  
//           {/* Toggle for active/inactive users */}
//           <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
//         </div>
  
//         {/* User Table with filtered users */}
//         <UserTable rows={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
  
//         {/* Modal for Editing User */}
//         {/* <Modal open={isModalOpen} onClose={handleCloseModal}>
//           <div>
//             {selectedUser && (
//               <EditUserForm user={selectedUser} onClose={handleCloseModal} />
//             )}
//           </div>
//         </Modal> */}
//          {/* Modal for Editing User */}
//          <Modal open={isModalOpen} onClose={handleCloseModal}>
//           <div className="modal-content">
//             <EditUserForm user={selectedUser} onClose={handleCloseModal} />
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
  
// };

// export default NormalUsers;

import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import Sidebar from '../components/Sidebar';
import { BASE_URL } from '../config';
import axios from 'axios';
import '../styles/NormalUsers.css';
import { Modal } from '@mui/material';
import EditUserForm from '../components/EditUserForm';
import ToggleSwitch from '../components/ToggleSwitch';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const NormalUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal
  const [showActiveUsers, setShowActiveUsers] = useState(true); // Toggle for active/inactive users
  const [selectedUser, setSelectedUser] = useState(null); // State to track user for editing
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNormalUsers = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Make API request to fetch normal users
        const response = await axios.get(`${BASE_URL}/api/user/getAllNormalUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set users data if request is successful
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching normal users:', error);
      }
    };

    fetchNormalUsers();
  }, []);

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user._id === id);
    setSelectedUser(userToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${BASE_URL}/api/users/disable/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Update the state to reflect the change
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, isActive: false } : user
          )
        );
      } else {
        console.error('Failed to disable the user');
      }
    } catch (err) {
      console.error('Error disabling user:', err);
    }
  };

  const handleAddUser = () => {
    navigate('/UserForm');
  };

  const handleToggle = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  // Filter users based on the toggle state and search input
  const filteredUsers = users
    .filter((user) => (showActiveUsers ? user.isActive : !user.isActive))
    .filter((user) => {
      const userData = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
      return userData.includes(searchInput);
    });

  return (
    <div className="normal-users-container">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Main Content */}
      <div className="content">
        {/* Sticky Header */}
        <div className="header">
          <h2>Users</h2>
          <button className="header-button" onClick={handleAddUser}>
          <FaPlus style={{ marginRight: '3px' }} /> New User
          </button>
        </div>
  
        {/* Search and Toggle */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search user..."
            value={searchInput}
            onChange={handleSearchInput}
          />
  
          {/* Toggle for active/inactive users */}
          <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
        </div>
  
        {/* User Table with filtered users */}
        <UserTable rows={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
  
        {/* Modal for Editing User */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div className="modal-content">
            {selectedUser && (
              <EditUserForm user={selectedUser} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NormalUsers;