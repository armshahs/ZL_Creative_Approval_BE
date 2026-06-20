import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { JwtUtil } from "../utils/jwt.utils";
import { UserRepository, SystemSettingRepository } from "../repositories";
import AppError from "../errors/custom-error";

export class AuthenticateMiddleware {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly userRepository: UserRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
  ) {}

  handle = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

      if (!token) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const decoded = this.jwtUtil.verifyAccessToken(token);
      const globalEpoch =
        await this.systemSettingRepository.getGlobalRevokeEpoch();

      if (decoded.iat && decoded.iat * 1000 < globalEpoch.getTime()) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const user = await this.userRepository.findByIdForAuth(decoded.sub);
      if (!user || user.status === "suspended") {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      if (user.tokenVersion !== decoded.tv) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      req.userId = user.id;
      req.isSuperadmin = user.isSuperadmin;
      req.sessionFamilyId = decoded.sid;
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }
      next(
        new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        }),
      );
    }
  };
}
