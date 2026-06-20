import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { LoginAttempt } from "../models";
import { config } from "../config/config";

export class LoginAttemptRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  async record(ip: string): Promise<void> {
    const attempt = this.getRepo(LoginAttempt).create({ ip });
    await this.getRepo(LoginAttempt).save(attempt);
  }

  // EXPLAIN ANALYZE: SELECT count(*) FROM login_attempts WHERE ip = $1 AND attempted_at > now() - interval '15 minutes'
  async countRecentByIp(ip: string): Promise<number> {
    const windowMinutes = config.auth.authRateLimitWindowMinutes;
    const result = await this.getRepo(LoginAttempt)
      .createQueryBuilder("la")
      .where("la.ip = :ip", { ip })
      .andWhere(`la.attemptedAt > NOW() - INTERVAL '${windowMinutes} minutes'`)
      .getCount();
    return result;
  }

  async deleteOlderThan(days: number): Promise<void> {
    await this.getRepo(LoginAttempt)
      .createQueryBuilder()
      .delete()
      .from(LoginAttempt)
      .where(`attemptedAt < NOW() - INTERVAL '${days} days'`)
      .execute();
  }
}
