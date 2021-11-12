import Cloudant from "@cloudant/cloudant";

// Get account details from environment variables
var url = process.env.CLOUDANT_URL;
var apikey = process.env.CLOUDANT_API_KEY;


const cloudant = Cloudant({
  url: url,
  plugins: {
    iamauth: { iamApiKey: apikey },
  },
});

// List all DB's
cloudant.db.list().then((body) => {
  body.forEach((db) => {
    console.log(db);
  });
}).catch((err) => { console.log(err); });
