const express = require("express");
const router = express.Router();
const {
  getAdmin,
  getTasks,
  addTasks,
  updateTasks,
  deleteTasks,
} = require("../controller/adminController");
// Admin login route
router.post("/admin/login", getAdmin);
//getting all Task
router.get("/admin-access", getTasks);

//adding Task
router.post("/admin-access/:id", addTasks);

//editing the todo list
router.patch("/admin/:id", updateTasks);

//deleting a todo list
router.delete("/admin/:id", deleteTasks);

module.exports = router;
