const mongoose = require('mongoose');

async function connectdb(){
   
    try{
         await mongoose.connect(process.env.MONGODB_URL);
         console.log("DB connected")
    } catch(err){
        console.log(err)
    }
}

module.exports=connectdb;