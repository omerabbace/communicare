// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faTachometerAlt,
//   faUser,
//   faCog,
//   faListAlt,
//   faPoll,
//   faTasks,
//   faHandsHelping,
//   faSignOutAlt,
//   faTools,
// } from '@fortawesome/free-solid-svg-icons';
// import '../styles/Sidebar.css';

// const Sidebar = () => {
//   const [isProfileOpen, setProfileOpen] = useState(false);
//   const [isUserOpen , setUserOpen] = useState(false);
//   const [isApprovals , setApprovals] = useState(false);
//   const [isIssues , setIssues] = useState(false);
//   const toggleProfileMenu = () => {
//     setProfileOpen(!isProfileOpen);
//   };
//   const toggleIsUser =()=>{
//     setUserOpen(!isUserOpen);
//   }
//   const toggleApprovls =()=>{
//     setApprovals(!isApprovals);
//   }
//   const toggleIssues =()=>{
//     setIssues(!isIssues);
//   }

//   return (
//     <div className="sidebar">
//       {/* <h2>Communi Care</h2> */}
//       <ul className="sidebar-links">
//         <li>
//           <Link to="/dashboard">
//             <FontAwesomeIcon icon={faTachometerAlt} className="icon" /> Dashboard
//           </Link>
//         </li>
//         <li onClick={toggleProfileMenu}>
//           <Link>
//             <FontAwesomeIcon icon={faUser} className="icon" /> Profile Management
//           </Link>
//           {isProfileOpen && (
//             <ul className="submenu">
//               <li>
//                 <Link to="/profileManage">
//                   <FontAwesomeIcon icon={faUser} className="submenu-icon" /> My Profile
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/changePassword">
//                   <FontAwesomeIcon icon={faCog} className="submenu-icon" /> Change Password
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </li>
//         <li onClick={toggleIsUser}>
//           <Link>
//           <FontAwesomeIcon icon={faUser} className="icon" /> Users
//           </Link>
//           {isUserOpen &&(
//             <ul className='submenu'>
//               <li>
//                 <Link to='/normaluser'>
//                   <FontAwesomeIcon icon={faUser} className="submenu-icon" />Normal Users
//                 </Link>
//                 <Link to='/volunteers'>
//                   <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" />Volunteers
//                 </Link>
//                 <Link to='/serviceProviders'>
//                   <FontAwesomeIcon icon={faTools} className="submenu-icon" />Service Providers
//                 </Link>

//               </li>
//             </ul>
//           )}

//         </li>

//         <li onClick={toggleApprovls}>
//           <Link>
//           <FontAwesomeIcon icon={faUser} className="icon" /> User Approvals
//           </Link>
//           {isApprovals &&(
//             <ul className='submenu'>
//               <li>
//                 <Link to='/volunteerApprovals'>
//                   <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" />Volunteers
//                 </Link>
//                 <Link to='/serviceApprovals'>
//                   <FontAwesomeIcon icon={faTools} className="submenu-icon" />Service Providers
//                 </Link>

//               </li>
//             </ul>
//           )}

//         </li>

//         <li>
//           <Link to="/issues">
//             <FontAwesomeIcon icon={faListAlt} className="icon" /> Issue Categories
//           </Link>
//         </li>
//         <li>
//           <Link to="/completedIssues">
//             <FontAwesomeIcon icon={faListAlt} className="icon" /> Completed Issues
//           </Link>
//         </li><li>
//           <Link to="/inprogressIssues">
//             <FontAwesomeIcon icon={faListAlt} className="icon" /> Progress Reports
//           </Link>
//         </li>
//         <li onClick={toggleIssues }>
//           <Link>
//           <FontAwesomeIcon icon={faUser} className="icon" /> Reported Issues
//           </Link>
//           {isIssues &&(
//             <ul className='submenu'>
//               <li>
//                 <Link to="/reportedissues">
//                   <FontAwesomeIcon icon={faListAlt} className="icon" /> Pending Issues
//                 </Link>
                
//                 <Link to="/rejectedissues">
//                   <FontAwesomeIcon icon={faListAlt} className="icon" /> Rejected Issues
//                 </Link>
//                 <Link to="/assignedtasks">
//                  <FontAwesomeIcon icon={faListAlt} className="icon" /> Assigned Tasks
//                  </Link>
//               </li>
//             </ul>
//           )}
//           </li>
//         <li>
//           <Link to="/poll">
//             <FontAwesomeIcon icon={faPoll} className="icon" /> Poll
//           </Link>
//         </li>
//         <li>
//           <Link to="/pollManagement">
//             <FontAwesomeIcon icon={faTasks} className="icon" /> Manage Polls
//           </Link>
//         </li>
//         <li>
//           <Link to="/charityProject">
//             <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Charity Projects
//           </Link>
//         </li>
//         <li>
//           <Link to="/manageCharity">
//             <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Manage Charity Projects
//           </Link>
//         </li>
//         <li>
//           <Link to="/logout">
//             <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faTachometerAlt,
//   faUser,
//   faCog,
//   faListAlt,
//   faPoll,
//   faTasks,
//   faHandsHelping,
//   faSignOutAlt,
//   faTools,
//   faBars,
//   faTimes,
// } from '@fortawesome/free-solid-svg-icons';
// import '../styles/Sidebar.css';

