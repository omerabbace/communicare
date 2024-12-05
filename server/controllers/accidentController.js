//     const AccidentReport = require('../model/AccidentReport');
//     const asyncHandler = require('../utilities/CatchAsync');
//     const AppError = require('../utilities/AppError');
//     const { db } = require('../firebase'); // Import Firebase Admin database

//     // Report an accident
//     const reportAccident = asyncHandler(async (req, res) => {
//         const { phoneNumber, accidentSeverity, location } = req.body;

//         if (!phoneNumber || !accidentSeverity || !location) {
//             throw new AppError('All fields are required', 400);
//         }

//         try {
//             // Create accident report in MongoDB
//             const accidentReport = await AccidentReport.create({
//                 phoneNumber,
//                 accidentSeverity,
//                 location,
//                 user: req.user._id
//             });

//             // Store the accident in Firebase
//             const accidentRef = db.ref(`accidents/${accidentReport._id}`);
//             await accidentRef.set({
//                 accidentId: accidentReport._id.toString(),
//                 phoneNumber,
//                 accidentSeverity,
//                 location,
//                 user: req.user._id.toString(),
//                 selectedBy: null // Initially, no service provider has selected the accident
//             });

//             res.status(201).json({
//                 success: true,
//                 data: accidentReport
//             });
//         } catch (error) {
//             console.error('Firebase Error:', error);
//             throw new AppError('Failed to store accident report in Firebase', 500);
//         }
//     });

//     // Get all accident reports (for service providers)
//     const getAllAccidents = asyncHandler(async (req, res) => {
//         if (req.user.role !== 'serviceProvider') {
//             throw new AppError('Not authorized to view this resource', 403);
//         }

//         try {
//             // Fetch accidents from MongoDB that haven't been selected by a service provider
//             const accidents = await AccidentReport.find({
//                 serviceProvider: null
//             }).populate('user', 'name phone');

//             res.status(200).json({
//                 success: true,
//                 data: accidents
//             });
//         } catch (error) {
//             console.error('Error in getAllAccidents:', error);
//             throw new AppError('Failed to fetch accidents', 500);
//         }
//     });

//     // Select an accident (Service provider claims an accident)
//     const selectAccident = asyncHandler(async (req, res) => {
//         const { accidentId } = req.params;
//         const { serviceProviderLocation } = req.body;
    
//         try {
//             // Find the accident report in MongoDB
//             const accident = await AccidentReport.findById(accidentId);
//             if (!accident) {
//                 throw new AppError('Accident not found', 404);
//             }
    
//             if (accident.serviceProvider) {
//                 throw new AppError('Accident already selected by another service provider', 400);
//             }
    
//             // Assign the service provider to the accident
//             accident.serviceProvider = req.user._id;
//             await accident.save();
    
//             // Using transaction to update Firebase
//             const accidentRef = db.ref(`accidents/${accidentId}`);
//             await accidentRef.transaction((currentData) => {
//                 if (currentData === null) {
//                     return currentData; // Return null if no data exists (shouldn't happen here)
//                 }
//                 return {
//                     ...currentData,
//                     selectedBy: {
//                         id: req.user._id.toString(),
//                         name: req.user.name,
//                         phoneNumber: req.user.phone
//                     },
//                     serviceProviderLocation
//                 };
//             });
    
//             res.status(200).json({
//                 success: true,
//                 message: 'Accident selected successfully',
//                 data: accident // Include the accident data in the response
//             });
//         } catch (error) {
//             console.error('Error in selectAccident:', error);
//             throw new AppError('Failed to select the accident', 500);
//         }
//     });
    


//     // Update service provider location in real-time
//     const updateLocation = asyncHandler(async (req, res) => {
//         const { location } = req.body;

//         if (!location) {
//             throw new AppError('Location is required', 400);
//         }

//         try {
//             // Update Firebase with the new location
//             const userLocationRef = db.ref(`locations/${req.user._id}`);
//             await userLocationRef.set(location);

//             res.status(200).json({
//                 success: true,
//                 message: 'Location updated successfully',
//             });
//         } catch (error) {
//             console.error('Error in updateLocation:', error);
//             throw new AppError('Failed to update location', 500);
//         }
//     });

