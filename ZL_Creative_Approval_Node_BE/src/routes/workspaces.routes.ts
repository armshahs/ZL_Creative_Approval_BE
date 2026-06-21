import express from "express";
import { WorkspaceController } from "../controllers";
import { container } from "../container";
import {
  validateBody,
  validateParams,
  createWorkspaceSchema,
  updateWorkspaceSchema,
  grantAdminSchema,
  uuidParamSchema,
  workspaceIdParamSchema,
  workspaceUserParamsSchema,
} from "../validations";

const router = express.Router();
const workspaceController = new WorkspaceController();
const { authenticateMiddleware, loadPermissionsMiddleware, guardsMiddleware } =
  container;

const authChain = [
  authenticateMiddleware.handle,
  loadPermissionsMiddleware.handle,
];

router.get("/", ...authChain, workspaceController.list);
router.post(
  "/",
  ...authChain,
  validateBody(createWorkspaceSchema),
  workspaceController.create,
);
router.get(
  "/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  workspaceController.getById,
);
router.patch(
  "/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  validateBody(updateWorkspaceSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.id),
  workspaceController.update,
);
router.delete(
  "/:id",
  ...authChain,
  validateParams(uuidParamSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.id),
  workspaceController.remove,
);

router.get(
  "/:wsId/members",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
  workspaceController.listMembers,
);
router.post(
  "/:wsId/admins",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  validateBody(grantAdminSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
  workspaceController.grantAdmin,
);
router.delete(
  "/:wsId/admins/:userId",
  ...authChain,
  validateParams(workspaceUserParamsSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
  workspaceController.revokeAdmin,
);

router.get(
  "/:wsId/billing",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
  workspaceController.billing,
);
router.get(
  "/:wsId/metrics",
  ...authChain,
  validateParams(workspaceIdParamSchema),
  guardsMiddleware.requireWorkspaceAdmin((req) => req.params.wsId),
  workspaceController.metrics,
);

export default router;
