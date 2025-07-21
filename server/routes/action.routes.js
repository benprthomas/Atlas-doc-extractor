const express = require("express");
const router = express.Router();

const excelGenerateRoute = require("../features/excel.generate/routes");

router.use("/excelGenerate", excelGenerateRoute);

module.exports = router;
