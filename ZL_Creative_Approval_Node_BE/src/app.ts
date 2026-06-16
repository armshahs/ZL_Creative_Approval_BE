import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { authRoutes, podRoutes, brandRoutes, currencyRoutes } from "./routes";
// import { AppDataSource } from "./database";
import { errorHandler } from "./middleware";
import { EntityNotFoundError } from "./errors";
import { logger } from "./utils";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// JSON request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/saas/api/v1/auth/", authRoutes);
app.use("/saas/api/v1/pods/", podRoutes);
app.use("/saas/api/v1/brands/", brandRoutes);
app.use("/saas/api/v1/currency/", currencyRoutes);

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
