const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

async function xlsxGenerate(title, schema, contentExist = false) {
  const field = require(path.join(__dirname, "../../xlsx/" + title + ".json"));
  const content = contentExist
    ? require(path.join(__dirname, "../../xlsx/" + title + "Content.json"))
    : undefined;

  const basicPath = path.join(__dirname, "../../xlsx/work/basic.xlsx");
  const resultPath = path.join(__dirname, "../../xlsx/work/result.xlsx");
  const samplePath = path.join(__dirname, "../../xlsx/work/sample.xlsx");
  const sampleWorkbook = XLSX.readFile(samplePath);
  var workbook;

  if (!fs.existsSync(resultPath)) {
    await fs.copyFile(basicPath, resultPath, (err) => {
      if (err) throw err;
    });

    // delete workbook.Sheets["PD.G1"];
    // delete workbook.Sheets["PD.K1"];
    // delete workbook.Sheets["PD.L1"];
    // XLSX.utils.book_append_sheet(workbook, sampleWorkbook["PD.G1"]);
    // XLSX.utils.book_append_sheet(workbook, sampleWorkbook["PD.K1"]);
    // XLSX.utils.book_append_sheet(workbook, sampleWorkbook["PD.L1"]);
  }
  workbook = XLSX.readFile(resultPath);

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
              ? (sub_result += contentExist
                  ? content[item]
                    ? content[item].value
                    : ""
                  : item + " ")
              : "";
          }
          v = sub_result;
        }
        break;
      case "special":
        if (field[value.field] && field[value.field1].value == "selected")
          v = "1000";
        else if (field[value.field] && field[value.field2].value == "selected")
          v = field[value.field3].value;
        break;
      default:
        v = field[value.field] != undefined ? field[value.field].value : "N/A";
    }

    worksheet[cell] = { t, v };
  });

  XLSX.writeFile(workbook, resultPath);
  console.log("Excel Generation Success");

  return "success";
}

module.exports = xlsxGenerate;
