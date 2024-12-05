const mongoose = require('mongoose');

const accidentReportSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    accidentSeverity: {
        type: String,
        required: true,
        enum: ['major', 'minor']
    },
    location: {
        latitude: { type: String, required: true },
        longitude: { type: String, required: true }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null  // Null means the accident is not yet selected by any service provider
    },
    serviceProviderDetails: {
        name: { type: String, default: null },  // Service provider's name
        phoneNumber: { type: String, default: null },  // Service provider's phone number
    },
    serviceProviderLocation: {
        latitude: { type: String, default: null },  // Service provider's latitude
        longitude: { type: String, default: null },  // Service provider's longitude
    },
    status: {
        type: String,
        enum: ['pending','canceled', 'accepted', 'in-progress', 'completed'],
        default: 'pending'  // Status of the accident report
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const AccidentReport = mongoose.model('AccidentReport', accidentReportSchema);
module.exports = AccidentReport;
