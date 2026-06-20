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
    origin: config.cors.allowedOrigins,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "HEAD",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: ["Content-Type", "Authorization", "X-Api-Key"],
    exposedHeaders: [
      "RateLimit-Limit",
      "RateLimit-Remaining",
      "RateLimit-Reset",
    ],
  }),
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 250,
  message: "Too many requests from this IP, please try again after 1 minute",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});

app.use(limiter);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorHandler);

export default app;
