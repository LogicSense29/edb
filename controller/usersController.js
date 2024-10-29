const db = require("../db");
const jwt = require("jsonwebtoken");
const validator = require("validator");
// const { welcomeEmail } = require("../utils/welcomeEmail");

//Token function
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
}

const getUsers = async (req, res) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "email and password field must be filled" });
  }

  try {
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      const match = await bcrypt.compare(password, rows[0].password);
      if (!match) {
        res.status(401).json({ message: "invalid password" });
      }
      const id = rows[0].user_id;
      const token = createToken(id);

      console.log(id);
      return res.status(200).json({ id, email, token });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Register

const addUsers = async (req, res) => {
  const { fullName, email, department, password } = req.body;

  // Validation
  if (!email || !password || fullName || department) {
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
      "SELECT * FROM ubs_student WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists." }); // Conflict (409) for existing user
    }
  } catch (err) {
    console.error({ message: "Error checking for existing user:", err });
    return res.status(500).json({ message: "Internal server error." }); // 500 for unexpected errors
  }

  // Hash password and register user
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO ubs_student(email, fullName,department, password) VALUES($1, $2, $3, $4)",
      [email, fullName, department, hashedPassword]
    );

    // Get user ID and create token
    const user = await db.query("SELECT id FROM ubs_student WHERE email = $1", [
      email,
    ]);
    const userId = user.rows[0].id;
    const token = createToken(userId);

    return res.status(201).json({ id: userId, email, type, token }); // 201 for successful creation
  } catch (err) {
    console.error({ message: "Error during user registration:", err });
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getUsers,
  addUsers,
};
