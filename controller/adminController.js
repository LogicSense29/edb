const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Token function
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
}

const getAdmin = async (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email and password fields must be filled" });
  }

  try {
    const response = await db.query(
      "SELECT admin_id, admin_email, hashed_password FROM admin_edb WHERE admin_email = $1",
      [email]
    );
    if (!response) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      const match = await bcrypt.compare(
        password,
        response.rows[0].hashed_password
      );
      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const id = response.rows[0].id;
      const token = createToken(id);
      return res.status(200).json({ id, email, token, isAdmin: true });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addTasks = async (req, res) => {
  const { task_title, task_description, task_status } = req.body;
  const { id } = req.params;
  try {
    const response = await db.query(
      "INSERT INTO edb_task (task_title, task_description, task_status, edb_id) VALUES($1, $2, $3, $4)",
      [task_title, task_description, task_status, id]
    );
    console.log(response);
    return res.status(200).json({ message: "Successfully added a New Task" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM edb_details CROSS JOIN edb_task"
    );
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "No Task Found" });
    }
    return res.status(200).json({ message: response.rows });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateTasks = async (req, res) => {
  const { task_title, task_description, task_status } = req.body;
  const { id } = req.params;

  try {
    const item_id = await db.query(
      "SELECT task_id FROM edb_task WHERE task_id = $1",
      [id]
    );
    if (item_id.rows.length === 0) {
      return res.status(404).json({ message: "No task with this id" });
    }
    const response = await db.query(
      "UPDATE edb_task SET task_title = $2, task_description = $3, task_status = $4 WHERE edb_id = $1 RETURNING *",
      [id, task_title, task_description, task_status]
    );
    return res.status(200).json({ message: response.rows });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTasks = async (req, res) => {
  const { id } = req.params;

  try {
    const item_id = await db.query(
      "SELECT task_id FROM edb_task WHERE task_id = $1",
      [id]
    );
    if (item_id.rows.length === 0) {
      return res.status(404).json({ message: "No task with this id" });
    }
    const response = await db.query(
      "DELETE FROM edb_task WHERE edb_id = $1 RETURNING *",
      [id]
    );
    return res.status(200).json({ message: response.rows });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAdmin,
  addTasks,
  getTasks,
  updateTasks,
  deleteTasks,
};
