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
const {
  authenticateMiddleware,
  loadPermissionsMiddleware,
  guardsMiddleware,
} = container;

const authChain = [
  authenticateMiddleware.handle,
  loadPermissionsMiddleware.handle,
];

router.get(
  "/workspaces/:wsId/dashboards",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  dashboardController.listByWorkspace,
);
router.post(
  "/workspaces/:wsId/dashboards",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  validateBody(createDashboardSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
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
