const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Temporary local upload
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
  const filePath = path.resolve(req.file.path);
  // Later: send to Azure AI
  res.json({ message: "File uploaded successfully", path: filePath });
});

module.exports = router;
