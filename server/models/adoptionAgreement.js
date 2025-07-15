const DocumentIntelligence =
    require("@azure-rest/ai-document-intelligence").default,
  {
    getLongRunningPoller,
    isUnexpected,
  } = require("@azure-rest/ai-document-intelligence");

const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config({ path: "../.env" });
const extractValue = require("./extractValue");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function adoptionAgreementModel(base64String) {
  console.log("StaringAdoptionModel ...");

  const key = process.env.AZURE_API_KEY;
  const endpoint = process.env.AZURE_ENDPOINT;
  const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

  console.log("Getting Key : " + key + endpoint);

  const formUrl =
    "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf";

  // Step 1: Submit document
  const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "adoption_agreement_model")
    .post({
      contentType: "application/json",
      body: {
        urlSource: formUrl,
      },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  // Step 2: Poll operation-location
  const operationLocation = initialResponse.headers["operation-location"];
  if (!operationLocation) {
    throw new Error("Missing operation-location header in response.");
  }

  let result;
  for (let i = 0; i < 10; i++) {
    const pollResponse = await client.pathUnchecked(operationLocation).get({
      headers: { "Content-Type": "application/json" },
    });

    if (pollResponse.body.status === "succeeded") {
      result = pollResponse.body.analyzeResult;
      break;
    } else if (pollResponse.body.status === "failed") {
      throw new Error("Analysis failed");
    }

    await sleep(5000); // wait 2 seconds before polling again
  }

  if (!result) throw new Error("Timed out waiting for Azure model result");

  const document = result.documents?.[0];
  if (!document) {
    throw new Error("No document returned from Azure");
  }

  console.log("Result : " + JSON.stringify(document.fields, null, 2));
  const dataIdentified = extractValue(document);
  // console.log("Dataidentified : " + JSON.stringify(dataIdentified, null, 2));

  return dataIdentified;
}

module.exports = adoptionAgreementModel;
