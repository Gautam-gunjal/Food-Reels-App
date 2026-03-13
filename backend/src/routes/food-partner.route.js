const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const foodPartnerController = require("../controllers/food-partner.controller")

//GET /api/food-partner/
router.get("/:id", authMiddleware.authUserMiddleware, foodPartnerController.getFoodpartnerById)

module.exports = router