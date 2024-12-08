const asyncHandler = require("../utilities/CatchAsync");
const AppError = require("../utilities/AppError");
const Issue = require("../model/IssueReporting");
const User = require("../model/User");
const upload = require("../middlewares/upload");
const {
  sendPushNotification,
} = require("../controllers/notificationsController"); // Import your push notification function
const Notification = require("../model/Notification"); // Import the Notification model

// Controller to create an issue (reported by a normal user)
exports.createIssue = asyncHandler(async (req, res) => {
  console.log(req.body);
  upload(req, res, async (err) => {
    if (err) {
      console.log("Error during file upload:", err);
      return res
        .status(500)
        .json({ message: "Multer error", error: err.message });
    }

    // console.log('Uploaded files:', req.files);  // Debug to check if files are processed

    const { issueType, description, latitude, longitude } = req.body;

    if (!issueType || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const media = req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype.includes("video") ? "video" : "image",
        uri: file.path,
      }));

      console.log("Processed media:", media); // Debug to ensure media is processed

      const issue = new Issue({
        reportedBy: req.user._id,
        issueType,
        description,
        media,
        location: { latitude, longitude },
      });

      await issue.save();

      res.status(201).json({ success: true, issue });
    } catch (error) {
      console.error("Error saving issue:", error); // Debug database errors
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  });
});

// Controller to add progress updates for an issue
exports.addProgress = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res
        .status(500)
        .json({ message: "Multer error", error: err.message });
    }

    const { issueId, description } = req.body;
    const volunteerId = req.user._id;

    if (!issueId || !description) {
      return next(new AppError("Please provide issueId and description.", 400));
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return next(new AppError("Issue not found.", 404));
    }

    // Check if the volunteer is assigned or is the leader
    if (
      !issue.assignedVolunteers.includes(volunteerId) &&
      issue.leader.toString() !== volunteerId.toString()
    ) {
      return next(new AppError("You are not assigned to this issue.", 403));
    }

    // Process uploaded files
    const media = req.files.map((file) => ({
      name: file.originalname,
      type: file.mimetype.includes("video") ? "video" : "image",
      uri: file.path,
    }));

    console.log("Processed media:", media); // Debugging to verify media processing

    // Add a new progress update to the issue
    issue.progressUpdates.push({
      updatedBy: volunteerId,
      description,
      media,
    });

    await issue.save();

    res.status(200).json({
      success: true,
      message: "Progress added successfully",
      issue,
    });
  });
});

// Controller to report task completion by the team leader
exports.completeTask = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res
        .status(500)
        .json({ message: "Multer error", error: err.message });
    }

    const { issueId, description } = req.body;
    const leaderId = req.user._id;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return next(new AppError("Issue not found.", 404));
    }

    // Only the leader can mark the task as completed
    if (issue.leader.toString() !== leaderId.toString()) {
      return next(
        new AppError(
          "Only the team leader can mark the task as completed.",
          403
        )
      );
    }

    // Process uploaded files
    const media = req.files.map((file) => ({
      name: file.originalname,
      type: file.mimetype.includes("video") ? "video" : "image",
      uri: file.path,
    }));

    console.log("Processed media:", media); // Debugging to verify media processing

    // Mark the task as completed
    issue.completionReport = {
      completedBy: leaderId,
      description,
      media,
    };
    issue.status = "completed";

    // Save the updated issue
    await issue.save();

    res.status(200).json({
      success: true,
      message: "Task completed successfully",
      issue,
    });
  });
});

// Controller to get progress updates for an issue
exports.getProgressUpdates = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId).populate(
    "progressUpdates.updatedBy",
    "name"
  );

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  res.status(200).json({
    success: true,
    progressUpdates: issue.progressUpdates,
  });
});

// Controller to get completed issues
exports.getCompletedIssues = asyncHandler(async (req, res, next) => {
  const issues = await Issue.find({ status: "completed" })
    .populate("leader", "name") // Populates only the `name` field of the `leader`
    .populate("reportedBy", "name email"); // Populates `name` and `email` fields of `reportedBy`

  res.status(200).json({
    success: true,
    completedIssues: issues,
  });
});

// // Controller to report task status to the normal user
// exports.reportTaskStatus = asyncHandler(async (req, res, next) => {
//   const { issueId } = req.params;
//   const { description } = req.body; // Only accept description, as media will come from completionReport

//   // Find the issue by ID and populate necessary fields
//   const issue = await Issue.findById(issueId)
//       .populate('reportedBy assignedVolunteers leader')
//       .exec();

//   if (!issue) {
//       return next(new AppError('Issue not found.', 404));
//   }

//   // Ensure there is a completion report to use for the admin's report media
//   if (!issue.completionReport || !issue.completionReport.media) {
//       return next(new AppError('No completion report media available to include in the admin report.', 400));
//   }

