// controllers/servicePaymentController.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ServicePayment = require('../model/ServicePayment');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Create a Service Payment
exports.createServicePayment = asyncHandler(async (req, res, next) => {
    const { serviceProviderId, amount, currency } = req.body;

    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount, // amount in cents
        currency,
    });

    // Create a new service payment record in the database
    const newServicePayment = await ServicePayment.create({
        userId: req.user._id,
        serviceProviderId,
        amount,
        currency,
        status: 'pending',
        paymentIntentId: paymentIntent.id,
    });

    res.status(201).json({
        status: 'success',
        clientSecret: paymentIntent.client_secret,
        paymentId: newServicePayment._id,
    });
});

// Get All Service Payments
exports.getServicePayments = asyncHandler(async (req, res, next) => {
    const { userId, serviceProviderId } = req.query;

    // Create filter object
    let filter = {};
    if (userId) filter.userId = userId;
    if (serviceProviderId) filter.serviceProviderId = serviceProviderId;

    // Retrieve all service payments based on filter
    const servicePayments = await ServicePayment.find(filter).populate('userId serviceProviderId');

    res.status(200).json({
        status: 'success',
        results: servicePayments.length,
        data: servicePayments
    });
});
