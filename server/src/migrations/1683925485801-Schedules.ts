import { MigrationInterface, QueryRunner } from "typeorm";

export class Schedules1683925485801 implements MigrationInterface {
    name = 'Schedules1683925485801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "default" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "dayNumbers" integer array, "dates" TIMESTAMP array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lesson_time" ADD "scheduleId" uuid`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "dayNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_time" ADD CONSTRAINT "FK_81ce8dc77fdeaf9101b5707f9bc" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_time" DROP CONSTRAINT "FK_81ce8dc77fdeaf9101b5707f9bc"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "dayNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "lesson_time" DROP COLUMN "scheduleId"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
