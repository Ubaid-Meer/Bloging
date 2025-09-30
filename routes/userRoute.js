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

router.get('/forgot',(req,res)=>res.render('auth/forgot'))
router.post('/forgot',userController.forgotPass)

// router.get('/reset/:token',(req,res)=>res.render('auth/reset'))
router.get('/reset/:token',userController.showResetForm)
router.post('/reset/:token',userController.resetPass)
module.exports=router;