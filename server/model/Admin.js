const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should be at least 6 characters long"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{11}$/, "Please enter a valid 11-digit phone number"] 
    },
    isAdmin: {
        type: Boolean,
        default: true // Set to true for admin by default
    },
   
});


// Middleware to hash password before saving the admin
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
