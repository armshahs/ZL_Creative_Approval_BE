import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config, RoleType } from "../config";
import { AuthRequest } from "../interfaces";

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized - Token missing" });
    return; // Return here to stop further execution
  }
  jwt.verify(token, config.auth.jwtSecret as string, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Forbidden - Invalid token" });
      return; // Return here to stop further execution if verification fails
    }

    // Make sure the decoded value matches the type
    // console.log(decoded);
    req.user = decoded as { id: string; role: RoleType };
    // console.log(req.user);
    next();
  });
};
