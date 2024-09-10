const Program=require('../models/programModel')
const mongoose = require('mongoose')

const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find();
        res.json(programs);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
  }

  // Get a program by ID
const getProgramById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the program by ID
    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new program
const createProgram = async (req, res) => {
    try {
      const { name, description, injuryType, exercises } = req.body;
  
      const newProgram = new Program({
        name,
        description,
        injuryType,
        exercises
      });
  
      const savedProgram = await newProgram.save();
      res.status(201).json(savedProgram);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  module.exports={getPrograms,createProgram,getProgramById}