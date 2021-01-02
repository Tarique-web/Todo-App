
const express = require("express");
const router = express.Router();
const UsersController = require("../controller/loginController");
router.post("/", UsersController.login);

module.exports = router;