//   // Get the accident accepted by the service provider
// const getAcceptedAccident = asyncHandler(async (req, res) => {
//     if (req.user.role !== 'serviceProvider') {
//         throw new AppError('Not authorized to view this resource', 403);
//     }

//     try {
//         // Find the accident report in MongoDB where serviceProvider is the current user
//         const acceptedAccident = await AccidentReport.findOne({
//             serviceProvider: req.user._id,
//         });

//         if (!acceptedAccident) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No accepted accident found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: acceptedAccident,
//         });
//     } catch (error) {
//         console.error('Error in getAcceptedAccident:', error);
//         throw new AppError('Failed to fetch accepted accident', 500);
//     }
// });

// // Notify user when the ride starts
// const startNotification = asyncHandler(async (req, res) => {
//     const { accidentId, serviceProviderId } = req.body;
  
//     const accidentRef = db.ref(`accidents/${accidentId}`);
//     await accidentRef.update({ rideStatus: 'started' });
  
//     // Code to send notification to normal user (if using FCM or another service)
    
//     res.status(200).json({
//       success: true,
//       message: 'Ride started notification sent',
//     });
//   });
  
//   // Notify user when the ride completes
//   const completeNotification = asyncHandler(async (req, res) => {
//     const { accidentId, serviceProviderId } = req.body;
  
//     const accidentRef = db.ref(`accidents/${accidentId}`);
//     await accidentRef.update({ rideStatus: 'completed', completed: true });
  
//     // Code to send notification to normal user
    
//     res.status(200).json({
//       success: true,
//       message: 'Ride completed notification sent',
//     });
//   });

//   // Get accidents completed by the user
//   const getCompletedAccidents = asyncHandler(async (req, res) => {
//     try {
//         // Fetch completed accidents for the current service provider from Firebase
//         const accidentsRef = db.ref('accidents');
//         const snapshot = await accidentsRef
//             .orderByChild('selectedBy/id')
//             .equalTo(req.user._id.toString())
//             .once('value');

//         if (!snapshot.exists()) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No completed accidents found',
//             });
//         }

//         // Filter accidents with 'rideStatus' === 'completed'
//         const completedAccidents = [];
//         snapshot.forEach((childSnapshot) => {
//             const accident = childSnapshot.val();
//             if (accident.rideStatus === 'completed') {
//                 completedAccidents.push({
//                     id: childSnapshot.key,
//                     ...accident,
//                 });
//             }
//         });

//         if (completedAccidents.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No completed accidents found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: completedAccidents,
//         });
//     } catch (error) {
//         console.error('Error in getCompletedAccidents:', error);
//         throw new AppError('Failed to fetch completed accidents from Firebase', 500);
//     }
// });


// module.exports = {
//     reportAccident,
//     getAllAccidents,
//     selectAccident,
//     updateLocation,
//     getAcceptedAccident, 
//     startNotification,
//     completeNotification,
//     getCompletedAccidents
// };
////////////////////
const AccidentReport = require('../model/AccidentReport');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const { db } = require('../firebase'); // Firebase Admin for location updates
const { ref, update,set } = require('firebase/database'); // Import Firebase methods


// Report an accident
// const reportAccident = asyncHandler(async (req, res) => {
//     const { phoneNumber, accidentSeverity, location } = req.body;

//     if (!phoneNumber || !accidentSeverity || !location) {
//         throw new AppError('All fields are required', 400);
//     }

//     try {
//         // Create accident report in MongoDB
//         const accidentReport = await AccidentReport.create({
//             phoneNumber,
//             accidentSeverity,
//             location,
//             user: req.user._id,
//             selectedBy: null, // Initially no service provider is assigned
//         });

//         res.status(201).json({
//             success: true,
//             data: accidentReport
//         });
//     } catch (error) {
//         console.error('Error in reportAccident:', error);
//         throw new AppError('Failed to store accident report in MongoDB', 500);
//     }
// });


