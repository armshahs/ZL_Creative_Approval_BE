import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Workspace } from "./Workspace";

@Entity("dashboards")
@Index("idx_dashboards_workspace_id", ["workspaceId"])
export class Dashboard extends BaseModel {
  @Column()
  workspaceId!: string;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace!: Workspace;

  @Column()
  name!: string;

  @Column({ type: "timestamp", nullable: true })
  deletedAt?: Date | null;
}
