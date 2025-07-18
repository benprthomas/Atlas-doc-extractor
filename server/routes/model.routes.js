const express = require("express");
const router = express.Router();

const adoptionAgreementRoute = require("../features/adoption.agreement/routes");
const automaticEnrollmentroute = require("../features/automatic.enrollment/routes");
const loanProgramRoute = require("../features/loan.program/routes");
const opinionLetterRoute = require("../features/opinion.letter/routes");

router.use("/adoptionAgreement", adoptionAgreementRoute);
router.use("/automaticEnrollment", automaticEnrollmentroute);
router.use("/loanProgram", loanProgramRoute);
router.use("/opinionLetter", opinionLetterRoute);

module.exports = router;
