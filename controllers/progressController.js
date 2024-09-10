const Progress = require('../models/progressModel');
const Program = require('../models/programModel');
const ProgressHistory = require('../models/progressHistory');
const mongoose = require('mongoose');

// Start a program and initialize progress for the logged-in user
const startProgram = async (req, res) => {
  try {
    const { programId } = req.body;
    const userId = req.user._id; // Get userId from the authentication middleware

    // Validate programId format
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ message: 'Invalid program ID format' });
    }

    // Check if the program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check if progress already exists for this user and program
    const existingProgress = await Progress.findOne({ userId, programId });
    if (existingProgress) {
      return res.status(400).json({ message: 'Progress already started for this program' });
    }

    // Create a new progress document
    const progress = new Progress({
      userId,
      programId: program._id,
      totalExercises: program.exercises.length,
      completedExercises: 0,
      exercisesCompleted: [],
    });

    await progress.save();

    res.status(201).json({ message: 'Program started successfully', progress });
  } catch (error) {
    console.error('Error starting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark an exercise as completed for a specific user and program
const completeExercise = async (req, res) => {
  try {
    const { programId } = req.params;
    const { exerciseId, exerciseName } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      console.error('User ID missing in request');
      return res.status(400).json({ message: 'User not authenticated or user ID missing' });
    }

    if (!mongoose.Types.ObjectId.isValid(programId) || !mongoose.Types.ObjectId.isValid(exerciseId)) {
      console.error('Invalid ID format:', { programId, exerciseId });
      return res.status(400).json({ message: 'Invalid program or exercise ID format' });
    }

    const progress = await Progress.findOne({ userId, programId });
    if (!progress) {
      console.error('Progress not found for:', { userId, programId });
      return res.status(404).json({ message: 'Progress not found for this program' });
    }

    const alreadyCompleted = progress.exercisesCompleted.some(
      (exercise) => exercise.exerciseId.toString() === exerciseId
    );
    if (alreadyCompleted) {
      console.error('Exercise already completed:', { exerciseId });
      return res.status(400).json({ message: 'Exercise already completed' });
    }

    progress.exercisesCompleted.push({
      exerciseId,
      exerciseName,
      completedAt: new Date(),
    });
    progress.completedExercises += 1;
    progress.currentProgress = (progress.totalExercises > 0)
      ? (progress.completedExercises / progress.totalExercises) * 100
      : 0;
    progress.lastUpdated = new Date();

    await progress.save();

    res.json({ message: 'Exercise completed successfully', progress });
  } catch (error) {
    console.error('Error completing exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get progress for a specific user and program
// Example of error handling in backend
const getProgress = async (req, res) => {
  try {
    const { programId } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ message: 'Invalid program ID format' });
    }

    // Fetch progress for the current user and program
    const progress = await Progress.findOne({ userId, programId });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found for this program' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get progress history for a specific program and user
const getProgressHistory = async (req, res) => {
  const { programId } = req.params;
  const userId = req.user._id;

  // Validate programId format
  if (!programId || !mongoose.Types.ObjectId.isValid(programId)) {
    return res.status(400).json({ error: 'Invalid program ID format' });
  }

  try {
    // Fetch the history for the user and program
    const history = await ProgressHistory.find({ programId, userId }).sort({ date: -1 });
    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No progress history found for this program' });
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching progress history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  startProgram,
  completeExercise,
  getProgress,
  getProgressHistory,
};
