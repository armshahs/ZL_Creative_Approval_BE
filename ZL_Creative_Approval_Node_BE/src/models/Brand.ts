import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from "typeorm";
import { User, Pod, BaseModel, Currency } from "../models"; // Import User entity

@Entity()
@Index("idx_brand_performance_marketer_id", ["performanceMarketer"])
@Index("idx_brand_pod_id", ["pod"])
@Index("idx_brand_pod_lead_id", ["podLead"])
export class Brand extends BaseModel {
  @Column()
  name!: string;

  @Column({ nullable: true, default: "Australia/Melbourne" })
  timezone?: string; // Store timezone in IANA format (e.g., "America/New_York") Default is Melbourne

  @ManyToOne(() => Currency, (currency) => currency.brands, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "currency_id" })
  currency?: Currency | null;

  // One performance marketer (key user who manages brand performance)
  @ManyToOne(() => User, (user) => user.performanceBrands, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "performance_marketer_id" })
  performanceMarketer?: User | null;

  // One pod is linked based on the performanceMarketer's pod (Optional)
  @ManyToOne(() => Pod, (pod) => pod.brands, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_id" })
  pod?: Pod | null;

  // One pod lead (Renamed from teamLead)
  @ManyToOne(() => User, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_lead_id" }) // Updated JoinColumn name
  podLead?: User | null;

  // A single list for all members (Optional)
  @ManyToMany(() => User, (user) => user.brands, { nullable: true })
  @JoinTable()
  members?: User[];
}
