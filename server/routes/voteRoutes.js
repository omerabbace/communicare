// routes/voteRoutes.js
const express = require('express');
const { castVote, getVotes, updateVote, getVotesWithCount } = require('../controllers/voteController');
const {isLogin} = require('../middlewares/isLogin');  // Assuming you have auth middleware

const router = express.Router();

// Route to cast a vote
router.post('/cast', isLogin, castVote);

// Route to get votes for a specific poll
router.get('/:pollId', isLogin, getVotes);

// route to update vote
router.patch('/update', isLogin, updateVote);

// routes/voteRoutes.js
router.get('/count/:pollId', isLogin, getVotesWithCount);

module.exports = router;
