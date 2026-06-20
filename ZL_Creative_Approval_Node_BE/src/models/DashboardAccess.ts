import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User";
import { Dashboard } from "./Dashboard";
import {
  DASHBOARD_ACCESS_ROLE,
  DashboardAccessRole,
} from "../config/constants";

@Entity("dashboard_access")
@Index("idx_dashboard_access_user_dashboard", ["userId", "dashboardId"], {
  unique: true,
})
@Index("idx_dashboard_access_user_workspace", ["userId", "workspaceId"])
export class DashboardAccess extends BaseModel {
  @Column()
  userId!: string;

  @Column()
  workspaceId!: string;

  @Column()
  dashboardId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Dashboard)
  @JoinColumn({ name: "dashboardId" })
  dashboard!: Dashboard;

  @Column({ type: "enum", enum: DASHBOARD_ACCESS_ROLE })
  role!: DashboardAccessRole;

  @Column()
  grantedByUserId!: string;
}
