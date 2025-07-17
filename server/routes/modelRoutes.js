const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const useDocumentModel = require("../models/useModel");

router.post("/adoption_agreement", async (req, res) => {
  try {
    const { url } = req.body;
    const fields = await useDocumentModel(url, "adoption_agreement_model");
    res.status(200).json({ fields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
