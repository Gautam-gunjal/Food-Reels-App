const express = require ("express");
const router = express.Router();
const authController = require("../controllers/auth.controller")

//user auth APIs
router.post("/user/register",authController.registeruser)
router.post('/user/login', authController.loginuser)
router.post("/user/logout",authController.logoutuser)

//food-patner auth APIs
router.post("/food-partner/register",authController.registerfoodPartner)
router.post("/food-partner/login",authController.loginfoodPartner)
router.get("/food-partner/logout",authController.foodPartnerlogout)


//Role Detection
router.get('/role',authController.RoleDetection)
module.exports=router;