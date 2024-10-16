// controllers/donationController.js
// require('dotenv').config();
// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q4UE6FNGoX1f4Iw6l2SCMk9EBByEad8YuvRZ5G6sQxPfB9JB9B44X6myWyIw5ixTLCRoRwS2VErHDtJeUFfb6ws000HVtBW56';
// const stripe = require('stripe')(stripeSecretKey);
// const Donation = require('../model/Donation');
// const asyncHandler = require('../utilities/CatchAsync');
// const AppError = require('../utilities/AppError');

// // Create a Donation
// exports.createDonation = asyncHandler(async (req, res, next) => {
//     const { projectId, amount, currency } = req.body;

//     // Create a Payment Intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount, // amount in cents
//         currency,
//     });

//     // Create a new donation record in the database
//     const newDonation = await Donation.create({
//         userId: req.user._id,
//         projectId,
//         amount,
//         currency,
//         status: 'pending',
//         paymentIntentId: paymentIntent.id,
//     });

//     res.status(201).json({
//         status: 'success',
//         clientSecret: paymentIntent.client_secret,
//         donationId: newDonation._id,
//     });
// });

// // Get All Donations
// exports.getDonations = asyncHandler(async (req, res, next) => {
//     const { userId, projectId } = req.query;

//     // Create filter object
//     let filter = {};
//     if (userId) filter.userId = userId;
//     if (projectId) filter.projectId = projectId;

//     // Retrieve all donations based on filter
//     const donations = await Donation.find(filter).populate('userId projectId');

//     res.status(200).json({
//         status: 'success',
//         results: donations.length,
//         data: donations
//     });
// });

require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51Q4UE6FNGoX1f4Iw6l2SCMk9EBByEad8YuvRZ5G6sQxPfB9JB9B44X6myWyIw5ixTLCRoRwS2VErHDtJeUFfb6ws000HVtBW56';
const stripe = require('stripe')(stripeSecretKey);
const Donation = require('../model/Donation');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
// Create a Donation
exports.createDonation = asyncHandler(async (req, res, next) => {
    try {
        console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

        console.log('Creating a donation:', req.body);

        const { donations, amount, currency } = req.body;

        // Validate input data
        if (!donations || donations.length === 0 || !amount || !currency) {
            return next(new AppError('Missing required fields: donations array, amount, or currency.', 400));
        }

        // Assuming you want to use the first donation for the payment
        const { projectId } = donations[0];

        if (!projectId) {
            return next(new AppError('Missing projectId in donations array.', 400));
        }

        // Ensure amount is in cents for Stripe (integer value)
        const amountInCents = parseInt(amount, 10);

        // Create a Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // amount in cents
            currency,
        });
        console.log('Payment Intent created:', paymentIntent);

        // Create a new donation record in the database
        const newDonation = await Donation.create({
            userId: req.user._id,
            projectId,
            amount: amountInCents,
            currency,
            status: 'pending',
            paymentIntentId: paymentIntent.id,
        });
        console.log('Donation saved:', newDonation);

        res.status(201).json({
            status: 'success',
            clientSecret: paymentIntent.client_secret,
            donationId: newDonation._id,
        });
    } catch (error) {
        console.error('Error in createDonation:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

// Get All Donations
exports.getDonations = asyncHandler(async (req, res, next) => {
    console.log('Fetching donations with filter:', req.query);

    const { userId, projectId } = req.query;

    // Create filter object
    let filter = {};
    if (userId) filter.userId = userId;
    if (projectId) filter.projectId = projectId;

    // Retrieve all donations based on filter
    const donations = await Donation.find(filter).populate('userId projectId');
    console.log('Donations found:', donations);

    res.status(200).json({
        status: 'success',
        results: donations.length,
        data: donations
    });
});
