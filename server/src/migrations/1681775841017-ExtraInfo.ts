import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtraInfo1681775841017 implements MigrationInterface {
    name = 'ExtraInfo1681775841017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "extraInfo" character varying`);
        await queryRunner.query(`ALTER TABLE "subject" ADD "extraInfo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject" DROP COLUMN "extraInfo"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "extraInfo"`);
    }

}
