
const express = require("express");
const router = express.Router();
const UsersController = require("../controller/todoController");
router.post("/", UsersController.createTodo);
router.get('/mytodos',UsersController.mytodos);
router.get('/getTodo',UsersController.getTodo);

module.exports = router;