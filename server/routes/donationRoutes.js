const express = require('express');
const { createDonation, getDonations } = require('../controllers/donationController');
const { isLogin } = require('../middlewares/isLogin'); // Auth middleware

const router = express.Router();

// Route to create a donation
router.post('/create', isLogin, createDonation);

// Route to get donations
router.get('/', isLogin, getDonations);

module.exports = router;