// const Sidebar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isUserOpen, setIsUserOpen] = useState(false);
//   const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
//   const [isIssuesOpen, setIsIssuesOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleProfileMenu = () => {
//     setIsProfileOpen(!isProfileOpen);
//   };

//   const toggleUserMenu = () => {
//     setIsUserOpen(!isUserOpen);
//   };

//   const toggleApprovalsMenu = () => {
//     setIsApprovalsOpen(!isApprovalsOpen);
//   };

//   const toggleIssuesMenu = () => {
//     setIsIssuesOpen(!isIssuesOpen);
//   };

//   return (
//     <>
//       {/* Hamburger Menu Button for Small Screens */}
//       <button className="hamburger-btn" onClick={toggleSidebar}>
//         <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
//       </button>

//       {/* Sidebar */}
//       <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
//         <ul className="sidebar-links">
//           {/* Dashboard */}
//           <li>
//             <Link to="/dashboard">
//               <FontAwesomeIcon icon={faTachometerAlt} className="icon" /> Dashboard
//             </Link>
//           </li>

//           {/* Profile Management
//           <li onClick={toggleProfileMenu}>
//             <Link>
//               <FontAwesomeIcon icon={faUser} className="icon" /> Profile Management
//             </Link>
//             {isProfileOpen && (
//               <ul className="submenu">
//                 <li>
//                   <Link to="/profileManage">
//                     <FontAwesomeIcon icon={faUser} className="submenu-icon" /> My Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/changePassword">
//                     <FontAwesomeIcon icon={faCog} className="submenu-icon" /> Change Password
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li> */}

//           {/* Users */}
//           <li onClick={toggleUserMenu}>
//             <Link>
//               <FontAwesomeIcon icon={faUser} className="icon" /> Users
//             </Link>
//             {isUserOpen && (
//               <ul className="submenu">
//                 <li>
//                   <Link to="/normaluser">
//                     <FontAwesomeIcon icon={faUser} className="submenu-icon" /> Normal Users
//                   </Link>
//                   <Link to="/volunteers">
//                     <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" /> Volunteers
//                   </Link>
//                   <Link to="/serviceProviders">
//                     <FontAwesomeIcon icon={faTools} className="submenu-icon" /> Service Providers
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* User Approvals */}
//           <li onClick={toggleApprovalsMenu}>
//             <Link>
//               <FontAwesomeIcon icon={faUser} className="icon" /> User Approvals
//             </Link>
//             {isApprovalsOpen && (
//               <ul className="submenu">
//                 <li>
//                   <Link to="/volunteerApprovals">
//                     <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" /> Volunteers
//                   </Link>
//                   <Link to="/serviceApprovals">
//                     <FontAwesomeIcon icon={faTools} className="submenu-icon" /> Service Providers
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Issue Categories */}
//           <li>
//             <Link to="/issues">
//               <FontAwesomeIcon icon={faListAlt} className="icon" /> Issue Categories
//             </Link>
//           </li>

//           {/* Completed Issues */}
//           <li>
//             <Link to="/completedIssues">
//               <FontAwesomeIcon icon={faListAlt} className="icon" /> Completed Issues
//             </Link>
//           </li>

//           {/* In Progress Issues */}
//           <li>
//             <Link to="/inprogressIssues">
//               <FontAwesomeIcon icon={faListAlt} className="icon" /> Progress Reports
//             </Link>
//           </li>

//           {/* Reported Issues */}
//           <li onClick={toggleIssuesMenu}>
//             <Link>
//               <FontAwesomeIcon icon={faUser} className="icon" /> Reported Issues
//             </Link>
//             {isIssuesOpen && (
//               <ul className="submenu">
//                 <li>
//                   <Link to="/reportedissues">
//                     <FontAwesomeIcon icon={faListAlt} className="icon" /> Pending Issues
//                   </Link>
//                   <Link to="/rejectedissues">
//                     <FontAwesomeIcon icon={faListAlt} className="icon" /> Rejected Issues
//                   </Link>
//                   <Link to="/assignedtasks">
//                     <FontAwesomeIcon icon={faListAlt} className="icon" /> Assigned Tasks
//                   </Link>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Poll */}
//           <li>
//             <Link to="/poll">
//               <FontAwesomeIcon icon={faPoll} className="icon" /> Poll
//             </Link>
//           </li>

