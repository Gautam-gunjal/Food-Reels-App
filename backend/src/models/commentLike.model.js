const mongoose = require('mongoose')

const commentLikeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment',
        required:true
    }
}) 

const commentLikeModel  = mongoose.model("commentLike", commentLikeSchema)

module.exports = commentLikeModel; 