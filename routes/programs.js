const express=require('express')

const {getPrograms,createProgram,getProgramById}=require('../controllers/programController')

const router=express.Router()


router.get('/',getPrograms)

// GET a program by ID
router.get('/:id', getProgramById);

router.post('/',createProgram)




module.exports=router