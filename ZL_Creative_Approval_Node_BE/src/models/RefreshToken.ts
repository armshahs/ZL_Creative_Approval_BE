import { Entity, Column, Index } from "typeorm";
import { BaseModel } from "./BaseModel";

@Entity("refresh_tokens")
@Index("idx_refresh_tokens_token_hash", ["tokenHash"], { unique: true })
@Index("idx_refresh_tokens_family_id", ["familyId"])
export class RefreshToken extends BaseModel {
  @Column()
  userId!: string;

  @Column()
  tokenHash!: string;

  @Column()
  familyId!: string;

  @Column({ type: "timestamp", nullable: true })
  revokedAt?: Date | null;

  @Column({ type: "timestamp" })
  expiresAt!: Date;
}
