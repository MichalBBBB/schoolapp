import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationTokens1706197027701 implements MigrationInterface {
    name = 'NotificationTokens1706197027701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tokens" character varying array DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokens"`);
    }

}
