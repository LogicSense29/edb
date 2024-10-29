const db = require("../db");

async function testConnection() {
  try {
    const res = await db.query("SELECT NOW()");
    console.log("Database connection successful:", res.rows[0]);
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

db.connect();

testConnection();
