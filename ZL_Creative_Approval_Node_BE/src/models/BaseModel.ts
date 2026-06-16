import { v7 as uuidv7 } from "uuid";
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

@Entity()
export abstract class BaseModel {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @BeforeInsert()
  setId(): void {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  modifiedAt!: Date;
}
