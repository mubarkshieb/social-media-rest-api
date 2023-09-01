const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user-model");

//View User
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .exec()
        .then(user => {
            res.status(200).json({
                Message: 'Success',
                User: user
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                Error: err
            });
        });
});
//follow User
router.put('/:id/follow', async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push: { followings: req.params.id } })
                res.status(200).json('user was followed success')
            } else {
                res.status(403).json('user is already followed')
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('cant follow this user')
    }
});
//Unfollow User
router.put('/:id/unfollow', async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json('user was unfollowed success')
            } else {
                res.status(403).json('user is already followed')
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json('cant follow this user')
    }
});

module.exports = router;