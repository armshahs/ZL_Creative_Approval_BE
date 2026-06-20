import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User";
import { Workspace } from "./Workspace";

@Entity("workspace_admins")
@Index("idx_workspace_admins_user_workspace", ["userId", "workspaceId"], {
  unique: true,
})
export class WorkspaceAdmin extends BaseModel {
  @Column()
  userId!: string;

  @Column()
  workspaceId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: "workspaceId" })
  workspace!: Workspace;

  @Column()
  grantedByUserId!: string;
}
