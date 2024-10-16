const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Admin = require('../model/Admin');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

const isLogin = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {

            // Extract the token from the Authorization header
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using your JWT secret
            // console.log(token);

            const decoded = jwt.verify(token, 'SECURITY_INFORMATION_FOR_SESSION');

            // console.log('Decoded Token:', decoded); // Debugging output

            // Check if the token contains necessary user information
            if (decoded._id) {
                let user;

                if (decoded.isAdmin) {
                    // Fetch the admin if `isAdmin` flag is true
                    user = await Admin.findById(decoded._id);
                    if (!user) {
                        return next(new AppError('Admin not found', 404));
                    }
                } else {
                    // Fetch the user if it's a normal user
                    user = await User.findById(decoded._id);
                    if (!user) {
                        return next(new AppError('User not found', 404));
                    }
                }

                req.user = user; // Attach user or admin object to the request
                next(); // Proceed to the next middleware or route handler
            } else {
                return next(new AppError('Not authorized, token invalid', 403));
            }
        } catch (error) {
            console.error('JWT Verification Error:', error.message); // Log any JWT verification error
            return next(new AppError('Not authorized, token failed', 401));
        }
    } else {
        return next(new AppError('Not authorized, no token', 401)); // No token provided
    }
});

module.exports = {
    isLogin
};
