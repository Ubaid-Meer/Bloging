const mongoose=require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/bloging')
        console.log("Database Created")
        
    } catch (error) {
        console.error(error)
        console.log("Failed to connect Database")
    }

}


module.exports=connectDB