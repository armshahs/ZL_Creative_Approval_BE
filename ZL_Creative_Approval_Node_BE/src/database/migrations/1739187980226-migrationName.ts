import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739187980226 implements MigrationInterface {
  name = "MigrationName1739187980226";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pod" ADD CONSTRAINT "UQ_ea69227c5da6c7d016ba8baba44" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pod" DROP CONSTRAINT "UQ_ea69227c5da6c7d016ba8baba44"`,
    );
  }
}
