import { MigrationInterface, QueryRunner } from "typeorm";

export class ShowCalendarView1685501930973 implements MigrationInterface {
    name = 'ShowCalendarView1685501930973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ADD "showCalendarView" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "showCalendarView"`);
    }

}
