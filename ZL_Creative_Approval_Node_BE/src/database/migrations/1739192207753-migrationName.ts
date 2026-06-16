import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739192207753 implements MigrationInterface {
  name = "MigrationName1739192207753";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "idx_role" ON "user" ("role") `);
    await queryRunner.query(`CREATE INDEX "idx_pod_id" ON "user" ("pod_id") `);
    await queryRunner.query(`CREATE INDEX "idx_email" ON "user" ("email") `);
    await queryRunner.query(
      `CREATE INDEX "idx_pod_leader_id" ON "pod" ("pod_leader_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_pod_leader_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_email"`);
    await queryRunner.query(`DROP INDEX "public"."idx_pod_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_role"`);
  }
}
