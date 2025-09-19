module.exports=(req,res,next)=>{
    if(!req.session.user){
        req.flash("Error: You must be Login First")
        res.redirect('/auth/login');

    }
    next()
}
    