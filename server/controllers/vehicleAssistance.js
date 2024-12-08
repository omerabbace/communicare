// const asyncHandler = require('../utilities/CatchAsync');
// const AppError = require('../utilities/AppError');
// const { db } = require('../firebase'); // Import Firebase Admin database

// // Report Vehicle Issue
// const reportVehicleIssue = asyncHandler(async (req, res) => {
//     const { userId, name, phone, email, vehicleRegNo, confirmRegNo, issueDescription, location } = req.body;

//     if (!userId || !name || !phone || !email || !vehicleRegNo || !confirmRegNo || !issueDescription || !location) {
//         throw new AppError('All fields are required', 400);
//     }

//     // Create a new vehicle issue report in Firebase
//     const newReportRef = db.ref("vehicle_assistance").push();
//     const requestId = newReportRef.key;

//     await newReportRef.set({
//         userId,
//         name,
//         phone,
//         email,
//         vehicleRegNo,
//         confirmRegNo,
//         issueDescription,
//         location,
//         status: "pending",
//     });

//     res.status(201).json({
//         success: true,
//         requestId
//     });
// });

// // Get All Vehicle Reports for Service Provider
// const getVehicleReports = asyncHandler(async (req, res) => {
//     if (req.user.role !== 'serviceProvider') {
//         throw new AppError('Not authorized to view this resource', 403);
//     }

//     const snapshot = await db.ref("vehicle_assistance").once("value");
//     const reports = snapshot.val();

//     res.status(200).json({
//         success: true,
//         data: reports
//     });
// });

// // Select Vehicle Report (Service Provider)
// const selectVehicleReport = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { serviceProviderId } = req.body;

//     await db.ref(`vehicle_assistance/${requestId}`).update({
//         status: "accepted",
//         serviceProviderId,
//     });

//     res.status(200).json({
//         success: true,
//         message: 'Vehicle report selected successfully'
//     });
// });

// // Set Price for Repair (Service Provider)
// const setRepairPrice = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { price } = req.body;

//     await db.ref(`vehicle_assistance/${requestId}`).update({
//         price,
//     });

//     res.status(200).json({
//         success: true,
//         message: 'Price set successfully'
//     });
// });

// // Accept Price (User)
// const acceptRepairPrice = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;

//     await db.ref(`vehicle_assistance/${requestId}`).update({
//         status: "completed",
//     });

//     res.status(200).json({
//         success: true,
//         message: 'Repair price accepted'
//     });
// });

// module.exports = {
//     reportVehicleIssue,
//     getVehicleReports,
//     selectVehicleReport,
//     setRepairPrice,
//     acceptRepairPrice,
// };
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const User = require('../model/User');
const { db } = require('../firebase'); // Firebase Admin database
const Notification = require('../model/Notification');

// Report Vehicle Issue
const reportVehicleIssue = asyncHandler(async (req, res) => {
    const { userId, name, phone, email, vehicleRegNo, confirmRegNo, issueDescription, location } = req.body;

    if (!userId || !name || !phone || !email || !vehicleRegNo || !confirmRegNo || !issueDescription || !location) {
        throw new AppError('All fields are required', 400);
    }

    // Create a new vehicle issue report in Firebase
    const newReportRef = db.ref("vehicle_assistance").push();
    const requestId = newReportRef.key;

    await newReportRef.set({
        userId,
        name,
        phone,
        email,
        vehicleRegNo,
        confirmRegNo,
        issueDescription,
        location,
        status: "pending", // Initial status
        userCanceled: false,
        createdAt: Date.now(),
    });

    res.status(201).json({
        success: true,
        requestId
    });
}); 

// Get All Vehicle Reports for Service Provider
const getVehicleReports = asyncHandler(async (req, res) => {
    if (req.user.role !== 'serviceProvider') {
        throw new AppError('Not authorized to view this resource', 403);
    }

    const { _id: serviceProviderId } = req.user;
    // console.log(serviceProviderId);
    const snapshot = await db.ref("vehicle_assistance").once("value");
    const reports = snapshot.val();

    // Filter reports
    const filteredReports = Object.entries(reports || {}).reduce((acc, [key, value]) => {
        if (value.status === 'pending' || value.serviceProviderId == serviceProviderId) {
            acc[key] = value;
        }
        // console.log(value.serviceProviderId == serviceProviderId);

        return acc;
    }, {});

    res.status(200).json({
        success: true,
        data: filteredReports
    });
});


