const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const {
  uploadFileToBlob,
  uploadJsonToBlob,
} = require("../infrastructure/blobStorage/blob.service");

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
    const modelType = req.body.type;
    const blobUrl = await uploadFileToBlob(localPath, "raw");
    console.log(modelType);
    const response = await axios.post(
      "http://localhost:5000/api/models/" + modelType,
      { blobUrl, modelType }
    );
    const fields = JSON.stringify(response.data, null, 2);
    fs.writeFile(
      path.join(__dirname, "../xlsx/" + modelType + ".json"),
      fields,
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Data successfully written to " + modelType + ".json");
        }
      }
    );

    const jsonBlobName = `extracted/${Date.now()}-${
      req.file.originalname
    }.json`;
    const resultBlobUrl = await uploadJsonToBlob(fields, jsonBlobName);
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
