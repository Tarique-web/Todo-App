
const express = require("express");
const router = express.Router();
const UsersController = require("../controller/signupController");
const service = require("../service/logic")


router.post("/", UsersController.signup);

module.exports = router;