//   // Update the issue's admin report with the admin's description and the leader's completion report media
//   issue.adminReport = {
//       description: description || issue.adminReport?.description || '', // Admin-provided description
//       media: issue.completionReport.media, // Use media from the leader's completion report
//       date: Date.now() // Set the current date for the report submission
//   };

//   // Save the updated issue
//   await issue.save();

//   res.status(200).json({
//       success: true,
//       message: 'Admin report submitted successfully to the user.',
//       issue
//   });
// });

// Controller to report task status to the normal user
exports.reportTaskStatus = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;
  const { description } = req.body; // Only accept description, as media will come from completionReport

  // Find the issue by ID and populate necessary fields
  const issue = await Issue.findById(issueId)
    .populate("reportedBy assignedVolunteers leader")
    .exec();

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Ensure there is a completion report to use for the admin's report media
  if (!issue.completionReport || !issue.completionReport.media) {
    return next(
      new AppError(
        "No completion report media available to include in the admin report.",
        400
      )
    );
  }

  // Update the issue's admin report with the admin's description and the leader's completion report media
  issue.adminReport = {
    description: description || issue.adminReport?.description || "", // Admin-provided description
    media: issue.completionReport.media, // Use media from the leader's completion report
    date: Date.now(), // Set the current date for the report submission
  };

  // Save the updated issue
  await issue.save();

  // Add in-app notification for the user who reported the issue
  if (issue.reportedBy) {
    await Notification.create({
      userId: issue.reportedBy._id, // The user who reported the issue
      title: "Reported Issue Completed",
      body: `An admin has updated the status for the issue "${issue.issueType}".`,
      isRead: false, // Mark as unread by default
      createdAt: new Date(),
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin report submitted successfully to the user.",
    issue,
  });
});

// Controller to get all reports for issues reported by a specific user
exports.getUserReportedIssues = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // Get the logged-in user's ID

  // Find issues reported by the user and populate the admin report field
  const issues = await Issue.find({ reportedBy: userId })
    .populate("adminReport") // Populate admin report if it exists
    .select("description status adminReport createdAt"); // Select specific fields to return

  if (!issues || issues.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No issues found for the user.",
    });
  }

  res.status(200).json({
    success: true,
    issues,
  });
});

// Controller to reassign the leader
exports.reassignLeader = asyncHandler(async (req, res, next) => {
  const { issueId, newLeaderId } = req.body;
  const currentLeaderId = req.user._id; // Assuming the logged-in user is the current leader

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Check if the current user is the leader
  if (issue.leader.toString() !== currentLeaderId.toString()) {
    return next(
      new AppError("Only the current leader can reassign leadership.", 403)
    );
  }

  // Check if the new leader is already a volunteer on this issue
  if (!issue.assignedVolunteers.includes(newLeaderId)) {
    return next(
      new AppError(
        "The new leader must be one of the assigned volunteers.",
        400
      )
    );
  }

  // Reassign the leader
  issue.leader = newLeaderId;
  await issue.save();

  res.status(200).json({
    success: true,
    message: "Leadership has been successfully reassigned.",
    issue,
  });
});

// Controller for volunteers to leave the task
exports.leaveTask = asyncHandler(async (req, res, next) => {
  const { issueId } = req.body;
  const volunteerId = req.user._id; // Assuming the logged-in user is the volunteer

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Check if the volunteer is actually assigned to the issue
  if (!issue.assignedVolunteers.includes(volunteerId)) {
    return next(new AppError("You are not assigned to this issue.", 403));
  }

  // Remove the volunteer from the assigned volunteers list
  issue.assignedVolunteers = issue.assignedVolunteers.filter(
    (volunteer) => volunteer.toString() !== volunteerId.toString()
  );

  // If the volunteer is the leader, they must reassign leadership before leaving
  if (issue.leader && issue.leader.toString() === volunteerId.toString()) {
    return next(
      new AppError(
        "The leader cannot leave without reassigning leadership.",
        403
      )
    );
  }

  await issue.save();

  res.status(200).json({
    success: true,
    message: "You have successfully left the task.",
    issue,
  });
});

// Controller for the leader to leave the task after reassigning leadership
exports.leaderLeaveTask = asyncHandler(async (req, res, next) => {
  const { issueId, newLeaderId } = req.body;
  const leaderId = req.user._id; // Assuming the logged-in user is the leader

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Check if the current user is the leader
  if (issue.leader.toString() !== leaderId.toString()) {
    return next(
      new AppError(
        "Only the current leader can leave the task by reassigning leadership.",
        403
      )
    );
  }

  // Check if the new leader is already a volunteer on this issue
  if (!issue.assignedVolunteers.includes(newLeaderId)) {
    return next(
      new AppError(
        "The new leader must be one of the assigned volunteers.",
        400
      )
    );
  }

  // Reassign the leader and remove the current leader from the task
  issue.leader = newLeaderId;
  issue.assignedVolunteers = issue.assignedVolunteers.filter(
    (volunteer) => volunteer.toString() !== leaderId.toString()
  );

  await issue.save();

  res.status(200).json({
    success: true,
    message: "You have successfully reassigned leadership and left the task.",
    issue,
  });
});

