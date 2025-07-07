const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const [results] = await pool.execute("SELECT * FROM materials WHERE category = ?", [category]);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
