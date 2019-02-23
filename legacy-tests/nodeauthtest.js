let nodeauth = require("node-sp-auth");
require("dotenv").config();

var doIt = async () => {
  let auth = await nodeauth.getAuth(process.env.SITE_URL, {
    username: process.env.SP_USER,
    password: process.env.PASSWORD,
    online: true
  });
  console.log(auth);
};

doIt();
