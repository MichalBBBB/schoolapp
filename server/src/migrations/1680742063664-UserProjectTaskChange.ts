import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProjectTaskChange1680742063664 implements MigrationInterface {
  name = "UserProjectTaskChange1680742063664";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" DROP CONSTRAINT "FK_ca564fc487b86a20f1b579cc5d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" DROP CONSTRAINT "FK_2d1f4db0bb16238c4715b0718d0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca564fc487b86a20f1b579cc5d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d1f4db0bb16238c4715b0718d"`
    );
    await queryRunner.query(`DROP TABLE "project_task_users_user"`);
    await queryRunner.query(
      `CREATE TABLE "user_project_task" ("userId" uuid NOT NULL, "projectTaskId" uuid NOT NULL, CONSTRAINT "PK_0ad63d5f4ec8295440c5ec72709" PRIMARY KEY ("userId", "projectTaskId"))`
    );

    await queryRunner.query(
      `ALTER TABLE "user_project_task" ADD CONSTRAINT "FK_bb29af9e2d29241297a98657b5b" FOREIGN KEY ("projectTaskId") REFERENCES "project_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project_task" ADD CONSTRAINT "FK_281c9881a9d369465ac5a81c5d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_project_task" DROP CONSTRAINT "FK_281c9881a9d369465ac5a81c5d5"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project_task" DROP CONSTRAINT "FK_bb29af9e2d29241297a98657b5b"`
    );
    await queryRunner.query(`DROP TABLE "user_project_task"`);
    await queryRunner.query(
      `CREATE TABLE "project_task_users_user" ("projectTaskId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_75cf86475d661c93c3d9ced4723" PRIMARY KEY ("projectTaskId", "userId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d1f4db0bb16238c4715b0718d" ON "project_task_users_user" ("projectTaskId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca564fc487b86a20f1b579cc5d" ON "project_task_users_user" ("userId") `
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" ADD CONSTRAINT "FK_2d1f4db0bb16238c4715b0718d0" FOREIGN KEY ("projectTaskId") REFERENCES "project_task"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" ADD CONSTRAINT "FK_ca564fc487b86a20f1b579cc5d4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
