const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

const isProfileAuthor = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    if (userId !== req.user._id) {
        throw new AppError("Not Authorized", 401);
    }
    next();
});
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
};

const isVolunteer = (req, res, next) => {
    if (req.user && req.user.role === 'volunteer') {
        next();
    } else {
        return next(new AppError('Volunteer do not have permission to perform this action', 403));

    }
};
module.exports = {
    isProfileAuthor,
    isAdmin,
    isVolunteer
}