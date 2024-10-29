const express = require("express");
const router = express.Router();

//Getting the Leave
router.get("/", getReport);

//adding Leaving
router.post("/:id", addReport);

//Updating the Leave
router.patch("/:id", updateReport);

//deleting a Leave
router.delete("/:id", deleteReport);
