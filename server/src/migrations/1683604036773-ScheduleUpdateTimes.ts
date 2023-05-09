import { MigrationInterface, QueryRunner } from "typeorm";

export class ScheduleUpdateTimes1683604036773 implements MigrationInterface {
    name = 'ScheduleUpdateTimes1683604036773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "createdAt"`);
    }

}
