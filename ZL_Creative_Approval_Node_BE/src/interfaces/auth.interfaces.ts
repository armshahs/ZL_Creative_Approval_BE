import { Request } from "express";
import { DashboardAccessRole } from "../config/constants";

export interface PermissionsObject {
  isSuperadmin: boolean;
  adminWorkspaceIds: string[];
  dashboardAccess: Record<string, DashboardAccessRole>;
}

export interface AuthRequest extends Request {
  userId?: string;
  isSuperadmin?: boolean;
  sessionFamilyId?: string;
  permissions?: PermissionsObject;
}

export interface PublicUserProfile {
  id: string;
  email: string;
  name: string;
  status: string;
  isSuperadmin: boolean;
  mfaEnabled: boolean;
}
