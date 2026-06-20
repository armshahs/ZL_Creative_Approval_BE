import {
  WorkspaceAdminRepository,
  DashboardAccessRepository,
} from "../repositories";

export class PermissionService {
  constructor(
    private readonly workspaceAdminRepository: WorkspaceAdminRepository,
    private readonly dashboardAccessRepository: DashboardAccessRepository,
  ) {}

  async buildPermissions(userId: string, isSuperadmin: boolean) {
    const [adminWorkspaceIds, accessRows] = await Promise.all([
      this.workspaceAdminRepository.findWorkspaceIdsByUserId(userId),
      this.dashboardAccessRepository.findAccessByUserId(userId),
    ]);

    const dashboardAccess: Record<string, "team" | "guest"> = {};
    for (const row of accessRows) {
      dashboardAccess[row.dashboardId] = row.role;
    }

    return { isSuperadmin, adminWorkspaceIds, dashboardAccess };
  }

  canAdminWorkspace(
    permissions: {
      isSuperadmin: boolean;
      adminWorkspaceIds: string[];
    },
    workspaceId: string,
  ): boolean {
    if (permissions.isSuperadmin) return true;
    return permissions.adminWorkspaceIds.includes(workspaceId);
  }

  canAccessDashboard(
    permissions: {
      isSuperadmin: boolean;
      adminWorkspaceIds: string[];
      dashboardAccess: Record<string, string>;
    },
    dashboardId: string,
    workspaceId: string,
  ): boolean {
    if (permissions.isSuperadmin) return true;
    if (permissions.adminWorkspaceIds.includes(workspaceId)) return true;
    return dashboardId in permissions.dashboardAccess;
  }

  hasDashboardRole(
    permissions: {
      isSuperadmin: boolean;
      adminWorkspaceIds: string[];
      dashboardAccess: Record<string, "team" | "guest">;
    },
    dashboardId: string,
    workspaceId: string,
    roles: Array<"team" | "guest">,
  ): boolean {
    if (permissions.isSuperadmin) return true;
    if (permissions.adminWorkspaceIds.includes(workspaceId)) return true;
    const role = permissions.dashboardAccess[dashboardId];
    return role !== undefined && roles.includes(role);
  }
}
