import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { PermissionService } from "../services/permission.service";

export class LoadPermissionsMiddleware {
  constructor(private readonly permissionService: PermissionService) {}

  handle = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.userId) {
      next();
      return;
    }

    req.permissions = await this.permissionService.buildPermissions(
      req.userId,
      req.isSuperadmin ?? false,
    );
    next();
  };
}
