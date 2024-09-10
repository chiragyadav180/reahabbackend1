const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userExerciseSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  repetitions: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Add this line
}, { timestamps: true });

module.exports = mongoose.model('UserExercise', userExerciseSchema);
