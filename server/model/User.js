
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true // Ensure the email is unique
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['normal', 'volunteer', 'serviceProvider'],
            default: 'normal'
        },
        cnic: {
            type: String,
            required: function() { return this.role !== 'normal'; } // CNIC is required for volunteers and service providers
        },
        serviceCategory: {
            type: String,
            enum: ['accidentManagement', 'vehicleAssistance'],
            required: function() { return this.role === 'serviceProvider'; }
        },
        isActive: {
            type: Boolean,
            default: true // Active by default; set to false if user deletes account
        },
        fcmToken: {  // Update this to store FCM token
            type: String,
            default: null
        },
        isAccepted: {
            type: Boolean,
            default: function() { return this.role === 'normal'; } // Auto-accepted for normal users; requires admin approval for others
        }
    },
    { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
