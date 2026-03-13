const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
    Businessname: {
        type: String,
        required: true
    },
    Contactperson: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})

const foodPartnermodel = mongoose.model("foodPartner", foodPartnerSchema)

module.exports = foodPartnermodel;