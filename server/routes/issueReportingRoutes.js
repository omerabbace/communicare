const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueReportingController');
const { isAdmin, isVolunteer } = require('../middlewares/authorization'); 
const {isLogin} = require('../middlewares/isLogin');

// Route for normal users to report an issue
router.post('/report', isLogin, issueController.createIssue);

// Route for admin to get all issues
router.get('/admin/issues', isLogin,  issueController.getAllIssues);

// Route for volunteers to provide progress updates
router.post('/progress', isLogin, isVolunteer, issueController.addProgress);

// Route for the team leader to report task completion
router.post('/complete-task', isLogin, isVolunteer, issueController.completeTask);

// Route for admin to report task status back to the normal user
router.get('/task-status/:issueId', isLogin, isVolunteer, issueController.reportTaskStatus);

// Route for leader to reassign leadership
router.put('/reassign-leader', isLogin, isVolunteer, issueController.reassignLeader);

// Route for volunteers to leave the task
router.put('/leave-task', isLogin, isVolunteer, issueController.leaveTask);

// Route for the leader to leave the task after reassigning leadership
router.put('/leader-leave-task', isLogin, isVolunteer, issueController.leaderLeaveTask);
// Route for admin to set the number of required volunteers and push notifications to volunteers
router.put('/set-required-volunteers', isLogin, isAdmin, issueController.setRequiredVolunteers);

// Route for volunteers to accept a task
router.put('/accept-volunteer', isLogin, isVolunteer, issueController.acceptVolunteerRequest);


// Route for volunteers to get their assigned issues
router.get('/volunteer/issues', isLogin, isVolunteer, issueController.getAssignedIssues);

// Route for getting a specific issue's details (Admin or Volunteer)
router.get('/issue/:issueId', isLogin, issueController.getIssueById);

// Route for a normal user to check the status of a specific issue they reported
router.get('/user/task-status/:issueId', isLogin, issueController.getTaskStatus);

// Route for a normal user to get all the issues they have reported
router.get('/user/reported-issues', isLogin, issueController.getUserReportedIssues);
module.exports = router;
