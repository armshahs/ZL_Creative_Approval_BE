import express from "express";
import { SuperadminController } from "../controllers";
import { container } from "../container";
import { validateParams, uuidParamSchema } from "../validations";

const router = express.Router();
const superadminController = new SuperadminController();
const {
  authenticateMiddleware,
  loadPermissionsMiddleware,
  guardsMiddleware,
} = container;

const superadminChain = [
  authenticateMiddleware.handle,
  loadPermissionsMiddleware.handle,
  guardsMiddleware.requireSuperadmin,
];

router.get("/workspaces", ...superadminChain, superadminController.listWorkspaces);
router.get("/users", ...superadminChain, superadminController.listUsers);
router.post(
  "/users/:id/grant-superadmin",
  ...superadminChain,
  validateParams(uuidParamSchema),
  superadminController.grantSuperadmin,
);
router.delete(
  "/users/:id/superadmin",
  ...superadminChain,
  validateParams(uuidParamSchema),
  superadminController.revokeSuperadmin,
);
router.post(
  "/users/:id/revoke-all",
  ...superadminChain,
  validateParams(uuidParamSchema),
  superadminController.revokeAllForUser,
);
router.post(
  "/security/global-revoke",
  ...superadminChain,
  superadminController.globalRevoke,
);

export default router;
