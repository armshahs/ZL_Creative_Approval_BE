import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { container } from "../container";
import AppError from "../errors/custom-error";

export class WorkspaceController {
  constructor(
    private readonly workspaceService = container.workspaceService,
    private readonly accessService = container.accessService,
    private readonly dashboardAccessRepository = container.dashboardAccessRepository,
  ) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId || !req.permissions) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      const workspaces = await this.workspaceService.listForUser(
        req.userId,
        req.permissions,
      );
      res.status(200).json(workspaces);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      const workspace = await this.workspaceService.create(
        req.body.name,
        req.userId,
      );
      res.status(201).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId || !req.permissions) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }

      const workspaceId = req.params.id;
      const workspace = await this.workspaceService.getById(workspaceId);

      const dashboardWsIds =
        await this.dashboardAccessRepository.findWorkspaceIdsByUserId(req.userId);
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

      res.status(200).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workspace = await this.workspaceService.update(
        req.params.id,
        req.body,
      );
      res.status(200).json(workspace);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.workspaceService.softDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  listMembers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const members = await this.accessService.listMembers(req.params.wsId);
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  };

  grantAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError({
          message: "Unauthorized",
          statusCode: 401,
          code: "UNAUTHORIZED",
        });
      }
      await this.accessService.grantWorkspaceAdmin(
        req.params.wsId,
        req.body.userEmail,
        req.userId,
      );
      res.status(201).json({ message: "Admin access granted" });
    } catch (error) {
      next(error);
    }
  };

  revokeAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.accessService.revokeWorkspaceAdmin(
        req.params.wsId,
        req.params.userId,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  billing = (_req: AuthRequest, res: Response) => {
    res.status(200).json({ status: "stub", billing: null });
  };

  metrics = (_req: AuthRequest, res: Response) => {
    res.status(200).json({ status: "stub", metrics: {} });
  };
}
