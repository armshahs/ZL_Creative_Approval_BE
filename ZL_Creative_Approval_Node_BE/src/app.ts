import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
  authRoutes,
  workspacesRoutes,
  dashboardsRoutes,
  superadminRoutes,
} from "./routes";
import { errorHandler } from "./middleware";
import { EntityNotFoundError } from "./errors";
import { logger } from "./utils";
import { config } from "./config/config";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      config.server.nodeEnv === "production"
        ? [
            "http://170.64.134.212", // Production Frontend IP
            "https://170.64.134.212", // Production Frontend IP
            "http://analytics.bluesensedigital.com.au",
            "https://analytics.bluesensedigital.com.au",
            "http://www.analytics.bluesensedigital.com.au",
            "https://www.analytics.bluesensedigital.com.au",
            "http://localhost:3039",
            "http://localhost:3000",
          ]
        : [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost:8001",
            "http://localhost:5173",
            "http://localhost:8080",
            "http://127.0.0.1:8000",
            "http://localhost:80",
            "http://localhost",
            "http://localhost:3039",
          ],
    credentials: true, // Required if you're using cookies, sessions, or Authorization headers
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "HEAD",
      "DELETE",
      "OPTIONS",
      "TRACE",
      "CONNECT",
    ], // Methods to allow in the request
    allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key"], // Headers to allow in the request
    exposedHeaders: [
      "RateLimit-Limit",
      "RateLimit-Remaining",
      "RateLimit-Reset",
    ], // Headers to expose in the response that can be read by the client
  }),
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 250, // Limit each IP to 250 requests per windowMs
  message: "Too many requests from this IP, please try again after 1 minute",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.method === "OPTIONS", // needed because OPTIONS requests are used for CORS preflight
});

// Apply rate limiting to all routes
app.use(limiter);
app.use(compression());
app.use(cookieParser()); // Parse cookies from the request for JWT refresh token.

// JSON request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/saas/api/v1/auth", authRoutes);
app.use("/saas/api/v1/workspaces", workspacesRoutes);
app.use("/saas/api/v1", dashboardsRoutes);
app.use("/saas/api/v1/superadmin", superadminRoutes);

app.get("/saas/api/v1/test", (req: Request, res: Response) => {
  logger.info("Sample request");
  res.status(200).json({
    message: "Hello World!",
  });
});
app.get("/saas/api/v1/test2", (req: Request, res: Response) => {
  // throw new Error("Oops");
  logger.error("Entity not found 3");
  logger
    .child({
      logMetadata: "User XX",
    })
    .error("Entity not found by user 3");
  throw new EntityNotFoundError({
    message: "Entity not found 3",
    statusCode: 404,
    code: "ERR_NF",
  });
  res.status(200).json({
    message: "Hello World!",
  });
});

// Error handling  (should be last middleware to process requests)
app.use(errorHandler);

export default app;
