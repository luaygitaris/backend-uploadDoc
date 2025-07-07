const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");
const pool = require("../db");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".doc" && ext !== ".docx") {
      return cb(new Error("Hanya file .doc dan .docx yang diizinkan"));
    }
    cb(null, true);
  },
});

// POST /api/upload
router.post("/", upload.single("docFile"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId harus disertakan" });
    }

    if (!req.file)
      return res.status(400).json({ error: "File tidak ditemukan" });

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    let extractedText = "";

    // Ekstrak teks dari file .docx
    if (filePath.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value.trim();
    }

    // Validasi isi dokumen
    const lowerText = extractedText.toLowerCase();
    const hasNama = lowerText.includes("nama");
    const hasKelas = lowerText.includes("kelas");

    if (!hasNama || !hasKelas) {
      return res.status(400).json({
        error: "Dokumen harus mengandung kata 'nama' dan 'kelas'",
      });
    }

    // Simpan ke database
    const [insertResult] = await pool.execute(
      "INSERT INTO documents (user_id, filename, content) VALUES (?, ?, ?)",
      [userId, originalName, extractedText]
    );

    res.json({
      message: "Upload dan simpan berhasil",
      id: insertResult.insertId,
      filename: originalName,
      preview: extractedText.slice(0, 200) + "...",
    });

    // Optional: Hapus file dari server setelah diproses
    // fs.unlinkSync(filePath);
  } catch (err) {
    console.error("[UPLOAD] Error:", err.message);
    res.status(500).json({ error: "Upload gagal" });
  }
});

module.exports = router;
