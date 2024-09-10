const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth'); // Adjust the path as necessary
const {
  startProgram,
  completeExercise,
  getProgress,
  getProgressHistory
} = require('../controllers/progressController');

// Middleware to protect routes
router.use(requireAuth);

// Route to start a program and initialize progress
router.post('/start',requireAuth, startProgram);

// Route to complete an exercise within a program
router.post('/:programId/complete-exercise',requireAuth, completeExercise);

// Route to get progress for a specific program
router.get('/:programId', requireAuth,getProgress);

// Route to get progress history for a specific program
router.get('/history/:programId',requireAuth, getProgressHistory);

module.exports = router;
