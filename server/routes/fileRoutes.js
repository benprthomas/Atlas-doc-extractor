const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const {
  uploadFileToBlob,
  uploadJsonToBlob,
} = require("../blobStorage/blobService");
const useDocumentModel = require("../models/useModel");

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
    const localPath = req.file.path;
    const blobUrl = await uploadFileToBlob(localPath, "raw");

    const fields = await useDocumentModel(blobUrl, "adoption_agreement_model");

    const jsonBlobName = `extracted/${Date.now()}-${
      req.file.originalname
    }.json`;
    const resultBlobUrl = await uploadJsonToBlob(fields, jsonBlobName);

    res.status(200).json({
      success: true,
      fileUrl: blobUrl,
      resultUrl: resultBlobUrl,
      fields,
    });
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
