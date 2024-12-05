const express = require('express');
const router = express.Router();
const { sendPushNotification } = require('../controllers/notificationsController');
const { isLogin } = require('../middlewares/isLogin');


// Route to send a push notification
router.post('/send', isLogin, sendPushNotification);


module.exports = router;
