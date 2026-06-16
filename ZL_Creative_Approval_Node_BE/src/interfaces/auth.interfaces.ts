import { Request } from "express";
import { RoleType } from "../config";

export interface AuthRequest extends Request {
  user?: { id: string; role: RoleType }; // Assuming `user` has at least an `id` field
}
