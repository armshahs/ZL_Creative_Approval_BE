import express from "express";
import { DashboardController } from "../controllers";
import { container } from "../container";
import { requireWorkspaceAdminForDashboard } from "../middleware/dashboardWorkspaceAdmin.middleware";
import {
  validateBody,
  validateParams,
  createDashboardSchema,
  updateDashboardSchema,
  grantDashboardAccessSchema,
  uuidParamSchema,
  workspaceIdParamSchema,
  dashboardAccessParamsSchema,
} from "../validations";

const router = express.Router();
const dashboardController = new DashboardController();
const { authenticateMiddleware, loadPermissionsMiddleware, guardsMiddleware } =
  container;

const authChain = [
  authenticateMiddleware.handle, // verifies the user is logged in (typically via JWT/session).
  loadPermissionsMiddleware.handle, //  loads the user's permissions into req.permissions so later guards can check access
];

router.get(
  "/workspaces/:wsId/dashboards",
  ...authChain, // verified JWT and loads user permissions.
  validateParams(workspaceIdParamSchema), // validated url parameter with Zod
  dashboardController.listByWorkspace,
);
router.post(
  "/workspaces/:wsId/dashboards",
  ...authChain, // verified JWT and loads user permissions.
  validateParams(workspaceIdParamSchema), // validated url parameter with Zod
  validateBody(createDashboardSchema), // validates request body with Zod
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId), // authorization guard for admin, team, client etc.
  dashboardController.create,
);

router.get(
  "/dashboards/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  guardsMiddleware.requireDashboardAccess((req) => req.params.id),
  dashboardController.getById,
);
router.patch(
  "/dashboards/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  validateBody(updateDashboardSchema),
  requireWorkspaceAdminForDashboard((req) => req.params.id),
  dashboardController.update,
);
router.delete(
  "/dashboards/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  requireWorkspaceAdminForDashboard((req) => req.params.id),
  dashboardController.remove,
);

router.post(
  "/dashboards/:id/access",
  ...authChain,
  validateParams(uuidParamSchema),
  validateBody(grantDashboardAccessSchema),
  requireWorkspaceAdminForDashboard((req) => req.params.id),
  dashboardController.grantAccess,
);
router.delete(
  "/dashboards/:id/access/:userId",
  ...authChain,
  validateParams(dashboardAccessParamsSchema),
  requireWorkspaceAdminForDashboard((req) => req.params.id),
  dashboardController.revokeAccess,
);

export default router;
