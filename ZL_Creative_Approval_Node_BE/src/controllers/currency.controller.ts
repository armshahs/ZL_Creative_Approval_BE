import { Request, Response } from "express";
import { logger, logError } from "../utils";
import { CurrencyService } from "../services";

export class CurrencyController {
  // Create a new currency  ---------------------------------------------------
  static async createCurrency(req: Request, res: Response) {
    try {
      const code = req.body.code.trim();
      const name = req.body.name.trim();
      const symbol = req.body.symbol.trim();

      const currency = await CurrencyService.createCurrency(code, name, symbol);
      res.status(201).json(currency);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get all currencies ------------------------------------------------------
  static async getAllCurrencies(req: Request, res: Response) {
    try {
      const currencies = await CurrencyService.getAllCurrencies();
      res.status(200).json(currencies);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Run currency update through API endpoint --------------------------------
  static async updateCurrencyExchangeRate(req: Request, res: Response) {
    try {
      await CurrencyService.updateExchangeRates();
      res.status(201).json({ message: "Currency updated successfully" });
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(500).json({ message: err.message });
      return;
    }
  }
}
