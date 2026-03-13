const express = require("express");
const multer = require("multer");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const foodcontroller = require("../controllers/food.controlerr")
const upload = multer({ storage:multer.memoryStorage() })

//Post /api/food/ [protected]
router.post("/",authMiddleware.authFoodPartnerMiddleware,upload.single("video"),foodcontroller.createfood)

//GET /api/food/ [protected]
router.get("/",authMiddleware.authUserMiddleware,foodcontroller.getFooditems)

//Post /api/food/like [protected] 
router.post('/like',authMiddleware.authUserMiddleware,foodcontroller.likeFood)

//Post /api/food/save [protected] 
router.post('/save',authMiddleware.authUserMiddleware,foodcontroller.savefood)

//Get /api/food/SavedFoods [protected]
router.get('/SavedFoods',authMiddleware.authUserMiddleware,foodcontroller.getSavedfoods)

//Post /api/food/CommentFood [protected]
router.post('/CommentFood' , authMiddleware.authUserMiddleware,foodcontroller.CommentFood)

//Post /api/food/commentLike [protected]
router.post('/commentLike',authMiddleware.authUserMiddleware, foodcontroller.commentLike)

//Get /api/food/Comments/:foodId [protected]
router.get('/Comments/:foodId', foodcontroller.getFoodComments)


module.exports=router;