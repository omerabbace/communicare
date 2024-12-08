// import React, { useState } from 'react';
// import '../styles/userForm.css';
// import Sidebar from './Sidebar';
// import axios from 'axios';
// import { BASE_URL } from '../config';
// import { useNavigate } from 'react-router-dom';
// const VolunteerForm = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         confirmPassword: '',
//         cnic: '',
//         role: 'volunteer'

//     });
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errors, setErrors] = useState({});

//     // Function to handle input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
        
//         // Format CNIC field to XXXXX-XXXXXX-X format
//         if (name === 'cnic') {
//             let formattedValue = value.replace(/\D/g, ''); // Remove non-digit characters
//             if (formattedValue.length > 5) {
//                 formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
//             }
//             if (formattedValue.length > 13) {
//                 formattedValue = formattedValue.slice(0, 13) + '-' + formattedValue.slice(13, 14);
//             }
//             setFormData({
//                 ...formData,
//                 [name]: formattedValue
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value
//             });
//         }
//     };

//     // Function to validate the form
//     const validate = () => {
//         const newErrors = {};

//         // Validate full name (only letters and max length 50)
//         if (!/^[A-Za-z\s]{1,50}$/.test(formData.name)) {
//             newErrors.name = 'Full Name should contain only letters.';
//         }

//         // Validate email
//         if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address.';
//         }

//         // Validate phone number (11 digits)
//         if (!/^\d{11}$/.test(formData.phone)) {
//             newErrors.phone = 'Phone Number should contain 11 digits.';
//         }

//         // Validate password (minimum 6 characters)
//         if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters long.';
//         }

//         // Validate confirm password (must match password)
//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match.';
//         }

//         // Validate CNIC (XXXXX-XXXXXX-X format)
//         if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
//             newErrors.cnic = 'CNIC should be in the format XXXXX-XXXXXXX-X.';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     // Function to handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (validate()) {
//             try {
//                 const token = localStorage.getItem('token');
//                 const { confirmPassword, ...requestData } = formData;
//                 const response = await axios.post(`${BASE_URL}/api/users/registerusers`, 
//                     requestData, 
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         }
//                     }
//                 );
//                 if (response.data.success) {
//                     setSuccessMessage('User added successfully!');
//                     navigate('/volunteers');
//                     setFormData({
//                         name: '',
//                         email: '',
//                         phone: '',
//                         password: '',
//                         confirmPassword: '',
//                         cnic: '',
//                         role: 'volunteer'
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error adding user:', error.response?.data?.message || error.message);
//                 setErrors({ api: error.response?.data?.message || 'Failed to add user. Please try again later.' });
//             }
//         }
//     };

//     return (
//         <div className='userForm-container'>
//             <Sidebar />
//             <div className="main-content">
//                 <h2>Create Volunteer</h2>
//                 <form className="user-form" onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="name">Full Name <span className="required">*</span></label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     id="name"
//                                     placeholder="Full Name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                 />
//                             </div>
//                             {errors.name && <span className="error-text">{errors.name}</span>}
//                         </div>
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="email">Email Address <span className="required">*</span></label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     placeholder="Email Address"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                 />
//                             </div>
//                             {errors.email && <span className="error-text">{errors.email}</span>}
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="phone">Phone Number <span className="required">*</span></label>
//                                 <input
//                                     type="text"
//                                     name="phone"
//                                     id="phone"
//                                     placeholder="Phone Number"
//                                     value={formData.phone}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                     maxLength="11" // Max length for CNIC format

