const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the Exercise Schema
const exerciseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: {
    type: String, 
    required: false 
  },
  duration: { type: Number, required: true }, 
  repetitions: { type: String, required: true }
});

// Define the Program Schema
const programSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  injuryType: { type: String, required: true },
  exercises: [exerciseSchema] 
});

// Export the Program model
module.exports = mongoose.model('Program', programSchema);
