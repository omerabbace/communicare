const express = require('express');
const { createServicePayment, getServicePayments,completePayment, getAllServicePayments } = require('../controllers/servicePaymentController');
const { isLogin } = require('../middlewares/isLogin'); // Auth middleware

const router = express.Router();

// Route to create a service payment
router.post('/create', isLogin, createServicePayment);

// Route to get service payments
router.get('/', isLogin, getServicePayments);

router.get('/all', getAllServicePayments);
// Route to complete a payment cash
router.post('/complete-payment', isLogin, completePayment);

module.exports = router;
