import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";
import { PodController } from "../controllers";

const router = express.Router();

// Create pod
router.post(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  PodController.createPod,
);
// Get all pods
router.get(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  PodController.getAllPods,
);
// Get pod by ID
router.get(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  PodController.getPodById,
);
// Update pod by ID
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  PodController.updatePod,
);
// Delete pod
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  PodController.deletePod,
);

export default router;