//           {/* Manage Polls */}
//           <li>
//             <Link to="/pollManagement">
//               <FontAwesomeIcon icon={faTasks} className="icon" /> Manage Polls
//             </Link>
//           </li>

//           {/* Charity Projects */}
//           <li>
//             <Link to="/charityProject">
//               <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Charity Projects
//             </Link>
//           </li>

//           {/* Manage Charity */}
//           <li>
//             <Link to="/manageCharity">
//               <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Manage Charity Projects
//             </Link>
//           </li>

//           {/* Logout
//           <li>
//             <Link to="/logout">
//               <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
//             </Link>
//           </li> */}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faIdBadge,
  faUsers,
  faCheckDouble,
  faCog,
  faListAlt,
  faPoll,
  faTasks,
  faHandsHelping,
  faSignOutAlt,
  faTools,
  faFolderOpen,
  faCheckCircle,
  faChartLine,
  faProjectDiagram,
  faClipboardList,
  faHourglassHalf,
  faTimesCircle,
  faClipboardCheck,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isIssuesOpen, setIsIssuesOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleUserMenu = () => {
    setIsUserOpen(!isUserOpen);
  };

  const toggleApprovalsMenu = () => {
    setIsApprovalsOpen(!isApprovalsOpen);
  };

  const toggleIssuesMenu = () => {
    setIsIssuesOpen(!isIssuesOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Small Screens */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <ul className="sidebar-links">
          {/* Dashboard */}
          <li>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} className="icon" /> Dashboard
            </Link>
          </li>

          {/* Profile Management */}
          <li onClick={toggleProfileMenu}>
            <Link>
              <FontAwesomeIcon icon={faIdBadge} className="icon" /> Profile Management
            </Link>
            {isProfileOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/profileManage">
                    <FontAwesomeIcon icon={faIdBadge} className="submenu-icon" /> My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/changePassword">
                    <FontAwesomeIcon icon={faCog} className="submenu-icon" /> Change Password
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Users */}
          <li onClick={toggleUserMenu}>
            <Link>
              <FontAwesomeIcon icon={faUsers} className="icon" /> Users
            </Link>
            {isUserOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/normaluser">
                    <FontAwesomeIcon icon={faUsers} className="submenu-icon" /> Normal Users
                  </Link>
                  <Link to="/volunteers">
                    <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" /> Volunteers
                  </Link>
                  <Link to="/serviceProviders">
                    <FontAwesomeIcon icon={faTools} className="submenu-icon" /> Service Providers
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* User Approvals */}
          <li onClick={toggleApprovalsMenu}>
            <Link>
              <FontAwesomeIcon icon={faCheckDouble} className="icon" /> User Approvals
            </Link>
            {isApprovalsOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/volunteerApprovals">
                    <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" /> Volunteers
                  </Link>
                  <Link to="/serviceApprovals">
                    <FontAwesomeIcon icon={faTools} className="submenu-icon" /> Service Providers
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Issue Categories */}
          <li>
            <Link to="/issues">
              <FontAwesomeIcon icon={faFolderOpen} className="icon" /> Issue Categories
            </Link>
          </li>

          {/* Completed Issues */}
          <li>
            <Link to="/completedIssues">
              <FontAwesomeIcon icon={faCheckCircle} className="icon" /> Completed Issues
            </Link>
          </li>

          {/* In Progress Issues */}
          <li>
            <Link to="/inprogressIssues">
              <FontAwesomeIcon icon={faChartLine} className="icon" /> Progress Reports
            </Link>
          </li>

          {/* Reported Issues */}
          <li onClick={toggleIssuesMenu}>
            <Link>
              <FontAwesomeIcon icon={faClipboardList} className="icon" /> Reported Issues
            </Link>
            {isIssuesOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/reportedissues">
                    <FontAwesomeIcon icon={faHourglassHalf} className="submenu-icon" /> Pending Issues
                  </Link>
                  <Link to="/rejectedissues">
                    <FontAwesomeIcon icon={faTimesCircle} className="submenu-icon" /> Rejected Issues
                  </Link>
                  <Link to="/assignedtasks">
                    <FontAwesomeIcon icon={faClipboardCheck} className="submenu-icon" /> Assigned Tasks
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Poll */}
          <li>
            <Link to="/poll">
              <FontAwesomeIcon icon={faPoll} className="icon" /> Poll
            </Link>
          </li>

          {/* Manage Polls */}
          <li>
            <Link to="/pollManagement">
              <FontAwesomeIcon icon={faTasks} className="icon" /> Manage Polls
            </Link>
          </li>

          {/* Charity Projects */}
          <li>
            <Link to="/charityProject">
              <FontAwesomeIcon icon={faProjectDiagram} className="icon" /> Charity Projects
            </Link>
          </li>

          {/* Manage Charity */}
          <li>
            <Link to="/manageCharity">
              <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Manage Charity Projects
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
