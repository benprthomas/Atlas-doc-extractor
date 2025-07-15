function dataExtraction(field) {
  if (field == null) return null;

  switch (field.type) {
    case "string":
    case "number":
    case "date":
      return field.value ?? field.content ?? null;

    case "selectionMark":
      return field.state === "selected" ? true : false;

    case "array":
      return (field.valueArray ?? []).map((item) => {
        if (item.type === "object" && item.valueObject) {
          const row = {};
          for (const [colKey, cell] of Object.entries(item.valueObject)) {
            row[colKey] = extractValue(cell);
          }
          return row;
        } else {
          return extractValue(item);
        }
      });

    case "object":
      return Object.fromEntries(
        Object.entries(field.valueObject ?? {}).map(([key, val]) => [
          key,
          extractValue(val),
        ])
      );

    default:
      return null;
  }
}

function extractValue(document) {
  const extracted = {};

  if (document.fields) {
    Object.entries(document.fields).forEach(([key, field]) => {
      (extracted[key] = key),
        (extracted["value"] = extractValue(field)),
        (extracted["confidence"] = field.confidence);
    });
  }

  // console.log("Extracted : " + JSON.stringify(extracted, null, 2));

  return extracted;
}

module.exports = extractValue;
