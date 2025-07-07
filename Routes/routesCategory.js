const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT DISTINCT category FROM materials");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});


module.exports = router;
