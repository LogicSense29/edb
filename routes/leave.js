const express = require("express");
const router = express.Router();

//Getting the Leave
router.get("/leave", getLeave);

//adding Leaving
router.post("/leave/:id", addTask);

//Updating the Leave
router.patch("/leave/:id", updateLeave);

//deleting a Leave
router.delete("/leave/:id", deleteLeave);
