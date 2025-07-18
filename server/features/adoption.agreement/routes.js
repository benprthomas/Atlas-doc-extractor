const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const useDocumentModel = require("../utils/use.model");
const model = require("./model");

router.post("/", async (req, res) => {
  console.log("Inside Adoption Agreement Model : ");
  try {
    var fields = await useDocumentModel(req.body.blobUrl, model.title);
    var contents = await useDocumentModel(req.body.blobUrl, model.content);

    contents = JSON.stringify(contents, null, 2);
    fs.writeFile(
      path.join(__dirname, "../../xlsx/adoptionAgreementContent.json"),
      contents,
      (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(
            "Data successfully written to  adoptionAgreementContent.json"
          );
        }
      }
    );

    res.status(200).json(fields);
  } catch (err) {
    console.error("Azure model error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
