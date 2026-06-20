import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { WorkspaceAdmin } from "../models";

export class WorkspaceAdminRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  // EXPLAIN ANALYZE: SELECT workspace_id FROM workspace_admins WHERE user_id = $1
  async findWorkspaceIdsByUserId(userId: string): Promise<string[]> {
    const rows = await this.getRepo(WorkspaceAdmin)
      .createQueryBuilder("wa")
      .select("wa.workspaceId", "workspaceId")
      .where("wa.userId = :userId", { userId })
      .getRawMany<{ workspaceId: string }>();
    return rows.map((r) => r.workspaceId);
  }

  async exists(userId: string, workspaceId: string): Promise<boolean> {
    const count = await this.getRepo(WorkspaceAdmin).count({
      where: { userId, workspaceId },
    });
    return count > 0;
  }

  async grant(data: {
    userId: string;
    workspaceId: string;
    grantedByUserId: string;
  }): Promise<WorkspaceAdmin> {
    const grant = this.getRepo(WorkspaceAdmin).create(data);
    return this.getRepo(WorkspaceAdmin).save(grant);
  }

  async revoke(userId: string, workspaceId: string): Promise<void> {
    await this.getRepo(WorkspaceAdmin).delete({ userId, workspaceId });
  }

  async listByWorkspace(workspaceId: string): Promise<WorkspaceAdmin[]> {
    return this.getRepo(WorkspaceAdmin).find({
      where: { workspaceId },
      relations: ["user"],
    });
  }
}
