import { MigrationInterface, QueryRunner } from "typeorm";

export class AppleIdToken1699738593098 implements MigrationInterface {
    name = 'AppleIdToken1699738593098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "appleIdToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "appleIdToken"`);
    }

}
