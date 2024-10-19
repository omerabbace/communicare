const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const Issue = require('../model/IssueReporting');
const User = require('../model/User');
const { notifyAllVolunteers } = require('../services/notificationService');
const upload = require('../middlewares/upload');

// Controller to create an issue (reported by a normal user)
exports.createIssue = asyncHandler(async (req, res) => {
  console.log(req.body);
  upload(req, res, async (err) => {
    if (err) {
      console.log('Error during file upload:', err);
      return res.status(500).json({ message: 'Multer error', error: err.message });
    }

    console.log('Uploaded files:', req.files);  // Debug to check if files are processed

    const { issueType, description, latitude, longitude } = req.body;

    if (!issueType || !description || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const media = req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype.includes('video') ? 'video' : 'image',
        uri: file.path,
      }));

      console.log('Processed media:', media);  // Debug to ensure media is processed

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
      console.error('Error saving issue:', error);  // Debug database errors
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
});


// Controller to add progress updates for an issue
exports.addProgress = asyncHandler(async (req, res, next) => {
    const { issueId, description, media } = req.body;
    const volunteerId = req.user._id;

    if (!issueId || !description) {
        return next(new AppError('Please provide issueId and description.', 400));
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
        return next(new AppError('Issue not found.', 404));
    }

    // Check if the volunteer is assigned or is the leader
    if (!issue.assignedVolunteers.includes(volunteerId) && issue.leader.toString() !== volunteerId.toString()) {
        return next(new AppError('You are not assigned to this issue.', 403));
    }

    // Add a new progress update to the issue
    issue.progressUpdates.push({
        updatedBy: volunteerId,
        description,
        media
    });

    await issue.save();

    res.status(200).json({
        success: true,
        message: 'Progress added successfully',
        issue
    });
});


// Controller to report task completion by the team leader
exports.completeTask = asyncHandler(async (req, res, next) => {
    const { issueId, description, media } = req.body;
    const leaderId = req.user._id;

    const issue = await Issue.findById(issueId);

    if (!issue) {
        return next(new AppError('Issue not found.', 404));
    }

    // Only the leader can mark the task as completed
    if (issue.leader.toString() !== leaderId.toString()) {
        return next(new AppError('Only the team leader can mark the task as completed.', 403));
    }

    // Mark the task as completed
    issue.completionReport = {
        completedBy: leaderId,
        description,
        media
    };
    issue.status = 'completed';
    
    await issue.save();

    res.status(200).json({
        success: true,
        message: 'Task completed successfully',
        issue
    });
});


// Controller to report task status to the normal user
exports.reportTaskStatus = asyncHandler(async (req, res, next) => {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId).populate('reportedBy assignedVolunteers leader');

    if (!issue) {
        return next(new AppError('Issue not found.', 404));
    }

    res.status(200).json({
        success: true,
        issue
    });
});


// Controller to reassign the leader
exports.reassignLeader = asyncHandler(async (req, res, next) => {
    const { issueId, newLeaderId } = req.body;
    const currentLeaderId = req.user._id; // Assuming the logged-in user is the current leader
  
    const issue = await Issue.findById(issueId);
  
    if (!issue) {
      return next(new AppError('Issue not found.', 404));
    }
  
    // Check if the current user is the leader
    if (issue.leader.toString() !== currentLeaderId.toString()) {
      return next(new AppError('Only the current leader can reassign leadership.', 403));
    }
  
    // Check if the new leader is already a volunteer on this issue
    if (!issue.assignedVolunteers.includes(newLeaderId)) {
      return next(new AppError('The new leader must be one of the assigned volunteers.', 400));
    }
  
    // Reassign the leader
    issue.leader = newLeaderId;
    await issue.save();
  
    res.status(200).json({
      success: true,
      message: 'Leadership has been successfully reassigned.',
      issue,
    });
  });

  
  // Controller for volunteers to leave the task
exports.leaveTask = asyncHandler(async (req, res, next) => {
    const { issueId } = req.body;
    const volunteerId = req.user._id; // Assuming the logged-in user is the volunteer
  
    const issue = await Issue.findById(issueId);
  
    if (!issue) {
      return next(new AppError('Issue not found.', 404));
    }
  
    // Check if the volunteer is actually assigned to the issue
    if (!issue.assignedVolunteers.includes(volunteerId)) {
      return next(new AppError('You are not assigned to this issue.', 403));
    }
  
    // Remove the volunteer from the assigned volunteers list
    issue.assignedVolunteers = issue.assignedVolunteers.filter(
      (volunteer) => volunteer.toString() !== volunteerId.toString()
    );
  
    // If the volunteer is the leader, they must reassign leadership before leaving
    if (issue.leader && issue.leader.toString() === volunteerId.toString()) {
      return next(new AppError('The leader cannot leave without reassigning leadership.', 403));
    }
  
    await issue.save();
  
    res.status(200).json({
      success: true,
      message: 'You have successfully left the task.',
      issue,
    });
  });

  
  // Controller for the leader to leave the task after reassigning leadership
exports.leaderLeaveTask = asyncHandler(async (req, res, next) => {
    const { issueId, newLeaderId } = req.body;
    const leaderId = req.user._id; // Assuming the logged-in user is the leader
  
    const issue = await Issue.findById(issueId);
  
    if (!issue) {
      return next(new AppError('Issue not found.', 404));
    }
  
    // Check if the current user is the leader
    if (issue.leader.toString() !== leaderId.toString()) {
      return next(new AppError('Only the current leader can leave the task by reassigning leadership.', 403));
    }
  
    // Check if the new leader is already a volunteer on this issue
    if (!issue.assignedVolunteers.includes(newLeaderId)) {
      return next(new AppError('The new leader must be one of the assigned volunteers.', 400));
    }
  
    // Reassign the leader and remove the current leader from the task
    issue.leader = newLeaderId;
    issue.assignedVolunteers = issue.assignedVolunteers.filter(
      (volunteer) => volunteer.toString() !== leaderId.toString()
    );
  
    await issue.save();
  
    res.status(200).json({
      success: true,
      message: 'You have successfully reassigned leadership and left the task.',
      issue,
    });
  });
  
