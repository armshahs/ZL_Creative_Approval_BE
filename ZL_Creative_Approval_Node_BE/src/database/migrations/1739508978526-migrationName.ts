import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739508978526 implements MigrationInterface {
  name = "MigrationName1739508978526";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ADD "timezone" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "timezone"`);
  }
}
