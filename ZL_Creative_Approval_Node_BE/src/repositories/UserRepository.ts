import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { User } from "../models";
import { USER_STATUS, UserStatus } from "../config/constants";

export interface UserAuthRow {
  id: string;
  tokenVersion: number;
  isSuperadmin: boolean;
  status: UserStatus;
}

export class UserRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getRepo(User).findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.getRepo(User).findOne({ where: { id } });
  }

  // EXPLAIN ANALYZE: SELECT id, token_version, is_superadmin, status FROM users WHERE id = $1
  async findByIdForAuth(id: string): Promise<UserAuthRow | null> {
    const row = await this.getRepo(User)
      .createQueryBuilder("u")
      .select(["u.id", "u.tokenVersion", "u.isSuperadmin", "u.status"])
      .where("u.id = :id", { id })
      .getOne();
    if (!row) return null;
    return {
      id: row.id,
      tokenVersion: row.tokenVersion,
      isSuperadmin: row.isSuperadmin,
      status: row.status,
    };
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.getRepo(User).findOne({ where: { resetToken: token } });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    status?: UserStatus;
  }): Promise<User> {
    const user = this.getRepo(User).create({
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name,
      status: data.status ?? USER_STATUS.ACTIVE,
    });
    return this.getRepo(User).save(user);
  }

  async createPendingUser(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<User> {
    return this.createUser({ ...data, status: USER_STATUS.PENDING });
  }

  async setResetToken(userId: string, token: string): Promise<void> {
    await this.getRepo(User).update({ id: userId }, { resetToken: token });
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.getRepo(User).update({ id: userId }, { resetToken: null });
  }

  async updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
    await this.getRepo(User).update({ id: userId }, { passwordHash });
  }

  async activateUser(userId: string): Promise<void> {
    await this.getRepo(User).update(
      { id: userId },
      { status: USER_STATUS.ACTIVE, resetToken: null },
    );
  }

  // EXPLAIN ANALYZE: UPDATE users SET token_version = token_version + 1 WHERE id = $1
  async incrementTokenVersion(userId: string): Promise<void> {
    await this.getRepo(User).increment({ id: userId }, "tokenVersion", 1);
  }

  async setSuperadmin(userId: string, isSuperadmin: boolean): Promise<void> {
    await this.getRepo(User).update({ id: userId }, { isSuperadmin });
  }

  async listAll(): Promise<User[]> {
    return this.getRepo(User).find({
      select: ["id", "email", "name", "status", "isSuperadmin", "createdAt"],
      order: { name: "ASC" },
    });
  }

  async updatePasswordAndActivate(
    userId: string,
    passwordHash: string,
    activate: boolean,
  ): Promise<void> {
    await this.getRepo(User).update(
      { id: userId },
      {
        passwordHash,
        resetToken: null,
        ...(activate ? { status: USER_STATUS.ACTIVE } : {}),
      },
    );
  }
}