const reportAccident = asyncHandler(async (req, res) => {
    const { phoneNumber, accidentSeverity, location } = req.body;

    if (!phoneNumber || !accidentSeverity || !location) {
        throw new AppError('All fields are required', 400);
    }

    try {
        // Create accident report in MongoDB
        const accidentReport = await AccidentReport.create({
            phoneNumber,
            accidentSeverity,
            location,
            user: req.user._id,
        });

        // Use the MongoDB _id as the key in Firebase
        const accidentRef = ref(db, `accidents/${accidentReport._id}`);
        await set(accidentRef, {
            accidentId: accidentReport._id,
            phoneNumber,
            accidentSeverity,
            location,
            user: req.user._id,
            selectedBy: null,
            rideStatus: 'pending',
        });

        res.status(201).json({
            success: true,
            data: accidentReport,
        });
    } catch (error) {
        console.error('Error in reportAccident:', error);
        throw new AppError('Failed to store accident report', 500);
    }
});



// Get all accident reports (for service providers)
const getAllAccidents = asyncHandler(async (req, res) => {
    if (req.user.role !== 'serviceProvider') {
        throw new AppError('Not authorized to view this resource', 403);
    }

    try {
        const accidents = await AccidentReport.find({
            selectedBy: null,
            status: { $nin: ['in-progress', 'completed','canceled'] }
        }).populate('user', 'name phone');

        res.status(200).json({
            success: true,
            data: accidents
        });
    } catch (error) {
        console.error('Error in getAllAccidents:', error);
        throw new AppError('Failed to fetch accidents', 500);
    }
});


// const selectAccident = asyncHandler(async (req, res) => {
//     const { accidentId } = req.params; // ID of the accident
//     const { serviceProviderLocation } = req.body; // Location of the service provider

//     if (!serviceProviderLocation) {
//         throw new AppError('Service provider location is required', 400);
//     }

//     try {
//         const accident = await AccidentReport.findById(accidentId);
//         if (!accident) {
//             throw new AppError('Accident not found', 404);
//         }

//         if (accident.serviceProvider) {
//             throw new AppError('Accident already selected by another service provider', 400);
//         }

//         // Update the accident with the service provider details
//         accident.serviceProvider = req.user._id;
//         accident.serviceProviderDetails = {
//             name: req.user.name,
//             phoneNumber: req.user.phone,
//         };
//         accident.serviceProviderLocation = serviceProviderLocation;
//         accident.status = 'in-progress';
//         await accident.save();

//         res.status(200).json({
//             success: true,
//             message: 'Accident selected successfully',
//             data: accident,
//         });
//     } catch (error) {
//         console.error('Error in selectAccident:', error);
//         throw new AppError('Failed to select the accident', 500);
//     }
// });


// const selectAccident = asyncHandler(async (req, res) => {
//     const { accidentId } = req.params; // MongoDB ID of the accident
//     const { serviceProviderLocation } = req.body; // Location of the service provider

//     if (!serviceProviderLocation) {
//         throw new AppError('Service provider location is required', 400);
//     }

//     try {
//         // Find the accident in MongoDB
//         const accident = await AccidentReport.findById(accidentId);
//         if (!accident) {
//             throw new AppError('Accident not found', 404);
//         }
//         // Check if the accident is already canceled
//         if (accident.status === 'canceled') {
//             throw new AppError('Cannot select a canceled accident', 400);
//         }

//         // Check if the accident is already assigned to another service provider
//         if (accident.serviceProvider) {
//             throw new AppError('Accident already selected by another service provider', 400);
//         }

//         // Update the accident details in MongoDB
//         accident.serviceProvider = req.user._id;
//         accident.serviceProviderDetails = {
//             name: req.user.name,
//             phoneNumber: req.user.phone,
//         };
//         accident.serviceProviderLocation = serviceProviderLocation;
//         accident.status = 'in-progress';
//         await accident.save();

//         // Update the accident details in Firebase using MongoDB ID as the key
//         const accidentRef = ref(db, `accidents/${accidentId}`);
//         await update(accidentRef, {
//             serviceProvider: req.user._id,
//             serviceProviderDetails: {
//                 name: req.user.name,
//                 phoneNumber: req.user.phone,
//             },
//             serviceProviderLocation,
//             status: 'in-progress',
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Accident selected successfully',
//             data: accident,
//         });
//     } catch (error) {
//         console.error('Error in selectAccident:', error);
//         throw new AppError('Failed to select the accident', 500);
//     }
// });

