# Cloudant Migrate
A tool to automate the migration of doc's from ~~one cloudant instance to another~~ Cloudant or COS.

It uses the [nodejs-cloudant](https://github.com/cloudant/nodejs-cloudant) SDK. For more information check out https://github.com/apache/couchdb-nano#database-functions.

It appears nodejs-cloudant is old and there is a new version here: [cloudant-node-sdk](https://github.com/apache/couchdb-nano#database-functions)

## Warning
This code is untested... Use at your own risk!

It does not delete or override anything in your export database - however if something goes wrong you might be left with a half full import database.

## Cloudant usage
1. Create a .env file and fill in Cloudant credentials for both export and import instances (see `.env_template`)
2. run `source .env`
3. run `npm run cloudant`

Depending on your plan you might hit rate limits - if this is the case increase the API_SLEEP_MS on line 6 of `cloudant/cloudant.js`

## Cos usage
1. Create a .env file and fill in COS credentials for both export and import instances (see `.env_template`)
2. run `source .env`
3. run `npm run cos`
