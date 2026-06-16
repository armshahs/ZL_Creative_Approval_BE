import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces";
import { RoleType } from "../config";

export const authorizeRole = (allowedRoles: RoleType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden - Insufficient permissions" });
      return;
    }
    next();
  };
};
