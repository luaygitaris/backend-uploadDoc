const express = require("express");
const router = express.Router();
const pool = require("../db"); // koneksi database

router.post("/", async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    // Cek apakah username sudah ada
    const [existing] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Simpan user baru
    await pool.execute("INSERT INTO users (nama, email, password) VALUES (?, ?, ?)", [nama, email, password]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