//
exports.acceptVolunteerRequest = asyncHandler(async (req, res, next) => {
  const { issueId } = req.body;
  const volunteerId = req.user._id;

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Check if the issue already has the required number of volunteers
  if (issue.assignedVolunteers.length >= issue.requiredVolunteers) {
    return res.status(400).json({
      success: false,
      message: "No more volunteers are required for this task.",
    });
  }

  // Check if the volunteer is already assigned to the issue
  if (issue.assignedVolunteers.includes(volunteerId)) {
    return next(new AppError("You are already assigned to this issue.", 403));
  }

  // If no leader is assigned yet, the first volunteer to accept becomes the leader
  if (!issue.leader) {
    issue.leader = volunteerId;
  }

  // Add the volunteer to the assigned volunteers
  issue.assignedVolunteers.push(volunteerId);

  // Update issue status if required
  if (issue.assignedVolunteers.length === issue.requiredVolunteers) {
    issue.status = "in progress"; // Mark as 'in progress' once all volunteers are assigned
  }

  await issue.save();

  res.status(200).json({
    success: true,
    message: "You have been successfully assigned to the issue.",
    issue,
  });
});

//   // Controller to set required volunteers and notify them using Expo push notifications
// exports.setRequiredVolunteers = asyncHandler(async (req, res, next) => {
//   const { issueId, requiredVolunteers } = req.body;

//   if (!issueId || !requiredVolunteers) {
//     return next(new AppError('Please provide issueId and required volunteers count.', 400));
//   }

//   const issue = await Issue.findById(issueId);

//   if (!issue) {
//     return next(new AppError('Issue not found.', 404));
//   }

//   issue.requiredVolunteers = requiredVolunteers;
//   issue.status = 'in progress';
//   await issue.save();

//   // Notify volunteers using Expo push notifications
//   notifyAllVolunteers(issue._id);

//   res.status(200).json({
//     success: true,
//     message: `Volunteer requirement for issue ${issueId} has been set to ${requiredVolunteers}.`,
//     issue,
//   });
// });
// Controller to set required volunteers
// exports.setRequiredVolunteers = asyncHandler(async (req, res, next) => {
//   const { issueId, requiredVolunteers } = req.body;

//   // Validate input
//   if (!issueId || !requiredVolunteers) {
//     return next(new AppError('Please provide issueId and required volunteers count.', 400));
//   }

//   // Find the issue by ID
//   const issue = await Issue.findById(issueId);

//   if (!issue) {
//     return next(new AppError('Issue not found.', 404));
//   }

//   // Update issue with required volunteers and change status to 'in progress'
//   issue.requiredVolunteers = requiredVolunteers;
//   issue.status = 'in progress';
//   await issue.save();

//   // Respond with success
//   res.status(200).json({
//     success: true,
//     message: `Volunteer requirement for issue ${issueId} has been set to ${requiredVolunteers}.`,
//     issue,
//   });
// });

exports.setRequiredVolunteers = asyncHandler(async (req, res, next) => {
  const { issueId, requiredVolunteers } = req.body;

  // Validate input
  if (!issueId || !requiredVolunteers) {
    return next(
      new AppError("Please provide issueId and required volunteers count.", 400)
    );
  }

  // Find the issue by ID
  const issue = await Issue.findById(issueId).populate(
    "reportedBy",
    "_id name email"
  );

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Update issue with required volunteers and change status to 'in progress'
  issue.requiredVolunteers = requiredVolunteers;
  issue.status = "in progress";
  await issue.save();

  // Create in-app notification for the user who reported the issue
  if (issue.reportedBy) {
    await Notification.create({
      userId: issue.reportedBy._id,
      title: "Issue Accepted",
      body: `The issue "${issue.issueType}" is now set to require ${requiredVolunteers} volunteers.`,
      isRead: false, // Mark as unread
      createdAt: new Date(),
    });
  }

  // Respond with success
  res.status(200).json({
    success: true,
    message: `Volunteer requirement for issue ${issueId} has been set to ${requiredVolunteers}.`,
    issue,
  });
});

// to get the issues  requested volunteer
exports.getIssuesRequiringVolunteers = asyncHandler(async (req, res, next) => {
  // Fetch issues where assigned volunteers are less than the required volunteers
  const issues = await Issue.find({
    status: "in progress",
    $expr: { $lt: [{ $size: "$assignedVolunteers" }, "$requiredVolunteers"] },
  });

  res.status(200).json({
    success: true,
    issues,
  });
});

