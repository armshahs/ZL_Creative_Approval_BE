import { DataSource, EntityManager, EntityTarget, Repository } from "typeorm";

export abstract class BaseRepository {
  constructor(protected readonly dataSource: DataSource) {}

  protected getRepo<T extends object>(entity: EntityTarget<T>): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  async withTransaction<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(fn);
  }
}
