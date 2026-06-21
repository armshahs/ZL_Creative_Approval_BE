import { Entity, Column, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Dashboard } from "./Dashboard";

@Entity("workspaces")
export class Workspace extends BaseModel {
  @Column()
  name!: string;

  @Column()
  ownerUserId!: string;

  @Column({ default: "trial" })
  plan!: string;

  @Column({ type: "timestamp", nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Dashboard, (dashboard: Dashboard) => dashboard.workspace)
  dashboards?: Dashboard[];
}
