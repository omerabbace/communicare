const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueReportingController");
const { isAdmin, isVolunteer } = require("../middlewares/authorization");
const { isLogin } = require("../middlewares/isLogin");
const upload = require("../middlewares/upload");
// Route for normal users to report an issue
router.post("/report", isLogin, issueController.createIssue);

// Route for admin to get pending issues ///
router.get("/admin/issues", isLogin, isAdmin, issueController.getAllIssues);

// Route for admin to set the number of required volunteers and push notifications to volunteers
router.put(
  "/set-required-volunteers",
  isLogin,
  isAdmin,
  issueController.setRequiredVolunteers
);
// Route for the volunteers to fetch the issues which requires volunteers
router.get(
  "/issues/requiring-volunteers",
  isLogin,
  issueController.getIssuesRequiringVolunteers
);

// Route for volunteers to accept a task
router.put(
  "/accept-volunteer",
  isLogin,
  isVolunteer,
  issueController.acceptVolunteerRequest
);
// check whtether its leader or not
router.get("/check-leader-status", isLogin, issueController.checkLeaderStatus);
// Route to get all leader issues
router.get(
  "/leader-issues",
  isLogin,
  isVolunteer,
  issueController.getLeaderIssues
);
// Route to get completed tasks where the user is the leader
router.get(
  "/issues/leader/completed",
  isLogin,
  issueController.getCompletedLeaderTasks
);
// get issues which ar in progress
router.get(
  "/issues/in-progress",
  isLogin,
  isAdmin,
  issueController.getInProgressIssues
);
// router.get('/issues/completed', isLogin, isAdmin, issueController.getCompletedIssues);
// Route to get all volunteer issues
router.get(
  "/volunteer-issues",
  isLogin,
  isVolunteer,
  issueController.getVolunteerIssues
);

// Route for assigning a sub-task
router.post(
  "/issues/:issueId/assign-sub-task",
  isLogin,
  issueController.assignSubTask
);

router.get(
  "/issues/:issueId/sub-tasks",
  isLogin,
  issueController.getAssignedSubTasks
);
// Route for volunteers to report on a sub-task
router.post(
  "/issues/:issueId/sub-tasks/:subTaskId/report",
  isLogin,
  issueController.reportOnSubTask
);

// Route to get all reports for a specific sub-task
router.get(
  "/issues/:issueId/sub-tasks/:subTaskId/reports",
  isLogin,
  issueController.getSubTaskReports
);
// to get report for specific subtask
router.get(
  "/issues/:issueId/sub-tasks/:subTaskId/volunteer-reports",
  isLogin,
  issueController.getVolunteerReportsForSubTask
);
// PUT route to update sub-task status
router.put(
  "/issues/:issueId/sub-tasks/:subTaskId/update-status",
  isLogin,
  issueController.updateSubTaskStatus
);
// Route for getting a specific issue's details (Admin or Volunteer)
router.get("/issue/:issueId", isLogin, issueController.getIssueById);
// Route for volunteers to provide progress updates
router.post("/progress", isLogin, isVolunteer, issueController.addProgress);
router.get(
  "/in-progress-issues-reports",
  isLogin,
  isAdmin,
  issueController.getInProgressIssuesWithUpdates
);

// Route for the team leader to report task completion
router.post(
  "/complete-task",
  isLogin,
  isVolunteer,
  issueController.completeTask
);
// Route to get the task completion report
router.get(
  "/completed-issues",
  isLogin,
  isAdmin,
  issueController.getCompletedIssues
);
// Routes to get progress about the task

router.get("/progress/:issueId", isLogin, issueController.getProgressUpdates);

// Route for admin to report final task status back to the normal user
router.post("/task-status/:issueId", isLogin, issueController.reportTaskStatus);
// Route to get the admin report for a final task status back to the normal user
router.get(
  "/user/reported-issues",
  isLogin,
  issueController.getUserReportedIssues
);

// Route for leader to reassign leadership
router.put(
  "/reassign-leader",
  isLogin,
  isVolunteer,
  issueController.reassignLeader
);

// Route for volunteers to leave the task
router.put("/leave-task", isLogin, isVolunteer, issueController.leaveTask);

// Route for the leader to leave the task after reassigning leadership
router.put(
  "/leader-leave-task",
  isLogin,
  isVolunteer,
  issueController.leaderLeaveTask
);
// Route for volunteers to get their assigned issues
router.get(
  "/volunteer/issues",
  isLogin,
  isVolunteer,
  issueController.getAssignedIssues
);

// Route for a normal user to check the status of a specific issue they reported
router.get(
  "/user/task-status/:issueId",
  isLogin,
  issueController.getTaskStatus
);

// Route for a normal user to get all the issues they have reported
router.get(
  "/user/reported-issues",
  isLogin,
  issueController.getUserReportedIssues
);

// Route for rejecting an issue
router.put("/issues/:issueId/reject", isLogin, issueController.rejectIssue);
// to get rejected issues
router.get("/issues/rejected", isLogin, issueController.getRejectedIssues);

// Route to get statistics for a volunteer leader
router.get(
  "/volunteer-leader/stats",
  isLogin,
  issueController.getVolunteerLeaderStats
);

// Route to fetch user issue stats
router.get("/user/stats", isLogin, issueController.getUserIssueStats);

router.get("/dashboard-data", issueController.getDashboardData)

// Route for updating a sub-task
// router.put('/issues/:issueId/sub-tasks/:subTaskId/update', updateSubTask);

// Route for updating sub-task progress
// router.put('/issues/:issueId/sub-tasks/:subTaskId/progress', updateSubTaskProgress);

module.exports = router;
