
const express = require("express");
const router = express.Router();
const UsersController = require("../controller/cityController");
router.post("/", UsersController.city);
router.get("/getCity",UsersController.getCity)

module.exports = router;