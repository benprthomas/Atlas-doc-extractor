function dataExtraction(field) {
  if (!field) return null;

  switch (field.type) {
    case "string":
    case "number":
    case "date":
      return field.value ?? field.content ?? null;

    case "selectionMark":
      return field.content ? field.content.slice(1, -1) : "";

    case "array":
      return (field.valueArray ?? []).map((item) => {
        if (item.type === "object" && item.valueObject) {
          const row = {};
          for (const [colKey, cell] of Object.entries(item.valueObject)) {
            row[colKey] = dataExtraction(cell);
          }
          return row;
        } else {
          return dataExtraction(item);
        }
      });

    case "object":
      return Object.fromEntries(
        Object.entries(field.valueObject ?? {}).map(([key, val]) => [
          key,
          dataExtraction(val),
        ])
      );

    default:
      return null;
  }
}

function extractValue(document) {
  const extracted = {};

  if (document.fields) {
    for (const [key, field] of Object.entries(document.fields)) {
      extracted[key] = {
        value: dataExtraction(field),
        confidence: field.confidence,
      };
    }
  }

  return extracted;
}

module.exports = extractValue;
