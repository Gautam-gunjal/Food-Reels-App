const foodpartnermodel = require("../models/foodPartner.model")
const Usermodel = require("../models/user.model")
const jwt = require('jsonwebtoken')

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Please Login First"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodpartner = await foodpartnermodel.findById(decoded.id)
        req.foodPartner = foodpartner;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Please Login First"
        })
    }

    try {

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await Usermodel.findById(decoded.id)
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }

}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}