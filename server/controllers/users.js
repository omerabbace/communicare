
const asyncHandler = require('../utilities/CatchAsync');
const mongoose = require('mongoose')
const User = require('../model/User');
const AppError = require('../utilities/AppError');
const generateToken = require('../utilities/getToken');
const matchPass = require('../utilities/MatchPassword');
const bcrypt = require('bcrypt');
const uploadProfilePicture = require('../middlewares/uploadProfilePicture');


// Register User
const registerUser = asyncHandler(async (req, res) => {
    console.log('Incoming Request Body:', req.body); 

    const { name, email, password, phone, role, cnic, serviceCategory } = req.body;
    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
        throw new AppError("Enter all the required fields", 400);
    }

    // Additional validation for volunteer and service provider roles
    if (role !== 'normal' && !cnic) {
        throw new AppError("CNIC is required for volunteers and service providers", 400);
    }
    if (role === 'serviceProvider' && !serviceCategory) {
        throw new AppError("Service category is required for service providers", 400);
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
        throw new AppError("User Already Registered", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userAccount = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        cnic: role !== 'normal' ? cnic : null,
        serviceCategory: role === 'serviceProvider' ? serviceCategory : null,
        isAccepted: role === 'normal'? true : null  
    });

    // Send response
    if (userAccount) {
        return res.status(200).json({
            success: true,
            message: 'User registered successfully. Awaiting admin approval if necessary.',
            user: {
                name: userAccount.name,
                email: userAccount.email,
                phone: userAccount.phone,
                role: userAccount.role,
                cnic: userAccount.cnic,
                serviceCategory: userAccount.serviceCategory,
                isAccepted: userAccount.isAccepted
            }
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

//register users by admin

const registerUsersByAdmin = asyncHandler(async (req, res) => {
    console.log('Incoming Request Body:', req.body); 

    const { name, email, password, phone, role, cnic, serviceCategory } = req.body;
    // Validate required fields
    if (!name || !email || !password || !phone || !role) {
        throw new AppError("Enter all the required fields", 400);
    }

    // Additional validation for volunteer and service provider roles
    if (role !== 'normal' && !cnic) {
        throw new AppError("CNIC is required for volunteers and service providers", 400);
    }
    if (role === 'serviceProvider' && !serviceCategory) {
        throw new AppError("Service category is required for service providers", 400);
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
        throw new AppError("User Already Registered", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userAccount = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        cnic: role !== 'normal' ? cnic : null,
        serviceCategory: role === 'serviceProvider' ? serviceCategory : null,
        isAccepted: true ,
    });

    // Send response
    if (userAccount) {
        return res.status(200).json({
            success: true,
            message: 'User registered successfully. Awaiting admin approval if necessary.',
            user: {
                name: userAccount.name,
                email: userAccount.email,
                phone: userAccount.phone,
                role: userAccount.role,
                cnic: userAccount.cnic,
                serviceCategory: userAccount.serviceCategory,
                isAccepted: userAccount.isAccepted
            }
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userAccount = await User.findOne({ email });

    if (userAccount) {
        if (!userAccount.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is disabled. Contact support.",
                data: {}
            });
        }

        if (!userAccount.isAccepted) {
            return res.status(403).json({
                success: false,
                message: "Account not approved by admin.",
                data: {}
            });
        }

        if (await matchPass(password, userAccount.password)) {
            res.status(201).json({
                success: true,
                message: "Login successfully",
                data: {
                    _id: userAccount._id,
                    name: userAccount.name,
                    email: userAccount.email,
                    phone: userAccount.phone,
                    role: userAccount.role,
                    cnic: userAccount.cnic,
                    serviceCategory: userAccount.serviceCategory,
                    profilePicture: userAccount.profilePicture,
                    token: generateToken({
                        _id: userAccount._id,
                        name: userAccount.name,
                        email: userAccount.email
                    })
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Wrong email or password",
                data: {}
            });
        }
    } else {
        res.status(404).json({
            success: false,
            message: "Account not found",
            data: {}
        });
    }
});

// Update Profile

// Update Profile
const updateProfile = asyncHandler(async (req, res, next) => {
    uploadProfilePicture(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds the 10MB limit.',
          });
        }
  
        console.error('Error during file upload:', err);
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }
  
      try {
        const { userId } = req.params;
        const { email, name, phone, role, cnic, serviceCategory } = req.body;
  
        // Validate required fields
        if (!name || !email || !phone || !role) {
          throw new AppError('Enter all the required fields', 400);
        }
  
        // Additional validation for volunteer and service provider roles
        if (role !== 'normal' && !cnic) {
          throw new AppError('CNIC is required for volunteers and service providers', 400);
        }
        if (role === 'serviceProvider' && !serviceCategory) {
          throw new AppError('Service category is required for service providers', 400);
        }
  
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
  
        // Update user details
        user.email = email || user.email;
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.role = role || user.role;
        user.cnic = role !== 'normal' ? cnic : null;
        user.serviceCategory = role === 'serviceProvider' ? serviceCategory : null;
  
        // Update profile picture
        if (req.file) {
          user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        }
  
        // Save the user
        await user.save();
  
        res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          data: user,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        next(error);
      }
    });
  });
  

// const updateProfile = asyncHandler(async (req, res) => {
//     const { userId } = req.params;
//     const { email, name, phone, role, cnic, serviceCategory } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !role) {
//         throw new AppError("Enter all the required fields", 400);
//     }

//     // Additional validation for volunteer and service provider roles
//     if (role !== 'normal' && !cnic) {
//         throw new AppError("CNIC is required for volunteers and service providers", 400);
//     }
//     if (role === 'serviceProvider' && !serviceCategory) {
//         throw new AppError("Service category is required for service providers", 400);
//     }

//     // Check if the user with the given ID exists
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError("User not found", 404);
//     }

//     // Update user's details
//     user.email = email || user.email;
//     user.name = name || user.name;
//     user.phone = phone || user.phone;
//     user.role = role || user.role;
//     user.cnic = role !== 'normal' ? cnic : null;
//     user.serviceCategory = role === 'serviceProvider' ? serviceCategory : null;

//     // Save the updated user
//     await user.save();

//     res.status(200).json({
//         success: true,
//         message: 'Profile updated successfully',
//         data: user
//     });
// });

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new AppError("Enter all the required fields", 400);
    }

    // Check if the user with the given ID exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Check if the old password matches the stored password
    if (!(await matchPass(oldPassword, user.password))) {
        return res.status(400).json({
            success: false,
            message: 'Old password is not correct'
        });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password with the new password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

// Get Profile
const getProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if the user with the given ID exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Return user's profile details
    res.status(200).json({
        success: true,
        data: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            cnic: user.cnic,
            serviceCategory: user.serviceCategory,
            isActive: user.isActive,
            isAccepted: user.isAccepted
        }
    });
});

