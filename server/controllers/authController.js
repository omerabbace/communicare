//authcontroller
const Admin = require('../model/Admin');
const generateToken = require('../utilities/getToken');
const AppError = require('../utilities/AppError');

// Registration
// Registration
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return next(new AppError('Admin already exists', 400));
        }

        admin = new Admin({
            name,
            email,
            password,
            phone, // Store the phone number
            isAdmin: true // Set isAdmin to true for admin users
        });

        await admin.save();

        const token = generateToken({ _id: admin._id, isAdmin: admin.isAdmin });
        res.status(201).json({ token, admin: { name: admin.name, email: admin.email, phone: admin.phone, isAdmin: admin.isAdmin } });
    } catch (error) {
        console.error(error); 
        next(new AppError(error.message, 500));
    }
};


// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return next(new AppError('Invalid email or password', 401));
        }

        const token = generateToken({ _id: admin._id, isAdmin: admin.isAdmin });
        console.log(token);
        res.status(200).json({ token, admin: { name: admin.name, email: admin.email, isAdmin: admin.isAdmin } });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
};