const selectAccident = asyncHandler(async (req, res) => {
    const { accidentId } = req.params; // MongoDB ID of the accident
    const { serviceProviderLocation } = req.body; // Location of the service provider

    if (!serviceProviderLocation) {
        throw new AppError('Service provider location is required', 400);
    }

    try {
        // Check if the service provider already has an active accident
        const activeAccident = await AccidentReport.findOne({
            serviceProvider: req.user._id,
            status: { $in: ['in-progress', 'pending'] }, // Check for active statuses
        });

        if (activeAccident) {
            throw new AppError(
                'You already have an active accident. Complete or cancel it before selecting another.',
                400
            );
        }

        // Find the accident in MongoDB
        const accident = await AccidentReport.findById(accidentId);
        if (!accident) {
            throw new AppError('Accident not found', 404);
        }

        // Check if the accident is already canceled
        if (accident.status === 'canceled') {
            throw new AppError('Cannot select a canceled accident', 400);
        }

        // Check if the accident is already assigned to another service provider
        if (accident.serviceProvider) {
            throw new AppError('Accident already selected by another service provider', 400);
        }

        // Update the accident details in MongoDB
        accident.serviceProvider = req.user._id;
        accident.serviceProviderDetails = {
            name: req.user.name,
            phoneNumber: req.user.phone,
        };
        accident.serviceProviderLocation = serviceProviderLocation;
        accident.status = 'in-progress';
        await accident.save();

        // Update the accident details in Firebase using MongoDB ID as the key
        const accidentRef = ref(db, `accidents/${accidentId}`);
        await update(accidentRef, {
            serviceProvider: req.user._id,
            serviceProviderDetails: {
                name: req.user.name,
                phoneNumber: req.user.phone,
            },
            serviceProviderLocation,
            status: 'in-progress',
        });

        res.status(200).json({
            success: true,
            message: 'Accident selected successfully',
            data: accident,
        });
    } catch (error) {
        console.error('Error in selectAccident:', error);
        throw new AppError('Failed to select the accident', 500);
    }
});


// Update service provider location in real-time
const updateLocation = asyncHandler(async (req, res) => {
    const { location } = req.body;

    if (!location) {
        throw new AppError('Location is required', 400);
    }

    try {
        // Update Firebase with the new location
        const userLocationRef = db.ref(`locations/${req.user._id}`);
        await userLocationRef.set(location);

        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
        });
    } catch (error) {
        console.error('Error in updateLocation:', error);
        throw new AppError('Failed to update location', 500);
    }
});

// Get the accident accepted by the service provider
const getAcceptedAccident = asyncHandler(async (req, res) => {
    if (req.user.role !== 'serviceProvider') {
        throw new AppError('Not authorized to view this resource', 403);
    }

    try {
        const acceptedAccident = await AccidentReport.findOne({
            'selectedBy.id': req.user._id
        });

        if (!acceptedAccident) {
            return res.status(404).json({
                success: false,
                message: 'No accepted accident found',
            });
        }
        // Check if the accident is already canceled
        if (accident.status === 'canceled') {
            throw new AppError('Cannot select a canceled accident', 400);
        }

        

        res.status(200).json({
            success: true,
            data: acceptedAccident,
        });
    } catch (error) {
        console.error('Error in getAcceptedAccident:', error);
        throw new AppError('Failed to fetch accepted accident', 500);
    }
});

// Notify user when the ride starts
const startNotification = asyncHandler(async (req, res) => {
    const { accidentId } = req.body;

    try {
        const accident = await AccidentReport.findById(accidentId);
        if (!accident) {
            throw new AppError('Accident not found', 404);
        }

        accident.rideStatus = 'started';
        await accident.save();

        res.status(200).json({
            success: true,
            message: 'Ride started notification sent',
        });
    } catch (error) {
        console.error('Error in startNotification:', error);
        throw new AppError('Failed to send ride start notification', 500);
    }
});

// Notify user when the ride completes
const completeNotification = asyncHandler(async (req, res) => {
    const { accidentId } = req.body;

    try {
        const accident = await AccidentReport.findById(accidentId);
        if (!accident) {
            throw new AppError('Accident not found', 404);
        }

        accident.rideStatus = 'completed';
        accident.completed = true;
        await accident.save();

        res.status(200).json({
            success: true,
            message: 'Ride completed notification sent',
        });
    } catch (error) {
        console.error('Error in completeNotification:', error);
        throw new AppError('Failed to send ride complete notification', 500);
    }
});

