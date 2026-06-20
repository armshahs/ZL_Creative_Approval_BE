import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { container } from "../container";

export class SuperadminController {
  constructor(
    private readonly superadminService = container.superadminService,
  ) {}

  listWorkspaces = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const workspaces = await this.superadminService.listWorkspaces();
      res.status(200).json(workspaces);
    } catch (error) {
      next(error);
    }
  };

  listUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.superadminService.listUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  grantSuperadmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.superadminService.grantSuperadmin(req.params.id);
      res.status(200).json({ message: "Superadmin granted" });
    } catch (error) {
      next(error);
    }
  };

  revokeSuperadmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.superadminService.revokeSuperadmin(req.params.id);
      res.status(200).json({ message: "Superadmin revoked" });
    } catch (error) {
      next(error);
    }
  };

  revokeAllForUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.superadminService.revokeAllForUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  globalRevoke = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.superadminService.globalRevoke();
      res.status(200).json({ message: "Global revoke executed" });
    } catch (error) {
      next(error);
    }
  };
}
