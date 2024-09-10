const express = require('express');
const{createExercise,getExercise,getExercises,updateExercise,deleteExercise}=require('../controllers/userExerciseContoller')


const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)



router.get('/',getExercises)
router.get('/:id',getExercise)
router.post('/',createExercise)
router.put('/:id',updateExercise)
router.delete('/:id',deleteExercise)


module.exports=router