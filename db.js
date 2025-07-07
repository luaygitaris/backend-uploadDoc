const mysql = require("mysql2/promise");
const { config } = require("dotenv");

config();

const pool = mysql.createPool({
  // host: "localhost",
  // user: "root",
  // password: "libraayra",
  // database: "test",
  host: "sql12.freesqldatabase.com",
  user: "sql12788264",
  password: "ZbzhGiDCcK", // sesuaikan dengan password baru
  database: "sql12788264",
});

module.exports = pool;
