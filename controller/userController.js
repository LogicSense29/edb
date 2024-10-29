const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Token function
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
}

//Login Users
const getUsers = async (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email and password fields must be filled" });
  }

  try {
    const response =
      (await db.query("SELECT * FROM edb_details WHERE email = $1", [email])) ||
      db.query("SELECT * FROM admin_edb WHERE email = $1", [email]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }
    const user = response.rows[0];
    const isAdmin = "admin_username" in user;
    console.log(isAdmin);
    const match = await bcrypt.compare(
      password,
      response.rows[0].hashed_password
    );
    if (!match) {
      return res.status(401).json("Invalid password");
    }
    const id = response.rows[0].id;
    const token = createToken(id);
    return res
      .status(200)
      .json({ id, email, token, isNewUser: false, isAdmin: isAdmin });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Register

const addUsers = async (req, res) => {
  const { fullName, email, department, password } = req.body;

  // Validation
  if (!email || !password || !fullName || !department) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Password is not strong enough." });
  }

  // Check for existing user
  try {
    const existingUser = await db.query(
      "SELECT id FROM edb_details WHERE email = $1",
      [email]
    );
    if (existingUser.rows[0]) {
      console.log(existingUser.rows[0]);
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash password and register user
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await db.query(
        "INSERT INTO edb_details (fullname, email, department, hashed_password) VALUES($1, $2, $3, $4) RETURNING *",
        [fullName, email, department, hashedPassword]
      );

      const userId = newUser.rows[0].id;
      const name = newUser.rows[0].full_name;
      const token = createToken(userId);

      return res.status(201).json({ id: userId, name, token, isNewUser: true });
    } catch (err) {
      console.error("Error during user registration:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  } catch (err) {
    console.error("Error checking for existing user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  addUsers,
};
