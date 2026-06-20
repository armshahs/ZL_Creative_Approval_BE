import { DashboardRepository } from "../repositories";
import { PermissionsObject } from "../interfaces/auth.interfaces";
import AppError from "../errors/custom-error";

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async listForWorkspace(
    workspaceId: string,
    permissions: PermissionsObject,
  ) {
    const all = await this.dashboardRepository.listByWorkspace(workspaceId);

    if (permissions.isSuperadmin) return all;
    if (permissions.adminWorkspaceIds.includes(workspaceId)) return all;

    return all.filter((d) => d.id in permissions.dashboardAccess);
  }

  async create(workspaceId: string, name: string) {
    return this.dashboardRepository.create({ workspaceId, name });
  }

  async getById(id: string) {
    const dashboard = await this.dashboardRepository.findById(id);
    if (!dashboard) {
      throw new AppError({
        message: "Dashboard not found",
        statusCode: 404,
        code: "DASHBOARD_NOT_FOUND",
      });
    }
    return dashboard;
  }

  async update(id: string, data: { name?: string }) {
    const dashboard = await this.dashboardRepository.update(id, data);
    if (!dashboard) {
      throw new AppError({
        message: "Dashboard not found",
        statusCode: 404,
        code: "DASHBOARD_NOT_FOUND",
      });
    }
    return dashboard;
  }

  async softDelete(id: string) {
    const dashboard = await this.dashboardRepository.findById(id);
    if (!dashboard) {
      throw new AppError({
        message: "Dashboard not found",
        statusCode: 404,
        code: "DASHBOARD_NOT_FOUND",
      });
    }
    await this.dashboardRepository.softDelete(id);
  }

  async resolveWorkspaceId(dashboardId: string): Promise<string | null> {
    return this.dashboardRepository.resolveWorkspaceId(dashboardId);
  }
}
