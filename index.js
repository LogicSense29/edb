const express = require("express");
require("./util/schedule/productivitySchedule");
require("dotenv").config();
const cors = require("cors");
const user = require("./routes/user");
const task = require("./routes/task");
const admin = require("./routes/admin");
const db = require("./db");

const app = express();
const port = process.env.PORT;
db.connect();

//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/user", user);
app.use("/api/task", task);
app.use("/api/admin", admin);

//listen for a request
app.listen(port, () => {
  console.log("listening on port", port);
});
