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

  for (const [key, field] of Object.entries(document.fields)) {
    extracted[key] = {
      value: dataExtraction(field),
      confidence: field.confidence ?? null,
    };
  }

  return extracted;
}

module.exports = extractValue;
