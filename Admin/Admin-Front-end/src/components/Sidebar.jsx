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
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [isApprovals, setApprovals] = useState(false);
  const [isIssues, setIssues] = useState(false);

  const toggleProfileMenu = () => {
    setProfileOpen(!isProfileOpen);
  };
  const toggleIsUser = () => {
    setUserOpen(!isUserOpen);
  };
  const toggleApprovals = () => {
    setApprovals(!isApprovals);
  };
  const toggleIssues = () => {
    setIssues(!isIssues);
  };

  return (
    <div className="sidebar">
      <h2>Communi Care</h2>
      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard">
            <FontAwesomeIcon icon={faTachometerAlt} className="icon" /> Dashboard
          </Link>
        </li>
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
        <li onClick={toggleIsUser}>
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
        <li onClick={toggleApprovals}>
          <Link>
            <FontAwesomeIcon icon={faCheckDouble} className="icon" /> User Approvals
          </Link>
          {isApprovals && (
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
        <li>
          <Link to="/issues">
            <FontAwesomeIcon icon={faFolderOpen} className="icon" /> Issue Categories
          </Link>
        </li>
        <li>
          <Link to="/completedIssues">
            <FontAwesomeIcon icon={faCheckCircle} className="icon" /> Completed Issues
          </Link>
        </li>
        <li>
          <Link to="/inprogressIssues">
            <FontAwesomeIcon icon={faChartLine} className="icon" /> Progress Reports
          </Link>
        </li>
        <li onClick={toggleIssues}>
          <Link>
            <FontAwesomeIcon icon={faClipboardList} className="icon" /> Reported Issues
          </Link>
          {isIssues && (
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
        <li>
          <Link to="/poll">
            <FontAwesomeIcon icon={faPoll} className="icon" /> Poll
          </Link>
        </li>
        <li>
          <Link to="/pollManagement">
            <FontAwesomeIcon icon={faTasks} className="icon" /> Manage Polls
          </Link>
        </li>
        <li>
          <Link to="/charityProject">
            <FontAwesomeIcon icon={faProjectDiagram} className="icon" /> Charity Projects
          </Link>
        </li>
        <li>
          <Link to="/manageCharity">
            <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Manage Charity Projects
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
