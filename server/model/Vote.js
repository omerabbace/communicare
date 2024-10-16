// models/Vote.js
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',  // Reference to Poll model
        required: true
    },
    option: {
        type: String,  // Option text that user voted for
        required: true
    },
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model (assuming you have a User schema)
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Vote', voteSchema);
