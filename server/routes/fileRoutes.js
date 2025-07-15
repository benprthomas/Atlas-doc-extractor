const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const adoptionAgreementModel = require("../models/adoptionAgreement");

// Use disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");

    const fields = await adoptionAgreementModel(base64);
    res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully",
      fields,
    });
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