// Controller to get all reported issues (Admin access)
exports.getAllIssues = asyncHandler(async (req, res, next) => {
  const issues = await Issue.find({ status: "pending" })
    .populate("reportedBy", "name email") // Populates the user who reported the issue
    .populate("assignedVolunteers", "name email") // Populates volunteers assigned to the issue
    .populate("leader", "name email"); // Populates the leader

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});
// Controller to get all issues assigned to the logged-in volunteer
exports.getAssignedIssues = asyncHandler(async (req, res, next) => {
  const volunteerId = req.user._id;

  const issues = await Issue.find({ assignedVolunteers: volunteerId })
    .populate("reportedBy", "name email")
    .populate("leader", "name email");

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});
// Controller to get a specific issue's details (Admin or Volunteer)
exports.getIssueById = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;

  // Find the issue and populate the relevant fields
  const issue = await Issue.findById(issueId)
    .populate("reportedBy", "name email")
    .populate("assignedVolunteers", "name email")
    .populate("leader", "name email");

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  // Filter out the leader from the assigned volunteers
  const filteredVolunteers = issue.assignedVolunteers.filter(
    (volunteer) => !volunteer._id.equals(issue.leader._id)
  );

  // Return the issue with the filtered list of volunteers
  res.status(200).json({
    success: true,
    issue: {
      ...issue.toObject(),
      assignedVolunteers: filteredVolunteers,
    },
  });
});

// Controller to report task status to the normal user
exports.getTaskStatus = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId)
    .populate("reportedBy", "name email")
    .populate("assignedVolunteers", "name email")
    .populate("leader", "name email")
    .populate("progressUpdates.updatedBy", "name email"); // Populates volunteers who provided progress updates

  if (!issue) {
    return next(new AppError("Issue not found.", 404));
  }

  res.status(200).json({
    success: true,
    issue,
  });
});
// Controller to get issues reported by the logged-in normal user
exports.getUserReportedIssues = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const issues = await Issue.find({ reportedBy: userId })
    .populate("assignedVolunteers", "name email")
    .populate("leader", "name email");

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});

// exports.rejectIssue = async (req, res) => {
//   try {
//     const { issueId } = req.params; // Get the issue ID from the request params
//     const { userId, reason } = req.body; // Assuming the userId of the admin/leader and reason for rejection

//     // Find the issue by ID and update the status to 'rejected'
//     const issue = await Issue.findByIdAndUpdate(
//       issueId,
//       { status: 'rejected' },
//       { new: true }
//   ).populate('reportedBy', '_id name email pushNotificationToken');

//     if (!issue) {
//         return res.status(404).json({ message: 'Issue not found' });
//     }

//     // Optionally, log the rejection reason or save it somewhere
//     if (reason) {
//         issue.rejectionReason = reason; // Optional: Add this field to the schema if desired
//         await issue.save();
//     }

//     // Send notifications only to the normal user who reported the issue
//     const usersToNotify = [];

//     // Add the reported user (the one who raised the issue)
//     // console.log('issue.reportedBy ',issue.reportedBy );
//     // console.log('issue.reportedBy.pushNotificationToken',issue.reportedBy.pushNotificationToken);
//     // console.log('_id', issue.reportedBy._id);
//     if (issue.reportedBy && issue.reportedBy.pushNotificationToken) {
//         usersToNotify.push(issue.reportedBy); // Only include the normal user
//     }

//     // Log users being notified
//     // console.log('Users to notify:', usersToNotify);

//     // Send push notifications to all relevant users (in this case, only the reporter)
//     const notificationPromises = usersToNotify.map(user => {
//         // console.log("Sending notification to user with token:", user.pushNotificationToken);
//         // console.log("user id:", user._id);
//         return sendPushNotification({
//             userId: user._id,
//             title: 'Issue Rejected',
//             body: `The issue "${issue.issueType}" has been rejected. Reason: ${reason || 'No reason provided.'}`,
//             data: { issueId: issue._id }
//         });
//     });

//     // Wait for all notifications to be sent
//     await Promise.all(notificationPromises);

//     res.status(200).json({ message: 'Issue rejected successfully', issue });
//   } catch (error) {
//     console.error('Error rejecting issue:', error);
//     res.status(500).json({ message: 'Server error, unable to reject issue' });
//   }
// };