// Get All Service Providers
const getAllServiceProviders = asyncHandler(async (req, res) => {
    const serviceProviders = await User.find({ role: 'serviceProvider' });
    res.status(200).json({
        success: true,
        data: serviceProviders
    });
});

// Get All Volunteers
const getAllVolunteers = asyncHandler(async (req, res) => {
    const volunteers = await User.find({ role: 'volunteer' });
    res.status(200).json({
        success: true,
        data: volunteers
    });
});

// Get All Normal Users
const getAllNormalUsers = asyncHandler(async (req, res) => {
    const normalUsers = await User.find({ role: 'normal' });
    res.status(200).json({
        success: true,
        data: normalUsers
    });
});
// Disabling Userss (Soft Delete)
const disableUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    user.isActive = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User with ID ${userId} has been disabled.`,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
        }
    });
});

// Enabling Users
const enableUser = asyncHandler(async (req, res) => {
    const { userId } = req.params; 

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User with ID ${userId} has been enabled.`,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
        }
    });
});

// Approve User (for service providers and volunteers)
const approveUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Ensure the user is either a volunteer or a service provider
    if (user.role === 'normal') {
        throw new AppError("Only volunteers and service providers require approval", 400);
    }

    // Approve the user
    user.isAccepted = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User with ID ${userId} has been approved.`,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isAccepted: user.isAccepted
        }
    });
});
const rejectUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Ensure the user is either a volunteer or a service provider
    if (user.role === 'normal') {
        throw new AppError("Only volunteers and service providers require approval", 400);
    }

    // Soft-reject the user by setting `isAccepted` to false
    user.isAccepted = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User with ID ${userId} has been rejected.`,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isAccepted: user.isAccepted
        }
    });
});
// Route to save the FCM token for a user
const saveFcmToken = asyncHandler(async (req, res, next) => {
    const { userId, fcmToken } = req.body;
  
    if (!userId || !fcmToken) {
      return res.status(400).json({ message: 'User ID and FCM token are required.' });
    }
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.fcmToken = fcmToken;
      await user.save();
  
      res.status(200).json({ success: true, message: 'FCM token saved successfully.' });
    } catch (error) {
      console.error('Error saving FCM token:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  
//   const updatePushNotificationToken = async (req, res) => {
//     const { pushNotificationToken } = req.body;
//     console.log("hello backend" ,pushNotificationToken );
//     if (!pushNotificationToken) {
//       return res.status(400).json({ success: false, message: 'Push notification token is required' });
//     }
  
//     try {
//     console.log("hello backend user");

//       // Update the user's push notification token
//       const user = await User.findByIdAndUpdate(
//         console.log("hello backend user ew",req.user.id),

//         req.user.id, // Authenticated user's ID from auth middleware
//         { pushNotificationToken }, // Update field
//         { new: true } // Return the updated document
//       );
  
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
  
//       res.json({ success: true, message: 'Push token updated successfully', user });
//     } catch (error) {
//       console.error('Error updating push token:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   };
const updatePushNotificationToken = async (req, res) => {
    const { pushNotificationToken } = req.body;
  
    if (!pushNotificationToken) {
      return res.status(400).json({ success: false, message: 'Push notification token is required' });
    }
  
    try {
      console.log('Received token:', pushNotificationToken);
      console.log('Authenticated user ID:', req.user.id);
  
      const userId = req.user.id;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
      }
  
      // Update the user's push notification token
      const user = await User.findByIdAndUpdate(
        userId,
        { pushNotificationToken },
        { new: true }
      );
  
      if (!user) {
        console.log('User not found in the database');
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, message: 'Push token updated successfully', user });
    } catch (error) {
      console.error('Error updating push token:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  


  
module.exports = {
    registerUser,
    registerUsersByAdmin,
    loginUser,
    updateProfile,
    changePassword,
    getProfile,
    getAllServiceProviders,
    getAllVolunteers,
    getAllNormalUsers,
    disableUser,
    enableUser ,
    approveUser, 
    rejectUser,
    saveFcmToken,
    updatePushNotificationToken,
};