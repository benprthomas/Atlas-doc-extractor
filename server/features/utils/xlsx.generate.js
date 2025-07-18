const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

function xlsxGenerate() {
  const field = require("../../models/example.json");
  const workbook = XLSX.readFile(path.join(__dirname, "../utils/sample.xlsx"));
  const schemaTypes = require("../utils/schemaTypes");

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    if (sheet["!comments"]) {
      delete sheet["!comments"];
    }

    for (const cell in sheet) {
      if (sheet[cell].c) {
        delete sheet[cell].c;
      }
    }
  });

  for (var schemaType in schemaTypes) {
    const schema = require("../utils/schemas/" + schemaTypes[schemaType]);
    Object.entries(schema).forEach(([key, value]) => {
      var worksheet = workbook.Sheets[key.split("_")[0]];
      var cell = key.split("_")[1];

      var t = "s";
      var v = "";

      switch (value.type) {
        case "table":
          break;
        case "selection_mark":
          if (value.child == undefined || value.child.length == 0) {
            if (field[value.field] && field[value.field].value == "selected")
              v = "Yes";
            else v = "No";
          } else {
            let sub_result = "";
            for (const item of value.child) {
              field[item] && field[item].value == "selected"
                ? (sub_result += item + " ")
                : "";
            }
            v = sub_result;
          }
          break;
        case "special":
          if (field[value.field] && field[value.field1].value == "selected")
            v = "1000";
          else if (
            field[value.field] &&
            field[value.field2].value == "selected"
          )
            v = field[value.field3].value;
          break;
        default:
          console.log(field[value.field]);
          v = field[value.field] ? field[value.field].value : "N/A";
      }

      worksheet[cell] = { t, v };
    });
  }

  XLSX.writeFile(workbook, path.join(__dirname, "../xlsx/result.xlsx"));

  return "success";
}

module.exports = xlsxGenerate;
