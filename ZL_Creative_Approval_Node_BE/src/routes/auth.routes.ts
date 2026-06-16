import express from "express";
import { AuthController } from "../controllers";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";

const router = express.Router();

router.post("/signup-admin", AuthController.signUp);
// Always add authenticateJWT before authorizeRole or else it will not get req.user
router.post(
  "/signup",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.signUp,
);
router.post("/login", AuthController.login);
// Reset password for sending email, reset password-confirm for changing password.
router.post("/reset-password", AuthController.resetPasswordRequest);
router.post("/reset-password-confirm", AuthController.resetPasswordConfirm);
// --------------------------------------------------------
// --------------------------------------------------------
// Get my details
router.get("/me", authenticateJWT, AuthController.getMyDetails);
// Get all Users - admin access only
router.get(
  "/users",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.getAllUsers,
);
// Get all Employees - admin access only
router.get(
  "/employees",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.getAllEmployees,
);
// Get a sepecific used details - Admin access
router.get(
  "/users/:id",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.getUserDetails,
);

// update specific user details
router.patch(
  "/users/:id/update",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  AuthController.updateUserData,
);

export default router;
