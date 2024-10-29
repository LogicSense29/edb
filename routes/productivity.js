const express = require("express");
const router = express.Router();

//Getting the Leave
router.get("/", getLeave);

//adding Leaving
router.post("/:id", addTask);

//Updating the Leave
router.patch("/:id", updateLeave);

//deleting a Leave
router.delete("/:id", deleteLeave);
