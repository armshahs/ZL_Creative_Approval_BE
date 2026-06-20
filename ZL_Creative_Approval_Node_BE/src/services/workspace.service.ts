import {
  WorkspaceRepository,
  WorkspaceAdminRepository,
  DashboardAccessRepository,
} from "../repositories";
import { PermissionsObject } from "../interfaces/auth.interfaces";
import AppError from "../errors/custom-error";

export class WorkspaceService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceAdminRepository: WorkspaceAdminRepository,
    private readonly dashboardAccessRepository: DashboardAccessRepository,
  ) {}

  async listForUser(userId: string, permissions: PermissionsObject) {
    if (permissions.isSuperadmin) {
      return this.workspaceRepository.listAll();
    }

    const dashboardWsIds =
      await this.dashboardAccessRepository.findWorkspaceIdsByUserId(userId);
    const workspaceIdSet = new Set<string>([
      ...permissions.adminWorkspaceIds,
      ...dashboardWsIds,
    ]);

    return this.workspaceRepository.listByIds([...workspaceIdSet]);
  }

  async create(name: string, ownerUserId: string) {
    const workspace = await this.workspaceRepository.create({
      name,
      ownerUserId,
    });
    await this.workspaceAdminRepository.grant({
      userId: ownerUserId,
      workspaceId: workspace.id,
      grantedByUserId: ownerUserId,
    });
    return workspace;
  }

  async getById(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new AppError({
        message: "Workspace not found",
        statusCode: 404,
        code: "WORKSPACE_NOT_FOUND",
      });
    }
    return workspace;
  }

  async update(id: string, data: { name?: string; plan?: string }) {
    const workspace = await this.workspaceRepository.update(id, data);
    if (!workspace) {
      throw new AppError({
        message: "Workspace not found",
        statusCode: 404,
        code: "WORKSPACE_NOT_FOUND",
      });
    }
    return workspace;
  }

  async softDelete(id: string) {
    const workspace = await this.workspaceRepository.findById(id);
    if (!workspace) {
      throw new AppError({
        message: "Workspace not found",
        statusCode: 404,
        code: "WORKSPACE_NOT_FOUND",
      });
    }
    await this.workspaceRepository.softDelete(id);
  }
}
