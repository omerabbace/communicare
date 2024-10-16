const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const Issue = require('../model/IssueReporting');
const User = require('../model/User');
const { notifyAllVolunteers } = require('../services/notificationService');

// Controller to create an issue (reported by a normal user)
exports.createIssue = asyncHandler(async (req, res, next) => {
    const { issueType, description, media, location } = req.body;

    // Validate if all required fields are provided
    if (!issueType || !description || !location || !location.latitude || !location.longitude ) {
        return next(new AppError('Please provide all required fields (issueType, description, location).', 400));
    }

    // Create a new issue in the database
    const issue = new Issue({
        reportedBy: req.user._id, // Assuming req.user contains the logged-in user's ID
        issueType,
        description,
        media,
        location
    });

    await issue.save();

    res.status(201).json({
        success: true,
        message: 'Issue reported successfully',
        issue
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
