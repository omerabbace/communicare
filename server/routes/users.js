// routes/users.js

const express = require('express');
const { validateRegister, validateLogin } = require('../middlewares/schemaValidator');
const { registerUser, registerUsersByAdmin,loginUser, changePassword,updatePushNotificationToken, updateProfile, getProfile,disableUser,enableUser, approveUser, rejectUser,saveFcmToken} = require('../controllers/users');
const { isLogin } = require('../middlewares/isLogin');
const { isProfileAuthor } = require('../middlewares/authorization');
const upload = require('../middlewares/upload');
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

router.put('/update-profile/:userId',isLogin, updateProfile);

router.put('/:userId/update-password',isLogin, changePassword );
//Enabling disabling (delete)
router.patch('/disable/:userId',isLogin, disableUser);
router.patch('/enable/:userId', isLogin, enableUser);

router.patch('/approve/:userId', isLogin, approveUser); // Approve user
router.patch('/reject/:userId', isLogin, rejectUser);   // Reject user
// Route to update Expo push token
// router.put('/update-fcm-token', isLogin, saveFcmToken);
// Route to update push notification token
router.post('/updatePushToken', isLogin, updatePushNotificationToken);
module.exports = router;
