import dotenv from "dotenv";
import _ from "ramda";

dotenv.config();

// Without Trailing /
const BASE_URL = process.env.BASE_URL || "http://0.0.0.0:4000";

const Config = {
  // Server Configs
  BASE_URL,
  PORT: process.env.PORT || 4000,
  JWT_SECRET:
    process.env.JWT_SECRET || "pp~f}dbkwd]k1qpp@n1<:lljptymffd]k1q~f}dbkwdt>",

  LOGGING_LEVEL: process.env.LOGGING_LEVEL || "debug",

  STORAGE_BACKEND: process.env.STORAGE_BACKEND || "localFileStorage",
  EMAIL_GATEWAY: process.env.EMAIL_GATEWAY || "localConsole",

  SENTRY_DSN: process.env.SENTRY_DSN || undefined,
  RELEASE_VERSION: process.env.RELEASE_VERSION || "undefined",
  SERVER_ENVIRONMENT: process.env.SERVER_ENVIRONMENT || "production",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || null,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || null,

  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  AWS_REGION: process.env.AWS_REGION || "us-east-1",

  FROM_EMAIL_ADDRESS: process.env.FROM_EMAIL_ADDRESS || "no-reply@example.com",
  REPLY_TO_EMAIL_ADDRESS:
    process.env.REPLY_TO_EMAIL_ADDRESS || "no-reply@example.com ",

  STATIC_FILES_BASE_PATH:
    process.env.STATIC_FILES_BASE_PATH || `${BASE_URL}/media`,

  WAPI_INSTANCE_ID: process.env.WAPI_INSTANCE_ID || "",
  WAPI_API_KEY: process.env.WAPI_API_KEY,
};

const Prod = _.merge(Config, {
  APP_ENV: "Prod",
  DB_CONNECTION_URI: process.env.DB_CONNECTION_URI,
});

const Test = _.merge(Config, {
  APP_ENV: "Test",
  DB_CONNECTION_URI: process.env.TEST_DB_CONNECTION_URI,
});

export = (function () {
  console.log(`Env= ${process.env.NODE_ENV}`);
  switch (process.env.NODE_ENV) {
    case "Production":
      return Prod;
    case "Test":
      return Test;
    default:
      return Prod;
  }
})();
