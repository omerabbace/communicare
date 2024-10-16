const express = require('express');
const {
    reportAccident,
    getAllAccidents,
    selectAccident,
    updateLocation
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

module.exports = router;
