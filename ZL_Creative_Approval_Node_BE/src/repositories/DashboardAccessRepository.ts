import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { DashboardAccess } from "../models";
import { DashboardAccessRole } from "../config/constants";

export interface DashboardAccessRow {
  dashboardId: string;
  role: DashboardAccessRole;
}

export class DashboardAccessRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  // EXPLAIN ANALYZE: SELECT dashboard_id, role FROM dashboard_access WHERE user_id = $1
  async findAccessByUserId(userId: string): Promise<DashboardAccessRow[]> {
    const rows = await this.getRepo(DashboardAccess)
      .createQueryBuilder("da")
      .select(["da.dashboardId", "da.role"])
      .where("da.userId = :userId", { userId })
      .getMany();
    return rows.map((r) => ({ dashboardId: r.dashboardId, role: r.role }));
  }

  async findWorkspaceIdsByUserId(userId: string): Promise<string[]> {
    const rows = await this.getRepo(DashboardAccess)
      .createQueryBuilder("da")
      .select("DISTINCT da.workspaceId", "workspaceId")
      .where("da.userId = :userId", { userId })
      .getRawMany<{ workspaceId: string }>();
    return rows.map((r) => r.workspaceId);
  }

  async exists(userId: string, dashboardId: string): Promise<boolean> {
    const count = await this.getRepo(DashboardAccess).count({
      where: { userId, dashboardId },
    });
    return count > 0;
  }

  async grant(data: {
    userId: string;
    workspaceId: string;
    dashboardId: string;
    role: DashboardAccessRole;
    grantedByUserId: string;
  }): Promise<DashboardAccess> {
    const grant = this.getRepo(DashboardAccess).create(data);
    return this.getRepo(DashboardAccess).save(grant);
  }

  async revoke(userId: string, dashboardId: string): Promise<void> {
    await this.getRepo(DashboardAccess).delete({ userId, dashboardId });
  }

  async listByWorkspace(workspaceId: string): Promise<DashboardAccess[]> {
    return this.getRepo(DashboardAccess).find({
      where: { workspaceId },
      relations: ["user", "dashboard"],
    });
  }
}
