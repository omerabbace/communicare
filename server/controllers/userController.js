const User = require('../model/Admin');
const AppError = require('../utilities/AppError');
const generateToken = require('../utilities/getToken');

// Get Profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        // Ensure that user exists before returning the profile data
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Return the user object as expected by the frontend
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
            }
        });
    } catch (error) {
        next(new AppError('Failed to load profile', 500));
    }
};


// Update Profile
exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone
                // token: generateToken(updatedUser._id),
            });
        } else {
            next(new AppError('User not found', 404));
        }
    } catch (error) {
        next(new AppError('Failed to update profile', 500));
    }
};


// Change Password Controller
exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const { currentPassword, newPassword } = req.body;

        // Check if the user exists and the current password is correct
        if (!user || !(await user.comparePassword(currentPassword))) {
            return next(new AppError('Current password is incorrect', 400));
        }

        // Assign new password (pre-save middleware will hash it)
        user.password = newPassword;

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'Password changed successfully!',
        });
    } catch (error) {
        next(new AppError('Failed to change password', 500));
    }
};
