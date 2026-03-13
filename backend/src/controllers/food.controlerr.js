const foodmodel = require("../models/food.model")
const likemodel = require('../models/like.model')
const savemodel = require('../models/save.model')
const commentmodel = require('../models/comment.model')
const commentLikemodel = require('../models/commentLike.model')
const storageservice = require("../services/storage.service")
const { v4: uuid } = require("uuid")

async function createfood(req, res) {

    try {
        const fileUploadresult = await storageservice.uploadfile(req.file.buffer, uuid())

        const fooditem = await foodmodel.create({
            name: req.body.name,
            video: fileUploadresult.url,
            description: req.body.description,
            foodPartner: req.foodPartner._id
        })
        res.status(201).json({
            message: "Food-Item created successfully",
            fooditem: fooditem
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Upload failed",
            error: err.message
        });
    }
}

async function getFooditems(req, res) {
    const fooditems = await foodmodel.find({});
    res.status(200).json({
        message: "Food Items Fetched successfully",
        fooditems: fooditems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadyLiked = await likemodel.findOne({
        userId: user._id,
        foodId: foodId
    })

    if (isAlreadyLiked) {
        await likemodel.deleteOne({
            userId: user._id,
            foodId: foodId
        })

        await foodmodel.findByIdAndUpdate(
            foodId,
            { $inc: { likeCount: -1 } }, { new: true }
        )

        return res.status(200).json({
            message: "Food Unliked Successfully"
        })
    }

    const liked = await likemodel.create({
        userId: user._id,
        foodId: foodId
    })

    await foodmodel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: 1 } }, { new: true }
    )

    res.status(201).json({
        message: 'Food Liked Successfully',
        liked
    })
}

async function savefood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await savemodel.findOne({
        userId: user._id,
        foodId: foodId
    })

    if (isAlreadySaved) {
        await savemodel.deleteOne({
            userId: user._id,
            foodId: foodId
        })

        await foodmodel.findByIdAndUpdate(
            foodId, { $inc: { saveCount: -1 } }, { new: true }
        )

        return res.status(200).json({
            message: 'Food Unsaved successfully'
        })
    }

    const saved = await savemodel.create({
        userId: user._id,
        foodId: foodId
    })

    await foodmodel.findByIdAndUpdate(
        foodId, { $inc: { saveCount: 1 } }, { new: true }
    )

    return res.status(201).json({
        message: 'Food saved successfully',
        saved
    })
}

async function CommentFood(req, res) {
    const { foodId, text } = req.body
    const user = req.user

    const comment = await commentmodel.create({
        userId: user._id,
        foodId: foodId,
        text: text
    })

    await foodmodel.findByIdAndUpdate(foodId, { $inc: { commentCount: 1 } }, { new: true })

    const populatecomment = await commentmodel.findById(comment._id).populate('userId', 'name');

    res.status(201).json({
        message: 'Comment added successfully',
        comment: populatecomment
    })
}

async function commentLike(req, res) {
    const { commentId } = req.body
    const user = req.user;

    const isAlreadyLiked = await commentLikemodel.findOne({
        userId: user._id,
        commentId: commentId
    })

    if (isAlreadyLiked) {
        await commentLikemodel.deleteOne({
            userId: user._id,
        commentId: commentId
        })

        await commentmodel.findByIdAndUpdate(commentId, { $inc: { likeCount: -1 } })

        return res.json({
            message: 'Comment Unliked'
        })
    }

    const commentLiked = await commentLikemodel.create({
        userId: user._id,
        commentId: commentId
    })

    await commentmodel.findByIdAndUpdate(commentId, { $inc: { likeCount: 1 } })

    res.status(201).json({
        message: "Comment Liked",
        commentLiked
    })
}

async function getFoodComments(req, res) {
    const { foodId } = req.params

    const comments = await commentmodel.find({ foodId }).populate('userId', 'name').sort({ createdAt: -1 });

    res.status(200).json({
        message: "Comments fetched successfully",
        comments
    })
}

async function getSavedfoods(req, res) {
    const user = req.user;
    const savedfoods = await savemodel.find({ userId: user.id }).populate('foodId')

    if (!savedfoods) {
        return res.status(404).json({
            message: 'No Saved Foods Found'
        })
    }

    return res.status(200).json({
        message: 'Saved Foods fetched successfully',
        savedfoods
    })
}
module.exports = {
    createfood, getFooditems, likeFood, savefood,
    getSavedfoods, CommentFood, getFoodComments, commentLike
}