import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware";
import { ROLES } from "../config";
import { CurrencyController } from "../controllers";

const router = express.Router();

// Create currency - admin only
router.post(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  CurrencyController.createCurrency,
);
// Get all currencies - admin only
router.get(
  "/",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  CurrencyController.getAllCurrencies,
);
// Update exchange rate manually using openexchangeapi
router.post(
  "/currency-exchange-manual-cron",
  authenticateJWT,
  authorizeRole([ROLES.ADMIN]),
  CurrencyController.updateCurrencyExchangeRate,
);

export default router;
