const mongoose = require('mongoose');

const saveschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true
    }
}, { timestamps: true })

const savemodel = mongoose.model("save", saveschema)

module.exports = savemodel;