const express = require("express");
const router = express.Router();

const adoptionAgreementController = require("../adoption.agreement/controller");
const automaticEnrollmentController = require("../automatic.enrollment/controller");
const loanProgramController = require("../loan.program/controller");
const opinionLetterController = require("../opinion.letter/controller");

router.post("/", async (req, res) => {
  console.log("Inside Excel Generation : ");
  try {
    adoptionAgreementController();
    automaticEnrollmentController();
    loanProgramController();
    opinionLetterController();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
