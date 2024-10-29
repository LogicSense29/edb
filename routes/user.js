const express = require("express");
const router = express.Router();
const { addUsers, getUsers } = require("../controller/userController");

router.post("/signup", addUsers);

router.post("/login", getUsers);

module.exports = router;
