const express = require("express");
const router = express.Router();

const useDocumentModel = require("../utils/use.model");
const model = require("./model");

router.post("/", async (req, res) => {
  console.log("Inside Automatic Enrollment Model : ");
  try {
    var fields = await useDocumentModel(req.body.blobUrl, model.title);
    res.status(200).json(fields);
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
