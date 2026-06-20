import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { container } from "../container";
import AppError from "../errors/custom-error";

export class DashboardController {
  constructor(
    private readonly dashboardService = container.dashboardService,
    private readonly accessService = container.accessService,
  ) {}

  listByWorkspace = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.userId || !req.permissions) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const workspaceId = req.params.wsId;
      const dashboardWsIds =
        await container.dashboardAccessRepository.findWorkspaceIdsByUserId(
          req.userId,
        );
      const canAccess =
        req.permissions.isSuperadmin ||
        req.permissions.adminWorkspaceIds.includes(workspaceId) ||
        dashboardWsIds.includes(workspaceId);

      if (!canAccess) {
        throw new AppError({
          message: "Not found",
          statusCode: 404,
          code: "NOT_FOUND",
        });
      }

      const dashboards = await this.dashboardService.listForWorkspace(
        workspaceId,
        req.permissions,
      );
      res.status(200).json(dashboards);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dashboard = await this.dashboardService.create(
        req.params.wsId,
        req.body.name,
      );
      res.status(201).json(dashboard);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dashboard = await this.dashboardService.getById(req.params.id);
      res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dashboard = await this.dashboardService.update(
        req.params.id,
        req.body,
      );
      res.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.dashboardService.softDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  grantAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      await this.accessService.grantDashboardAccess(
        req.params.id,
        req.body.userEmail,
        req.body.role,
        req.userId,
      );
      res.status(201).json({ message: "Dashboard access granted" });
    } catch (error) {
      next(error);
    }
  };

  revokeAccess = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.accessService.revokeDashboardAccess(
        req.params.id,
        req.params.userId,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
