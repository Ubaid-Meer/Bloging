const Post=require('../models/postModel')

// show all post
exports.getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt:-1})
        return res.render('home',{posts})

    } catch (error) {
        console.error(error)
       return res.redirect('/')
    }
};

// show Create form
exports.getCreatePost=(req,res)=>{
    res.render('create')

};

// post the blog
exports.createPost=async(req,res)=>{
    try {
        if(!req.session.user){
            req.flash("Error: You must Be Login")
           return res.redirect('/auth/login')

        }
        const {title,content}=req.body;
        await Post.create({
            title,
            content,
            author:req.session.user.userName,
        });
        req.flash('Success', 'Post Created')
       return res.redirect('/')
    } catch (error) {   
        console.error(error)
      return  res.redirect('/posts/create')
    }
}


// get single post 
exports.getSinglePost=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        return res.render('post',{post})
    } catch (error) {
         console.error(error)
        return res.redirect('/')
    }
}

exports.getEditPost=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        res.render('edit',{post})
    } catch (error) {
         console.error(error)
       return res.redirect('/')
    }
}

// update post\
exports.updatePost=async(req,res)=>{
    try {
        const {title,content}=req.body
        await Post.findByIdAndUpdate(req.params.id,{title,content});
        return res.redirect(`/posts/${req.params.id}`);

    } catch (error) {
         console.error(error)
       return res.redirect(`/posts/edit/${req.params.id}`)
    }
};

exports.deletePost=async(req,res)=>{
    try {
        await Post.findByIdAndDelete(req.params.id)
       return res.redirect('/')
    } catch (error) {
         console.error(error)
       return res.redirect('/')
    }
}

//Comments controll


exports.addComment=async(req,res)=>{
    try {
        
        if(!req.session.user){
            req.flash("error","Login First Please");
            res.redirect('/auth/login')
        }
        
        const post=await Post.findById(req.params.id);
        
        if(!post){
            req.flash('error',"Post not Found")
            res.redirect('/')
        }
        
        post.comments.push({
            text:req.body.text,
            author:req.session.user.userName
            
        })
        await post.save();
        
        req.flash('success',"Comment Added Successfully")
        req.redirect(`/posts/${req.params.id}`);
        
    } catch (error) {
        console.error(error)
        res.redirect(`/posts/${req.params.id}`)
    }
}