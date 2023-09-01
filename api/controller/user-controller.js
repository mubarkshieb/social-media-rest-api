require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//import model
const User = require("../models/user-model");

//signup User
exports.signUp = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email is Already Exicts",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hashedpassword) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            Error: err,
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedpassword,
                        });
                        user
                            .save()
                            .then((signup) => {
                                console.log(signup);
                                res.status(201).json({
                                    message: "Congratulations, User was Created Successfuly.",
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    Message: "Somthing Was wrong with Signing up",
                                    error: err,
                                });
                            });
                    }
                });
            }
        });
}
//login User
exports.logIn = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length < 1) {
                return res.status(401).json({
                    massage: "Wrong Email Address or Password",
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        massage: "Wrong Email Address or Password",
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        { email: user[0].email, id: user[0]._id },
                        process.env.secrit_Key,
                        { expiresIn: "5m" }
                    );
                    return res.status(200).json({
                        message: "User is Loged In Successfull ",
                        token: token,
                    });
                }
                return res.status(401).json({
                    massage: "Somthing went wrong try again",
                });
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Somthing wrong",
                error: err,
            });
        });
}