// Check if request is not canceled before selection and update status if valid
// const selectVehicleReport = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { serviceProviderId } = req.body;
//     // console.log(serviceProviderId);
//     try {
//         const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
//         const request = snapshot.val();

//         if (!request) {
//             return res.status(404).json({ success: false, message: 'Request not found' });
//         }

//         if (request.userCanceled) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Cannot select this request as it has been canceled by the user',
//             });
//         }

//         // Update status to accepted if not canceled
//         await db.ref(`vehicle_assistance/${requestId}`).update({
//             status: "accepted",
//             serviceProviderId,
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Vehicle report selected successfully',
//         });
//     } catch (error) {
//         console.error('Error in selectVehicleReport:', error);
//         res.status(500).json({ success: false, message: 'Failed to select vehicle report' });
//     }
// });

// const selectVehicleReport = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;
//     const { serviceProviderId } = req.body;

//     try {
//         // Check if the service provider already has an active request
//         const snapshot = await db.ref("vehicle_assistance").once("value");
//         const reports = snapshot.val();

//         const activeRequest = Object.entries(reports || {}).find(([key, value]) => 
//             value.serviceProviderId === serviceProviderId && 
//             value.status !== "completed" &&
//             value.status !== "canceled"  &&
//             value.status !== "pending" 
//         );
//         console.log("Active Request:", activeRequest);

//         if (activeRequest) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'You already have an active request. Complete it before accepting a new one.',
//             });
//         }

//         // Fetch the current request to ensure it is "pending"
//         const requestSnapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
//         const request = requestSnapshot.val();

//         if (!request) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Request not found",
//             });
//         }

//         if (request.status !== "pending") {
//             return res.status(400).json({
//                 success: false,
//                 message: "This request is no longer available for acceptance.",
//             });
//         }

//         // Update the request to "accepted" and assign the service provider
//         await db.ref(`vehicle_assistance/${requestId}`).update({
//             status: "accepted",
//             serviceProviderId,
//         });

//         res.status(200).json({
//             success: true,
//             message: "Request accepted successfully",
//         });
//     } catch (error) {
//         console.error("Error in restrictToOneRequest:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to accept request",
//         });
//     }
// });

const selectVehicleReport = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { serviceProviderId } = req.body;

  try {
    // Check if the service provider already has an active request
    const snapshot = await db.ref("vehicle_assistance").once("value");
    const reports = snapshot.val();

    const activeRequest = Object.entries(reports || {}).find(
      ([key, value]) =>
        value.serviceProviderId === serviceProviderId &&
        value.status !== "completed" &&
        value.status !== "canceled" &&
        value.status !== "pending"
    );
    console.log("Active Request:", activeRequest);

    if (activeRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have an active request. Complete it before accepting a new one.",
      });
    }

    // Fetch the current request to ensure it is "pending"
    const requestSnapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = requestSnapshot.val();

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request is no longer available for acceptance.",
      });
    }

    // Update the request to "accepted" and assign the service provider
    await db.ref(`vehicle_assistance/${requestId}`).update({
      status: "accepted",
      serviceProviderId,
    });

    // Create an in-app notification for the user who reported the vehicle assistance request
    if (request.userId) {
      await Notification.create({
        userId: request.userId, // Assuming `userId` is stored in the request object
        title: "Request Accepted",
        body: `Your vehicle assistance request has been accepted by a service provider.`,
        isRead: false, // Mark as unread
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
    });
  } catch (error) {
    console.error("Error in selectVehicleReport:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept request",
    });
  }
});



