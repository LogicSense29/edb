const bcrypt = require("bcrypt");
const db = require("./db");
db.connect();

async function storeAdminCredentials(
  admin_username,
  admin_hpassword,
  admin_fullname,
  admin_email,
  admin_role
) {
  try {
    console.log("Storing admin credentials...");

    const existingUser = await db.query(
      "SELECT * FROM admin_edb WHERE admin_email = $1",
      [admin_email]
    );
    console.log("Query for existing user executed");

    if (existingUser.rows.length > 0) {
      console.log("User already exists:", existingUser.rows[0]);
      return { status: 409, message: "User already exists." };
    }

    console.log("No existing user found, hashing password...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin_hpassword, salt);
    console.log("Password hashed");

    const newUser = await db.query(
      "INSERT INTO admin_edb (admin_username, admin_hpassword, admin_fullname, admin_email, admin_role) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [admin_username, hashedPassword, admin_fullname, admin_email, admin_role]
    );
    console.log("New user inserted");

    const userId = newUser.rows[0].id;
    const name = newUser.rows[0].admin_fullname;
    console.log("Added to admin database");

    return { status: 201, id: userId, name };
  } catch (err) {
    console.error("Error during Admin registration:", err);
    return { status: 500, message: "Internal server error." };
  }
}

async function main() {
  console.log("Main function started");
  const result = await storeAdminCredentials(
    "legend",
    "test1@NG2919",
    "Olarewaju ife",
    "test@umera.ng",
    "Editor"
  );

  if (result.status === 201) {
    console.log("User registered successfully:", result);
  } else {
    console.log("Error:", result.message);
  }
}

main();