// Get accidents completed by the user
const getCompletedAccidents = asyncHandler(async (req, res) => {
    try {
        const completedAccidents = await AccidentReport.find({
            serviceProvider: req.user._id,
            status: 'completed'
        });

        if (!completedAccidents.length) {
            return res.status(404).json({
                success: false,
                message: 'No completed accidents found',
            });
        }

        res.status(200).json({
            success: true,
            data: completedAccidents,
        });
    } catch (error) {
        console.error('Error in getCompletedAccidents:', error);
        throw new AppError('Failed to fetch completed accidents', 500);
    }
});


// Fetch accepted accidents for a service provider
const getAcceptedAccidents = asyncHandler(async (req, res) => {
    const { _id: serviceProviderId } = req.user;

    try {
        // Fetch accidents accepted by the logged-in service provider
        const accidents = await AccidentReport.find({
            serviceProvider: serviceProviderId, // Match the serviceProvider field
            status: { $in: ['accepted', 'in-progress'] }, // Exclude completed reports
        }).populate('user', 'name phoneNumber'); // Populate user details

        res.status(200).json({
            success: true,
            data: accidents,
        });
    } catch (error) {
        console.error('Error fetching accepted accidents:', error);
        throw new AppError('Failed to load accepted accidents.', 500);
    }
});


// Start ride for an accident
// const startRide = asyncHandler(async (req, res) => {
//     const { accidentId } = req.params;
//     const { _id: serviceProviderId } = req.user; // Get service provider ID from the logged-in user

//     try {
//         // Find the accident where the service provider matches and rideStatus is not already started
//         const accident = await AccidentReport.findOne({
//             _id: accidentId,
//             serviceProvider: serviceProviderId,
//         });

//         if (!accident) {
//             throw new AppError('Accident not found or not assigned to you.', 404);
//         }

//         // Update ride status
//         accident.status = 'in-progress'; // Update accident status to in-progress
//         accident.rideStatus = 'started';
//         await accident.save();

//         res.status(200).json({
//             success: true,
//             message: 'Ride started successfully.',
//         });
//     } catch (error) {
//         console.error('Error starting ride:', error);
//         throw new AppError('Failed to start ride.', 500);
//     }
// });


const startRide = asyncHandler(async (req, res) => {
    const { accidentId } = req.params;
    const { _id: serviceProviderId } = req.user; // Get service provider ID from the logged-in user

    try {
        // Find the accident where the service provider matches and rideStatus is not already started
        const accident = await AccidentReport.findOne({
            _id: accidentId,
            serviceProvider: serviceProviderId,
        });

        if (!accident) {
            throw new AppError('Accident not found or not assigned to you.', 404);
        }

        // Update ride status in MongoDB
        accident.status = 'in-progress'; // Update accident status to in-progress
        accident.rideStatus = 'started';
        await accident.save();

        // Update ride status in Firebase
        const accidentRef = ref(db, `accidents/${accidentId}`);
        await update(accidentRef, {
            rideStatus: 'started',
            status: 'in-progress',
        });

        res.status(200).json({
            success: true,
            message: 'Ride started successfully.',
        });
    } catch (error) {
        console.error('Error starting ride:', error);
        throw new AppError('Failed to start ride.', 500);
    }
});

// Complete ride for an accident
// const completeRide = asyncHandler(async (req, res) => {
//     const { accidentId } = req.params;
//     const { _id: serviceProviderId } = req.user;

//     try {
//         const accident = await AccidentReport.findOne({
//             _id: accidentId,
//             serviceProvider: serviceProviderId,
//         });

//         if (!accident) {
//             throw new AppError('Accident not found or not assigned to you.', 404);
//         }

//         accident.status = 'completed';
//         accident.completed = true;
//         await accident.save();

//         res.status(200).json({
//             success: true,
//             message: 'Ride completed successfully.',
//         });
//     } catch (error) {
//         console.error('Error completing ride:', error);
//         throw new AppError('Failed to complete ride.', 500);
//     }
// });


