const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const adoptionAgreementModel = require("../models/adoptionAgreement");

router.post("/adoption_agreement", async (req, res) => {
  try {
    const { url } = req.body;
    const fields = await adoptionAgreementModel();
    res.status(200).json({ fields });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
