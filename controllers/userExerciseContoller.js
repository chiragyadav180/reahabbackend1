const UserExercise = require('../models/userExerciseModel');

// Get all exercises for the logged-in user
const getExercises = async (req, res) => {
  const userId = req.user._id; // Assume the user's ID is available from the authentication middleware
  try {
    const exercises = await UserExercise.find({ userId }).sort({ createdAt: -1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get exercise by ID (only if it belongs to the logged-in user)
const getExercise = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const exercise = await UserExercise.findOne({ _id: id, userId });
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new exercise and link it to the logged-in user
const createExercise = async (req, res) => {
  const { name, duration, repetitions } = req.body;
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    const newExercise = new UserExercise({ name, duration, repetitions, userId });
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an exercise (only if it belongs to the logged-in user)
const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, duration, repetitions } = req.body;
  const userId = req.user._id;

  try {
    const updatedExercise = await UserExercise.findOneAndUpdate(
      { _id: id, userId }, // Ensure the exercise belongs to the user
      { name, duration, repetitions },
      { new: true }
    );
    if (!updatedExercise) {
      return res.status(404).json({ error: 'Exercise not found or not authorized' });
    }
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an exercise (only if it belongs to the logged-in user)
const deleteExercise = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deletedExercise = await UserExercise.findOneAndDelete({ _id: id, userId });
    if (!deletedExercise) {
      return res.status(404).json({ error: 'Exercise not found or not authorized' });
    }
    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExercise,
  getExercises,
  getExercise,
  updateExercise,
  deleteExercise
};