exports.rejectIssue = async (req, res) => {
  try {
    const { issueId } = req.params; // Get the issue ID from the request params
    const { userId, reason } = req.body; // Assuming the userId of the admin/leader and reason for rejection

    // Find the issue by ID and update the status to 'rejected'
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { status: "rejected" },
      { new: true }
    ).populate("reportedBy", "_id name email pushNotificationToken");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Optionally, log the rejection reason or save it somewhere
    if (reason) {
      issue.rejectionReason = reason; // Optional: Add this field to the schema if desired
      await issue.save();
    }

    // Send notifications only to the normal user who reported the issue
    const usersToNotify = [];

    if (issue.reportedBy && issue.reportedBy.pushNotificationToken) {
      usersToNotify.push(issue.reportedBy); // Only include the normal user
    }

    // Prepare notification data
    const notificationData = {
      title: "Issue Rejected",
      body: `The issue "${issue.issueType}" has been rejected. Reason: ${
        reason || "No reason provided."
      }`,
      data: { issueId: issue._id },
    };

    // Send push notifications to all relevant users (in this case, only the reporter)
    const pushNotificationPromises = usersToNotify.map((user) =>
      sendPushNotification({
        userId: user._id,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
      })
    );

    // Send in-app notifications
    const inAppNotificationPromises = usersToNotify.map((user) =>
      Notification.create({
        userId: user._id,
        title: notificationData.title,
        body: notificationData.body,
        isRead: false, // Unread by default
        createdAt: new Date(),
      })
    );

    // Wait for both push notifications and in-app notifications to complete
    await Promise.all([
      ...pushNotificationPromises,
      ...inAppNotificationPromises,
    ]);

    res.status(200).json({ message: "Issue rejected successfully", issue });
  } catch (error) {
    console.error("Error rejecting issue:", error);
    res.status(500).json({ message: "Server error, unable to reject issue" });
  }
};

exports.getRejectedIssues = asyncHandler(async (req, res, next) => {
  // Fetch only issues where the status is 'rejected'
  const rejectedIssues = await Issue.find({ status: "rejected" })
    .populate("reportedBy", "name email")
    .populate("assignedVolunteers", "name email")
    .populate("leader", "name email");

  res.status(200).json({
    success: true,
    count: rejectedIssues.length,
    issues: rejectedIssues,
  });
});

// Controller for assigning a sub-task to a volunteer
exports.assignSubTask = async (req, res) => {
  try {
    const { issueId } = req.params; // The issue ID
    const { assignedTo, description, media } = req.body; // Sub-task details
    // console.log(req.user._id);
    // console.log(assignedTo);
    // Find the issue and check if the requestor is the team leader
    const issue = await Issue.findById(issueId);
    // console.log(issue.leader);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (String(issue.leader) !== String(req.user._id)) {
      // Assuming req.user.id is the logged-in user's ID
      return res
        .status(403)
        .json({ message: "Only the team leader can assign sub-tasks" });
    }

    // Create the sub-task
    const subTask = {
      assignedTo,
      description,
      media: media || [], // Media array (optional)
      status: "pending",
    };

    // Add the sub-task to the issue
    issue.subTasks.push(subTask);
    await issue.save();

    res.status(200).json({ message: "Sub-task assigned successfully", issue });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, unable to assign sub-task" });
  }
};

// exports.assignSubTask = async (req, res) => {
//   try {
//       const { issueId } = req.params; // The issue ID
//       const { assignedTo, description, media } = req.body; // Sub-task details

//       // Find the issue and check if the requestor is the team leader
//       const issue = await Issue.findById(issueId);
//       if (!issue) {
//           return res.status(404).json({ message: 'Issue not found' });
//       }

//       // Check if the logged-in user is the team leader
//       if (String(issue.leader) !== String(req.user._id)) {
//           return res.status(403).json({ message: 'Only the team leader can assign sub-tasks' });
//       }

//       // Create the sub-task
//       const subTask = {
//           assignedTo,
//           description,
//           media: media || [], // Media array (optional)
//           status: 'pending'
//       };

//       // Add the sub-task to the issue
//       issue.subTasks.push(subTask);
//       await issue.save();
//       console.log('assignedTo',assignedTo);
//       // Populate the assignedTo user details
//       const userToNotify = await User.findById(assignedTo).select('_id name pushNotificationToken'); // Populate user details
//       console.log('userToNotify._id',userToNotify._id);
//       console.log('userToNotify.pushNotificationToken',userToNotify.pushNotificationToken);
//       if (userToNotify && userToNotify.pushNotificationToken) {
//           // Send a push notification to the assigned user
//           await sendPushNotification({
//               recipientId: userToNotify._id,
//               title: 'New Sub-Task Assigned',
//               body: `You have been assigned a new sub-task for the issue "${issue.issueType}". Please check it out.`,
//               data: {  issueId: issue._id, subTaskId: subTask._id } // Sending relevant data with the notification
//           });
//       }

//       res.status(200).json({ message: 'Sub-task assigned successfully', issue });
//   } catch (error) {
//       console.error('Error assigning sub-task:', error);
//       res.status(500).json({ message: 'Server error, unable to assign sub-task' });
//   }
// };