const completeRide = asyncHandler(async (req, res) => {
    const { accidentId } = req.params;
    const { _id: serviceProviderId } = req.user;

    try {
        // Find the accident where the service provider matches and the ride is in-progress
        const accident = await AccidentReport.findOne({
            _id: accidentId,
            serviceProvider: serviceProviderId,
        });

        if (!accident) {
            throw new AppError('Accident not found or not assigned to you.', 404);
        }

        // Update ride status in MongoDB
        accident.status = 'completed';
        accident.completed = true;
        accident.rideStatus = 'completed'; // Explicitly set rideStatus
        await accident.save();

        // Update ride status in Firebase
        const accidentRef = ref(db, `accidents/${accidentId}`);
        await update(accidentRef, {
            rideStatus: 'completed',
            status: 'completed',
        });

        res.status(200).json({
            success: true,
            message: 'Ride completed successfully.',
        });
    } catch (error) {
        console.error('Error completing ride:', error);
        throw new AppError('Failed to complete ride.', 500);
    }
});

// const cancelAccident = asyncHandler(async (req, res) => {
//     const { accidentId } = req.params;
//     const { _id: userId, role } = req.user;

//     try {
//         // Check if the user has the right to cancel the accident report
//         const accident = await AccidentReport.findOne({ _id: accidentId });

//         if (!accident) {
//             throw new AppError('Accident report not found.', 404);
//         }

//         // Only allow the user who created the report or an admin to cancel it
//         if (role !== 'admin' && accident.user.toString() !== userId.toString()) {
//             throw new AppError('Not authorized to cancel this accident report.', 403);
//         }

//         // Delete accident report from MongoDB
//         await AccidentReport.deleteOne({ _id: accidentId });

//         // Remove the accident from Firebase
//         const accidentRef = ref(db, `accidents/${accidentId}`);
//         await update(accidentRef, null);

//         res.status(200).json({
//             success: true,
//             message: 'Accident report canceled successfully.',
//         });
//     } catch (error) {
//         console.error('Error canceling accident report:', error);
//         throw new AppError('Failed to cancel accident report.', 500);
//     }
// });
const cancelAccident = asyncHandler(async (req, res) => {
    const { accidentId } = req.params;
    const { _id: userId } = req.user;

    try {
        // console.log(accidentId);
        // Check if the accident report exists
        const accident = await AccidentReport.findById(accidentId);
        // console.log(accident);
        if (!accident) {
            throw new AppError('Accident report not found.', 404);
        }

        // Ensure only the creator or an admin can cancel the accident
        if ( accident.user.toString() !== userId.toString()) {
            throw new AppError('Not authorized to cancel this accident report.', 403);
        }

        // Update the status to "canceled" in MongoDB
        accident.status = 'canceled';
        await accident.save();

        // Update the status in Firebase
        const accidentRef = ref(db, `accidents/${accidentId}`);
        await update(accidentRef, { status: 'canceled' });

        res.status(200).json({
            success: true,
            message: 'Accident report canceled successfully.',
            data: accident,
        });
    } catch (error) {
        console.error('Error canceling accident report:', error);
        throw new AppError('Failed to cancel accident report.', 500);
    }
});

const getAccidentStatistics = asyncHandler(async (req, res) => {
    try {
        const { _id: serviceProviderId, role } = req.user;

        if (role !== 'serviceProvider' && role !== 'admin') {
            throw new AppError('Not authorized to view these statistics.', 403);
        }

        // Get the number of completed accidents by the service provider
        const completedAccidents = await AccidentReport.countDocuments({
            serviceProvider: serviceProviderId,
            status: 'completed',
        });

        // Get the total number of accidents reported
        const totalAccidents = await AccidentReport.countDocuments({
            status: { $nin: ['canceled'] }, // Exclude canceled accidents
        });

        // Get the number of ongoing rides
        const ongoingRides = await AccidentReport.countDocuments({
            status: 'in-progress',
        });

        res.status(200).json({
            success: true,
            data: {
                completedAccidents,
                totalAccidents,
                ongoingRides,
            },
        });
    } catch (error) {
        console.error('Error fetching accident statistics:', error);
        throw new AppError('Failed to fetch accident statistics.', 500);
    }
});

module.exports = {
    reportAccident,
    getAllAccidents,
    selectAccident,
    updateLocation,
    getAcceptedAccident,
    startNotification,
    completeNotification,
    getCompletedAccidents,
    getAcceptedAccidents,
    startRide,
    completeRide,
    cancelAccident,
    getAccidentStatistics
};

///

