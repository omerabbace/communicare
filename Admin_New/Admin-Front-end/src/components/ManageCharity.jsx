// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import { BASE_URL } from '../config';
// import '../styles/ManageProfile.css'; // Assuming consistent design

// const CharityProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editMode, setEditMode] = useState(null);
//   const [editedTitle, setEditedTitle] = useState('');

//   // Fetch charity projects from the server
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Get the token from localStorage or state
//         const response = await axios.get(`${BASE_URL}/api/charityProjects`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setProjects(response.data.data);
//       } catch (err) {
//         setError('Failed to load charity projects. Please try again later.');
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Function to toggle the disable/enable status of a project
//   const toggleProjectStatus = async (projectId) => {
//     try {
//       const token = localStorage.getItem('token'); // Get the token from localStorage or state
//       const response = await axios.patch(
//         `${BASE_URL}/api/charityProjects/${projectId}/toggle-status`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       // Ensure that the response from the API confirms the state change
//       if (response.status === 200) {
//         setProjects((prevProjects) =>
//           prevProjects.map((project) =>
//             project._id === projectId ? { ...project, disabled: !project.disabled } : project
//           )
//         );
//         setSuccess('Project status updated successfully.');
//       } else {
//         throw new Error('Failed to update status in the database.');
//       }
//     } catch (err) {
//       setError('Failed to update project status. Please try again.');
//     }
//   };
  
//   // Function to enable edit mode for a specific project
//   const handleEditClick = (projectId, title) => {
//     setEditMode(projectId);
//     setEditedTitle(title);
//   };

//   // Function to update the project title
//   const updateProjectTitle = async (projectId) => {
//     try {
//       const token = localStorage.getItem('token'); // Get the token from localStorage or state
//       const response = await axios.patch(
//         `${BASE_URL}/api/charityProjects/${projectId}/update-title`,
//         { title: editedTitle },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       // Update the projects state after the successful API call
//       setProjects((prevProjects) =>
//         prevProjects.map((project) =>
//           project._id === projectId ? { ...project, title: editedTitle } : project
//         )
//       );

//       // Exit edit mode and show success message
//       setEditMode(null);
//       setSuccess('Project title updated successfully.');
//     } catch (err) {
//       setError('Failed to update project title. Please try again.');
//     }
//   };

//   return (
//     <div className="manage-profile-container">
//       <Sidebar />
//       <div className="main-content">
//         <header className="header">
//           <h1>Charity Projects</h1>
//         </header>
//         <div className="profile-form-container">
//           {error && <p className="error-message">{error}</p>}
//           {success && <p className="success-message">{success}</p>}

//           <div className="charity-project-list">
//             {projects.map((project) => (
//               <div key={project._id} className="project-card">
//                 {/* Edit Mode for the Project */}
//                 {editMode === project._id ? (
//                   <div className="edit-project">
//                     <input
//                       type="text"
//                       value={editedTitle}
//                       onChange={(e) => setEditedTitle(e.target.value)}
//                       className="edit-input"
//                     />
//                     <div className="button-group">
//                       <button
//                         onClick={() => updateProjectTitle(project._id)}
//                         className="custom-button save-button"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditMode(null)}
//                         className="custom-button cancel-button"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="project-info">
//                     <h3>{project.title}</h3>
//                     <p>{project.description}</p>
//                     <div className="button-group">
//                       <button
//                         onClick={() => handleEditClick(project._id, project.title)}
//                         className="custom-button edit-button"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => toggleProjectStatus(project._id)}
//                         className={`custom-button ${project.disabled ? 'enable-button' : 'disable-button'}`}
//                       >
//                         {project.disabled ? 'Enable' : 'Disable'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CharityProjects;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config";
import "../styles/CharityProjects.css";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa"; // Icons for buttons

const CharityProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/charityProjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.data);
      } catch (err) {
        setError("Failed to load charity projects. Please try again later.");
      }
    };

    fetchProjects();
  }, []);

  const toggleProjectStatus = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${BASE_URL}/api/charityProjects/${projectId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === projectId
              ? { ...project, disabled: !project.disabled }
              : project
          )
        );
        setSuccess("Project status updated successfully.");
      }
    } catch (err) {
      setError("Failed to update project status. Please try again.");
    }
  };

  const handleEditClick = (projectId, title) => {
    setEditMode(projectId);
    setEditedTitle(title);
  };

  const updateProjectTitle = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BASE_URL}/api/charityProjects/${projectId}/update-title`,
        { title: editedTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, title: editedTitle } : project
        )
      );
      setEditMode(null);
      setSuccess("Project title updated successfully.");
    } catch (err) {
      setError("Failed to update project title. Please try again.");
    }
  };

  return (
    <div className="charity-projects-container">
      <Sidebar />
      <div className="content">
        <header className="header">
          <h2>Charity Projects</h2>
        </header>
        <div className="projects-container">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="project-list">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                {editMode === project._id ? (
                  <div className="edit-project">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="edit-input"
                      placeholder="Edit project title"
                    />
                    <div className="button-group">
                      <button
                        onClick={() => updateProjectTitle(project._id)}
                        className="custom-button save-button"
                      >
                        <FaCheck style={{ marginRight: "5px" }} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(null)}
                        className="custom-button cancel-button"
                      >
                        <FaTimes style={{ marginRight: "5px" }} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="button-group">
                      <button
                        onClick={() => handleEditClick(project._id, project.title)}
                        className="custom-button edit-button"
                      >
                        <FaEdit style={{ marginRight: "5px" }} />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleProjectStatus(project._id)}
                        className={`custom-button ${
                          project.disabled ? "enable-button" : "disable-button"
                        }`}
                      >
                        {project.disabled ? "Enable" : "Disable"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityProjects;
