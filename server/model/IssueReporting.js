const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Normal user reporting the issue
    },
    issueType: {
        type: String,
        required: true // The selected issue type
    },
    description: {
        type: String,
        required: true // Description of the issue
    },
    media: [{
        type: {
            type: String, // Type of media (image, video, etc.)
            required: true
        },
        uri: {
            type: String, // URI for the media
            required: true
        },
        name: {
            type: String,
            required: true // Description of the issue
        },
    }],
    location: {
        latitude: {
            type: Number,
            required: true // Latitude
        },
        longitude: {
            type: Number,
            required: true // Longitude
        }
    },
    requiredVolunteers: {
        type: Number, // Admin selects the number of required volunteers
        default: 0,
      },
    assignedVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // First volunteer who accepts the task
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending'
    },
    progressUpdates: [{
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Volunteers or leader who provide progress
        },
        description: String,
        media: [String], // URLs for progress media (images/videos)
        date: { type: Date, default: Date.now }
    }],
    completionReport: {
        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Leader who reports task completion
        },
        description: String,
        media: [String], // URLs for completion media
        date: { type: Date, default: Date.now }
    }
}, { timestamps: true });

module.exports = mongoose.model('ReportedIssue', issueSchema);



// const mongoose = require('mongoose');

// const issueSchema = new mongoose.Schema({
//     reportedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true // Normal user reporting the issue
//     },
//     issueType: {
//         type: String,
//         required: true // The selected issue type
//     },
//     description: {
//         type: String,
//         required: true // Description of the issue
//     },
//     media: [{
//         type: {
//             type: String, // Type of media (image, video, etc.)
//             required: true
//         },
//         uri: {
//             type: String, // URI for the media
//             required: true
//         }
//     }],
//     location: {
//         latitude: {
//             type: Number,
//             required: true // Latitude
//         },
//         longitude: {
//             type: Number,
//             required: true // Longitude
//         }
//     },
//     requiredVolunteers: {
//         type: Number, // Admin selects the number of required volunteers
//         default: 0,
//     },
//     assignedVolunteers: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     leader: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User', // First volunteer who accepts the task
//         default: null
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'in progress', 'completed', 'rejected'], // Issue status
//         default: 'pending'
//     },
//     subTasks: [{
//         assignedTo: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User', // Volunteer assigned the sub-task
//             required: true
//         },
//         description: {
//             type: String, // Sub-task description
//             required: true
//         },
//         media: [String], // URLs for sub-task media (images/videos)
//         status: {
//             type: String,
//             enum: ['pending', 'in progress', 'completed'], // Sub-task status
//             default: 'pending'
//         },
//         progressUpdates: [{
//             updatedBy: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User', // Volunteer providing the update
//                 required: true
//             },
//             description: {
//                 type: String, // Update description
//                 required: true
//             },
//             media: [String], // Update media (optional)
//             date: { type: Date, default: Date.now } // Update date
//         }]
//     }],
//     progressUpdates: [{
//         updatedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User' // Volunteers or leader who provide progress
//         },
//         description: String,
//         media: [String], // URLs for progress media (images/videos)
//         date: { type: Date, default: Date.now }
//     }],
//     completionReport: {
//         completedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User' // Leader who reports task completion
//         },
//         description: String,
//         media: [String], // URLs for completion media
//         date: { type: Date, default: Date.now }
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('ReportedIssue', issueSchema);
