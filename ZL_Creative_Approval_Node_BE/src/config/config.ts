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
    poolSize: 10, // Set a connection pool size
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
    emailUser: process.env.EMAIL_USER || "",
    emailPassword: process.env.EMAIL_PASSWORD || "",
    emailClientUrl: process.env.EMAIL_CLIENT_URL || "",
  },
  currency: {
    exchangeApiKey: process.env.CURRENCY_EXCHANGE_API_KEY || "",
    exchangeApiUrlBase: process.env.CURRENCY_EXCHANGE_API_URL_BASE || "",
  },
};
