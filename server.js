require('dotenv').config()

const cors = require('cors');
const cron = require('node-cron');
const express = require('express')
const mongoose = require('mongoose')
const programRoutes=require('./routes/programs')
const progressRoutes = require('./routes/progress');
const exerciseRoutes = require('./routes/userexercise');
const userRoutes = require('./routes/user');
const Progress = require('./models/progressModel');
const ProgressHistory = require('./models/progressHistory');
const User = require('./models/userModel');

const PORT = process.env.PORT || 4000;

// express app
const app = express()

app.use(express.json());
app.use(cors()); 



cron.schedule('0 0 * * * *', async () => {
  try {
    // Fetch all users
    const allUsers = await User.find({});
    
    for (let user of allUsers) {
      // Fetch progress for each user
      const allProgress = await Progress.find({ userId: user._id });

      for (let progress of allProgress) {
        // Save current progress to history
        await ProgressHistory.create({
          programId: progress.programId,
          exercisesCompleted: progress.exercisesCompleted.map(e => ({
            exerciseId: e.exerciseId,
            completedAt: e.completedAt
          })),
          date: new Date(),
          userId: user._id // Include user ID in progress history
        });

        // Reset the current progress
        progress.exercisesCompleted = [];
        await progress.save();
      }
    }
    console.log('Progress reset every 24 hours and history saved for all users.');
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
});


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


// routes

app.use('/api/programs',programRoutes)
// app.use('/api/programs',programRoutes)


app.use('/api/progress', progressRoutes);

app.use('/api/userexercise',exerciseRoutes)


app.use('/api/user',userRoutes)




// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`connected to the db And listening on port ${PORT}`)
        })
    })
    .catch((error)=>{
        console.log(error)
    })