// controllers/voteController.js
const Poll = require('../model/Poll');
const Vote = require('../model/Vote');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Cast Vote
exports.castVote = asyncHandler(async (req, res, next) => {
    const { pollId, option } = req.body;
    // console.log("poll id ", pollId);
    // console.log("poll optionsss", option);
    // Check if the poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
        return next(new AppError('Poll not found', 404));
    }

    // Check if the option exists in the poll
    const pollOption = poll.options.find(opt => opt.optionText === option);
    if (!pollOption) {
        return next(new AppError('Invalid poll option', 400));
    }

    // Check if the user already voted
    const existingVote = await Vote.findOne({ poll: pollId, votedBy: req.user._id });
    if (existingVote) {
        return next(new AppError('You have already voted on this poll', 400));
    }

    // Create the vote
    const vote = await Vote.create({
        poll: pollId,
        option,
        votedBy: req.user._id
    });

    // Increment the vote count for the selected option
    pollOption.votes += 1;
    await poll.save();

    res.status(201).json({
        status: 'success',
        vote
    });
});

// Get Votes for a Poll
exports.getVotes = asyncHandler(async (req, res, next) => {
    const pollId = req.params.pollId;

    // Check if the poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
        return next(new AppError('Poll not found', 404));
    }

    // Get all votes for the poll
    const votes = await Vote.find({ poll: pollId });

    res.status(200).json({
        status: 'success',
        results: votes.length,
        votes
    });
});

// Update Vote

// Update Vote
exports.updateVote = asyncHandler(async (req, res, next) => {
    try {
        const { pollId, newOption } = req.body;
        // console.log("Poll ID:", pollId);
        // console.log("New Option:", newOption);
        // console.log("User ID:", req.user._id);

        // Check if the poll exists
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return next(new AppError('Poll not found', 404));
        }

        // Find the user's existing vote for this poll
        const existingVote = await Vote.findOne({ poll: pollId, votedBy: req.user._id });
        if (!existingVote) {
            return next(new AppError('No existing vote found to update', 404));
        }

        // If `newOption` is `null`, remove the vote
        if (newOption === null) {
            // Find the old option in the poll and decrement its vote count
            const oldPollOption = poll.options.find(opt => opt.optionText === existingVote.option);
            if (oldPollOption) {
                oldPollOption.votes -= 1;
            }

            // Remove the existing vote using deleteOne()
            await existingVote.deleteOne();

            // Save the updated poll
            await poll.save();

            return res.status(200).json({
                status: 'success',
                message: 'Your vote has been undone successfully',
            });
        }

        // Check if the new option exists in the poll
        const newPollOption = poll.options.find(opt => opt.optionText === newOption);
        if (!newPollOption) {
            return next(new AppError('Invalid poll option', 400));
        }

        // Check if the user is trying to update to the same option
        if (existingVote.option === newOption) {
            return next(new AppError('You have already voted for this option', 400));
        }

        // Decrease vote count for the old option
        const oldPollOption = poll.options.find(opt => opt.optionText === existingVote.option);
        if (oldPollOption) {
            oldPollOption.votes -= 1;
        }

        // Increment vote count for the new option
        newPollOption.votes += 1;

        // Update the existing vote in the Vote collection
        existingVote.option = newOption;
        await existingVote.save();

        // Save the updated poll
        await poll.save();

        res.status(200).json({
            status: 'success',
            message: 'Your vote has been updated successfully',
            vote: existingVote,
        });
    } catch (error) {
        console.error("Error in updateVote controller:", error);
        return next(new AppError('Internal server error', 500));
    }
});


// Get Votes for a Poll with Count
exports.getVotesWithCount = asyncHandler(async (req, res, next) => {
    const pollId = req.params.pollId;

    // Check if the poll exists
    const poll = await Poll.findById(pollId);
    if (!poll) {
        return next(new AppError('Poll not found', 404));
    }

    // Count the votes for each option
    const voteCounts = await Vote.aggregate([
        {
            $match: { poll: poll._id } // Filter by poll ID
        },
        {
            $group: {
                _id: "$option", // Group by the option text
                count: { $sum: 1 } // Count the number of votes for each option
            }
        }
    ]);

    // Format the results to match poll options
    const formattedResults = poll.options.map(option => {
        const count = voteCounts.find(vote => vote._id === option.optionText);
        return {
            optionText: option.optionText,
            count: count ? count.count : 0 // Use count from aggregation, or 0 if no votes
        };
    });

    res.status(200).json({
        status: 'success',
        results: formattedResults.length,
        votes: formattedResults
    });
});
