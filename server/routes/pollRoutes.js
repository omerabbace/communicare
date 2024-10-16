const express = require('express');
const { createPoll, getPolls, getPollById,toggleVotes } = require('../controllers/pollController');
const { isLogin } = require('../middlewares/isLogin');

const router = express.Router();

// Protect all routes with admin authorization middleware
router.use(isLogin);

// Create Poll
router.post('/', createPoll);

// Get All Polls
router.get('/', getPolls);

// Get Poll by ID
router.get('/:id', getPollById);

router.patch('/:id/disable-votes', toggleVotes);

module.exports = router;
