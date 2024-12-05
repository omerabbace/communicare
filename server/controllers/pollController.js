// const Poll = require('../model/Poll');
// const asyncHandler = require('../utilities/CatchAsync');
// const AppError = require('../utilities/AppError');

// // Create Poll
// exports.createPoll = asyncHandler(async (req, res, next) => {
//     const { name, options, startDate, endDate } = req.body;

//     if (!options || options.length < 2) {
//         return next(new AppError('At least two options are required for a poll', 400));
//     }

//     const poll = await Poll.create({
//         name,
//         options: options.map(option => ({ optionText: option })),
//         startDate,
//         endDate,
//         createdBy: req.user._id
//     });

//     res.status(201).json({
//         status: 'success',
//         poll
//     });
// });

// // Get Polls
// exports.getPolls = asyncHandler(async (req, res, next) => {
//     const polls = await Poll.find({});

//     res.status(200).json({
//         status: 'success',
//         results: polls.length,
//         polls
//     });
// });

// // Get Poll by ID
// exports.getPollById = asyncHandler(async (req, res, next) => {
//     const poll = await Poll.findById(req.params.id);

//     if (!poll) {
//         return next(new AppError('Poll not found', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         poll
//     });
// });



// const Poll = require('../model/Poll');
// const asyncHandler = require('../utilities/CatchAsync');
// const AppError = require('../utilities/AppError');

// Create Poll
// exports.createPoll = asyncHandler(async (req, res, next) => {
//     const { name, options, startDate, endDate } = req.body;

//     if (!options || options.length < 2) {
//         return next(new AppError('At least two options are required for a poll', 400));
//     }

//     const poll = await Poll.create({
//         name,
//         options: options.map(option => ({ optionText: option })),
//         startDate,
//         endDate,
//         createdBy: req.user._id,
//         disableVotes: false
//     });

//     res.status(201).json({
//         status: 'success',
//         poll
//     });
// });


const Poll = require('../model/Poll');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const { sendPushNotification } = require('../controllers/notificationsController'); // Import your push notification function
const User = require('../model/User'); // Assuming User model exists and has role/userType

// Create Poll
// exports.createPoll = asyncHandler(async (req, res, next) => {
//     const { name, options, startDate, endDate } = req.body;

//     // Validate options (at least 2 options are required)
//     if (!options || options.length < 2) {
//         return next(new AppError('At least two options are required for a poll', 400));
//     }

//     // Create the poll in the database
//     const poll = await Poll.create({
//         name,
//         options: options.map(option => ({ optionText: option })),
//         startDate,
//         endDate,
//         createdBy: req.user._id,
//         // disableVotes: false
//     });

//     // Retrieve all users, both normal and volunteers
//     const normalUsers = await User.find({ role: 'normal' }); // Assuming 'role' field distinguishes normal users
//     const volunteers = await User.find({ role: 'volunteer' }); // Assuming 'role' field distinguishes volunteers

//     // Combine normal users and volunteers into a single array
//     const allUsers = [...normalUsers, ...volunteers];

//     // Send notifications to all users
//     const notificationPromises = allUsers.map(user => {
//         return sendPushNotification({
//             userId: user._id,
//             title: 'New Poll Created!',
//             body: `A new poll "${poll.name}" has been created. Check it out now!`,
//             data: { pollId: poll._id }
//         });
//     });

//     // Wait for all notifications to be sent
//     await Promise.all(notificationPromises);

//     res.status(201).json({
//         status: 'success',
//         poll
//     });
// });


exports.createPoll = asyncHandler(async (req, res, next) => {
    const { name, options, startDate, endDate } = req.body;

    if (!options || options.length < 2) {
        return next(new AppError('At least two options are required for a poll', 400));
    }

    // Create the poll
    const poll = await Poll.create({
        name,
        options: options.map(option => ({ optionText: option })),
        startDate,
        endDate,
        createdBy: req.user._id,
        disableVotes: false
    });

    // console.log('Poll created:', poll);

    // Retrieve normal users and volunteers
    const normalUsers = await User.find({ role: 'normal', pushNotificationToken: { $ne: null } });
    const volunteers = await User.find({ role: 'volunteer', pushNotificationToken: { $ne: null } });

    // Combine users with valid tokens
    const allUsers = [...normalUsers, ...volunteers];

    // Send notifications to all users with valid push tokens
    const notificationPromises = allUsers.map(user => {
        return sendPushNotification({
            userId: user._id,
            title: 'New Poll Created!',
            body: `A new poll "${poll.name}" has been created. Check it out now!`,
            data: { pollId: poll._id }
        });
    });

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);

    res.status(201).json({
        status: 'success',
        poll
    });
});



// Get Polls
// Get Polls (Separated by Active and Ended)
exports.getPolls = asyncHandler(async (req, res, next) => {
    const currentDate = new Date();

    // Find active and ended polls separately
    const activePolls = await Poll.find({ endDate: { $gte: currentDate } });
    const endedPolls = await Poll.find({ endDate: { $lt: currentDate } });

    res.status(200).json({
        status: 'success',
        activePolls: activePolls.length,
        endedPolls: endedPolls.length,
        polls: {
            active: activePolls,
            ended: endedPolls
        }
    });
});


// Get Poll by ID
exports.getPollById = asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
        return next(new AppError('Poll not found', 404));
    }

    res.status(200).json({
        status: 'success',
        poll
    });
});

// Toggle Vote Status (Disable/Enable)
// exports.toggleVotes = asyncHandler(async (req, res, next) => {
//     const poll = await Poll.findById(req.params.id);
    
//     if (!poll) {

//         return next(new AppError('Poll not found', 404));
//     }

//     // Check if poll is already expired
//     if (new Date(poll.endDate) < new Date()) {
//         return next(new AppError('Poll has already ended, votes cannot be changed', 400));
//     }

//     poll.disableVotes = !poll.disableVotes;
//     await poll.save();

//     res.status(200).json({
//         status: 'success',
//         message: `Voting is now ${poll.disableVotes ? 'disabled' : 'enabled'} for this poll.`,
//         poll
//     });
// });

exports.toggleVotes = asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
        return next(new AppError('Poll not found', 404));
    }

    // Check if poll is already expired
    if (new Date(poll.endDate) < new Date()) {
        return next(new AppError('Poll has already ended, votes cannot be changed', 400));
    }

    // Toggle the voting status
    poll.disableVotes = !poll.disableVotes;
    await poll.save();

    // Fetch normal users and volunteers with a valid push notification token
    const normalUsers = await User.find({ role: 'normal', pushNotificationToken: { $ne: null } });
    const volunteers = await User.find({ role: 'volunteer', pushNotificationToken: { $ne: null } });
    const allUsers = [...normalUsers, ...volunteers];

    // Send notifications to users about the voting status change
    const notificationPromises = allUsers.map(user => {
        return sendPushNotification({
            userId: user._id,  // Correctly pass pushNotificationToken
            title: 'Poll Voting Status Changed',
            body: `Voting is now ${poll.disableVotes ? 'disabled' : 'enabled'} for the poll "${poll.name}".`,
            data: { pollId: poll._id }
        });
    });

    try {
        // Wait for all notifications to be sent
        await Promise.all(notificationPromises);
        console.log('Voting status notifications sent successfully');
    } catch (error) {
        console.error('Error sending voting status notifications:', error);
        return next(new AppError('Error sending notifications', 500));
    }

    // Send response back to the client
    res.status(200).json({
        status: 'success',
        message: `Voting is now ${poll.disableVotes ? 'disabled' : 'enabled'} for this poll.`,
        poll
    });
});