// Controller function to get assigned sub-tasks for an issue
exports.getAssignedSubTasks = async (req, res) => {
  try {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId).populate(
      "subTasks.assignedTo",
      "name email"
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ subTasks: issue.subTasks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, unable to retrieve sub-tasks" });
  }
};

// Controller to add progress updates on a sub-task by assigned volunteers
// exports.reportOnSubTask = async (req, res) => {
//   try {
//     const { issueId, subTaskId } = req.params;
//     const { description, media, status } = req.body;
//     const userId = req.user._id;

//     const issue = await Issue.findById(issueId);
//     if (!issue) return res.status(404).json({ message: 'Issue not found' });

//     const subTask = issue.subTasks.id(subTaskId);
//     if (!subTask) return res.status(404).json({ message: 'Sub-task not found' });

//     if (String(subTask.assignedTo) !== String(userId)) {
//       return res.status(403).json({ message: 'You are not assigned to this sub-task' });
//     }

//     subTask.progressUpdates.push({
//       updatedBy: userId,
//       description,
//       media: media || [],
//       status: status || 'pending',
//       date: Date.now(),
//     });

//     await issue.save();
//     res.status(200).json({ message: 'Progress report added successfully', subTask });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error, unable to report on sub-task' });
//   }
// };

exports.reportOnSubTask = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { issueId, subTaskId } = req.params;
      const { description, status } = req.body;
      const userId = req.user._id;

      const issue = await Issue.findById(issueId);
      if (!issue) return res.status(404).json({ message: "Issue not found" });

      const subTask = issue.subTasks.id(subTaskId);
      if (!subTask)
        return res.status(404).json({ message: "Sub-task not found" });

      if (String(subTask.assignedTo) !== String(userId)) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this sub-task" });
      }

      // Collect file paths from uploaded files
      const mediaPaths = req.files.map((file) => `/uploads/${file.filename}`);

      // Add progress update to the sub-task
      subTask.progressUpdates.push({
        updatedBy: userId,
        description,
        media: mediaPaths || [],
        status: status || "pending",
        date: Date.now(),
      });

      await issue.save();
      res
        .status(200)
        .json({ message: "Progress report added successfully", subTask });
    } catch (error) {
      console.error("Error reporting sub-task:", error);
      res
        .status(500)
        .json({ message: "Server error, unable to report on sub-task" });
    }
  });
};

// Controller for viewing all reports on a specific sub-task
exports.getSubTaskReports = async (req, res) => {
  try {
    const { issueId, subTaskId } = req.params;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const subTask = issue.subTasks.id(subTaskId);
    if (!subTask)
      return res.status(404).json({ message: "Sub-task not found" });

    res.status(200).json({ reports: subTask.progressUpdates });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error, unable to retrieve reports" });
  }
};
// progressReports of the sub task
exports.getVolunteerReportsForSubTask = async (req, res) => {
  try {
    const { issueId, subTaskId } = req.params;

    // Find the issue containing the specified sub-task
    const issue = await Issue.findById(issueId).populate({
      path: "subTasks.progressUpdates.updatedBy",
      select: "name email", // You can specify which fields to include
    });
    if (!issue) {
      console.log("Issue not found");
      return res.status(404).json({ message: "Issue not found" });
    }

    // console.log('Sub-tasks in issue:', issue.subTasks);

    // Find the sub-task within the issue
    const subTask = issue.subTasks.id(subTaskId);
    if (!subTask) {
      // console.log('Sub-task not found');
      return res.status(404).json({ message: "Sub-task not found" });
    }

    // console.log('Retrieved sub-task:', subTask);
    // console.log('Progress Updates in sub-task:', subTask.progressUpdates);

    // Return all progress updates for the sub-task
    return res.status(200).json({ reports: subTask.progressUpdates });
  } catch (error) {
    console.error("Error fetching volunteer reports:", error);
    return res
      .status(500)
      .json({ message: "Server error, unable to retrieve reports" });
  }
};

exports.updateSubTaskStatus = asyncHandler(async (req, res) => {
  const { issueId, subTaskId } = req.params;
  const { status } = req.body;

  // Validate status value
  const validStatuses = ["pending", "in progress", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the issue containing the specified sub-task
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Find the sub-task within the issue
    const subTask = issue.subTasks.id(subTaskId);
    if (!subTask) {
      return res.status(404).json({ message: "Sub-task not found" });
    }

    // Update the status of the sub-task
    subTask.status = status;
    await issue.save();

    res
      .status(200)
      .json({ success: true, message: "Sub-task status updated successfully" });
  } catch (error) {
    console.error("Error updating sub-task status:", error);
    res
      .status(500)
      .json({ message: "Server error, unable to update sub-task status" });
  }
});

