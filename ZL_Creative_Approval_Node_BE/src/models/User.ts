import {
  Entity,
  // PrimaryGeneratedColumn,
  Column,
  // CreateDateColumn,
  // UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  ManyToMany,
} from "typeorm";
import { ROLES, RoleType } from "../config";
import { Pod, Brand, BaseModel } from "../models";

@Entity()
@Index("idx_email", ["email"])
@Index("idx_pod_id", ["pod"])
@Index("idx_role", ["role"])
export class User extends BaseModel {
  // @PrimaryGeneratedColumn("uuid")
  // id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "enum", enum: ROLES, default: ROLES.CLIENT })
  role!: RoleType;

  // Multiple users can be members of a single pod
  // One User can belong to only one Pod as a member
  @ManyToOne(() => Pod, (pod) => pod.members, {
    onDelete: "SET NULL",
    nullable: true,
  })
  @JoinColumn({ name: "pod_id" })
  pod?: Pod | null;

  // One User can lead multiple Pods
  // Do not add "Pod[] | null" for onetomany or manytomany relations.
  @OneToMany(() => Pod, (pod) => pod.podLeader, { nullable: true })
  leadPods?: Pod[]; // If the user is a leader, link to the pod leader's pod

  // Many users can have access to multiple brands (Optional). Here the user has access to these brands but may not be the assigned performance marketer.
  @ManyToMany(() => Brand, (brand) => brand.members, { nullable: true })
  brands?: Brand[];

  // List of brands for the user is the assigned performance marketer.
  @OneToMany(() => Brand, (brand) => brand.performanceMarketer, {
    nullable: true,
  })
  performanceBrands?: Brand[];

  // @CreateDateColumn()
  // createdAt!: Date;

  // @UpdateDateColumn()
  // modifiedAt!: Date;
}
