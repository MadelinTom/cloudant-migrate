# Cloudant Migrate
A tool to automate the migration of doc's from one cloudant instance to another

It uses the [nodejs-cloudant](https://github.com/cloudant/nodejs-cloudant) SDK. For more information check out https://github.com/apache/couchdb-nano#database-functions.

It appears nodejs-cloudant is old and there is a new version here: [cloudant-node-sdk](https://github.com/apache/couchdb-nano#database-functions)

## Cloudant usage
1. Create a .env file and fill in Cloudant credentials for both export and import instances
2. run `source .env`
3. run `npm run cloudant`

## Cos usage
1. Create a .env file and fill in COS credentials for both export and import instances
2. run `source .env`
3. run `npm run cos`