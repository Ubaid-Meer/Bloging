const User=require('../models/userModel')
const bcrypt=require('bcryptjs');
const flash = require('connect-flash');
const nodemailer=require('nodemailer')
const crypto=require('crypto')


const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"ubaid13733@gmail.com",
        pass:"flvy qtef hgsw gsqm",

    }
});


exports.registerUser=async(req,res)=>{
    try {
        const {userName,email,password}=req.body;
        let user=await User.findOne({email})
        if(user) return res.redirect('/auth/register?error=User Already Exist')
        
        const hashedPassword=await bcrypt.hash(password,10);
        user=new User({userName,email,password:hashedPassword})

        await user.save();
        const mailOption={
            from:"ubaid13733@gmail.com",
            to:req.body.email,
            subject:"You have Been Registered For Bloging Page",
            html:`
            <p>Dear User<strong>${req.body.userName}</strong></p>>
            <strong>Thanks Regards Team  </strong>
            `
        }
        transporter.sendMail(mailOption, (err, info) => {
    if (err) {
        console.error(err);
        return res.send("<p>User added but <b>failed to send Email</b></p>");
    } else {
        console.log("Email sent: " + info.response); // server log
        return res.send(`
            <div>
                <b>Register Successfully</b>
                <br>
                <p>Email sent successfully to your Gmail account!</p>
                <a href="/auth/login">Login</a>
            </div>
        `);
    }
});
    } catch (error) {
        console.error(error)
       return res.status(500).send('Registration Failed');

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
        return res.redirect('/')
    } catch (error) {
                console.error(error)
        res.status(500).send('Login Failed');
    }
};

exports.logoutUser=(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send("Logout Failed")
            res.clearCookie('connect.sid')
       return res.redirect('/')
    })
}
// FORGOT PASSWORD
exports.forgotPass = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); // FIXED
        if (!user) {
            return res.redirect('/auth/forgot?error=User Email Not found');
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'ubaid13733@gmail.com',
                pass: 'flvy qtef hgsw gsqm'
            }
        });

        const resetLink = `http://localhost:3000/auth/reset/${token}`;

        await transporter.sendMail({
            to: user.email,
            from: 'ubaid13733@gmail.com',
            subject: "Reset Your Password",
            text: `Click here to reset your password: ${resetLink}`
        });

        return res.redirect('/auth/login?success=Check your email for reset password');
    } catch (error) {
        console.error(error);
        res.redirect('/auth/forgot?error=Something Went Wrong');
    }
};
exports.showResetForm = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect('/auth/forgot?error=Token invalid or expired');
        }

        // Only render the form here
        res.render('auth/reset', { token: req.params.token });
    } catch (err) {
        console.error(err);
        res.redirect('/auth/forgot?error=Something Went Wrong');
    }
};

// RESET PASSWORD
exports.resetPass = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect('/auth/forgot?error=Token invalid or expired');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.redirect('/auth/login?success=Password Reset Successfully');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/forgot?error=Something Went Wrong');
    }
};




