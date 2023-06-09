import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskIncludeTime1686173032369 implements MigrationInterface {
    name = 'TaskIncludeTime1686173032369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "dueDateIncludesTime" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "task" ADD "doDateIncludesTime" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "doDateIncludesTime"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dueDateIncludesTime"`);
    }

}
