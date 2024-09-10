const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  },
  exercisesCompleted: [
    {
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
      exerciseName: String,
      exerciseIndex: Number,
      completedAt: Date,
    },
  ],
  totalExercises: {
    type: Number,
    required: true,
  },
  completedExercises: {
    type: Number,
    default: 0,
  },
  currentProgress: {
    type: Number, // Optional: to track progress percentage
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
