const express = require('express');
const { createCharityProject, getCharityProjects,toggleCharityProjectStatus,
    updateCharityProjectTitle , getCharityEnabledProjects} = require('../controllers/charityProjectController');
const { isLogin } = require('../middlewares/isLogin'); // Auth middleware

const router = express.Router();

// Route to create a new charity project (Admin only)
router.post('/create', isLogin, createCharityProject);

// Route to get all charity projects (Accessible by any authenticated user)
router.get('/', isLogin, getCharityProjects);

router.get('/enabled', isLogin, getCharityEnabledProjects);

router.patch('/:projectId/toggle-status', isLogin, toggleCharityProjectStatus);

router.patch('/:projectId/update-title',isLogin, updateCharityProjectTitle);

module.exports = router;
