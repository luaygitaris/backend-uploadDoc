const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/documents
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId wajib disertakan" });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT id, filename, content, created_at FROM documents WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("[GET DOCUMENTS] Error:", error);
    res.status(500).json({ error: "Gagal mengambil data dokumen" });
  }
});

module.exports = router;
