import ibm from "ibm-cos-sdk";

// Globals
let cosExportBucketNames = []; // holds bucket names of export instance
let cosImportBucketNames = []; // holds bucket names of import instance (different as bucket names need to be globally unique)
let cosExportBucketObjects = []; // holds objects from a bucket
const contentType = "image/svg+xml"; // change this depending on the type of objects in your S3 bucket

// Account details for both import and export COS instances
const exportConfig = {
  endpoint: process.env.COS_EXPORT_URL,
  apiKeyId: process.env.COS_EXPORT_API_KEY,
  serviceInstanceId: process.env.COS_EXPORT_RESOURCE_INSTANCE_ID,
};
const exportCos = new ibm.S3(exportConfig);

const importConfig = {
  endpoint: process.env.COS_IMPORT_URL,
  apiKeyId: process.env.COS_IMPORT_API_KEY,
  serviceInstanceId: process.env.COS_IMPORT_RESOURCE_INSTANCE_ID,
};
const importCos = new ibm.S3(importConfig);

// Get all bucket names from export COS instance
await exportCos
  .listBuckets()
  .promise()
  .then((bucket) => {
    cosExportBucketNames = bucket.Buckets;
  });
console.log(`--> Migrating ${cosExportBucketNames.length} buckets`);

// Create all buckets in import COS instance
const createBuckets = async () => {
  for (let i = 0; i < cosExportBucketNames.length; i++) {
    await importCos
      .createBucket({
        Bucket: `${cosExportBucketNames[i].Name}-2`, // This is needed because bucket names need to be globally unique
        CreateBucketConfiguration: {
            LocationConstraint: "eu-de-standard"
          },
      })
      .promise()
      .catch((error) => console.log(error));
  }
};
console.log(`--> Creating ${cosExportBucketNames.length} buckets`);
// await createBuckets();

await importCos
  .listBuckets()
  .promise()
  .then((bucket) => {
    cosImportBucketNames = bucket.Buckets;
  });

// for each bucket, get all objects and upload to import bucket
for (let i = 0; i < cosImportBucketNames.length; i++) {
  let currentBucketName = cosExportBucketNames[i].Name;
  console.log(`--> Begin migration of ${currentBucketName}`);

  // List all objects from export instance and cache
  await exportCos
    .listObjects({ Bucket: `${currentBucketName}` })
    .promise()
    .then((obj) => {
      cosExportBucketObjects = obj.Contents;
    });
  console.log(`--> Migrating ${cosExportBucketObjects.length} objects`);

  // get full object from export instance and upload to import instance
  for (let j = 0; j < cosExportBucketObjects.length; j++) {
    const exportObject = await exportCos
      .getObject({
        Bucket: `${currentBucketName}`,
        Key: `${cosExportBucketObjects[j].Key}`,
      })
      .promise();

    await importCos
      .putObject({
        Bucket: `${currentBucketName}-2`,
        Key: `${cosExportBucketObjects[j].Key}`,
        ContentType: `${contentType}`, 
        Body: exportObject.Body,
      })
      .promise();
    console.log(`--> Object ${j}`);
  }
  console.log(`--> Done ${currentBucketName}`);
}
