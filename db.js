const pg = require("pg");
require("dotenv").config();

const password = `${process.env.PASSWORD}`;
const database_name = `${process.env.DATABASE}`;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: database_name,
  password: password,
  port: 5432,
});

module.exports = db;
