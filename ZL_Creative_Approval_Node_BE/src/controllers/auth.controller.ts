import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { container } from "../container";
import AppError from "../errors/custom-error";
import { config } from "../config/config";

export class AuthController {
  constructor(
    private readonly authService = container.authService,
  ) {}

  register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register(
        email,
        password,
        name,
        res,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password, res);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const raw = req.cookies?.[config.auth.refreshCookieName] as string | undefined;
      const result = await this.authService.refresh(raw, res);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const raw = req.cookies?.[config.auth.refreshCookieName] as string | undefined;
      await this.authService.logout(raw, res);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      await this.authService.logoutAll(req.userId, res);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      const user = await this.authService.getMe(req.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  resetPasswordRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.authService.resetPasswordRequest(req.body.email);
      res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
      next(error);
    }
  };

  resetPasswordConfirm = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      await this.authService.resetPasswordConfirm(
        token,
        newPassword,
        confirmPassword,
      );
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  };

  mfaEnroll = (_req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "MFA enrollment not implemented" });
  };
}
