import { DataSource } from "typeorm";
import { BaseRepository } from "./BaseRepository";
import { SystemSetting } from "../models";

const SETTINGS_ID = "default";
const EPOCH_START = new Date("1970-01-01T00:00:00.000Z");

export class SystemSettingRepository extends BaseRepository {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  // EXPLAIN ANALYZE: SELECT global_revoke_epoch FROM system_settings WHERE id = 'default'
  async getGlobalRevokeEpoch(): Promise<Date> {
    let setting = await this.getRepo(SystemSetting).findOne({
      where: { id: SETTINGS_ID },
    });
    if (!setting) {
      setting = this.getRepo(SystemSetting).create({
        id: SETTINGS_ID,
        globalRevokeEpoch: EPOCH_START,
      });
      await this.getRepo(SystemSetting).save(setting);
    }
    return setting.globalRevokeEpoch;
  }

  async setGlobalRevokeEpoch(epoch: Date): Promise<void> {
    await this.getRepo(SystemSetting).upsert(
      { id: SETTINGS_ID, globalRevokeEpoch: epoch },
      ["id"],
    );
  }
}
