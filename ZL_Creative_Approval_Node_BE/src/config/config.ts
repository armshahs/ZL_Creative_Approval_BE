import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Used for JWT auth.
// decodePemFromEnv turns base64-encoded PEM strings from environment variables back into the actual RSA key text the app needs for JWT auth.
function decodePemFromEnv(value: string): string {
  if (!value) return "";
  return Buffer.from(value, "base64").toString("utf-8");
}

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
    entities: [isProduction ? "dist/models/*.js" : "src/models/*.ts"], // Path to your entity files
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
    jwtPrivateKey: decodePemFromEnv(process.env.JWT_PRIVATE_KEY || ""),
    jwtPublicKey: decodePemFromEnv(process.env.JWT_PUBLIC_KEY || ""),
    jwtAccessTtlSeconds: parseInt(process.env.JWT_ACCESS_TTL_SECONDS || "900", 10),
    refreshTokenTtlDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || "30", 10),
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    refreshCookieName: "refresh_token",
    jwtKeyId: process.env.JWT_KEY_ID || "v1",
    authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10", 10),
    authRateLimitWindowMinutes: parseInt(
      process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES || "15",
      10,
    ),
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
