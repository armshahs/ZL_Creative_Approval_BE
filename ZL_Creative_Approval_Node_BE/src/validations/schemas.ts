import { z } from "zod";
import { DASHBOARD_ACCESS_ROLE } from "../config/constants";

export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8),
  name: z
    .string()
    .min(1)
    .transform((v) => v.trim()),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((v) => v.trim()),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((v) => v.trim())
    .optional(),
  plan: z.string().optional(),
});

export const createDashboardSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((v) => v.trim()),
});

export const updateDashboardSchema = z.object({
  name: z
    .string()
    .min(1)
    .transform((v) => v.trim())
    .optional(),
});

export const grantAdminSchema = z.object({
  userEmail: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
});

export const grantDashboardAccessSchema = z.object({
  userEmail: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
  role: z.enum([DASHBOARD_ACCESS_ROLE.TEAM, DASHBOARD_ACCESS_ROLE.GUEST]),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});

export const workspaceIdParamSchema = z.object({
  wsId: z.string().uuid(),
});

export const workspaceUserParamsSchema = z.object({
  wsId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const dashboardAccessParamsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});
