import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectTaskDuration1686181827381 implements MigrationInterface {
    name = 'ProjectTaskDuration1686181827381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" ADD "dueDateIncludesTime" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD "doDateIncludesTime" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "project_task" ADD "duration" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "doDateIncludesTime"`);
        await queryRunner.query(`ALTER TABLE "project_task" DROP COLUMN "dueDateIncludesTime"`);
    }

}
