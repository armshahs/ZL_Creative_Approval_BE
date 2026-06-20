import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("system_settings")
export class SystemSetting {
  @PrimaryColumn({ default: "default" })
  id!: string;

  @Column({ type: "timestamp", default: () => "'1970-01-01 00:00:00'" })
  globalRevokeEpoch!: Date;
}
