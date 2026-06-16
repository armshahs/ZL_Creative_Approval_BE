import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1739183241322 implements MigrationInterface {
  name = "MigrationName1739183241322";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "resetToken" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'client', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "pod_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pod" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "pod_leader_id" uuid, CONSTRAINT "PK_e0c9781a591a0818882ad6f15a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4d5d88d2849f5ebc8e547c65b55" FOREIGN KEY ("pod_id") REFERENCES "pod"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pod" ADD CONSTRAINT "FK_91e553fd816860891719f57e300" FOREIGN KEY ("pod_leader_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pod" DROP CONSTRAINT "FK_91e553fd816860891719f57e300"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4d5d88d2849f5ebc8e547c65b55"`,
    );
    await queryRunner.query(`DROP TABLE "pod"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
