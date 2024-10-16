import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUser,
  faCog,
  faListAlt,
  faPoll,
  faTasks,
  faHandsHelping,
  faSignOutAlt,
  faTools,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isUserOpen , setUserOpen] = useState(false);
  const [isApprovals , setApprovals] = useState(false);
  const toggleProfileMenu = () => {
    setProfileOpen(!isProfileOpen);
  };
  const toggleIsUser =()=>{
    setUserOpen(!isUserOpen);
  }
  const toggleApprovls =()=>{
    setApprovals(!isApprovals);
  }

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
            <FontAwesomeIcon icon={faUser} className="icon" /> Profile Management
          </Link>
          {isProfileOpen && (
            <ul className="submenu">
              <li>
                <Link to="/profileManage">
                  <FontAwesomeIcon icon={faUser} className="submenu-icon" /> My Profile
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
          <FontAwesomeIcon icon={faUser} className="icon" /> Users
          </Link>
          {isUserOpen &&(
            <ul className='submenu'>
              <li>
                <Link to='/normaluser'>
                  <FontAwesomeIcon icon={faUser} className="submenu-icon" />Normal Users
                </Link>
                <Link to='/volunteers'>
                  <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" />Volunteers
                </Link>
                <Link to='/serviceProviders'>
                  <FontAwesomeIcon icon={faTools} className="submenu-icon" />Service Providers
                </Link>

              </li>
            </ul>
          )}

        </li>

        <li onClick={toggleApprovls}>
          <Link>
          <FontAwesomeIcon icon={faUser} className="icon" /> User Approvals
          </Link>
          {isApprovals &&(
            <ul className='submenu'>
              <li>
                <Link to='/volunteerApprovals'>
                  <FontAwesomeIcon icon={faHandsHelping} className="submenu-icon" />Volunteers
                </Link>
                <Link to='/serviceApprovals'>
                  <FontAwesomeIcon icon={faTools} className="submenu-icon" />Service Providers
                </Link>

              </li>
            </ul>
          )}

        </li>

        <li>
          <Link to="/issues">
            <FontAwesomeIcon icon={faListAlt} className="icon" /> Issue Categories
          </Link>
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
            <FontAwesomeIcon icon={faHandsHelping} className="icon" /> Charity Projects
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
