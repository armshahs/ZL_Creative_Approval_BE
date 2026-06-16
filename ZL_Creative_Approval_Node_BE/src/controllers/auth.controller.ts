import { Request, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest, User } from "../interfaces";
import { ROLES } from "../config";

export class AuthController {
  static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId, role, brands } = await AuthService.signUp(
        req.body.email.trim(),
        req.body.password.trim(),
        req.body.role,
        req.body.name.trim(),
        req.body.brands,
      );
      res.status(201).json({ token, userId, role, brands });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, userId, role } = await AuthService.login(
        req.body.email.trim(),
        req.body.password.trim(),
      );
      res.status(200).json({ token, userId, role });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(401).json({ message: err.message });
      return;
    }
  }

  static async resetPasswordRequest(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      await AuthService.resetPasswordRequest(req.body.email.trim());
      res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  static async resetPasswordConfirm(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      await AuthService.resetPasswordConfirm(
        req.body.token,
        req.body.newPassword.trim(),
        req.body.confirmPassword.trim(),
      );
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get own details ----------------------------------------------------
  static async getMyDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(400).json({ message: "User not authenticated" });
        return;
      }

      // Access `user` from `req` safely
      const user: User | null = await AuthService.getUserDetails(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get user details by admin access ---------------------------------------------------
  static async getUserDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user: User | null = await AuthService.getUserDetails(id);
      res.status(200).json(user);
    } catch (error) {
      const err = error as Error; // Type assertion
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Controller method for getting all users ----------------------------------------
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Controller method for getting all employees - admin access only ----------------------------------------
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllEmployees();
      res.status(200).json(users);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // PATCH specific user's role---------------------------------------------------
  static async updateUserData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const role = req.body.role.trim();
      const name = req.body.name.trim();
      const brands = req.body.brands;

      if (!role || !name || !brands) {
        res.status(400).json({ message: "Role, name and brands is required." });
        return;
      }

      // Validate if the role is one of the allowed roles
      if (!Object.values(ROLES).includes(role)) {
        res.status(400).json({
          message: `Invalid role. Allowed roles are: ${Object.values(ROLES).join(", ")}`,
        });
        return;
      }

      const updatedUser = await AuthService.updateUserData(
        id,
        role,
        name,
        brands,
      );

      if (!updatedUser) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ message: err.message });
      return;
    }
  }
}
