const express = require("express");
const router = express.Router();

//import controller
const userController = require('../controller/user-controller')

// Signup User
router.post("/signup", userController.signUp);
// Login User
router.post("/login", userController.logIn);

module.exports = router;
