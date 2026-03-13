const mongoose = require('mongoose');

const likeschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'food'
    }
})

const likemodel = mongoose.model("likes",likeschema)

module.exports = likemodel
