import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/custom-error";

export function validateBody<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(
        new AppError({
          message: result.error.errors.map((e) => e.message).join("; "),
          statusCode: 400,
          code: "VALIDATION_ERROR",
        }),
      );
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateParams<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      next(
        new AppError({
          message: result.error.errors.map((e) => e.message).join("; "),
          statusCode: 400,
          code: "VALIDATION_ERROR",
        }),
      );
      return;
    }
    req.params = result.data;
    next();
  };
}
