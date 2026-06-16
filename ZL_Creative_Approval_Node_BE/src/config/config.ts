import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  database: {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mydb",
    synchronize: false,
    logging: false,
    // entities: ["src/models/*.ts"], // migrate:generate will pick entities from this location.
    entities: [isProduction ? "dist/models/*.js" : "src/models/*.ts"], // Path to your entity files
    // migrations: ["src/database/migrations/*.ts"], // migrate:run will pick migrations from this location.
    migrations: [
      isProduction
        ? "dist/database/migrations/**/*.js"
        : "src/database/migrations/**/*.ts",
    ], // Path to your migration files
    subscribers: [],
    poolSize: 20, // Set a connection pool size
    idleTimeoutMillis: 30000, // 30 seconds of inactivity before closing the connection
    connectionTimeoutMillis: 5000, // 5 seconds to establish a connection
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    debug: process.env.APP_DEBUG === "true",
  },
  logging: {
    logLevel: process.env.LOG_LEVEL || "error",
    logtailToken: process.env.LOGTAIL_TOKEN || "Pvm9CYft2mcKfQFnCnm7fJGn",
    logtailEndpoint:
      process.env.LOGTAIL_INGESTION_ENDPOINT ||
      "https://s1194431.eu-nbg-2.betterstackdata.com/",
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "",
  },
  email: {
    emailUser: process.env.EMAIL_USER || "", // IGNORE - using gmail smtp server
    emailPassword: process.env.EMAIL_PASSWORD || "", // IGNORE - using gmail smtp server
    emailClientUrl: process.env.EMAIL_CLIENT_URL || "", // url for the email client
    sendgridSenderEmail: process.env.SENDGRID_EMAIL_USER_VERIFIED || "", // sendgrid sender email verified
    sendgridApiKey: process.env.SENDGRID_EMAIL_API_KEY || "", // sendgrid api key for sending emails
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
  },
  slack: {
    token: process.env.SLACK_TOKEN || "",
  },
};
