import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739509312692 implements MigrationInterface {
  name = "MigrationName1739509312692";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "timezone" SET DEFAULT 'Australia/Melbourne'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand" ALTER COLUMN "timezone" DROP DEFAULT`,
    );
  }
}