// Check if the service provider has an active request
const checkActiveRequest = asyncHandler(async (req, res) => {
    const { _id: serviceProviderId } = req.user; // Assuming `req.user` contains the authenticated user's info

    try {
        // Fetch all vehicle assistance reports
        const snapshot = await db.ref("vehicle_assistance").once("value");
        const reports = snapshot.val();

        // Check for active requests assigned to this service provider
        const hasActiveRequest = Object.values(reports || {}).some(
            (report) =>
                report.serviceProviderId === serviceProviderId &&
                report.status !== "completed" &&
                report.status !== "canceled" &&
                report.status !== "pending"
        );
        console.log("Backend hasActiveRequest:", hasActiveRequest);

        res.status(200).json({
            success: true,
            hasActiveRequest,
        });
    } catch (error) {
        console.error("Error checking active request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check active request",
        });
    }
});



const getRequestDetails = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    // console.log(requestId);
    try {
        // Fetch request data from Firebase
        const requestSnapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
        const requestData = requestSnapshot.val();
        console.log("Fetched Request Data:", requestData);
        if (!requestData) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Check if the request status is "accepted" and a service provider has accepted the request
        if (requestData.status !== "accepted" && requestData.status !== "pending approval" || !requestData.serviceProviderId) {
            return res.status(400).json({ 
                success: false, 
                message: "This request has not been accepted by any service provider yet" 
            });
        }

        // Fetch service provider details from MongoDB using Mongoose
        const serviceProviderData = await User.findById(requestData.serviceProviderId);

        if (!serviceProviderData) {
            return res.status(404).json({ 
                success: false, 
                message: "Service provider not found" 
            });
        }

        // Return both service provider and vehicle details
        res.status(200).json({
            success: true,
            request: {
                vehicleRegNo: requestData.vehicleRegNo,
                confirmRegNo: requestData.confirmRegNo,
                issueDescription: requestData.issueDescription,
                location: requestData.location,
                status: requestData.status,
                createdAt: requestData.createdAt,
            },
            serviceProvider: {
                id: serviceProviderData._id,
                name: serviceProviderData.name,
                phone: serviceProviderData.phone,
                email: serviceProviderData.email,
                role: serviceProviderData.role,
                serviceCategory: serviceProviderData.serviceCategory,
                // Add other relevant fields as needed
            }
        });
    } catch (error) {
        console.error('Error fetching request details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch request details' });
    }
});



// const cancelVehicleRequest = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;

//     try {
//         // Check if the request exists
//         const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
//         const request = snapshot.val();

//         if (!request) {
//             return res.status(404).json({ success: false, message: 'Request not found' });
//         }

//         // Update the status to "canceled" and set userCanceled to true
//         await db.ref(`vehicle_assistance/${requestId}`).update({
//             status: "canceled",
//             userCanceled: true,
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Vehicle request canceled successfully',
//         });
//     } catch (error) {
//         console.error('Error in cancelVehicleRequest:', error);
//         res.status(500).json({ success: false, message: 'Failed to cancel vehicle request' });
//     }
// });


const cancelVehicleRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  try {
    // Check if the request exists
    const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = snapshot.val();

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Update the status to "canceled" and set userCanceled to true
    await db.ref(`vehicle_assistance/${requestId}`).update({
      status: "canceled",
      userCanceled: true,
    });

    // Create an in-app notification for the service provider (if assigned)
    if (request.serviceProviderId) {
      await Notification.create({
        userId: request.serviceProviderId, // Notify the service provider
        title: "Request Canceled",
        body: `The vehicle assistance request "${request.confirmRegNo}" has been canceled by the user.`,
        isRead: false, // Mark as unread by default
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle request canceled successfully',
    });
  } catch (error) {
    console.error('Error in cancelVehicleRequest:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel vehicle request' });
  }
});



// Set Price for Repair (Service Provider)
const setRepairPrice = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { price , status} = req.body;

    const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = snapshot.val();

    if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.userCanceled) {
        return res.status(400).json({
            success: false,
            message: 'Cannot set price as the request has been canceled by the user',
        });
    }

    await db.ref(`vehicle_assistance/${requestId}`).update({
        price,
        // status: "accepted",
        status,
    });

    res.status(200).json({
        success: true,
        message: 'Price set successfully',
    });
});

// Accept Price (User)
// // Accept Price (User)
// const acceptRepairPrice = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;

//     const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
//     const request = snapshot.val();

