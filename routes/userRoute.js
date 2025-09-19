const express=require('express')
const router=express.Router()

const userController=require('../controllers/userController')


router.get("/register",(req,res)=>res.render('auth/register',
    {error:req.query.error}

))
router.post('/register',userController.registerUser)
router.get("/login",(req,res)=>res.render('auth/login',
    {error:req.query.error}

))
router.post('/login',userController.loginUser)

router.get('/logout',userController.logoutUser)

module.exports=router;