const mongoose = require("mongoose");

//import post model
const Post = require("../models/post-model");

// Create a post
exports.CreatePost = (req, res, next) => {
    const post = new Post(req.body);
    post
        .save()
        .then((createPost) => {
            res.status(201).json({
                Message: "post added",
                Record: createPost,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                Error: err,
            });
        });
};
// View a post
exports.viewPost = async (req, res, next) => {
    try {
        const post = Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
//update post
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json({
                Message: "Post Was updated Successfuly",
            });
        } else {
            res.status(403).json("You can't update This post");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            Error: err,
        });
    }
};
//delete a post
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json({
                Message: "Post has been  Successfuly",
            });
        } else {
            res.status(403).json("You can't delete This post");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            Error: err,
        });
    }
};
//like post
exports.likeAndUnlikePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("you liked this post");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("you Unliked this post!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
//timeline
exports.timeline = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({ userId: currentUser._id });
        const friendPost = await Promise.all(
            currentUser.followigs.map((friendId) => {
                Post.find({ userId: friendId });
            })
        );
        res.json(userPost.concat(...friendPost));
    } catch (err) {
        res.status(500).json(err);
    }
};
