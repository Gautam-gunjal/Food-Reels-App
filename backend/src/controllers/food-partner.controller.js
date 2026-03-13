const foodPartnerModel = require("../models/foodPartner.model")
const foodmodel = require("../models/food.model")

async function getFoodpartnerById(req, res) {
    const id = req.params.id

    const foodpartner = await foodPartnerModel.findById( id )
    const fooditems = await foodmodel.find({ foodPartner: id })

    if (!foodpartner) {
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }

    res.status(200).json({
        message: "Food Partner retrive successfully",
        foodpartner: {
            ...foodpartner.toObject(),
            fooditems
        }
    })
}

module.exports = {
    getFoodpartnerById
}