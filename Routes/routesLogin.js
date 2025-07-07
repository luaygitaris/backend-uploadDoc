const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log("[LOGIN] Incoming request with data:", { email, password });

  if (!email || !password) {
    console.warn("[LOGIN] Missing email or password");
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    console.log(`[LOGIN] Checking user with email: ${email}`);
    
    const [results] = await pool.execute(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    console.log("[LOGIN] Query result:", results);

    if (results.length > 0) {
      const user = results[0];
      console.log(`[LOGIN] Login successful for user ID: ${user.id}`);
      res.json({ userId: user.id, email: user.email, message: "Login successful" });
    } else {
      console.warn("[LOGIN] User not found or password incorrect");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("[LOGIN] Database error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
