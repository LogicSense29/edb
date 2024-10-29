const db = require("../db");
const jwt = require("jsonwebtoken");

const getLeave = async (req, res) => {
  const { id } = req.user;
  try {
    const leave_details = await db.query(
      "SELECT * FROM edb_leave WHERE employee_id = $1",
      [id]
    );
    const leave = leave_details.rows;
    res.status(200).json({ message: leave });
  } catch (err) {
    console.error("eRROR gETTING LEAVE", err);
    res.status(400).json({ message: "Error getting leave" });
  }
};

const addLeave = async (req, res) => {
  const { leave_start_date, leave_end_date } = req.body;
  const { id } = req.params;
  try {
    const leave_details = await db.query(
      "INSERT INTO edb_leave (leave_start_date, leave_end_date, employee_id) VALUES($1, $2, $3) RETURNING task_id",
      [leave_start_date, leave_end_date, id]
    );
    const leave = leave_details.rows;
    res.status(200).json({ message: leave });
  } catch (err) {
    console.error("Error Adding Leave", err);
    res.status(400).json({ message: "Error getting leave" });
  }
};

const updateLeave = async (req, res) => {
  const { leave_start_date, leave_end_date } = req.body;
  const { id } = req.params;
  try {
    const leave_details = await db.query(
      "UPDATE edb_leave SET leave_start_date = $2,leave_end_date= $3 WHERE employee_id = $1 RETURNING *",
      [leave_start_date, leave_end_date, id]
    );
    const leave = leave_details.rows;
    res.status(200).json({ message: leave });
  } catch (err) {
    console.error("Error Updating Leave", err);
    res.status(400).json({ message: "Error updating leave" });
  }
};

const deleteLeave = async (req, res) => {
  const { id } = req.params;
  try {
    const item_id = await db.query("SELECT id FROM edb_leave WHERE id = $1", [
      id,
    ]);
    if (item_id.rows.length === 0) {
      return res.status(404).json({ message: "No leave with this id" });
    }
    try {
      const leave_details = await db.query(
        "DELETE FROM edb_leave WHERE employee_id = $1 RETURNING *",
        [id]
      );
      const leave = leave_details.rows;
      console.log(leave);
      res.status(200).json({ message: "Deleted" });
    } catch (err) {
      console.error("Error Deleting Leave", err);
      res.status(400).json({ message: "Error getting leave" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  addLeave,
  getLeave,
  updateLeave,
  deleteLeave,
};
