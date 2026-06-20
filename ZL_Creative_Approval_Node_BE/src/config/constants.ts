export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const DASHBOARD_ACCESS_ROLE = {
  TEAM: "team",
  GUEST: "guest",
} as const;

export type DashboardAccessRole =
  (typeof DASHBOARD_ACCESS_ROLE)[keyof typeof DASHBOARD_ACCESS_ROLE];

export const REFRESH_COOKIE_NAME = "refresh_token";
