const AccidentReport = require('../model/AccidentReport');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const { db } = require('../firebase'); // Import Firebase Admin database

// Report an accident
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
            user: req.user._id
        });

        // Store the accident in Firebase
        const accidentRef = db.ref(`accidents/${accidentReport._id}`);
        await accidentRef.set({
            accidentId: accidentReport._id.toString(),
            phoneNumber,
            accidentSeverity,
            location,
            user: req.user._id.toString(),
            selectedBy: null // Initially, no service provider has selected the accident
        });

        res.status(201).json({
            success: true,
            data: accidentReport
        });
    } catch (error) {
        console.error('Firebase Error:', error);
        throw new AppError('Failed to store accident report in Firebase', 500);
    }
});

// Get all accident reports (for service providers)
const getAllAccidents = asyncHandler(async (req, res) => {
    if (req.user.role !== 'serviceProvider') {
        throw new AppError('Not authorized to view this resource', 403);
    }

    try {
        // Fetch accidents from MongoDB that haven't been selected by a service provider
        const accidents = await AccidentReport.find({
            serviceProvider: null
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

// Select an accident (Service provider claims an accident)
const selectAccident = asyncHandler(async (req, res) => {
    const { accidentId } = req.params;
    const { serviceProviderLocation } = req.body;

    try {
        // Find the accident report in MongoDB
        const accident = await AccidentReport.findById(accidentId);
        if (!accident) {
            throw new AppError('Accident not found', 404);
        }

        if (accident.serviceProvider) {
            throw new AppError('Accident already selected by another service provider', 400);
        }

        // Assign the service provider to the accident
        accident.serviceProvider = req.user._id;
        await accident.save();

        // Update Firebase to mark the accident as selected by the service provider
        const accidentRef = db.ref(`accidents/${accidentId}`);
        await accidentRef.update({
            selectedBy: req.user._id.toString(),
            serviceProviderLocation
        });

        res.status(200).json({
            success: true,
            message: 'Accident selected successfully',
            data: accident // Include the accident data in the response
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

module.exports = {
    reportAccident,
    getAllAccidents,
    selectAccident,
    updateLocation
};
