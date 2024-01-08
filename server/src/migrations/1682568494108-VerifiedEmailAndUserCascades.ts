import { MigrationInterface, QueryRunner } from "typeorm";

export class VerifiedEmailAndUserCascades1682568494108
  implements MigrationInterface
{
  name = "VerifiedEmailAndUserCascades1682568494108";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_a02f19dde5db17193d44681d8ad"`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" DROP CONSTRAINT "FK_791a98103dd3b4cb694b254b972"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailVerified" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_a02f19dde5db17193d44681d8ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "calendar_event" ADD CONSTRAINT "FK_791a98103dd3b4cb694b254b972" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendar_event" DROP CONSTRAINT "FK_791a98103dd3b4cb694b254b972"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_a02f19dde5db17193d44681d8ad"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
    await queryRunner.query(
      `ALTER TABLE "calendar_event" ADD CONSTRAINT "FK_791a98103dd3b4cb694b254b972" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_a02f19dde5db17193d44681d8ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
