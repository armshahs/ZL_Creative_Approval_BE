import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interfaces";
import { container } from "../container";
import AppError from "../errors/custom-error";

export function requireWorkspaceAdminForDashboard(
  getDashboardId: (req: AuthRequest) => string,
) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const dashboardId = getDashboardId(req);
    const workspaceId =
      await container.dashboardService.resolveWorkspaceId(dashboardId);

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

    container.guardsMiddleware.requireWorkspaceAdmin(() => workspaceId)(
      req,
      res,
      next,
    );
  };
}
