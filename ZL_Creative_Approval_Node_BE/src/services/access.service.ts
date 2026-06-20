import {
  UserRepository,
  WorkspaceRepository,
  WorkspaceAdminRepository,
  DashboardRepository,
  DashboardAccessRepository,
  RefreshTokenRepository,
  SystemSettingRepository,
} from "../repositories";
import { CryptoUtil } from "../utils/crypto.utils";
import { EmailService } from "./email.service";
import { DashboardAccessRole } from "../config/constants";
import AppError from "../errors/custom-error";

export class AccessService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceAdminRepository: WorkspaceAdminRepository,
    private readonly dashboardRepository: DashboardRepository,
    private readonly dashboardAccessRepository: DashboardAccessRepository,
    private readonly cryptoUtil: CryptoUtil,
    private readonly emailService: EmailService,
  ) {}

  async listMembers(workspaceId: string) {
    const [admins, dashboardAccess] = await Promise.all([
      this.workspaceAdminRepository.listByWorkspace(workspaceId),
      this.dashboardAccessRepository.listByWorkspace(workspaceId),
    ]);

    return {
      admins: admins.map((a) => ({
        userId: a.userId,
        email: a.user?.email,
        name: a.user?.name,
        grantedAt: a.createdAt,
      })),
      dashboardAccess: dashboardAccess.map((d) => ({
        userId: d.userId,
        email: d.user?.email,
        name: d.user?.name,
        dashboardId: d.dashboardId,
        dashboardName: d.dashboard?.name,
        role: d.role,
        grantedAt: d.createdAt,
      })),
    };
  }

  private async resolveUserByEmail(
    email: string,
    grantedByUserId: string,
  ): Promise<{ userId: string; isNewUser: boolean }> {
    const normalized = email.trim().toLowerCase();
    let user = await this.userRepository.findByEmail(normalized);

    if (user) {
      return { userId: user.id, isNewUser: false };
    }

    const localPart = normalized.split("@")[0] || "user";
    const unusableHash = await this.cryptoUtil.hashPassword(
      this.cryptoUtil.generateOpaqueToken(),
    );
    user = await this.userRepository.createPendingUser({
      email: normalized,
      passwordHash: unusableHash,
      name: localPart,
    });

    const resetToken = this.cryptoUtil.generateOpaqueToken();
    await this.userRepository.setResetToken(user.id, resetToken);
    await this.emailService.sendResetEmail(normalized, resetToken);

    return { userId: user.id, isNewUser: true };
  }

  async grantWorkspaceAdmin(
    workspaceId: string,
    userEmail: string,
    grantedByUserId: string,
  ) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new AppError({
        message: "Workspace not found",
        statusCode: 404,
        code: "WORKSPACE_NOT_FOUND",
      });
    }

    const { userId, isNewUser } = await this.resolveUserByEmail(
      userEmail,
      grantedByUserId,
    );

    const exists = await this.workspaceAdminRepository.exists(
      userId,
      workspaceId,
    );
    if (!exists) {
      await this.workspaceAdminRepository.grant({
        userId,
        workspaceId,
        grantedByUserId,
      });
    }

    if (!isNewUser) {
      await this.emailService.sendWorkspaceAddedEmail(
        userEmail.trim().toLowerCase(),
        workspace.name,
        "workspace admin",
      );
    }
  }

  async revokeWorkspaceAdmin(workspaceId: string, userId: string) {
    await this.workspaceAdminRepository.revoke(userId, workspaceId);
  }

  async grantDashboardAccess(
    dashboardId: string,
    userEmail: string,
    role: DashboardAccessRole,
    grantedByUserId: string,
  ) {
    const dashboard = await this.dashboardRepository.findById(dashboardId);
    if (!dashboard) {
      throw new AppError({
        message: "Dashboard not found",
        statusCode: 404,
        code: "DASHBOARD_NOT_FOUND",
      });
    }

    const workspace = await this.workspaceRepository.findById(
      dashboard.workspaceId,
    );
    if (!workspace) {
      throw new AppError({
        message: "Workspace not found",
        statusCode: 404,
        code: "WORKSPACE_NOT_FOUND",
      });
    }

    const { userId, isNewUser } = await this.resolveUserByEmail(
      userEmail,
      grantedByUserId,
    );

    const exists = await this.dashboardAccessRepository.exists(
      userId,
      dashboardId,
    );
    if (!exists) {
      await this.dashboardAccessRepository.grant({
        userId,
        workspaceId: dashboard.workspaceId,
        dashboardId,
        role,
        grantedByUserId,
      });
    }

    if (!isNewUser) {
      await this.emailService.sendWorkspaceAddedEmail(
        userEmail.trim().toLowerCase(),
        workspace.name,
        `${role} (${dashboard.name})`,
      );
    }
  }

  async revokeDashboardAccess(dashboardId: string, userId: string) {
    await this.dashboardAccessRepository.revoke(userId, dashboardId);
  }
}

export class SuperadminService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
  ) {}

  async listWorkspaces() {
    return this.workspaceRepository.listAll();
  }

  async listUsers() {
    return this.userRepository.listAll();
  }

  async grantSuperadmin(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: "User not found",
        statusCode: 404,
        code: "USER_NOT_FOUND",
      });
    }
    await this.userRepository.setSuperadmin(userId, true);
  }

  async revokeSuperadmin(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: "User not found",
        statusCode: 404,
        code: "USER_NOT_FOUND",
      });
    }
    await this.userRepository.setSuperadmin(userId, false);
  }

  async revokeAllForUser(userId: string) {
    await this.userRepository.incrementTokenVersion(userId);
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  async globalRevoke() {
    await this.systemSettingRepository.setGlobalRevokeEpoch(new Date());
    await this.refreshTokenRepository.revokeAllActive();
  }
}
