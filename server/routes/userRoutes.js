const express = require('express');
const { getProfile, updateProfile, changePassword} = require('../controllers/userController');
const {getAllServiceProviders, getAllNormalUsers, getAllVolunteers } = require('../controllers/users');
const { isLogin } = require('../middlewares/isLogin');

const router = express.Router();

router.get('/profile', isLogin, getProfile);
router.get('/getAllServiceProviders', isLogin ,getAllServiceProviders )
router.get('/getAllNormalUsers', isLogin ,getAllNormalUsers )
router.get('/getAllVolunteers', isLogin ,getAllVolunteers )
router.put('/profile', isLogin, updateProfile);
router.put('/profile/changePassword', isLogin, changePassword)

module.exports = router;

