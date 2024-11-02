// routes/users.js

const express = require('express');
const { validateRegister, validateLogin } = require('../middlewares/schemaValidator');
const { registerUser, registerUsersByAdmin,loginUser, changePassword, updateProfile, getProfile,disableUser,enableUser, approveUser, rejectUser,saveFcmToken} = require('../controllers/users');
const { isLogin } = require('../middlewares/isLogin');
const { isProfileAuthor } = require('../middlewares/authorization');
const router = express.Router();


router.route('/signup')
    .post(validateRegister, registerUser);

router.route('/registerusers')
    .post(validateRegister, registerUsersByAdmin);

router.route('/login')
    .post(validateLogin, loginUser);

// Profile and password routes
router.route('/:userId')
    .get(isLogin, getProfile)
    // .put(isLogin, isProfileAuthor, updateProfile);

router.route('/:userId/update-password')
    .put(isLogin, isProfileAuthor, changePassword);
//Enabling disabling (delete)
router.patch('/disable/:userId',isLogin, disableUser);
router.patch('/enable/:userId', isLogin, enableUser);

router.patch('/approve/:userId', isLogin, approveUser); // Approve user
router.patch('/reject/:userId', isLogin, rejectUser);   // Reject user
// Route to update Expo push token
router.put('/update-fcm-token', isLogin, saveFcmToken);
module.exports = router;
