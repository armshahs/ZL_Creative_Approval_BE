import { Entity, Column, OneToMany } from "typeorm";
import { Brand, BaseModel } from "../models";

@Entity()
export class Currency extends BaseModel {
  @Column({ unique: true })
  code!: string; // e.g., "USD", "EUR"

  @Column()
  name!: string; // e.g., "US Dollar", "Euro"

  @Column()
  symbol!: string; // e.g., "$", "€"

  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  conversion_rate?: number | null; // Conversion rate to base currency (USD)

  @OneToMany(() => Brand, (brand) => brand.currency, {
    nullable: true,
  })
  brands?: Brand[];
}
