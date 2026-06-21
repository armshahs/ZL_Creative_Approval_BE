import express from "express";
import { AuthController } from "../controllers";
import { container } from "../container";
import {
  validateBody,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  resetPasswordConfirmSchema,
} from "../validations";

const router = express.Router();
const authController = new AuthController();
const {
  authenticateMiddleware,
  loadPermissionsMiddleware,
  authRateLimiterMiddleware,
} = container;

const authChain = [
  authenticateMiddleware.handle,
  loadPermissionsMiddleware.handle,
];

router.post(
  "/register",
  authRateLimiterMiddleware.handle,
  validateBody(registerSchema),
  authController.register,
);
router.post(
  "/login",
  authRateLimiterMiddleware.handle,
  validateBody(loginSchema),
  authController.login,
);
router.post(
  "/refresh",
  authRateLimiterMiddleware.handle,
  authController.refresh,
);
router.post("/logout", authController.logout);
router.post("/logout-all", ...authChain, authController.logoutAll);
router.get("/me", ...authChain, authController.me);
router.post(
  "/reset-password",
  authRateLimiterMiddleware.handle,
  validateBody(resetPasswordSchema),
  authController.resetPasswordRequest,
);
router.post(
  "/reset-password-confirm",
  authRateLimiterMiddleware.handle,
  validateBody(resetPasswordConfirmSchema),
  authController.resetPasswordConfirm,
);
router.post("/mfa/enroll", ...authChain, authController.mfaEnroll);

export default router;
