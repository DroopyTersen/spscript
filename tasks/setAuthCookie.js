const spauth = require("node-sp-auth");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");

const envFilePath = path.join(process.cwd(), ".env");

const setAuthHeaders = async () => {
  console.log("Getting Auth HEaders");
  let auth = await spauth.getAuth(process.env.SITE_URL, {
    username: process.env.SP_USER,
    password: process.env.PASSWORD,
  });

  let existing = dotenv.parse(fs.readFileSync(envFilePath, "utf-8"));

  let updated = {
    ...existing,
    AUTH_HEADERS: JSON.stringify(auth.headers),
    // 15 mins
    AUTH_EXPIRES: Date.now() + 1000 * 60 * 15 + "",
  };

  const contents = Object.keys(updated)
    .map((key) => format(key, updated[key]))
    .join("\n");
  fs.writeFileSync(envFilePath, contents);
};

try {
  let expires = process.env.AUTH_EXPIRES;
  if (expires && parseInt(expires, 10) > Date.now()) {
    return process.env.AUTH_HEADERS;
  }
  setAuthHeaders();
} catch (err) {
  console.error("Unable to set auth headers", err);
}

function format(key, value) {
  return `${key}=${escapeNewlines(value)}`;
}

function escapeNewlines(str) {
  return str.replace(/\n/g, "\\n");
}