// 
  exports.acceptVolunteerRequest = asyncHandler(async (req, res, next) => {
    const { issueId } = req.body;
    const volunteerId = req.user._id; 
  
    const issue = await Issue.findById(issueId);
  
    if (!issue) {
      return next(new AppError('Issue not found.', 404));
    }
  
    // Check if the issue already has the required number of volunteers
    if (issue.assignedVolunteers.length >= issue.requiredVolunteers) {
      return res.status(400).json({
        success: false,
        message: 'No more volunteers are required for this task.',
      });
    }
  
    // Check if the volunteer is already assigned to the issue
    if (issue.assignedVolunteers.includes(volunteerId)) {
      return next(new AppError('You are already assigned to this issue.', 403));
    }
  
    // If no leader is assigned yet, the first volunteer to accept becomes the leader
    if (!issue.leader) {
      issue.leader = volunteerId;
    }
  
    // Add the volunteer to the assigned volunteers
    issue.assignedVolunteers.push(volunteerId);
  
    // Update issue status if required
    if (issue.assignedVolunteers.length === issue.requiredVolunteers) {
      issue.status = 'in progress'; // Mark as 'in progress' once all volunteers are assigned
    }
  
    await issue.save();
  
    res.status(200).json({
      success: true,
      message: 'You have been successfully assigned to the issue.',
      issue,
    });
  });

  // Controller to set required volunteers and notify them using Expo push notifications
exports.setRequiredVolunteers = asyncHandler(async (req, res, next) => {
  const { issueId, requiredVolunteers } = req.body;

  if (!issueId || !requiredVolunteers) {
    return next(new AppError('Please provide issueId and required volunteers count.', 400));
  }

  const issue = await Issue.findById(issueId);

  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  issue.requiredVolunteers = requiredVolunteers;
  await issue.save();

  // Notify volunteers using Expo push notifications
  notifyAllVolunteers(issue._id);

  res.status(200).json({
    success: true,
    message: `Volunteer requirement for issue ${issueId} has been set to ${requiredVolunteers}.`,
    issue,
  });
});

  // Controller to get all reported issues (Admin access)
exports.getAllIssues = asyncHandler(async (req, res, next) => {
  const issues = await Issue.find()
    .populate('reportedBy', 'name email') // Populates the user who reported the issue
    .populate('assignedVolunteers', 'name email') // Populates volunteers assigned to the issue
    .populate('leader', 'name email'); // Populates the leader

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
    .populate('reportedBy', 'name email')
    .populate('leader', 'name email');

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});
// Controller to get a specific issue's details (Admin or Volunteer)
exports.getIssueById = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId)
    .populate('reportedBy', 'name email')
    .populate('assignedVolunteers', 'name email')
    .populate('leader', 'name email');

  if (!issue) {
    return next(new AppError('Issue not found.', 404));
  }

  res.status(200).json({
    success: true,
    issue,
  });
});
// Controller to report task status to the normal user
exports.getTaskStatus = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId)
    .populate('reportedBy', 'name email')
    .populate('assignedVolunteers', 'name email')
    .populate('leader', 'name email')
    .populate('progressUpdates.updatedBy', 'name email'); // Populates volunteers who provided progress updates

  if (!issue) {
    return next(new AppError('Issue not found.', 404));
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
    .populate('assignedVolunteers', 'name email')
    .populate('leader', 'name email');

  res.status(200).json({
    success: true,
    count: issues.length,
    issues,
  });
});





// Controller to reject an issue
// exports.rejectIssue = async (req, res) => {
//   try {
//       const { issueId } = req.params; // Get the issue ID from the request params
//       const { userId, reason } = req.body; // Assuming the userId of the admin/leader and reason for rejection

//       // Find the issue by ID and update the status to 'rejected'
//       const issue = await ReportedIssue.findByIdAndUpdate(
//           issueId,
//           { status: 'rejected' },
//           { new: true }
//       );

//       if (!issue) {
//           return res.status(404).json({ message: 'Issue not found' });
//       }

//       // Optionally, log the rejection reason or save it somewhere
//       // For example, you can add a "rejectionReason" field to the schema if needed
//       if (reason) {
//           // You can update this issue with the rejection reason if necessary
//           issue.rejectionReason = reason; // Optional: Add this field to the schema if desired
//           await issue.save();
//       }

//       res.status(200).json({ message: 'Issue rejected successfully', issue });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error, unable to reject issue' });
//   }
// };

// Controller for assigning a sub-task to a volunteer
// exports.assignSubTask = async (req, res) => {
//   try {
//       const { issueId } = req.params; // The issue ID
//       const { assignedTo, description, media } = req.body; // Sub-task details

//       // Find the issue and check if the requestor is the team leader
//       const issue = await ReportedIssue.findById(issueId);

//       if (!issue) {
//           return res.status(404).json({ message: 'Issue not found' });
//       }

//       if (String(issue.leader) !== req.user.id) { // Assuming req.user.id is the logged-in user's ID
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

//       res.status(200).json({ message: 'Sub-task assigned successfully', issue });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error, unable to assign sub-task' });
//   }
// };

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