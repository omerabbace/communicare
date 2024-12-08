// import React, { useState, useEffect } from 'react';
// import UserTable from '../components/UserTable';
// import Sidebar from '../components/Sidebar';
// import { BASE_URL } from '../config';
// import axios from 'axios';
// import '../styles/Volunteers.css';
// import { useNavigate } from 'react-router-dom';
// import { Modal } from '@mui/material';
// import EditVolunteerForm from '../components/EditVolunteerForm';
// import ToggleSwitch from '../components/ToggleSwitch'; 

// const Volunteers = () => {
//   const [volunteers, setVolunteers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedVolunteer, setSelectedVolunteer] = useState(null);
//   const [showActiveUsers, setShowActiveUsers] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchVolunteers = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/user/getAllVolunteers`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setVolunteers(response.data.data);
//       } catch (error) {
//         console.error('Error fetching volunteers:', error);
//       }
//     };
//     fetchVolunteers();
//   }, []);

//   const handleEdit = (id) => {
//     const volunteerToEdit = volunteers.find(volunteer => volunteer._id === id);
//     setSelectedVolunteer(volunteerToEdit);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedVolunteer(null);
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
//         setVolunteers(prevUsers => prevUsers.map(user => 
//           user._id === id ? { ...user, isActive: false } : user
//         ));
//       } else {
//         console.error('Failed to disable the user');
//       }
//     } catch (err) {
//       console.error('Error disabling user:', err);
//     }
//   };

//   const handleAddVolunteer = () => {
//     navigate('/volunteerForm');
//   };

//   const filteredVolunteers = volunteers.filter(volunteer => showActiveUsers ? volunteer.isActive : !volunteer.isActive);

//   const handleToggle = () => {
//     setShowActiveUsers(!showActiveUsers);
//   };

//   return (
//     <div className="volunteers-container">
//       <Sidebar />

//       <div className="content">
//         <div className="header-container">
//           <h2>Volunteers</h2>
//           <button className="add-volunteer-btn" onClick={handleAddVolunteer}>
//             + New Volunteer
//           </button>
//         </div>

//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search volunteer..."
//           />
          
//           <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
//         </div>

//         <UserTable rows={filteredVolunteers} onEdit={handleEdit} onDelete={handleDelete} />

//         <Modal open={isModalOpen} onClose={handleCloseModal}>
//           <div>
//             {selectedVolunteer && (
//               <EditVolunteerForm user={selectedVolunteer} onClose={handleCloseModal} />
//             )}
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Volunteers;

import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import Sidebar from '../components/Sidebar';
import { BASE_URL } from '../config';
import axios from 'axios';
import '../styles/Volunteers.css';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';
import EditVolunteerForm from '../components/EditVolunteerForm';
import ToggleSwitch from '../components/ToggleSwitch';
import { FaPlus } from 'react-icons/fa';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [showActiveUsers, setShowActiveUsers] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/user/getAllVolunteers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVolunteers(response.data.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };
    fetchVolunteers();
  }, []);

  const handleEdit = (id) => {
    const volunteerToEdit = volunteers.find(volunteer => volunteer._id === id);
    setSelectedVolunteer(volunteerToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVolunteer(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/api/users/disable/${id}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      if (response.data.success) {
        setVolunteers(prevUsers => prevUsers.map(user => 
          user._id === id ? { ...user, isActive: false } : user
        ));
      } else {
        console.error('Failed to disable the user');
      }
    } catch (err) {
      console.error('Error disabling user:', err);
    }
  };

  const handleAddVolunteer = () => {
    navigate('/volunteerForm');
  };

  const filteredVolunteers = volunteers.filter(volunteer => showActiveUsers ? volunteer.isActive : !volunteer.isActive);

  const handleToggle = () => {
    setShowActiveUsers(!showActiveUsers);
  };

  return (
    <div className="volunteers-container">
      <Sidebar />

      <div className="content">
        {/* Header Section */}
        <div className="header-container">
          <h2>Volunteers</h2>
          <button className="add-volunteer-btn" onClick={handleAddVolunteer}>
            <FaPlus style={{ marginRight: '5px' }} /> New Volunteer
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search volunteer..."
      />
  <div className="toggle-container">
    <ToggleSwitch isActive={showActiveUsers} handleToggle={handleToggle} />
    <label className="toggle-label">{showActiveUsers ? 'Active' : 'Inactive'}</label>
  </div>
</div>



        {/* Table Section */}
        <UserTable rows={filteredVolunteers} onEdit={handleEdit} onDelete={handleDelete} />

        {/* Modal Section */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <div>
            {selectedVolunteer && (
              <EditVolunteerForm user={selectedVolunteer} onClose={handleCloseModal} />
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Volunteers;
