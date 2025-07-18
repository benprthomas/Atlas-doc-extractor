const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} = require("@azure/storage-blob");

require("dotenv").config({ path: "../config/.env" });

const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

async function uploadAndGenerateSAS(fileBuffer, originalName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = `uploads/${Date.now()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "application/pdf" },
  });

  const expiresOn = new Date(Date.now() + 5 * 60 * 1000); // 5 min SAS token
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      protocol: SASProtocol.Https,
    },
    sharedKeyCredential
  ).toString();

  const blobUrl = `${blockBlobClient.url}?${sasToken}`;
  return blobUrl;
}

module.exports = uploadAndGenerateSAS;
