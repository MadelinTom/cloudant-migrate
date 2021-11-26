# Data Migrate
A tool to automate the migration of data from one Cloudant or COS instance to another.

## Warning
This code is untested... Use at your own risk!

It does not delete or override anything in your export database - however if something goes wrong you might be left with a half full import database.


## Cloudant
This repo uses the [nodejs-cloudant](https://github.com/cloudant/nodejs-cloudant) SDK. For more information check out https://github.com/apache/couchdb-nano#database-functions.

It appears nodejs-cloudant is old and there is a new version here: [cloudant-node-sdk](https://github.com/apache/couchdb-nano#database-functions)

### Cloudant usage
1. Create a .env file and fill in Cloudant credentials for both export and import instances (see `.env_template`)
2. run `source .env`
3. run `npm run cloudant`

Depending on your plan you might hit rate limits - if this is the case increase the API_SLEEP_MS on line 6 of `cloudant/cloudant.js`
## COS
This repo uses the [ibm-cos-sdk](https://www.npmjs.com/package/ibm-cos-sdk).
### Cos usage
Depending on the type of objects you are uploading, you need to alter the `contentType` variable on line 7 of `cos/cos.js`. This repo was used to transferring svg files.

1. Create a .env file and fill in COS credentials for both export and import instances (see `.env_template`)
2. run `source .env`
3. run `npm run cos`
