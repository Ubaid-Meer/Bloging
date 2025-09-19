const express=require('express')
const app=express();
const flash=require("connect-flash")
const path=require('path')
const PORT=3000;
const session=require('express-session')

// Import routes
const connectDB=require('./configuration/db')
const userRoute=require('./routes/userRoute')
const postRoute=require('./routes/postRoute')
const Post=require('./models/postModel')


connectDB();


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("public"))

// ejs setup
app.set("view engine","ejs")
app.set('views',path.join(__dirname, "views"))


// session setup
app.use(
    session({
        secret:"blog-page-secret",
        resave:false,
        saveUninitialized:false
    })
);

app.use(flash())

// Flash + session
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.messages=req.flash()
    next()
});
app.get('/',async(req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt:-1});
        res.render('home',{posts})
    } catch (error) {
        console.error(error)
        res.redirect('home',{pots:[]})
    }
});
app.use('/auth',userRoute)
app.use('/posts',postRoute)



app.listen(PORT,()=>
    console.log(`Server is running at http://localhost:${PORT}`)
)