const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config("../.env");
const path = require("path");

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

async function uploadFileToBlob(filePath, blobNamePrefix = "raw") {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const fileName = `${uuidv4()}-${path.basename(filePath)}`;
  const blobName = `${blobNamePrefix}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(filePath, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });

  const sasUrl = generateBlobSasUrl(containerName, blobName);
  return sasUrl;
}

async function uploadJsonToBlob(jsonData, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const jsonString = JSON.stringify(jsonData, null, 2);
  await blockBlobClient.upload(jsonString, Buffer.byteLength(jsonString));

  return blockBlobClient.url;
}

function generateBlobSasUrl(containerName, blobName) {
  const ONE_HOUR = 60;
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );
  const blobSas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"), // read-only
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + ONE_HOUR * 60 * 1000),
    },
    sharedKeyCredential
  ).toString();

  return `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${blobSas}`;
}

module.exports = {
  uploadFileToBlob,
  uploadJsonToBlob,
};