//     if (!request) {
//         return res.status(404).json({ success: false, message: 'Request not found' });
//     }

//     if (request.userCanceled) {
//         return res.status(400).json({
//             success: false,
//             message: 'Cannot accept the price as the request has been canceled by the user',
//         });
//     }

//     if (!request.price) {
//         return res.status(400).json({
//             success: false,
//             message: 'No price has been set for this request',
//         });
//     }

//     if (request.isPriceAccepted) {
//         return res.status(400).json({
//             success: false,
//             message: 'Price has already been accepted by the user',
//         });
//     }

//     await db.ref(`vehicle_assistance/${requestId}`).update({
//         isPriceAccepted: true,
//         status: "approved",
//     });

//     res.status(200).json({
//         success: true,
//         message: 'Repair price accepted. Work status set to in-progress.',
//     });
// });


const acceptRepairPrice = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  try {
    // Retrieve the request from Firebase
    const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = snapshot.val();

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.userCanceled) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept the price as the request has been canceled by the user',
      });
    }

    if (!request.price) {
      return res.status(400).json({
        success: false,
        message: 'No price has been set for this request',
      });
    }

    if (request.isPriceAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Price has already been accepted by the user',
      });
    }

    // Update the request to indicate price acceptance
    await db.ref(`vehicle_assistance/${requestId}`).update({
      isPriceAccepted: true,
      status: "approved",
    });

    // Notify the service provider (if assigned) about the price acceptance
    if (request.serviceProviderId) {
      await Notification.create({
        userId: request.serviceProviderId, // Notify the service provider
        title: "Price Accepted",
        body: `The repair price for request "${request.confirmRegNo}" has been accepted by the user. Work status is now approved.`,
        isRead: false, // Mark as unread by default
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Repair price accepted. Work status set to approved.',
    });
  } catch (error) {
    console.error('Error in acceptRepairPrice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept repair price',
    });
  }
});




// Start Work (Service Provider)
const startWork = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = snapshot.val();

    if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.userCanceled) {
        return res.status(400).json({
            success: false,
            message: 'Cannot start work as the request has been canceled by the user',
        });
    }

    await db.ref(`vehicle_assistance/${requestId}`).update({
        status: "work-started",
    });

    res.status(200).json({
        success: true,
        message: 'Work started successfully',
    });
});


// // Complete Work (Service Provider)
// const completeWork = asyncHandler(async (req, res) => {
//     const { requestId } = req.params;

//     const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
//     const request = snapshot.val();

//     if (!request) {
//         return res.status(404).json({ success: false, message: 'Request not found' });
//     }

//     if (request.userCanceled) {
//         return res.status(400).json({
//             success: false,
//             message: 'Cannot complete work as the request has been canceled by the user',
//         });
//     }

//     await db.ref(`vehicle_assistance/${requestId}`).update({
//         status: "completed",
//         completedAt: Date.now(),
//     });

//     res.status(200).json({
//         success: true,
//         message: 'Work completed successfully',
//     });
// });



const completeWork = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  try {
    // Retrieve the request from Firebase
    const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
    const request = snapshot.val();

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.userCanceled) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete work as the request has been canceled by the user',
      });
    }

    // Update the request to "completed"
    await db.ref(`vehicle_assistance/${requestId}`).update({
      status: "completed",
      completedAt: Date.now(),
    });

    // Create an in-app notification for the user who reported the request
    if (request.userId) {
      await Notification.create({
        userId: request.userId, // Notify the user who created the request
        title: "Work Completed",
        body: `The work for your vehicle assistance request "${request.confirmRegNo}" has been completed.`,
        isRead: false, // Mark as unread by default
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Work completed successfully',
    });
  } catch (error) {
    console.error('Error in completeWork:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark work as completed',
    });
  }
});



// Check if a specific request's status is accepted
const checkRequestStatus = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    console.log("request id", requestId);
    try {
        
        const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
        const request = snapshot.val();
        // console.log(request);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // Check if the request status is "accepted"
        const isAccepted = request.status === "accepted";

        res.status(200).json({
            success: true,
            isAccepted,
            status: request.status,
            serviceProviderId: request.serviceProviderId || null
        });
    } catch (error) {
        console.error('Error checking request status:', error);
        res.status(500).json({ success: false, message: 'Failed to check request status' });
    }
});

