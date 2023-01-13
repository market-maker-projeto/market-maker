import { hashSync } from "bcryptjs";
import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateAdmin1673618374665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user"(username,password,"isAdm") VALUES('admin','${hashSync(
        "1234",
        10
      )}',true)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
