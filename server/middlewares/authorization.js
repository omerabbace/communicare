const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Check if the user is the author of the profile
const isProfileAuthor = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    // Ensure both IDs are strings for comparison
    if (userId.toString() !== req.user._id.toString()) {
        throw new AppError("You are not authorized to access this profile", 401);
    }

    next(); // If authorized, proceed
});


// Check if the user has admin privileges
const isAdmin = (req, res, next) => {
    // Ensure req.user exists before checking role
    console.log(req.user.isAdmin);
    if (!req.user || req.user.isAdmin !== true) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next(); // If the user is an admin, proceed
};

// Check if the user is a volunteer
const isVolunteer = (req, res, next) => {
    // Ensure req.user exists before checking role
    if (req.user && req.user.role === 'volunteer') {
        next(); // If the user is a volunteer, proceed
    } else {
        return next(new AppError('You do not have permission to perform this action, volunteer access required', 403));
    }
};

module.exports = {
    isProfileAuthor,
    isAdmin,
    isVolunteer
};
