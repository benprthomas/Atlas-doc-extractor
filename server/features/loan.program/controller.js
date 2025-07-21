const xlsxGenerate = require("../utils/xlsx.generate");
const model = require("./model.json");
const schema = require("./schema.json");

function loanProgramController() {
  const title = model.result;

  xlsxGenerate(title, schema);
}

module.exports = loanProgramController;
