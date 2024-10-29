const db = require("../db");
const jwt = require("jsonwebtoken");

const getReport = async (req, res) => {
  const { id } = req.user;
  try {
    const report_details = await db.query(
      "SELECT * FROM employee_report WHERE employee_ref = $1",
      [id]
    );
    const report = report_details.rows;
    res.status(200).json({ message: report });
  } catch (err) {
    console.error("eRROR gETTING LEAVE", err);
    res.status(400).json({ message: "Error getting report" });
  }
};

const addReport = async (req, res) => {
  const { report_title, report_content } = req.body;
  const { id } = req.params;
  try {
    const report_details = await db.query(
      "INSERT INTO edb_report (report_title, ,report_content,  employee_ref) VALUES($1, $2, $3) RETURNING report_id",
      [report_title, report_content, id]
    );
    const report = report_details.rows;
    res.status(200).json({ message: report });
  } catch (err) {
    console.error("Error Adding Leave", err);
    res.status(400).json({ message: "Error getting Report" });
  }
};

const updateReport = async (req, res) => {
  const { report_title, report_content } = req.body;
  const { id } = req.params;
  try {
    const report_details = await db.query(
      "UPDATE edb_leave SET leave_start_date = $2,leave_end_date= $3 WHERE employee_id = $1 RETURNING *",
      [report_title, report_content, id]
    );
    const report = report_details.rows;
    res.status(200).json({ message: report });
  } catch (err) {
    console.error("Error Updating Report", err);
    res.status(400).json({ message: "Error updating Report" });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const item_id = await db.query(
      "SELECT report_id FROM edb_report WHERE id = $1",
      [id]
    );
    if (item_id.rows.length === 0) {
      return res.status(404).json({ message: "No report with this id" });
    }
    try {
      const leave_details = await db.query(
        "DELETE FROM edb_report WHERE employee_ref = $1 RETURNING *",
        [id]
      );
      const report = leave_details.rows;
      console.log(report);
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
  addReport,
  getReport,
  updateReport,
  deleteReport,
};
