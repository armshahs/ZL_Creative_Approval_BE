import { Entity, Column, Index, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("login_attempts")
@Index("idx_login_attempts_ip_attempted_at", ["ip", "attemptedAt"])
export class LoginAttempt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  ip!: string;

  @CreateDateColumn()
  attemptedAt!: Date;
}
