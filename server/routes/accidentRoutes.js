const express = require('express');
const {
    reportAccident,
    getAllAccidents,
    selectAccident,
    updateLocation,
    // getAcceptedAccident,
    startNotification,
    completeNotification,
    getCompletedAccidents,
    getAcceptedAccidents,
    startRide,
    completeRide,
    cancelAccident,
    getAccidentStatistics
} = require('../controllers/accidentController');
const { isLogin } = require('../middlewares/isLogin');

const router = express.Router();

// Route for reporting an accident
router.post('/report', isLogin, reportAccident);

// Route for fetching all accident reports (for service providers)
router.get('/all', isLogin, getAllAccidents);

// Route for selecting an accident (service provider claims an accident)
router.post('/select/:accidentId', isLogin, selectAccident);

// Route for updating service provider location
router.post('/update-location', isLogin, updateLocation);

// Route for fetching the currently accepted accident for a service provider
// router.get('/accepted', isLogin, getAcceptedAccident); // New route

router.get('/completedAccidents' ,isLogin , getCompletedAccidents);

router.post('/notifications/start', startNotification);
router.post('/notifications/complete', completeNotification);

// Fetch accepted accidents for a service provider
router.get('/accepted', isLogin,getAcceptedAccidents);

// Start ride for an accident
router.post('/start/:accidentId', isLogin, startRide);

// Complete ride for an accident
router.post('/complete/:accidentId', isLogin, completeRide);

router.patch('/cancel/:accidentId', isLogin, cancelAccident);
// Route to get accident statistics
router.get('/statistics', isLogin, getAccidentStatistics);
module.exports = router;
