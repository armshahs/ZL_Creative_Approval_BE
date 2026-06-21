import { Response, NextFunction, Request } from "express";
import { LoginAttemptRepository } from "../repositories";
import { config } from "../config/config";
import AppError from "../errors/custom-error";

export class AuthRateLimiterMiddleware {
  constructor(
    private readonly loginAttemptRepository: LoginAttemptRepository,
  ) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    const count = await this.loginAttemptRepository.countRecentByIp(ip);
    if (count >= config.auth.authRateLimitMax) {
      next(
        new AppError({
          message: "Too many requests. Please try again later.",
          statusCode: 429,
          code: "RATE_LIMITED",
        }),
      );
      return;
    }

    await this.loginAttemptRepository.record(ip);
    next();
  };
}
