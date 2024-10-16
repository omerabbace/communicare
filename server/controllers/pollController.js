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



const Poll = require('../model/Poll');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Create Poll
exports.createPoll = asyncHandler(async (req, res, next) => {
    const { name, options, startDate, endDate } = req.body;

    if (!options || options.length < 2) {
        return next(new AppError('At least two options are required for a poll', 400));
    }

    const poll = await Poll.create({
        name,
        options: options.map(option => ({ optionText: option })),
        startDate,
        endDate,
        createdBy: req.user._id,
        disableVotes: false
    });

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
exports.toggleVotes = asyncHandler(async (req, res, next) => {
    const poll = await Poll.findById(req.params.id);
    
    if (!poll) {

        return next(new AppError('Poll not found', 404));
    }

    // Check if poll is already expired
    if (new Date(poll.endDate) < new Date()) {
        return next(new AppError('Poll has already ended, votes cannot be changed', 400));
    }

    poll.disableVotes = !poll.disableVotes;
    await poll.save();

    res.status(200).json({
        status: 'success',
        message: `Voting is now ${poll.disableVotes ? 'disabled' : 'enabled'} for this poll.`,
        poll
    });
});
