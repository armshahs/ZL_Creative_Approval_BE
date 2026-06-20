import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

function decodePemFromEnv(value: string): string {
  if (!value) return "";
  return Buffer.from(value, "base64").toString("utf-8");
}

function parseCorsOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS || "";
  if (!raw.trim()) {
    return isProduction
      ? []
      : [
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:3039",
          "http://127.0.0.1:3000",
        ];
  }
  return raw.split(",").map((o) => o.trim()).filter(Boolean);
}

export const config = {
  database: {
    type: "postgres" as const,
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mydb",
    synchronize: false,
    logging: false,
    entities: [isProduction ? "dist/models/*.js" : "src/models/*.ts"],
    migrations: [
      isProduction
        ? "dist/database/migrations/**/*.js"
        : "src/database/migrations/**/*.ts",
    ],
    subscribers: [] as string[],
    poolSize: parseInt(process.env.DATABASE_POOL_MAX || "20", 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    debug: process.env.APP_DEBUG === "true",
  },
  logging: {
    logLevel: process.env.LOG_LEVEL || "error",
    logtailToken: process.env.LOGTAIL_TOKEN || "",
    logtailEndpoint: process.env.LOGTAIL_INGESTION_ENDPOINT || "",
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
  cors: {
    allowedOrigins: parseCorsOrigins(),
  },
  email: {
    emailUser: process.env.EMAIL_USER || "",
    emailPassword: process.env.EMAIL_PASSWORD || "",
    emailClientUrl: process.env.EMAIL_CLIENT_URL || "",
    sendgridSenderEmail: process.env.SENDGRID_EMAIL_USER_VERIFIED || "",
    sendgridApiKey: process.env.SENDGRID_EMAIL_API_KEY || "",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
  },
  slack: {
    token: process.env.SLACK_TOKEN || "",
  },
};
