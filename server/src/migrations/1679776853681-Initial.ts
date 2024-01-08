import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1679776853681 implements MigrationInterface {
  name = "Initial1679776853681";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "subtask" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "name" character varying NOT NULL, "done" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0cda44ad38dba885bd8ab1afd3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_time" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_fcb091223a7eab0016fb665f6fb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayNumber" integer NOT NULL, "lessonTimeId" uuid NOT NULL, "subjectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "project_task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying, "dueDate" TIMESTAMP, "doDate" TIMESTAMP, "done" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" uuid NOT NULL, CONSTRAINT "PK_f8275249858f42bc01e47cb979d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_project" ("userId" uuid NOT NULL, "projectId" uuid NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "accepted" boolean NOT NULL, CONSTRAINT "PK_2a37107e0b3bdb06b4920a64bbc" PRIMARY KEY ("userId", "projectId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying, "ownerId" uuid NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startOfWeek" character varying NOT NULL DEFAULT 'MON', "lengthOfRotation" integer NOT NULL DEFAULT '5', "skipWeekends" boolean NOT NULL DEFAULT true, "startOfRotationDate" TIMESTAMP NOT NULL, "darkMode" boolean NOT NULL DEFAULT false, "showDoDate" boolean NOT NULL DEFAULT false, "sortTasksBy" character varying NOT NULL DEFAULT 'DATE_ADDED', "showCompletedTasks" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenVersion" integer NOT NULL DEFAULT '0', "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "googleId" character varying, "imageURL" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "settingsId" uuid NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_390395c3d8592e3e8d8422ce85" UNIQUE ("settingsId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying, "dueDate" TIMESTAMP, "doDate" TIMESTAMP, "userId" uuid NOT NULL, "done" boolean NOT NULL DEFAULT false, "subjectId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "minutesBefore" integer NOT NULL, "title" character varying NOT NULL, "body" character varying, "taskId" uuid, "eventId" uuid, "date" TIMESTAMP NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "calendar_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "text" character varying, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "wholeDay" boolean NOT NULL DEFAULT false, "subjectId" uuid, "userId" uuid NOT NULL, CONSTRAINT "PK_176fe24e6eb48c3fef696c7641f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "subject" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid NOT NULL, "colorName" character varying NOT NULL, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`
    );
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
      `ALTER TABLE "subtask" ADD CONSTRAINT "FK_8209040ec2c518c62c70cd382dd" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_time" ADD CONSTRAINT "FK_00242cdf9d34db261af9f31b0b6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_bd5d4de41d253ff621685e3c824" FOREIGN KEY ("lessonTimeId") REFERENCES "lesson_time"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_cd8274b3e5c420f57a14e9b6950" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_a02f19dde5db17193d44681d8ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" ADD CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_cb5415b5e54f476329451212e9b" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" ADD CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_390395c3d8592e3e8d8422ce853" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_eca5b0f2a25014f8bdd97be4808" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_74029a011814fc5e94acfcacba9" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_dad53675d0c3b05d9ee6fe44b1d" FOREIGN KEY ("eventId") REFERENCES "calendar_event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" ADD CONSTRAINT "FK_4581de521b84785315279ad870f" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" ADD CONSTRAINT "FK_791a98103dd3b4cb694b254b972" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "subject" ADD CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" ADD CONSTRAINT "FK_2d1f4db0bb16238c4715b0718d0" FOREIGN KEY ("projectTaskId") REFERENCES "project_task"("id") ON DELETE SET NULL ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" ADD CONSTRAINT "FK_ca564fc487b86a20f1b579cc5d4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" DROP CONSTRAINT "FK_ca564fc487b86a20f1b579cc5d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task_users_user" DROP CONSTRAINT "FK_2d1f4db0bb16238c4715b0718d0"`
    );
    await queryRunner.query(
      `ALTER TABLE "subject" DROP CONSTRAINT "FK_f3d464e642ccfc389de4463d6c9"`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" DROP CONSTRAINT "FK_791a98103dd3b4cb694b254b972"`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" DROP CONSTRAINT "FK_4581de521b84785315279ad870f"`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4"`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_dad53675d0c3b05d9ee6fe44b1d"`
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_74029a011814fc5e94acfcacba9"`
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_eca5b0f2a25014f8bdd97be4808"`
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_390395c3d8592e3e8d8422ce853"`
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP CONSTRAINT "FK_b88a18e4faeea3bce60d70a4ae3"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_project" DROP CONSTRAINT "FK_cb5415b5e54f476329451212e9b"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_task" DROP CONSTRAINT "FK_a81f1f3ca71d469236a55e2bcaa"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_a02f19dde5db17193d44681d8ad"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_cd8274b3e5c420f57a14e9b6950"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_bd5d4de41d253ff621685e3c824"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_time" DROP CONSTRAINT "FK_00242cdf9d34db261af9f31b0b6"`
    );
    await queryRunner.query(
      `ALTER TABLE "subtask" DROP CONSTRAINT "FK_8209040ec2c518c62c70cd382dd"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca564fc487b86a20f1b579cc5d"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d1f4db0bb16238c4715b0718d"`
    );
    await queryRunner.query(`DROP TABLE "project_task_users_user"`);
    await queryRunner.query(`DROP TABLE "subject"`);
    await queryRunner.query(`DROP TABLE "calendar_event"`);
    await queryRunner.query(`DROP TABLE "reminder"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "user_project"`);
    await queryRunner.query(`DROP TABLE "project_task"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "lesson_time"`);
    await queryRunner.query(`DROP TABLE "subtask"`);
  }
}
