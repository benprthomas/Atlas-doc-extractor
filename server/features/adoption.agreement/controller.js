const xlsxGenerate = require("../utils/xlsx.generate");
const model = require("./model.json");
const schema = require("./schema.json");

function adoptionAgreementController() {
  const title = model.result;
  const contentExist = true;

  xlsxGenerate(title, schema, contentExist);
}

module.exports = adoptionAgreementController;
