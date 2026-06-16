import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739439907349 implements MigrationInterface {
  name = "MigrationName1739439907349";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency" ADD "conversion_rate" numeric(10,4)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "currency" DROP COLUMN "conversion_rate"`,
    );
  }
}