//                                 />
//                             </div>
//                             {errors.phone && <span className="error-text">{errors.phone}</span>}
//                         </div>
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="password">Password <span className="required">*</span></label>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     id="password"
//                                     placeholder="Password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                 />
//                             </div>
//                             {errors.password && <span className="error-text">{errors.password}</span>}
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
//                                 <input
//                                     type="password"
//                                     name="confirmPassword"
//                                     id="confirmPassword"
//                                     placeholder="Confirm Password"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                 />
//                             </div>
//                             {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
//                         </div>
//                         <div className="form-group">
//                             <div className="form-label-input">
//                                 <label htmlFor="cnic">CNIC <span className="required">*</span></label>
//                                 <input
//                                     type="text"
//                                     name="cnic"
//                                     id="cnic"
//                                     placeholder="CNIC (XXXXX-XXXXXX-X)"
//                                     value={formData.cnic}
//                                     onChange={handleChange}
//                                     className="form-input"
//                                     maxLength="15" // Max length for CNIC format
//                                 />
//                             </div>
//                             {errors.cnic && <span className="error-text">{errors.cnic}</span>}
//                         </div>
//                     </div>
//                     <div className="form-row button-container">
//                         <button type="submit" className="submit-button">
//                             + Add Volunteer
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default VolunteerForm;




// // import React, { useState } from 'react';
// // import Sidebar from './Sidebar';
// // import '../styles/VolunteerForm.css';
// // import axios from 'axios';
// // import { BASE_URL } from '../config';
// // import { useNavigate } from 'react-router-dom';
// // import { FaSave } from 'react-icons/fa';

