const db = require("../db");
const jwt = require("jsonwebtoken");

const addTask = async (req, res) => {
  const { task_title } = req.body;
  const { id } = req.params;
  try {
    const response = await db.query(
      "INSERT INTO edb_task (task_title, edb_id) VALUES($1, $2) RETURNING task_id",
      [task_title, id]
    );
    console.log("Successfully added a New Task");

    // Extract the task_id from the response
    const { task_id } = response.rows[0];
    try {
      const tasks = await db.query(
        "SELECT * FROM edb_task WHERE task_id = $1",
        [task_id]
      );
      const singleTaskAdded = tasks.rows;
      console.log(singleTaskAdded);
      return res.status(200).json(singleTaskAdded);
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json("Internal server error");
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Internal server error");
  }
};

const getTask = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await db.query(
      "SELECT * FROM edb_task WHERE edb_id = $1",
      [id]
    );
    if (response.rows.length === 0) {
      return res.status(404).json("No Task Found");
    }
    const productivityList = db.query(
      " SELECT productivity_percent FROM productivity"
    );
    const productivity_percentage = productivityList.rows;
    return res.status(200).json(response.rows);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Internal server error");
  }
};

const updateTask = async (req, res) => {
  const { task_title, task_status } = req.body;
  const { id } = req.params;

  try {
    const item_id = await db.query(
      "SELECT task_id FROM edb_task WHERE task_id = $1",
      [id]
    );
    if (item_id.rows.length === 0) {
      return res.status(404).json("No task with this id");
    }
    const response = await db.query(
      "UPDATE edb_task SET task_title = $2, task_status = $3 WHERE task_id = $1 RETURNING *",
      [id, task_title, task_status]
    );
    return res.status(200).json(response.rows);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Internal server error");
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const item_id = await db.query(
      "SELECT task_id FROM edb_task WHERE task_id = $1",
      [id]
    );
    if (item_id.rows.length === 0) {
      return res.status(404).json("No task with this id");
    }
    const response = await db.query(
      "DELETE FROM edb_task WHERE task_id = $1 RETURNING *",
      [id]
    );
    return res.status(200).json(response.rows);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  addTask,
  getTask,
  updateTask,
  deleteTask,
};
