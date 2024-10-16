const mongoose = require('mongoose');

const charityProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    progress: {
        type: Number,
        default: 0, // Progress as a percentage (0 to 1)
        min: [0, 'Progress cannot be less than 0'],
        max: [100, 'Progress cannot be more than 1']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    disabled: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('CharityProject', charityProjectSchema);
