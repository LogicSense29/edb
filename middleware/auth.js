const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

async function requireAuth(req, res, next) {
  const { authorization } = req.headers;

  //check if it has a value

  if (!authorization) {
    return res.status(401).json("Invalid Authorization");
  }

  //check if the token is verified
  const token = authorization.split(" ")[1];
  try {
    const { id } = jwt.verify(token, process.env.SECRET);

    const item =
      (await db.query("SELECT id FROM edb_details WHERE id = $1", [id])) ||
      db.query("SELECT id FROM admin_edb WHERE id = $1");
    req.user = item.rows[0];
    next();

    console.log("This is the item", item);
  } catch (err) {
    console.log(err);
    return res.status(401).json("Unverified token");
  }
}

module.exports = requireAuth;