// // Controller for updating a sub-task
// exports.updateSubTask = async (req, res) => {
//   try {
//       const { issueId, subTaskId } = req.params; // Issue and sub-task IDs
//       const { description, media } = req.body; // Update details

//       // Find the issue
//       const issue = await ReportedIssue.findById(issueId);

//       if (!issue) {
//           return res.status(404).json({ message: 'Issue not found' });
//       }

//       // Find the sub-task
//       const subTask = issue.subTasks.id(subTaskId);

//       if (!subTask) {
//           return res.status(404).json({ message: 'Sub-task not found' });
//       }

//       // Check if the volunteer is allowed to update this sub-task
//       if (String(subTask.assignedTo) !== req.user.id) {
//           return res.status(403).json({ message: 'You are not assigned to this sub-task' });
//       }

//       // Add the update to the sub-task
//       const update = {
//           updatedBy: req.user.id, // The volunteer's ID
//           description,
//           media: media || [], // Media array (optional)
//           date: Date.now()
//       };

//       subTask.updates.push(update);
//       await issue.save();

//       res.status(200).json({ message: 'Sub-task updated successfully', issue });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error, unable to update sub-task' });
//   }
// };

// // Controller for providing progress on a sub-task
// exports.updateSubTaskProgress = async (req, res) => {
//   try {
//       const { issueId, subTaskId } = req.params; // Issue and sub-task IDs
//       const { description, media } = req.body; // Progress update details

//       // Find the issue
//       const issue = await ReportedIssue.findById(issueId);

//       if (!issue) {
//           return res.status(404).json({ message: 'Issue not found' });
//       }

//       // Find the sub-task
//       const subTask = issue.subTasks.id(subTaskId);

//       if (!subTask) {
//           return res.status(404).json({ message: 'Sub-task not found' });
//       }

//       // Check if the volunteer is allowed to update this sub-task
//       if (String(subTask.assignedTo) !== req.user.id) {
//           return res.status(403).json({ message: 'You are not assigned to this sub-task' });
//       }

//       // Add the progress update to the sub-task
//       const progressUpdate = {
//           updatedBy: req.user.id, // The volunteer's ID
//           description,
//           media: media || [], // Media array (optional)
//           date: Date.now()
//       };

//       subTask.progressUpdates.push(progressUpdate);
//       subTask.status = 'in progress'; // Optionally update the sub-task status to 'in progress'

//       await issue.save();

//       res.status(200).json({ message: 'Sub-task progress updated successfully', issue });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error, unable to update sub-task progress' });
//   }
// };

// Controller to fetch all issues with status 'in progress'
exports.getInProgressIssues = asyncHandler(async (req, res, next) => {
  const issues = await Issue.find({ status: "in progress" })
    .populate("reportedBy", "name email") // Populate the user who reported the issue
    .populate("assignedVolunteers", "name email") // Populate volunteers assigned to the issue
    .populate("leader", "name email"); // Populate the leader

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});
exports.getInProgressIssuesWithUpdates = asyncHandler(
  async (req, res, next) => {
    const issues = await Issue.find({
      status: "in progress",
      progressUpdates: { $exists: true, $ne: [] }, // Check that progressUpdates exists and is not empty
    })
      .populate("reportedBy", "name email") // Populate the user who reported the issue
      .populate("assignedVolunteers", "name email") // Populate volunteers assigned to the issue
      .populate("leader", "name email") // Populate the leader
      .populate("progressUpdates.updatedBy", "name"); // Populate the user who made each progress update

    res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  }
);

// // Controller to fetch all issues with status 'completed'
// exports.getCompletedIssues = asyncHandler(async (req, res, next) => {
//   const issues = await Issue.find({ status: 'completed' })
//     .populate('reportedBy', 'name email') // Populate the user who reported the issue
//     .populate('assignedVolunteers', 'name email') // Populate volunteers assigned to the issue
//     .populate('leader', 'name email'); // Populate the leader

//   res.status(200).json({
//     success: true,
//     count: issues.length,
//     issues,
//   });
// });

exports.checkLeaderStatus = asyncHandler(async (req, res, next) => {
  const volunteerId = req.user._id;

  const issue = await Issue.findOne({ leader: volunteerId }); // Assuming an Issue model where the leader is stored

  if (issue) {
    res.status(200).json({
      success: true,
      isLeader: true,
      issueId: issue._id, // Optionally return the issue ID if needed
    });
  } else {
    res.status(200).json({
      success: true,
      isLeader: false,
    });
  }
});

