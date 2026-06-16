import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import {
  getErrorMessage,
  getAppErrorInstanceFromGaxiosError,
  isGaxiosError,
} from "../utils";
import { AppError } from "../errors/";

// Default error handler for entire Nodejs app
export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent || config.server.debug) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  if (isGaxiosError(error)) {
    const modifiedErrorObject = getAppErrorInstanceFromGaxiosError(error);
    res.status(modifiedErrorObject.statusCode).json({
      error: {
        message: modifiedErrorObject.message,
        code: modifiedErrorObject.code,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        "An error occurred. Please view logs for more details",
    },
  });
}
