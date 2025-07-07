const mysql = require("mysql2/promise");
const { config } = require("dotenv");

config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "libraayra", // sesuaikan dengan password baru
  database: "test",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
  // connectTimeout: 100000,
  // acquireTimeout: 100000,
  // timeout: 10000,
});

module.exports = pool;
