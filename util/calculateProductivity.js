const db = require("../db");

const calCulatingProductivity = async () => {
  const date = new Date();
  const month = date.getMonth() + 1; // JavaScript months are 0-based, so add 1
  try {
    const productivity = await db.query(
      "SELECT edb_id, EXTRACT(MONTH FROM completion_date) AS month, COUNT(*) AS total_tasks, SUM(EXTRACT(EPOCH FROM (completion_date - created_at)) / 3600) AS total_hours_worked FROM edb_task GROUP BY edb_id, EXTRACT(MONTH FROM completion_date)"
    );

    const resultList = productivity.rows;
    const filterByMonth = resultList.filter((item) => {
      return item.month == month;
    });
    for (const employee of filterByMonth) {
      const productivityPercentage = Math.floor(
        (employee.total_hours_worked / employee.total_tasks) * 100
      );
      const y = {
        productivity_percentage: productivityPercentage,
        productivity_date: employee.month,
        employee_id: employee.edb_id,
      };
      try {
        const response = await db.query(
          "INSERT INTO productivity (productivity_percent, productivity_date, edb_id) VALUES($1, $2, $3) RETURNING *",
          [y.productivity_percentage, y.productivity_date, y.employee_id]
        );
        console.log(response);
      } catch (err) {
        console.error("Error inserting productivity data:", err);
      }
    }
  } catch (err) {
    console.error("Database error extracting hours spent:", err);
    // return res.status(500).json("Internal server error");
  }
};

// Call the function to execute the productivity calculation
module.exports = calCulatingProductivity();
