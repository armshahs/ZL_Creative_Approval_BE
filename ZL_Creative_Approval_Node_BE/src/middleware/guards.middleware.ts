import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { PermissionService } from "../services/permission.service";
import { DashboardService } from "../services/dashboard.service";
import AppError from "../errors/custom-error";
import { DashboardAccessRole } from "../config/constants";

export class GuardsMiddleware {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly dashboardService: DashboardService,
  ) {}

  requireSuperadmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.permissions?.isSuperadmin) {
      next(
        new AppError({
          message: "Forbidden",
          statusCode: 403,
          code: "FORBIDDEN",
        }),
      );
      return;
    }
    next();
  };

  requireWorkspaceAdmin(getWorkspaceId: (req: AuthRequest) => string) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.permissions) {
        next(
          new AppError({
            message: "Forbidden",
            statusCode: 403,
            code: "FORBIDDEN",
          }),
        );
        return;
      }

      const workspaceId = getWorkspaceId(req);
      if (
        !this.permissionService.canAdminWorkspace(req.permissions, workspaceId)
      ) {
        next(
          new AppError({
            message: "Not found",
            statusCode: 404,
            code: "NOT_FOUND",
          }),
        );
        return;
      }
      next();
    };
  }

  requireDashboardAccess(getDashboardId: (req: AuthRequest) => string) {
    return async (
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      if (!req.permissions) {
        next(
          new AppError({
            message: "Forbidden",
            statusCode: 403,
            code: "FORBIDDEN",
          }),
        );
        return;
      }

      const dashboardId = getDashboardId(req);
      const workspaceId =
        await this.dashboardService.resolveWorkspaceId(dashboardId);

      if (!workspaceId) {
        next(
          new AppError({
            message: "Not found",
            statusCode: 404,
            code: "NOT_FOUND",
          }),
        );
        return;
      }

      if (
        !this.permissionService.canAccessDashboard(
          req.permissions,
          dashboardId,
          workspaceId,
        )
      ) {
        next(
          new AppError({
            message: "Not found",
            statusCode: 404,
            code: "NOT_FOUND",
          }),
        );
        return;
      }

      next();
    };
  }

  requireDashboardRole(
    getDashboardId: (req: AuthRequest) => string,
    roles: DashboardAccessRole[],
  ) {
    return async (
      req: AuthRequest,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      if (!req.permissions) {
        next(
          new AppError({
            message: "Forbidden",
            statusCode: 403,
            code: "FORBIDDEN",
          }),
        );
        return;
      }

      const dashboardId = getDashboardId(req);
      const workspaceId =
        await this.dashboardService.resolveWorkspaceId(dashboardId);

      if (!workspaceId) {
        next(
          new AppError({
            message: "Not found",
            statusCode: 404,
            code: "NOT_FOUND",
          }),
        );
        return;
      }

      if (
        !this.permissionService.hasDashboardRole(
          req.permissions,
          dashboardId,
          workspaceId,
          roles,
        )
      ) {
        next(
          new AppError({
            message: "Forbidden",
            statusCode: 403,
            code: "FORBIDDEN",
          }),
        );
        return;
      }

      next();
    };
  }

  requireWorkspaceAccess(getWorkspaceId: (req: AuthRequest) => string) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.permissions) {
        next(
          new AppError({
            message: "Forbidden",
            statusCode: 403,
            code: "FORBIDDEN",
          }),
        );
        return;
      }

      const workspaceId = getWorkspaceId(req);
      const { isSuperadmin, adminWorkspaceIds, dashboardAccess } =
        req.permissions;

      if (isSuperadmin || adminWorkspaceIds.includes(workspaceId)) {
        next();
        return;
      }

      const hasDashboardInWorkspace = Object.keys(dashboardAccess).length > 0;
      if (!hasDashboardInWorkspace) {
        next(
          new AppError({
            message: "Not found",
            statusCode: 404,
            code: "NOT_FOUND",
          }),
        );
        return;
      }

      next();
    };
  }
}
