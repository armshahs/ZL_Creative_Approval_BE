import { Entity, Column, Index } from "typeorm";
import { BaseModel } from "./BaseModel";
import { USER_STATUS, UserStatus } from "../config/constants";

@Entity("users")
@Index("idx_users_email", ["email"])
export class User extends BaseModel {
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: USER_STATUS,
    default: USER_STATUS.ACTIVE,
  })
  status!: UserStatus;

  @Column({ nullable: true })
  resetToken?: string | null;

  @Column({ default: false })
  isSuperadmin!: boolean;

  @Column({ default: false })
  mfaEnabled!: boolean;

  @Column({ nullable: true, select: false })
  mfaSecretEncrypted?: string | null;

  @Column({ type: "int", default: 0 })
  tokenVersion!: number;
}
