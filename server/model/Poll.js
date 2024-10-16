const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Poll name is required"]
    },
    options: [
        {
            optionText: { type: String, required: true },
            votes: { type: Number, default: 0 }
        }
    ],
    startDate: {
        type: Date,
        required: [true, "Poll start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "Poll end date is required"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',  // Referencing Admin Model
        required: true
    },
    disableVotes: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);
