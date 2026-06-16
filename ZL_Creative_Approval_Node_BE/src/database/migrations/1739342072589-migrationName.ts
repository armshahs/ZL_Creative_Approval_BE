import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739342072589 implements MigrationInterface {
  name = "MigrationName1739342072589";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "performance_marketer_id" uuid, "pod_id" uuid, "pod_lead_id" uuid, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_brand_pod_lead_id" ON "brand" ("pod_lead_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_brand_pod_id" ON "brand" ("pod_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_brand_performance_marketer_id" ON "brand" ("performance_marketer_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "brand_members_user" ("brandId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_f39ea6e8a5af00ef4a902dd45f0" PRIMARY KEY ("brandId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bde4b04fbe510d7924fc069bd0" ON "brand_members_user" ("brandId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91155c15150aa4348e1ef6f41f" ON "brand_members_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD CONSTRAINT "FK_e31a8175f675db0c2fad800e117" FOREIGN KEY ("performance_marketer_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD CONSTRAINT "FK_568c976f3f8b7afb39f978ea8a2" FOREIGN KEY ("pod_id") REFERENCES "pod"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" ADD CONSTRAINT "FK_b1b05650f89a0f625c68cdb4e9c" FOREIGN KEY ("pod_lead_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand_members_user" ADD CONSTRAINT "FK_bde4b04fbe510d7924fc069bd06" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand_members_user" ADD CONSTRAINT "FK_91155c15150aa4348e1ef6f41f8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brand_members_user" DROP CONSTRAINT "FK_91155c15150aa4348e1ef6f41f8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand_members_user" DROP CONSTRAINT "FK_bde4b04fbe510d7924fc069bd06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" DROP CONSTRAINT "FK_b1b05650f89a0f625c68cdb4e9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" DROP CONSTRAINT "FK_568c976f3f8b7afb39f978ea8a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brand" DROP CONSTRAINT "FK_e31a8175f675db0c2fad800e117"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91155c15150aa4348e1ef6f41f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bde4b04fbe510d7924fc069bd0"`,
    );
    await queryRunner.query(`DROP TABLE "brand_members_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_brand_performance_marketer_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_brand_pod_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_brand_pod_lead_id"`);
    await queryRunner.query(`DROP TABLE "brand"`);
  }
}
