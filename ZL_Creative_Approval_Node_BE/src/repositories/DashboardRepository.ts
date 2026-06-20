import { DataSource, IsNull } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Dashboard } from "../models";

export class DashboardRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async create(data: { workspaceId: string; name: string }): Promise<Dashboard> {
    const dashboard = this.getRepo(Dashboard).create(data);
    return this.getRepo(Dashboard).save(dashboard);
  }

  async findById(id: string): Promise<Dashboard | null> {
    return this.getRepo(Dashboard).findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async resolveWorkspaceId(dashboardId: string): Promise<string | null> {
    const row = await this.getRepo(Dashboard)
      .createQueryBuilder("d")
      .select("d.workspaceId")
      .where("d.id = :id", { id: dashboardId })
      .andWhere("d.deletedAt IS NULL")
      .getOne();
    return row?.workspaceId ?? null;
  }

  async listByWorkspace(workspaceId: string): Promise<Dashboard[]> {
    return this.getRepo(Dashboard).find({
      where: { workspaceId, deletedAt: IsNull() },
      order: { name: "ASC" },
    });
  }

  async listByIds(ids: string[]): Promise<Dashboard[]> {
    if (ids.length === 0) return [];
    return this.getRepo(Dashboard)
      .createQueryBuilder("d")
      .where("d.id IN (:...ids)", { ids })
      .andWhere("d.deletedAt IS NULL")
      .orderBy("d.name", "ASC")
      .getMany();
  }

  async update(id: string, data: { name?: string }): Promise<Dashboard | null> {
    await this.getRepo(Dashboard).update({ id }, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.getRepo(Dashboard).update({ id }, { deletedAt: new Date() });
  }
}
