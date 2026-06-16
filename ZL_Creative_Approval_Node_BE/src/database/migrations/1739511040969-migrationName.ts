import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739511040969 implements MigrationInterface {
    name = 'MigrationName1739511040969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand" ADD "currency_id" uuid`);
        await queryRunner.query(`ALTER TABLE "brand" ADD CONSTRAINT "FK_b801a73ab05af716bf8a161052d" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brand" DROP CONSTRAINT "FK_b801a73ab05af716bf8a161052d"`);
        await queryRunner.query(`ALTER TABLE "brand" DROP COLUMN "currency_id"`);
    }

}
