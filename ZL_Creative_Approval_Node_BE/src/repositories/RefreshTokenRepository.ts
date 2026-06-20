import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { RefreshToken } from "../models";

export class RefreshTokenRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async create(data: {
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    const token = this.getRepo(RefreshToken).create(data);
    return this.getRepo(RefreshToken).save(token);
  }

  // EXPLAIN ANALYZE: SELECT * FROM refresh_tokens WHERE token_hash = $1
  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.getRepo(RefreshToken).findOne({ where: { tokenHash } });
  }

  async revokeById(id: string): Promise<void> {
    await this.getRepo(RefreshToken).update({ id }, { revokedAt: new Date() });
  }

  async revokeFamily(familyId: string): Promise<void> {
    await this.getRepo(RefreshToken)
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date() })
      .where("familyId = :familyId", { familyId })
      .andWhere("revokedAt IS NULL")
      .execute();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.getRepo(RefreshToken)
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date() })
      .where("userId = :userId", { userId })
      .andWhere("revokedAt IS NULL")
      .execute();
  }

  async revokeAllActive(): Promise<void> {
    await this.getRepo(RefreshToken)
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date() })
      .where("revokedAt IS NULL")
      .execute();
  }

  async rotateToken(
    oldTokenId: string,
    newData: {
      userId: string;
      tokenHash: string;
      familyId: string;
      expiresAt: Date;
    },
  ): Promise<RefreshToken> {
    return this.withTransaction(async (manager) => {
      await manager.getRepository(RefreshToken).update(
        { id: oldTokenId },
        { revokedAt: new Date() },
      );
      const newToken = manager.getRepository(RefreshToken).create(newData);
      return manager.getRepository(RefreshToken).save(newToken);
    });
  }
}
