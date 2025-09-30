const { text } = require('express');
const mongoose=require('mongoose')


const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    createdAt:{type:Date,default:Date.now},

    comments:[
        {

            text:{
                type:String,
                required:true
            },
            author:{type:String,required:true},
            createdAt:{type:Date,default:Date.now}
        }
    ]
},{timestamps: true});

module.exports=mongoose.model("Post",postSchema)