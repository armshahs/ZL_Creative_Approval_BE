import { Response } from "express";
import { CookieOptions } from "express";
import { config } from "../config/config";
import { UserRepository, RefreshTokenRepository } from "../repositories";
import { CryptoUtil } from "../utils/crypto.utils";
import { JwtUtil } from "../utils/jwt.utils";
import { EmailService } from "./email.service";
import { USER_STATUS } from "../config/constants";
import { PublicUserProfile } from "../interfaces/auth.interfaces";
import { User } from "../models";
import AppError from "../errors/custom-error";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly cryptoUtil: CryptoUtil,
    private readonly jwtUtil: JwtUtil,
    private readonly emailService: EmailService,
  ) {}

  private cookieOptions(): CookieOptions {
    const isProduction = config.server.nodeEnv === "production";
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      domain: config.auth.cookieDomain,
      path: "/",
      maxAge: config.auth.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
    };
  }

  private toPublicUser(user: User): PublicUserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      isSuperadmin: user.isSuperadmin,
      mfaEnabled: user.mfaEnabled,
    };
  }

  private async issueSession(
    user: User,
    res: Response,
    familyId?: string,
  ): Promise<{ accessToken: string; user: PublicUserProfile }> {
    const sessionFamilyId = familyId ?? this.cryptoUtil.generateFamilyId();
    const rawRefresh = this.cryptoUtil.generateOpaqueToken();
    const tokenHash = this.cryptoUtil.hashToken(rawRefresh);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.auth.refreshTokenTtlDays);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash,
      familyId: sessionFamilyId,
      expiresAt,
    });

    res.cookie(config.auth.refreshCookieName, rawRefresh, this.cookieOptions());

    const accessToken = this.jwtUtil.signAccessToken({
      userId: user.id,
      sessionFamilyId,
      tokenVersion: user.tokenVersion,
    });

    return { accessToken, user: this.toPublicUser(user) };
  }

  async register(
    email: string,
    password: string,
    name: string,
    res: Response,
  ) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError({
        message: "Registration failed",
        statusCode: 400,
        code: "REGISTRATION_FAILED",
      });
    }

    const passwordHash = await this.cryptoUtil.hashPassword(password);
    const user = await this.userRepository.createUser({
      email,
      passwordHash,
      name,
      status: USER_STATUS.ACTIVE,
    });

    return this.issueSession(user, res);
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.userRepository.findByEmail(email);
    if (
      !user ||
      user.status === USER_STATUS.SUSPENDED ||
      user.status === USER_STATUS.PENDING
    ) {
      throw new AppError({
        message: "Invalid credentials",
        statusCode: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    const valid = await this.cryptoUtil.verifyPassword(
      user.passwordHash,
      password,
    );
    if (!valid) {
      throw new AppError({
        message: "Invalid credentials",
        statusCode: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    return this.issueSession(user, res);
  }

  async refresh(rawRefreshToken: string | undefined, res: Response) {
    if (!rawRefreshToken) {
      throw new AppError({
        message: "Unauthorized",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const tokenHash = this.cryptoUtil.hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      if (stored?.familyId) {
        await this.refreshTokenRepository.revokeFamily(stored.familyId);
      }
      res.clearCookie(config.auth.refreshCookieName, this.cookieOptions());
      throw new AppError({
        message: "Unauthorized",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user || user.status === USER_STATUS.SUSPENDED) {
      await this.refreshTokenRepository.revokeFamily(stored.familyId);
      res.clearCookie(config.auth.refreshCookieName, this.cookieOptions());
      throw new AppError({
        message: "Unauthorized",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const newRaw = this.cryptoUtil.generateOpaqueToken();
    const newHash = this.cryptoUtil.hashToken(newRaw);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.auth.refreshTokenTtlDays);

    await this.refreshTokenRepository.rotateToken(stored.id, {
      userId: user.id,
      tokenHash: newHash,
      familyId: stored.familyId,
      expiresAt,
    });

    res.cookie(config.auth.refreshCookieName, newRaw, this.cookieOptions());

    const accessToken = this.jwtUtil.signAccessToken({
      userId: user.id,
      sessionFamilyId: stored.familyId,
      tokenVersion: user.tokenVersion,
    });

    return { accessToken, user: this.toPublicUser(user) };
  }

  async logout(rawRefreshToken: string | undefined, res: Response) {
    if (rawRefreshToken) {
      const tokenHash = this.cryptoUtil.hashToken(rawRefreshToken);
      const stored = await this.refreshTokenRepository.findByHash(tokenHash);
      if (stored?.familyId) {
        await this.refreshTokenRepository.revokeFamily(stored.familyId);
      }
    }
    res.clearCookie(config.auth.refreshCookieName, this.cookieOptions());
  }

  async logoutAll(userId: string, res: Response) {
    await this.userRepository.incrementTokenVersion(userId);
    await this.refreshTokenRepository.revokeAllForUser(userId);
    res.clearCookie(config.auth.refreshCookieName, this.cookieOptions());
  }

  async getMe(userId: string): Promise<PublicUserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: "User not found",
        statusCode: 404,
        code: "USER_NOT_FOUND",
      });
    }
    return this.toPublicUser(user);
  }

  async resetPasswordRequest(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    const token = this.cryptoUtil.generateOpaqueToken();
    await this.userRepository.setResetToken(user.id, token);
    await this.emailService.sendResetEmail(email, token);
  }

  async resetPasswordConfirm(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new AppError({
        message: "Passwords do not match",
        statusCode: 400,
        code: "PASSWORD_MISMATCH",
      });
    }

    const user = await this.userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError({
        message: "Invalid or expired reset token",
        statusCode: 400,
        code: "INVALID_RESET_TOKEN",
      });
    }

    const passwordHash = await this.cryptoUtil.hashPassword(newPassword);
    const activate = user.status === USER_STATUS.PENDING;
    await this.userRepository.updatePasswordAndActivate(
      user.id,
      passwordHash,
      activate,
    );
  }
}
