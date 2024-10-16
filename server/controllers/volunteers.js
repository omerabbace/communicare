// controllers/volunteers.js

const asyncHandler = require('../utilities/CatchAsync');
const User = require('../model/User');
const AppError = require('../utilities/AppError');
const generateToken = require('../utilities/getToken');
const matchPass = require('../utilities/MatchPassword');
const bcrypt = require('bcrypt');

// Register Volunteer
const registerVolunteer = asyncHandler(async (req, res) => {
    const { name, email, password, phone, cnic } = req.body;
    if (!name || !email || !password || !phone || !cnic) {
        throw new AppError("Enter all the required fields", 400);
    }

    const user = await User.findOne({ email });
    if (user) {
        throw new AppError("User Already Registered", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userAccount = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'volunteer',
        cnic
    });

    if (userAccount) {
        res.status(200).json({
            success: true,
            message: 'Volunteer registered successfully',
            user: {
                name: userAccount.name,
                email: userAccount.email,
                role: userAccount.role
            }
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Login Volunteer
const loginVolunteer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userAccount = await User.findOne({ email, role: 'volunteer' });
    if (userAccount) {
        if (await matchPass(password, userAccount.password)) {
            res.status(201).json({
                success: true,
                message: "Login successfully",
                data: {
                    _id: userAccount._id,
                    name: userAccount.name,
                    email: userAccount.email,
                    token: generateToken({ _id: userAccount._id, name: userAccount.name, email: userAccount.email })
                }
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Wrong email or password",
                data: {}
            });
        }
    } else {
        res.status(201).json({
            success: false,
            message: "Account not found",
            data: {}
        });
    }
});

module.exports = {
    registerVolunteer,
    loginVolunteer
};
