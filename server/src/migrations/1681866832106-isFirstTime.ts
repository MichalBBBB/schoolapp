import { MigrationInterface, QueryRunner } from "typeorm";

export class isFirstTime1681866832106 implements MigrationInterface {
    name = 'isFirstTime1681866832106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ADD "isFirstTime" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "isFirstTime"`);
    }

}
