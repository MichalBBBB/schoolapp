import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultSchedule1683594929448 implements MigrationInterface {
    name = 'DefaultSchedule1683594929448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" ADD "default" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "default"`);
    }

}
