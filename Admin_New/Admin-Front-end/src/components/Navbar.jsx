


// // Navbar.js
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/Navbar.css'; // Import custom CSS

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className='h1-tag'>
//         <h1 className="navbar-title">Communi Care</h1>
//         </div>
//         {/* Mobile menu button */}
//         <button onClick={toggleMenu} className="navbar-button">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//           </svg>
//         </button>

//         {/* Navbar Links */}
//         <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
//           <div className="navbar-links">
           
//             <Link to="/logout" className="navbar-link">Logout</Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Import custom CSS
import { FaUserCircle } from 'react-icons/fa'; // Import user icon from react-icons

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Company Name on the left */}
        <div className="navbar-title">Communi Care</div>

        {/* Profile Icon on the right */}
        <div className="profile-container">
          <div className="profile-icon" onClick={toggleDropdown}>
            <FaUserCircle size={30} />
            <span className="profile-name"></span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profileManage" className="dropdown-item">
                My Profile
              </Link>
              <Link to="/changePassword" className="dropdown-item">
                Change Password
              </Link>
              <Link to="/logout" className="dropdown-item">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
