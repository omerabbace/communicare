// controllers/servicePaymentController.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ServicePayment = require('../model/ServicePayment');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Create a Service Payment
exports.createServicePayment = asyncHandler(async (req, res, next) => {
    const { serviceProviderId, amount, currency, paymentMethod } = req.body;

    try {
        let paymentIntent = null;

        if (paymentMethod === 'card') {
            paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
            });
        }

        const newServicePayment = await ServicePayment.create({
            userId: req.user._id,
            serviceProviderId,
            amount,
            currency,
            status: paymentMethod === 'cash' ? 'completed' : 'pending',
            paymentMethod,
            paymentIntentId: paymentIntent ? paymentIntent.id : undefined,
        });

        res.status(201).json({
            status: 'success',
            clientSecret: paymentIntent ? paymentIntent.client_secret : null,
            paymentId: newServicePayment._id,
        });
    } catch (error) {
        console.error("Error in createServicePayment:", error.message);
        next(new AppError("Internal Server Error", 500));
    }
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
// Complete Payment
exports.completePayment = asyncHandler(async (req, res, next) => {
    const { requestId, paymentMethod, amount, status } = req.body;

    const paymentRecord = await ServicePayment.findOne({ userId: requestId });

    if (!paymentRecord) {
        return next(new AppError('Payment record not found', 404));
    }

    paymentRecord.status = status;
    paymentRecord.paymentMethod = paymentMethod;
    paymentRecord.completedAt = new Date();

    await paymentRecord.save();

    res.status(200).json({
        status: 'success',
        message: 'Payment completed successfully',
        data: paymentRecord,
    });
});


// Get All Service Payments (Modified)
exports.getAllServicePayments = asyncHandler(async (req, res, next) => {
    try {
      const servicePayments = await ServicePayment.find()
        .populate({
          path: 'userId',
          select: 'name' // Select only the name of the user
        })
        .populate({
          path: 'serviceProviderId',
          select: 'name' // Select only the name of the service provider
        });

      res.status(200).json({
        status: 'success',
        results: servicePayments.length,
        data: servicePayments,
      });
    } catch (error) {
        console.error("Error fetching service payments:", error); // Log the error for debugging
        res.status(500).json({ // Improved error response (JSON format)
          status: 'error',
          message: 'Internal Server Error', // Generic error message for security
          error: error.message // Detailed error for development/debugging
        });
    }
});