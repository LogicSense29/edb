const cron = require("node-cron");
// const calculateProductivity = require("../util/calculateProductivity");

// Schedule task to run at 12:00 AM on the 1st day of each month
cron.schedule("* * * * *", () => {
  try {
    // await calculateProductivity();
    console.log("Productivity calculation complete.");
  } catch (err) {
    console.error("Error calculating productivity:", err);
  }
});
// Keep the Node.js process running
console.log("Scheduler started. Waiting for the scheduled tasks...");
