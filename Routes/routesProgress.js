const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET achievement
router.get("/:userId/:materialId", async (req, res) => {
  const { userId, materialId } = req.params;
  console.log("UserId:", userId, "MaterialId:", materialId); 
  try {
    const [results] = await pool.query(
      "SELECT progress FROM achievements WHERE user_id = ? AND material_id = ?",
      [userId, materialId]
    );

    if (results.length > 0) {
      res.json({ progress: results[0].progress });
    } else {
      res.json({ progress: "not learned" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

router.post("/", async (req, res) => {
  const { userId, materialId, progress } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM achievements WHERE user_id = ? AND material_id = ?",
      [userId, materialId]
    );

    if (existing.length > 0) {
      // Jika sudah ada, periksa apakah status progressnya sama
      const currentProgress = existing[0].progress;
      if (currentProgress === progress) {
        return res.json({ message: "Progress is already the same" });
      }

      // Update status progress jika berbeda
      await pool.query(
        "UPDATE achievements SET progress = ? WHERE user_id = ? AND material_id = ?",
        [progress, userId, materialId]
      );
      res.json({ message: `Progress updated to ${progress}!` });
    } else {

      await pool.query(
        "INSERT INTO achievements (user_id, material_id, progress) VALUES (?, ?, ?)",
        [userId, materialId, progress]
      );
      res.json({ message: `Progress for ${progress} saved!` });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
