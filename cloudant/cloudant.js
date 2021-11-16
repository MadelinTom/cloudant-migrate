import Cloudant from "@cloudant/cloudant";

import {sleep} from "./util.js";

// Globals
let API_SLEEP_MS = 100; // to avoid rate limit's, consider making this smaller if you have a large DB or better payment plan
let cloudantExportDBNames = []; // names of each Database in export Cloudant instance
let tempDBFiles = []; // holds files from export Cloudant instance
let tempDBDocs = []; // holds full documents from export Cloudant instance

// Get account details for export and import DB's
const cloudantExportUrl = process.env.CLOUDANT_EXPORT_URL;
const cloudantExportApiKey = process.env.CLOUDANT_EXPORT_API_KEY;
const cloudantExport = Cloudant({
  url: cloudantExportUrl,
  plugins: {
    iamauth: { iamApiKey: cloudantExportApiKey },
  },
});

const cloudantImportUrl = process.env.CLOUDANT_IMPORT_URL;
const cloudantImportApiKey = process.env.CLOUDANT_IMPORT_API_KEY;
const cloudantImport = Cloudant({
  url: cloudantImportUrl,
  plugins: {
    iamauth: { iamApiKey: cloudantImportApiKey },
  },
});

// Get all DB's from Export Cloudant instance
await cloudantExport.db.list().then((body) => {
  body.forEach((db) => {
    cloudantExportDBNames.push(db);
  });
}).catch((err) => { console.log(err); });

// cloudantExportDBNames.forEach(db => console.log(db))

// Create all DB's in Import Cloudant instance
const createDBs = async () => {

  for (let i = 0; i < cloudantExportDBNames.length; i++) {
    await cloudantImport.db.create(cloudantExportDBNames[i]);
    await sleep(API_SLEEP_MS); 
  }
}
createDBs();

for (let i=1; i < cloudantExportDBNames.length; i++) {
  let dbNameExport = cloudantExport.db.use(cloudantExportDBNames[i]);
  let dbNameImport = cloudantImport.db.use(cloudantExportDBNames[i]);
  console.log(`--> ${cloudantExportDBNames[i]}`)
  
  // list all files in DB
  await dbNameExport.list().then((body) => 
    body.rows.forEach((doc) => {
        tempDBFiles.push(doc);
  }));
  console.log(`--> Moving ${tempDBFiles.length} files`)
  
  // Loop through all files and get corresponding full document
  const getFullDocument = async () => {
    for (let i=0; i < tempDBFiles.length; i++) {
      await sleep(API_SLEEP_MS);
      let doc = await dbNameExport.get(tempDBFiles[i].id);
      tempDBDocs.push(doc);
    }
  }
  await getFullDocument();
  
  // Loop through all full documents and remove the _rev field
  for (let i=0; i < tempDBDocs.length; i++) {
    let doc = tempDBDocs[i]
    delete doc._rev;
  }
  
  // buld upload all docs to import Cloudant instance
  await dbNameImport.bulk({docs: tempDBDocs});
  
  // cleanup arrays
  tempDBFiles.length = 0;
  tempDBDocs.length = 0;
  console.log(`--> ${cloudantExportDBNames[i]} Finished`)
  sleep(API_SLEEP_MS);
}
