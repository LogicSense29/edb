const express = require("express");
const router = express.Router();
const {
  getTask,
  addTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const auth = require("../middleware/auth");

// Authenticate
router.use(auth);
//getting all Task
router.get("/", getTask);

//adding Task
router.post("/:id", addTask);

//editing the todo list
router.patch("/:id", updateTask);

//deleting a todo list
router.delete("/:id", deleteTask);

module.exports = router;
