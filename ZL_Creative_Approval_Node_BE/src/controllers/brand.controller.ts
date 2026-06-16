import { Request, Response } from "express";
import { AuthRequest } from "../interfaces";
import { BrandService } from "../services";
import { logger, logError } from "../utils";

export class BrandController {
  // ============================================================================================
  // BRAND OWNERSHIP APIs (General Settings Tabs) - Admin acces only
  // ============================================================================================
  // [BRAND_OWNERSHIP] Create brand -admin only -----------------------------------------------
  static async createBrand(req: Request, res: Response): Promise<void> {
    try {
      // While destructuring the code, req.body assigns undefined to performanceMarketerID which is fine since it is optional.
      const { name, performanceMarketerId } = req.body;
      const newBrand = await BrandService.createBrand(
        name,
        performanceMarketerId,
      );
      res.status(201).json(newBrand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // [BRAND_OWNERSHIP] Get all brands - admin only -----------------------------------------------------------
  static async getAllBrandsOwnership(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const brands = await BrandService.getAllBrandsOwnership();
      res.status(200).json(brands);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // [BRAND_OWNERSHIP] Get specific brand details -admin only -----------------------------------------------------------
  static async getBrandDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await BrandService.getBrandDetails(id);
      res.status(200).json(brand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // [BRAND_OWNERSHIP] Update specific brand details - admin only -----------------------------------------------------------
  static async updateBrandDetailsOwnership(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, performanceMarketerId } = req.body;
      const brand = await BrandService.updateBrandDetailsOwnership(
        id,
        name,
        performanceMarketerId,
      );
      res.status(200).json(brand);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // [BRAND_OWNERSHIP] Delete specific brand  - admin only -----------------------------------------------------------
  static async deleteBrand(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BrandService.deleteBrand(id);
      res.status(204).json();
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // ============================================================================================
  // BRAND APIs - General Access
  // ============================================================================================

  // Get all brands for me -----------------------------------------------------------
  static async getAllBrandsForMe(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new Error("Request user missing");
      }
      const user_id = req.user.id;
      const user_role = req.user.role;
      const brands = await BrandService.getAllBrandsForMe(user_id, user_role);
      res.status(200).json(brands);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }
}