// Get Repair Price for a Specific Request (User)
const getRepairPrice = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    try {
        const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
        const request = snapshot.val();

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Check if price has been set by the service provider
        if (!request.price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Price has not been set by the service provider yet' 
            });
        }

        // Respond with the price information
        res.status(200).json({
            success: true,
            price: request.price,
            status: request.status,
            message: 'Repair price retrieved successfully',
        });
    } catch (error) {
        console.error('Error fetching repair price:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve repair price' });
    }
});

const checkIfPriceAndStatusAccepted = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    try {
        // Fetch the specific request from Firebase
        const snapshot = await db.ref(`vehicle_assistance/${requestId}`).once("value");
        const request = snapshot.val();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        // Check if price is accepted and status is "accepted"
        const isValid = request.isPriceAccepted === true && request.status === "accepted";

        res.status(200).json({
            success: true,
            isValid,
            message: isValid
                ? "Price is accepted, and status is 'accepted'."
                : "Price is not accepted, or status is not 'accepted'.",
        });
    } catch (error) {
        console.error("Error checking price and status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check price and status",
        });
    }
});



// // Get statistics for vehicle assistance reports
// const getVehicleReportStats = asyncHandler(async (req, res) => {
//     try {
//         // Fetch all vehicle assistance reports from Firebase
//         const snapshot = await db.ref("vehicle_assistance").once("value");
//         const reports = snapshot.val();

//         // Initialize counters
//         let totalReported = 0;
//         let ongoing = 0;
//         let canceled = 0;
//         let completed = 0;

//         // Count based on the status of each report
//         Object.values(reports || {}).forEach((report) => {
//             totalReported++;
//             if (report.status === "work-started" || report.status === "approved" || report.status === "accepted") {
//                 ongoing++;
//             } else if (report.status === "canceled") {
//                 canceled++;
//             } else if (report.status === "completed") {
//                 completed++;
//             }
//         });

//         // Respond with the counts
//         res.status(200).json({
//             success: true,
//             stats: {
//                 totalReported,
//                 ongoing,
//                 canceled,
//                 completed,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching vehicle report stats:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch vehicle report stats",
//         });
//     }
// });

const getVehicleReportStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID
        // console.log('Logged-in UserId:', userId);

        // Fetch all vehicle assistance reports from Firebase
        const snapshot = await db.ref("vehicle_assistance").once("value");
        const reports = snapshot.val();

        // Initialize counters
        let totalReported = 0;
        let ongoing = 0;
        let canceled = 0;
        let completed = 0;

        // Count based on the status of each report
        Object.values(reports || {}).forEach((report) => {
            totalReported++; // Count all reports regardless of user

          
            // console.log('Report:', report);
            // console.log('ServiceProviderId:', report.serviceProviderId);
            // console.log('UserId:', userId);

            // Check and compare IDs
            if (report.serviceProviderId && report.serviceProviderId.toString() === userId.toString()) {
                if (["work-started", "approved", "accepted"].includes(report.status)) {
                    ongoing++;
                } else if (report.status === "canceled") {
                    canceled++;
                } else if (report.status === "completed") {
                    completed++;
                }
            }
        });

        // Respond with the counts
        res.status(200).json({
            success: true,
            stats: {
                totalReported, // Total across all users
                ongoing,       // Specific to logged-in user
                canceled,      // Specific to logged-in user
                completed,     // Specific to logged-in user
            },
        });
    } catch (error) {
        console.error("Error fetching vehicle report stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle report stats",
        });
    }
});




  

module.exports = {
    reportVehicleIssue,
    getVehicleReports,
    selectVehicleReport,
    setRepairPrice,
    acceptRepairPrice,
    startWork,
    completeWork,
    checkRequestStatus,
    cancelVehicleRequest,
    getRequestDetails,
    getRepairPrice,
    checkIfPriceAndStatusAccepted,
    checkActiveRequest,
    getVehicleReportStats

};