// Controller to get issues where the volunteer is the leader and the issues are not completed
exports.getLeaderIssues = asyncHandler(async (req, res) => {
  const leaderId = req.user._id; // Get the logged-in user's ID

  const issues = await Issue.find({
    leader: leaderId,
    status: { $ne: "completed" }, // Exclude completed issues
  }).populate("assignedVolunteers", "name email"); // Populate volunteers' names and emails

  if (!issues || issues.length === 0) {
    return res.status(404).json({
      success: false,
      message:
        "No in-progress or pending issues found where the user is the leader.",
    });
  }

  res.status(200).json({
    success: true,
    issues,
  });
});

// Controller to get issues where the volunteer is the leader and the tasks are completed
exports.getCompletedLeaderTasks = asyncHandler(async (req, res) => {
  const leaderId = req.user._id; // Get the logged-in user's ID

  const issues = await Issue.find({
    leader: leaderId,
    status: "completed", // Only fetch completed issues
  })
    .populate("assignedVolunteers", "name email") // Populate volunteers' names and emails
    .populate("leader", "name email"); // Populate the leader

  if (!issues || issues.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No completed issues found where the user is the leader.",
    });
  }

  res.status(200).json({
    success: true,
    issues,
  });
});

// Controller to get issues where the volunteer is assigned but not the leader
// issueController.js
exports.getVolunteerIssues = asyncHandler(async (req, res) => {
  const volunteerId = req.user._id;

  // Use $in to ensure that volunteerId matches any of the assigned volunteers but not the leader
  const issues = await Issue.find({
    assignedVolunteers: { $in: [volunteerId] },
    leader: { $ne: volunteerId },
    status: { $ne: "completed" },
  });

  // console.log("Fetched Issues for Volunteer:", issues);

  if (!issues || issues.length === 0) {
    return res.status(404).json({
      success: false,
      message:
        "No issues found where the user is a volunteer and not the leader.",
    });
  }

  res.status(200).json({
    success: true,
    issues,
  });
});

// Controller to get task statistics for a volunteer leader
exports.getVolunteerLeaderStats = asyncHandler(async (req, res) => {
  const volunteerId = req.user._id; // Get the logged-in user's ID
  // console.log(volunteerId);
  try {
    // Count the number of completed tasks where the volunteer is the leader
    const completedTasksCount = await Issue.countDocuments({
      leader: volunteerId,
      status: "completed",
    });

    // Count the number of pending tasks where the volunteer is the leader
    const pendingTasksCount = await Issue.countDocuments({
      leader: volunteerId,
      status: "in progress",
    });

    // Count the number of subtasks assigned to the volunteer
    const assignedSubTasksCount = await Issue.aggregate([
      { $unwind: "$subTasks" }, // Unwind the subTasks array
      { $match: { "subTasks.assignedTo": volunteerId } }, // Match the subtasks assigned to the volunteer
      { $count: "count" }, // Count the results
    ]);
    const subTasksCount = assignedSubTasksCount[0]?.count || 0; // Default to 0 if no subtasks are found

    // Count the total number of reported issues which are not yet completed
    const notCompletedIssuesCount = await Issue.countDocuments({
      status: { $ne: "completed" },
    });

    // Return the statistics
    res.status(200).json({
      success: true,
      stats: {
        completedTasksCount,
        pendingTasksCount,
        subTasksCount,
        notCompletedIssuesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching volunteer leader stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error, unable to fetch stats.",
    });
  }
});

// Controller to fetch stats for a normal user
exports.getUserIssueStats = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    // Count the number of reported issues by the user
    const reportedIssuesCount = await Issue.countDocuments({
      reportedBy: userId,
    });

    // Count the number of completed issues reported by the user
    const completedIssuesCount = await Issue.countDocuments({
      reportedBy: userId,
      status: "completed",
    });

    // Count the number of canceled issues reported by the user
    const canceledIssuesCount = await Issue.countDocuments({
      reportedBy: userId,
      status: "rejected",
    });
    const inProgressIssuesCount = await Issue.countDocuments({
      reportedBy: userId,
      status: "in progress",
    });

    // Return the stats
    res.status(200).json({
      success: true,
      stats: {
        reportedIssuesCount,
        completedIssuesCount,
        canceledIssuesCount,
        inProgressIssuesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user issue stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error, unable to fetch issue stats.",
    });
  }
});

exports.getDashboardData = asyncHandler(async (req, res) => {
  try {

    const reportedIssuesCount = await Issue.countDocuments(); // Or remove userId for all issues
    const completedIssuesCount = await Issue.countDocuments({ status: 'completed' }); // Add reportedBy: userId if needed
    const canceledIssuesCount = await Issue.countDocuments({ status: 'rejected' });  // Add reportedBy: userId if needed
    const inProgressIssuesCount = await Issue.countDocuments({ status: 'in progress' }); // Add reportedBy: userId if needed

    res.json({ 
      reportedIssuesCount, 
      completedIssuesCount, 
      canceledIssuesCount, 
      inProgressIssuesCount 
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});
