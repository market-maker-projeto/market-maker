import { MigrationInterface, QueryRunner } from "typeorm";

export class NewUserEntity1673958242960 implements MigrationInterface {
    name = 'NewUserEntity1673958242960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(120) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
