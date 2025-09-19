const User=require('../models/userModel')
const bcrypt=require('bcryptjs')

exports.registerUser=async(req,res)=>{
    try {
        const {userName,email,password}=req.body;
        let user=await User.findOne({email})
        if(user) return res.redirect('/auth/register?error=User Already Exist')
        
        const hashedPassword=await bcrypt.hash(password,10);
        user=new User({userName,email,password:hashedPassword})

        await user.save();
        res.redirect('/auth/login')
    } catch (error) {
        console.error(error)
        res.status(500).send('Registration Failed');

    }
}

//login 

exports.loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user) return res.redirect('/auth/login?error=Invalid Email')
        const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch) return res.redirect('/auth/login?error=Invalid Password')
        req.session.user={id:user._id,userName:user.userName};
        res.redirect('/')
    } catch (error) {
                console.error(error)
        res.status(500).send('Login Failed');
    }
};

exports.logoutUser=(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send("Logout Failed")
            res.clearCookie('connect.sid')
        res.redirect('/')
    })
}