// // const VolunteerForm = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     phone: '',
// //     password: '',
// //     confirmPassword: '',
// //     cnic: '',
// //     role: 'volunteer',
// //   });
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [errors, setErrors] = useState({});

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     if (name === 'cnic') {
// //       let formattedValue = value.replace(/\D/g, '');
// //       if (formattedValue.length > 5) {
// //         formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
// //       }
// //       if (formattedValue.length > 13) {
// //         formattedValue = formattedValue.slice(0, 13) + '-' + formattedValue.slice(13, 14);
// //       }
// //       setFormData({
// //         ...formData,
// //         [name]: formattedValue,
// //       });
// //     } else {
// //       setFormData({
// //         ...formData,
// //         [name]: value,
// //       });
// //     }
// //   };

// //   const validate = () => {
// //     const newErrors = {};

// //     if (!/^[A-Za-z\s]{1,50}$/.test(formData.name)) {
// //       newErrors.name = 'Full Name should contain only letters.';
// //     }
// //     if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address.';
// //     }
// //     if (!/^\d{11}$/.test(formData.phone)) {
// //       newErrors.phone = 'Phone Number should contain 11 digits.';
// //     }
// //     if (formData.password.length < 6) {
// //       newErrors.password = 'Password must be at least 6 characters long.';
// //     }
// //     if (formData.password !== formData.confirmPassword) {
// //       newErrors.confirmPassword = 'Passwords do not match.';
// //     }
// //     if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
// //       newErrors.cnic = 'CNIC should be in the format XXXXX-XXXXXXX-X.';
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (validate()) {
// //       try {
// //         const token = localStorage.getItem('token');
// //         const { confirmPassword, ...requestData } = formData;
// //         const response = await axios.post(`${BASE_URL}/api/users/registerusers`, requestData, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         if (response.data.success) {
// //           setSuccessMessage('Volunteer added successfully!');
// //           navigate('/volunteers');
// //           setFormData({
// //             name: '',
// //             email: '',
// //             phone: '',
// //             password: '',
// //             confirmPassword: '',
// //             cnic: '',
// //             role: 'volunteer',
// //           });
// //         }
// //       } catch (error) {
// //         setErrors({
// //           api: error.response?.data?.message || 'Failed to add volunteer. Please try again later.',
// //         });
// //       }
// //     }
// //   };

// //   return (
// //     <div className="volunteerForm-container">
// //       <Sidebar />
// //       <div className="content">
// //         <div className="header">
// //           <h2>Create Volunteer</h2>
// //         </div>
// //         <form className="volunteer-form" onSubmit={handleSubmit}>
// //           <div className="form-row">
// //             <div className="form-group">
// //               <label htmlFor="name">Full Name <span className="required">*</span></label>
// //               <input
// //                 type="text"
// //                 name="name"
// //                 id="name"
// //                 placeholder="Full Name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.name && <span className="error-text">{errors.name}</span>}
// //             </div>
// //             <div className="form-group">
// //               <label htmlFor="email">Email Address <span className="required">*</span></label>
// //               <input
// //                 type="email"
// //                 name="email"
// //                 id="email"
// //                 placeholder="Email Address"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.email && <span className="error-text">{errors.email}</span>}
// //             </div>
// //           </div>
// //           <div className="form-row">
// //             <div className="form-group">
// //               <label htmlFor="phone">Phone Number <span className="required">*</span></label>
// //               <input
// //                 type="text"
// //                 name="phone"
// //                 id="phone"
// //                 placeholder="Phone Number"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.phone && <span className="error-text">{errors.phone}</span>}
// //             </div>
// //             <div className="form-group">
// //               <label htmlFor="password">Password <span className="required">*</span></label>
// //               <input
// //                 type="password"
// //                 name="password"
// //                 id="password"
// //                 placeholder="Password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.password && <span className="error-text">{errors.password}</span>}
// //             </div>
// //           </div>
// //           <div className="form-row">
// //             <div className="form-group">
// //               <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
// //               <input
// //                 type="password"
// //                 name="confirmPassword"
// //                 id="confirmPassword"
// //                 placeholder="Confirm Password"
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
// //             </div>
// //             <div className="form-group">
// //               <label htmlFor="cnic">CNIC <span className="required">*</span></label>
// //               <input
// //                 type="text"
// //                 name="cnic"
// //                 id="cnic"
// //                 placeholder="CNIC (XXXXX-XXXXXX-X)"
// //                 value={formData.cnic}
// //                 onChange={handleChange}
// //                 className="form-input"
// //               />
// //               {errors.cnic && <span className="error-text">{errors.cnic}</span>}
// //             </div>
// //           </div>
// //           <div className="button-container">
// //           <button type="submit" className="submit-button">
// //               <FaSave style={{ marginRight: '5px' }} /> Save
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VolunteerForm;



import React, { useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { FaSave } from 'react-icons/fa'; // Save Icon
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import '../styles/FormVolunteer.css'; // Updated CSS file

const VolunteerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    role: 'volunteer',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnic') {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.slice(0, 5) + '-' + formattedValue.slice(5);
      }
      if (formattedValue.length > 13) {
        formattedValue = formattedValue.slice(0, 13) + '-' + formattedValue.slice(13, 14);
      }
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]{1,50}$/.test(formData.name)) {
      newErrors.name = 'Full Name should contain only letters.';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone Number should contain 11 digits.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      newErrors.cnic = 'CNIC should be in the format XXXXX-XXXXXXX-X.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem('token');
        const { confirmPassword, ...requestData } = formData;
        const response = await axios.post(`${BASE_URL}/api/users/registerusers`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setSuccessMessage('Volunteer added successfully!');
          navigate('/volunteers');
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            cnic: '',
            role: 'volunteer',
          });
        }
      } catch (error) {
        setErrors({
          api: error.response?.data?.message || 'Failed to add volunteer. Please try again later.',
        });
      }
    }
  };

  return (
    <div className="volunteer-form-container">
      <Sidebar />
      <div className="content">
        <div className="header">
          <h2>Create Volunteer</h2>
        </div>
        <form onSubmit={handleSubmit} className="volunteer-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                required
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                maxLength="11"
                required
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label>CNIC</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                placeholder="Enter CNIC (XXXXX-XXXXXX-X)"
                maxLength="15"
                required
              />
              {errors.cnic && <span className="error-text">{errors.cnic}</span>}
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="submit-button">
              <FaSave style={{ marginRight: '5px' }} /> Save
            </button>
          </div>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default VolunteerForm;
