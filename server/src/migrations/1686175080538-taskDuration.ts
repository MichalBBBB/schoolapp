import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskDuration1686175080538 implements MigrationInterface {
    name = 'TaskDuration1686175080538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "duration" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "duration"`);
    }

}
