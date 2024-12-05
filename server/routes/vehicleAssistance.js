
const express = require('express');
const {
    reportVehicleIssue,
    getVehicleReports,
    selectVehicleReport,
    setRepairPrice,
    acceptRepairPrice,
    startWork,
    completeWork,
    checkRequestStatus,
    cancelVehicleRequest,
    getRequestDetails,
    getRepairPrice,
    checkIfPriceAndStatusAccepted,
    checkActiveRequest,
    getVehicleReportStats
} = require('../controllers/vehicleAssistance');
const { isLogin } = require('../middlewares/isLogin');

const router = express.Router();

// Route for reporting a vehicle issue
router.post('/report', isLogin, reportVehicleIssue);

// Route for fetching all reported vehicle assistance issues (for service providers)
router.get('/reports', isLogin, getVehicleReports);

// Route for a service provider to select a vehicle assistance report
router.post('/select/:requestId', isLogin, selectVehicleReport);

// User will get details of selected provider
router.get('/request-details/:requestId', isLogin, getRequestDetails);


// Route for the user to cancel a vehicle assistance request
router.post('/cancel/:requestId', isLogin, cancelVehicleRequest);

// Route for checking the status of a specific request
router.get('/request-status/:requestId', isLogin, checkRequestStatus);

// Route for a service provider to set a repair price for the vehicle assistance
router.post('/set-price/:requestId', isLogin, setRepairPrice);

// Route for the user to get the repair price set by the service provider
router.get('/get-price/:requestId', isLogin, getRepairPrice);


// Route for the user to accept the repair price
router.post('/accept-price/:requestId', isLogin, acceptRepairPrice);

// Route for the service provider to start work
router.post('/start/:requestId', isLogin, startWork);

// Route for the service provider to complete work
router.post('/complete/:requestId', isLogin, completeWork);

// Route to check if price is accepted and status is accepted for a specific request
router.get('/check-price-status/:requestId', isLogin, checkIfPriceAndStatusAccepted);

// Route to check if a service provider has an active request
router.get('/check-active-request', isLogin, checkActiveRequest);

router.get('/vehicle/stats',isLogin, getVehicleReportStats);

module.exports = router;
