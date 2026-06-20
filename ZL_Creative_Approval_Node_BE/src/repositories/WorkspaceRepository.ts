import { DataSource, IsNull } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { Workspace } from "../models";

export class WorkspaceRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async create(data: {
    name: string;
    ownerUserId: string;
    plan?: string;
  }): Promise<Workspace> {
    const workspace = this.getRepo(Workspace).create({
      name: data.name,
      ownerUserId: data.ownerUserId,
      plan: data.plan ?? "trial",
    });
    return this.getRepo(Workspace).save(workspace);
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.getRepo(Workspace).findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByIdIncludingDeleted(id: string): Promise<Workspace | null> {
    return this.getRepo(Workspace).findOne({ where: { id } });
  }

  async listAll(): Promise<Workspace[]> {
    return this.getRepo(Workspace).find({
      where: { deletedAt: IsNull() },
      order: { name: "ASC" },
    });
  }

  async listByIds(ids: string[]): Promise<Workspace[]> {
    if (ids.length === 0) return [];
    return this.getRepo(Workspace)
      .createQueryBuilder("w")
      .where("w.id IN (:...ids)", { ids })
      .andWhere("w.deletedAt IS NULL")
      .orderBy("w.name", "ASC")
      .getMany();
  }

  async update(id: string, data: { name?: string; plan?: string }): Promise<Workspace | null> {
    await this.getRepo(Workspace).update({ id }, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.getRepo(Workspace).update({ id }, { deletedAt: new Date() });
  }
}
