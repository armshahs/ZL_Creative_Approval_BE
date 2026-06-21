import { AppDataSource } from "./database";
import {
  UserRepository,
  WorkspaceRepository,
  DashboardRepository,
  WorkspaceAdminRepository,
  DashboardAccessRepository,
  RefreshTokenRepository,
  LoginAttemptRepository,
  SystemSettingRepository,
} from "./repositories";
import { CryptoUtil } from "./utils/crypto.utils";
import { JwtUtil } from "./utils/jwt.utils";
import {
  AuthService,
  PermissionService,
  WorkspaceService,
  DashboardService,
  AccessService,
  SuperadminService,
  EmailService,
} from "./services";
import { AuthenticateMiddleware } from "./middleware/authenticate.middleware";
import { LoadPermissionsMiddleware } from "./middleware/loadPermissions.middleware";
import { GuardsMiddleware } from "./middleware/guards.middleware";
import { AuthRateLimiterMiddleware } from "./middleware/authRateLimiter.middleware";

// container.ts is the composition root for the Auth/RBAC system — a single place
// where all dependencies are instantiated once and wired together.
class Container {
  readonly cryptoUtil = new CryptoUtil();
  readonly jwtUtil = new JwtUtil();
  readonly emailService = new EmailService();

  readonly userRepository = new UserRepository(AppDataSource);
  readonly workspaceRepository = new WorkspaceRepository(AppDataSource);
  readonly dashboardRepository = new DashboardRepository(AppDataSource);
  readonly workspaceAdminRepository = new WorkspaceAdminRepository(
    AppDataSource,
  );
  readonly dashboardAccessRepository = new DashboardAccessRepository(
    AppDataSource,
  );
  readonly refreshTokenRepository = new RefreshTokenRepository(AppDataSource);
  readonly loginAttemptRepository = new LoginAttemptRepository(AppDataSource);
  readonly systemSettingRepository = new SystemSettingRepository(AppDataSource);

  readonly permissionService = new PermissionService(
    this.workspaceAdminRepository,
    this.dashboardAccessRepository,
  );

  readonly authService = new AuthService(
    this.userRepository,
    this.refreshTokenRepository,
    this.cryptoUtil,
    this.jwtUtil,
    this.emailService,
  );

  readonly workspaceService = new WorkspaceService(
    this.workspaceRepository,
    this.workspaceAdminRepository,
    this.dashboardAccessRepository,
  );

  readonly dashboardService = new DashboardService(this.dashboardRepository);

  readonly accessService = new AccessService(
    this.userRepository,
    this.workspaceRepository,
    this.workspaceAdminRepository,
    this.dashboardRepository,
    this.dashboardAccessRepository,
    this.cryptoUtil,
    this.emailService,
  );

  readonly superadminService = new SuperadminService(
    this.workspaceRepository,
    this.userRepository,
    this.refreshTokenRepository,
    this.systemSettingRepository,
  );

  readonly authenticateMiddleware = new AuthenticateMiddleware(
    this.jwtUtil,
    this.userRepository,
    this.systemSettingRepository,
  );

  readonly loadPermissionsMiddleware = new LoadPermissionsMiddleware(
    this.permissionService,
  );

  readonly guardsMiddleware = new GuardsMiddleware(
    this.permissionService,
    this.dashboardService,
  );

  readonly authRateLimiterMiddleware = new AuthRateLimiterMiddleware(
    this.loginAttemptRepository,
  );
}

export const container = new Container();
