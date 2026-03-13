const mongoose = require('mongoose');

const commentschema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'food',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    likeCount:{
        type:Number,
        default:0
    }

},{
    timestamps:true
})

const commentmodel = mongoose.model('comment',commentschema)

module.exports = commentmodel